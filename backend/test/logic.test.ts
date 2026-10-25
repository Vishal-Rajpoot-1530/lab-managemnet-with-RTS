import assert from "node:assert/strict";
import { describe, it } from "node:test";

process.env.APP_TIMEZONE = "Asia/Kolkata";
process.env.JWT_SECRET = "x".repeat(40);
process.env.DATABASE_URL = "mysql://u:p@localhost:3306/x";

const { calculateTotals, parseInvestigations, parseModalityPayments } = await import("../src/services/billingService.js");
const { pickReference, computeFlag, patientAgeDays } = await import("../src/services/reportBuilder.js");
const { splitName, readPatient, ageText } = await import("../src/services/patientService.js");
const fmt = await import("../src/utils/format.js");
const v = await import("../src/utils/validate.js");

describe("bill totals", () => {
  it("adds tests and collection charge, subtracts discount and received", () => {
    const t = calculateTotals({ prices: [350, 500], collectionCharge: 50, discount: 50, received: 400 });
    assert.deepEqual(t, { total: 900, discount: 50, received: 400, collectionCharge: 50, balance: 450 });
  });
  it("never lets balance go below zero", () => {
    assert.equal(calculateTotals({ prices: [100], collectionCharge: 0, discount: 0, received: 150 }).balance, 0);
  });
  it("rounds to paise", () => {
    assert.equal(calculateTotals({ prices: [0.1, 0.2], collectionCharge: 0, discount: 0, received: 0 }).total, 0.3);
  });
  it("rejects negatives and discount above total", () => {
    assert.throws(() => calculateTotals({ prices: [100], collectionCharge: 0, discount: 0, received: -1 }), /negative/);
    assert.throws(() => calculateTotals({ prices: [100], collectionCharge: 0, discount: 101, received: 0 }), /Discount/);
  });
});

describe("investigation parsing", () => {
  it("reads the grouped format the bill form sends", () => {
    const r = parseInvestigations({ lab: [{ name: " CBC ", price: "350" }], usg: [{ name: "USG Abdomen", price: 800 }], xray: [] });
    assert.equal(r.length, 2);
    assert.deepEqual([r[0]!.modality, r[0]!.name, r[0]!.price, r[0]!.section], ["lab", "CBC", 350, "LABORATORY"]);
    assert.equal(r[1]!.section, "USG");
  });
  it("reads a flat list with type", () => {
    assert.equal(parseInvestigations([{ name: "X", price: 1, type: "ctScan" }])[0]!.modality, "ctScan");
  });
  it("skips blank names, rejects unknown modality and negative price", () => {
    assert.equal(parseInvestigations({ lab: [{ name: "  ", price: 5 }] }).length, 0);
    assert.throws(() => parseInvestigations({ nope: [{ name: "A", price: 1 }] }), /Unknown/);
    assert.throws(() => parseInvestigations({ lab: [{ name: "A", price: -1 }] }), /negative/);
  });
  it("keeps only non-zero payment boxes", () => {
    const r = parseModalityPayments({ lab: { paid: "100", discount: 0 }, usg: { paid: 0, discount: 0 } });
    assert.deepEqual(r, { lab: { paid: 100, discount: 0 } });
  });
});

describe("patient helpers", () => {
  it("splits titles and names", () => {
    assert.deepEqual(splitName("Mr. Rahul Kumar Sharma"), { title: "Mr.", firstName: "Rahul", lastName: "Kumar Sharma" });
    assert.deepEqual(splitName("Anita"), { title: "", firstName: "Anita", lastName: "" });
  });
  it("turns blank UHID into null (so the unique index allows many)", () => {
    assert.equal(readPatient({ firstName: "A", uhid: "  " }).uhid, null);
  });
  it("cleans aadhaar and mobile, formats age", () => {
    const p = readPatient({ firstName: "A", aadhaar: "1234 5678 9012 99", mobile: "98765-43210", years: "26", months: "", days: null });
    assert.equal(p.aadhaar, "123456789012");
    assert.equal(p.mobile, "9876543210");
    assert.equal(ageText(p), "26 YRS");
  });
  it("age in days", () => {
    assert.equal(patientAgeDays({ years: 1, months: 1, days: 1 }), 396);
    assert.equal(patientAgeDays({ years: null, months: null, days: null }), null);
  });
});

describe("reference ranges and flags", () => {
  const ranges = [
    { sex: "ANY", ageFromDays: 0, ageToDays: null, lowValue: 12, highValue: 15, rangeText: null },
    { sex: "MALE", ageFromDays: 0, ageToDays: null, lowValue: 13, highValue: 17, rangeText: null },
    { sex: "ANY", ageFromDays: 0, ageToDays: 30, lowValue: null, highValue: null, rangeText: "see chart" },
  ] as never;
  it("prefers sex specific ranges", () => assert.equal(pickReference(ranges, "male", 9000), "13 - 17"));
  it("falls back to ANY", () => assert.equal(pickReference(ranges, "FEMALE", 9000), "12 - 15"));
  it("respects age limits", () => assert.equal(pickReference(ranges, "FEMALE", 10), "12 - 15"));
  it("flags values", () => {
    assert.equal(computeFlag("12", "13.0 - 17.0"), "L");
    assert.equal(computeFlag("18", "13.0 - 17.0"), "H");
    assert.equal(computeFlag("15", "13.0 - 17.0"), "N");
    assert.equal(computeFlag("abc", "13 - 17"), null);
    assert.equal(computeFlag("5", "< 10"), null);
  });
});

describe("dates in the lab time zone (IST)", () => {
  it("a UTC evening time is already the next day in India", () => {
    assert.equal(fmt.dateKey(new Date("2026-10-18T20:00:00Z")), "2026-10-19");
  });
  it("start of an IST day is 18:30 UTC the day before", () => {
    assert.equal(fmt.startOfDay("2026-10-19")!.toISOString(), "2026-10-18T18:30:00.000Z");
  });
  it("day range is 24h, inclusive from/to range works", () => {
    const d = fmt.dayRange("2026-10-19");
    assert.equal(d.lt.getTime() - d.gte.getTime(), 86_400_000);
    const r = fmt.dateRange("2026-10-01", "2026-10-31")!;
    assert.equal(r.gte!.toISOString(), "2026-09-30T18:30:00.000Z");
    assert.equal(r.lt!.toISOString(), "2026-10-31T18:30:00.000Z");
  });
  it("month range and invalid input", () => {
    assert.equal(fmt.monthRange("2026-12")!.lt.toISOString(), "2026-12-31T18:30:00.000Z");
    assert.equal(fmt.monthRange("nope"), null);
    assert.equal(fmt.startOfDay("2026-13-99")?.getTime() !== undefined, true);
  });
  it("display formats", () => {
    assert.equal(fmt.displayDate(new Date("2026-10-18T20:00:00Z")), "19/10/2026");
    assert.equal(fmt.displayTime(new Date("2026-10-18T20:00:00Z")), "01:30 AM");
  });
});

describe("validators", () => {
  it("ids", () => {
    assert.equal(v.id("5"), 5);
    assert.equal(v.id("0"), null);
    assert.equal(v.id("abc"), null);
    assert.throws(() => v.idParam("x"), /Invalid/);
  });
  it("numbers and text", () => {
    assert.equal(v.num("1,200.50"), 1200.5);
    assert.equal(v.num("abc"), 0);
    assert.equal(v.text(42), "42");
    assert.throws(() => v.reqText("", "Name"), /required/);
  });
});
