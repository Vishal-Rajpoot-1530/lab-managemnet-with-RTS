// import type { Prisma } from "@prisma/client";
// import { prisma } from "../lib/prisma.js";
// import { badRequest, notFound } from "../utils/ApiError.js";
// import { dateRange, dayRange, iso } from "../utils/format.js";
// import { asBody, limitParam, text } from "../utils/validate.js";
// import { ActivityType, logActivities } from "./activityService.js";
// import { computeFlag } from "./reportBuilder.js";

// const reportInclude = {
//   tests: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
// } satisfies Prisma.ReportInclude;

// type ReportRow = Prisma.ReportGetPayload<{ include: typeof reportInclude }>;

// export const REPORT_STATUSES = ["New", "In progress", "Completed"] as const;
// const isDone = (status: string) => ["completed", "complete", "reported"].includes(status.toLowerCase());

// export function serializeReport(row: ReportRow) {
//   return {
//     id: row.id,
//     billId: row.billId,
//     regNo: row.regNo,
//     registrationNo: row.regNo,
//     patient: row.patient,
//     patientName: row.patient,
//     age: row.age ?? "",
//     referrer: row.referrer ?? "",
//     referrerName: row.referrer ?? "",
//     status: row.status,
//     createdAt: iso(row.createdAt),
//     reportedAt: iso(row.reportedAt),
//     verifiedBy: row.verifiedBy ?? "",
//     tests: row.tests.map((t) => ({
//       id: t.id,
//       section: t.section ?? "LABORATORY",
//       name: t.name,
//       value: t.value ?? "",
//       unit: t.unit ?? "",
//       reference: t.reference ?? "",
//       flag: t.flag ?? "",
//     })),
//     interpretation: row.interpretation ?? "",
//     notes: row.notes ?? "",
//   };
// }

// export interface ReportFilter {
//   billId?: number;
//   status?: string;
//   patient?: string;
//   regNo?: string;
//   from?: string;
//   to?: string;
//   limit?: unknown;
// }

// async function find(where: Prisma.ReportWhereInput, limit: unknown) {
//   const rows = await prisma.report.findMany({
//     where,
//     include: reportInclude,
//     orderBy: [{ createdAt: "desc" }, { id: "desc" }],
//     take: limitParam(limit, 1000, 5000),
//   });
//   return rows.map(serializeReport);
// }

// const filterToWhere = (f: ReportFilter): Prisma.ReportWhereInput => {
//   const range = dateRange(f.from, f.to);
//   return {
//     ...(f.billId ? { billId: f.billId } : {}),
//     ...(f.status ? { status: f.status } : {}),
//     ...(f.patient ? { patient: { contains: f.patient } } : {}),
//     ...(f.regNo ? { regNo: { contains: f.regNo } } : {}),
//     ...(range ? { createdAt: range } : {}),
//   };
// };

// /** BillInvestigation.modality value for laboratory tests (others: usg, xray, ctScan, ...). */
// const LAB_MODALITY = "lab";

// export const listReports = (f: ReportFilter) => find(filterToWhere(f), f.limit);
// export const todaysReports = (f: ReportFilter) =>
//   find({ ...filterToWhere({ ...f, from: undefined, to: undefined }), createdAt: dayRange() }, f.limit);

// /**
//  * Search lab cases. This searches the BILLS that contain at least one lab test
//  * (radiology such as USG / X-ray is left out), so a bill appears here as soon as
//  * it is saved, even before a report row exists. Only the lab tests are listed.
//  * Each result carries its report status ("New" until a report is started).
//  * The patient text matches name, mobile number or registration number.
//  */
// export async function searchReports(f: ReportFilter) {
//   const range = dateRange(f.from, f.to);
//   const and: Prisma.BillWhereInput[] = [
//     { status: { not: "Cancelled" } },
//     { investigations: { some: { modality: LAB_MODALITY } } },
//   ];

//   if (f.billId) and.push({ id: f.billId });
//   if (f.regNo) and.push({ regNo: { contains: f.regNo } });
//   if (range) and.push({ createdAt: range });
//   if (f.patient) {
//     and.push({
//       OR: [
//         { patientName: { contains: f.patient } },
//         { mobile: { contains: f.patient } },
//         { regNo: { contains: f.patient } },
//       ],
//     });
//   }
//   if (f.status) {
//     // A bill with no report yet counts as "New".
//     and.push(
//       f.status.toLowerCase() === "new"
//         ? { OR: [{ report: { is: null } }, { report: { is: { status: f.status } } }] }
//         : { report: { is: { status: f.status } } },
//     );
//   }

//   const rows = await prisma.bill.findMany({
//     where: { AND: and },
//     include: {
//       report: { select: { id: true, status: true, reportedAt: true, verifiedBy: true } },
//       investigations: {
//         where: { modality: LAB_MODALITY },
//         orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
//         select: { name: true },
//       },
//     },
//     orderBy: [{ createdAt: "desc" }, { id: "desc" }],
//     take: limitParam(f.limit, 1000, 5000),
//   });

//   return rows.map((b) => ({
//     id: b.id, // bill id: unique per row, whether or not a report exists yet
//     billId: b.id,
//     reportId: b.report?.id ?? null,
//     regNo: b.regNo,
//     registrationNo: b.regNo,
//     patient: b.patientName,
//     patientName: b.patientName,
//     mobile: b.mobile,
//     age: b.age ?? "",
//     referrer: b.referrer,
//     referrerName: b.referrer,
//     status: b.report?.status ?? "New",
//     createdAt: iso(b.createdAt),
//     reportedAt: iso(b.report?.reportedAt ?? null),
//     verifiedBy: b.report?.verifiedBy ?? "",
//     tests: b.investigations.map((t) => ({ name: t.name })),
//   }));
// }

// export async function getReport(reportId: number) {
//   const row = await prisma.report.findUnique({ where: { id: reportId }, include: reportInclude });
//   if (!row) throw notFound("Report");
//   return serializeReport(row);
// }

// /**
//  * Saves results. Body (all optional): { tests: [{id, value}], interpretation, notes, status }.
//  * Only `value` of existing result rows can change; rows are never added or
//  * removed here (that happens when the bill's tests change).
//  */
// export async function updateReport(reportId: number, input: unknown, actor: string) {
//   const body = asBody(input);

//   const current = await prisma.report.findUnique({ where: { id: reportId }, include: reportInclude });
//   if (!current) throw notFound("Report");

//   let status: string | undefined;
//   if (body.status !== undefined) {
//     const wanted = text(body.status, 30);
//     status = REPORT_STATUSES.find((s) => s.toLowerCase() === wanted.toLowerCase());
//     if (!status) throw badRequest(`Status must be one of: ${REPORT_STATUSES.join(", ")}.`);
//   }

//   const incoming = Array.isArray(body.tests) ? body.tests.map(asBody) : [];
//   const byId = new Map(current.tests.map((t) => [t.id, t]));

//   await prisma.$transaction(async (tx) => {
//     for (const item of incoming) {
//       const row = byId.get(Number(item.id));
//       if (!row || item.value === undefined) continue;

//       const value = text(item.value, 255);
//       const reference = item.reference !== undefined ? text(item.reference, 255) : (row.reference ?? "");

//       await tx.reportTest.update({
//         where: { id: row.id },
//         data: {
//           value,
//           ...(item.reference !== undefined ? { reference: reference || null } : {}),
//           ...(item.unit !== undefined ? { unit: text(item.unit, 60) || null } : {}),
//           flag: computeFlag(value, reference),
//         },
//       });
//     }

//     const finishing = status !== undefined && isDone(status) && !isDone(current.status);
//     const reopening = status !== undefined && !isDone(status) && isDone(current.status);

//     await tx.report.update({
//       where: { id: reportId },
//       data: {
//         ...(body.interpretation !== undefined ? { interpretation: text(body.interpretation, 20000) } : {}),
//         ...(body.notes !== undefined ? { notes: text(body.notes, 20000) } : {}),
//         ...(status !== undefined ? { status } : {}),
//         ...(finishing ? { reportedAt: new Date(), verifiedBy: actor } : {}),
//         ...(reopening ? { reportedAt: null, verifiedBy: null } : {}),
//       },
//     });

//     if (status !== undefined && status !== current.status) {
//       await logActivities(tx, [
//         { billId: current.billId, userName: actor, type: ActivityType.reportUpdated, summary: `Report marked ${status}.` },
//       ]);
//     }
//   });

//   return getReport(reportId);
// }



import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { badRequest, notFound } from "../utils/ApiError.js";
import { dateRange, dayRange, displayDate, iso } from "../utils/format.js";
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

/** BillInvestigation.modality value for laboratory tests (others: usg, xray, ctScan, ...). */
const LAB_MODALITY = "lab";

export const listReports = (f: ReportFilter) => find(filterToWhere(f), f.limit);
export const todaysReports = (f: ReportFilter) =>
  find({ ...filterToWhere({ ...f, from: undefined, to: undefined }), createdAt: dayRange() }, f.limit);

/**
 * Search lab cases. This searches the BILLS that contain at least one lab test
 * (radiology such as USG / X-ray is left out), so a bill appears here as soon as
 * it is saved, even before a report row exists. Only the lab tests are listed.
 * Each result carries its report status ("New" until a report is started).
 * The patient text matches name, mobile number or registration number.
 */
export async function searchReports(f: ReportFilter) {
  const range = dateRange(f.from, f.to);
  const and: Prisma.BillWhereInput[] = [
    { status: { not: "Cancelled" } },
    { investigations: { some: { modality: LAB_MODALITY } } },
  ];

  if (f.billId) and.push({ id: f.billId });
  if (f.regNo) and.push({ regNo: { contains: f.regNo } });
  if (range) and.push({ createdAt: range });
  if (f.patient) {
    and.push({
      OR: [
        { patientName: { contains: f.patient } },
        { mobile: { contains: f.patient } },
        { regNo: { contains: f.patient } },
      ],
    });
  }
  if (f.status) {
    // A bill with no report yet counts as "New".
    and.push(
      f.status.toLowerCase() === "new"
        ? { OR: [{ report: { is: null } }, { report: { is: { status: f.status } } }] }
        : { report: { is: { status: f.status } } },
    );
  }

  const rows = await prisma.bill.findMany({
    where: { AND: and },
    include: {
      report: { select: { id: true, status: true, reportedAt: true, verifiedBy: true } },
      investigations: {
        where: { modality: LAB_MODALITY },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { name: true },
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limitParam(f.limit, 1000, 5000),
  });

  return rows.map((b) => ({
    id: b.id, // bill id: unique per row, whether or not a report exists yet
    billId: b.id,
    reportId: b.report?.id ?? null,
    regNo: b.regNo,
    registrationNo: b.regNo,
    patient: b.patientName,
    patientName: b.patientName,
    mobile: b.mobile,
    age: b.age ?? "",
    referrer: b.referrer,
    referrerName: b.referrer,
    status: b.report?.status ?? "New",
    createdAt: iso(b.createdAt),
    reportedAt: iso(b.report?.reportedAt ?? null),
    verifiedBy: b.report?.verifiedBy ?? "",
    tests: b.investigations.map((t) => ({ name: t.name })),
  }));
}

/** Scan types a bill can contain (BillInvestigation.modality). */
const RADIOLOGY_MODALITIES = ["usg", "xray", "digitalXray", "ctScan", "mri"];

/**
 * Radiology cases (USG, X-ray, CT scan, MRI ...): one row per bill that contains
 * that kind of scan. Reads the bills, so a case appears as soon as the bill is
 * saved, even before a radiology report exists. The status comes from the
 * radiology reports of that bill: New -> In progress -> Completed.
 */
export async function listRadiologyCases(
  modality: string,
  f: { from?: string; to?: string; status?: string; q?: string; limit?: unknown },
) {
  if (!RADIOLOGY_MODALITIES.includes(modality)) throw badRequest("Unknown scan type.");

  const range = dateRange(f.from, f.to);
  const q = f.q?.trim();

  const and: Prisma.BillWhereInput[] = [
    { status: { not: "Cancelled" } },
    { investigations: { some: { modality } } },
  ];
  if (range) and.push({ createdAt: range });
  if (q) {
    and.push({
      OR: [
        { patientName: { contains: q } },
        { mobile: { contains: q } },
        { regNo: { contains: q } },
        { investigations: { some: { modality, name: { contains: q } } } },
      ],
    });
  }

  const bills = await prisma.bill.findMany({
    where: { AND: and },
    include: {
      investigations: {
        where: { modality },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { name: true },
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limitParam(f.limit, 1000, 5000),
  });
  if (!bills.length) return [];

  const scanReports = await prisma.radiologyReport.findMany({
    where: { billId: { in: bills.map((b) => b.id) }, modality },
    select: { id: true, billId: true, status: true },
  });

  const reportsByBill = new Map<number, typeof scanReports>();
  for (const r of scanReports) reportsByBill.set(r.billId, [...(reportsByBill.get(r.billId) ?? []), r]);

  const rows = bills.map((b) => {
    const mine = reportsByBill.get(b.id) ?? [];

    let status = "New";
    if (mine.length) {
      const allDone = mine.every((r) => isDone(r.status)) && mine.length >= b.investigations.length;
      const started = mine.some((r) => isDone(r.status) || r.status.toLowerCase() === "in progress");
      status = allDone ? "Completed" : started ? "In progress" : "New";
    }

    return {
      id: b.id, // bill id: unique per row
      billId: b.id,
      reportId: mine[0]?.id ?? null,
      regNo: b.regNo,
      registrationNo: b.regNo,
      date: displayDate(b.createdAt),
      createdAt: iso(b.createdAt),
      patient: b.patientName,
      patientName: b.patientName,
      mobile: b.mobile,
      age: b.age ?? "",
      sex: b.sex ?? "",
      referrerName: b.referrer,
      investigations: b.investigations.map((i) => i.name).join(", "),
      tests: b.investigations.map((i) => ({ name: i.name })),
      status,
    };
  });

  const wanted = f.status?.trim().toLowerCase();
  return wanted ? rows.filter((r) => r.status.toLowerCase() === wanted) : rows;
}

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