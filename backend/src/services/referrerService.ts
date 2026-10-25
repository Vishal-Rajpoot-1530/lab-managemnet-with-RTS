import type { Agent, Referrer } from "@prisma/client";
import { prisma, type Db } from "../lib/prisma.js";
import { badRequest, notFound } from "../utils/ApiError.js";
import { iso } from "../utils/format.js";
import { splitName } from "./patientService.js";
import { asBody, bool, id, optText, text } from "../utils/validate.js";

// ---------------------------------------------------------------------
// Referrers (referring doctors)  - /api/doctors
// ---------------------------------------------------------------------
export const referrerLabel = (
  r: Pick<Referrer, "title" | "firstName" | "lastName" | "name">,
): string =>
  [r.title, r.firstName, r.lastName].filter(Boolean).join(" ") || r.name || "Self";

export function serializeReferrer(r: Referrer) {
  return {
    id: r.id,
    title: r.title ?? "",
    firstName: r.firstName ?? "",
    lastName: r.lastName ?? "",
    name: referrerLabel(r),
    degree: r.degree ?? "",
    mobile: r.mobile ?? "",
    email: r.email ?? "",
    address: r.address ?? "",
    active: r.active,
    status: r.active ? "active" : "inactive",
    createdAt: iso(r.createdAt),
  };
}

function readReferrer(input: unknown, base?: Referrer) {
  const body = asBody(input);

  let title = body.title !== undefined ? text(body.title, 20) : (base?.title ?? "");
  let firstName =
    body.firstName !== undefined ? text(body.firstName, 120) : (base?.firstName ?? "");
  let lastName =
    body.lastName !== undefined ? text(body.lastName, 120) : (base?.lastName ?? "");

  // Some callers send a single `name`.
  if (!firstName && body.name) {
    const split = splitName(text(body.name));
    title = title || split.title;
    firstName = split.firstName;
    lastName = lastName || split.lastName;
  }

  if (!firstName) throw badRequest("Referrer first name is required.", { field: "firstName" });

  const mobile =
    body.mobile !== undefined ? text(body.mobile, 20).replace(/\D/g, "") : (base?.mobile ?? "");

  const active =
    body.active !== undefined
      ? bool(body.active, true)
      : body.status !== undefined
        ? String(body.status).toLowerCase() !== "inactive"
        : (base?.active ?? true);

  const composed = [title, firstName, lastName].filter(Boolean).join(" ");

  return {
    title: title || null,
    firstName,
    lastName: lastName || null,
    name: composed.slice(0, 255),
    degree: body.degree !== undefined ? optText(body.degree, 120) : (base?.degree ?? null),
    mobile: mobile || null,
    email: body.email !== undefined ? optText(body.email, 190) : (base?.email ?? null),
    address: body.address !== undefined ? optText(body.address, 5000) : (base?.address ?? null),
    active,
  };
}

export async function listReferrers(params: { q?: string; active?: string }) {
  const q = params.q?.trim();

  const rows = await prisma.referrer.findMany({
    where: {
      ...(params.active === "true" ? { active: true } : {}),
      ...(params.active === "false" ? { active: false } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { firstName: { contains: q } },
              { lastName: { contains: q } },
              { mobile: { contains: q } },
              { degree: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { id: "asc" },
  });

  return rows.map(serializeReferrer);
}

export async function getReferrer(refId: number) {
  const row = await prisma.referrer.findUnique({ where: { id: refId } });
  if (!row) throw notFound("Referrer");
  return serializeReferrer(row);
}

export async function createReferrer(input: unknown) {
  const row = await prisma.referrer.create({ data: readReferrer(input) });
  return serializeReferrer(row);
}

export async function updateReferrer(refId: number, input: unknown) {
  const base = await prisma.referrer.findUnique({ where: { id: refId } });
  if (!base) throw notFound("Referrer");

  const row = await prisma.referrer.update({
    where: { id: refId },
    data: readReferrer(input, base),
  });

  return serializeReferrer(row);
}

/** Deletes the referrer, or just turns them off when bills already use them. */
export async function removeReferrer(refId: number) {
  const base = await prisma.referrer.findUnique({ where: { id: refId } });
  if (!base) throw notFound("Referrer");

  const used = await prisma.bill.count({ where: { referrerId: refId } });

  if (used > 0) {
    await prisma.referrer.update({ where: { id: refId }, data: { active: false } });
    return { deleted: false, deactivated: true, billCount: used };
  }

  await prisma.referrer.delete({ where: { id: refId } });
  return { deleted: true, deactivated: false, billCount: 0 };
}

/** Works out who a bill was referred by, from an id and/or a display name. */
export async function resolveReferrer(
  db: Db,
  referrerId: unknown,
  referrerName: unknown,
): Promise<{ id: number | null; label: string }> {
  const wantedId = id(referrerId);
  const wantedName = text(referrerName);

  let row: Referrer | null = null;

  if (wantedId) row = await db.referrer.findUnique({ where: { id: wantedId } });

  if (!row && wantedName) {
    row = await db.referrer.findFirst({ where: { name: wantedName } });
  }

  if (row) return { id: row.id, label: referrerLabel(row) };

  return { id: null, label: wantedName || "Self" };
}

// ---------------------------------------------------------------------
// Sample collection agents  - /api/cases/agents
// ---------------------------------------------------------------------
export function serializeAgent(a: Agent) {
  return {
    id: a.id,
    name: a.name ?? "",
    active: a.active,
    status: a.active ? "Active" : "Inactive",
    createdAt: iso(a.createdAt),
  };
}

export async function listAgents(params: { q?: string }) {
  const q = params.q?.trim();

  const rows = await prisma.agent.findMany({
    where: q ? { name: { contains: q } } : undefined,
    orderBy: { id: "asc" },
  });

  return rows.map(serializeAgent);
}

export async function createAgent(input: unknown) {
  const body = asBody(input);
  const name = text(body.name, 255);
  if (!name) throw badRequest("Agent name is required.", { field: "name" });

  const row = await prisma.agent.create({
    data: { name, active: bool(body.active, true) },
  });

  return serializeAgent(row);
}

export async function updateAgent(agentId: number, input: unknown) {
  const base = await prisma.agent.findUnique({ where: { id: agentId } });
  if (!base) throw notFound("Agent");

  const body = asBody(input);
  const name = body.name !== undefined ? text(body.name, 255) : (base.name ?? "");
  if (!name) throw badRequest("Agent name is required.", { field: "name" });

  const active =
    body.active !== undefined
      ? bool(body.active, base.active)
      : body.status !== undefined
        ? String(body.status).toLowerCase() !== "inactive"
        : base.active;

  const row = await prisma.agent.update({ where: { id: agentId }, data: { name, active } });
  return serializeAgent(row);
}

export async function removeAgent(agentId: number) {
  const base = await prisma.agent.findUnique({ where: { id: agentId } });
  if (!base) throw notFound("Agent");

  const used = await prisma.bill.count({ where: { agentId } });

  if (used > 0) {
    await prisma.agent.update({ where: { id: agentId }, data: { active: false } });
    return { deleted: false, deactivated: true, billCount: used };
  }

  await prisma.agent.delete({ where: { id: agentId } });
  return { deleted: true, deactivated: false, billCount: 0 };
}

export async function resolveAgent(
  db: Db,
  agentId: unknown,
  agentName: unknown,
): Promise<{ id: number | null; name: string }> {
  const wantedId = id(agentId);
  const wantedName = text(agentName);

  let row: Agent | null = null;

  if (wantedId) row = await db.agent.findUnique({ where: { id: wantedId } });
  if (!row && wantedName) row = await db.agent.findFirst({ where: { name: wantedName } });

  if (row) return { id: row.id, name: row.name ?? "" };

  return { id: null, name: wantedName };
}
