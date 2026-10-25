import type { TestCategory, Unit } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { ApiError, conflict, notFound } from "../utils/ApiError.js";
import { iso } from "../utils/format.js";
import { asBody, reqText } from "../utils/validate.js";

// ---------------------------------------------------------------------
// Test categories  - /api/lab/test-categories
// ---------------------------------------------------------------------
export function serializeCategory(c: TestCategory, testCount?: number) {
  return {
    id: c.id,
    name: c.name,
    order: c.sortOrder,
    sortOrder: c.sortOrder,
    active: c.active,
    ...(testCount === undefined ? {} : { testCount }),
    createdAt: iso(c.createdAt),
    updatedAt: iso(c.updatedAt),
  };
}

export async function listCategories() {
  const rows = await prisma.testCategory.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: { _count: { select: { tests: { where: { active: true } } } } },
  });

  return rows.map((row) => serializeCategory(row, row._count.tests));
}

export async function getCategory(id: number) {
  const row = await prisma.testCategory.findFirst({ where: { id, active: true } });
  if (!row) throw notFound("Test category");
  return serializeCategory(row);
}

const duplicateCategory = () =>
  conflict("A test category with this name already exists.", "DUPLICATE_CATEGORY");

export async function createCategory(input: unknown) {
  const name = reqText(asBody(input).name, "Category name", 160);
  const existing = await prisma.testCategory.findUnique({ where: { name } });

  if (existing?.active) throw duplicateCategory();

  const next =
    ((
      await prisma.testCategory.aggregate({
        where: { active: true },
        _max: { sortOrder: true },
      })
    )._max.sortOrder ?? 0) + 1;

  // A deleted category with the same name is brought back instead of failing.
  const row = existing
    ? await prisma.testCategory.update({
        where: { id: existing.id },
        data: { active: true, sortOrder: next },
      })
    : await prisma.testCategory.create({ data: { name, sortOrder: next } });

  return serializeCategory(row);
}

export async function updateCategory(id: number, input: unknown) {
  const current = await prisma.testCategory.findFirst({ where: { id, active: true } });
  if (!current) throw notFound("Test category");

  const name = reqText(asBody(input).name, "Category name", 160);
  const clash = await prisma.testCategory.findFirst({
    where: { name, id: { not: id } },
    select: { id: true },
  });
  if (clash) throw duplicateCategory();

  return serializeCategory(await prisma.testCategory.update({ where: { id }, data: { name } }));
}

export async function removeCategory(id: number) {
  const current = await prisma.testCategory.findFirst({ where: { id, active: true } });
  if (!current) throw notFound("Test category");

  const used = await prisma.test.count({ where: { categoryId: id, active: true } });
  if (used > 0) {
    throw new ApiError(
      409,
      "CATEGORY_IN_USE",
      `This category has ${used} test${used === 1 ? "" : "s"}. Move or delete them first.`,
    );
  }

  await prisma.testCategory.update({ where: { id }, data: { active: false } });
}

// ---------------------------------------------------------------------
// Units  - /api/lab/units
// ---------------------------------------------------------------------
export const serializeUnit = (u: Unit) => ({
  id: u.id,
  name: u.name,
  active: u.active,
  createdAt: iso(u.createdAt),
  updatedAt: iso(u.updatedAt),
});

export async function listUnits() {
  const rows = await prisma.unit.findMany({
    where: { active: true },
    orderBy: [{ name: "asc" }, { id: "asc" }],
  });
  return rows.map(serializeUnit);
}

const duplicateUnit = () => conflict("A unit with this name already exists.", "DUPLICATE_UNIT");

export async function createUnit(input: unknown) {
  const name = reqText(asBody(input).name, "Unit name", 60);
  const existing = await prisma.unit.findUnique({ where: { name } });

  if (existing?.active) throw duplicateUnit();

  const row = existing
    ? await prisma.unit.update({ where: { id: existing.id }, data: { active: true } })
    : await prisma.unit.create({ data: { name } });

  return serializeUnit(row);
}

export async function updateUnit(id: number, input: unknown) {
  const current = await prisma.unit.findFirst({ where: { id, active: true } });
  if (!current) throw notFound("Unit");

  const name = reqText(asBody(input).name, "Unit name", 60);
  const clash = await prisma.unit.findFirst({
    where: { name, id: { not: id } },
    select: { id: true },
  });
  if (clash) throw duplicateUnit();

  return serializeUnit(await prisma.unit.update({ where: { id }, data: { name } }));
}

export async function removeUnit(id: number) {
  const current = await prisma.unit.findFirst({ where: { id, active: true } });
  if (!current) throw notFound("Unit");
  await prisma.unit.update({ where: { id }, data: { active: false } });
}

// ---------------------------------------------------------------------
// Input types  - /api/lab/input-types   (shape the form expects: value + label)
// ---------------------------------------------------------------------
export async function listInputTypes() {
  const rows = await prisma.inputType.findMany({
    where: { active: true },
    orderBy: { id: "asc" },
  });

  return rows.map((row) => ({ id: row.id, value: row.code, label: row.name }));
}
