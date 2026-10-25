/**
 * Starting data for a brand-new database.
 * Safe to run more than once: rows that already exist are skipped, so it never
 * overwrites anything you changed.
 *
 *   npm run db:seed
 *
 * The default referrer ("Dr. Self"), a collection agent and the owner login are
 * created by the backend itself on every start (src/bootstrap.ts), not here.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // The lab's own details (edit these later in the app's Settings)
  await prisma.labProfile.createMany({
    data: [
      {
        id: 1,
        name: "Advance Edge Diagnosis",
        address: "CHS Apollo Hospital Gesa Colony, Hospital Road",
        phone: "7049390120",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.collectionCentre.createMany({
    data: [{ name: "Main" }],
    skipDuplicates: true,
  });

  const categories = [
    "Haematology",
    "Biochemistry",
    "Serology & Immunology",
    "Clinical Pathology",
    "Cytology",
    "Microbiology",
    "Endocrinology",
    "Histopathology",
    "Others",
    "Miscellaneous",
  ];

  await prisma.testCategory.createMany({
    data: categories.map((name, index) => ({ name, sortOrder: index + 1 })),
    skipDuplicates: true,
  });

  await prisma.inputType.createMany({
    data: [
      { code: "numeric", name: "Numeric" },
      { code: "single_line", name: "Single Line" },
      { code: "dropdown", name: "Dropdown" },
      { code: "paragraph", name: "Paragraph" },
      { code: "date", name: "Date" },
      { code: "formula", name: "Calculated (formula)" },
      { code: "heading", name: "Heading only" },
    ],
    skipDuplicates: true,
  });

  const units = [
    "g/dL",
    "mg/dL",
    "/cumm",
    "%",
    "fL",
    "pg",
    "U/L",
    "mmol/L",
    "IU/mL",
    "ng/mL",
    "pg/mL",
    "µg/dL",
    "µIU/mL",
    "mIU/L",
    "million/cumm",
    "lakhs/cumm",
    "mm/hr",
    "sec",
    "mEq/L",
  ];

  await prisma.unit.createMany({
    data: units.map((name) => ({ name })),
    skipDuplicates: true,
  });

  await prisma.expenseCategory.createMany({
    data: [
      "Rent",
      "Salaries",
      "Reagents and consumables",
      "Equipment and repairs",
      "Electricity and water",
      "Transport",
      "Marketing",
      "Miscellaneous",
    ].map((name) => ({ name })),
    skipDuplicates: true,
  });

  // userId 0 = applies to everyone
  await prisma.appSetting.createMany({
    data: [
      { userId: 0, scope: "billing", settingKey: "reg_no_start", settingValue: 41025 },
      { userId: 0, scope: "billing", settingKey: "case_no_prefix", settingValue: "L" },
      { userId: 0, scope: "billing", settingKey: "default_payment_mode", settingValue: "cash" },
      { userId: 0, scope: "report", settingKey: "show_lab_logo", settingValue: true },
      { userId: 0, scope: "report", settingKey: "show_signature", settingValue: true },
      { userId: 0, scope: "notification", settingKey: "whatsapp_bill", settingValue: true },
      { userId: 0, scope: "notification", settingKey: "email_reports", settingValue: false },
    ],
    skipDuplicates: true,
  });

  console.log("Seed finished.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
