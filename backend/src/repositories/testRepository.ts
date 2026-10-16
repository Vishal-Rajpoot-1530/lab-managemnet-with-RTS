import type { LabTestParameter, Prisma } from "@prisma/client";
import { db } from "../config/db.js";
import type { Id } from "../types/domain.js";
import type { TestInput, TestParameterInput } from "../types/lab.js";

const typeLabels: Record<string, string> = {
  single: "Single parameter",
  multi: "Multi parameter",
  nested: "Multi parameter nested",
  document: "Document",
};

const testInclude = {
  category: { select: { name: true } },
} satisfies Prisma.LabTestInclude;

type LabTestWithCategory = Prisma.LabTestGetPayload<{
  include: typeof testInclude;
}>;

export interface SerializedTest {
  id: number;
  type: string;
  name: string;
  shortName: string;
  categoryId: number;
  categoryName: string;
  price: number;
  unitId: number | null;
  inputType: string | null;
  defaultResult: string | null;
  optional: boolean;
  displayName: boolean;
  method: string | null;
  instrument: string | null;
  interpretation: string | null;
  typeLabel: string;
}

export interface SerializedParameter {
  id: number;
  order: number;
  name: string;
  unitId: number | null;
  inputType: string;
  groupBy: string | null;
  defaultResult: string | null;
  optional: boolean;
  parentParameterId: number | null;
}

export interface SerializedTestDetail extends SerializedTest {
  parameters: SerializedParameter[];
}

const nullableNumber = (value: bigint | null): number | null =>
  value === null ? null : Number(value);

function serialize(test: LabTestWithCategory): SerializedTest {
  return {
    id: Number(test.id),
    type: test.type,
    name: test.name,
    shortName: test.shortName || "",
    categoryId: Number(test.categoryId),
    categoryName: test.category.name,
    price: Number(test.price),
    unitId: nullableNumber(test.unitId),
    inputType: test.inputType,
    defaultResult: test.defaultResult,
    optional: test.optional,
    displayName: test.displayName,
    method: test.method,
    instrument: test.instrument,
    interpretation: test.interpretation,
    typeLabel: typeLabels[test.type] || "Document",
  };
}

function serializeParameter(parameter: LabTestParameter): SerializedParameter {
  return {
    id: Number(parameter.id),
    order: parameter.order,
    name: parameter.name,
    unitId: nullableNumber(parameter.unitId),
    inputType: parameter.inputType,
    groupBy: parameter.groupBy,
    defaultResult: parameter.defaultResult,
    optional: parameter.optional,
    parentParameterId: nullableNumber(parameter.parentParameterId),
  };
}

export async function findAll(): Promise<SerializedTest[]> {
  const tests = await db.labTest.findMany({
    where: { active: true },
    include: testInclude,
    orderBy: { id: "asc" },
  });
  return tests.map(serialize);
}

export async function findById(id: Id): Promise<SerializedTestDetail | null> {
  const test = await db.labTest.findFirst({
    where: { id: BigInt(id), active: true },
    include: {
      ...testInclude,
      parameters: { orderBy: [{ order: "asc" }, { id: "asc" }] },
    },
  });
  if (!test) return null;
  return {
    ...serialize(test),
    parameters: test.parameters.map(serializeParameter),
  };
}

function testData(data: TestInput) {
  return {
    type: data.type,
    name: data.name,
    shortName: data.shortName || null,
    categoryId: BigInt(data.categoryId),
    price: data.price || 0,
    unitId: data.unitId ? BigInt(data.unitId) : null,
    inputType: data.inputType || null,
    defaultResult: data.defaultResult || null,
    optional: Boolean(data.optional),
    displayName: data.displayName !== false,
    method: data.method || null,
    instrument: data.instrument || null,
    interpretation: data.interpretation || null,
  };
}

function parameterData(parameter: TestParameterInput) {
  return {
    order: parameter.order,
    name: parameter.name,
    unitId: parameter.unitId ? BigInt(parameter.unitId) : null,
    inputType: parameter.inputType || "single_line",
    groupBy: parameter.groupBy || null,
    defaultResult: parameter.defaultResult || null,
    optional: Boolean(parameter.optional),
    parentParameterId: parameter.parentParameterId
      ? BigInt(parameter.parentParameterId)
      : null,
  };
}

export async function create(data: TestInput): Promise<number> {
  const test = await db.labTest.create({
    data: {
      ...testData(data),
      parameters: { create: (data.parameters || []).map(parameterData) },
    },
    select: { id: true },
  });
  return Number(test.id);
}

export async function update(id: Id, data: TestInput): Promise<boolean> {
  return db.$transaction(async (tx) => {
    const existing = await tx.labTest.findFirst({
      where: { id: BigInt(id), active: true },
      select: { id: true },
    });
    if (!existing) return false;

    await tx.labTest.update({
      where: { id: BigInt(id) },
      data: testData(data),
    });
    await tx.labTestParameter.deleteMany({ where: { testId: BigInt(id) } });

    if (data.parameters?.length) {
      await tx.labTestParameter.createMany({
        data: data.parameters.map((parameter) => ({
          ...parameterData(parameter),
          testId: BigInt(id),
        })),
      });
    }
    return true;
  });
}

export async function remove(id: Id): Promise<boolean> {
  const result = await db.labTest.updateMany({
    where: { id: BigInt(id), active: true },
    data: { active: false },
  });
  return result.count > 0;
}
