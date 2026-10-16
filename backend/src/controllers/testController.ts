import type { Request, Response } from "express";
import * as s from "../services/testService.js";
import { idParam } from "../utils/request.js";

export async function list(req: Request, res: Response): Promise<void> {
  res.json({ success: true, data: await s.list(), requestId: req.requestId });
}

export async function get(req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    data: await s.get(idParam(req)),
    requestId: req.requestId,
  });
}

export async function create(req: Request, res: Response): Promise<void> {
  res.status(201).json({
    success: true,
    data: await s.create(req.body),
    requestId: req.requestId,
  });
}

export async function update(req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    data: await s.update(idParam(req), req.body),
    requestId: req.requestId,
  });
}

export async function remove(req: Request, res: Response): Promise<void> {
  await s.remove(idParam(req));
  res.status(204).end();
}
