/**
 * End-to-end check against YOUR running backend and MySQL.
 *
 *   1. npm run dev            (in one terminal)
 *   2. npm run smoke          (in another)  -> creates test data, checks every module
 *   3. stop and restart the backend (npm run dev)
 *   4. npm run smoke -- --verify   -> proves the data survived the restart
 *
 * Login uses SMOKE_EMAIL / SMOKE_PASSWORD (your ADMIN_EMAIL and the password you
 * hashed). Test rows are named "SMOKE ..." so you can find and delete them.
 */
import fs from "node:fs";

const BASE = process.env.API_URL ?? "http://localhost:4000/api";
const STATE = new URL("./.smoke-state.json", import.meta.url);
const verifyOnly = process.argv.includes("--verify");

let token = "";
let failures = 0;

type Json = Record<string, any>;

async function api(method: string, path: string, body?: unknown): Promise<{ status: number; data: Json }> {
  const res = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as Json;
  return { status: res.status, data };
}

function check(name: string, ok: boolean, detail?: unknown) {
  if (ok) console.log(`  PASS  ${name}`);
  else {
    failures++;
    console.log(`  FAIL  ${name}${detail === undefined ? "" : `  -> ${JSON.stringify(detail).slice(0, 300)}`}`);
  }
}

async function login() {
  const email = process.env.SMOKE_EMAIL ?? process.env.ADMIN_EMAIL;
  const password = process.env.SMOKE_PASSWORD;
  if (!email || !password) {
    console.error("Set SMOKE_EMAIL and SMOKE_PASSWORD (your admin login) first.");
    process.exit(2);
  }
  const r = await api("POST", "/auth/login", { email, password });
  check("login", r.status === 200 && !!r.data.token, r.data);
  if (!r.data.token) process.exit(1);
  token = r.data.token;
  check("GET /auth/me", (await api("GET", "/auth/me")).status === 200);
}

async function verify() {
  const s = JSON.parse(fs.readFileSync(STATE, "utf8")) as Json;
  console.log("\nVerifying data created before the restart...");
  const bill = await api("GET", `/billing/${s.billId}`);
  check("bill still exists", bill.status === 200 && bill.data.regNo === s.regNo, bill.data);
  check("bill is cancelled as saved", bill.data.status === "Cancelled");
  check("transactions persisted", (bill.data.transactions ?? []).length >= 2);
  const rep = await api("GET", `/reports?billId=${s.billId}`);
  const report = rep.data.items?.[0];
  check("report persisted with entered values", report?.tests?.some((t: Json) => t.value === "14.5"), report);
  check("referrer persisted", (await api("GET", `/doctors/${s.referrerId}`)).status === 200);
  check("agent persisted", (await api("GET", "/cases/agents")).data.items?.some((a: Json) => a.id === s.agentId));
  check("test (with parameters) persisted", (await api("GET", `/lab/tests/${s.testId}`)).data.data?.parameters?.length === 2);
  check("patient persisted", (await api("GET", `/patients/${s.patientId}`)).status === 200);
}

async function run() {
  const stamp = Date.now().toString().slice(-6);
  const state: Json = {};

  console.log("\nCatalogue");
  const cat = await api("POST", "/lab/test-categories", { name: `SMOKE Category ${stamp}` });
  check("create category", cat.status === 201, cat.data);
  const unit = await api("POST", "/lab/units", { name: `smk${stamp}` });
  check("create unit", unit.status === 201, unit.data);
  const types = await api("GET", "/lab/input-types");
  check("input types listed (value/label)", types.data.data?.some((t: Json) => t.value === "single_line" && t.label), types.data);

  const testName = `SMOKE Panel ${stamp}`;
  const test = await api("POST", "/lab/tests", {
    type: "multi", name: testName, shortName: "SMK", categoryId: cat.data.data?.id, price: 400,
    parameters: [
      { order: 1, name: "Hemoglobin", unitId: unit.data.data?.id, inputType: "numeric" },
      { order: 2, name: "TLC", unitId: unit.data.data?.id, inputType: "numeric" },
    ],
  });
  check("create multi-parameter test", test.status === 201 && test.data.data?.parameters?.length === 2, test.data);
  state.testId = test.data.data?.id;
  check("duplicate test name rejected", (await api("POST", "/lab/tests", { type: "single", name: testName, categoryId: cat.data.data?.id, price: 1 })).status === 409);

  const edit = await api("PATCH", `/lab/tests/${state.testId}`, { ...test.data.data, price: 450 });
  check("edit test keeps parameters", edit.data.data?.parameters?.length === 2 && edit.data.data?.price === 450, edit.data);

  console.log("\nPeople");
  const ref = await api("POST", "/doctors", { title: "Dr.", firstName: "Smoke", lastName: stamp, mobile: "9000000000", active: true });
  check("create referrer", ref.status === 201, ref.data);
  state.referrerId = ref.data.id;
  const agent = await api("POST", "/cases/agents", { name: `SMOKE Agent ${stamp}` });
  check("create agent", agent.status === 201, agent.data);
  state.agentId = agent.data.id;

  console.log("\nBilling");
  const bill = await api("POST", "/billing", {
    patient: { title: "Mr.", firstName: "Smoke", lastName: `Patient${stamp}`, sex: "MALE", years: "30", mobile: "9111111111" },
    referrerId: state.referrerId, referrerName: ref.data.name,
    sampleCollectionAgentId: state.agentId, sampleCollectionAgentName: agent.data.name,
    investigations: { lab: [{ name: testName, price: 450 }], usg: [{ name: "SMOKE USG", price: 800 }], outsource: [{ name: "SMOKE Outsource", price: 300 }] },
    investigationPayments: { lab: { paid: 450, discount: 0 } },
    payment: { collectionCharge: 50, discount: 100, received: 600, mode: "UPI", remarks: "smoke" },
  });
  check("create bill", bill.status === 201 && !!bill.data.id, bill.data);
  state.billId = bill.data.id; state.regNo = bill.data.regNo; state.patientId = bill.data.patientId;
  check("total worked out by server (450+800+300+50)", bill.data.total === 1600, bill.data.total);
  check("balance = 1600-100-600", bill.data.balance === 900, bill.data.balance);
  check("investigations kept by modality", bill.data.investigations?.length === 3);
  check("modality payments kept", bill.data.investigationPayments?.lab?.paid === 450);
  check("one transaction recorded", bill.data.transactions?.length === 1 && bill.data.transactions[0].mode === "upi");

  const rep = await api("GET", `/reports?billId=${state.billId}`);
  const report = rep.data.items?.[0];
  check("lab report auto-created from catalogue parameters", report?.tests?.some((t: Json) => t.name === "Hemoglobin") && report.tests.some((t: Json) => t.name === "TLC"), report?.tests);
  check("outsource tests also on the lab report", report?.tests?.some((t: Json) => t.name === "SMOKE Outsource"));
  check("USG goes to radiology, not the lab report", !report?.tests?.some((t: Json) => t.name === "SMOKE USG"));
  check("usg case created", (await api("GET", "/usg/today")).data.items?.some((c: Json) => c.billId === state.billId));
  check("outsource case created", (await api("GET", "/cases/outsource")).data.items?.some((c: Json) => c.billId === state.billId));

  const hb = report?.tests?.find((t: Json) => t.name === "Hemoglobin");
  const saved = await api("PATCH", `/reports/${report?.id}`, { tests: [{ id: hb?.id, value: "14.5" }], interpretation: "ok", status: "Completed" });
  check("enter result + mark completed", saved.status === 200 && saved.data.status === "Completed" && saved.data.tests.find((t: Json) => t.name === "Hemoglobin")?.value === "14.5", saved.data);
  check("today's reports lists it", (await api("GET", "/reports/today")).data.items?.some((r: Json) => r.billId === state.billId));
  check("search reports by patient name", (await api("GET", `/reports/search?patient=Patient${stamp}`)).data.items?.length >= 1);

  console.log("\nModify bill (results must survive)");
  const mod = await api("PATCH", `/billing/${state.billId}`, {
    investigations: { lab: [{ name: testName, price: 450 }], usg: [{ name: "SMOKE USG", price: 800 }], outsource: [{ name: "SMOKE Outsource", price: 300 }, { name: "SMOKE Extra", price: 100 }] },
    payment: { collectionCharge: 50, discount: 100, received: 900, mode: "cash" },
  });
  check("modify bill", mod.status === 200 && mod.data.total === 1700 && mod.data.received === 900, mod.data);
  check("extra payment became a second transaction", mod.data.transactions?.length === 2);
  const after = (await api("GET", `/reports?billId=${state.billId}`)).data.items?.[0];
  check("entered Hemoglobin value kept after editing the bill", after?.tests?.find((t: Json) => t.name === "Hemoglobin")?.value === "14.5", after?.tests);
  check("lowering received below recorded is refused", (await api("PATCH", `/billing/${state.billId}`, { payment: { received: 10 } })).status === 400);

  const pay = await api("POST", `/billing/${state.billId}/payments`, { amount: 50, mode: "card" });
  check("add payment", pay.status === 201 && pay.data.received === 950, pay.data);
  check("overpayment refused", (await api("POST", `/billing/${state.billId}/payments`, { amount: 99999 })).status === 400);

  console.log("\nLists and analytics");
  check("bills list", (await api("GET", "/billing")).data.items?.some((b: Json) => b.id === state.billId));
  check("transactions page fields", (await api("GET", "/billing/transactions")).data.items?.some((t: Json) => t.registrationNo === state.regNo && t.patientName && t.paymentMode));
  check("patient list", (await api("GET", `/patients?q=Patient${stamp}`)).data.items?.length === 1);
  const daily = await api("GET", "/business/daily");
  check("daily business summary", typeof daily.data.summary?.totalIncome === "number" && daily.data.transactions?.length >= 1, daily.data.summary);
  const monthly = await api("GET", "/business/monthly");
  check("monthly analysis rows split by mode", monthly.data.items?.[0] && "upi" in monthly.data.items[0] && "cash" in monthly.data.items[0], monthly.data.items?.[0]);
  check("referral report", (await api("GET", "/business/referral-reports?period=today")).data.items?.some((i: Json) => i.referrerId === state.referrerId));
  check("activities logged", (await api("GET", "/business/activities")).data.items?.some((a: Json) => a.billId === state.billId));
  check("dashboard", typeof (await api("GET", "/dashboard")).data.summary?.billsToday === "number");

  console.log("\nManage");
  check("employees", (await api("GET", "/manage/employees")).data.items?.length >= 1);
  check("profile", (await api("GET", "/manage/profile")).data.profile?.email);
  check("lab account save + load", (await api("PUT", "/manage/lab-account", { labName: "Smoke Lab", openingTime: "08:30" })).status === 200 && (await api("GET", "/manage/lab-account")).data.lab?.openingTime === "08:30");
  check("email preferences", (await api("PUT", "/manage/email-preferences", { dailySummary: true })).data.preferences?.dailySummary === true);
  check("sessions", (await api("GET", "/manage/sessions")).data.items?.some((s: Json) => s.current));

  console.log("\nUSG / X-ray pages");
  const usgToday = (await api("GET", "/usg/today")).data.items ?? [];
  const usgCase = usgToday.find((c: Json) => c.billId === state.billId);
  check("USG case has page fields (caseId, date, status)", /^USG-\d{4}$/.test(usgCase?.caseId ?? "") && /^\d{4}-\d{2}-\d{2}$/.test(usgCase?.date ?? "") && usgCase?.status === "Report Pending", usgCase);
  const step = async (status: string) => (await api("PATCH", `/usg/${usgCase?.id}`, { status })).data;
  check("USG status -> In Progress", (await step("In Progress")).status === "In Progress");
  const done = await step("Completed");
  check("USG status -> Completed records who/when", done.status === "Completed" && !!done.reportedBy && !!done.reportedAt, done);
  check("USG status back to Report Pending", (await step("Report Pending")).status === "Report Pending");
  check("USG search by status + patient name", (await api("GET", `/usg/search?status=Report%20Pending&q=Patient${stamp}`)).data.items?.some((c: Json) => c.id === usgCase?.id));
  check("a USG case is not reachable through /xray", (await api("GET", `/xray/${usgCase?.id}`)).status === 404);

  const xrayBill = await api("POST", "/billing", {
    patient: { firstName: "Smoke", lastName: `Xray${stamp}`, sex: "FEMALE", years: "41", mobile: "9222222222" },
    investigations: { digitalXray: [{ name: "SMOKE Chest X-ray", price: 200 }] },
    payment: { received: 0 },
  });
  check("create X-ray bill", xrayBill.status === 201, xrayBill.data);
  state.xrayBillId = xrayBill.data.id;
  check("X-ray case appears in /xray/today", (await api("GET", "/xray/today")).data.items?.some((c: Json) => c.billId === state.xrayBillId && /^DXR-/.test(c.caseId)));
  check("X-ray case does not appear in /usg/today", !(await api("GET", "/usg/today")).data.items?.some((c: Json) => c.billId === state.xrayBillId));
  check("X-ray search works", (await api("GET", `/xray/search?q=Xray${stamp}`)).data.items?.length === 1);

  const tpl = await api("POST", "/usg/templates", { name: `SMOKE Template ${stamp}`, category: "Abdomen", description: "d", body: "Liver normal.", active: true });
  check("create template (category, description, text)", tpl.status === 201 && tpl.data.category === "Abdomen" && tpl.data.body === "Liver normal.", tpl.data);
  const off = await api("PATCH", `/usg/templates/${tpl.data.id}`, { active: false });
  check("disable template keeps other fields", off.data.active === false && off.data.category === "Abdomen" && off.data.name === tpl.data.name, off.data);
  check("disabled template still listed", (await api("GET", "/usg/templates")).data.items?.some((t: Json) => t.id === tpl.data.id && t.active === false));
  check("USG template is not listed under X-ray", !(await api("GET", "/xray/templates")).data.items?.some((t: Json) => t.id === tpl.data.id));
  check("delete template", (await api("DELETE", `/usg/templates/${tpl.data.id}`)).status === 204 && !(await api("GET", "/usg/templates")).data.items?.some((t: Json) => t.id === tpl.data.id));

  const sigA = await api("POST", "/xray/signatures", { name: `SMOKE Dr A ${stamp}`, role: "Radiologist", registration: "R-1", email: "a@x.com", active: true, default: true });
  const sigB = await api("POST", "/xray/signatures", { name: `SMOKE Dr B ${stamp}`, role: "Senior Radiologist", registration: "R-2", active: true });
  check("create signatures (role, registration, email)", sigA.status === 201 && sigA.data.role === "Radiologist" && sigA.data.email === "a@x.com" && sigB.status === 201, [sigA.data, sigB.data]);
  const sigList = async () => ((await api("GET", "/xray/signatures")).data.items ?? []) as Json[];
  const defaults = async () => (await sigList()).filter((s) => s.default).map((s) => s.id);
  check("A is the default", (await defaults()).includes(sigA.data.id));
  await api("PATCH", `/xray/signatures/${sigB.data.id}`, { default: true });
  const afterSet = await defaults();
  check("setting B as default clears A (only one default)", afterSet.includes(sigB.data.id) && !afterSet.includes(sigA.data.id));
  await api("PATCH", `/xray/signatures/${sigB.data.id}`, { active: false });
  const afterOff = await sigList();
  check("deactivating the default hands default to another active profile", afterOff.find((s) => s.id === sigB.data.id)?.default === false && afterOff.some((s) => s.default && s.active));
  await api("DELETE", `/xray/signatures/${sigA.data.id}`);
  await api("DELETE", `/xray/signatures/${sigB.data.id}`);
  check("delete signatures", !(await sigList()).some((s) => [sigA.data.id, sigB.data.id].includes(s.id)));
  await api("POST", `/billing/${state.xrayBillId}/cancel`, { reason: "smoke test" });

  console.log("\nCancel");
  const cancel = await api("POST", `/billing/${state.billId}/cancel`, { reason: "smoke test" });
  check("cancel bill", cancel.data.status === "Cancelled");
  check("cancelled bill cannot be modified", (await api("PATCH", `/billing/${state.billId}`, { remarks: "x" })).status === 409);

  fs.writeFileSync(STATE, JSON.stringify(state, null, 2));
  console.log("\nSaved ids to scripts/.smoke-state.json. Now RESTART the backend and run: npm run smoke -- --verify");
}

await login();
await (verifyOnly ? verify() : run());
console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
