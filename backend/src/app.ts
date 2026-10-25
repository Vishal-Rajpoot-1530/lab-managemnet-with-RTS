import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, routeNotFound } from "./middleware/errorHandler.js";
import { requestContext } from "./middleware/requestContext.js";
import api from "./routes/index.js";

/** Builds the Express app (kept separate from server.ts so it can be tested). */
export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(cors(env.corsOrigins.length ? { origin: env.corsOrigins, credentials: true } : undefined));
  app.use(express.json({ limit: "2mb" }));
  app.use(requestContext);

  app.use("/api", api);

  app.use(routeNotFound);
  app.use(errorHandler);

  return app;
}
