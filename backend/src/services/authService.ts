import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../middleware/auth.js";
import { ApiError, badRequest, conflict } from "../utils/ApiError.js";
import { isEmail, optText, reqText, text } from "../utils/validate.js";

const MAX_FAILED_LOGINS = 5;
const LOCK_MINUTES = 15;

// Computed once, so an unknown e-mail takes as long as a wrong password.
const DUMMY_HASH = bcrypt.hashSync("not-the-password", 10);

export interface LoginContext {
  ipAddress?: string;
  userAgent?: string;
}

export const roleLabel = (role: string): string =>
  role === "owner" ? "Lab owner" : role.charAt(0).toUpperCase() + role.slice(1);

export function publicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile ?? "",
    role: user.role,
    employeeId: user.employeeId,
  };
}

/** identity = e-mail or mobile number. */
export async function login(identity: string, password: string, ctx: LoginContext) {
  const value = identity.trim();
  const byEmail = value.includes("@");
  const normalized = byEmail ? value.toLowerCase() : value.replace(/\D/g, "");

  const user = normalized
    ? await prisma.user.findFirst({
        where: byEmail ? { email: normalized } : { mobile: normalized },
      })
    : null;

  const now = new Date();

  if (user?.lockedUntil && user.lockedUntil > now) {
    const minutes = Math.max(
      1,
      Math.ceil((user.lockedUntil.getTime() - now.getTime()) / 60000),
    );
    throw new ApiError(
      423,
      "ACCOUNT_LOCKED",
      `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    );
  }

  const passwordOk = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !passwordOk) {
    if (user) {
      const failed = user.failedLoginCount + 1;
      const lock = failed >= MAX_FAILED_LOGINS;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginCount: lock ? 0 : failed,
          lockedUntil: lock
            ? new Date(now.getTime() + LOCK_MINUTES * 60000)
            : user.lockedUntil,
        },
      });
    }

    throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
  }

  if (!user.active) {
    throw new ApiError(403, "ACCOUNT_DISABLED", "This account has been disabled.");
  }

  const sessionId = crypto.randomUUID();
  const { token, expiresAt } = signToken(user.id, sessionId);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: now },
    }),
    prisma.authSession.create({
      data: {
        userId: user.id,
        tokenId: sessionId,
        userAgent: optText(ctx.userAgent, 500),
        ipAddress: optText(ctx.ipAddress, 64),
        lastSeenAt: now,
        expiresAt,
      },
    }),
  ]);

  return { token, user: publicUser(user) };
}

export async function logout(sessionId: string): Promise<void> {
  await prisma.authSession.updateMany({
    where: { tokenId: sessionId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function currentUser(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(401, "UNAUTHORIZED", "User no longer exists.");
  return user;
}

export async function getProfile(userId: number) {
  const user = await currentUser(userId);
  return {
    fullName: user.name,
    email: user.email,
    phone: user.mobile ?? "",
    role: roleLabel(user.role),
  };
}

export async function updateProfile(
  userId: number,
  body: { fullName?: unknown; email?: unknown; phone?: unknown },
) {
  const user = await currentUser(userId);

  const name = body.fullName === undefined ? user.name : reqText(body.fullName, "Full name");
  const email =
    body.email === undefined || text(body.email) === ""
      ? user.email
      : text(body.email, 190).toLowerCase();
  const mobile =
    body.phone === undefined
      ? user.mobile
      : (text(body.phone, 20).replace(/\D/g, "") || null);

  if (!isEmail(email)) throw badRequest("Enter a valid email address.");

  const taken = await prisma.user.findFirst({
    where: {
      id: { not: userId },
      OR: [{ email }, ...(mobile ? [{ mobile }] : [])],
    },
    select: { id: true },
  });

  if (taken) throw conflict("That email or phone number is already used by another account.");

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: userId }, data: { name, email, mobile } });

    // Keep the linked employee row in step with the login.
    if (user.employeeId) {
      await tx.employee.updateMany({
        where: { id: user.employeeId },
        data: { name, email, mobile },
      });
    }
  });

  return getProfile(userId);
}

export async function changePassword(
  userId: number,
  sessionId: string,
  body: { currentPassword?: unknown; newPassword?: unknown },
): Promise<void> {
  const current = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const next = typeof body.newPassword === "string" ? body.newPassword : "";

  if (next.length < 8) throw badRequest("Your new password must contain at least 8 characters.");
  if (next.length > 72) throw badRequest("Password must be 72 characters or fewer.");
  if (next === current) {
    throw badRequest("Choose a new password different from your current password.");
  }

  const user = await currentUser(userId);

  if (!(await bcrypt.compare(current, user.passwordHash))) {
    throw new ApiError(400, "WRONG_PASSWORD", "Your current password is incorrect.");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { passwordHash: await bcrypt.hash(next, 10) },
    }),
    // Every other browser has to log in again.
    prisma.authSession.updateMany({
      where: { userId, tokenId: { not: sessionId }, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);
}

export async function listSessions(userId: number, currentSessionId: string) {
  const rows = await prisma.authSession.findMany({
    where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    userAgent: row.userAgent ?? "",
    ipAddress: row.ipAddress ?? "",
    createdAt: row.createdAt.toISOString(),
    lastSeenAt: row.lastSeenAt?.toISOString() ?? null,
    current: row.tokenId === currentSessionId,
  }));
}

export async function revokeSession(userId: number, sessionRowId: number) {
  const result = await prisma.authSession.updateMany({
    where: { id: sessionRowId, userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  if (!result.count) throw new ApiError(404, "NOT_FOUND", "Session not found.");
}

export async function revokeOtherSessions(userId: number, currentSessionId: string) {
  const result = await prisma.authSession.updateMany({
    where: { userId, tokenId: { not: currentSessionId }, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return result.count;
}
