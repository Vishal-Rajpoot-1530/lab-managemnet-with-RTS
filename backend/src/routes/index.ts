import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as business from "../services/businessService.js";
import authRoutes from "./authRoutes.js";
import billingRoutes from "./billingRoutes.js";
import businessRoutes from "./businessRoutes.js";
import healthRoutes from "./healthRoutes.js";
import labRoutes from "./labRoutes.js";
import manageRoutes from "./manageRoutes.js";
import { casesRouter, doctorsRouter, patientsRouter } from "./peopleRoutes.js";
import { radiologyRouter } from "./radiologyRoutes.js";
import reportsRoutes from "./reportsRoutes.js";

const SCANS = ["usg", "xray", "digitalXray", "ctScan", "mri", "ecg", "eps", "opg", "cardiology", "eeg", "mammography"];

const api = Router();

// Open: health check and login. Everything else needs a valid token.
api.use("/health", healthRoutes);
api.use("/auth", authRoutes);

api.use(requireAuth);

api.get("/dashboard", asyncHandler(async (_req, res) => res.json(await business.dashboard())));
api.use("/business", businessRoutes);
api.use("/cases", casesRouter);
api.use("/patients", patientsRouter);
api.use("/doctors", doctorsRouter);
api.use("/lab", labRoutes);
api.use("/usg", radiologyRouter(["usg"], "usg"));
api.use("/xray", radiologyRouter(["xray", "digitalXray"], "digitalXray"));
api.use("/radiology", radiologyRouter(SCANS));
api.use("/manage", manageRoutes);
api.use("/billing", billingRoutes);
api.use("/reports", reportsRoutes);

export default api;
