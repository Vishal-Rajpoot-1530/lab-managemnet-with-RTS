import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import * as catalog from "../services/catalogService.js";
import * as extras from "../services/labExtrasService.js";
import * as tests from "../services/testService.js";
import * as reports from "../services/reportService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { id, idParam, query } from "../utils/validate.js";
import type { Request, Response } from "express";

const r = Router();

/** The catalogue pages expect { success, data, requestId }. */
const ok = (req: Request, res: Response, data: unknown, status = 200, extra: object = {}) =>
  res.status(status).json({ success: true, data, ...extra, requestId: req.requestId });

/** Lab pages are for staff. Doctor logins (role "doctor") are turned away. */
r.use(asyncHandler(async (req, _res, next) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.id }, select: { role: true } });
  if (user?.role === "doctor") throw new ApiError(403, "FORBIDDEN", "Doctor accounts cannot use this area.");
  next();
}));

// ---- test categories
r.get("/test-categories", asyncHandler(async (req, res) => {
  const data = await catalog.listCategories();
  ok(req, res, data, 200, { meta: { count: data.length } });
}));
r.get("/test-categories/:id", asyncHandler(async (req, res) => ok(req, res, await catalog.getCategory(idParam(req.params.id)))));
r.post("/test-categories", asyncHandler(async (req, res) =>
  ok(req, res, await catalog.createCategory(req.body), 201, { message: "Test category created successfully." })));
const updateCategory = asyncHandler(async (req, res) =>
  ok(req, res, await catalog.updateCategory(idParam(req.params.id), req.body), 200, { message: "Test category updated successfully." }));
r.put("/test-categories/:id", updateCategory);
r.patch("/test-categories/:id", updateCategory);
r.delete("/test-categories/:id", asyncHandler(async (req, res) => { await catalog.removeCategory(idParam(req.params.id)); res.status(204).end(); }));

// ---- units
r.get("/units", asyncHandler(async (req, res) => ok(req, res, await catalog.listUnits())));
r.post("/units", asyncHandler(async (req, res) => ok(req, res, await catalog.createUnit(req.body), 201)));
r.patch("/units/:id", asyncHandler(async (req, res) => ok(req, res, await catalog.updateUnit(idParam(req.params.id), req.body))));
r.delete("/units/:id", asyncHandler(async (req, res) => { await catalog.removeUnit(idParam(req.params.id)); res.status(204).end(); }));

// ---- input types
r.get("/input-types", asyncHandler(async (req, res) => ok(req, res, await catalog.listInputTypes())));

// ---- tests
r.get("/tests", asyncHandler(async (req, res) =>
  ok(req, res, await tests.listTests({ q: query(req.query.q), categoryId: id(req.query.categoryId) ?? undefined, type: query(req.query.type) }))));
r.get("/tests/:id", asyncHandler(async (req, res) => ok(req, res, await tests.getTest(idParam(req.params.id)))));
r.post("/tests", asyncHandler(async (req, res) => ok(req, res, await tests.createTest(req.body), 201)));
const updateTest = asyncHandler(async (req, res) => ok(req, res, await tests.updateTest(idParam(req.params.id), req.body)));
r.patch("/tests/:id", updateTest);
r.put("/tests/:id", updateTest);
r.delete("/tests/:id", asyncHandler(async (req, res) => { await tests.removeTest(idParam(req.params.id)); res.status(204).end(); }));

// ---- packages, panels, interpretations
r.get("/packages", asyncHandler(async (req, res) => ok(req, res, await extras.listPackages())));
r.post("/packages", asyncHandler(async (req, res) => ok(req, res, await extras.savePackage(null, req.body), 201)));
r.patch("/packages/:id", asyncHandler(async (req, res) => ok(req, res, await extras.savePackage(idParam(req.params.id), req.body))));
r.delete("/packages/:id", asyncHandler(async (req, res) => { await extras.removePackage(idParam(req.params.id)); res.status(204).end(); }));

r.get("/panels", asyncHandler(async (req, res) => ok(req, res, await extras.listPanels())));
r.post("/panels", asyncHandler(async (req, res) => ok(req, res, await extras.savePanel(null, req.body), 201)));
r.patch("/panels/:id", asyncHandler(async (req, res) => ok(req, res, await extras.savePanel(idParam(req.params.id), req.body))));
r.delete("/panels/:id", asyncHandler(async (req, res) => { await extras.removePanel(idParam(req.params.id)); res.status(204).end(); }));

r.get("/interpretations", asyncHandler(async (req, res) => ok(req, res, await extras.listInterpretations())));
r.post("/interpretations", asyncHandler(async (req, res) => ok(req, res, await extras.saveInterpretation(null, req.body), 201)));
const updateInterpretation = asyncHandler(async (req, res) =>
  ok(req, res, await extras.saveInterpretation(idParam(req.params.id), req.body), 200, { message: "Interpretation updated successfully." }));
r.patch("/interpretations/:id", updateInterpretation);
r.put("/interpretations/:id", updateInterpretation);
r.delete("/interpretations/:id", asyncHandler(async (req, res) => { await extras.removeInterpretation(idParam(req.params.id)); res.status(204).end(); }));

// ---- today's lab reports (labApiService.today)
r.get("/today", asyncHandler(async (req, res) => res.json({ items: await reports.todaysReports({}) })));

export default r;