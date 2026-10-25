import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export function routeNotFound(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  next(new ApiError(404, "ROUTE_NOT_FOUND", `Cannot ${req.method} ${req.originalUrl}`));
}

interface Mapped {
  status: number;
  code: string;
  message: string;
  details?: Record<string, unknown> | null;
}

/** Turns known database errors into clear messages. */
function fromPrisma(err: unknown): Mapped | null {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const target = (err.meta?.target as string[] | string | undefined) ?? "";
        const fields = Array.isArray(target) ? target.join(", ") : String(target);
        return {
          status: 409,
          code: "DUPLICATE",
          message: `That value already exists${fields ? ` (${fields})` : ""}.`,
        };
      }
      case "P2025":
        return { status: 404, code: "NOT_FOUND", message: "Record not found." };
      case "P2003":
        return {
          status: 409,
          code: "IN_USE",
          message: "This record is linked to other data and cannot be changed that way.",
        };
      case "P2000":
        return {
          status: 400,
          code: "VALIDATION_ERROR",
          message: "One of the values is too long.",
        };
      default:
        return null;
    }
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return {
      status: 503,
      code: "DATABASE_UNAVAILABLE",
      message: "The database is not reachable. Check that MySQL is running.",
    };
  }

  return null;
}

/**
 * One error format for the whole API. The frontend reads `message` (and
 * `error`, which login uses), so both are plain strings.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let mapped: Mapped;

  if (err instanceof ApiError) {
    mapped = {
      status: err.statusCode,
      code: err.code,
      message: err.message,
      details: err.details,
    };
  } else if (err instanceof SyntaxError && "body" in err) {
    mapped = {
      status: 400,
      code: "INVALID_JSON",
      message: "Request body contains invalid JSON.",
    };
  } else if ((err as { type?: string })?.type === "entity.too.large") {
    mapped = {
      status: 413,
      code: "PAYLOAD_TOO_LARGE",
      message: "Request body is too large.",
    };
  } else {
    mapped = fromPrisma(err) ?? {
      status: 500,
      code: "INTERNAL_ERROR",
      message: env.isProd
        ? "Unexpected server error."
        : ((err as Error)?.message ?? "Unexpected server error."),
    };
  }

  if (mapped.status >= 500) {
    console.error(`[API ERROR] ${req.method} ${req.originalUrl}`, err);
  }

  res.status(mapped.status).json({
    success: false,
    message: mapped.message,
    error: mapped.message,
    code: mapped.code,
    ...(mapped.details ? { details: mapped.details } : {}),
    requestId: req.requestId,
  });
}
