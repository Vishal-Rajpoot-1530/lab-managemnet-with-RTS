import type { Prisma } from "@prisma/client";
import { prisma, type Tx } from "../lib/prisma.js";
import { ApiError, badRequest, conflict, notFound } from "../utils/ApiError.js";
import { toNumber } from "../utils/format.js";
import {
  asBody,
  bool,
  id as toId,
  num,
  optText,
  reqText,
  text,
  type Body,
} from "../utils/validate.js";

/**
 * The test form works with ONE flat "test" object. In MySQL that is stored as:
 *   tests               the test itself
 *   test_parameters     the result fields (a "single" test has exactly one)
 *   interpretations     the interpretation text
 */
export const TEST_TYPES = ["single", "multi", "nested", "document"] as const;
export type TestType = (typeof TEST_TYPES)[number];

const TYPE_LABELS: Record<TestType, string> = {
  single: "Single parameter",
  multi: "Multi parameter",
  nested: "Multi parameter nested",
  document: "Document",
};

const isType = (value: unknown): value is TestType =>
  typeof value === "string" && (TEST_TYPES as readonly string[]).includes(value);

const testInclude = {
  category: { select: { id: true, name: true } },
  parameters: {
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: { inputType: { select: { code: true } } },
  },
  interpretations: { orderBy: { id: "asc" }, take: 1 },
} satisfies Prisma.TestInclude;

type TestRow = Prisma.TestGetPayload<{ include: typeof testInclude }>;
type ParamRow = TestRow["parameters"][number];

// ---------------------------------------------------------------------
// Reading from the database
// ---------------------------------------------------------------------
function serializeParameters(rows: ParamRow[]) {
  const indexById = new Map(rows.map((row, index) => [row.id, index]));

  return rows.map((row, index) => ({
    id: row.id,
    order: row.sortOrder || index + 1,
    name: row.name,
    unitId: row.unitId,
    inputType: row.inputType?.code ?? "single_line",
    groupBy: row.groupBy ?? "",
    defaultResult: row.defaultValue ?? "",
    optional: !row.isRequired,
    parentParameterId: row.parentId,
    parentIndex: row.parentId === null ? null : (indexById.get(row.parentId) ?? null),
  }));
}

export function serializeTest(row: TestRow) {
  const type: TestType = isType(row.testType) ? row.testType : "single";
  const single = type === "single" ? row.parameters[0] : undefined;

  return {
    id: row.id,
    type,
    typeLabel: TYPE_LABELS[type],
    name: row.name,
    shortName: row.shortName ?? "",
    categoryId: row.categoryId,
    categoryName: row.category?.name ?? "",
    price: toNumber(row.price),
    unitId: single?.unitId ?? null,
    inputType: single ? (single.inputType?.code ?? "single_line") : null,
    defaultResult: single?.defaultValue ?? null,
    optional: single ? !single.isRequired : false,
    displayName: row.displayName,
    method: row.method,
    instrument: row.instrument,
    interpretation: row.interpretations[0]?.content ?? null,
    parameterCount: type === "multi" || type === "nested" ? row.parameters.length : 0,
  };
}

export async function listTests(params: { q?: string; categoryId?: number; type?: string }) {
  const q = params.q?.trim();

  const rows = await prisma.test.findMany({
    where: {
      active: true,
      department: "lab",
      ...(params.categoryId ? { categoryId: params.categoryId } : {}),
      ...(params.type && isType(params.type) ? { testType: params.type } : {}),
      ...(q ? { OR: [{ name: { contains: q } }, { shortName: { contains: q } }] } : {}),
    },
    include: testInclude,
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  return rows.map(serializeTest);
}

export async function getTest(testId: number) {
  const row = await prisma.test.findFirst({
    where: { id: testId, active: true },
    include: testInclude,
  });
  if (!row) throw notFound("Test");

  return { ...serializeTest(row), parameters: serializeParameters(row.parameters) };
}

// ---------------------------------------------------------------------
// Reading from the request
// ---------------------------------------------------------------------
interface ParamInput {
  /** Existing row id (when editing), used to update in place. */
  existingId: number | null;
  order: number;
  name: string;
  unitId: number | null;
  inputTypeCode: string;
  groupBy: string | null;
  defaultResult: string | null;
  optional: boolean;
  parentIndex: number | null;
}

interface TestInput {
  type: TestType;
  name: string;
  shortName: string | null;
  categoryId: number;
  price: number;
  method: string | null;
  instrument: string | null;
  displayName: boolean;
  interpretation: string | null;
  /** single: exactly one entry. multi/nested: the list. document: empty. */
  parameters: ParamInput[];
}

function readParameters(body: Body, type: TestType): ParamInput[] {
  if (type === "document") return [];

  if (type === "single") {
    return [
      {
        existingId: null,
        order: 1,
        name: "",
        unitId: toId(body.unitId),
        inputTypeCode: text(body.inputType, 40) || "single_line",
        groupBy: null,
        defaultResult: optText(body.defaultResult, 255),
        optional: bool(body.optional, false),
        parentIndex: null,
      },
    ];
  }

  const raw = Array.isArray(body.parameters) ? body.parameters : [];
  if (!raw.length) throw badRequest("At least one parameter is required.");
  if (raw.length > 300) throw badRequest("A test can have at most 300 parameters.");

  const items = raw.map((entry) => asBody(entry));
  const indexByExistingId = new Map<number, number>();

  items.forEach((item, index) => {
    const existing = toId(item.id);
    if (existing) indexByExistingId.set(existing, index);
  });

  const parsed = items.map((item, index): ParamInput => {
    const name = text(item.name, 255);
    if (!name) throw badRequest(`Parameter ${index + 1} name is required.`);

    let parentIndex: number | null = null;

    if (item.parentIndex !== undefined && item.parentIndex !== null && item.parentIndex !== "") {
      parentIndex = Number(item.parentIndex);
    } else {
      const parentId = toId(item.parentParameterId);
      if (parentId) parentIndex = indexByExistingId.get(parentId) ?? null;
    }

    if (parentIndex !== null) {
      if (!Number.isInteger(parentIndex) || parentIndex < 0 || parentIndex >= items.length) {
        throw badRequest(`Parameter ${index + 1} has an invalid parent.`);
      }
      if (parentIndex === index) {
        throw badRequest(`Parameter ${index + 1} cannot be its own parent.`);
      }
    }

    return {
      existingId: toId(item.id),
      order: Math.max(1, Math.floor(num(item.order)) || index + 1),
      name,
      unitId: toId(item.unitId),
      inputTypeCode: text(item.inputType, 40) || "single_line",
      groupBy: optText(item.groupBy, 160),
      defaultResult: optText(item.defaultResult, 255),
      optional: bool(item.optional, false),
      parentIndex,
    };
  });

  // A parent chain must end somewhere (no loops).
  parsed.forEach((item, index) => {
    let step = 0;
    let cursor: number | null = item.parentIndex;

    while (cursor !== null) {
      if (++step > parsed.length) {
        throw badRequest(`Parameter ${index + 1} is part of a parent loop.`);
      }
      cursor = parsed[cursor]!.parentIndex;
    }
  });

  return parsed;
}

function readTest(input: unknown): TestInput {
  const body = asBody(input);

  if (!isType(body.type)) throw badRequest("Invalid test type.");
  const type = body.type;

  const categoryId = toId(body.categoryId);
  if (!categoryId) throw badRequest("Category is required.", { field: "categoryId" });

  const price = num(body.price);
  if (price < 0) throw badRequest("Price cannot be negative.", { field: "price" });
  if (price > 9999999999) throw badRequest("Price is too large.", { field: "price" });

  const name = reqText(body.name, "Test name", 255);

  const parameters = readParameters(body, type);
  if (type === "single" && parameters[0]) parameters[0].name = name;

  return {
    type,
    name,
    shortName: optText(body.shortName, 80),
    categoryId,
    price: Math.round(price * 100) / 100,
    method: optText(body.method, 160),
    instrument: optText(body.instrument, 160),
    displayName: bool(body.displayName, true),
    interpretation: optText(body.interpretation, 16_000_000),
    parameters,
  };
}

// ---------------------------------------------------------------------
// Writing
// ---------------------------------------------------------------------
async function checkReferences(tx: Tx, data: TestInput, exceptTestId?: number) {
  const category = await tx.testCategory.findFirst({
    where: { id: data.categoryId, active: true },
    select: { id: true },
  });
  if (!category) {
    throw new ApiError(400, "INVALID_CATEGORY", "Selected category does not exist.");
  }

  const duplicate = await tx.test.findFirst({
    where: {
      name: data.name,
      active: true,
      ...(exceptTestId ? { id: { not: exceptTestId } } : {}),
    },
    select: { id: true },
  });
  if (duplicate) throw conflict("A test with this name already exists.", "DUPLICATE_TEST");

  const unitIds = [...new Set(data.parameters.map((p) => p.unitId).filter((v): v is number => !!v))];
  if (unitIds.length) {
    const found = await tx.unit.count({ where: { id: { in: unitIds }, active: true } });
    if (found !== unitIds.length) {
      throw new ApiError(400, "INVALID_UNIT", "Selected unit does not exist.");
    }
  }

  const codes = [...new Set(data.parameters.map((p) => p.inputTypeCode))];
  const inputTypes = codes.length
    ? await tx.inputType.findMany({ where: { code: { in: codes }, active: true } })
    : [];

  const idByCode = new Map(inputTypes.map((row) => [row.code, row.id]));
  const missing = codes.find((code) => !idByCode.has(code));

  if (missing) {
    throw new ApiError(400, "INVALID_INPUT_TYPE", `Invalid input type "${missing}".`);
  }

  return idByCode;
}

async function saveParameters(
  tx: Tx,
  testId: number,
  data: TestInput,
  inputTypeIds: Map<string, number>,
) {
  const existing = await tx.testParameter.findMany({
    where: { testId },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: { id: true },
  });

  const existingIds = new Set(existing.map((row) => row.id));
  const reused = new Set<number>();
  const savedIds: number[] = [];

  for (const [position, item] of data.parameters.entries()) {
    // A single test keeps using its one parameter row.
    const wantedId =
      data.type === "single" ? existing[0]?.id : (item.existingId ?? undefined);

    const columns = {
      name: item.name,
      inputTypeId: inputTypeIds.get(item.inputTypeCode) ?? null,
      unitId: item.unitId,
      defaultValue: item.defaultResult,
      isRequired: !item.optional,
      groupBy: item.groupBy,
      sortOrder: item.order,
    };

    if (wantedId && existingIds.has(wantedId) && !reused.has(wantedId)) {
      reused.add(wantedId);
      await tx.testParameter.update({ where: { id: wantedId }, data: columns });
      savedIds[position] = wantedId;
    } else {
      const created = await tx.testParameter.create({
        data: { ...columns, testId, parentId: null },
        select: { id: true },
      });
      savedIds[position] = created.id;
    }
  }

  // Remove parameters that are no longer in the form.
  const stale = existing.map((row) => row.id).filter((rowId) => !reused.has(rowId) && !savedIds.includes(rowId));
  if (stale.length) await tx.testParameter.deleteMany({ where: { id: { in: stale } } });

  // Parent links are set last, once every row has its final id.
  for (const [position, item] of data.parameters.entries()) {
    await tx.testParameter.update({
      where: { id: savedIds[position]! },
      data: {
        parentId: item.parentIndex === null ? null : (savedIds[item.parentIndex] ?? null),
      },
    });
  }
}

async function saveInterpretation(tx: Tx, testId: number, name: string, content: string | null) {
  const current = await tx.interpretation.findFirst({ where: { testId }, orderBy: { id: "asc" } });

  if (!content) {
    if (current) await tx.interpretation.delete({ where: { id: current.id } });
    return;
  }

  if (current) {
    await tx.interpretation.update({ where: { id: current.id }, data: { name, content } });
  } else {
    await tx.interpretation.create({ data: { testId, name, content } });
  }
}

const testColumns = (data: TestInput) => ({
  categoryId: data.categoryId,
  name: data.name,
  shortName: data.shortName,
  testType: data.type,
  department: "lab",
  price: data.price,
  method: data.method,
  instrument: data.instrument,
  displayName: data.displayName,
});

export async function createTest(input: unknown) {
  const data = readTest(input);

  const testId = await prisma.$transaction(async (tx) => {
    const inputTypeIds = await checkReferences(tx, data);

    const created = await tx.test.create({ data: testColumns(data), select: { id: true } });

    await saveParameters(tx, created.id, data, inputTypeIds);
    await saveInterpretation(tx, created.id, data.name, data.interpretation);

    return created.id;
  });

  return getTest(testId);
}

export async function updateTest(testId: number, input: unknown) {
  const data = readTest(input);

  await prisma.$transaction(async (tx) => {
    const current = await tx.test.findFirst({
      where: { id: testId, active: true },
      select: { id: true },
    });
    if (!current) throw notFound("Test");

    const inputTypeIds = await checkReferences(tx, data, testId);

    await tx.test.update({ where: { id: testId }, data: testColumns(data) });
    await saveParameters(tx, testId, data, inputTypeIds);
    await saveInterpretation(tx, testId, data.name, data.interpretation);
  });

  return getTest(testId);
}

/** Tests used on old bills are kept, just hidden. */
export async function removeTest(testId: number) {
  const result = await prisma.test.updateMany({
    where: { id: testId, active: true },
    data: { active: false },
  });
  if (!result.count) throw notFound("Test");
}
