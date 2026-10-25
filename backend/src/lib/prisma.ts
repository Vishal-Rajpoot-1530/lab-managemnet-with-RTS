import { PrismaClient, type Prisma } from "@prisma/client";
import { env } from "../config/env.js";

/**
 * The ONLY Prisma client in the backend. Every service imports `prisma` from
 * here. (Kept on globalThis so `tsx watch` reloads do not open extra connections.)
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: env.isProd ? ["error"] : ["warn", "error"] });

if (!env.isProd) globalForPrisma.prisma = prisma;

/** The `tx` object inside prisma.$transaction(async (tx) => ...). */
export type Tx = Prisma.TransactionClient;
/** Either the normal client or a transaction client. */
export type Db = PrismaClient | Prisma.TransactionClient;
