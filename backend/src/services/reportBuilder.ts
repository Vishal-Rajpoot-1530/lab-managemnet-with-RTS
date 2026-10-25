import type { Patient, Prisma, RangeSex } from "@prisma/client";
import type { Tx } from "../lib/prisma.js";
import { toNumber } from "../utils/format.js";
import type { CleanTest } from "./billingService.js";

/** Tests that get a lab report. Everything else is a scan (radiology report). */
export const LAB_LIKE = new Set(["lab", "outsource"]);

// ---------------------------------------------------------------------
// Small pure helpers (unit tested)
// ---------------------------------------------------------------------
export interface RangeLike {
  sex: RangeSex;
  ageFromDays: number;
  ageToDays: number | null;
  lowValue: Prisma.Decimal | number | null;
  highValue: Prisma.Decimal | number | null;
  rangeText: string | null;
}

/** The reference text that applies to this patient, e.g. "13.0 - 17.0". */
export function pickReference(
  ranges: RangeLike[],
  sex: string | null,
  ageDays: number | null,
): string {
  const wanted = (sex ?? "").toUpperCase();

  const fits = ranges.filter((r) => {
    const sexOk = r.sex === "ANY" || r.sex === wanted;
    const ageOk =
      ageDays === null || (ageDays >= r.ageFromDays && (r.ageToDays === null || ageDays <= r.ageToDays));
    return sexOk && ageOk;
  });

  const best = fits.find((r) => r.sex !== "ANY") ?? fits[0];
  if (!best) return "";
  if (best.rangeText) return best.rangeText;

  const low = best.lowValue === null ? null : toNumber(best.lowValue);
  const high = best.highValue === null ? null : toNumber(best.highValue);

  if (low !== null && high !== null) return `${low} - ${high}`;
  if (low !== null) return `> ${low}`;
  if (high !== null) return `< ${high}`;
  return "";
}

/** "L" / "H" / "N" when value and a "low - high" reference are numbers, else null. */
export function computeFlag(value: string, reference: string): string | null {
  const v = Number(value.trim());
  const match = /^\s*(-?\d+(?:\.\d+)?)\s*[-–]\s*(-?\d+(?:\.\d+)?)\s*$/.exec(reference);

  if (!value.trim() || !Number.isFinite(v) || !match) return null;

  const low = Number(match[1]);
  const high = Number(match[2]);
  return v < low ? "L" : v > high ? "H" : "N";
}

export function patientAgeDays(p: Pick<Patient, "years" | "months" | "days"> | null): number | null {
  if (!p || (p.years === null && p.months === null && p.days === null)) return null;
  return (p.years ?? 0) * 365 + (p.months ?? 0) * 30 + (p.days ?? 0);
}

// ---------------------------------------------------------------------
// Syncing everything that hangs off a bill
// ---------------------------------------------------------------------
interface SavedInvestigation {
  id: number;
  test: CleanTest;
  catalogId: number | null;
}

const catalogInclude = {
  category: { select: { name: true } },
  outsourceLab: { select: { id: true } },
  parameters: {
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: { unit: { select: { name: true } }, referenceRanges: true },
  },
} satisfies Prisma.TestInclude;

type CatalogTest = Prisma.TestGetPayload<{ include: typeof catalogInclude }>;

/**
 * Brings the bill's tests, lab report, radiology reports and outsource cases in
 * line with the tests now on the bill. Existing rows are updated in place, so
 * results typed into a report are never lost by editing a bill.
 */
export async function syncDerivedRecords(
  tx: Tx,
  billId: number,
  tests: CleanTest[],
  patient: Patient | null,
  opts: { header: { patient: string; age: string; referrer: string } },
): Promise<void> {
  const bill = await tx.bill.findUniqueOrThrow({ where: { id: billId }, select: { regNo: true } });

  // ---- match tests to the catalogue by name
  const labNames = [...new Set(tests.filter((t) => LAB_LIKE.has(t.modality)).map((t) => t.name))];
  const catalog = labNames.length
    ? await tx.test.findMany({
        where: { active: true, department: "lab", name: { in: labNames } },
        include: catalogInclude,
      })
    : [];
  const byName = new Map(catalog.map((t) => [t.name.toLowerCase(), t]));

  // ---- bill_investigations (diff, not delete-all)
  const pool = await tx.billInvestigation.findMany({ where: { billId }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  const saved: SavedInvestigation[] = [];

  for (const [index, test] of tests.entries()) {
    const catalogTest = LAB_LIKE.has(test.modality) ? byName.get(test.name.toLowerCase()) : undefined;
    const at = pool.findIndex((row) => row.modality === test.modality && row.name.toLowerCase() === test.name.toLowerCase());
    const reuse = at >= 0 ? pool.splice(at, 1)[0] : undefined;

    const data = {
      sortOrder: index,
      modality: test.modality,
      section: test.section,
      name: test.name,
      price: test.price,
      unit: test.unit,
      reference: test.reference,
      testId: catalogTest?.id ?? null,
    };

    const row = reuse
      ? await tx.billInvestigation.update({ where: { id: reuse.id }, data })
      : await tx.billInvestigation.create({ data: { ...data, billId } });

    saved.push({ id: row.id, test, catalogId: catalogTest?.id ?? null });
  }

  if (pool.length) await tx.billInvestigation.deleteMany({ where: { id: { in: pool.map((row) => row.id) } } });

  // ---- lab report
  const labRows = saved.filter((s) => LAB_LIKE.has(s.test.modality));

  if (!labRows.length) {
    await tx.report.deleteMany({ where: { billId } });
  } else {
    const report = await tx.report.upsert({
      where: { billId },
      create: { billId, regNo: bill.regNo, ...opts.header, status: "New" },
      update: { regNo: bill.regNo, ...opts.header },
      include: { tests: true },
    });

    const kept = new Map(report.tests.map((t) => [`${t.section ?? ""}|${t.name}`, t.value ?? ""]));
    const ageDays = patientAgeDays(patient);
    const rows: Prisma.ReportTestCreateManyInput[] = [];

    for (const item of labRows) {
      const catalogTest = item.catalogId ? byName.get(item.test.name.toLowerCase()) : undefined;

      for (const row of resultRows(item.test, catalogTest, patient?.sex ?? null, ageDays)) {
        const value = kept.get(`${row.section}|${row.name}`) ?? row.defaultValue;
        rows.push({
          reportId: report.id,
          testNo: rows.length + 1,
          sortOrder: rows.length,
          testId: item.catalogId,
          parameterId: row.parameterId,
          section: row.section,
          name: row.name,
          value,
          unit: row.unit || null,
          reference: row.reference || null,
          flag: computeFlag(value, row.reference),
        });
      }
    }

    await tx.reportTest.deleteMany({ where: { reportId: report.id } });
    if (rows.length) await tx.reportTest.createMany({ data: rows });
  }

  // ---- radiology reports (one per scan on the bill)
  const scans = saved.filter((s) => !LAB_LIKE.has(s.test.modality));
  const scanIds = scans.map((s) => s.id);

  await tx.radiologyReport.deleteMany({
    where: { billId, OR: [{ billInvestigationId: null }, { billInvestigationId: { notIn: scanIds.length ? scanIds : [0] } }] },
  });

  const haveReport = new Set(
    (await tx.radiologyReport.findMany({ where: { billId }, select: { billInvestigationId: true } })).map(
      (r) => r.billInvestigationId,
    ),
  );

  const newScans = scans.filter((s) => !haveReport.has(s.id));
  if (newScans.length) {
    await tx.radiologyReport.createMany({
      data: newScans.map((s) => ({
        billId,
        billInvestigationId: s.id,
        modality: s.test.modality,
        studyName: s.test.name,
        status: "Report Pending",
      })),
    });
  }

  // ---- outsource cases
  const outsourced = saved.filter((s) => s.test.modality === "outsource");
  const outsourcedIds = outsourced.map((s) => s.id);

  await tx.outsourceCase.deleteMany({
    where: { billId, OR: [{ billInvestigationId: null }, { billInvestigationId: { notIn: outsourcedIds.length ? outsourcedIds : [0] } }] },
  });

  const haveCase = new Set(
    (await tx.outsourceCase.findMany({ where: { billId }, select: { billInvestigationId: true } })).map(
      (c) => c.billInvestigationId,
    ),
  );

  const newCases = outsourced.filter((s) => !haveCase.has(s.id));
  if (newCases.length) {
    await tx.outsourceCase.createMany({
      data: newCases.map((s) => ({
        billId,
        billInvestigationId: s.id,
        testName: s.test.name,
        outsourceLabId: byName.get(s.test.name.toLowerCase())?.outsourceLab?.id ?? null,
        status: "Pending",
      })),
    });
  }
}

interface ResultRow {
  section: string;
  name: string;
  unit: string;
  reference: string;
  defaultValue: string;
  parameterId: number | null;
}

/** The result lines a test produces on a report. */
export function resultRows(
  test: CleanTest,
  catalogTest: CatalogTest | undefined,
  sex: string | null,
  ageDays: number | null,
): ResultRow[] {
  if (!catalogTest) {
    return [
      {
        section: test.section || "LABORATORY",
        name: test.name,
        unit: test.unit ?? "",
        reference: test.reference ?? "",
        defaultValue: "",
        parameterId: null,
      },
    ];
  }

  const category = (catalogTest.category?.name ?? "").toUpperCase() || test.section || "LABORATORY";
  const params = catalogTest.parameters;

  const line = (p: (typeof params)[number], section: string, name = p.name): ResultRow => ({
    section,
    name,
    unit: p.unit?.name ?? "",
    reference: pickReference(p.referenceRanges, sex, ageDays) || test.reference || "",
    defaultValue: p.defaultValue ?? "",
    parameterId: p.id,
  });

  if (catalogTest.testType === "single") {
    const p = params[0];
    return p
      ? [{ ...line(p, category, test.name), unit: p.unit?.name ?? test.unit ?? "" }]
      : [{ section: category, name: test.name, unit: test.unit ?? "", reference: test.reference ?? "", defaultValue: "", parameterId: null }];
  }

  if (catalogTest.testType === "document" || !params.length) {
    return [{ section: category, name: test.name, unit: "", reference: "", defaultValue: "", parameterId: null }];
  }

  if (catalogTest.testType === "nested") {
    const parents = new Set(params.map((p) => p.parentId).filter((v): v is number => v !== null));
    const nameById = new Map(params.map((p) => [p.id, p.name]));

    // Parents are headings; their children are listed under them.
    return params
      .filter((p) => !parents.has(p.id))
      .map((p) => line(p, p.parentId !== null ? (nameById.get(p.parentId) ?? category) : (p.groupBy ?? test.name)));
  }

  return params.map((p) => line(p, p.groupBy || category));
}
