
import { Router } from "express";
import { actorName } from "../middleware/auth.js";
import * as activity from "../services/activityService.js";
import * as business from "../services/businessService.js";
import * as caseWise from "../services/casewiseReportService.js";
import * as dashboard from "../services/dashboardService.js";
import * as dataExport from "../services/dataExportService.js";
import * as expenses from "../services/expenseService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { idParam, query } from "../utils/validate.js";

const r = Router();
const range = (q: Record<string, unknown>) => ({ from: query(q.from), to: query(q.to) });

r.get("/", asyncHandler(async (req, res) => res.json(await business.overview(range(req.query)))));
r.get("/daily", asyncHandler(async (req, res) => res.json(await business.daily(query(req.query.date)))));
r.get("/monthly", asyncHandler(async (req, res) => res.json(await business.monthly(query(req.query.month)))));
r.get("/referral-reports", asyncHandler(async (req, res) =>
  res.json(await business.referralReports({ ...range(req.query), period: query(req.query.period) }))));
r.get("/dashboard", asyncHandler(async (_req, res) => res.json(await dashboard.dashboard())));
r.get("/due-reports", asyncHandler(async (req, res) =>
  res.json({ items: await dashboard.dueReports({ from: query(req.query.from), to: query(req.query.to), q: query(req.query.q) }) })));
r.get("/dues", asyncHandler(async (req, res) => res.json(await business.dues(range(req.query)))));

r.get("/activities", asyncHandler(async (req, res) => {
  const items = await activity.listActivities({ date: query(req.query.date), type: query(req.query.type) });
  res.json({ success: true, total: items.length, items });
}));

// ---- expenses
r.get("/expenses", asyncHandler(async (req, res) =>
  res.json({ success: true, ...(await expenses.listExpenses({ month: query(req.query.month), q: query(req.query.q) })) })));
r.post("/expenses", asyncHandler(async (req, res) => res.status(201).json(await expenses.createExpense(req.body, actorName(req)))));
r.patch("/expenses/:id", asyncHandler(async (req, res) => res.json(await expenses.updateExpense(idParam(req.params.id), req.body, actorName(req)))));
r.delete("/expenses/:id", asyncHandler(async (req, res) => { await expenses.removeExpense(idParam(req.params.id)); res.status(204).end(); }));

r.get("/expense-categories", asyncHandler(async (_req, res) => res.json({ items: await expenses.listExpenseCategories() })));
r.post("/expense-categories", asyncHandler(async (req, res) => res.status(201).json(await expenses.createExpenseCategory(req.body))));
r.delete("/expense-categories/:id", asyncHandler(async (req, res) => { await expenses.removeExpenseCategory(idParam(req.params.id)); res.status(204).end(); }));

// ---- case wise report
r.get("/case-wise-report/options", asyncHandler(async (_req, res) => res.json(await caseWise.caseWiseOptions())));
r.get("/case-wise-report", asyncHandler(async (req, res) => res.json(await caseWise.caseWiseReport({
  date: query(req.query.date),
  centre: query(req.query.centre),
  types: (query(req.query.types) ?? "").split(",").filter(Boolean),
  excludeCancelled: query(req.query.excludeCancelled) !== "false",
}))));

// ---- data export (admin only, checked in the service)
r.get("/data-export", asyncHandler(async (req, res) => res.json({ items: await dataExport.listExports(req.auth!.id) })));
r.post("/data-export", asyncHandler(async (req, res) => res.status(201).json(await dataExport.runExport(req.body, req.auth!.id))));
r.get("/data-export/:id/file", asyncHandler(async (req, res) => res.json(await dataExport.exportFile(idParam(req.params.id), req.auth!.id))));

export default r;