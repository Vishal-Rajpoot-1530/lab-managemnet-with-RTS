
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import * as auth from "../services/authService.js";
import * as extras from "../services/labExtrasService.js";
import * as manage from "../services/manageService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { idParam } from "../utils/validate.js";

const r = Router();

/**
 * Who may change employees, doctor logins and lab details is decided inside the
 * service (assertAdmin: login role "owner" or "admin"), so no role middleware is
 * needed on those routes. Each service call gets the logged-in user's id.
 */

/** Keeps doctor logins away from staff-only pages. */
const staffOnly = asyncHandler(async (req, _res, next) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.id }, select: { role: true } });
  if (user?.role === "doctor") throw new ApiError(403, "FORBIDDEN", "Doctor accounts cannot use this area.");
  next();
});

// ---- employees
r.get("/employees", staffOnly, asyncHandler(async (_req, res) => res.json({ items: await manage.listEmployees() })));
r.get("/employees/:id", staffOnly, asyncHandler(async (req, res) => res.json(await manage.getEmployee(idParam(req.params.id)))));
r.post("/employees", asyncHandler(async (req, res) => res.status(201).json(await manage.createEmployee(req.body, req.auth!.id))));
r.patch("/employees/:id", asyncHandler(async (req, res) =>
  res.json(await manage.updateEmployee(idParam(req.params.id), req.body, req.auth!.id))));
r.put("/employees/:id/permissions", asyncHandler(async (req, res) =>
  res.json(await manage.setEmployeePermissions(idParam(req.params.id), req.body?.permissions, req.auth!.id))));

// ---- my account
r.get("/profile", asyncHandler(async (req, res) => res.json({ profile: await auth.getProfile(req.auth!.id) })));
r.put("/profile", asyncHandler(async (req, res) => res.json({ success: true, profile: await auth.updateProfile(req.auth!.id, req.body ?? {}) })));
r.put("/change-password", asyncHandler(async (req, res) => {
  await auth.changePassword(req.auth!.id, req.auth!.sessionId, req.body ?? {});
  res.json({ success: true, message: "Password updated." });
}));

// ---- browser security (logged-in devices)
r.get("/sessions", asyncHandler(async (req, res) => res.json({ items: await auth.listSessions(req.auth!.id, req.auth!.sessionId) })));
r.delete("/sessions", asyncHandler(async (req, res) =>
  res.json({ success: true, revoked: await auth.revokeOtherSessions(req.auth!.id, req.auth!.sessionId) })));
r.delete("/sessions/:id", asyncHandler(async (req, res) => {
  await auth.revokeSession(req.auth!.id, idParam(req.params.id));
  res.json({ success: true });
}));

// ---- lab details
r.get("/lab-account", staffOnly, asyncHandler(async (_req, res) => res.json({ lab: await manage.getLabAccount() })));
r.put("/lab-account", asyncHandler(async (req, res) =>
  res.json({ success: true, lab: await manage.saveLabAccount(req.body, req.auth!.id) })));
r.post("/labs", asyncHandler(async (req, res) =>
  res.status(201).json({ success: true, lab: await manage.createLab(req.body, req.auth!.id) })));

// ---- preferences and referral program
r.get("/email-preferences", asyncHandler(async (req, res) => res.json({ preferences: await manage.getEmailPreferences(req.auth!.id) })));
r.put("/email-preferences", asyncHandler(async (req, res) =>
  res.json({ success: true, preferences: await manage.saveEmailPreferences(req.auth!.id, req.body) })));
r.get("/referrals", staffOnly, asyncHandler(async (_req, res) => res.json({ referral: await manage.getReferralProgram() })));
r.post("/referrals", staffOnly, asyncHandler(async (req, res) => res.status(201).json({ referral: await manage.inviteReferral(req.body) })));

// ---- doctor access (admin only, checked in the service)
r.get("/doctor-access", asyncHandler(async (req, res) => res.json({ items: await manage.listDoctorAccess(req.auth!.id) })));
r.post("/doctor-access", asyncHandler(async (req, res) => res.status(201).json(await manage.createDoctorAccess(req.body, req.auth!.id))));
r.patch("/doctor-access/:id", asyncHandler(async (req, res) =>
  res.json(await manage.updateDoctorAccess(idParam(req.params.id), req.body, req.auth!.id))));
r.delete("/doctor-access/:id", asyncHandler(async (req, res) => {
  await manage.removeDoctorAccess(idParam(req.params.id), req.auth!.id);
  res.status(204).end();
}));

// ---- support
r.get("/support-tickets", staffOnly, asyncHandler(async (_req, res) => res.json({ items: await extras.listTickets() })));
r.post("/support-tickets", staffOnly, asyncHandler(async (req, res) =>
  res.status(201).json(await extras.createTicket(req.body, { name: req.auth!.name, email: req.auth!.email }))));

export default r;