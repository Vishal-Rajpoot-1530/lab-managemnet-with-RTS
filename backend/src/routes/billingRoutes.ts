import { Router } from "express";
import { actorName } from "../middleware/auth.js";
import * as billing from "../services/billingService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { id, idParam, query } from "../utils/validate.js";

const r = Router();

// Fixed paths first, otherwise "/transactions" would be read as an :id.
r.get("/transactions", asyncHandler(async (req, res) => {
  const items = await billing.listTransactions({
    from: query(req.query.from), to: query(req.query.to), mode: query(req.query.mode),
    q: query(req.query.q), limit: req.query.limit,
  });
  res.json({ success: true, total: items.length, items, transactions: items });
}));

r.get("/", asyncHandler(async (req, res) => {
  const items = await billing.listBills({
    from: query(req.query.from), to: query(req.query.to), status: query(req.query.status),
    q: query(req.query.q), referrerId: id(req.query.referrerId), limit: req.query.limit,
  });
  res.json({ items });
}));

r.get("/:id", asyncHandler(async (req, res) => {
  res.json(await billing.getBill(String(req.params.id)));
}));

r.post("/", asyncHandler(async (req, res) => {
  res.status(201).json(await billing.createBill(req.body, actorName(req)));
}));

r.patch("/:id", asyncHandler(async (req, res) => {
  res.json(await billing.updateBill(idParam(req.params.id), req.body, actorName(req)));
}));

r.post("/:id/cancel", asyncHandler(async (req, res) => {
  res.json(await billing.cancelBill(idParam(req.params.id), req.body?.reason, actorName(req)));
}));

r.post("/:id/payments", asyncHandler(async (req, res) => {
  res.status(201).json(await billing.addPayment(idParam(req.params.id), req.body, actorName(req)));
}));

export default r;
