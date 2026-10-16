import { Router } from "express";
import { store, nextId } from "../store.js";
import type { Agent } from "../types/domain.js";

const r = Router();

r.get("/", (_req, res) => {
  res.json({ items: store.bills });
});

r.get("/agents", (_req, res) => {
  res.json({ items: store.agents });
});

r.post("/agents", (req, res) => {
  const agent: Agent = {
    id: nextId(store.agents),
    active: true,
    ...(req.body as Partial<Agent>),
  };
  store.agents.push(agent);
  res.status(201).json(agent);
});

r.patch("/agents/:id", (req, res) => {
  const index = store.agents.findIndex(
    (agent) => String(agent.id) === String(req.params.id),
  );
  if (index < 0) {
    res.status(404).json({ message: "Agent not found" });
    return;
  }
  store.agents[index] = { ...store.agents[index], ...(req.body as Partial<Agent>) };
  res.json(store.agents[index]);
});

export default r;
