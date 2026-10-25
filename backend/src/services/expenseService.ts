import type { Expense, ExpenseCategory } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { badRequest, conflict, notFound } from "../utils/ApiError.js";
import { iso, money, toNumber, todayKey } from "../utils/format.js";
import { asBody, id as toId, monthOrNothing, num, optText, reqText, text } from "./expenseHelpers.js";

type WithCategory = Expense & { category: ExpenseCategory | null };

const serialize = (row: WithCategory) => ({
  id: row.id,
  date: row.expenseDate.toISOString().slice(0, 10),
  spent: row.expenseDate.toISOString().slice(0, 10),
  title: row.title,
  name: row.title,
  amount: toNumber(row.amount),
  categoryId: row.categoryId,
  category: row.category?.name ?? "",
  mode: row.mode,
  paidTo: row.paidTo ?? "",
  notes: row.notes ?? "",
  by: row.createdBy ?? "",
  createdBy: row.createdBy ?? "",
  on: iso(row.createdAt),
  createdAt: iso(row.createdAt),
});

/** Expense dates are plain calendar dates (stored as DATE, no time zone). */
const asDate = (value: unknown): Date => {
  const key = text(value, 10) || todayKey();
  const parsed = new Date(`${key}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) throw badRequest("Enter a valid date.", { field: "date" });
  return parsed;
};

export async function listExpenses(params: { month?: string; q?: string }) {
  const month = monthOrNothing(params.month);
  const q = params.q?.trim();

  const rows = await prisma.expense.findMany({
    where: {
      ...(month
        ? {
            expenseDate: {
              gte: new Date(`${month}-01T00:00:00.000Z`),
              lt: new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 1)),
            },
          }
        : {}),
      ...(q ? { OR: [{ title: { contains: q } }, { notes: { contains: q } }, { paidTo: { contains: q } }] } : {}),
    },
    include: { category: true },
    orderBy: [{ expenseDate: "desc" }, { id: "desc" }],
    take: 2000,
  });

  const items = rows.map(serialize);
  return { items, total: items.length, totalAmount: money(items.reduce((s, i) => s + i.amount, 0)) };
}

async function data(input: unknown, actor: string) {
  const body = asBody(input);
  const amount = money(num(body.amount));
  if (amount < 0) throw badRequest("Amount cannot be negative.", { field: "amount" });

  const categoryId = toId(body.categoryId);
  if (categoryId && !(await prisma.expenseCategory.findUnique({ where: { id: categoryId } }))) {
    throw badRequest("Selected category does not exist.", { field: "categoryId" });
  }

  return {
    title: reqText(body.title ?? body.name, "Expense name"),
    amount,
    categoryId,
    expenseDate: asDate(body.date ?? body.spent),
    mode: text(body.mode, 30).toLowerCase() || "cash",
    paidTo: optText(body.paidTo, 255),
    notes: optText(body.notes, 5000),
    createdBy: actor,
  };
}

export async function createExpense(input: unknown, actor: string) {
  const row = await prisma.expense.create({ data: await data(input, actor), include: { category: true } });
  return serialize(row);
}

export async function updateExpense(expenseId: number, input: unknown, actor: string) {
  if (!(await prisma.expense.findUnique({ where: { id: expenseId } }))) throw notFound("Expense");
  const { createdBy: _ignored, ...rest } = await data(input, actor);
  const row = await prisma.expense.update({ where: { id: expenseId }, data: rest, include: { category: true } });
  return serialize(row);
}

export async function removeExpense(expenseId: number) {
  const result = await prisma.expense.deleteMany({ where: { id: expenseId } });
  if (!result.count) throw notFound("Expense");
}

export const listExpenseCategories = () =>
  prisma.expenseCategory.findMany({ where: { active: true }, orderBy: { name: "asc" } });

export async function createExpenseCategory(input: unknown) {
  const name = reqText(asBody(input).name, "Category name", 120);
  const existing = await prisma.expenseCategory.findUnique({ where: { name } });
  if (existing?.active) throw conflict("This category already exists.");
  return existing
    ? prisma.expenseCategory.update({ where: { id: existing.id }, data: { active: true } })
    : prisma.expenseCategory.create({ data: { name } });
}

export async function removeExpenseCategory(categoryId: number) {
  const result = await prisma.expenseCategory.updateMany({ where: { id: categoryId }, data: { active: false } });
  if (!result.count) throw notFound("Expense category");
}
