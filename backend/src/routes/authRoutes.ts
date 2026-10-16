
import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { requireAuth, signToken } from "./auth.middleware.js";

const r = Router();

// Max 10 login attempts per 15 minutes per IP.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." },
});

// Computed once, so a wrong email takes as long as a wrong password.
const DUMMY_HASH = bcrypt.hashSync("not-the-password", 10);

const normalizeEmail = (value: string) => value.trim().toLowerCase();

/**
 * POST /api/auth/login
 * body: { email, password }
 * returns: { token, user: { email } }
 */
r.post("/login", loginLimiter, async (req, res) => {
  const email = req.body?.email;
  const password = req.body?.password;

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    console.error("ADMIN_EMAIL / ADMIN_PASSWORD_HASH are not configured.");
    return res.status(500).json({ error: "Server is not configured." });
  }

  const emailMatches = normalizeEmail(email) === normalizeEmail(adminEmail);
  const passwordMatches = await bcrypt.compare(
    password,
    emailMatches ? adminPasswordHash : DUMMY_HASH,
  );

  if (!emailMatches || !passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const userEmail = normalizeEmail(adminEmail);

  return res.json({
    token: signToken(userEmail),
    user: { email: userEmail },
  });
});

/** GET /api/auth/me - returns the logged-in user (use it to validate a stored token). */
r.get("/me", requireAuth, (req, res) => {
  res.json({ user: { email: req.user!.sub } });
});

/**
 * POST /api/auth/logout
 * Tokens are stateless, so the client just deletes its stored token.
 */
r.post("/logout", requireAuth, (_req, res) => {
  res.json({ ok: true });
});

export default r;