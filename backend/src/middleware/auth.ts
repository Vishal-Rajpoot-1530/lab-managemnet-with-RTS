import type { NextFunction, Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";

interface TokenPayload {
  sid: string;
}

/** Signs a login token. Returns the token and when it stops working. */
export function signToken(
  userId: number,
  sessionId: string,
): { token: string; expiresAt: Date } {
  const token = jwt.sign({ sid: sessionId }, env.jwtSecret, {
    subject: String(userId),
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  });

  const decoded = jwt.decode(token) as { exp?: number } | null;
  const expiresAt = decoded?.exp
    ? new Date(decoded.exp * 1000)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return { token, expiresAt };
}

const TOUCH_AFTER_MS = 5 * 60 * 1000;

/**
 * Protects a route. Needs `Authorization: Bearer <token>`.
 * The token must belong to a live (not logged-out, not expired) session in MySQL.
 */
export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const [scheme, token] = (req.headers.authorization ?? "").split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    throw new ApiError(401, "UNAUTHORIZED", "Authentication required.");
  }

  let payload: jwt.JwtPayload;

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    if (typeof decoded === "string") throw new Error("bad payload");
    payload = decoded;
  } catch {
    throw new ApiError(401, "INVALID_TOKEN", "Invalid or expired token.");
  }

  const sid = (payload as jwt.JwtPayload & Partial<TokenPayload>).sid;
  const userId = Number(payload.sub);

  if (!sid || !Number.isInteger(userId)) {
    throw new ApiError(401, "INVALID_TOKEN", "Invalid or expired token.");
  }

  const session = await prisma.authSession.findUnique({
    where: { tokenId: sid },
    include: { user: true },
  });

  const now = new Date();

  if (
    !session ||
    session.userId !== userId ||
    session.revokedAt ||
    session.expiresAt <= now ||
    !session.user.active
  ) {
    throw new ApiError(401, "SESSION_ENDED", "Your session has ended. Please log in again.");
  }

  if (!session.lastSeenAt || now.getTime() - session.lastSeenAt.getTime() > TOUCH_AFTER_MS) {
    // Best effort; never fail the request because of this.
    prisma.authSession
      .update({ where: { id: session.id }, data: { lastSeenAt: now } })
      .catch(() => undefined);
  }

  req.auth = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
    sessionId: sid,
  };

  next();
}

/** Use after requireAuth. Example: requireRole("owner"). */
export const requireRole =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      throw new ApiError(403, "FORBIDDEN", "You do not have permission to do this.");
    }
    next();
  };

/** Name to store in "created by" / activity columns. */
export const actorName = (req: Request): string => req.auth?.name ?? "System";
