import type { NextFunction, Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";

export interface AuthPayload {
  sub: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthPayload;
  }
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters long.");
  }

  return secret;
}

export function signToken(username: string): string {
  const expiresIn = (process.env.JWT_EXPIRES_IN ??
    "7d") as SignOptions["expiresIn"];

  return jwt.sign({ sub: username }, getSecret(), { expiresIn });
}

export function verifyToken(token: string): AuthPayload {
  const decoded = jwt.verify(token, getSecret());

  if (typeof decoded === "string" || typeof decoded.sub !== "string") {
    throw new Error("Invalid token payload.");
  }

  return { sub: decoded.sub };
}

/** Protects a route. Expects `Authorization: Bearer <token>`. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authentication required." });
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}