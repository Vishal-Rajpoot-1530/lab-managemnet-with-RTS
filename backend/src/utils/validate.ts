import { badRequest } from "./ApiError.js";

/** A plain JSON object from a request body. */
export type Body = Record<string, unknown>;

export const asBody = (value: unknown): Body =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Body)
    : {};

/** Trimmed text; anything that is not text/number becomes "". */
export function text(value: unknown, max = 255): string {
  if (typeof value === "number" && Number.isFinite(value)) value = String(value);
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

/** Trimmed text, or null when empty (use for optional DB columns). */
export function optText(value: unknown, max = 255): string | null {
  return text(value, max) || null;
}

/** Required text. Throws a 400 naming the field when empty or too long. */
export function reqText(value: unknown, label: string, max = 255): string {
  const raw = typeof value === "string" ? value.trim() : text(value, max + 1);
  if (!raw) throw badRequest(`${label} is required.`, { field: label });
  if (raw.length > max) {
    throw badRequest(`${label} must be ${max} characters or fewer.`, {
      field: label,
    });
  }
  return raw;
}

/** Number or 0. Accepts "12.5", 12.5 and "1,200". */
export function num(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

/** Whole number >= 1, or null. */
export function id(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

/** Route parameter such as /:id. Throws 400 when it is not a valid id. */
export function idParam(value: unknown, label = "id"): number {
  const parsed = id(value);
  if (!parsed) throw badRequest(`Invalid ${label}.`);
  return parsed;
}

export function bool(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === 1 || value === "1") return true;
  if (value === "false" || value === 0 || value === "0") return false;
  return fallback;
}

/** Query-string value as plain text (first value when repeated). */
export function query(value: unknown): string | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  return typeof first === "string" && first.trim() ? first.trim() : undefined;
}

export const isEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** Whole number or null (for age fields that may be blank). */
export function optInt(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : null;
}

/** Page size from ?limit=, clamped. */
export function limitParam(
  value: unknown,
  fallback: number,
  max: number,
): number {
  const parsed = Number(query(value));
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(Math.floor(parsed), max);
}
