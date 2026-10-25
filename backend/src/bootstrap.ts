// import { env } from "./config/env.js";
// import { prisma } from "./lib/prisma.js";

// const BCRYPT = /^\$2[aby]\$\d{2}\$/;

// /**
//  * Runs on every start. Safe to repeat: it only fills in what is missing and
//  * never overwrites anything you changed.
//  */
// export async function bootstrap(): Promise<void> {
//   await prisma.$queryRaw`SELECT 1`; // fail fast if MySQL is unreachable

//   // Result input types the test form relies on.
//   await prisma.inputType.createMany({
//     data: [
//       { code: "single_line", name: "Single Line" },
//       { code: "numeric", name: "Numeric" },
//       { code: "paragraph", name: "Paragraph" },
//     ],
//     skipDuplicates: true,
//   });

//   await prisma.collectionCentre.createMany({ data: [{ name: "Main" }], skipDuplicates: true });

//   await prisma.appSetting.createMany({
//     data: [
//       { userId: 0, scope: "billing", settingKey: "reg_no_start", settingValue: 41025 },
//       { userId: 0, scope: "billing", settingKey: "case_no_prefix", settingValue: "L" },
//       { userId: 0, scope: "billing", settingKey: "default_payment_mode", settingValue: "cash" },
//     ],
//     skipDuplicates: true,
//   });

//   // The bill form needs someone to pick as "Self" and an agent to start with.
//   if ((await prisma.referrer.count()) === 0) {
//     await prisma.referrer.create({
//       data: { title: "Dr.", firstName: "Self", lastName: null, name: "Dr. Self", active: true },
//     });
//   }
//   if ((await prisma.agent.count()) === 0) {
//     await prisma.agent.create({ data: { name: "Main Collection Agent", active: true } });
//   }

//   await ensureOwner();
// }

// async function ensureOwner(): Promise<void> {
//   const { adminEmail, adminPasswordHash } = env;

//   if (!adminEmail || !adminPasswordHash) {
//     if ((await prisma.user.count()) === 0) {
//       console.warn("No users exist and ADMIN_EMAIL / ADMIN_PASSWORD_HASH are not set: nobody can log in.");
//     }
//     return;
//   }

//   if (!BCRYPT.test(adminPasswordHash)) {
//     console.warn("ADMIN_PASSWORD_HASH is not a bcrypt hash. See backend/.env.example.");
//     return;
//   }

//   if (await prisma.user.findUnique({ where: { email: adminEmail } })) return;

//   await prisma.$transaction(async (tx) => {
//     const employee =
//       (await tx.employee.findFirst({ where: { email: adminEmail } })) ??
//       (await tx.employee.create({
//         data: { name: env.adminName, email: adminEmail, role: "Lab owner", isOwner: true, active: true, permissions: ["all"] },
//       }));

//     await tx.user.create({
//       data: { employeeId: employee.id, name: env.adminName, email: adminEmail, passwordHash: adminPasswordHash, role: "owner" },
//     });
//   });

//   console.log(`Owner account created for ${adminEmail}.`);
// }



import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import { LAB_LIKE } from "./services/reportBuilder.js";

const BCRYPT = /^\$2[aby]\$\d{2}\$/;

/**
 * Runs on every start. Safe to repeat: it only fills in what is missing and
 * never overwrites anything you changed.
 */
export async function bootstrap(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`; // fail fast if MySQL is unreachable

  // Result input types the test form relies on.
  await prisma.inputType.createMany({
    data: [
      { code: "single_line", name: "Single Line" },
      { code: "numeric", name: "Numeric" },
      { code: "paragraph", name: "Paragraph" },
    ],
    skipDuplicates: true,
  });

  await prisma.collectionCentre.createMany({ data: [{ name: "Main" }], skipDuplicates: true });

  await prisma.appSetting.createMany({
    data: [
      { userId: 0, scope: "billing", settingKey: "reg_no_start", settingValue: 41025 },
      { userId: 0, scope: "billing", settingKey: "case_no_prefix", settingValue: "L" },
      { userId: 0, scope: "billing", settingKey: "default_payment_mode", settingValue: "cash" },
    ],
    skipDuplicates: true,
  });

  // The bill form needs someone to pick as "Self" and an agent to start with.
  if ((await prisma.referrer.count()) === 0) {
    await prisma.referrer.create({
      data: { title: "Dr.", firstName: "Self", lastName: null, name: "Dr. Self", active: true },
    });
  }
  if ((await prisma.agent.count()) === 0) {
    await prisma.agent.create({ data: { name: "Main Collection Agent", active: true } });
  }

  await ensureOwner();
  await backfillCases();
}

async function ensureOwner(): Promise<void> {
  const { adminEmail, adminPasswordHash } = env;

  if (!adminEmail || !adminPasswordHash) {
    if ((await prisma.user.count()) === 0) {
      console.warn("No users exist and ADMIN_EMAIL / ADMIN_PASSWORD_HASH are not set: nobody can log in.");
    }
    return;
  }

  if (!BCRYPT.test(adminPasswordHash)) {
    console.warn("ADMIN_PASSWORD_HASH is not a bcrypt hash. See backend/.env.example.");
    return;
  }

  if (await prisma.user.findUnique({ where: { email: adminEmail } })) return;

  await prisma.$transaction(async (tx) => {
    const employee =
      (await tx.employee.findFirst({ where: { email: adminEmail } })) ??
      (await tx.employee.create({
        data: { name: env.adminName, email: adminEmail, role: "Lab owner", isOwner: true, active: true, permissions: ["all"] },
      }));

    await tx.user.create({
      data: { employeeId: employee.id, name: env.adminName, email: adminEmail, passwordHash: adminPasswordHash, role: "owner" },
    });
  });

  console.log(`Owner account created for ${adminEmail}.`);
}

/**
 * Bills saved before scan cases existed have their USG / X-ray tests but no case
 * row, so they never showed in "Today's cases". This creates the missing rows
 * (dated with the bill's own date). It does nothing once everything exists.
 */
async function backfillCases(): Promise<void> {
  const labLike = [...LAB_LIKE];

  const scans = await prisma.billInvestigation.findMany({
    where: { modality: { notIn: labLike }, bill: { status: { not: "Cancelled" } } },
    select: { id: true, billId: true, modality: true, name: true, bill: { select: { createdAt: true } } },
  });

  if (scans.length) {
    const have = new Set(
      (await prisma.radiologyReport.findMany({ select: { billInvestigationId: true } })).map((r) => r.billInvestigationId),
    );
    const missing = scans.filter((s) => !have.has(s.id));

    if (missing.length) {
      await prisma.radiologyReport.createMany({
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

  const outsourced = await prisma.billInvestigation.findMany({
    where: { modality: "outsource", bill: { status: { not: "Cancelled" } } },
    select: { id: true, billId: true, name: true, bill: { select: { createdAt: true } } },
  });

  if (outsourced.length) {
    const have = new Set(
      (await prisma.outsourceCase.findMany({ select: { billInvestigationId: true } })).map((c) => c.billInvestigationId),
    );
    const missing = outsourced.filter((s) => !have.has(s.id));

    if (missing.length) {
      await prisma.outsourceCase.createMany({
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