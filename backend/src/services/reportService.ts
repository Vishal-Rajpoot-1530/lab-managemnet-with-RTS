import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { badRequest, notFound } from "../utils/ApiError.js";
import { dateRange, dayRange, iso } from "../utils/format.js";
import { asBody, limitParam, text } from "../utils/validate.js";
import { ActivityType, logActivities } from "./activityService.js";
import { computeFlag } from "./reportBuilder.js";

const reportInclude = {
  tests: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
} satisfies Prisma.ReportInclude;

type ReportRow = Prisma.ReportGetPayload<{ include: typeof reportInclude }>;

export const REPORT_STATUSES = ["New", "In progress", "Completed"] as const;
const isDone = (status: string) => ["completed", "complete", "reported"].includes(status.toLowerCase());

export function serializeReport(row: ReportRow) {
  return {
    id: row.id,
    billId: row.billId,
    regNo: row.regNo,
    registrationNo: row.regNo,
    patient: row.patient,
    patientName: row.patient,
    age: row.age ?? "",
    referrer: row.referrer ?? "",
    referrerName: row.referrer ?? "",
    status: row.status,
    createdAt: iso(row.createdAt),
    reportedAt: iso(row.reportedAt),
    verifiedBy: row.verifiedBy ?? "",
    tests: row.tests.map((t) => ({
      id: t.id,
      section: t.section ?? "LABORATORY",
      name: t.name,
      value: t.value ?? "",
      unit: t.unit ?? "",
      reference: t.reference ?? "",
      flag: t.flag ?? "",
    })),
    interpretation: row.interpretation ?? "",
    notes: row.notes ?? "",
  };
}

export interface ReportFilter {
  billId?: number;
  status?: string;
  patient?: string;
  regNo?: string;
  from?: string;
  to?: string;
  limit?: unknown;
}

async function find(where: Prisma.ReportWhereInput, limit: unknown) {
  const rows = await prisma.report.findMany({
    where,
    include: reportInclude,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limitParam(limit, 1000, 5000),
  });
  return rows.map(serializeReport);
}

const filterToWhere = (f: ReportFilter): Prisma.ReportWhereInput => {
  const range = dateRange(f.from, f.to);
  return {
    ...(f.billId ? { billId: f.billId } : {}),
    ...(f.status ? { status: f.status } : {}),
    ...(f.patient ? { patient: { contains: f.patient } } : {}),
    ...(f.regNo ? { regNo: { contains: f.regNo } } : {}),
    ...(range ? { createdAt: range } : {}),
  };
};

export const listReports = (f: ReportFilter) => find(filterToWhere(f), f.limit);
export const searchReports = (f: ReportFilter) => find(filterToWhere(f), f.limit);
export const todaysReports = (f: ReportFilter) =>
  find({ ...filterToWhere({ ...f, from: undefined, to: undefined }), createdAt: dayRange() }, f.limit);

export async function getReport(reportId: number) {
  const row = await prisma.report.findUnique({ where: { id: reportId }, include: reportInclude });
  if (!row) throw notFound("Report");
  return serializeReport(row);
}

/**
 * Saves results. Body (all optional): { tests: [{id, value}], interpretation, notes, status }.
 * Only `value` of existing result rows can change; rows are never added or
 * removed here (that happens when the bill's tests change).
 */
export async function updateReport(reportId: number, input: unknown, actor: string) {
  const body = asBody(input);

  const current = await prisma.report.findUnique({ where: { id: reportId }, include: reportInclude });
  if (!current) throw notFound("Report");

  let status: string | undefined;
  if (body.status !== undefined) {
    const wanted = text(body.status, 30);
    status = REPORT_STATUSES.find((s) => s.toLowerCase() === wanted.toLowerCase());
    if (!status) throw badRequest(`Status must be one of: ${REPORT_STATUSES.join(", ")}.`);
  }

  const incoming = Array.isArray(body.tests) ? body.tests.map(asBody) : [];
  const byId = new Map(current.tests.map((t) => [t.id, t]));

  await prisma.$transaction(async (tx) => {
    for (const item of incoming) {
      const row = byId.get(Number(item.id));
      if (!row || item.value === undefined) continue;

      const value = text(item.value, 255);
      const reference = item.reference !== undefined ? text(item.reference, 255) : (row.reference ?? "");

      await tx.reportTest.update({
        where: { id: row.id },
        data: {
          value,
          ...(item.reference !== undefined ? { reference: reference || null } : {}),
          ...(item.unit !== undefined ? { unit: text(item.unit, 60) || null } : {}),
          flag: computeFlag(value, reference),
        },
      });
    }

    const finishing = status !== undefined && isDone(status) && !isDone(current.status);
    const reopening = status !== undefined && !isDone(status) && isDone(current.status);

    await tx.report.update({
      where: { id: reportId },
      data: {
        ...(body.interpretation !== undefined ? { interpretation: text(body.interpretation, 20000) } : {}),
        ...(body.notes !== undefined ? { notes: text(body.notes, 20000) } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(finishing ? { reportedAt: new Date(), verifiedBy: actor } : {}),
        ...(reopening ? { reportedAt: null, verifiedBy: null } : {}),
      },
    });

    if (status !== undefined && status !== current.status) {
      await logActivities(tx, [
        { billId: current.billId, userName: actor, type: ActivityType.reportUpdated, summary: `Report marked ${status}.` },
      ]);
    }
  });

  return getReport(reportId);
}
