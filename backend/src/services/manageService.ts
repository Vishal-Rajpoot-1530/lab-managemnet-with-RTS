import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import type { DoctorAccess, Employee } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { ApiError, badRequest, conflict, notFound } from "../utils/ApiError.js";
import { iso } from "../utils/format.js";
import { splitName } from "./patientService.js";
import { getSetting, setSetting } from "./settingsService.js";
import { asBody, bool, id as toId, isEmail, optText, reqText, text } from "../utils/validate.js";

// ---------------------------------------------------------------------
// Who may do what
// ---------------------------------------------------------------------
/** Login roles (User.role) that may manage employees, doctors and lab details. */
const ADMIN_ROLES = ["owner", "admin"];

/** Access profiles an admin can give an employee (Employee.role). */
const PROFILES = ["Administrator", "Configure", "Reports only", "View only"];

/** Administrator profile = "admin" login; every other profile = "staff" login. */
const loginRole = (role: string) => (role === "Administrator" ? "admin" : "staff");

const forbidden = (message: string) => new ApiError(403, "FORBIDDEN", message);

/** Throws unless the logged-in user is an owner or administrator. Returns that user. */
export async function assertAdmin(actorUserId: number) {
  const actor = await prisma.user.findUnique({ where: { id: actorUserId } });
  if (!actor || !actor.active || !ADMIN_ROLES.includes(actor.role)) {
    throw forbidden("Only an administrator can do this.");
  }
  return actor;
}

/** An id that may be missing (optional form fields). */
const optId = (value: unknown) =>
  value === undefined || value === null || value === "" ? null : toId(value);

// ---------------------------------------------------------------------
// Employees  - /api/manage/employees
// ---------------------------------------------------------------------
const employeeName = (e: Pick<Employee, "name" | "firstName" | "lastName">) =>
  e.name || [e.firstName, e.lastName].filter(Boolean).join(" ");

const permissionsOf = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(String).filter(Boolean) : [];

function serializeEmployee(e: Employee, hasLogin = false) {
  return {
    id: e.id,
    name: employeeName(e),
    firstName: e.firstName ?? "",
    lastName: e.lastName ?? "",
    email: e.email,
    mobile: e.mobile ?? "",
    role: e.role ?? "",
    active: e.active,
    owner: e.isOwner,
    permissions: permissionsOf(e.permissions),
    hasLogin,
    createdAt: iso(e.createdAt),
  };
}

async function withLogin(rows: Employee[]) {
  const users = await prisma.user.findMany({
    where: { employeeId: { in: rows.map((r) => r.id) } },
    select: { employeeId: true },
  });
  const ids = new Set(users.map((u) => u.employeeId));
  return rows.map((row) => serializeEmployee(row, ids.has(row.id)));
}

export async function listEmployees() {
  return withLogin(await prisma.employee.findMany({ orderBy: { id: "asc" } }));
}

export async function getEmployee(employeeId: number) {
  const row = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!row) throw notFound("Employee");
  return (await withLogin([row]))[0]!;
}

async function assertEmailFree(email: string, exceptEmployeeId?: number) {
  const clash = await prisma.employee.findFirst({
    where: { email, ...(exceptEmployeeId ? { id: { not: exceptEmployeeId } } : {}) },
    select: { id: true },
  });
  if (clash) throw conflict("An employee with this email already exists.", "DUPLICATE_EMAIL");
}

async function assertMobileFree(mobile: string | null, exceptEmployeeId?: number) {
  if (!mobile) return;
  const clash = await prisma.employee.findFirst({
    where: { mobile, ...(exceptEmployeeId ? { id: { not: exceptEmployeeId } } : {}) },
    select: { id: true },
  });
  if (clash) throw conflict("An employee with this mobile number already exists.", "DUPLICATE_MOBILE");
}

/** Only the owner can edit the owner. */
function assertCanEdit(base: Employee, actor: { employeeId: number | null }) {
  if (base.isOwner && actor.employeeId !== base.id) {
    throw forbidden("Only the owner can edit the owner account.");
  }
}

/** Admin only. Creates the employee together with their login (password required). */
export async function createEmployee(input: unknown, actorUserId: number) {
  await assertAdmin(actorUserId);

  const body = asBody(input);
  const name = reqText(body.name, "Name");
  const email = reqText(body.email, "Email", 190).toLowerCase();
  const role = reqText(body.role, "Role", 80);
  const password = typeof body.password === "string" ? body.password : "";
  const mobile = optText(String(body.mobile ?? "").replace(/\D/g, ""), 20);

  if (!isEmail(email)) throw badRequest("Enter a valid email address.");
  if (!PROFILES.includes(role)) throw badRequest("Choose a valid access profile.");
  if (password.length < 8) throw badRequest("Password must be at least 8 characters.");
  if (password.length > 72) throw badRequest("Password must be 72 characters or fewer.");

  await assertEmailFree(email);
  await assertMobileFree(mobile);
  if (await prisma.user.findUnique({ where: { email } })) {
    throw conflict("A login with this email already exists.", "DUPLICATE_EMAIL");
  }

  const split = splitName(name);

  const row = await prisma.$transaction(async (tx) => {
    const employee = await tx.employee.create({
      data: {
        name,
        firstName: split.firstName || null,
        lastName: split.lastName || null,
        email,
        mobile,
        role,
        active: true,
        isOwner: false,
        permissions: permissionsOf(body.permissions),
      },
    });

    await tx.user.create({
      data: {
        employeeId: employee.id,
        name,
        email,
        passwordHash: await bcrypt.hash(password, 10),
        role: loginRole(role),
      },
    });

    return employee;
  });

  return serializeEmployee(row, true);
}

/** Admin only. */
export async function updateEmployee(employeeId: number, input: unknown, actorUserId: number) {
  const actor = await assertAdmin(actorUserId);

  const base = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!base) throw notFound("Employee");
  assertCanEdit(base, actor);

  const body = asBody(input);
  const name = body.name !== undefined ? reqText(body.name, "Name") : employeeName(base);
  const email = body.email !== undefined ? reqText(body.email, "Email", 190).toLowerCase() : base.email;
  const active = body.active !== undefined ? bool(body.active, base.active) : base.active;
  const mobile =
    body.mobile !== undefined ? optText(String(body.mobile).replace(/\D/g, ""), 20) : base.mobile;
  const isSelf = actor.employeeId === employeeId;

  if (!isEmail(email)) throw badRequest("Enter a valid email address.");
  if (base.isOwner && !active) throw badRequest("The owner account cannot be deactivated.");
  if (isSelf && !active) throw badRequest("You cannot block your own account.");
  if (email !== base.email) await assertEmailFree(email, employeeId);
  if (mobile !== base.mobile) await assertMobileFree(mobile, employeeId);

  // The owner keeps their role; nobody changes their own role.
  let role = base.role;
  if (body.role !== undefined && !base.isOwner) {
    const next = reqText(body.role, "Role", 80);
    if (!PROFILES.includes(next)) throw badRequest("Choose a valid access profile.");
    if (isSelf && next !== base.role) throw badRequest("You cannot change your own role.");
    role = next;
  }

  const split = splitName(name);

  const row = await prisma.$transaction(async (tx) => {
    const updated = await tx.employee.update({
      where: { id: employeeId },
      data: {
        name,
        firstName: split.firstName || null,
        lastName: split.lastName || null,
        email,
        mobile,
        role,
        active,
      },
    });

    // The login follows the employee's name, e-mail, active switch and access profile.
    const login = await tx.user.updateMany({
      where: { employeeId },
      data: {
        name,
        email,
        active,
        ...(base.isOwner ? {} : { role: loginRole(role ?? "") }),
      },
    });

    if (login.count && (!active || role !== base.role)) {
      const users = await tx.user.findMany({ where: { employeeId }, select: { id: true } });
      await tx.authSession.updateMany({
        where: { userId: { in: users.map((u) => u.id) }, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    return updated;
  });

  return (await withLogin([row]))[0]!;
}

/** Admin only. */
export async function setEmployeePermissions(employeeId: number, value: unknown, actorUserId: number) {
  const actor = await assertAdmin(actorUserId);

  const base = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!base) throw notFound("Employee");
  assertCanEdit(base, actor);
  if (!Array.isArray(value)) throw badRequest("Permissions must be an array.");

  const row = await prisma.employee.update({
    where: { id: employeeId },
    data: { permissions: permissionsOf(value) },
  });
  return (await withLogin([row]))[0]!;
}

// ---------------------------------------------------------------------
// Lab account  - /api/manage/lab-account
// ---------------------------------------------------------------------
export async function getLabAccount() {
  const [row, labId, opening, closing] = await Promise.all([
    prisma.labProfile.findUnique({ where: { id: 1 } }),
    getSetting("lab", "lab_id", "LAB001"),
    getSetting("lab", "opening_time", "09:00"),
    getSetting("lab", "closing_time", "18:00"),
  ]);

  return {
    labName: row?.name ?? "",
    labId,
    registrationNumber: row?.registrationNo ?? "",
    email: row?.email ?? "",
    phone: row?.phone ?? "",
    address: row?.address ?? "",
    city: row?.city ?? "",
    state: row?.state ?? "",
    postalCode: row?.pincode ?? "",
    openingTime: opening,
    closingTime: closing,
  };
}

/** Admin only. */
export async function saveLabAccount(input: unknown, actorUserId: number) {
  await assertAdmin(actorUserId);

  const body = asBody(input);
  const name = reqText(body.labName, "Laboratory name");

  const columns = {
    name,
    registrationNo: optText(body.registrationNumber, 80),
    email: optText(body.email, 190),
    phone: optText(body.phone, 30),
    address: optText(body.address, 5000),
    city: optText(body.city, 120),
    state: optText(body.state, 120),
    pincode: optText(body.postalCode, 12),
  };

  await prisma.labProfile.upsert({ where: { id: 1 }, create: { id: 1, ...columns }, update: columns });

  if (text(body.labId)) await setSetting("lab", "lab_id", text(body.labId, 40));
  if (text(body.openingTime, 5)) await setSetting("lab", "opening_time", text(body.openingTime, 5));
  if (text(body.closingTime, 5)) await setSetting("lab", "closing_time", text(body.closingTime, 5));

  return getLabAccount();
}

/** Setup lab: adds another lab / centre to this account. Admin only. */
export async function createLab(input: unknown, actorUserId: number) {
  await assertAdmin(actorUserId);

  const body = asBody(input);
  const name = reqText(body.labName, "Laboratory name", 160);

  if (await prisma.collectionCentre.findUnique({ where: { name } })) {
    throw conflict("A laboratory with this name already exists.");
  }

  const address = [body.address, body.city, body.state, body.postalCode].map((v) => text(v, 500)).filter(Boolean).join(", ");

  const centre = await prisma.collectionCentre.create({
    data: { name, address: address || null, phone: optText(body.phone, 30) },
  });

  // First-time setup: also fill the lab profile if it does not exist yet.
  if (!(await prisma.labProfile.findUnique({ where: { id: 1 } }))) {
    await prisma.labProfile.create({
      data: { id: 1, name, email: optText(body.email, 190), phone: optText(body.phone, 30), address: address || null },
    });
  }

  return {
    id: centre.id,
    labName: centre.name,
    labType: text(body.labType, 80),
    labId: text(body.labId, 40) || `LAB${String(centre.id).padStart(3, "0")}`,
    email: text(body.email, 190),
    phone: centre.phone ?? "",
    address: centre.address ?? "",
  };
}

// ---------------------------------------------------------------------
// E-mail preferences  - /api/manage/email-preferences  (per user)
// ---------------------------------------------------------------------
const EMAIL_DEFAULTS = {
  reportReady: true,
  billingUpdates: true,
  dailySummary: false,
  securityAlerts: true,
  productAnnouncements: false,
};

export async function getEmailPreferences(userId: number) {
  const stored = await prisma.appSetting.findMany({ where: { scope: "email", userId } });
  const preferences: Record<string, boolean> = { ...EMAIL_DEFAULTS };

  for (const row of stored) {
    if (row.settingKey in EMAIL_DEFAULTS && typeof row.settingValue === "boolean") {
      preferences[row.settingKey] = row.settingValue;
    }
  }
  return { ...preferences, securityAlerts: true };
}

export async function saveEmailPreferences(userId: number, input: unknown) {
  const body = asBody(input);

  for (const key of Object.keys(EMAIL_DEFAULTS)) {
    if (key === "securityAlerts" || body[key] === undefined) continue;
    await setSetting("email", key, bool(body[key], false), userId);
  }
  return getEmailPreferences(userId);
}

// ---------------------------------------------------------------------
// Referral program  - /api/manage/referrals
// ---------------------------------------------------------------------
const randomCode = (prefix: string, length: number) =>
  `${prefix}${crypto.randomBytes(length).toString("hex").slice(0, length).toUpperCase()}`;

export async function getReferralProgram() {
  let code = await getSetting<string>("referral", "code", "");
  if (!code) {
    code = randomCode("LAB-", 6);
    await setSetting("referral", "code", code);
  }

  const invites = await prisma.referralProgramInvite.findMany({ orderBy: { id: "desc" }, take: 200 });
  const joined = invites.filter((i) => ["joined", "completed", "successful"].includes(i.status.toLowerCase()));

  const rewardOf = (reward: string | null) => {
    const n = Number(String(reward ?? "").replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  return {
    referralCode: code,
    totalReferrals: invites.length,
    successfulReferrals: joined.length,
    rewardBalance: joined.reduce((sum, i) => sum + rewardOf(i.reward), 0),
    referrals: invites.map((i) => ({
      id: i.id,
      labName: i.invitee ?? "",
      email: i.invitee ?? "",
      status: i.status,
      reward: i.reward === null ? null : rewardOf(i.reward),
      createdAt: iso(i.createdAt),
    })),
  };
}

export async function inviteReferral(input: unknown) {
  const invitee = reqText(asBody(input).invitee ?? asBody(input).email, "Invitee", 190);
  await prisma.referralProgramInvite.create({ data: { code: randomCode("INV-", 10), invitee, status: "sent" } });
  return getReferralProgram();
}

// ---------------------------------------------------------------------
// Doctor access  - /api/manage/doctor-access
// A doctor has a doctor_access row (permissions) and a users row with role
// "doctor", so they sign in on the normal login form. Both are kept in step.
// ---------------------------------------------------------------------
const serializeDoctorAccess = (d: DoctorAccess) => ({
  id: d.id,
  referrerId: d.referrerId,
  name: d.name,
  email: d.email,
  mobile: d.mobile ?? "",
  canViewReports: d.canViewReports,
  canDownloadReports: d.canDownloadReports,
  active: d.active,
  lastLoginAt: iso(d.lastLoginAt),
  createdAt: iso(d.createdAt),
});

/** Admin only. */
export async function listDoctorAccess(actorUserId: number) {
  await assertAdmin(actorUserId);
  return (await prisma.doctorAccess.findMany({ orderBy: { id: "asc" } })).map(serializeDoctorAccess);
}

/** Admin only. */
export async function createDoctorAccess(input: unknown, actorUserId: number) {
  await assertAdmin(actorUserId);

  const body = asBody(input);
  const email = reqText(body.email, "Email", 190).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (!isEmail(email)) throw badRequest("Enter a valid email address.");
  if (password.length < 8) throw badRequest("Password must be at least 8 characters.");
  if (password.length > 72) throw badRequest("Password must be 72 characters or fewer.");
  if (await prisma.doctorAccess.findUnique({ where: { email } })) throw conflict("This email already has doctor access.");
  if (await prisma.user.findUnique({ where: { email } })) {
    throw conflict("A login with this email already exists.", "DUPLICATE_EMAIL");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const row = await prisma.$transaction(async (tx) => {
    const created = await tx.doctorAccess.create({
      data: {
        referrerId: optId(body.referrerId),
        name: reqText(body.name, "Name"),
        email,
        mobile: optText(body.mobile, 20),
        passwordHash,
        canViewReports: bool(body.canViewReports, true),
        canDownloadReports: bool(body.canDownloadReports, true),
      },
    });

    await tx.user.create({
      data: { name: created.name, email, passwordHash, role: "doctor" },
    });

    return created;
  });

  return serializeDoctorAccess(row);
}

/** Admin only. */
export async function updateDoctorAccess(accessId: number, input: unknown, actorUserId: number) {
  await assertAdmin(actorUserId);

  const base = await prisma.doctorAccess.findUnique({ where: { id: accessId } });
  if (!base) throw notFound("Doctor access");

  const body = asBody(input);
  const password = typeof body.password === "string" && body.password ? body.password : "";
  if (password && password.length < 8) throw badRequest("Password must be at least 8 characters.");
  if (password.length > 72) throw badRequest("Password must be 72 characters or fewer.");

  const passwordHash = password ? await bcrypt.hash(password, 10) : null;

  const row = await prisma.$transaction(async (tx) => {
    const updated = await tx.doctorAccess.update({
      where: { id: accessId },
      data: {
        ...(body.name !== undefined ? { name: reqText(body.name, "Name") } : {}),
        ...(body.mobile !== undefined ? { mobile: optText(body.mobile, 20) } : {}),
        ...(body.referrerId !== undefined ? { referrerId: optId(body.referrerId) } : {}),
        canViewReports: bool(body.canViewReports, base.canViewReports),
        canDownloadReports: bool(body.canDownloadReports, base.canDownloadReports),
        active: bool(body.active, base.active),
        ...(passwordHash ? { passwordHash } : {}),
      },
    });

    // Keep the login in step. updateMany so a doctor added before logins existed doesn't fail.
    await tx.user.updateMany({
      where: { email: base.email, role: "doctor" },
      data: { name: updated.name, active: updated.active, ...(passwordHash ? { passwordHash } : {}) },
    });

    // Blocked, or password reset: sign the doctor out everywhere.
    if (!updated.active || passwordHash) {
      const login = await tx.user.findFirst({
        where: { email: base.email, role: "doctor" },
        select: { id: true },
      });
      if (login) {
        await tx.authSession.updateMany({
          where: { userId: login.id, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }
    }

    return updated;
  });

  return serializeDoctorAccess(row);
}

/** Admin only. Removes the doctor's access and login (sessions go with the user row). */
export async function removeDoctorAccess(accessId: number, actorUserId: number) {
  await assertAdmin(actorUserId);

  const doctor = await prisma.doctorAccess.findUnique({ where: { id: accessId } });
  if (!doctor) throw notFound("Doctor access");

  await prisma.$transaction([
    prisma.doctorAccess.delete({ where: { id: accessId } }),
    prisma.user.deleteMany({ where: { email: doctor.email, role: "doctor" } }),
  ]);
}