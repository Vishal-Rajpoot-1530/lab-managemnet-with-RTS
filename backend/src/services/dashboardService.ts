import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { dayRange, iso, toNumber } from "../utils/format.js";

const DAY = 86_400_000;
const LIVE: Prisma.BillWhereInput = { status: { not: "Cancelled" } };

/** Lab report that still needs work: no report yet, or one that is not Completed. */
const PENDING: Prisma.BillWhereInput = {
  ...LIVE,
  investigations: { some: { modality: "lab" } },
  OR: [{ report: { is: null } }, { report: { is: { status: { not: "Completed" } } } }],
};

const patientStatus = (reportStatus?: string | null) => {
  const s = (reportStatus ?? "").toLowerCase();
  if (["completed", "complete", "reported"].includes(s)) return "Completed";
  if (s === "in progress") return "In Progress";
  return "Registered";
};

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
    completedToday,
    completedYesterday,
    inProgress,
    pendingTotal,
    pendingToday,
    collectedToday,
    collectedYesterday,
    dues,
    dueTotals,
    transactions,
    activities,
  ] = await Promise.all([
    prisma.bill.findMany({
      where: { ...LIVE, createdAt: today },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 300,
      select: {
        id: true, regNo: true, patientName: true, age: true, sex: true, createdAt: true,
        investigations: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { name: true } },
        report: { select: { status: true } },
      },
    }),
    prisma.bill.count({ where: { ...LIVE, createdAt: yesterday } }),

    prisma.report.findMany({
      where: { status: "Completed", reportedAt: today },
      orderBy: [{ reportedAt: "desc" }, { id: "desc" }],
      take: 300,
      select: {
        id: true, regNo: true, patient: true, status: true, reportedAt: true,
        bill: { select: { investigations: { where: { modality: "lab" }, select: { name: true } } } },
      },
    }),
    prisma.report.count({ where: { status: "Completed", reportedAt: yesterday } }),
    prisma.report.count({ where: { status: "In progress" } }),

    prisma.bill.count({ where: PENDING }),
    prisma.bill.count({ where: { ...PENDING, createdAt: today } }),

    prisma.billTransaction.aggregate({ _sum: { amount: true }, where: { paidAt: today } }),
    prisma.billTransaction.aggregate({ _sum: { amount: true }, where: { paidAt: yesterday } }),

    prisma.bill.findMany({
      where: { ...LIVE, balance: { gt: 0 } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 6,
      select: { id: true, regNo: true, patientName: true, createdAt: true, balance: true },
    }),
    prisma.bill.aggregate({ _sum: { balance: true }, _count: { _all: true }, where: { ...LIVE, balance: { gt: 0 } } }),

    prisma.billTransaction.findMany({
      where: { paidAt: today },
      orderBy: [{ paidAt: "desc" }, { id: "desc" }],
      take: 6,
      select: { id: true, amount: true, paidAt: true, bill: { select: { regNo: true, patientName: true } } },
    }),

    prisma.activity.findMany({ orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 5 }),
  ]);

  return {
    date: iso(start),
    kpis: {
      patients: { today: billsToday.length, yesterday: billsYesterday },
      reportsCompleted: { today: completedToday.length, yesterday: completedYesterday, awaitingReview: inProgress },
      pending: { total: pendingTotal, createdToday: pendingToday },
      collection: { today: toNumber(collectedToday._sum.amount ?? 0), yesterday: toNumber(collectedYesterday._sum.amount ?? 0) },
    },
    dues: dues.map((b) => ({ id: b.id, regNo: b.regNo, patient: b.patientName, createdAt: iso(b.createdAt), due: toNumber(b.balance) })),
    duesSummary: { count: dueTotals._count._all, amount: toNumber(dueTotals._sum.balance ?? 0) },
    transactions: transactions.map((t) => ({
      id: t.id, regNo: t.bill.regNo, patient: t.bill.patientName, amount: toNumber(t.amount), paidAt: iso(t.paidAt),
    })),
    activities: activities.map((a) => ({
      id: a.id, type: a.type, summary: a.summary, user: a.userName ?? "", createdAt: iso(a.createdAt),
    })),
    todayPatients: billsToday.map((b) => ({
      id: b.regNo, billId: b.id, name: b.patientName, age: b.age ?? "", gender: b.sex ?? "",
      tests: b.investigations.map((i) => i.name).join(", ") || "—", status: patientStatus(b.report?.status),
    })),
    completedReports: completedToday.map((r) => ({
      id: r.regNo, reportId: r.id, patient: r.patient, status: "Completed", time: iso(r.reportedAt),
      test: r.bill.investigations.map((i) => i.name).join(", ") || "Laboratory report",
    })),
  };
}