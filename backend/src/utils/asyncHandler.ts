import type { NextFunction, Request, Response } from "express";

type Handler = (req: Request, res: Response, next: NextFunction) => unknown;

/**
 * Express 5 already forwards rejected promises to the error handler; this
 * wrapper keeps that guaranteed (and keeps route files short).
 */
export const asyncHandler =
  (fn: Handler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
