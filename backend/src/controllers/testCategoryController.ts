import type { Request, Response } from "express";
import * as service from "../services/testCategoryService.js";
import { idParam } from "../utils/request.js";

export async function list(req: Request, res: Response): Promise<void> {
  const data = await service.list();
  res.json({
    success: true,
    data,
    meta: { count: data.length },
    requestId: req.requestId,
  });
}

export async function get(req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    data: await service.get(Number(idParam(req))),
    requestId: req.requestId,
  });
}

export async function create(req: Request, res: Response): Promise<void> {
  res.status(201).json({
    success: true,
    data: await service.create(req.body),
    message: "Test category created successfully.",
    requestId: req.requestId,
  });
}

export async function update(req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    data: await service.update(Number(idParam(req)), req.body),
    message: "Test category updated successfully.",
    requestId: req.requestId,
  });
}
