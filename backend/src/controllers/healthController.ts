import type { Request, Response } from "express";
import { db } from "../config/db.js";

export async function health(_req: Request, res: Response): Promise<void> {
  try {
    await db.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(503).json({
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
