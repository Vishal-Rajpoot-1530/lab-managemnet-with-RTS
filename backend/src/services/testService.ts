import * as repo from "../repositories/testRepository.js";
import type { SerializedTest, SerializedTestDetail } from "../repositories/testRepository.js";
import { db } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import type { Id } from "../types/domain.js";
import {
  INPUT_TYPES,
  TEST_TYPES,
  type InputType,
  type RawTestBody,
  type RawTestParameter,
  type TestInput,
  type TestParameterInput,
  type TestType,
} from "../types/lab.js";

const TYPES: ReadonlySet<string> = new Set(TEST_TYPES);
const INPUTS: ReadonlySet<string> = new Set(INPUT_TYPES);

const isTestType = (value: unknown): value is TestType =>
  typeof value === "string" && TYPES.has(value);

const isInputType = (value: unknown): value is InputType =>
  typeof value === "string" && INPUTS.has(value);

function normaliseParameter(
  parameter: RawTestParameter,
  index: number,
): TestParameterInput {
  const inputType = parameter.inputType || "single_line";
  const name = String(parameter.name || "").trim();

  if (!name) {
    throw new ApiError(
      400,
      "VALIDATION_ERROR",
      `Parameter ${index + 1} name is required.`,
    );
  }
  if (!isInputType(inputType)) {
    throw new ApiError(
      400,
      "INVALID_INPUT_TYPE",
      `Parameter ${index + 1} has invalid input type.`,
    );
  }

  return {
    ...parameter,
    order: Number(parameter.order || index + 1),
    name,
    unitId: parameter.unitId ? Number(parameter.unitId) : null,
    inputType,
  };
}

async function validate(body?: RawTestBody): Promise<TestInput> {
  const type = body?.type;
  const name = String(body?.name || "").trim();
  const categoryId = Number(body?.categoryId);
  const price = Number(body?.price || 0);
  const unitId = body?.unitId ? Number(body.unitId) : null;
  const rawParameters: RawTestParameter[] = Array.isArray(body?.parameters)
    ? body.parameters
    : [];

  if (!isTestType(type)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid test type.");
  }
  if (!name) {
    throw new ApiError(400, "VALIDATION_ERROR", "Test name is required.");
  }
  if (!categoryId) {
    throw new ApiError(400, "VALIDATION_ERROR", "Category is required.");
  }
  if (price < 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Price cannot be negative.");
  }

  const category = await db.testCategory.findFirst({
    where: { id: BigInt(categoryId), active: true },
    select: { id: true },
  });
  if (!category) {
    throw new ApiError(
      400,
      "INVALID_CATEGORY",
      "Selected category does not exist.",
    );
  }

  if (unitId) {
    const unit = await db.labUnit.findFirst({
      where: { id: BigInt(unitId), active: true },
      select: { id: true },
    });
    if (!unit) {
      throw new ApiError(400, "INVALID_UNIT", "Selected unit does not exist.");
    }
  }

  if (type === "single" && body?.inputType && !isInputType(body.inputType)) {
    throw new ApiError(400, "INVALID_INPUT_TYPE", "Invalid input type.");
  }

  let parameters: TestParameterInput[] = [];
  if (type === "multi" || type === "nested") {
    if (!rawParameters.length) {
      throw new ApiError(
        400,
        "VALIDATION_ERROR",
        "At least one parameter is required.",
      );
    }
    parameters = rawParameters.map(normaliseParameter);
  }

  return {
    ...body,
    type,
    name,
    shortName: String(body?.shortName || "").trim(),
    categoryId,
    price,
    unitId,
    parameters,
  };
}

export const list = (): Promise<SerializedTest[]> => repo.findAll();

export async function get(id: Id): Promise<SerializedTestDetail> {
  const test = await repo.findById(id);
  if (!test) throw new ApiError(404, "TEST_NOT_FOUND", "Test not found.");
  return test;
}

export async function create(body?: RawTestBody): Promise<SerializedTestDetail> {
  const data = await validate(body);
  const id = await repo.create(data);
  return get(id);
}

export async function update(
  id: Id,
  body?: RawTestBody,
): Promise<SerializedTestDetail> {
  const data = await validate(body);
  if (!(await repo.update(id, data))) {
    throw new ApiError(404, "TEST_NOT_FOUND", "Test not found.");
  }
  return get(id);
}

export async function remove(id: Id): Promise<void> {
  if (!(await repo.remove(id))) {
    throw new ApiError(404, "TEST_NOT_FOUND", "Test not found.");
  }
}
