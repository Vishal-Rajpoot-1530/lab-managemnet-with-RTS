export { asBody, id, num, optText, reqText, text } from "../utils/validate.js";

/** "2026-10" or undefined. */
export const monthOrNothing = (value: string | undefined): string | undefined =>
  value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value) ? value : undefined;
