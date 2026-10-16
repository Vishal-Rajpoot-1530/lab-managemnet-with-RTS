import { Router } from "express";
import { store, nextId } from "../store.js";
import type { Referrer } from "../types/domain.js";

const r = Router();

r.get("/", (_req, res) => {
  res.json({ items: store.referrers });
});

r.post("/", (req, res) => {
  const referrer: Referrer = {
    id: nextId(store.referrers),
    active: true,
    ...(req.body as Partial<Referrer>),
  };
  store.referrers.push(referrer);
  res.status(201).json(referrer);
});

r.patch("/:id", (req, res) => {
  const index = store.referrers.findIndex(
    (referrer) => String(referrer.id) === String(req.params.id),
  );
  if (index < 0) {
    res.status(404).json({ message: "Referrer not found" });
    return;
  }
  store.referrers[index] = {
    ...store.referrers[index],
    ...(req.body as Partial<Referrer>),
  };
  res.json(store.referrers[index]);
});

export default r;
