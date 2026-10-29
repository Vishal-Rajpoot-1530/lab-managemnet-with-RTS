import { AsyncLocalStorage } from "node:async_hooks";
import { PrismaClient } from "@prisma/client";
import { PrismaClient as ControlPrismaClient } from "../generated/control/index.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * The MAIN database (DATABASE_URL). It holds ONLY the super admin and the lab
 * accounts (see prisma/control/schema.prisma). No patients, bills or tests.
 */
export const controlPrisma = new ControlPrismaClient();

interface TenantStore {
  tenantId: number;
  client: PrismaClient;
}

/** The lab the current request belongs to. Set by the tenantContext middleware. */
export const tenantStorage = new AsyncLocalStorage<TenantStore>();
export const currentTenantId = (): number | null => tenantStorage.getStore()?.tenantId ?? null;

const clients = new Map<number, { client: PrismaClient; url: string }>();

/** One connection pool per lab, reused between requests. */
export function clientFor(tenantId: number, url: string): PrismaClient {
  const existing = clients.get(tenantId);
  if (existing?.url === url) return existing.client;
  if (existing) void existing.client.$disconnect().catch(() => {});

  const client = new PrismaClient({ datasources: { db: { url } } });
  clients.set(tenantId, { client, url });
  return client;
}

export async function dropClient(tenantId: number) {
  const existing = clients.get(tenantId);
  clients.delete(tenantId);
  if (existing) await existing.client.$disconnect().catch(() => {});
}

const bound = (target: object, prop: string | symbol) => {
  const value = Reflect.get(target, prop, target);
  return typeof value === "function" ? value.bind(target) : value;
};

/**
 * Every service imports `prisma` from here. Inside a lab's request it is that lab's
 * database, so the existing services work unchanged. Outside a lab there are no lab
 * tables to read, so using one is refused with a clear message.
 * ($connect, $queryRaw, ... still reach the main database, for health checks.)
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const store = tenantStorage.getStore();
    if (store) return bound(store.client, prop);

    if (typeof prop === "symbol" || prop === "then" || prop === "toJSON") return undefined;
    if (prop.startsWith("$")) return bound(controlPrisma, prop);

    throw new ApiError(401, "NO_LAB", "Please sign in to your lab account first.");
  },
});