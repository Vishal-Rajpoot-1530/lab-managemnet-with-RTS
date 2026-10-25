import { prisma } from "../lib/prisma.js";
import { badRequest, conflict, notFound } from "../utils/ApiError.js";
import { iso, money, toNumber } from "../utils/format.js";
import { asBody, bool, id as toId, num, optText, reqText } from "../utils/validate.js";

// Packages and panels are both "a named group of tests with a price".
interface GroupRow {
  id: number;
  code: string | null;
  name: string;
  price: unknown;
  description: string | null;
  active: boolean;
  createdAt: Date;
  items: { sortOrder: number; test: { id: number; name: string } }[];
}

const serializeGroup = (g: GroupRow) => {
  const tests = [...g.items].sort((a, b) => a.sortOrder - b.sortOrder).map((i) => ({ id: i.test.id, name: i.test.name }));
  return {
    id: g.id,
    code: g.code ?? "",
    name: g.name,
    price: toNumber(g.price as number),
    fee: toNumber(g.price as number),
    description: g.description ?? "",
    active: g.active,
    tests,
    included: tests.map((t) => t.name),
    createdAt: iso(g.createdAt),
  };
};

async function readGroup(input: unknown) {
  const body = asBody(input);
  const price = money(num(body.price ?? body.fee));
  if (price < 0) throw badRequest("Price cannot be negative.");

  const testIds = [...new Set((Array.isArray(body.testIds) ? body.testIds : []).map(toId).filter((v): v is number => !!v))];
  if (testIds.length && (await prisma.test.count({ where: { id: { in: testIds }, active: true } })) !== testIds.length) {
    throw badRequest("One or more selected tests do not exist.");
  }

  return {
    testIds,
    data: {
      name: reqText(body.name, "Name"),
      code: optText(body.code, 40),
      price,
      description: optText(body.description, 5000),
      active: bool(body.active, true),
    },
  };
}

const itemInclude = { items: { include: { test: { select: { id: true, name: true } } } } } as const;
const itemRows = (testIds: number[]) => testIds.map((testId, sortOrder) => ({ testId, sortOrder }));

// ---- packages
export async function listPackages() {
  return (await prisma.testPackage.findMany({ include: itemInclude, orderBy: { name: "asc" } })).map(serializeGroup);
}

export async function savePackage(packageId: number | null, input: unknown) {
  const { data, testIds } = await readGroup(input);
  const clash = await prisma.testPackage.findFirst({ where: { name: data.name, ...(packageId ? { id: { not: packageId } } : {}) } });
  if (clash) throw conflict("A package with this name already exists.");

  const row = await prisma.$transaction(async (tx) => {
    if (packageId !== null && !(await tx.testPackage.findUnique({ where: { id: packageId } }))) throw notFound("Package");

    const saved = packageId === null
      ? await tx.testPackage.create({ data })
      : await tx.testPackage.update({ where: { id: packageId }, data });

    await tx.testPackageItem.deleteMany({ where: { packageId: saved.id } });
    if (testIds.length) await tx.testPackageItem.createMany({ data: itemRows(testIds).map((r) => ({ ...r, packageId: saved.id })) });
    return tx.testPackage.findUniqueOrThrow({ where: { id: saved.id }, include: itemInclude });
  });
  return serializeGroup(row);
}

export async function removePackage(packageId: number) {
  const r = await prisma.testPackage.deleteMany({ where: { id: packageId } });
  if (!r.count) throw notFound("Package");
}

// ---- panels
export async function listPanels() {
  return (await prisma.testPanel.findMany({ include: itemInclude, orderBy: { name: "asc" } })).map(serializeGroup);
}

export async function savePanel(panelId: number | null, input: unknown) {
  const { data, testIds } = await readGroup(input);
  const clash = await prisma.testPanel.findFirst({ where: { name: data.name, ...(panelId ? { id: { not: panelId } } : {}) } });
  if (clash) throw conflict("A panel with this name already exists.");

  const row = await prisma.$transaction(async (tx) => {
    if (panelId !== null && !(await tx.testPanel.findUnique({ where: { id: panelId } }))) throw notFound("Panel");

    const saved = panelId === null
      ? await tx.testPanel.create({ data })
      : await tx.testPanel.update({ where: { id: panelId }, data });

    await tx.testPanelItem.deleteMany({ where: { panelId: saved.id } });
    if (testIds.length) await tx.testPanelItem.createMany({ data: itemRows(testIds).map((r) => ({ ...r, panelId: saved.id })) });
    return tx.testPanel.findUniqueOrThrow({ where: { id: saved.id }, include: itemInclude });
  });
  return serializeGroup(row);
}

export async function removePanel(panelId: number) {
  const r = await prisma.testPanel.deleteMany({ where: { id: panelId } });
  if (!r.count) throw notFound("Panel");
}

// ---- interpretations
const serializeInterpretation = (i: { id: number; testId: number | null; name: string; content: string; active: boolean; test: { name: string } | null }) => ({
  id: i.id,
  testId: i.testId,
  kind: "Test",
  name: i.name,
  testName: i.test?.name ?? "",
  text: i.content,
  content: i.content,
  active: i.active,
});

export async function listInterpretations() {
  const rows = await prisma.interpretation.findMany({ where: { active: true }, include: { test: { select: { name: true } } }, orderBy: { name: "asc" } });
  return rows.map(serializeInterpretation);
}

export async function saveInterpretation(interpretationId: number | null, input: unknown) {
  const body = asBody(input);
  const testId = toId(body.testId);
  if (testId && !(await prisma.test.findUnique({ where: { id: testId } }))) throw badRequest("Selected test does not exist.");

  const data = {
    testId,
    name: reqText(body.name, "Name"),
    content: reqText(body.content ?? body.text, "Interpretation", 16_000_000),
    active: bool(body.active, true),
  };

  if (interpretationId !== null && !(await prisma.interpretation.findUnique({ where: { id: interpretationId } }))) {
    throw notFound("Interpretation");
  }

  const row = interpretationId === null
    ? await prisma.interpretation.create({ data, include: { test: { select: { name: true } } } })
    : await prisma.interpretation.update({ where: { id: interpretationId }, data, include: { test: { select: { name: true } } } });
  return serializeInterpretation(row);
}

export async function removeInterpretation(interpretationId: number) {
  const r = await prisma.interpretation.deleteMany({ where: { id: interpretationId } });
  if (!r.count) throw notFound("Interpretation");
}

// ---------------------------------------------------------------------
// Support tickets  - /api/support/tickets
// ---------------------------------------------------------------------
export async function createTicket(input: unknown, user: { name: string; email: string }) {
  const body = asBody(input);
  return prisma.supportTicket.create({
    data: {
      userName: user.name,
      email: optText(body.email, 190) ?? user.email,
      subject: reqText(body.subject, "Subject"),
      message: reqText(body.message, "Message", 20000),
    },
  });
}

export const listTickets = () => prisma.supportTicket.findMany({ orderBy: { id: "desc" }, take: 200 });
