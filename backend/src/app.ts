import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, routeNotFound } from "./middleware/errorHandler.js";
import { requestContext } from "./middleware/requestContext.js";
import { tenantContext } from "./middleware/tenantContext.js";
import api from "./routes/index.js";
import { adminAuthRouter, notificationsRouter, superAdminRouter } from "./routes/tenantRoutes.js";

/** Builds the Express app (kept separate from server.ts so it can be tested). */
export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(cors(env.corsOrigins.length ? { origin: env.corsOrigins, credentials: true } : undefined));
  app.use(express.json({ limit: "2mb" }));
  app.use(requestContext);

  // Multi-lab: pick the lab's database from the signed-in token (must come before the routes).
  app.use(tenantContext);

  // Super admin panel and Admin login. They have their own sign-in, so they sit outside `api`.
  app.use("/api/super-admin", superAdminRouter);
  app.use("/api/admin-auth", adminAuthRouter);
  app.use("/api/notifications", notificationsRouter); // lab users read the super admin's messages

  app.use("/api", api);

  app.use(routeNotFound);
  app.use(errorHandler);

  return app;
}