import type { Prisma } from "@prisma/client";
import { prisma, type Db } from "../lib/prisma.js";
import { badRequest, notFound } from "../utils/ApiError.js";
import { dateKey, dateRange, dayRange, displayDate, displayTime, iso } from "../utils/format.js";
import { asBody, bool, id as toId, limitParam, optText, reqText, text } from "../utils/validate.js";

/** New scan cases start as "Report Pending" (older rows saved as "New" are treated the same). */
export const PENDING = "Report Pending";
const statusOut = (status: string) => (status === "New" ? PENDING : status);

const PREFIX: Record<string, string> = {
  usg: "USG", xray: "XR", digitalXray: "DXR", ctScan: "CT", mri: "MRI",
  ecg: "ECG", eps: "EPS", opg: "OPG", cardiology: "CARD", eeg: "EEG", mammography: "MAM",
};

const include = {
  bill: { select: { regNo: true, patientId: true, uhid: true, patientName: true, age: true, sex: true, referrer: true, mobile: true } },
  template: { select: { name: true } },
  signature: { select: { doctorName: true } },
} satisfies Prisma.RadiologyReportInclude;

type CaseRow = Prisma.RadiologyReportGetPayload<{ include: typeof include }>;

const serializeCase = (r: CaseRow) => ({
  id: r.id,
  caseId: `${PREFIX[r.modality] ?? r.modality.toUpperCase()}-${String(r.id).padStart(4, "0")}`,
  billId: r.billId,
  regNo: r.bill.regNo,
  patientCode: r.bill.uhid || (r.bill.patientId ? `PAT-${r.bill.patientId}` : ""),
  /** YYYY-MM-DD in the lab's time zone (use this for filtering / date inputs). */
  date: dateKey(r.createdAt),
  dateDisplay: displayDate(r.createdAt),
  time: displayTime(r.createdAt),
  patient: r.bill.patientName,
  patientName: r.bill.patientName,
  age: r.bill.age ?? "",
  sex: r.bill.sex ?? "",
  mobile: r.bill.mobile,
  referrerName: r.bill.referrer,
  modality: r.modality,
  studyName: r.studyName,
  investigations: r.studyName,
  status: statusOut(r.status),
  templateId: r.templateId,
  templateName: r.template?.name ?? "",
  signatureId: r.signatureId,
  signatureName: r.signature?.doctorName ?? "",
  findings: r.findings ?? "",
  impression: r.impression ?? "",
  reportedBy: r.reportedBy ?? "",
  reportedAt: iso(r.reportedAt),
  createdAt: iso(r.createdAt),
});

export interface CaseFilter {
  modalities: string[];
  modality?: string;
  from?: string;
  to?: string;
  q?: string;
  status?: string;
  today?: boolean;
  limit?: unknown;
}

export async function listCases(f: CaseFilter) {
  const modalities = f.modality ? f.modalities.filter((m) => m === f.modality) : f.modalities;
  const range = f.today ? dayRange() : dateRange(f.from, f.to);
  const q = f.q?.trim();
  const asId = q && /^\d+$/.test(q) ? Number(q) : null;

  const rows = await prisma.radiologyReport.findMany({
    where: {
      ...(modalities.length ? { modality: { in: modalities } } : {}),
      bill: { status: { not: "Cancelled" } },
      ...(range ? { createdAt: range } : {}),
      ...(f.status ? { status: f.status === PENDING ? { in: [PENDING, "New"] } : f.status } : {}),
      ...(q
        ? {
            OR: [
              ...(asId ? [{ id: asId }] : []),
              { studyName: { contains: q } },
              { bill: { regNo: { contains: q } } },
              { bill: { patientName: { contains: q } } },
              { bill: { referrer: { contains: q } } },
              { bill: { uhid: { contains: q } } },
            ],
          }
        : {}),
    },
    include,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limitParam(f.limit, 1000, 5000),
  });

  return rows.map(serializeCase);
}

async function loadCase(caseId: number, modalities: string[]) {
  const row = await prisma.radiologyReport.findFirst({
    where: { id: caseId, ...(modalities.length ? { modality: { in: modalities } } : {}) },
    include,
  });
  if (!row) throw notFound("Case");
  return row;
}

export async function getCase(caseId: number, modalities: string[]) {
  return serializeCase(await loadCase(caseId, modalities));
}

export async function updateCase(caseId: number, modalities: string[], input: unknown, actor: string) {
  const base = await loadCase(caseId, modalities);
  const body = asBody(input);

  const status = body.status !== undefined ? text(body.status, 30) : statusOut(base.status);
  if (!status) throw badRequest("Status is required.");

  const templateId = body.templateId !== undefined ? toId(body.templateId) : base.templateId;
  const signatureId = body.signatureId !== undefined ? toId(body.signatureId) : base.signatureId;

  if (templateId && !(await prisma.radiologyTemplate.findUnique({ where: { id: templateId } }))) {
    throw badRequest("Selected template does not exist.");
  }
  if (signatureId && !(await prisma.radiologySignature.findUnique({ where: { id: signatureId } }))) {
    throw badRequest("Selected signature does not exist.");
  }

  const done = status.toLowerCase() === "completed";
  const wasDone = base.status.toLowerCase() === "completed";

  await prisma.radiologyReport.update({
    where: { id: caseId },
    data: {
      status,
      templateId,
      signatureId,
      ...(body.findings !== undefined ? { findings: optText(body.findings, 16_000_000) } : {}),
      ...(body.impression !== undefined ? { impression: optText(body.impression, 20000) } : {}),
      ...(done && !wasDone ? { reportedBy: actor, reportedAt: new Date() } : {}),
      ...(!done ? { reportedBy: null, reportedAt: null } : {}),
    },
  });

  return getCase(caseId, modalities);
}

// ---------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------
type TemplateRow = Prisma.RadiologyTemplateGetPayload<object>;

const serializeTemplate = (t: TemplateRow) => ({
  id: t.id,
  modality: t.modality,
  name: t.name,
  category: t.category,
  description: t.description ?? "",
  body: t.body,
  active: t.active,
  updated: dateKey(t.updatedAt),
  createdAt: iso(t.createdAt),
});

export async function listTemplates(modalities: string[]) {
  const rows = await prisma.radiologyTemplate.findMany({
    where: modalities.length ? { modality: { in: modalities } } : undefined,
    orderBy: [{ name: "asc" }, { id: "asc" }],
  });
  return rows.map(serializeTemplate);
}

const pickModality = (value: unknown, allowed: string[], fallback?: string) => {
  const modality = text(value, 30) || fallback || allowed[0] || "";
  if (!modality || (allowed.length && !allowed.includes(modality))) {
    throw badRequest(`Modality must be one of: ${allowed.join(", ")}.`);
  }
  return modality;
};

/** `defaultModality` is used when the form does not send one (e.g. "digitalXray"). */
export async function saveTemplate(templateId: number | null, allowed: string[], input: unknown, defaultModality?: string) {
  const body = asBody(input);

  const base = templateId === null ? null : await prisma.radiologyTemplate.findFirst({
    where: { id: templateId, ...(allowed.length ? { modality: { in: allowed } } : {}) },
  });
  if (templateId !== null && !base) throw notFound("Template");

  const data = {
    modality: pickModality(body.modality ?? base?.modality, allowed, defaultModality),
    name: reqText(body.name ?? base?.name, "Template name"),
    category: text(body.category ?? base?.category, 80) || "General",
    description: body.description !== undefined ? optText(body.description, 500) : (base?.description ?? null),
    body: body.body !== undefined ? text(body.body, 16_000_000) : (base?.body ?? ""),
    active: bool(body.active, base?.active ?? true),
  };

  const row = base
    ? await prisma.radiologyTemplate.update({ where: { id: base.id }, data })
    : await prisma.radiologyTemplate.create({ data });

  return serializeTemplate(row);
}

export async function removeTemplate(templateId: number, allowed: string[]) {
  const r = await prisma.radiologyTemplate.deleteMany({
    where: { id: templateId, ...(allowed.length ? { modality: { in: allowed } } : {}) },
  });
  if (!r.count) throw notFound("Template");
}

// ---------------------------------------------------------------------
// Signatures
// ---------------------------------------------------------------------
type SignatureRow = Prisma.RadiologySignatureGetPayload<object>;

const serializeSignature = (s: SignatureRow) => ({
  id: s.id,
  modality: s.modality,
  name: s.doctorName,
  doctorName: s.doctorName,
  role: s.qualification ?? "",
  qualification: s.qualification ?? "",
  registration: s.registrationNo ?? "",
  registrationNo: s.registrationNo ?? "",
  email: s.email ?? "",
  active: s.active,
  default: s.isDefault,
  isDefault: s.isDefault,
  createdAt: iso(s.createdAt),
});

export async function listSignatures(modalities: string[]) {
  const rows = await prisma.radiologySignature.findMany({
    where: modalities.length ? { modality: { in: modalities } } : undefined,
    orderBy: [{ doctorName: "asc" }, { id: "asc" }],
  });
  return rows.map(serializeSignature);
}

/** Exactly one active signature per section is the default (when any is active). */
async function ensureDefault(db: Db, allowed: string[]) {
  const scope = allowed.length ? { modality: { in: allowed } } : {};
  const current = await db.radiologySignature.findFirst({ where: { ...scope, isDefault: true, active: true } });
  if (current) return;

  await db.radiologySignature.updateMany({ where: scope, data: { isDefault: false } });
  const first = await db.radiologySignature.findFirst({ where: { ...scope, active: true }, orderBy: { id: "asc" } });
  if (first) await db.radiologySignature.update({ where: { id: first.id }, data: { isDefault: true } });
}

export async function saveSignature(signatureId: number | null, allowed: string[], input: unknown, defaultModality?: string) {
  const body = asBody(input);

  const row = await prisma.$transaction(async (tx) => {
    const base = signatureId === null ? null : await tx.radiologySignature.findFirst({
      where: { id: signatureId, ...(allowed.length ? { modality: { in: allowed } } : {}) },
    });
    if (signatureId !== null && !base) throw notFound("Signature");

    const active = bool(body.active, base?.active ?? true);
    const data = {
      modality: pickModality(body.modality ?? base?.modality, allowed, defaultModality),
      doctorName: reqText(body.doctorName ?? body.name ?? base?.doctorName, "Doctor name"),
      qualification: optText(body.qualification ?? body.role ?? base?.qualification, 255),
      registrationNo: optText(body.registrationNo ?? body.registration ?? base?.registrationNo, 80),
      email: optText(body.email ?? base?.email, 190),
      active,
      // An inactive profile can never be the default.
      isDefault: active && bool(body.isDefault ?? body.default, base?.isDefault ?? false),
    };

    if (data.isDefault) {
      await tx.radiologySignature.updateMany({
        where: { ...(allowed.length ? { modality: { in: allowed } } : { modality: data.modality }), ...(base ? { id: { not: base.id } } : {}) },
        data: { isDefault: false },
      });
    }

    const saved = base
      ? await tx.radiologySignature.update({ where: { id: base.id }, data })
      : await tx.radiologySignature.create({ data });

    await ensureDefault(tx, allowed);
    return tx.radiologySignature.findUniqueOrThrow({ where: { id: saved.id } });
  });

  return serializeSignature(row);
}

export async function removeSignature(signatureId: number, allowed: string[]) {
  await prisma.$transaction(async (tx) => {
    const r = await tx.radiologySignature.deleteMany({
      where: { id: signatureId, ...(allowed.length ? { modality: { in: allowed } } : {}) },
    });
    if (!r.count) throw notFound("Signature");
    await ensureDefault(tx, allowed);
  });
}
