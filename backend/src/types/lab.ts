/** Types for the Prisma-backed lab catalogue (categories, units, tests). */

export const TEST_TYPES = ["single", "multi", "nested", "document"] as const;
export type TestType = (typeof TEST_TYPES)[number];

export const INPUT_TYPES = ["single_line", "numeric", "paragraph"] as const;
export type InputType = (typeof INPUT_TYPES)[number];

/** Request body shape accepted by the category and unit endpoints. */
export interface NameBody {
  name?: unknown;
}

/** Untrusted parameter payload as it arrives in a test request body. */
export interface RawTestParameter {
  order?: number | string;
  name?: unknown;
  unitId?: number | string | null;
  inputType?: string;
  groupBy?: string | null;
  defaultResult?: string | null;
  optional?: boolean;
  parentParameterId?: number | string | null;
}

/** Untrusted test payload as it arrives in a request body. */
export interface RawTestBody {
  type?: unknown;
  name?: unknown;
  shortName?: unknown;
  categoryId?: unknown;
  price?: unknown;
  unitId?: unknown;
  inputType?: string | null;
  defaultResult?: string | null;
  optional?: boolean;
  displayName?: boolean;
  method?: string | null;
  instrument?: string | null;
  interpretation?: string | null;
  parameters?: unknown;
}

/** A parameter after validation / normalisation. */
export interface TestParameterInput {
  order: number;
  name: string;
  unitId: number | null;
  inputType: InputType;
  groupBy?: string | null;
  defaultResult?: string | null;
  optional?: boolean;
  parentParameterId?: number | string | null;
}

/** A test after validation / normalisation. */
export interface TestInput {
  type: TestType;
  name: string;
  shortName: string;
  categoryId: number;
  price: number;
  unitId: number | null;
  inputType?: string | null;
  defaultResult?: string | null;
  optional?: boolean;
  displayName?: boolean;
  method?: string | null;
  instrument?: string | null;
  interpretation?: string | null;
  parameters: TestParameterInput[];
}
