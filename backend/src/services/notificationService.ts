import type { Notification as NotificationRow } from "../generated/control/index.js";
import { controlPrisma, currentTenantId } from "../lib/prisma.js";
import { ApiError, badRequest, notFound } from "../utils/ApiError.js";
import { asBody, reqText, text } from "../utils/validate.js";

const SEVERITIES = ["info", "success", "warning", "critical"];

const serialize = (n: NotificationRow & { targets: { tenantId: number }[] }) => ({
  id: n.id,
  title: n.title,
  message: n.message,
  severity: n.severity,
  allLabs: n.allLabs,
  tenantIds: n.targets.map((t) => t.tenantId),
  active: n.active,
  expiresAt: n.expiresAt?.toISOString() ?? null,
  createdAt: n.createdAt.toISOString(),
});

/** "" -> no expiry, "2026-12-31" -> end of that day. */
function expiry(value: unknown): Date | null {
  const key = text(value, 10);
  if (!key) return null;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(key) ? new Date(`${key}T23:59:59`) : new Date(NaN);
  if (Number.isNaN(date.getTime())) throw badRequest("Enter a valid expiry date.");
  return date;
}

// =====================================================================
// SUPER ADMIN: write the messages
// =====================================================================
export async function listNotifications() {
  const rows = await controlPrisma.notification.findMany({
    include: { targets: { select: { tenantId: true } } },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 200,
  });
  return rows.map(serialize);
}

export async function createNotification(input: unknown) {
  const body = asBody(input);
  const title = reqText(body.title, "Title", 160);
  const message = reqText(body.message, "Message", 2000);
  const severity = SEVERITIES.includes(String(body.severity)) ? String(body.severity) : "info";
  const allLabs = body.allLabs !== false;

  const tenantIds = [...new Set((Array.isArray(body.tenantIds) ? body.tenantIds : []).map(Number).filter(Number.isInteger))];
  if (!allLabs) {
    if (!tenantIds.length) throw badRequest("Choose at least one lab.");
    const found = await controlPrisma.tenant.count({ where: { id: { in: tenantIds } } });
    if (found !== tenantIds.length) throw badRequest("One or more selected labs do not exist.");
  }

  const row = await controlPrisma.notification.create({
    data: {
      title,
      message,
      severity,
      allLabs,
      expiresAt: expiry(body.expiresAt),
      ...(allLabs ? {} : { targets: { create: tenantIds.map((tenantId) => ({ tenantId })) } }),
    },
    include: { targets: { select: { tenantId: true } } },
  });
  return serialize(row);
}

export async function updateNotification(notificationId: number, input: unknown) {
  if (!(await controlPrisma.notification.findUnique({ where: { id: notificationId } }))) throw notFound("Notification");

  const body = asBody(input);
  const row = await controlPrisma.notification.update({
    where: { id: notificationId },
    data: {
      ...(body.active !== undefined ? { active: Boolean(body.active) } : {}),
      ...(body.title !== undefined ? { title: reqText(body.title, "Title", 160) } : {}),
      ...(body.message !== undefined ? { message: reqText(body.message, "Message", 2000) } : {}),
      ...(body.severity !== undefined && SEVERITIES.includes(String(body.severity)) ? { severity: String(body.severity) } : {}),
    },
    include: { targets: { select: { tenantId: true } } },
  });
  return serialize(row);
}

export async function removeNotification(notificationId: number) {
  const result = await controlPrisma.notification.deleteMany({ where: { id: notificationId } });
  if (!result.count) throw notFound("Notification");
}

// =====================================================================
// LABS: read the messages meant for the signed-in lab
// =====================================================================
export async function listForCurrentLab() {
  const tenantId = currentTenantId();
  if (!tenantId) throw new ApiError(401, "UNAUTHORIZED", "Please sign in again.");

  const rows = await controlPrisma.notification.findMany({
    where: {
      active: true,
      AND: [
        { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
        { OR: [{ allLabs: true }, { targets: { some: { tenantId } } }] },
      ],
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 50,
    select: { id: true, title: true, message: true, severity: true, createdAt: true },
  });

  return rows.map((n) => ({ ...n, createdAt: n.createdAt.toISOString() }));
}