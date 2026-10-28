import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { badRequest, notFound } from "../utils/ApiError.js";
import { iso, toNumber } from "../utils/format.js";
import { asBody, text } from "../utils/validate.js";
import { assertAdmin } from "./manageService.js";

/** Longest date range (in days) allowed for each export. Keep in step with the Data export page. */
const LIMITS: Record<string, number> = {
  Bill: 31,
  Patient: 365,
  Transaction: 31,
  "Lab report": 31,
  Expense: 365,
};

const MAX_ROWS = 50_000;

type Cell = string | number | boolean | null | undefined;
interface Sheet {
  header: string[];
  rows: Cell[][];
}

const csvCell = (value: Cell) => `"${String(value ?? "").replace(/"/g, '""')}"`;
const toCsv = (sheet: Sheet) => [sheet.header, ...sheet.rows].map((line) => line.map(csvCell).join(",")).join("\r\n");

const dateKey = (value: unknown, label: string) => {
  const key = text(value, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || Number.isNaN(new Date(`${key}T00:00:00Z`).getTime())) {
    throw badRequest(`Enter a valid ${label} date.`);
  }
  return key;
};

const days = (from: string, to: string) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000) + 1;

/** Whole days from `from` to `to` inclusive, in the server's local time (for timestamps). */
function localWindow(from: string, to: string) {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  return { gte: new Date(fy!, fm! - 1, fd!), lt: new Date(ty!, tm! - 1, td! + 1) };
}

/** Same window for plain DATE columns (stored without a time zone). */
function dateWindow(from: string, to: string) {
  const end = new Date(`${to}T00:00:00.000Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  return { gte: new Date(`${from}T00:00:00.000Z`), lt: end };
}

const fmt = (value: Date | null | undefined) => (value ? iso(value) ?? "" : "");

// ---------------------------------------------------------------------
// One builder per entity
// ---------------------------------------------------------------------
async function billSheet(from: string, to: string): Promise<Sheet> {
  const bills = await prisma.bill.findMany({
    where: { createdAt: localWindow(from, to) },
    include: { investigations: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { name: true } } },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    take: MAX_ROWS,
  });

  return {
    header: ["Reg no", "Case no", "Date", "Status", "Patient", "Mobile", "UHID", "Age", "Sex", "Referrer", "Collection centre",
      "Total", "Discount", "Received", "Balance", "Payment mode", "Created by", "Tests"],
    rows: bills.map((b) => [
      b.regNo, b.caseNo, fmt(b.createdAt), b.status, b.patientName, b.mobile, b.uhid, b.age, b.sex, b.referrer, b.collectionCentre,
      toNumber(b.total), toNumber(b.discount), toNumber(b.received), toNumber(b.balance), b.mode, b.createdBy,
      b.investigations.map((i) => i.name).join("; "),
    ]),
  };
}

async function patientSheet(from: string, to: string): Promise<Sheet> {
  const patients = await prisma.patient.findMany({
    where: { createdAt: localWindow(from, to) },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    take: MAX_ROWS,
  });

  return {
    header: ["ID", "UHID", "Name", "Sex", "Age (years)", "Date of birth", "Mobile", "Email", "Address", "Registered on"],
    rows: patients.map((p) => [
      p.id, p.uhid, [p.title, p.firstName, p.lastName].filter(Boolean).join(" "), p.sex, p.years,
      p.dateOfBirth ? p.dateOfBirth.toISOString().slice(0, 10) : "", p.mobile, p.email, p.address, fmt(p.createdAt),
    ]),
  };
}

async function transactionSheet(from: string, to: string): Promise<Sheet> {
  const rows = await prisma.billTransaction.findMany({
    where: { paidAt: localWindow(from, to) },
    include: { bill: { select: { regNo: true, patientName: true } } },
    orderBy: [{ paidAt: "asc" }, { id: "asc" }],
    take: MAX_ROWS,
  });

  return {
    header: ["Paid on", "Reg no", "Patient", "Transaction no", "Amount", "Payment mode", "Received by"],
    rows: rows.map((t) => [fmt(t.paidAt), t.bill.regNo, t.bill.patientName, t.txNo, toNumber(t.amount), t.mode, t.receivedBy]),
  };
}

async function labReportSheet(from: string, to: string): Promise<Sheet> {
  const reports = await prisma.report.findMany({
    where: { createdAt: localWindow(from, to) },
    include: { tests: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] } },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    take: MAX_ROWS,
  });

  return {
    header: ["Reg no", "Patient", "Age", "Referrer", "Status", "Created on", "Reported on", "Verified by", "Results", "Interpretation"],
    rows: reports.map((r) => [
      r.regNo, r.patient, r.age, r.referrer, r.status, fmt(r.createdAt), fmt(r.reportedAt), r.verifiedBy,
      r.tests.map((t) => `${t.name}: ${[t.value, t.unit].filter(Boolean).join(" ")}${t.flag ? ` (${t.flag})` : ""}`).join("; "),
      r.interpretation,
    ]),
  };
}

async function expenseSheet(from: string, to: string): Promise<Sheet> {
  const rows = await prisma.expense.findMany({
    where: { expenseDate: dateWindow(from, to) },
    include: { category: { select: { name: true } } },
    orderBy: [{ expenseDate: "asc" }, { id: "asc" }],
    take: MAX_ROWS,
  });

  return {
    header: ["Spent on", "Expense name", "Amount", "Category", "Payment mode", "Paid to", "Notes", "Added by", "Added on"],
    rows: rows.map((e) => [
      e.expenseDate.toISOString().slice(0, 10), e.title, toNumber(e.amount), e.category?.name ?? "", e.mode, e.paidTo, e.notes, e.createdBy, fmt(e.createdAt),
    ]),
  };
}

const BUILDERS: Record<string, (from: string, to: string) => Promise<Sheet>> = {
  Bill: billSheet,
  Patient: patientSheet,
  Transaction: transactionSheet,
  "Lab report": labReportSheet,
  Expense: expenseSheet,
};

const fileName = (entity: string, from: string, to: string) => `${entity.toLowerCase().replace(/\s+/g, "_")}_${from}_to_${to}.csv`;

// ---------------------------------------------------------------------
// Public functions (admin only: exports contain patient and billing data)
// ---------------------------------------------------------------------
const serialize = (row: { id: number; exportType: string; status: string; createdBy: string | null; createdAt: Date; params: Prisma.JsonValue }) => {
  const p = (row.params ?? {}) as { from?: string; to?: string; rows?: number; fileName?: string };
  return {
    id: row.id,
    name: p.fileName ?? "",
    entity: row.exportType,
    fromDate: p.from ?? "",
    toDate: p.to ?? "",
    rows: p.rows ?? 0,
    status: row.status === "ready" ? "Ready" : row.status,
    createdBy: row.createdBy ?? "",
    createdAt: iso(row.createdAt),
  };
};

export async function runExport(input: unknown, actorUserId: number) {
  const actor = await assertAdmin(actorUserId);

  const body = asBody(input);
  const entity = text(body.entity, 40);
  if (!(entity in BUILDERS)) throw badRequest("Choose what to export.");

  const from = dateKey(body.from, "start");
  const to = dateKey(body.to, "end");
  if (from > to) throw badRequest("The start date cannot be after the end date.");

  const limit = LIMITS[entity]!;
  if (days(from, to) > limit) {
    throw badRequest(`${entity} exports are limited to ${limit} days. Please select a shorter date range.`);
  }

  const sheet = await BUILDERS[entity]!(from, to);
  const name = fileName(entity, from, to);

  const row = await prisma.dataExport.create({
    data: {
      exportType: entity,
      params: { from, to, rows: sheet.rows.length, fileName: name },
      status: "ready",
      createdBy: actor.name,
    },
  });

  return { export: serialize(row), csv: toCsv(sheet) };
}

export async function listExports(actorUserId: number) {
  await assertAdmin(actorUserId);
  const rows = await prisma.dataExport.findMany({ orderBy: { id: "desc" }, take: 50 });
  return rows.map(serialize);
}

/** Builds the file again from the saved settings (so it reflects the data as it is now). */
export async function exportFile(exportId: number, actorUserId: number) {
  await assertAdmin(actorUserId);

  const row = await prisma.dataExport.findUnique({ where: { id: exportId } });
  const info = row ? serialize(row) : null;
  if (!info || !(info.entity in BUILDERS)) throw notFound("Export");

  return { name: info.name, csv: toCsv(await BUILDERS[info.entity]!(info.fromDate, info.toDate)) };
}