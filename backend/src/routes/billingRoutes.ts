import { Router } from "express";
import { store, nextId } from "../store.js";
import type {
  Bill,
  Id,
  Investigation,
  PatientDetails,
  PaymentDetails,
  Report,
  Transaction,
} from "../types/domain.js";

/** Investigations arrive either as a flat list or grouped into lab / outsource. */
type InvestigationsInput =
  | Investigation[]
  | { lab?: Investigation[]; outsource?: Investigation[] };

interface CreateBillBody {
  patient?: PatientDetails;
  payment?: PaymentDetails;
  investigations?: InvestigationsInput;
  patientName?: string;
  referrerId?: Id | null;
  referrerName?: string;
  sampleCollectionAgentId?: Id | null;
  sampleCollectionAgentName?: string;
  collectionCentre?: string;
  total?: number | string;
  discount?: number | string;
  received?: number | string;
  mode?: string;
  remarks?: string;
}

const r = Router();

function getPatientName(patient: PatientDetails = {}): string {
  return [patient.title, patient.firstName, patient.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function getAge(patient: PatientDetails = {}): string {
  const parts: string[] = [];

  if (patient.years !== "" && patient.years != null) {
    parts.push(`${patient.years} YRS`);
  }

  if (patient.months !== "" && patient.months != null) {
    parts.push(`${patient.months} MOS`);
  }

  if (patient.days !== "" && patient.days != null) {
    parts.push(`${patient.days} DAYS`);
  }

  return parts.join(" ") || "";
}

function getInvestigations(value?: InvestigationsInput): Investigation[] {
  if (Array.isArray(value)) return value;

  const lab = (value?.lab || []).map((test) => ({
    ...test,
    section: "LABORATORY",
    type: "lab",
  }));

  const outsource = (value?.outsource || []).map((test) => ({
    ...test,
    section: "OUTSOURCE LAB",
    type: "outsource",
  }));

  return [...lab, ...outsource];
}

const findBill = (id: string): Bill | undefined =>
  store.bills.find((item) => String(item.id) === id);

// GET /api/billing/transactions
// Must be declared before GET /:id.
r.get("/transactions", (_req, res) => {
  const transactions = store.bills.flatMap((bill) =>
    (bill.transactions || []).map((transaction) => ({
      ...transaction,
      billId: bill.id,
      billNo: bill.billNo || bill.regNo || bill.registrationNo || "",
      patient:
        bill.patientName ||
        bill.patient ||
        getPatientName(bill.patientDetails || {}),
      mobile: bill.mobile || bill.patientDetails?.mobile || "",
      status: bill.status || "Active",
    })),
  );

  // Most recent transactions first.
  transactions.sort(
    (a, b) =>
      new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
  );

  res.status(200).json({
    success: true,
    total: transactions.length,
    transactions,
  });
});

// GET /api/billing
r.get("/", (_req, res) => {
  res.json({ items: store.bills });
});

// GET /api/billing/:id
r.get("/:id", (req, res) => {
  const bill = findBill(String(req.params.id));

  if (!bill) {
    res.status(404).json({
      success: false,
      message: "Bill not found",
    });
    return;
  }

  res.json(bill);
});

// POST /api/billing
r.post("/", (req, res) => {
  const body: CreateBillBody = req.body || {};
  const patientDetails: PatientDetails = body.patient || {};
  const payment: PaymentDetails = body.payment || {};

  const investigations = getInvestigations(body.investigations);

  const patientName = body.patientName || getPatientName(patientDetails);

  const age = getAge(patientDetails);

  const referrer = store.referrers.find(
    (item) =>
      (body.referrerId != null &&
        String(item.id) === String(body.referrerId)) ||
      (body.referrerName && item.name === body.referrerName),
  );

  const agent = store.agents.find(
    (item) =>
      (body.sampleCollectionAgentId != null &&
        String(item.id) === String(body.sampleCollectionAgentId)) ||
      (body.sampleCollectionAgentName &&
        item.name === body.sampleCollectionAgentName),
  );

  const id = nextId(store.bills);
  const createdAt = new Date().toISOString();

  const calculatedTotal =
    investigations.reduce((sum, test) => sum + Number(test.price || 0), 0) +
    Number(payment.collectionCharge || 0);

  const total = Number(payment.total ?? body.total ?? calculatedTotal);

  const discount = Number(payment.discount ?? body.discount ?? 0);

  const received = Number(payment.received ?? body.received ?? 0);

  const balance = Math.max(0, total - discount - received);

  const regNo = String(41025 + id - 1);
  const caseNo = `L${82 + id - 1}`;

  const transactionMode = payment.mode || body.mode || "cash";

  const referrerLabel = referrer
    ? [referrer.title, referrer.firstName, referrer.lastName]
        .filter(Boolean)
        .join(" ")
    : body.referrerName || "Self";

  const transactions: Transaction[] =
    received > 0
      ? [
          {
            id: 1,
            date: createdAt,
            amount: received,
            mode: transactionMode,
            receivedBy: "",
          },
        ]
      : [];

  const bill: Bill = {
    id,
    billNo: regNo,
    regNo,
    registrationNo: regNo,
    caseNo,
    status: "Active",

    createdAt,

    patient: patientName,
    patientName,

    patientDetails: {
      ...patientDetails,
      age,
    },

    mobile: patientDetails.mobile || "",
    uhid: patientDetails.uhid || "",
    age,
    sex: patientDetails.sex || "",
    onlineReportRequested: Boolean(patientDetails.online),

    referrerId: body.referrerId || null,

    referrer: referrerLabel,
    referrerName: referrerLabel,

    sampleCollectionAgentId: body.sampleCollectionAgentId || null,

    sampleCollectionAgentName:
      agent?.name || body.sampleCollectionAgentName || "",

    collectionCentre: body.collectionCentre || "Main",

    investigations,

    total,
    discount,
    received,
    paid: received,
    balance,

    collectionCharge: Number(payment.collectionCharge || 0),

    mode: transactionMode,
    remarks: payment.remarks || body.remarks || "",

    payment: {
      ...payment,
      total,
      discount,
      received,
      balance,
    },

    transactions,
  };

  store.bills.unshift(bill);

  const report: Report = {
    id: nextId(store.reports),
    billId: id,
    regNo,
    patient: patientName,
    age,
    referrer: bill.referrer,
    status: "New",

    tests: investigations.map((test, index) => ({
      id: index + 1,
      section: test.section || "LABORATORY",
      name: test.name,
      value: "",
      unit: test.unit || "",
      reference: test.reference || "",
    })),

    interpretation: "",
    notes: "",
  };

  store.reports.unshift(report);

  res.status(201).json(bill);
});

// PATCH /api/billing/:id
r.patch("/:id", (req, res) => {
  const bill = findBill(String(req.params.id));

  if (!bill) {
    res.status(404).json({
      success: false,
      message: "Bill not found",
    });
    return;
  }

  Object.assign(bill, req.body || {});

  res.json(bill);
});

// POST /api/billing/:id/cancel
r.post("/:id/cancel", (req, res) => {
  const bill = findBill(String(req.params.id));

  if (!bill) {
    res.status(404).json({
      success: false,
      message: "Bill not found",
    });
    return;
  }

  bill.status = "Cancelled";
  bill.cancelReason = (req.body as { reason?: string } | undefined)?.reason || "";

  res.json(bill);
});

export default r;
