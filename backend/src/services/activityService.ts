import { prisma, type Db } from "../lib/prisma.js";
import { dayRange, iso } from "../utils/format.js";

export const ActivityType = {
  billCreated: "Bill created",
  caseModified: "Case modified",
  patientRenamed: "Patient name updated",
  investigationAdded: "Investigation Added",
  referrerChanged: "Referrer changed",
  paymentReceived: "Payment received",
  billCancelled: "Bill cancelled",
  reportUpdated: "Report updated",
} as const;

interface Entry {
  billId?: number | null;
  userName?: string | null;
  type: string;
  summary: string;
}

/** Adds a row to the activity feed. Pass `tx` to make it part of a transaction. */
export async function logActivity(db: Db, entry: Entry): Promise<void> {
  await db.activity.create({
    data: {
      billId: entry.billId ?? null,
      userName: entry.userName ?? null,
      type: entry.type.slice(0, 60),
      summary: entry.summary.slice(0, 500),
    },
  });
}

export async function logActivities(db: Db, entries: Entry[]): Promise<void> {
  if (!entries.length) return;
  await db.activity.createMany({
    data: entries.map((entry) => ({
      billId: entry.billId ?? null,
      userName: entry.userName ?? null,
      type: entry.type.slice(0, 60),
      summary: entry.summary.slice(0, 500),
    })),
  });
}

export async function listActivities(filter: { date?: string; type?: string }) {
  const rows = await prisma.activity.findMany({
    where: {
      ...(filter.date ? { createdAt: dayRange(filter.date) } : {}),
      ...(filter.type && filter.type !== "All Activities"
        ? { type: filter.type }
        : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 500,
  });

  const billIds = [
    ...new Set(rows.map((row) => row.billId).filter((v): v is number => v !== null)),
  ];

  const bills = billIds.length
    ? await prisma.bill.findMany({
        where: { id: { in: billIds } },
        select: { id: true, regNo: true },
      })
    : [];

  const regNoById = new Map(bills.map((bill) => [bill.id, bill.regNo]));

  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    description: row.summary,
    summary: row.summary,
    regNo: row.billId ? (regNoById.get(row.billId) ?? "") : "",
    owner: row.userName ?? "System",
    billId: row.billId,
    createdAt: iso(row.createdAt),
  }));
}
