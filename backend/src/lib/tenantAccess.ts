import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import type { PrismaClient } from "@prisma/client";
import { clientFor, controlPrisma, currentTenantId, tenantStorage } from "./prisma.js";
import { decrypt } from "./secretBox.js";
import { ApiError, conflict } from "../utils/ApiError.js";

const DUMMY_HASH = bcrypt.hashSync("not-the-password", 10);
const MAX_FAILED = 5;
const LOCK_MINUTES = 15;

/**
 * Checks a lab admin's email and password against the lab account in the main database
 * (with a lockout after repeated mistakes). Used by the Admin login page and by the
 * normal login page, so the lab account's password is always the one that counts.
 */
export async function verifyLabAdmin(email: string, password: string) {
  const tenant = email ? await controlPrisma.tenant.findUnique({ where: { adminEmail: email } }) : null;
  const now = new Date();

  if (tenant?.lockedUntil && tenant.lockedUntil > now) {
    const minutes = Math.max(1, Math.ceil((tenant.lockedUntil.getTime() - now.getTime()) / 60_000));
    throw new ApiError(423, "ACCOUNT_LOCKED", `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`);
  }

  const ok = await bcrypt.compare(password, tenant?.passwordHash ?? DUMMY_HASH);

  if (!tenant || !ok) {
    if (tenant) {
      const failed = tenant.failedLoginCount + 1;
      const lock = failed >= MAX_FAILED;
      await controlPrisma.tenant.update({
        where: { id: tenant.id },
        data: { failedLoginCount: lock ? 0 : failed, lockedUntil: lock ? new Date(now.getTime() + LOCK_MINUTES * 60_000) : tenant.lockedUntil },
      });
    }
    throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
  }

  if (!tenant.active) throw new ApiError(403, "ACCOUNT_DISABLED", "This lab account has been disabled. Contact the platform administrator.");

  if (tenant.failedLoginCount > 0 || tenant.lockedUntil) {
    await controlPrisma.tenant.update({ where: { id: tenant.id }, data: { failedLoginCount: 0, lockedUntil: null } });
  }

  return tenant;
}

const sha256 = (value: string) => crypto.createHash("sha256").update(value).digest("hex");

/** Adds a connection limit so many labs cannot exhaust the server. */
export const withPool = (url: string) =>
  url.includes("connection_limit") ? url : `${url}${url.includes("?") ? "&" : "?"}connection_limit=5`;

// ---------------------------------------------------------------------
// A lab's database client (loaded from the main database, cached briefly)
// ---------------------------------------------------------------------
const loaded = new Map<number, { client: PrismaClient; until: number }>();

export const forgetTenant = (tenantId: number) => loaded.delete(tenantId);

export async function tenantClient(tenantId: number): Promise<PrismaClient> {
  const hit = loaded.get(tenantId);
  if (hit && hit.until > Date.now()) return hit.client;

  const tenant = await controlPrisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant || !tenant.active) {
    throw new ApiError(403, "LAB_DISABLED", "This lab account is disabled. Contact the platform administrator.");
  }
  if (!tenant.dbUrlEncrypted) {
    throw new ApiError(409, "LAB_NOT_CONNECTED", "This lab has not connected its database yet. The admin must sign in on the Admin login page first.");
  }

  const client = clientFor(tenantId, withPool(decrypt(tenant.dbUrlEncrypted)));
  loaded.set(tenantId, { client, until: Date.now() + 30_000 });
  return client;
}

/** Runs `work` against a lab's database. */
export async function runInTenant<T>(tenantId: number, work: () => Promise<T>): Promise<T> {
  const client = await tenantClient(tenantId);
  return tenantStorage.run({ tenantId, client }, work);
}

// ---------------------------------------------------------------------
// Which lab does a token / an e-mail belong to?
// ---------------------------------------------------------------------
const sessions = new Map<string, { tenantId: number; expiresAt: number }>();

export async function recordTenantSession(token: string, expiresAt: Date) {
  const tenantId = currentTenantId();
  if (!tenantId) return; // a lab that existed before multi-lab: nothing to record

  const tokenHash = sha256(token);
  await controlPrisma.tenantSession.create({ data: { tokenHash, tenantId, expiresAt } });
  sessions.set(tokenHash, { tenantId, expiresAt: expiresAt.getTime() });

  void controlPrisma.tenantSession.deleteMany({ where: { expiresAt: { lt: new Date() } } }).catch(() => {});
}

export async function tenantIdForToken(token: string): Promise<number | null> {
  const tokenHash = sha256(token);

  const hit = sessions.get(tokenHash);
  if (hit) {
    if (hit.expiresAt > Date.now()) return hit.tenantId;
    sessions.delete(tokenHash);
  }

  const row = await controlPrisma.tenantSession.findUnique({ where: { tokenHash } });
  if (!row || row.expiresAt <= new Date()) return null;

  sessions.set(tokenHash, { tenantId: row.tenantId, expiresAt: row.expiresAt.getTime() });
  return row.tenantId;
}

export async function findLoginTenant(email: string) {
  const admin = await controlPrisma.tenant.findUnique({ where: { adminEmail: email }, select: { id: true } });
  if (admin) return { tenantId: admin.id, isAdmin: true };

  const row = await controlPrisma.tenantUser.findUnique({ where: { email } });
  return row ? { tenantId: row.tenantId, isAdmin: false } : null;
}

// ---------------------------------------------------------------------
// E-mail directory: keeps each login e-mail tied to one lab
// ---------------------------------------------------------------------
/** Call when a login e-mail is created inside a lab. Does nothing outside a lab. */
export async function registerLogin(email: string) {
  const tenantId = currentTenantId();
  if (!tenantId) return;

  const existing = await controlPrisma.tenantUser.findUnique({ where: { email } });
  if (existing && existing.tenantId !== tenantId) throw conflict("This email is already used by another lab.", "DUPLICATE_EMAIL");
  if (!existing) await controlPrisma.tenantUser.create({ data: { email, tenantId } });
}

export async function unregisterLogin(email: string) {
  const tenantId = currentTenantId();
  if (!tenantId) return;
  await controlPrisma.tenantUser.deleteMany({ where: { email, tenantId } });
}