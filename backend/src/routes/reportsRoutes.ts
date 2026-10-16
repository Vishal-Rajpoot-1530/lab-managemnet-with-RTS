import { Router } from "express";
import { store } from "../store.js";
import type { Report } from "../types/domain.js";

const r = Router();

// Reads the date from whichever field your reports use.
const getReportDate = (report: Report): Date | null => {
  const raw = report as unknown as Record<string, unknown>;
  const value = raw.createdAt ?? raw.date ?? raw.reportDate ?? raw.created_at;

  if (typeof value !== "string" && typeof value !== "number") return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

r.get("/", (_req, res) => {
  res.json({ items: store.reports });
});

// IMPORTANT: fixed paths like "/today" must come BEFORE "/:id",
// otherwise Express treats "today" as an id and returns 404.
r.get("/today", (_req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const items = store.reports.filter((report) => {
    const date = getReportDate(report);
    return date !== null && date >= start && date < end;
  });

  res.json({ items });
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
