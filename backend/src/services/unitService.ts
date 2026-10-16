import * as repo from "../repositories/unitRepository.js";
import type { SerializedUnit } from "../repositories/unitRepository.js";
import { ApiError } from "../utils/ApiError.js";
import type { Id } from "../types/domain.js";
import type { NameBody } from "../types/lab.js";

const clean = (value: unknown): string => String(value || "").trim();

export const list = (): Promise<SerializedUnit[]> => repo.findAll();

export async function create(body?: NameBody): Promise<SerializedUnit> {
  const name = clean(body?.name);
  if (!name) {
    throw new ApiError(400, "VALIDATION_ERROR", "Unit name is required.");
  }
  if (await repo.findByName(name)) {
    throw new ApiError(
      409,
      "DUPLICATE_UNIT",
      "A unit with this name already exists.",
    );
  }
  return repo.create(name);
}

export async function update(id: Id, body?: NameBody): Promise<SerializedUnit> {
  const name = clean(body?.name);
  if (!name) {
    throw new ApiError(400, "VALIDATION_ERROR", "Unit name is required.");
  }
  const unit = await repo.update(id, name);
  if (!unit) throw new ApiError(404, "UNIT_NOT_FOUND", "Unit not found.");
  return unit;
}

export async function remove(id: Id): Promise<void> {
  if (!(await repo.remove(id))) {
    throw new ApiError(404, "UNIT_NOT_FOUND", "Unit not found.");
  }
}
