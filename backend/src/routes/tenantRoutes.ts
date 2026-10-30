import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { idParam } from "../utils/validate.js";
import * as notifications from "../services/notificationService.js";
import * as tenants from "../services/tenantService.js";

/** /api/super-admin  - the Super admin panel (you). */
export const superAdminRouter = Router();

superAdminRouter.post("/login", asyncHandler(async (req, res) => res.json(await tenants.superAdminLogin(req.body))));

superAdminRouter.use(tenants.requireSuperAdmin);
superAdminRouter.get("/me", asyncHandler(async (_req, res) => {
  const { id, name, email } = res.locals.superAdmin;
  res.json({ admin: { id, name, email } });
}));
superAdminRouter.get("/tenants", asyncHandler(async (_req, res) => res.json({ items: await tenants.listTenants() })));
superAdminRouter.post("/tenants", asyncHandler(async (req, res) => res.status(201).json(await tenants.createTenant(req.body))));
superAdminRouter.patch("/tenants/:id", asyncHandler(async (req, res) => res.json(await tenants.updateTenant(idParam(req.params.id), req.body))));
superAdminRouter.delete("/tenants/:id", asyncHandler(async (req, res) => { await tenants.removeTenant(idParam(req.params.id)); res.status(204).end(); }));

superAdminRouter.get("/notifications", asyncHandler(async (_req, res) => res.json({ items: await notifications.listNotifications() })));
superAdminRouter.post("/notifications", asyncHandler(async (req, res) => res.status(201).json(await notifications.createNotification(req.body))));
superAdminRouter.patch("/notifications/:id", asyncHandler(async (req, res) => res.json(await notifications.updateNotification(idParam(req.params.id), req.body))));
superAdminRouter.delete("/notifications/:id", asyncHandler(async (req, res) => { await notifications.removeNotification(idParam(req.params.id)); res.status(204).end(); }));

/** /api/notifications  - the messages for the signed-in lab (shown in the notification bar). */
export const notificationsRouter = Router();
notificationsRouter.get("/", asyncHandler(async (_req, res) => res.json({ items: await notifications.listForCurrentLab() })));

/** /api/admin-auth  - the Admin login page (email, password, database URL). */
export const adminAuthRouter = Router();

adminAuthRouter.post("/login", asyncHandler(async (req, res) =>
  res.json(await tenants.adminLogin(req.body, { ipAddress: req.ip, userAgent: req.get("user-agent") ?? undefined }))));