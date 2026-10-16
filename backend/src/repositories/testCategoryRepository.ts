import type { TestCategory } from "@prisma/client";
import { db } from "../config/db.js";
import type { Id } from "../types/domain.js";

export type SerializedCategory = Omit<TestCategory, "id"> & { id: number };

const serialize = (category: TestCategory): SerializedCategory => ({
  ...category,
  id: Number(category.id),
});

export async function findAll(): Promise<SerializedCategory[]> {
  const rows = await db.testCategory.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
  return rows.map(serialize);
}

export async function findById(id: Id): Promise<SerializedCategory | null> {
  const row = await db.testCategory.findUnique({ where: { id: BigInt(id) } });
  return row ? serialize(row) : null;
}

export async function findByName(
  name: string,
  excludeId: Id | null = null,
): Promise<{ id: number } | null> {
  const category = await db.testCategory.findFirst({
    where: { name, ...(excludeId ? { id: { not: BigInt(excludeId) } } : {}) },
    select: { id: true },
  });
  return category ? { id: Number(category.id) } : null;
}

export async function create(name: string): Promise<SerializedCategory> {
  const category = await db.$transaction(async (tx) => {
    const maximum = await tx.testCategory.aggregate({
      where: { active: true },
      _max: { sortOrder: true },
    });
    return tx.testCategory.create({
      data: { name, sortOrder: (maximum._max.sortOrder ?? 0) + 1 },
    });
  });
  return serialize(category);
}

export async function update(
  id: Id,
  name: string,
): Promise<SerializedCategory | null> {
  const result = await db.testCategory.updateMany({
    where: { id: BigInt(id), active: true },
    data: { name },
  });
  return result.count ? findById(id) : null;
}
