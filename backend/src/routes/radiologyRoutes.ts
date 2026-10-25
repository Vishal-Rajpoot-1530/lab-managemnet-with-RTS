import { Router } from "express";
import { actorName } from "../middleware/auth.js";
import * as radiology from "../services/radiologyService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { idParam, query } from "../utils/validate.js";

/**
 * Scan reports share one table. Each page group is the same router limited to
 * its modalities: /api/usg -> usg, /api/xray -> xray + digitalXray,
 * /api/radiology -> every scan type (filter with ?modality=ctScan).
 */
export function radiologyRouter(modalities: string[], defaultModality?: string): Router {
  const r = Router();

  const cases = (today: boolean) =>
    asyncHandler(async (req, res) => {
      const items = await radiology.listCases({
        modalities, today,
        modality: query(req.query.modality), from: query(req.query.from), to: query(req.query.to),
        q: query(req.query.q), status: query(req.query.status), limit: req.query.limit,
      });
      res.json({ module: modalities.join(","), items });
    });

  r.get("/", cases(false));
  r.get("/today", cases(true));
  r.get("/search", cases(false));

  r.get("/templates", asyncHandler(async (_req, res) => res.json({ items: await radiology.listTemplates(modalities) })));
  r.post("/templates", asyncHandler(async (req, res) => res.status(201).json(await radiology.saveTemplate(null, modalities, req.body, defaultModality))));
  r.patch("/templates/:id", asyncHandler(async (req, res) => res.json(await radiology.saveTemplate(idParam(req.params.id), modalities, req.body, defaultModality))));
  r.delete("/templates/:id", asyncHandler(async (req, res) => { await radiology.removeTemplate(idParam(req.params.id), modalities); res.status(204).end(); }));

  r.get("/signatures", asyncHandler(async (_req, res) => res.json({ items: await radiology.listSignatures(modalities) })));
  r.post("/signatures", asyncHandler(async (req, res) => res.status(201).json(await radiology.saveSignature(null, modalities, req.body, defaultModality))));
  r.patch("/signatures/:id", asyncHandler(async (req, res) => res.json(await radiology.saveSignature(idParam(req.params.id), modalities, req.body, defaultModality))));
  r.delete("/signatures/:id", asyncHandler(async (req, res) => { await radiology.removeSignature(idParam(req.params.id), modalities); res.status(204).end(); }));

  r.get("/:id", asyncHandler(async (req, res) => res.json(await radiology.getCase(idParam(req.params.id), modalities))));
  r.patch("/:id", asyncHandler(async (req, res) =>
    res.json(await radiology.updateCase(idParam(req.params.id), modalities, req.body, actorName(req)))));

  return r;
}
