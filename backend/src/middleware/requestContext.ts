import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export function requestContext(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  req.requestId = req.get("X-Request-ID") || crypto.randomUUID();
  res.setHeader("X-Request-ID", req.requestId);
  req.startedAt = Date.now();

  res.on("finish", () =>
    console.log(
      `[API ${res.statusCode < 400 ? "OK " : "ERR"}] ${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - req.startedAt}ms`,
    ),
  );

  next();
}
