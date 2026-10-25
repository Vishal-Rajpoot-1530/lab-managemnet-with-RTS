import type { Patient } from "@prisma/client";
import { prisma, type Db } from "../lib/prisma.js";
import { ApiError, badRequest, notFound } from "../utils/ApiError.js";
import { iso } from "../utils/format.js";
import {
  asBody,
  bool,
  limitParam,
  optInt,
  optText,
  reqText,
  text,
  type Body,
} from "../utils/validate.js";

const TITLES = ["mr.", "mrs.", "ms.", "miss", "dr.", "master", "baby", "mx.", "mr", "mrs", "ms", "dr"];

/** "Mr. Rahul Kumar Sharma" -> { title: "Mr.", firstName: "Rahul", lastName: "Kumar Sharma" } */
export function splitName(full: string): {
  title: string;
  firstName: string;
  lastName: string;
} {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  let title = "";

  if (parts.length > 1 && TITLES.includes(parts[0]!.toLowerCase())) {
    title = parts.shift()!;
  }

  return {
    title,
    firstName: parts.shift() ?? "",
    lastName: parts.join(" "),
  };
}

export interface PatientFields {
  title: string | null;
  firstName: string;
  lastName: string | null;
  sex: string | null;
  years: number | null;
  months: number | null;
  days: number | null;
  mobile: string;
  email: string | null;
  address: string | null;
  aadhaar: string | null;
  history: string | null;
  uhid: string | null;
  onlineReport: boolean;
}

/** Cleans a patient object from a request (bill form or patients page). */
export function readPatient(input: unknown, fallbackName = ""): PatientFields {
  const body: Body = asBody(input);

  let title = text(body.title, 20);
  let firstName = text(body.firstName, 120);
  let lastName = text(body.lastName, 120);

  if (!firstName) {
    const split = splitName(text(body.name, 255) || fallbackName);
    title = title || split.title;
    firstName = split.firstName;
    lastName = lastName || split.lastName;
  }

  const sex = text(body.sex ?? body.gender, 20).toUpperCase();

  return {
    title: title || null,
    firstName,
    lastName: lastName || null,
    sex: sex || null,
    years: optInt(body.years),
    months: optInt(body.months),
    days: optInt(body.days),
    mobile: text(body.mobile, 20).replace(/[^\d+]/g, ""),
    email: optText(body.email, 190),
    address: optText(body.address, 5000),
    aadhaar: optText(String(body.aadhaar ?? "").replace(/\D/g, ""), 12),
    history: optText(body.history, 5000),
    uhid: optText(body.uhid, 60),
    onlineReport: bool(body.online ?? body.onlineReport, false),
  };
}

export const patientDisplayName = (p: Pick<Patient, "title" | "firstName" | "lastName">) =>
  [p.title, p.firstName, p.lastName].filter(Boolean).join(" ");

export function ageText(p: Pick<Patient, "years" | "months" | "days">): string {
  const parts: string[] = [];
  if (p.years !== null) parts.push(`${p.years} YRS`);
  if (p.months !== null) parts.push(`${p.months} MOS`);
  if (p.days !== null) parts.push(`${p.days} DAYS`);
  return parts.join(" ");
}

export function serializePatient(p: Patient) {
  return {
    id: p.id,
    uhid: p.uhid ?? "",
    title: p.title ?? "",
    firstName: p.firstName,
    lastName: p.lastName ?? "",
    name: patientDisplayName(p),
    sex: p.sex ?? "",
    years: p.years,
    months: p.months,
    days: p.days,
    age: ageText(p),
    mobile: p.mobile,
    email: p.email ?? "",
    address: p.address ?? "",
    aadhaar: p.aadhaar ?? "",
    history: p.history ?? "",
    onlineReport: p.onlineReport,
    createdAt: iso(p.createdAt),
  };
}

const duplicateUhid = () =>
  new ApiError(409, "DUPLICATE_UHID", "This UHID is already used by another patient.");

async function assertUhidFree(db: Db, uhid: string | null, exceptId?: number) {
  if (!uhid) return;
  const found = await db.patient.findFirst({
    where: { uhid, ...(exceptId ? { id: { not: exceptId } } : {}) },
    select: { id: true },
  });
  if (found) throw duplicateUhid();
}

// ---------------------------------------------------------------------
// Patients page
// ---------------------------------------------------------------------
export async function listPatients(params: { q?: string; limit?: unknown }) {
  const q = params.q?.trim();
  const asId = q && /^\d+$/.test(q) ? Number(q) : null;

  const rows = await prisma.patient.findMany({
    where: q
      ? {
          OR: [
            ...(asId ? [{ id: asId }] : []),
            { uhid: { contains: q } },
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { mobile: { contains: q } },
          ],
        }
      : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limitParam(params.limit, 500, 2000),
  });

  return rows.map(serializePatient);
}

export async function getPatient(id: number) {
  const patient = await prisma.patient.findUnique({ where: { id } });
  if (!patient) throw notFound("Patient");

  const bills = await prisma.bill.findMany({
    where: { patientId: id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      regNo: true,
      caseNo: true,
      status: true,
      total: true,
      balance: true,
      createdAt: true,
    },
  });

  return {
    ...serializePatient(patient),
    bills: bills.map((bill) => ({
      id: bill.id,
      regNo: bill.regNo,
      caseNo: bill.caseNo,
      status: bill.status,
      total: Number(bill.total),
      balance: Number(bill.balance),
      createdAt: iso(bill.createdAt),
    })),
  };
}

export async function createPatient(input: unknown) {
  const data = readPatient(input);

  if (!data.firstName) throw badRequest("Patient name is required.", { field: "firstName" });

  await assertUhidFree(prisma, data.uhid);

  const patient = await prisma.patient.create({ data });
  return serializePatient(patient);
}

export async function updatePatient(id: number, input: unknown) {
  const existing = await prisma.patient.findUnique({ where: { id } });
  if (!existing) throw notFound("Patient");

  const body = asBody(input);
  const data = readPatient({ ...serializePatient(existing), ...body });

  if (!data.firstName) throw badRequest("Patient name is required.", { field: "firstName" });

  await assertUhidFree(prisma, data.uhid, id);

  const patient = await prisma.patient.update({ where: { id }, data });
  return serializePatient(patient);
}

// ---------------------------------------------------------------------
// Used when a bill is saved: find the patient or create one.
// ---------------------------------------------------------------------
/**
 * Finds the patient a bill belongs to, creating them when new.
 *  1. same UHID  -> that patient
 *  2. same mobile + first + last name -> that patient
 *  3. otherwise a new patient
 * Demographics (age, address, ...) are refreshed from the bill.
 */
export async function resolvePatientForBill(
  db: Db,
  fields: PatientFields,
  currentPatientId?: number | null,
): Promise<Patient> {
  const refresh = {
    title: fields.title,
    sex: fields.sex,
    years: fields.years,
    months: fields.months,
    days: fields.days,
    onlineReport: fields.onlineReport,
    ...(fields.email ? { email: fields.email } : {}),
    ...(fields.address ? { address: fields.address } : {}),
    ...(fields.aadhaar ? { aadhaar: fields.aadhaar } : {}),
    ...(fields.history ? { history: fields.history } : {}),
  };

  // Editing a bill: fixing a typo in the name keeps the same patient
  // as long as the mobile number is unchanged.
  if (currentPatientId) {
    const current = await db.patient.findUnique({ where: { id: currentPatientId } });

    if (current && fields.mobile && current.mobile === fields.mobile) {
      await assertUhidFree(db, fields.uhid, current.id);

      return db.patient.update({
        where: { id: current.id },
        data: {
          ...refresh,
          firstName: fields.firstName,
          lastName: fields.lastName,
          ...(fields.uhid ? { uhid: fields.uhid } : {}),
        },
      });
    }
  }

  let match: Patient | null = null;

  if (fields.uhid) {
    match = await db.patient.findUnique({ where: { uhid: fields.uhid } });
  }

  if (!match && fields.mobile) {
    match = await db.patient.findFirst({
      where: {
        mobile: fields.mobile,
        firstName: fields.firstName,
        lastName: fields.lastName,
      },
      orderBy: { id: "asc" },
    });
  }

  if (match) return db.patient.update({ where: { id: match.id }, data: refresh });

  return db.patient.create({ data: fields });
}
