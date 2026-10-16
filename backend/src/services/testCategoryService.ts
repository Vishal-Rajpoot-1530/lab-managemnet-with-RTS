import { ApiError } from "../utils/ApiError.js";
import * as repo from "../repositories/testCategoryRepository.js";
import type { SerializedCategory } from "../repositories/testCategoryRepository.js";
import type { Id } from "../types/domain.js";
import type { NameBody } from "../types/lab.js";

const clean = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

/** Validates the category name from a request body and returns the cleaned value. */
function validateName(body: NameBody | undefined): string {
  const name = clean(body?.name);
  if (!name) {
    throw new ApiError(422, "VALIDATION_ERROR", "Category name is required.", {
      field: "name",
    });
  }
  if (name.length > 160) {
    throw new ApiError(
      422,
      "VALIDATION_ERROR",
      "Category name must be 160 characters or fewer.",
      { field: "name" },
    );
  }
  return name;
}

export async function list(): Promise<SerializedCategory[]> {
  return repo.findAll();
}

export async function get(id: Id): Promise<SerializedCategory> {
  const row = await repo.findById(id);
  if (!row) {
    throw new ApiError(404, "CATEGORY_NOT_FOUND", "Test category not found.");
  }
  return row;
}

export async function create(body?: NameBody): Promise<SerializedCategory> {
  const name = validateName(body);
  if (await repo.findByName(name)) {
    throw new ApiError(
      409,
      "DUPLICATE_CATEGORY",
      "A test category with this name already exists.",
    );
  }
  return repo.create(name);
}

export async function update(
  id: Id,
  body?: NameBody,
): Promise<SerializedCategory | null> {
  await get(id);
  const name = validateName(body);
  if (await repo.findByName(name, id)) {
    throw new ApiError(
      409,
      "DUPLICATE_CATEGORY",
      "A test category with this name already exists.",
    );
  }
  return repo.update(id, name);
}
