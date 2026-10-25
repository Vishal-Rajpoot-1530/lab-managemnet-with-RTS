import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";
import * as auth from "../services/authService.js";
import { badRequest } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const r = Router();

// Max 10 login attempts per 15 minutes per IP.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Try again later.", error: "Too many login attempts. Try again later.", code: "RATE_LIMITED" },
});

/** POST /api/auth/login  { email | identity, password } -> { token, user } */
r.post("/login", loginLimiter, asyncHandler(async (req, res) => {
  const identity = req.body?.email ?? req.body?.identity;
  const password = req.body?.password;

  if (typeof identity !== "string" || typeof password !== "string" || !identity.trim() || !password) {
    throw badRequest("Email and password are required.");
  }

  res.json(await auth.login(identity, password, { ipAddress: req.ip, userAgent: req.get("user-agent") }));
}));

/** GET /api/auth/me - also used by the frontend to check a stored token. */
r.get("/me", requireAuth, asyncHandler(async (req, res) => {
  res.json({ user: auth.publicUser(await auth.currentUser(req.auth!.id)) });
}));

r.post("/logout", requireAuth, asyncHandler(async (req, res) => {
  await auth.logout(req.auth!.sessionId);
  res.json({ ok: true });
}));

export default r;
