import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { badRequest, notFound } from "../utils/ApiError.js";
import { dateRange, displayDate, iso, money, toNumber } from "../utils/format.js";
import { asBody, id as toId, limitParam, num, optText, reqText } from "../utils/validate.js";

const include = {
  bill: { select: { regNo: true, patientName: true, createdAt: true } },
  outsourceLab: { select: { name: true } },
} satisfies Prisma.OutsourceCaseInclude;

type Row = Prisma.OutsourceCaseGetPayload<{ include: typeof include }>;

const serialize = (r: Row) => ({
  id: r.id,
  billId: r.billId,
  regNo: r.bill.regNo,
  date: displayDate(r.bill.createdAt),
  patient: r.bill.patientName,
  investigations: r.testName,
  testName: r.testName,
  labId: r.outsourceLabId,
  labName: r.outsourceLab?.name ?? "",
  status: r.status,
  cost: toNumber(r.cost),
  sentAt: iso(r.sentAt),
  receivedAt: iso(r.receivedAt),
  remarks: r.remarks ?? "",
});

export async function listCases(f: { from?: string; to?: string; status?: string; q?: string; limit?: unknown }) {
  const range = dateRange(f.from, f.to);
  const q = f.q?.trim();

  const rows = await prisma.outsourceCase.findMany({
    where: {
      ...(range ? { createdAt: range } : {}),
      ...(f.status ? { status: f.status } : {}),
      ...(q ? { OR: [{ testName: { contains: q } }, { bill: { regNo: { contains: q } } }, { bill: { patientName: { contains: q } } }] } : {}),
    },
    include,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limitParam(f.limit, 1000, 5000),
  });
  return rows.map(serialize);
}

export async function updateCase(caseId: number, input: unknown) {
  if (!(await prisma.outsourceCase.findUnique({ where: { id: caseId } }))) throw notFound("Outsource case");
  const body = asBody(input);

  const labId = body.labId !== undefined ? toId(body.labId) : undefined;
  if (labId && !(await prisma.outsourceLab.findUnique({ where: { id: labId } }))) throw badRequest("Selected lab does not exist.");

  const when = (value: unknown) => {
    if (value === null || value === "") return null;
    const d = new Date(String(value));
    if (Number.isNaN(d.getTime())) throw badRequest("Enter a valid date.");
    return d;
  };

  const row = await prisma.outsourceCase.update({
    where: { id: caseId },
    data: {
      ...(body.status !== undefined ? { status: reqText(body.status, "Status", 30) } : {}),
      ...(labId !== undefined ? { outsourceLabId: labId } : {}),
      ...(body.cost !== undefined ? { cost: Math.max(0, money(num(body.cost))) } : {}),
      ...(body.remarks !== undefined ? { remarks: optText(body.remarks, 5000) } : {}),
      ...(body.sentAt !== undefined ? { sentAt: when(body.sentAt) } : {}),
      ...(body.receivedAt !== undefined ? { receivedAt: when(body.receivedAt) } : {}),
    },
    include,
  });
  return serialize(row);
}

export const listLabs = () => prisma.outsourceLab.findMany({ where: { active: true }, orderBy: { name: "asc" } });

export async function createLab(input: unknown) {
  const body = asBody(input);
  const name = reqText(body.name, "Lab name");
  const existing = await prisma.outsourceLab.findUnique({ where: { name } });
  const data = {
    contact: optText(body.contact, 160),
    mobile: optText(body.mobile, 20),
    email: optText(body.email, 190),
    address: optText(body.address, 5000),
    active: true,
  };
  return existing
    ? prisma.outsourceLab.update({ where: { id: existing.id }, data })
    : prisma.outsourceLab.create({ data: { name, ...data } });
}

