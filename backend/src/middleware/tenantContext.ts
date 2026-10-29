import type { RequestHandler } from "express";
import { tenantStorage } from "../lib/prisma.js";
import { tenantClient, tenantIdForToken } from "../lib/tenantAccess.js";

/**
 * Mount ONCE, before every router:   app.use(tenantContext);
 *
 * If the request carries a token that was issued to a lab's user, the rest of the
 * request runs against that lab's database. Other requests (login, super admin,
 * labs that existed before multi-lab) use the main database.
 * The token is still verified by your normal auth middleware afterwards.
 */
export const tenantContext: RequestHandler = async (req, _res, next) => {
  try {
    const token = (req.headers.authorization ?? "").replace(/^Bearer\s+/i, "").trim();
    if (!token) return next();

    const tenantId = await tenantIdForToken(token);
    if (!tenantId) return next();

    const client = await tenantClient(tenantId);
    tenantStorage.run({ tenantId, client }, () => next());
  } catch (err) {
    next(err);
  }
};