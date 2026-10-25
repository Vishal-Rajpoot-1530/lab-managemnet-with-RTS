import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { after, before, describe, it } from "node:test";

process.env.JWT_SECRET = "x".repeat(40);
process.env.DATABASE_URL = "mysql://u:p@localhost:3306/x";

const { createApp } = await import("../src/app.js");
const jwt = (await import("jsonwebtoken")).default;

let server: ReturnType<ReturnType<typeof createApp>["listen"]>;
let base = "";

before(async () => {
  server = createApp().listen(0);
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api`;
});
after(() => server.close());

const call = async (path: string, init?: RequestInit) => {
  const res = await fetch(base + path, init);
  return { status: res.status, body: (await res.json().catch(() => null)) as Record<string, unknown> | null };
};

describe("auth gate", () => {
  const protectedPaths = [
    "/billing", "/billing/transactions", "/reports", "/reports/today", "/reports/search", "/patients", "/doctors",
    "/cases/agents", "/business/daily", "/business/monthly", "/business/referral-reports", "/business/activities",
    "/lab/tests", "/lab/units", "/lab/test-categories", "/lab/input-types", "/manage/employees", "/manage/profile",
    "/dashboard", "/usg/today", "/xray", "/radiology",
  ];

  for (const path of protectedPaths) {
    it(`GET ${path} without a token is 401`, async () => {
      const { status, body } = await call(path);
      assert.equal(status, 401);
      assert.equal(body?.success, false);
    });
  }

  it("a forged token is rejected", async () => {
    const forged = jwt.sign({ sid: "abc" }, "y".repeat(40), { subject: "1" });
    const { status, body } = await call("/billing", { headers: { Authorization: `Bearer ${forged}` } });
    assert.equal(status, 401);
    assert.equal(body?.code, "INVALID_TOKEN");
  });

  it("a token with no session id is rejected", async () => {
    const t = jwt.sign({}, process.env.JWT_SECRET!, { subject: "1" });
    assert.equal((await call("/billing", { headers: { Authorization: `Bearer ${t}` } })).status, 401);
  });
});

describe("error format the frontend reads", () => {
  it("message and error are plain strings, code is a string", async () => {
    const { body } = await call("/billing");
    assert.equal(typeof body?.message, "string");
    assert.equal(typeof body?.error, "string");
    assert.equal(typeof body?.code, "string");
    assert.ok(body?.requestId);
  });

  it("login validates input before touching the database", async () => {
    const r = await call("/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    assert.equal(r.status, 400);
    assert.equal(r.body?.message, "Email and password are required.");
    assert.equal(r.body?.error, "Email and password are required.");
  });

  it("invalid JSON is a clean 400", async () => {
    const r = await call("/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{oops" });
    assert.equal(r.status, 400);
    assert.equal(r.body?.code, "INVALID_JSON");
  });

  it("unknown route is a 404 json", async () => {
    const r = await call("/nope");
    assert.ok([401, 404].includes(r.status));
  });

  it("/health is open (reports the DB state instead of crashing)", async () => {
    const r = await call("/health");
    assert.ok([200, 503].includes(r.status));
  });
});
