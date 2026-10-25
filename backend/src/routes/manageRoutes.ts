import { Router } from "express";
import { requireRole } from "../middleware/auth.js";
import * as auth from "../services/authService.js";
import * as extras from "../services/labExtrasService.js";
import * as manage from "../services/manageService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { idParam } from "../utils/validate.js";

const r = Router();
const owner = requireRole("owner");

// ---- employees
r.get("/employees", asyncHandler(async (_req, res) => res.json({ items: await manage.listEmployees() })));
r.get("/employees/:id", asyncHandler(async (req, res) => res.json(await manage.getEmployee(idParam(req.params.id)))));
r.post("/employees", owner, asyncHandler(async (req, res) => res.status(201).json(await manage.createEmployee(req.body))));
r.patch("/employees/:id", owner, asyncHandler(async (req, res) => res.json(await manage.updateEmployee(idParam(req.params.id), req.body))));
r.put("/employees/:id/permissions", owner, asyncHandler(async (req, res) =>
  res.json(await manage.setEmployeePermissions(idParam(req.params.id), req.body?.permissions))));

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
r.get("/lab-account", asyncHandler(async (_req, res) => res.json({ lab: await manage.getLabAccount() })));
r.put("/lab-account", owner, asyncHandler(async (req, res) => res.json({ success: true, lab: await manage.saveLabAccount(req.body) })));
r.post("/labs", owner, asyncHandler(async (req, res) => res.status(201).json({ success: true, lab: await manage.createLab(req.body) })));

// ---- preferences and referral program
r.get("/email-preferences", asyncHandler(async (req, res) => res.json({ preferences: await manage.getEmailPreferences(req.auth!.id) })));
r.put("/email-preferences", asyncHandler(async (req, res) =>
  res.json({ success: true, preferences: await manage.saveEmailPreferences(req.auth!.id, req.body) })));
r.get("/referrals", asyncHandler(async (_req, res) => res.json({ referral: await manage.getReferralProgram() })));
r.post("/referrals", asyncHandler(async (req, res) => res.status(201).json({ referral: await manage.inviteReferral(req.body) })));

// ---- doctor access
r.get("/doctor-access", owner, asyncHandler(async (_req, res) => res.json({ items: await manage.listDoctorAccess() })));
r.post("/doctor-access", owner, asyncHandler(async (req, res) => res.status(201).json(await manage.createDoctorAccess(req.body))));
r.patch("/doctor-access/:id", owner, asyncHandler(async (req, res) => res.json(await manage.updateDoctorAccess(idParam(req.params.id), req.body))));
r.delete("/doctor-access/:id", owner, asyncHandler(async (req, res) => { await manage.removeDoctorAccess(idParam(req.params.id)); res.status(204).end(); }));

// ---- support
r.get("/support-tickets", asyncHandler(async (_req, res) => res.json({ items: await extras.listTickets() })));
r.post("/support-tickets", asyncHandler(async (req, res) =>
  res.status(201).json(await extras.createTicket(req.body, { name: req.auth!.name, email: req.auth!.email }))));

export default r;
