import type { LabUnit } from "@prisma/client";
import { db } from "../config/db.js";
import type { Id } from "../types/domain.js";

export type SerializedUnit = Omit<LabUnit, "id"> & { id: number };

const serialize = (unit: LabUnit): SerializedUnit => ({
  ...unit,
  id: Number(unit.id),
});

export async function findAll(): Promise<SerializedUnit[]> {
  const rows = await db.labUnit.findMany({
    where: { active: true },
    orderBy: [{ name: "asc" }, { id: "asc" }],
  });
  return rows.map(serialize);
}

export async function findByName(
  name: string,
  excludeId: Id | null = null,
): Promise<{ id: number; name: string } | null> {
  const unit = await db.labUnit.findFirst({
    where: {
      name: name.trim(),
      active: true,
      ...(excludeId !== null && excludeId !== undefined
        ? { id: { not: BigInt(excludeId) } }
        : {}),
    },
    select: { id: true, name: true },
  });
  return unit ? { ...unit, id: Number(unit.id) } : null;
}

export async function create(name: string): Promise<SerializedUnit> {
  return serialize(await db.labUnit.create({ data: { name: name.trim() } }));
}

export async function update(
  id: Id,
  name: string,
): Promise<SerializedUnit | null> {
  const result = await db.labUnit.updateMany({
    where: { id: BigInt(id), active: true },
    data: { name: name.trim() },
  });
  if (!result.count) return null;
  const row = await db.labUnit.findUnique({ where: { id: BigInt(id) } });
  return row ? serialize(row) : null;
}

export async function remove(id: Id): Promise<boolean> {
  const result = await db.labUnit.updateMany({
    where: { id: BigInt(id), active: true },
    data: { active: false },
  });
  return result.count > 0;
}
