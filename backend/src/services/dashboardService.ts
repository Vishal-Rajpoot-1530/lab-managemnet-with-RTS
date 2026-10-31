import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { dayRange, iso, toNumber } from "../utils/format.js";

const DAY = 86_400_000;
const LIVE: Prisma.BillWhereInput = { status: { not: "Cancelled" } };

/** How many rows each popup list holds (the totals on the cards are always exact). */
const LIST_LIMIT = 300;

const names = (list: { name: string }[]) => list.map((i) => i.name).join(", ") || "—";

/**
 * Overall overview of the signed-in lab (not just today):
 *  - all patients
 *  - completed bills  = bills with no balance left
 *  - pending bills    = bills that still have a balance
 *  - total collection = every payment received
 */
export async function dashboard() {
  const range = dayRange();
  const today = { gte: new Date(range.gte as unknown as Date), lt: new Date(range.lt as unknown as Date) };

  const [
    patientTotal,
    patientsToday,
    patients,
    completedCount,
    completedBills,
    pendingBills,
    dueTotals,
    collectedTotal,
    collectedToday,
    collections,
    dues,
    activities,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.patient.count({ where: { createdAt: today } }),
    prisma.patient.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: LIST_LIMIT,
      select: { id: true, uhid: true, title: true, firstName: true, lastName: true, sex: true, years: true, mobile: true, createdAt: true },
    }),

    prisma.bill.count({ where: { ...LIVE, balance: { lte: 0 } } }),
    prisma.bill.findMany({
      where: { ...LIVE, balance: { lte: 0 } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: LIST_LIMIT,
      select: {
        id: true, regNo: true, patientName: true, createdAt: true, total: true,
        investigations: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { name: true } },
      },
    }),
    prisma.bill.findMany({
      where: { ...LIVE, balance: { gt: 0 } },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }], // waiting the longest first
      take: LIST_LIMIT,
      select: {
        id: true, regNo: true, patientName: true, createdAt: true, balance: true, received: true,
        investigations: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }], select: { name: true } },
      },
    }),
    prisma.bill.aggregate({ _sum: { balance: true }, _count: { _all: true }, where: { ...LIVE, balance: { gt: 0 } } }),

    prisma.billTransaction.aggregate({ _sum: { amount: true } }),
    prisma.billTransaction.aggregate({ _sum: { amount: true }, where: { paidAt: today } }),
    prisma.billTransaction.findMany({
      orderBy: [{ paidAt: "desc" }, { id: "desc" }],
      take: LIST_LIMIT,
      select: { id: true, amount: true, mode: true, paidAt: true, bill: { select: { regNo: true, patientName: true } } },
    }),

    prisma.bill.findMany({
      where: { ...LIVE, balance: { gt: 0 } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 6,
      select: { id: true, regNo: true, patientName: true, createdAt: true, balance: true },
    }),

    prisma.activity.findMany({ orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 5 }),
  ]);

  const pendingCount = dueTotals._count._all;
  const allBills = completedCount + pendingCount;

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
    kpis: {
      patients: { total: patientTotal, newToday: patientsToday },
      completedBills: { total: completedCount, share: allBills ? Math.round((completedCount / allBills) * 100) : 0 },
      pendingBills: { total: pendingCount, outstanding: toNumber(dueTotals._sum.balance ?? 0) },
      collection: { total: toNumber(collectedTotal._sum.amount ?? 0), today: toNumber(collectedToday._sum.amount ?? 0) },
    },

    dues: dues.map((b) => ({ id: b.id, regNo: b.regNo, patient: b.patientName, createdAt: iso(b.createdAt), due: toNumber(b.balance) })),
    duesSummary: { count: pendingCount, amount: toNumber(dueTotals._sum.balance ?? 0) },
    transactions: collectionRows.slice(0, 6),
    activities: activities.map((a) => ({
      id: a.id, type: a.type, summary: a.summary, user: a.userName ?? "", createdAt: iso(a.createdAt),
    })),

    // popup lists
    patients: patients.map((p) => ({
      id: p.uhid ?? String(p.id),
      patientId: p.id,
      name: [p.title, p.firstName, p.lastName].filter(Boolean).join(" "),
      age: p.years ?? "",
      gender: p.sex ?? "",
      tests: p.mobile ? `Mobile: ${p.mobile}` : "No mobile number",
      createdAt: iso(p.createdAt),
      status: "Registered",
    })),
    completedBills: completedBills.map((b) => ({
      id: b.regNo,
      billId: b.id,
      patient: b.patientName,
      test: names(b.investigations),
      amount: toNumber(b.total),
      createdAt: iso(b.createdAt),
      status: "Paid",
    })),
    pendingBills: pendingBills.map((b) => ({
      id: b.regNo,
      billId: b.id,
      patient: b.patientName,
      test: names(b.investigations),
      amount: toNumber(b.balance),
      createdAt: iso(b.createdAt),
      status: toNumber(b.received) > 0 ? "Partially Paid" : "Unpaid",
    })),
    collections: collectionRows,
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