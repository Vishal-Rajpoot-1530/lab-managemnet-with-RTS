import { Router } from "express";
import { store } from "../store.js";
import type { Bill, BillingSummary } from "../types/domain.js";
import { queryString } from "../utils/request.js";

type SummaryTotals = Omit<BillingSummary, "totalBills">;

const r = Router();

const isActive = (bill: Bill): boolean => bill.status !== "Cancelled";

/** Adds a bill's amounts onto an aggregate row. */
function accumulate(row: BillingSummary, bill: Bill): void {
  row.totalBills += 1;
  row.totalAmount += Number(bill.total || 0);
  row.receivedAmount += Number(bill.received || 0);
  row.pendingAmount += Number(bill.balance || 0);
  row.discountAmount += Number(bill.discount || 0);
}

const emptySummary = (): BillingSummary => ({
  totalBills: 0,
  totalAmount: 0,
  receivedAmount: 0,
  pendingAmount: 0,
  discountAmount: 0,
});

function sumTotals(items: BillingSummary[]): SummaryTotals {
  return {
    totalAmount: items.reduce((sum, item) => sum + item.totalAmount, 0),
    receivedAmount: items.reduce((sum, item) => sum + item.receivedAmount, 0),
    pendingAmount: items.reduce((sum, item) => sum + item.pendingAmount, 0),
    discountAmount: items.reduce((sum, item) => sum + item.discountAmount, 0),
  };
}

// GET /api/business
// Returns overall billing and transaction information.
r.get("/", (_req, res) => {
  const bills = store.bills || [];

  const active = bills.filter(isActive);

  const income = active.reduce(
    (sum, bill) => sum + Number(bill.received || 0),
    0,
  );

  const transactions = active.flatMap((bill) =>
    (bill.transactions || []).map((transaction) => ({
      id: `${bill.id}-${transaction.id}`,
      billId: bill.id,
      regNo: bill.regNo || bill.registrationNo || "",
      patient: bill.patientName || bill.patient || "",
      amount: Number(transaction.amount || 0),
      method: transaction.mode || bill.mode || "cash",
      createdAt: transaction.date || bill.createdAt,
      status: bill.status,
    })),
  );

  res.json({
    income,
    bills,
    transactions,
  });
});

// GET /api/business/monthly
r.get("/monthly", (_req, res) => {
  const bills = (store.bills || []).filter(isActive);

  const monthlyMap: Record<string, BillingSummary & { month: string }> = {};

  for (const bill of bills) {
    if (!bill.createdAt) continue;

    const date = new Date(bill.createdAt);

    if (Number.isNaN(date.getTime())) continue;

    const month = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
    ].join("-");

    if (!monthlyMap[month]) {
      monthlyMap[month] = { month, ...emptySummary() };
    }

    accumulate(monthlyMap[month], bill);
  }

  const items = Object.values(monthlyMap).sort((a, b) =>
    b.month.localeCompare(a.month),
  );
  const totals = sumTotals(items);

  res.json({
    success: true,
    total: items.length,
    summary: {
      totalBills: bills.length,
      totalAmount: totals.totalAmount,
      receivedAmount: totals.receivedAmount,
      pendingAmount: totals.pendingAmount,
    },
    items,
  });
});

// GET /api/business/referral-reports
r.get("/referral-reports", (req, res) => {
  const bills = (store.bills || []).filter(isActive);

  const from = queryString(req.query.from);
  const to = queryString(req.query.to);

  const filteredBills = bills.filter((bill) => {
    if (!bill.createdAt) return false;

    const date = new Date(bill.createdAt).toISOString().slice(0, 10);

    if (from && date < from) return false;
    if (to && date > to) return false;

    return true;
  });

  const grouped: Record<string, BillingSummary & { referrer: string }> = {};

  for (const bill of filteredBills) {
    const referrer = bill.referrerName || bill.referrer || "Self";

    if (!grouped[referrer]) {
      grouped[referrer] = { referrer, ...emptySummary() };
    }

    accumulate(grouped[referrer], bill);
  }

  const items = Object.values(grouped).sort(
    (a, b) => b.totalAmount - a.totalAmount,
  );
  const totals = sumTotals(items);

  res.json({
    success: true,
    total: items.length,
    summary: {
      totalBills: filteredBills.length,
      totalAmount: totals.totalAmount,
      receivedAmount: totals.receivedAmount,
      pendingAmount: totals.pendingAmount,
    },
    items,
  });
});

// GET /api/business/activities
r.get("/activities", (req, res) => {
  const activities = store.activities || [];

  const date = queryString(req.query.date);
  const type = queryString(req.query.type);

  const filtered = activities.filter((activity) => {
    const activityDate = activity.createdAt
      ? new Date(activity.createdAt).toISOString().slice(0, 10)
      : "";

    const matchesDate = !date || activityDate === date;
    const matchesType =
      !type || type === "All Activities" || activity.type === type;

    return matchesDate && matchesType;
  });

  res.json({
    success: true,
    total: filtered.length,
    items: filtered,
  });
});

// GET /api/business/daily
// Returns daily billing and payment statistics.
r.get("/daily", (_req, res) => {
  const bills = (store.bills || []).filter(isActive);

  const dailyMap: Record<string, BillingSummary & { date: string }> = {};

  for (const bill of bills) {
    if (!bill.createdAt) continue;

    const date = new Date(bill.createdAt).toISOString().slice(0, 10);

    if (!dailyMap[date]) {
      dailyMap[date] = { date, ...emptySummary() };
    }

    accumulate(dailyMap[date], bill);
  }

  const items = Object.values(dailyMap).sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  res.json({
    success: true,
    total: items.length,
    items,
  });
});

export default r;
