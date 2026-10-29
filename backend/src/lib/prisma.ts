import { AsyncLocalStorage } from "node:async_hooks";
import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaClient as ControlPrismaClient } from "../generated/control/index.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * GLOBAL CONTROL PRISMA CLIENT
 *
 * Reuses the control Prisma client during development hot reloads.
 * The control database stores super admin and lab account information.
 */
const globalForControlPrisma = globalThis as unknown as {
  controlPrisma?: ControlPrismaClient;
};

export const controlPrisma =
  globalForControlPrisma.controlPrisma ??
  new ControlPrismaClient({
    log: env.isProd ? ["error"] : ["warn", "error"],
  });

if (!env.isProd) {
  globalForControlPrisma.controlPrisma = controlPrisma;
}

/**
 * TENANT CONTEXT
 *
 * Each request can have its own active lab database.
 * AsyncLocalStorage isolates tenant context across concurrent requests.
 */
interface TenantStore {
  tenantId: number;
  client: PrismaClient;
}

export const tenantStorage = new AsyncLocalStorage<TenantStore>();

/**
 * Returns the current tenant ID, or null when no lab is active.
 */
export const currentTenantId = (): number | null =>
  tenantStorage.getStore()?.tenantId ?? null;

/**
 * CACHED LAB DATABASE CLIENTS
 *
 * Each tenant gets a reusable Prisma client.
 * A changed URL causes the old client to be disconnected and replaced.
 */
const clients = new Map<
  number,
  { client: PrismaClient; url: string }
>();

export function clientFor(
  tenantId: number,
  url: string,
): PrismaClient {
  const existing = clients.get(tenantId);

  if (existing?.url === url) {
    return existing.client;
  }

  if (existing) {
    clients.delete(tenantId);
    void existing.client.$disconnect().catch(() => {});
  }

  const client = new PrismaClient({
    datasources: {
      db: { url },
    },
    log: env.isProd ? ["error"] : ["warn", "error"],
  });

  clients.set(tenantId, { client, url });

  return client;
}

/**
 * DISCONNECT A LAB CLIENT
 *
 * Removes the cached client and closes its connection pool.
 */
export async function dropClient(tenantId: number): Promise<void> {
  const existing = clients.get(tenantId);

  if (!existing) {
    return;
  }

  clients.delete(tenantId);

  await existing.client.$disconnect().catch(() => {});
}

/**
 * BINDS PRISMA METHODS TO THEIR ORIGINAL CLIENT
 *
 * Preserves the correct `this` context for Prisma methods.
 */
function bound(target: object, prop: string | symbol): unknown {
  const value = Reflect.get(target, prop, target);

  return typeof value === "function"
    ? value.bind(target)
    : value;
}

/**
 * COMPATIBILITY PRISMA PROXY
 *
 * Inside a tenant context:
 *   Queries use the active lab's database.
 *
 * Outside a tenant context:
 *   Ordinary model queries are blocked.
 *   Prisma methods beginning with "$" are routed to the control
 *   database for health checks and other intentional control operations.
 *
 * Services can continue importing `prisma` without changing imports.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const store = tenantStorage.getStore();

    // An active lab request must use that lab's database.
    if (store) {
      return bound(store.client, prop);
    }

    // Do not expose internal or promise-related properties.
    if (
      typeof prop === "symbol" ||
      prop === "then" ||
      prop === "toJSON"
    ) {
      return undefined;
    }

    // Without a tenant, allow only explicitly invoked Prisma
    // client-level methods through the control database.
    if (typeof prop === "string" && prop.startsWith("$")) {
      return bound(controlPrisma, prop);
    }

    // Prevent lab model queries without an authenticated lab context.
    throw new ApiError(
      401,
      "NO_LAB",
      "Please sign in to your lab account first.",
    );
  },
});

/**
 * TRANSACTION CLIENT TYPE
 *
 * Used in:
 * prisma.$transaction(async (tx) => { ... })
 */
export type Tx = Prisma.TransactionClient;

/**
 * DATABASE CLIENT TYPE
 *
 * Either a standard Prisma client or a transaction client.
 */
export type Db = PrismaClient | Prisma.TransactionClient;
