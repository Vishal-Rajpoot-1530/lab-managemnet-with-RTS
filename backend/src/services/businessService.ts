import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import {
  addDays,
  dateKey,
  dateRange,
  dayRange,
  displayDate,
  displayTime,
  iso,
  money,
  monthRange,
  toNumber,
  todayKey,
} from "../utils/format.js";
import { listBills } from "./billingService.js";

const MODES = ["upi", "cash", "card", "insurance"] as const;
const modeKey = (mode: string): (typeof MODES)[number] | "other" => {
  const m = mode.trim().toLowerCase();
  return (MODES as readonly string[]).includes(m) ? (m as (typeof MODES)[number]) : "other";
};

const activeBill = { status: { not: "Cancelled" } } satisfies Prisma.BillWhereInput;

async function transactionsIn(range: { gte?: Date; lt?: Date } | undefined) {
  return prisma.billTransaction.findMany({
    where: { ...(range ? { paidAt: range } : {}), bill: activeBill },
    include: { bill: { select: { id: true, regNo: true, patientName: true, referrer: true } } },
    orderBy: [{ paidAt: "desc" }, { id: "desc" }],
  });
}

const sum = (values: number[]) => money(values.reduce((a, b) => a + b, 0));

/** GET /api/business */
export async function overview(params: { from?: string; to?: string }) {
  const range = dateRange(params.from, params.to);
  const [bills, rows] = await Promise.all([
    listBills({ from: params.from, to: params.to, limit: 1000 }),
    transactionsIn(range),
  ]);

  const transactions = rows.map((row) => ({
    id: row.id,
    billId: row.billId,
    regNo: row.bill.regNo,
    patient: row.bill.patientName,
    amount: toNumber(row.amount),
    method: row.mode,
    createdAt: iso(row.paidAt),
    status: "Active",
  }));

  return { income: sum(transactions.map((t) => t.amount)), bills, transactions };
}

/** GET /api/business/daily?date=YYYY-MM-DD   (money actually received that day) */
export async function daily(date?: string) {
  const day = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : todayKey();
  const range = dayRange(day);

  const [rows, newBills, expenses] = await Promise.all([
    transactionsIn(range),
    prisma.bill.aggregate({
      where: { ...activeBill, createdAt: range },
      _sum: { collectionCharge: true, total: true, discount: true, balance: true },
      _count: true,
    }),
    prisma.expense.aggregate({ where: { expenseDate: new Date(`${day}T00:00:00.000Z`) }, _sum: { amount: true } }),
  ]);

  const transactions = rows.map((row) => ({
    id: row.id,
    billId: row.billId,
    registrationNo: row.bill.regNo,
    patientName: row.bill.patientName,
    referrerName: row.bill.referrer,
    amount: toNumber(row.amount),
    paymentMode: row.mode,
    receivedBy: row.receivedBy ?? "",
    date: displayDate(row.paidAt),
    time: displayTime(row.paidAt),
  }));

  const totalIncome = sum(transactions.map((t) => t.amount));
  const spent = money(toNumber(expenses._sum.amount));

  return {
    success: true,
    date: day,
    summary: {
      totalIncome,
      collectionCharge: money(toNumber(newBills._sum.collectionCharge)),
      expenses: spent,
      netIncome: money(totalIncome - spent),
      totalBills: newBills._count,
      totalAmount: money(toNumber(newBills._sum.total)),
      discountAmount: money(toNumber(newBills._sum.discount)),
      pendingAmount: money(toNumber(newBills._sum.balance)),
    },
    total: transactions.length,
    transactions,
    items: transactions,
  };
}

/** GET /api/business/monthly?month=YYYY-MM   (one row per day, split by payment mode) */
export async function monthly(month?: string) {
  const key = month ?? todayKey().slice(0, 7);
  const range = monthRange(key) ?? monthRange(todayKey().slice(0, 7))!;
  const rows = await transactionsIn(range);

  const days = new Map<string, Record<string, number>>();

  for (const row of rows) {
    const day = dateKey(row.paidAt);
    const entry = days.get(day) ?? { upi: 0, cash: 0, card: 0, insurance: 0, other: 0, total: 0 };
    const amount = toNumber(row.amount);
    const mode = modeKey(row.mode);

    entry[mode] = money(entry[mode]! + amount);
    entry.total = money(entry.total! + amount);
    days.set(day, entry);
  }

  const items = [...days.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, entry]) => ({ id: date, day: date, date, ...entry }));

  const total = (field: string) => sum(items.map((item) => (item as Record<string, number | string>)[field] as number));

  return {
    success: true,
    month: key,
    total: items.length,
    summary: {
      totalReceived: total("total"),
      upi: total("upi"),
      cash: total("cash"),
      card: total("card"),
      insurance: total("insurance"),
      other: total("other"),
    },
    items,
  };
}

/** GET /api/business/referral-reports?period=today|week|month  or  ?from=&to= */
export async function referralReports(params: { from?: string; to?: string; period?: string }) {
  const today = todayKey();
  let { from, to } = params;

  if (params.period === "today") from = to = today;
  if (params.period === "week") [from, to] = [addDays(today, -6), today];
  if (params.period === "month") [from, to] = [`${today.slice(0, 7)}-01`, today];

  const range = dateRange(from, to);

  const [filtered, everything, referrers] = await Promise.all([
    prisma.bill.findMany({
      where: { ...activeBill, ...(range ? { createdAt: range } : {}) },
      select: { referrerId: true, referrer: true, total: true, received: true, balance: true, discount: true },
    }),
    prisma.bill.groupBy({ by: ["referrerId", "referrer"], where: activeBill, _count: true }),
    prisma.referrer.findMany({ select: { id: true, mobile: true } }),
  ]);

  const contactById = new Map(referrers.map((r) => [r.id, r.mobile ?? ""]));
  const totalCases = new Map(everything.map((g) => [`${g.referrerId ?? 0}|${g.referrer}`, g._count]));

  const groups = new Map<string, Record<string, string | number | null>>();

  for (const bill of filtered) {
    const key = `${bill.referrerId ?? 0}|${bill.referrer}`;
    const row = groups.get(key) ?? {
      referrerId: bill.referrerId,
      referrerName: bill.referrer,
      referrer: bill.referrer,
      contact: bill.referrerId ? (contactById.get(bill.referrerId) ?? "") : "",
      totalCases: totalCases.get(key) ?? 0,
      filteredCases: 0,
      totalBills: 0,
      totalAmount: 0,
      receivedAmount: 0,
      pendingAmount: 0,
      discountAmount: 0,
    };

    row.filteredCases = (row.filteredCases as number) + 1;
    row.totalBills = row.filteredCases;
    row.totalAmount = money((row.totalAmount as number) + toNumber(bill.total));
    row.receivedAmount = money((row.receivedAmount as number) + toNumber(bill.received));
    row.pendingAmount = money((row.pendingAmount as number) + toNumber(bill.balance));
    row.discountAmount = money((row.discountAmount as number) + toNumber(bill.discount));
    groups.set(key, row);
  }

  const items = [...groups.values()].sort((a, b) => (b.totalAmount as number) - (a.totalAmount as number));
  const add = (field: string) => sum(items.map((i) => i[field] as number));

  return {
    success: true,
    total: items.length,
    summary: {
      totalBills: filtered.length,
      totalAmount: add("totalAmount"),
      receivedAmount: add("receivedAmount"),
      pendingAmount: add("pendingAmount"),
    },
    items,
  };
}

/** GET /api/business/dues   (bills that still have a balance) */
export async function dues(params: { from?: string; to?: string }) {
  const bills = await listBills({ ...params, status: "due" });

  const items = bills.map((bill) => ({
    id: bill.id,
    reg: bill.regNo,
    regNo: bill.regNo,
    date: displayDate(new Date(bill.createdAt)),
    patient: bill.patientName,
    ref: bill.referrerName,
    total: bill.total,
    paid: bill.received,
    discount: bill.discount,
    balance: bill.balance,
    status: "Due",
  }));

  return {
    success: true,
    total: items.length,
    summary: { totalDue: sum(items.map((i) => i.balance)) },
    items,
  };
}

/** GET /api/dashboard */
export async function dashboard() {
  const today = dayRange();

  const [billsToday, incomeToday, pendingReports, due, patients, recent] = await Promise.all([
    prisma.bill.count({ where: { ...activeBill, createdAt: today } }),
    prisma.billTransaction.aggregate({ where: { paidAt: today, bill: activeBill }, _sum: { amount: true } }),
    prisma.report.count({ where: { status: { not: "Completed" }, bill: activeBill } }),
    prisma.bill.aggregate({ where: { ...activeBill, balance: { gt: 0 } }, _sum: { balance: true }, _count: true }),
    prisma.patient.count(),
    prisma.bill.findMany({
      where: activeBill,
      orderBy: { id: "desc" },
      take: 5,
      select: { id: true, regNo: true, patientName: true, total: true, balance: true, createdAt: true },
    }),
  ]);

  return {
    module: "dashboard",
    items: [],
    summary: {
      billsToday,
      incomeToday: money(toNumber(incomeToday._sum.amount)),
      pendingReports,
      dueBills: due._count,
      dueAmount: money(toNumber(due._sum.balance)),
      totalPatients: patients,
    },
    recentBills: recent.map((b) => ({
      id: b.id,
      regNo: b.regNo,
      patientName: b.patientName,
      total: toNumber(b.total),
      balance: toNumber(b.balance),
      createdAt: iso(b.createdAt),
    })),
  };
}
