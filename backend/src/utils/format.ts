import type { Prisma } from "@prisma/client";
import { env } from "../config/env.js";

/** Prisma Decimal / string / number -> plain number. */
export const toNumber = (
  value: Prisma.Decimal | number | string | null | undefined,
): number => {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/** Rounds to 2 decimals (rupees and paise). */
export const money = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

export const iso = (value: Date | null | undefined): string =>
  value ? value.toISOString() : "";

// ---------------------------------------------------------------------
// Dates. The database stores UTC; the lab works in APP_TIMEZONE.
// ---------------------------------------------------------------------
const tz = () => env.timezone;

/** "2026-10-18" for the given instant, as seen in the lab's time zone. */
export function dateKey(value: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz(),
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

export const todayKey = (): string => dateKey(new Date());

/** "18/10/2026" */
export function displayDate(value: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz(),
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

/** "03:45 PM" */
export function displayTime(value: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: tz(),
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(value)
    .toUpperCase();
}

/** How far ahead of UTC the lab's time zone is at a given instant (ms). */
function offsetMs(at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz(),
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(at);

  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);

  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second"),
  );

  return asUtc - Math.floor(at.getTime() / 1000) * 1000;
}

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** The instant when the given local day (YYYY-MM-DD) starts, or null if invalid. */
export function startOfDay(day: string): Date | null {
  const match = DATE_RE.exec(day);
  if (!match) return null;

  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const guess = Date.UTC(y, m - 1, d);
  const first = guess - offsetMs(new Date(guess));
  // One more pass makes this correct on days where the offset changes.
  return new Date(guess - offsetMs(new Date(first)));
}

/** Adds whole days to a YYYY-MM-DD key. */
export function addDays(day: string, days: number): string {
  const match = DATE_RE.exec(day);
  if (!match) return day;
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]) + days),
  );
  return date.toISOString().slice(0, 10);
}

/**
 * [from, to] as YYYY-MM-DD (both inclusive) -> a Prisma-friendly range.
 * Missing or invalid values leave that side open.
 */
export function dateRange(
  from?: string,
  to?: string,
): { gte?: Date; lt?: Date } | undefined {
  const start = from ? startOfDay(from) : null;
  const end = to ? startOfDay(addDays(to, 1)) : null;

  if (!start && !end) return undefined;

  return { ...(start ? { gte: start } : {}), ...(end ? { lt: end } : {}) };
}

/** Range covering a single local day (today when `day` is missing or invalid). */
export function dayRange(day?: string): { gte: Date; lt: Date } {
  const key = day && DATE_RE.test(day) ? day : todayKey();
  const start = startOfDay(key)!;
  return { gte: start, lt: startOfDay(addDays(key, 1))! };
}

/** Range covering a calendar month ("2026-10"), or null if invalid. */
export function monthRange(month: string): { gte: Date; lt: Date } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(month);
  if (!match) return null;

  const start = startOfDay(`${match[1]}-${match[2]}-01`);
  if (!start) return null;

  const next = new Date(Date.UTC(Number(match[1]), Number(match[2]), 1))
    .toISOString()
    .slice(0, 10);

  return { gte: start, lt: startOfDay(next)! };
}
