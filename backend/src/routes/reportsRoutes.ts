import { Router } from "express";
import { actorName } from "../middleware/auth.js";
import * as reports from "../services/reportService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { id, idParam, query } from "../utils/validate.js";

const r = Router();

const filter = (q: Record<string, unknown>): reports.ReportFilter => ({
  billId: id(q.billId) ?? undefined,
  status: query(q.status),
  patient: query(q.patient) ?? query(q.q),
  regNo: query(q.regNo),
  from: query(q.from),
  to: query(q.to),
  limit: q.limit,
});

r.get("/", asyncHandler(async (req, res) => res.json({ items: await reports.listReports(filter(req.query)) })));

// Fixed paths before "/:id".
r.get("/today", asyncHandler(async (req, res) => res.json({ items: await reports.todaysReports(filter(req.query)) })));
r.get("/search", asyncHandler(async (req, res) => res.json({ items: await reports.searchReports(filter(req.query)) })));

r.get("/:id", asyncHandler(async (req, res) => res.json(await reports.getReport(idParam(req.params.id)))));

r.patch("/:id", asyncHandler(async (req, res) => {
  res.json(await reports.updateReport(idParam(req.params.id), req.body, actorName(req)));
}));

r.post("/:id/status", asyncHandler(async (req, res) => {
  res.json(await reports.updateReport(idParam(req.params.id), { status: req.body?.status }, actorName(req)));
}));

export default r;
