import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { env } from "./config/env.js";
import { controlPrisma } from "./lib/prisma.js";
import { LAB_LIKE } from "./services/reportBuilder.js";

/**
 * Runs on every start. The main database only holds the super admin and the lab
 * accounts. This checks that it can be reached and, on a fresh install, creates the
 * first super admin from .env. Lab admins are never created here: the super admin
 * creates them in the Super admin panel.
 */
export async function bootstrap(): Promise<void> {
  await controlPrisma.$queryRaw`SELECT 1`; // fail fast if MySQL is unreachable
  await ensureSuperAdmin();
}

/** Only acts while NO super admin exists. Never changes an existing super admin. */
async function ensureSuperAdmin(): Promise<void> {
  if ((await controlPrisma.superAdmin.count()) > 0) return;

  const { superAdminEmail: email, superAdminPassword: password, superAdminName: name } = env;

  if (!email || !password) {
    console.warn(
      "No super admin exists yet. Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in backend/.env and restart the server.",
    );
    return;
  }
  if (password.length < 8) {
    console.warn("SUPER_ADMIN_PASSWORD must be at least 8 characters. No super admin was created.");
    return;
  }

  await controlPrisma.superAdmin.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12) } });
  console.log(`Super admin created for ${email}. You can now remove SUPER_ADMIN_PASSWORD from .env.`);
}

/**
 * Fills in what a lab's own database needs before it can be used. Runs when the lab
 * admin signs in on the Admin login page. Safe to repeat: it only adds what is
 * missing and never overwrites anything that was changed.
 *
 * backfill: also create case rows for bills saved before scan / outsource cases
 * existed. Only needed when a database with older data is connected, so it is
 * switched on just for the first connection.
 */
export async function setupLabDefaults(db: PrismaClient, options: { backfill?: boolean } = {}): Promise<void> {
  // Result input types the test form relies on.
  await db.inputType.createMany({
    data: [
      { code: "single_line", name: "Single Line" },
      { code: "numeric", name: "Numeric" },
      { code: "paragraph", name: "Paragraph" },
    ],
    skipDuplicates: true,
  });

  await db.collectionCentre.createMany({ data: [{ name: "Main" }], skipDuplicates: true });

  await db.appSetting.createMany({
    data: [
      { userId: 0, scope: "billing", settingKey: "reg_no_start", settingValue: 41025 },
      { userId: 0, scope: "billing", settingKey: "case_no_prefix", settingValue: "L" },
      { userId: 0, scope: "billing", settingKey: "default_payment_mode", settingValue: "cash" },
    ],
    skipDuplicates: true,
  });

  // The bill form needs someone to pick as "Self" and an agent to start with.
  if ((await db.referrer.count()) === 0) {
    await db.referrer.create({
      data: { title: "Dr.", firstName: "Self", lastName: null, name: "Dr. Self", active: true },
    });
  }
  if ((await db.agent.count()) === 0) {
    await db.agent.create({ data: { name: "Main Collection Agent", active: true } });
  }

  if (options.backfill) await backfillCases(db);
}

/**
 * Bills saved before scan cases existed have their USG / X-ray tests but no case
 * row, so they never showed in "Today's cases". This creates the missing rows
 * (dated with the bill's own date). It does nothing once everything exists.
 */
async function backfillCases(db: PrismaClient): Promise<void> {
  const labLike = [...LAB_LIKE];

  const scans = await db.billInvestigation.findMany({
    where: { modality: { notIn: labLike }, bill: { status: { not: "Cancelled" } } },
    select: { id: true, billId: true, modality: true, name: true, bill: { select: { createdAt: true } } },
  });

  if (scans.length) {
    const have = new Set(
      (await db.radiologyReport.findMany({ select: { billInvestigationId: true } })).map((r) => r.billInvestigationId),
    );
    const missing = scans.filter((s) => !have.has(s.id));

    if (missing.length) {
      await db.radiologyReport.createMany({
        data: missing.map((s) => ({
          billId: s.billId,
          billInvestigationId: s.id,
          modality: s.modality,
          studyName: s.name,
          status: "Report Pending",
          createdAt: s.bill.createdAt,
        })),
      });
      console.log(`Created ${missing.length} missing scan case(s) from existing bills.`);
    }
  }

  const outsourced = await db.billInvestigation.findMany({
    where: { modality: "outsource", bill: { status: { not: "Cancelled" } } },
    select: { id: true, billId: true, name: true, bill: { select: { createdAt: true } } },
  });

  if (outsourced.length) {
    const have = new Set(
      (await db.outsourceCase.findMany({ select: { billInvestigationId: true } })).map((c) => c.billInvestigationId),
    );
    const missing = outsourced.filter((s) => !have.has(s.id));

    if (missing.length) {
      await db.outsourceCase.createMany({
        data: missing.map((s) => ({
          billId: s.billId,
          billInvestigationId: s.id,
          testName: s.name,
          status: "Pending",
          createdAt: s.bill.createdAt,
        })),
      });
      console.log(`Created ${missing.length} missing outsource case(s) from existing bills.`);
    }
  }
}