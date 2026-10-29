import crypto from "node:crypto";
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import type { PrismaClient } from "@prisma/client";
import type { Tenant } from "../generated/control/index.js";
import { clientFor, controlPrisma, dropClient } from "../lib/prisma.js";
import { decrypt, encrypt } from "../lib/secretBox.js";
import { forgetTenant, runInTenant, withPool } from "../lib/tenantAccess.js";
import { ApiError, badRequest, conflict, notFound } from "../utils/ApiError.js";
import { asBody, isEmail, reqText, text } from "../utils/validate.js";
import { setupLabDefaults } from "../bootstrap.js";
import { login as loginUser, type LoginContext } from "./authService.js";
import { splitName } from "./patientService.js";

const run = promisify(execFile);
const DUMMY_HASH = bcrypt.hashSync("not-the-password", 10);
const MAX_FAILED = 5;
const LOCK_MINUTES = 15;

// =====================================================================
// SUPER ADMIN (you)
// =====================================================================
const superSecret = () => {
  const secret = process.env.SUPER_ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error("SUPER_ADMIN_JWT_SECRET must be set in .env (at least 32 random characters).");
  return secret;
};

const superFailures = new Map<string, { count: number; until: number }>();

export async function superAdminLogin(input: unknown) {
  const body = asBody(input);
  const email = text(body.email, 190).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  const lock = superFailures.get(email);
  if (lock && lock.until > Date.now()) throw new ApiError(423, "ACCOUNT_LOCKED", "Too many failed attempts. Try again in a few minutes.");

  const admin = email ? await controlPrisma.superAdmin.findUnique({ where: { email } }) : null;
  const ok = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);

  if (!admin || !ok || !admin.active) {
    const count = (lock?.count ?? 0) + 1;
    superFailures.set(email, { count, until: count >= MAX_FAILED ? Date.now() + LOCK_MINUTES * 60_000 : 0 });
    throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
  }

  superFailures.delete(email);
  const token = jwt.sign({ sub: admin.id, typ: "super" }, superSecret(), { expiresIn: "8h" });
  return { token, admin: { id: admin.id, name: admin.name, email: admin.email } };
}

/** Protects the /super-admin routes. Uses its own secret, so a lab token can never pass. */
export async function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = (req.headers.authorization ?? "").replace(/^Bearer\s+/i, "").trim();
    const payload = jwt.verify(token, superSecret());
    if (typeof payload === "string" || payload.typ !== "super") throw new Error("wrong token type");

    const admin = await controlPrisma.superAdmin.findUnique({ where: { id: Number(payload.sub) } });
    if (!admin || !admin.active) throw new Error("inactive");

    res.locals.superAdmin = admin;
    next();
  } catch {
    next(new ApiError(401, "UNAUTHORIZED", "Please sign in to the Super admin panel."));
  }
}

// =====================================================================
// LAB ACCOUNTS (created by the super admin)
// =====================================================================
const serializeTenant = (t: Tenant) => ({
  id: t.id,
  labName: t.labName,
  adminName: t.adminName,
  adminEmail: t.adminEmail,
  active: t.active,
  connected: Boolean(t.dbUrlEncrypted),
  dbHost: t.dbHost ?? "",
  connectedAt: t.connectedAt?.toISOString() ?? null,
  lastLoginAt: t.lastLoginAt?.toISOString() ?? null,
  createdAt: t.createdAt.toISOString(),
});

const passwordOf = (value: unknown) => {
  const password = typeof value === "string" ? value : "";
  if (password.length < 8) throw badRequest("Password must be at least 8 characters.");
  if (password.length > 72) throw badRequest("Password must be 72 characters or fewer.");
  return password;
};

export async function listTenants() {
  return (await controlPrisma.tenant.findMany({ orderBy: { id: "desc" } })).map(serializeTenant);
}

export async function createTenant(input: unknown) {
  const body = asBody(input);
  const adminName = reqText(body.adminName, "Admin name");
  const labName = reqText(body.labName, "Lab name");
  const email = reqText(body.email, "Email", 190).toLowerCase();
  const password = passwordOf(body.password);

  if (!isEmail(email)) throw badRequest("Enter a valid email address.");

  const taken =
    (await controlPrisma.tenant.findUnique({ where: { adminEmail: email } })) ||
    (await controlPrisma.tenantUser.findUnique({ where: { email } }));
  if (taken) throw conflict("This email is already used by another account.", "DUPLICATE_EMAIL");

  const passwordHash = await bcrypt.hash(password, 12);

  const tenant = await controlPrisma.$transaction(async (tx) => {
    const created = await tx.tenant.create({ data: { labName, adminName, adminEmail: email, passwordHash } });
    await tx.tenantUser.create({ data: { email, tenantId: created.id } });
    return created;
  });

  return serializeTenant(tenant);
}

export async function updateTenant(tenantId: number, input: unknown) {
  const base = await controlPrisma.tenant.findUnique({ where: { id: tenantId } });
  if (!base) throw notFound("Lab account");

  const body = asBody(input);
  const password = body.password ? passwordOf(body.password) : "";

  const row = await controlPrisma.tenant.update({
    where: { id: tenantId },
    data: {
      ...(body.labName !== undefined ? { labName: reqText(body.labName, "Lab name") } : {}),
      ...(body.adminName !== undefined ? { adminName: reqText(body.adminName, "Admin name") } : {}),
      ...(body.active !== undefined ? { active: Boolean(body.active) } : {}),
      ...(password ? { passwordHash: await bcrypt.hash(password, 12), failedLoginCount: 0, lockedUntil: null } : {}),
    },
  });

  forgetTenant(tenantId); // a disabled lab is cut off right away
  return serializeTenant(row);
}

/** Removes the lab account. The lab's own database is NOT touched. */
export async function removeTenant(tenantId: number) {
  const result = await controlPrisma.tenant.deleteMany({ where: { id: tenantId } });
  if (!result.count) throw notFound("Lab account");
  forgetTenant(tenantId);
  await dropClient(tenantId);
}

// =====================================================================
// ADMIN LOGIN (email + password + database URL)
// =====================================================================
const fingerprintOf = (u: URL) =>
  crypto.createHash("sha256").update(`${u.hostname}:${u.port || "3306"}/${u.pathname.slice(1)}`.toLowerCase()).digest("hex");

function parseDatabaseUrl(raw: string) {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw badRequest("That is not a valid database URL. Example: mysql://user:password@host:3306/database (special characters in the password must be URL-encoded).");
  }
  if (url.protocol !== "mysql:") throw badRequest("Only MySQL database URLs (mysql://...) are supported.");
  if (!url.hostname || url.pathname.length <= 1) throw badRequest("The database URL must include a host and a database name.");

  return { url, fingerprint: fingerprintOf(url), host: `${url.hostname}:${url.port || "3306"}${url.pathname}` };
}

/** Creates the tables when the database is empty (uses your Prisma migrations). */
async function provisionDatabase(databaseUrl: string) {
  // Always the LAB schema (prisma/schema.prisma), never the main database's schema.
  const hasMigrations = fs.existsSync(path.join(process.cwd(), "prisma", "migrations"));
  const args = hasMigrations
    ? ["prisma", "migrate", "deploy", "--schema", "prisma/schema.prisma"]
    : ["prisma", "db", "push", "--skip-generate", "--schema", "prisma/schema.prisma"];

  try {
    await run(process.platform === "win32" ? "npx.cmd" : "npx", args, {
      cwd: process.cwd(),
      env: { ...process.env, LAB_DATABASE_URL: databaseUrl },
      timeout: 180_000,
      shell: process.platform === "win32",
    });
  } catch (err) {
    const detail = String((err as { stderr?: string }).stderr || (err as Error).message).split("\n").slice(-6).join(" ").trim();
    throw new ApiError(500, "DB_SETUP_FAILED", `Connected to the database, but creating the tables failed. ${detail}`);
  }
}

async function prepareDatabase(client: PrismaClient, databaseUrl: string) {
  try {
    await client.$queryRaw`SELECT 1`;
  } catch {
    throw new ApiError(400, "DB_CONNECT_FAILED", "Could not connect to that database. Check the URL, user and password, and that the database server accepts connections from this application.");
  }

  const rows = await client.$queryRaw<{ c: bigint | number }[]>`
    SELECT COUNT(*) AS c FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users'`;
  if (!Number(rows[0]?.c ?? 0)) await provisionDatabase(databaseUrl);
}

/** Makes sure the admin has an Account owner login inside the lab's own database. */
async function ensureOwner(client: PrismaClient, tenant: Tenant) {
  const existing = await client.user.findUnique({ where: { email: tenant.adminEmail } });

  if (existing) {
    // The password on the lab account is the one that counts; keep the lab database in step with it.
    await client.user.update({
      where: { id: existing.id },
      data: { passwordHash: tenant.passwordHash, role: "owner", active: true, failedLoginCount: 0, lockedUntil: null },
    });
    return;
  }

  const split = splitName(tenant.adminName);

  await client.$transaction(async (tx) => {
    const employee = await tx.employee.create({
      data: {
        name: tenant.adminName,
        firstName: split.firstName || null,
        lastName: split.lastName || null,
        email: tenant.adminEmail,
        role: "Account owner",
        active: true,
        isOwner: true,
        permissions: ["all"],
      },
    });

    await tx.user.create({
      data: { employeeId: employee.id, name: tenant.adminName, email: tenant.adminEmail, passwordHash: tenant.passwordHash, role: "owner" },
    });

    if (!(await tx.labProfile.findUnique({ where: { id: 1 } }))) {
      await tx.labProfile.create({ data: { id: 1, name: tenant.labName } });
    }
  });
}

export async function adminLogin(input: unknown, ctx: LoginContext) {
  const body = asBody(input);
  const email = text(body.email, 190).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  const databaseUrl = text(body.databaseUrl, 2000);

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

  // --- which database? (typed now, or the one saved from an earlier sign-in)
  let rawUrl = databaseUrl;
  if (!rawUrl) {
    if (!tenant.dbUrlEncrypted) throw badRequest("Enter your database URL to connect your lab.");
    rawUrl = decrypt(tenant.dbUrlEncrypted);
  }
  const target = parseDatabaseUrl(rawUrl);

  // The platform's own database can never be a lab database.
  let mainFingerprint: string | null = null;
  try {
    mainFingerprint = fingerprintOf(new URL(process.env.DATABASE_URL ?? ""));
  } catch {
    // DATABASE_URL is not a plain URL; nothing to compare with.
  }
  if (mainFingerprint && mainFingerprint === target.fingerprint) {
    throw badRequest("That database cannot be used. Please use your own database.");
  }

  const sharedWith = await controlPrisma.tenant.findFirst({ where: { dbFingerprint: target.fingerprint, id: { not: tenant.id } }, select: { id: true } });
  if (sharedWith) throw conflict("This database is already connected to another lab.");

  // --- connect, create the tables if the database is empty, make sure the admin exists
  const client = clientFor(tenant.id, withPool(rawUrl));
  await prepareDatabase(client, rawUrl);
  await ensureOwner(client, tenant);
  // Default lab data (input types, "Main" centre, billing settings, ...). Old bills are
  // back-filled only the first time a database is connected.
  await setupLabDefaults(client, { backfill: Boolean(databaseUrl) || !tenant.dbUrlEncrypted });

  await controlPrisma.tenant.update({
    where: { id: tenant.id },
    data: {
      failedLoginCount: 0,
      lockedUntil: null,
      lastLoginAt: now,
      ...(databaseUrl || !tenant.dbUrlEncrypted
        ? { dbUrlEncrypted: encrypt(rawUrl), dbHost: target.host, dbFingerprint: target.fingerprint, connectedAt: now }
        : {}),
    },
  });
  forgetTenant(tenant.id);

  // --- sign in as the lab's Account owner (the normal login, inside the lab's database)
  const session = await runInTenant(tenant.id, () => loginUser(tenant.adminEmail, password, ctx));
  return { ...session, lab: { id: tenant.id, name: tenant.labName } };
}