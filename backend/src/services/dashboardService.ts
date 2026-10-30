
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { dayRange, iso, toNumber } from "../utils/format.js";

const DAY = 86_400_000;
const LIVE: Prisma.BillWhereInput = { status: { not: "Cancelled" } };

/** Statuses that mean "the report is finished" (matched without regard to upper/lower case). */
const DONE = ["Completed", "Complete", "Reported", "Final", "Finalized", "Verified", "Done"];

/**
 * A report is finished when it has a reported time (set when it is marked completed, cleared
 * when it is reopened) or its status is one of the finished statuses above.
 */
const FINISHED = { OR: [{ reportedAt: { not: null } }, { status: { in: DONE } }] } satisfies Prisma.ReportWhereInput;

/** Lab bills whose report is missing or not finished yet. */
const PENDING: Prisma.BillWhereInput = {
  ...LIVE,
  investigations: { some: { modality: "lab" } },
  NOT: { report: { is: FINISHED } },
};

const patientStatus = (reportStatus?: string | null, reportedAt?: Date | null) => {
  const s = (reportStatus ?? "").toLowerCase();
  if (reportedAt || DONE.some((d) => d.toLowerCase() === s)) return "Completed";
  if (s === "in progress") return "In Progress";
  return "Registered";
};

/** Finished in `range`: reported then, or (no reported time) set to a finished status then. */
const completedIn = (range: { gte: Date; lt: Date }) => ({
  OR: [{ reportedAt: range }, { reportedAt: null, status: { in: DONE }, updatedAt: range }],
});

/** Everything the Dashboard page shows, for the signed-in lab. */
export async function dashboard() {
  const range = dayRange();
  const start = new Date(range.gte as unknown as Date);
  const end = new Date(range.lt as unknown as Date);
  const today = { gte: start, lt: end };
  const yesterday = { gte: new Date(start.getTime() - DAY), lt: start };

  const [
    billsToday,
    billsYesterday,
    labCompletedToday,
    scanCompletedToday,
    labCompletedYesterday,
    scanCompletedYesterday,
    inProgress,
    pendingTotal,
    pendingToday,
    pendingBills,
    collectedTodayTotal,
    collectedYesterday,
    collections,
    dues,
    dueTotals,
    activities,
  ] = await Promise.all([
    prisma.bill.findMany({
      where: { ...LIVE, createdAt: today },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 300,
      select: {
        id: true, regNo: true, patientName: true, age: true, sex: true, createdAt: true,
        investigations: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { name: true } },
        report: { select: { status: true, reportedAt: true } },
      },
    }),
    prisma.bill.count({ where: { ...LIVE, createdAt: yesterday } }),

    // Reports completed: laboratory reports ...
    prisma.report.findMany({
      where: completedIn(today) satisfies Prisma.ReportWhereInput,
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      take: 300,
      select: {
        id: true, regNo: true, patient: true, reportedAt: true, updatedAt: true,
        bill: { select: { investigations: { where: { modality: "lab" }, select: { name: true } } } },
      },
    }),
    // ... and scan reports (USG, X-ray, CT, ...). A scan report counts once it has a reported time.
    prisma.radiologyReport.findMany({
      where: completedIn(today) satisfies Prisma.RadiologyReportWhereInput,
      orderBy: [{ reportedAt: "desc" }, { id: "desc" }],
      take: 300,
      select: { id: true, studyName: true, modality: true, reportedAt: true, updatedAt: true, bill: { select: { regNo: true, patientName: true } } },
    }),
    prisma.report.count({ where: completedIn(yesterday) }),
    prisma.radiologyReport.count({ where: completedIn(yesterday) }),
    prisma.report.count({ where: { status: "In progress" } }),

    // Pending reports: lab bills whose report is missing or not completed.
    prisma.bill.count({ where: PENDING }),
    prisma.bill.count({ where: { ...PENDING, createdAt: today } }),
    prisma.bill.findMany({
      where: PENDING,
      orderBy: [{ createdAt: "asc" }, { id: "asc" }], // longest waiting first
      take: 300,
      select: {
        id: true, regNo: true, patientName: true, createdAt: true,
        investigations: { where: { modality: "lab" }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { name: true } },
        report: { select: { status: true } },
      },
    }),

    prisma.billTransaction.aggregate({ _sum: { amount: true }, where: { paidAt: today } }),
    prisma.billTransaction.aggregate({ _sum: { amount: true }, where: { paidAt: yesterday } }),
    prisma.billTransaction.findMany({
      where: { paidAt: today },
      orderBy: [{ paidAt: "desc" }, { id: "desc" }],
      take: 300,
      select: { id: true, amount: true, mode: true, paidAt: true, bill: { select: { regNo: true, patientName: true } } },
    }),

    prisma.bill.findMany({
      where: { ...LIVE, balance: { gt: 0 } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 6,
      select: { id: true, regNo: true, patientName: true, createdAt: true, balance: true },
    }),
    prisma.bill.aggregate({ _sum: { balance: true }, _count: { _all: true }, where: { ...LIVE, balance: { gt: 0 } } }),

    prisma.activity.findMany({ orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 5 }),
  ]);

  // ---- completed reports (lab + scans), newest first
  const completedReports = [
    ...labCompletedToday.map((r) => ({
      id: r.regNo,
      reportId: r.id,
      patient: r.patient,
      status: "Completed",
      kind: "Laboratory",
      time: iso(r.reportedAt ?? r.updatedAt),
      test: r.bill.investigations.map((i) => i.name).join(", ") || "Laboratory report",
    })),
    ...scanCompletedToday.map((r) => ({
      id: r.bill.regNo,
      reportId: r.id,
      patient: r.bill.patientName,
      status: "Completed",
      kind: r.modality,
      time: iso(r.reportedAt ?? r.updatedAt),
      test: r.studyName,
    })),
  ].sort((a, b) => String(b.time).localeCompare(String(a.time)));

  // ---- pending reports
  const pendingReports = pendingBills.map((b) => ({
    id: b.regNo,
    billId: b.id,
    patient: b.patientName,
    status: (b.report?.status ?? "").toLowerCase() === "in progress" ? "In Progress" : "Pending",
    createdAt: iso(b.createdAt),
    test: b.investigations.map((i) => i.name).join(", ") || "Laboratory report",
  }));

  // ---- money received today
  const collectionRows = collections.map((t) => ({
    id: t.id,
    regNo: t.bill.regNo,
    patient: t.bill.patientName,
    amount: toNumber(t.amount),
    status: "Paid",
    test: `${t.mode ? String(t.mode).charAt(0).toUpperCase() + String(t.mode).slice(1) : "Cash"} payment`,
    time: iso(t.paidAt),
    paidAt: iso(t.paidAt),
  }));

  return {
    date: iso(start),
    kpis: {
      patients: { today: billsToday.length, yesterday: billsYesterday },
      reportsCompleted: {
        today: completedReports.length,
        yesterday: labCompletedYesterday + scanCompletedYesterday,
        awaitingReview: inProgress,
      },
      pending: { total: pendingTotal, createdToday: pendingToday },
      collection: { today: toNumber(collectedTodayTotal._sum.amount ?? 0), yesterday: toNumber(collectedYesterday._sum.amount ?? 0) },
    },
    dues: dues.map((b) => ({ id: b.id, regNo: b.regNo, patient: b.patientName, createdAt: iso(b.createdAt), due: toNumber(b.balance) })),
    duesSummary: { count: dueTotals._count._all, amount: toNumber(dueTotals._sum.balance ?? 0) },
    transactions: collectionRows.slice(0, 6),
    collections: collectionRows,
    activities: activities.map((a) => ({
      id: a.id, type: a.type, summary: a.summary, user: a.userName ?? "", createdAt: iso(a.createdAt),
    })),
    todayPatients: billsToday.map((b) => ({
      id: b.regNo, billId: b.id, name: b.patientName, age: b.age ?? "", gender: b.sex ?? "",
      tests: b.investigations.map((i) => i.name).join(", ") || "—", status: patientStatus(b.report?.status, b.report?.reportedAt),
    })),
    completedReports,
    pendingReports,
  };
}

// ---------------------------------------------------------------------
// Due reports (Business > Due reports)
// ---------------------------------------------------------------------
/** An unpaid bill older than this many days is shown as "Overdue". */
const OVERDUE_DAYS = 30;

/** YYYY-MM-DD .. YYYY-MM-DD as whole local days. Anything else is ignored. */
function dayWindow(from?: string, to?: string): { gte?: Date; lt?: Date } {
  const parse = (value?: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
    return m ? { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) } : null;
  };
  const a = parse(from);
  const b = parse(to);
  return {
    ...(a ? { gte: new Date(a.y, a.m - 1, a.d) } : {}),
    ...(b ? { lt: new Date(b.y, b.m - 1, b.d + 1) } : {}),
  };
}

/** Bills that still have a balance to pay, newest first. */
export async function dueReports(f: { from?: string; to?: string; q?: string }) {
  const window = dayWindow(f.from, f.to);
  const q = f.q?.trim();

  const bills = await prisma.bill.findMany({
    where: {
      ...LIVE,
      balance: { gt: 0 },
      ...(window.gte || window.lt ? { createdAt: window } : {}),
      ...(q
        ? { OR: [{ patientName: { contains: q } }, { regNo: { contains: q } }, { mobile: { contains: q } }, { uhid: { contains: q } }] }
        : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 2000,
    select: {
      id: true, regNo: true, patientName: true, patientId: true, uhid: true, mobile: true,
      createdAt: true, total: true, discount: true, received: true, balance: true,
    },
  });

  const now = Date.now();

  return bills.map((b) => {
    const received = toNumber(b.received);
    const ageDays = (now - b.createdAt.getTime()) / DAY;

    return {
      id: b.id,
      billNo: b.regNo,
      patientName: b.patientName,
      patientId: b.uhid ?? (b.patientId ? String(b.patientId) : ""),
      mobile: b.mobile,
      date: iso(b.createdAt),
      total: toNumber(b.total),
      discount: toNumber(b.discount),
      paid: received,
      outstanding: toNumber(b.balance),
      status: ageDays > OVERDUE_DAYS ? "Overdue" : received > 0 ? "Partially Paid" : "Pending",
    };
  });
}