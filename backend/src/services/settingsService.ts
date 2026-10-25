import type { Prisma } from "@prisma/client";
import { prisma, type Db } from "../lib/prisma.js";

/** userId 0 = applies to everyone. */
export async function getSetting<T>(
  scope: string,
  key: string,
  fallback: T,
  userId = 0,
  db: Db = prisma,
): Promise<T> {
  const row = await db.appSetting.findUnique({
    where: { userId_scope_settingKey: { userId, scope, settingKey: key } },
  });
  return row?.settingValue === null || row?.settingValue === undefined
    ? fallback
    : (row.settingValue as T);
}

export async function setSetting(
  scope: string,
  key: string,
  value: Prisma.InputJsonValue,
  userId = 0,
  db: Db = prisma,
): Promise<void> {
  await db.appSetting.upsert({
    where: { userId_scope_settingKey: { userId, scope, settingKey: key } },
    create: { userId, scope, settingKey: key, settingValue: value },
    update: { settingValue: value },
  });
}

export async function getScope(scope: string, userId = 0): Promise<Record<string, unknown>> {
  const rows = await prisma.appSetting.findMany({ where: { scope, userId } });
  return Object.fromEntries(rows.map((row) => [row.settingKey, row.settingValue]));
}
