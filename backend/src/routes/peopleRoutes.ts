// import { Router } from "express";
// import * as patients from "../services/patientService.js";
// import * as people from "../services/referrerService.js";
// import * as billing from "../services/billingService.js";
// import * as outsource from "../services/outsourceService.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { idParam, query } from "../utils/validate.js";

// // ---- /api/doctors  (referrers)
// export const doctorsRouter = Router();
// doctorsRouter.get("/", asyncHandler(async (req, res) =>
//   res.json({ items: await people.listReferrers({ q: query(req.query.q), active: query(req.query.active) }) })));
// doctorsRouter.get("/:id", asyncHandler(async (req, res) => res.json(await people.getReferrer(idParam(req.params.id)))));
// doctorsRouter.post("/", asyncHandler(async (req, res) => res.status(201).json(await people.createReferrer(req.body))));
// doctorsRouter.patch("/:id", asyncHandler(async (req, res) => res.json(await people.updateReferrer(idParam(req.params.id), req.body))));
// doctorsRouter.put("/:id", asyncHandler(async (req, res) => res.json(await people.updateReferrer(idParam(req.params.id), req.body))));
// doctorsRouter.delete("/:id", asyncHandler(async (req, res) =>
//   res.json({ success: true, ...(await people.removeReferrer(idParam(req.params.id))) })));

// // ---- /api/patients
// export const patientsRouter = Router();
// patientsRouter.get("/", asyncHandler(async (req, res) =>
//   res.json({ items: await patients.listPatients({ q: query(req.query.q), limit: req.query.limit }) })));
// patientsRouter.get("/search", asyncHandler(async (req, res) =>
//   res.json({ items: await patients.listPatients({ q: query(req.query.q) ?? query(req.query.mobile) ?? query(req.query.name), limit: req.query.limit }) })));
// patientsRouter.get("/:id", asyncHandler(async (req, res) => res.json(await patients.getPatient(idParam(req.params.id)))));
// patientsRouter.post("/", asyncHandler(async (req, res) => res.status(201).json(await patients.createPatient(req.body))));
// patientsRouter.patch("/:id", asyncHandler(async (req, res) => res.json(await patients.updatePatient(idParam(req.params.id), req.body))));
// patientsRouter.put("/:id", asyncHandler(async (req, res) => res.json(await patients.updatePatient(idParam(req.params.id), req.body))));

// // ---- /api/cases   (bills list, sample collection agents, outsource cases)
// export const casesRouter = Router();
// casesRouter.get("/", asyncHandler(async (req, res) =>
//   res.json({ items: await billing.listBills({ from: query(req.query.from), to: query(req.query.to), q: query(req.query.q) }) })));

// casesRouter.get("/agents", asyncHandler(async (req, res) => res.json({ items: await people.listAgents({ q: query(req.query.q) }) })));
// casesRouter.post("/agents", asyncHandler(async (req, res) => res.status(201).json(await people.createAgent(req.body))));
// casesRouter.patch("/agents/:id", asyncHandler(async (req, res) => res.json(await people.updateAgent(idParam(req.params.id), req.body))));
// casesRouter.delete("/agents/:id", asyncHandler(async (req, res) =>
//   res.json({ success: true, ...(await people.removeAgent(idParam(req.params.id))) })));

// casesRouter.get("/outsource", asyncHandler(async (req, res) =>
//   res.json({ items: await outsource.listCases({ from: query(req.query.from), to: query(req.query.to), status: query(req.query.status), q: query(req.query.q), limit: req.query.limit }) })));
// casesRouter.patch("/outsource/:id", asyncHandler(async (req, res) => res.json(await outsource.updateCase(idParam(req.params.id), req.body))));
// casesRouter.get("/outsource-labs", asyncHandler(async (_req, res) => res.json({ items: await outsource.listLabs() })));
// casesRouter.post("/outsource-labs", asyncHandler(async (req, res) => res.status(201).json(await outsource.createLab(req.body))));



import { Router } from "express";
import * as patients from "../services/patientService.js";
import * as people from "../services/referrerService.js";
import * as billing from "../services/billingService.js";
import * as outsource from "../services/outsourceService.js";
import * as reports from "../services/reportService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { idParam, query } from "../utils/validate.js";

// ---- /api/doctors  (referrers)
export const doctorsRouter = Router();
doctorsRouter.get("/", asyncHandler(async (req, res) =>
  res.json({ items: await people.listReferrers({ q: query(req.query.q), active: query(req.query.active) }) })));
doctorsRouter.get("/:id", asyncHandler(async (req, res) => res.json(await people.getReferrer(idParam(req.params.id)))));
doctorsRouter.post("/", asyncHandler(async (req, res) => res.status(201).json(await people.createReferrer(req.body))));
doctorsRouter.patch("/:id", asyncHandler(async (req, res) => res.json(await people.updateReferrer(idParam(req.params.id), req.body))));
doctorsRouter.put("/:id", asyncHandler(async (req, res) => res.json(await people.updateReferrer(idParam(req.params.id), req.body))));
doctorsRouter.delete("/:id", asyncHandler(async (req, res) =>
  res.json({ success: true, ...(await people.removeReferrer(idParam(req.params.id))) })));

// ---- /api/patients
export const patientsRouter = Router();
patientsRouter.get("/", asyncHandler(async (req, res) =>
  res.json({ items: await patients.listPatients({ q: query(req.query.q), limit: req.query.limit }) })));
patientsRouter.get("/search", asyncHandler(async (req, res) =>
  res.json({ items: await patients.listPatients({ q: query(req.query.q) ?? query(req.query.mobile) ?? query(req.query.name), limit: req.query.limit }) })));
patientsRouter.get("/:id", asyncHandler(async (req, res) => res.json(await patients.getPatient(idParam(req.params.id)))));
patientsRouter.post("/", asyncHandler(async (req, res) => res.status(201).json(await patients.createPatient(req.body))));
patientsRouter.patch("/:id", asyncHandler(async (req, res) => res.json(await patients.updatePatient(idParam(req.params.id), req.body))));
patientsRouter.put("/:id", asyncHandler(async (req, res) => res.json(await patients.updatePatient(idParam(req.params.id), req.body))));

// ---- /api/cases   (bills list, sample collection agents, outsource cases, scan cases)
export const casesRouter = Router();
casesRouter.get("/", asyncHandler(async (req, res) =>
  res.json({ items: await billing.listBills({ from: query(req.query.from), to: query(req.query.to), q: query(req.query.q) }) })));

casesRouter.get("/agents", asyncHandler(async (req, res) => res.json({ items: await people.listAgents({ q: query(req.query.q) }) })));
casesRouter.post("/agents", asyncHandler(async (req, res) => res.status(201).json(await people.createAgent(req.body))));
casesRouter.patch("/agents/:id", asyncHandler(async (req, res) => res.json(await people.updateAgent(idParam(req.params.id), req.body))));
casesRouter.delete("/agents/:id", asyncHandler(async (req, res) =>
  res.json({ success: true, ...(await people.removeAgent(idParam(req.params.id))) })));

casesRouter.get("/outsource", asyncHandler(async (req, res) =>
  res.json({ items: await outsource.listCases({ from: query(req.query.from), to: query(req.query.to), status: query(req.query.status), q: query(req.query.q), limit: req.query.limit }) })));
casesRouter.patch("/outsource/:id", asyncHandler(async (req, res) => res.json(await outsource.updateCase(idParam(req.params.id), req.body))));
casesRouter.get("/outsource-labs", asyncHandler(async (_req, res) => res.json({ items: await outsource.listLabs() })));
casesRouter.post("/outsource-labs", asyncHandler(async (req, res) => res.status(201).json(await outsource.createLab(req.body))));

// Scan cases (usg, xray, digitalXray, ctScan, mri): /api/cases/radiology?modality=ctScan
casesRouter.get("/radiology", asyncHandler(async (req, res) =>
  res.json({
    items: await reports.listRadiologyCases(query(req.query.modality) ?? "ctScan", {
      from: query(req.query.from),
      to: query(req.query.to),
      status: query(req.query.status),
      q: query(req.query.q),
      limit: req.query.limit,
    }),
  })));