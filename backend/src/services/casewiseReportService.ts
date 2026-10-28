import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { badRequest } from "../utils/ApiError.js";
import { displayDate, iso, money, toNumber } from "../utils/format.js";

/**
 * Case types shown on the Case Wise Report page -> BillInvestigation.modality.
 * OutsourceLabCase is special: it comes from the outsource_cases table.
 */
const MODALITY_BY_TYPE: Record<string, string> = {
  LabCase: "lab",
  UsgCase: "usg",
  DigitalXrayCase: "digitalXray",
  XrayCase: "xray",
  EcgCase: "ecg",
  CtScanCase: "ctScan",
  MriCase: "mri",
  EpsCase: "eps",
  OpgCase: "opg",
  CardiologyCase: "cardiology",
  EegCase: "eeg",
  MammographyCase: "mammography",
};
const OUTSOURCE = "OutsourceLabCase";

const LABELS: Record<string, string> = {
  LabCase: "Laboratory",
  UsgCase: "Ultrasound (USG)",
  DigitalXrayCase: "Digital X-ray",
  XrayCase: "X-ray",
  OutsourceLabCase: "Outsource Lab",
  EcgCase: "ECG",
  CtScanCase: "CT Scan",
  MriCase: "MRI Scan",
  EpsCase: "EPS",
  OpgCase: "OPG",
  CardiologyCase: "Cardiology",
  EegCase: "EEG",
  MammographyCase: "Mammography",
};

export interface CaseWiseFilter {
  date?: string; // YYYY-MM-DD
  centre?: string;
  types: string[];
  excludeCancelled: boolean;
}

/** Centres for the dropdown. "Main" is always first (bills without a centre count as Main). */
export async function caseWiseOptions() {
  const rows = await prisma.collectionCentre.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { name: true } });
  return { centres: ["Main", ...rows.map((r) => r.name).filter((n) => n !== "Main")] };
}

export async function caseWiseReport(f: CaseWiseFilter) {
  if (!f.date || !/^\d{4}-\d{2}-\d{2}$/.test(f.date)) throw badRequest("Choose a valid report date.");

  const types = [...new Set(f.types)].filter((t) => t in LABELS);
  if (!types.length) throw badRequest("Select at least one case type.");

  // The chosen calendar day, in the server's local time.
  const [y, m, d] = f.date.split("-").map(Number);
  const start = new Date(y!, m! - 1, d!);
  const end = new Date(y!, m! - 1, d! + 1);

  const modalities = types.filter((t) => t !== OUTSOURCE).map((t) => MODALITY_BY_TYPE[t]!);
  const wantOutsource = types.includes(OUTSOURCE);

  const and: Prisma.BillWhereInput[] = [{ createdAt: { gte: start, lt: end } }];
  if (f.excludeCancelled) and.push({ status: { not: "Cancelled" } });

  const centre = f.centre?.trim();
  if (centre && centre !== "All") {
    and.push(
      centre === "Main"
        ? { OR: [{ collectionCentre: null }, { collectionCentre: "" }, { collectionCentre: "Main" }] }
        : { collectionCentre: centre },
    );
  }

  and.push({
    OR: [
      ...(modalities.length ? [{ investigations: { some: { modality: { in: modalities } } } }] : []),
      ...(wantOutsource ? [{ outsourceCases: { some: {} } }] : []),
    ],
  });

  const bills = await prisma.bill.findMany({
    where: { AND: and },
    include: {
      investigations: {
        where: modalities.length ? { modality: { in: modalities } } : { id: -1 },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { name: true, modality: true, price: true },
      },
      outsourceCases: wantOutsource ? { select: { billInvestigationId: true, testName: true, cost: true } } : false,
    },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    take: 5000,
  });

  // Billed price of the outsourced tests (the case row only stores our cost).
  const outsourceInvestigationIds = bills.flatMap((b) => (b.outsourceCases ?? []).map((c) => c.billInvestigationId).filter((v): v is number => v !== null));
  const priceById = new Map<number, number>();
  if (outsourceInvestigationIds.length) {
    const prices = await prisma.billInvestigation.findMany({ where: { id: { in: outsourceInvestigationIds } }, select: { id: true, price: true } });
    prices.forEach((p) => priceById.set(p.id, toNumber(p.price)));
  }

  const base = (b: (typeof bills)[number]) => ({
    billId: b.id,
    regNo: b.regNo,
    date: displayDate(b.createdAt),
    createdAt: iso(b.createdAt),
    patient: b.patientName,
    status: b.status,
  });

  const groups = types.map((type) => {
    let rows: Array<ReturnType<typeof base> & { tests: string; testCount: number; amount: number; cost: number }>;

    if (type === OUTSOURCE) {
      rows = bills
        .filter((b) => (b.outsourceCases ?? []).length)
        .map((b) => {
          const cases = b.outsourceCases ?? [];
          return {
            ...base(b),
            tests: cases.map((c) => c.testName).join(", "),
            testCount: cases.length,
            amount: money(cases.reduce((s, c) => s + (c.billInvestigationId ? priceById.get(c.billInvestigationId) ?? 0 : 0), 0)),
            cost: money(cases.reduce((s, c) => s + toNumber(c.cost), 0)),
          };
        });
    } else {
      const modality = MODALITY_BY_TYPE[type]!;
      rows = bills
        .map((b) => ({ b, mine: b.investigations.filter((i) => i.modality === modality) }))
        .filter(({ mine }) => mine.length)
        .map(({ b, mine }) => ({
          ...base(b),
          tests: mine.map((i) => i.name).join(", "),
          testCount: mine.length,
          amount: money(mine.reduce((s, i) => s + toNumber(i.price), 0)),
          cost: 0,
        }));
    }

    return {
      type,
      label: LABELS[type],
      caseCount: rows.length,
      testCount: rows.reduce((s, r) => s + r.testCount, 0),
      amount: money(rows.reduce((s, r) => s + r.amount, 0)),
      cost: money(rows.reduce((s, r) => s + r.cost, 0)),
      rows,
    };
  });

  return {
    date: f.date,
    centre: centre || "All",
    excludeCancelled: f.excludeCancelled,
    generatedAt: new Date().toISOString(),
    groups,
    totals: {
      cases: new Set(groups.flatMap((g) => g.rows.map((r) => r.billId))).size, // a bill counts once
      tests: groups.reduce((s, g) => s + g.testCount, 0),
      amount: money(groups.reduce((s, g) => s + g.amount, 0)),
      cost: money(groups.reduce((s, g) => s + g.cost, 0)),
    },
  };
}