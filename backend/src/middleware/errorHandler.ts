import type { NextFunction, Request, Response } from "express";
import { ApiError, type ApiErrorDetails } from "../utils/ApiError.js";

/** Anything that may be thrown into Express: ApiError, Prisma/MySQL errors, body-parser errors... */
interface HttpError extends Error {
  statusCode?: number;
  code?: string;
  details?: ApiErrorDetails | null;
}

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(
    new ApiError(
      404,
      "ROUTE_NOT_FOUND",
      `Cannot ${req.method} ${req.originalUrl}`,
    ),
  );
}

export function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let status = err.statusCode || 500;
  let code = err.code || "INTERNAL_ERROR";
  let message = err.message || "Unexpected server error";
  const details = err.details || null;

  if (err?.code === "ER_DUP_ENTRY") {
    status = 409;
    code = "DUPLICATE_CATEGORY";
    message = "A test category with this name already exists.";
  }

  if (err?.code === "ER_NO_SUCH_TABLE") {
    status = 500;
    code = "DATABASE_SCHEMA_MISSING";
    message = "Required database table is missing. Run the supplied migration.";
  }

  if (err instanceof SyntaxError && "body" in err) {
    status = 400;
    code = "INVALID_JSON";
    message = "Request body contains invalid JSON.";
  }

  if (status >= 500) {
    console.error("[API ERROR]", {
      requestId: req.requestId,
      code,
      error: err,
    });
  }

  res.status(status).json({
    success: false,
    error: { code, message, ...(details ? { details } : {}) },
    requestId: req.requestId,
  });
}
