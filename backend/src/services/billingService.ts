import crypto from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma, type Tx } from "../lib/prisma.js";
import { ApiError, badRequest, conflict, notFound } from "../utils/ApiError.js";
import {
  dateRange,
  displayDate,
  displayTime,
  iso,
  money,
  toNumber,
} from "../utils/format.js";
import { asBody, id as toId, limitParam, num, optText, text, type Body } from "../utils/validate.js";
import { ActivityType, logActivities } from "./activityService.js";
import { ageText, patientDisplayName, readPatient, resolvePatientForBill } from "./patientService.js";
import { resolveAgent, resolveReferrer } from "./referrerService.js";
import { getSetting } from "./settingsService.js";
import { syncDerivedRecords } from "./reportBuilder.js";

// ---------------------------------------------------------------------
// Modalities (same keys as the bill form)
// ---------------------------------------------------------------------
export const SECTION_LABELS: Record<string, string> = {
  lab: "LABORATORY",
  usg: "USG",
  digitalXray: "DIGITAL XRAY",
  xray: "XRAY",
  outsource: "OUTSOURCE LAB",
  ecg: "ECG",
  ctScan: "CT SCAN",
  mri: "MRI",
  eps: "EPS",
  opg: "OPG",
  cardiology: "CARDIOLOGY",
  eeg: "EEG",
  mammography: "MAMMOGRAPHY",
};

export interface CleanTest {
  modality: string;
  name: string;
  price: number;
  section: string;
  unit: string | null;
  reference: string | null;
}

/** Tests arrive as a flat list or grouped by modality ({ lab: [...], usg: [...] }). */
export function parseInvestigations(value: unknown): CleanTest[] {
  const result: CleanTest[] = [];

  const add = (raw: unknown, modality: string) => {
    const item = asBody(raw);
    const name = text(item.name, 255);
    if (!name) return;

    if (!(modality in SECTION_LABELS)) {
      throw badRequest(`Unknown investigation type "${modality}".`);
    }

    const price = num(item.price);
    if (price < 0) throw badRequest(`Price of "${name}" cannot be negative.`);

    result.push({
      modality,
      name,
      price: money(price),
      section: text(item.section, 80) || SECTION_LABELS[modality]!,
      unit: optText(item.unit, 60),
      reference: optText(item.reference, 255),
    });
  };

  if (Array.isArray(value)) {
    for (const raw of value) add(raw, text(asBody(raw).type, 30) || "lab");
  } else if (value && typeof value === "object") {
    for (const [modality, tests] of Object.entries(value as Body)) {
      if (Array.isArray(tests)) for (const raw of tests) add(raw, modality);
    }
  }

  return result;
}

export interface PaymentBox {
  paid: number;
  discount: number;
}

/** Only sections with a Paid or Discount amount are kept. */
export function parseModalityPayments(value: unknown): Record<string, PaymentBox> {
  const result: Record<string, PaymentBox> = {};
  if (!value || typeof value !== "object") return result;

  for (const [modality, raw] of Object.entries(value as Body)) {
    if (!(modality in SECTION_LABELS)) continue;
    const item = asBody(raw);
    const entry = { paid: money(num(item.paid)), discount: money(num(item.discount)) };

    if (entry.paid < 0 || entry.discount < 0) {
      throw badRequest("Payment amounts cannot be negative.");
    }
    if (entry.paid !== 0 || entry.discount !== 0) result[modality] = entry;
  }
  return result;
}

// ---------------------------------------------------------------------
// Money. The total is ALWAYS worked out here, never trusted from the browser.
// ---------------------------------------------------------------------
export function calculateTotals(input: {
  prices: number[];
  collectionCharge: number;
  discount: number;
  received: number;
}) {
  const collectionCharge = money(input.collectionCharge);
  const discount = money(input.discount);
  const received = money(input.received);
  const total = money(input.prices.reduce((sum, p) => sum + p, 0) + collectionCharge);

  if (collectionCharge < 0 || discount < 0 || received < 0) {
    throw badRequest("Payment amounts cannot be negative.");
  }
  if (discount > total) throw badRequest("Discount cannot be more than the bill total.");

  return {
    total,
    discount,
    received,
    collectionCharge,
    balance: Math.max(0, money(total - discount - received)),
  };
}

// ---------------------------------------------------------------------
// Reading bills
// ---------------------------------------------------------------------
export const billInclude = {
  investigations: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
  transactions: { orderBy: [{ txNo: "asc" }, { id: "asc" }] },
  modalityPayments: true,
} satisfies Prisma.BillInclude;

type BillRow = Prisma.BillGetPayload<{ include: typeof billInclude }>;

export function serializeBill(row: BillRow) {
  const total = toNumber(row.total);
  const discount = toNumber(row.discount);
  const received = toNumber(row.received);
  const balance = toNumber(row.balance);

  return {
    id: row.id,
    billNo: row.regNo,
    regNo: row.regNo,
    registrationNo: row.regNo,
    caseNo: row.caseNo,
    status: row.status,
    createdAt: iso(row.createdAt),
    ...(row.cancelReason ? { cancelReason: row.cancelReason } : {}),

    patientId: row.patientId,
    patient: row.patientName,
    patientName: row.patientName,
    patientDetails: (row.patientDetails ?? {}) as Record<string, unknown>,
    mobile: row.mobile,
    uhid: row.uhid ?? "",
    age: row.age ?? "",
    sex: row.sex ?? "",
    onlineReportRequested: row.onlineReport,

    referrerId: row.referrerId,
    referrer: row.referrer,
    referrerName: row.referrer,
    sampleCollectionAgentId: row.agentId,
    sampleCollectionAgentName: row.agentName ?? "",
    collectionCentre: row.collectionCentre ?? "Main",

    investigations: row.investigations.map((test) => ({
      id: test.id,
      name: test.name,
      price: toNumber(test.price),
      type: test.modality,
      section: test.section ?? SECTION_LABELS[test.modality] ?? "",
      ...(test.unit ? { unit: test.unit } : {}),
      ...(test.reference ? { reference: test.reference } : {}),
    })),

    investigationPayments: Object.fromEntries(
      row.modalityPayments.map((item) => [
        item.modality,
        { paid: toNumber(item.paid), discount: toNumber(item.discount) },
      ]),
    ),

    total,
    discount,
    received,
    paid: received,
    balance,
    collectionCharge: toNumber(row.collectionCharge),
    mode: row.mode,
    remarks: row.remarks ?? "",
    payment: {
      ...((row.payment ?? {}) as Record<string, unknown>),
      total,
      discount,
      received,
      balance,
      mode: row.mode,
      collectionCharge: toNumber(row.collectionCharge),
      remarks: row.remarks ?? "",
    },

    transactions: row.transactions.map((item) => ({
      id: item.txNo,
      date: iso(item.paidAt),
      amount: toNumber(item.amount),
      mode: item.mode,
      receivedBy: item.receivedBy ?? "",
    })),
  };
}

export interface BillFilter {
  from?: string;
  to?: string;
  status?: string;
  q?: string;
  referrerId?: number | null;
  limit?: unknown;
}

export async function listBills(filter: BillFilter) {
  const q = filter.q?.trim();
  const range = dateRange(filter.from, filter.to);
  const status = filter.status?.toLowerCase();

  const where: Prisma.BillWhereInput = {
    ...(range ? { createdAt: range } : {}),
    ...(status === "cancelled" ? { status: "Cancelled" } : {}),
    ...(status === "active" ? { status: "Active" } : {}),
    ...(status === "due" ? { status: "Active", balance: { gt: 0 } } : {}),
    ...(filter.referrerId ? { referrerId: filter.referrerId } : {}),
    ...(q
      ? {
          OR: [
            { regNo: { contains: q } },
            { caseNo: { contains: q } },
            { patientName: { contains: q } },
            { mobile: { contains: q } },
          ],
        }
      : {}),
  };

  const rows = await prisma.bill.findMany({
    where,
    include: billInclude,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limitParam(filter.limit, 5000, 5000),
  });

  return rows.map(serializeBill);
}

export async function getBill(idOrRegNo: string) {
  const asId = toId(idOrRegNo);

  const row = await prisma.bill.findFirst({
    where: asId ? { id: asId } : { regNo: idOrRegNo },
    include: billInclude,
  });

  if (!row) throw notFound("Bill");
  return serializeBill(row);
}

async function loadBill(db: Tx | typeof prisma, billId: number) {
  const row = await db.bill.findUnique({ where: { id: billId }, include: billInclude });
  if (!row) throw notFound("Bill");
  return row;
}

// ---------------------------------------------------------------------
// Transactions page
// ---------------------------------------------------------------------
export async function listTransactions(filter: {
  from?: string;
  to?: string;
  mode?: string;
  q?: string;
  limit?: unknown;
}) {
  const range = dateRange(filter.from, filter.to);
  const q = filter.q?.trim();

  const rows = await prisma.billTransaction.findMany({
    where: {
      ...(range ? { paidAt: range } : {}),
      ...(filter.mode ? { mode: filter.mode.toLowerCase() } : {}),
      ...(q
        ? {
            bill: {
              OR: [
                { regNo: { contains: q } },
                { patientName: { contains: q } },
                { mobile: { contains: q } },
              ],
            },
          }
        : {}),
    },
    include: {
      bill: {
        select: { id: true, regNo: true, patientName: true, referrer: true, mobile: true, status: true },
      },
    },
    orderBy: [{ paidAt: "desc" }, { id: "desc" }],
    take: limitParam(filter.limit, 5000, 5000),
  });

  return rows.map((row) => ({
    id: row.id,
    billId: row.billId,
    billNo: row.bill.regNo,
    registrationNo: row.bill.regNo,
    patientName: row.bill.patientName,
    patient: row.bill.patientName,
    referrerName: row.bill.referrer,
    mobile: row.bill.mobile,
    status: row.bill.status,
    date: displayDate(row.paidAt),
    time: displayTime(row.paidAt),
    createdAt: iso(row.paidAt),
    amount: toNumber(row.amount),
    paymentMode: row.mode,
    mode: row.mode,
    method: row.mode,
    receivedBy: row.receivedBy ?? "",
  }));
}

// ---------------------------------------------------------------------
// Creating a bill
// ---------------------------------------------------------------------
async function numbering(tx: Tx, billId: number) {
  const start = Number(await getSetting("billing", "reg_no_start", 41025, 0, tx)) || 41025;
  const prefix = String(await getSetting("billing", "case_no_prefix", "L", 0, tx));
  const caseStart = Number(await getSetting("billing", "case_no_start", 82, 0, tx)) || 82;

  return {
    regNo: String(start + billId - 1),
    caseNo: `${prefix}${caseStart + billId - 1}`.slice(0, 20),
  };
}

const flat = (value: unknown): Body => asBody(value);

function readPatientAndName(body: Body) {
  const patientBody = flat(body.patient);
  const fallbackName = text(body.patientName, 255);
  const fields = readPatient(patientBody, fallbackName);

  if (!fields.firstName) {
    throw badRequest("Patient name is required.", { field: "patientName" });
  }

  const name = patientDisplayName({
    title: fields.title,
    firstName: fields.firstName,
    lastName: fields.lastName,
  });

  return { fields, name, patientBody };
}

export async function createBill(input: unknown, actor: string) {
  const body = asBody(input);
  const { fields, name, patientBody } = readPatientAndName(body);

  const tests = parseInvestigations(body.investigations);
  if (!tests.length) throw badRequest("Add at least one investigation.");

  const modalityPayments = parseModalityPayments(body.investigationPayments);
  const payment = flat(body.payment);

  const totals = calculateTotals({
    prices: tests.map((t) => t.price),
    collectionCharge: num(payment.collectionCharge),
    discount: num(payment.discount ?? body.discount),
    received: num(payment.received ?? body.received),
  });

  const mode = text(payment.mode ?? body.mode, 30).toLowerCase() || "cash";
  const age = ageText(fields);

  const billId = await prisma.$transaction(
    async (tx) => {
      const patient = await resolvePatientForBill(tx, fields);
      const referrer = await resolveReferrer(tx, body.referrerId, body.referrerName);
      const agent = await resolveAgent(tx, body.sampleCollectionAgentId, body.sampleCollectionAgentName);

      // regNo / caseNo come from the new row's id, so two bills created at the
      // same moment can never get the same number.
      const created = await tx.bill.create({
        data: {
          regNo: `TMP-${crypto.randomBytes(8).toString("hex")}`,
          caseNo: "TMP",
          status: "Active",
          patientId: patient.id,
          patientName: name,
          patientDetails: { ...patientBody, age } as Prisma.InputJsonValue,
          mobile: patient.mobile,
          uhid: patient.uhid,
          age,
          sex: patient.sex,
          onlineReport: fields.onlineReport,
          referrerId: referrer.id,
          referrer: referrer.label,
          agentId: agent.id,
          agentName: agent.name || null,
          collectionCentre: text(body.collectionCentre, 120) || "Main",
          total: totals.total,
          discount: totals.discount,
          received: totals.received,
          balance: totals.balance,
          collectionCharge: totals.collectionCharge,
          mode,
          remarks: optText(payment.remarks ?? body.remarks, 5000),
          payment: { ...payment, ...totals, mode } as Prisma.InputJsonValue,
          createdBy: actor,
        },
        select: { id: true },
      });

      const numbers = await numbering(tx, created.id);
      await tx.bill.update({ where: { id: created.id }, data: numbers });

      if (totals.received > 0) {
        await tx.billTransaction.create({
          data: { billId: created.id, txNo: 1, amount: totals.received, mode, receivedBy: actor },
        });
      }

      const boxes = Object.entries(modalityPayments);
      if (boxes.length) {
        await tx.billModalityPayment.createMany({
          data: boxes.map(([modality, box]) => ({ billId: created.id, modality, ...box })),
        });
      }

      await syncDerivedRecords(tx, created.id, tests, patient, {
        header: { patient: name, age, referrer: referrer.label },
      });

      await logActivities(tx, [
        {
          billId: created.id,
          userName: actor,
          type: ActivityType.billCreated,
          summary: `Bill created for ${name} with ${tests.length} investigation${tests.length === 1 ? "" : "s"}.`,
        },
      ]);

      return created.id;
    },
    { timeout: 30000 },
  );

  return serializeBill(await loadBill(prisma, billId));
}

// ---------------------------------------------------------------------
// Modifying a bill
// ---------------------------------------------------------------------
export async function updateBill(billId: number, input: unknown, actor: string) {
  const body = asBody(input);

  const current = await loadBill(prisma, billId);
  if (current.status === "Cancelled") {
    throw conflict("A cancelled bill cannot be modified.", "BILL_CANCELLED");
  }

  const tests = body.investigations !== undefined ? parseInvestigations(body.investigations) : undefined;
  if (tests && !tests.length) throw badRequest("Add at least one investigation.");

  const modalityPayments =
    body.investigationPayments !== undefined
      ? parseModalityPayments(body.investigationPayments)
      : undefined;

  const payment = flat(body.payment);
  const hasPatient = body.patient && typeof body.patient === "object";
  const patientParts = hasPatient ? readPatientAndName(body) : null;

  await prisma.$transaction(
    async (tx) => {
      const activities: Parameters<typeof logActivities>[1] = [];
      const log = (type: string, summary: string) =>
        activities.push({ billId, userName: actor, type, summary });

      const data: Prisma.BillUpdateInput = {};
      let patientRow = current.patientId
        ? await tx.patient.findUnique({ where: { id: current.patientId } })
        : null;

      // ---- patient
      if (patientParts) {
        const { fields, name, patientBody } = patientParts;
        patientRow = await resolvePatientForBill(tx, fields, current.patientId);
        const age = ageText(fields);

        if (name !== current.patientName) {
          log(ActivityType.patientRenamed, `Patient name changed from "${current.patientName}" to "${name}".`);
        }

        data.patientId = patientRow.id;
        data.patientName = name;
        data.patientDetails = { ...patientBody, age } as Prisma.InputJsonValue;
        data.mobile = patientRow.mobile;
        data.uhid = patientRow.uhid;
        data.age = age;
        data.sex = patientRow.sex;
        data.onlineReport = fields.onlineReport;
      }

      // ---- referrer / agent / centre
      if (body.referrerId !== undefined || body.referrerName !== undefined) {
        const referrer = await resolveReferrer(tx, body.referrerId, body.referrerName ?? current.referrer);
        if (referrer.label !== current.referrer) {
          log(ActivityType.referrerChanged, `Referrer changed from "${current.referrer}" to "${referrer.label}".`);
        }
        data.referrerId = referrer.id;
        data.referrer = referrer.label;
      }

      if (body.sampleCollectionAgentId !== undefined || body.sampleCollectionAgentName !== undefined) {
        const agent = await resolveAgent(tx, body.sampleCollectionAgentId, body.sampleCollectionAgentName);
        data.agentId = agent.id;
        data.agentName = agent.name || null;
      }

      if (text(body.collectionCentre, 120)) data.collectionCentre = text(body.collectionCentre, 120);

      // ---- investigations
      const currentTests: CleanTest[] = current.investigations.map((row) => ({
        modality: row.modality,
        name: row.name,
        price: toNumber(row.price),
        section: row.section ?? SECTION_LABELS[row.modality] ?? "",
        unit: row.unit,
        reference: row.reference,
      }));

      const finalTests = tests ?? currentTests;

      if (tests) {
        const before = new Set(currentTests.map((t) => `${t.modality}|${t.name.toLowerCase()}`));
        for (const test of tests) {
          if (!before.has(`${test.modality}|${test.name.toLowerCase()}`)) {
            log(ActivityType.investigationAdded, `Added ${test.name} (Rs.${test.price}).`);
          }
        }
      }

      // ---- money
      const moneyChanged = body.payment !== undefined || tests !== undefined;
      const recorded = money(current.transactions.reduce((sum, t) => sum + toNumber(t.amount), 0));

      if (moneyChanged) {
        const totals = calculateTotals({
          prices: finalTests.map((t) => t.price),
          collectionCharge:
            payment.collectionCharge !== undefined ? num(payment.collectionCharge) : toNumber(current.collectionCharge),
          discount: payment.discount !== undefined ? num(payment.discount) : toNumber(current.discount),
          received: payment.received !== undefined ? num(payment.received) : toNumber(current.received),
        });

        if (totals.received < recorded) {
          throw badRequest(
            `Received amount cannot be less than the Rs.${recorded} already recorded in transactions.`,
          );
        }

        const mode = text(payment.mode, 30).toLowerCase() || current.mode;

        if (totals.received > recorded) {
          const nextNo = Math.max(0, ...current.transactions.map((t) => t.txNo)) + 1;
          const added = money(totals.received - recorded);

          await tx.billTransaction.create({
            data: { billId, txNo: nextNo, amount: added, mode, receivedBy: actor },
          });
          log(ActivityType.paymentReceived, `Payment of Rs.${added} received (${mode}).`);
        }

        data.total = totals.total;
        data.discount = totals.discount;
        data.received = totals.received;
        data.balance = totals.balance;
        data.collectionCharge = totals.collectionCharge;
        data.mode = mode;
        data.payment = {
          ...((current.payment ?? {}) as Record<string, unknown>),
          ...payment,
          ...totals,
          mode,
        } as Prisma.InputJsonValue;
      }

      if (payment.remarks !== undefined || body.remarks !== undefined) {
        data.remarks = optText(payment.remarks ?? body.remarks, 5000);
      }

      if (modalityPayments) {
        await tx.billModalityPayment.deleteMany({ where: { billId } });
        const boxes = Object.entries(modalityPayments);
        if (boxes.length) {
          await tx.billModalityPayment.createMany({
            data: boxes.map(([modality, box]) => ({ billId, modality, ...box })),
          });
        }
      }

      if (!activities.length) log(ActivityType.caseModified, "Bill details modified.");

      await tx.bill.update({ where: { id: billId }, data });

      await syncDerivedRecords(tx, billId, finalTests, patientRow, {
        header: {
          patient: (data.patientName as string | undefined) ?? current.patientName,
          age: (data.age as string | undefined) ?? current.age ?? "",
          referrer: (data.referrer as string | undefined) ?? current.referrer,
        },
      });

      await logActivities(tx, activities);
    },
    { timeout: 30000 },
  );

  return serializeBill(await loadBill(prisma, billId));
}

// ---------------------------------------------------------------------
// Cancel, and add a payment
// ---------------------------------------------------------------------
export async function cancelBill(billId: number, reason: unknown, actor: string) {
  const current = await loadBill(prisma, billId);
  if (current.status === "Cancelled") return serializeBill(current);

  const why = text(reason, 255);

  await prisma.$transaction(async (tx) => {
    await tx.bill.update({ where: { id: billId }, data: { status: "Cancelled", cancelReason: why || null } });
    await logActivities(tx, [
      {
        billId,
        userName: actor,
        type: ActivityType.billCancelled,
        summary: `Bill cancelled${why ? `: ${why}` : "."}`,
      },
    ]);
  });

  return serializeBill(await loadBill(prisma, billId));
}

export async function addPayment(billId: number, input: unknown, actor: string) {
  const body = asBody(input);
  const amount = money(num(body.amount));

  if (amount <= 0) throw badRequest("Enter an amount greater than zero.", { field: "amount" });

  await prisma.$transaction(async (tx) => {
    const bill = await loadBill(tx, billId);
    if (bill.status === "Cancelled") throw conflict("A cancelled bill cannot take payments.", "BILL_CANCELLED");

    const balance = toNumber(bill.balance);
    if (amount > balance) {
      throw new ApiError(400, "OVERPAYMENT", `Amount cannot be more than the balance (Rs.${balance}).`);
    }

    const mode = text(body.mode, 30).toLowerCase() || bill.mode;
    const nextNo = Math.max(0, ...bill.transactions.map((t) => t.txNo)) + 1;
    const received = money(toNumber(bill.received) + amount);

    await tx.billTransaction.create({
      data: { billId, txNo: nextNo, amount, mode, receivedBy: text(body.receivedBy, 255) || actor },
    });

    await tx.bill.update({
      where: { id: billId },
      data: { received, balance: money(balance - amount), mode },
    });

    await logActivities(tx, [
      { billId, userName: actor, type: ActivityType.paymentReceived, summary: `Payment of Rs.${amount} received (${mode}).` },
    ]);
  });

  return serializeBill(await loadBill(prisma, billId));
}
