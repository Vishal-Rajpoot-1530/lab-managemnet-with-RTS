import type { Request } from "express";

/** Returns the `:id` route parameter as a string. */
export const idParam = (req: Request): string => String(req.params.id);

/** Returns a query-string value only when it is a plain string. */
export const queryString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;
