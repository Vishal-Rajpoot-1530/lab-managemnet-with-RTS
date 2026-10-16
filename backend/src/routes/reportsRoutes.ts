import { Router } from "express";
import { store } from "../store.js";
import type { Report } from "../types/domain.js";

const r = Router();

r.get("/", (_req, res) => {
  res.json({ items: store.reports });
});

r.get("/:id", (req, res) => {
  const report = store.reports.find(
    (item) => String(item.id) === String(req.params.id),
  );
  if (report) {
    res.json(report);
  } else {
    res.status(404).json({ message: "Report not found" });
  }
});

r.patch("/:id", (req, res) => {
  const index = store.reports.findIndex(
    (item) => String(item.id) === String(req.params.id),
  );
  if (index < 0) {
    res.status(404).json({ message: "Report not found" });
    return;
  }
  store.reports[index] = {
    ...store.reports[index],
    ...(req.body as Partial<Report>),
  };
  res.json(store.reports[index]);
});

r.post("/:id/status", (req, res) => {
  const report = store.reports.find(
    (item) => String(item.id) === String(req.params.id),
  );
  if (!report) {
    res.status(404).json({ message: "Report not found" });
    return;
  }
  const body = req.body as { status?: string };
  report.status = body.status || report.status;
  res.json(report);
});

export default r;
