import { Router } from "express";
import { store, nextId } from "../store.js";
import type { Employee } from "../types/domain.js";

interface CreateEmployeeBody {
  name?: string;
  email?: string;
  role?: string;
  permissions?: unknown;
}

type UpdateEmployeeBody = Partial<Employee>;

const r = Router();

// GET all employees
r.get("/employees", (_req, res) => {
  res.json({ items: store.employees });
});

// CREATE employee
r.post("/employees", (req, res) => {
  const { name, email, role, permissions } = req.body as CreateEmployeeBody;

  if (!name || !email || !role) {
    res.status(400).json({
      message: "Name, email, and role are required",
    });
    return;
  }

  const existingEmployee = store.employees.find(
    (employee) => employee.email?.toLowerCase() === email.toLowerCase(),
  );

  if (existingEmployee) {
    res.status(409).json({
      message: "An employee with this email already exists",
    });
    return;
  }

  const employee: Employee = {
    id: nextId(store.employees),
    name,
    email,
    role,
    active: true,
    owner: false,
    permissions: Array.isArray(permissions) ? (permissions as string[]) : [],
  };

  store.employees.push(employee);

  res.status(201).json(employee);
});

// UPDATE employee
r.patch("/employees/:id", (req, res) => {
  const index = store.employees.findIndex(
    (employee) => String(employee.id) === String(req.params.id),
  );

  if (index === -1) {
    res.status(404).json({
      message: "Employee not found",
    });
    return;
  }

  const employee = store.employees[index];

  // Prevent clients from changing protected fields here
  const { id: _id, owner: _owner, permissions: _permissions, ...updates } =
    req.body as UpdateEmployeeBody;

  if (
    updates.email &&
    store.employees.some(
      (item, i) =>
        i !== index &&
        item.email?.toLowerCase() === updates.email!.toLowerCase(),
    )
  ) {
    res.status(409).json({
      message: "An employee with this email already exists",
    });
    return;
  }

  store.employees[index] = {
    ...employee,
    ...updates,
    id: employee.id,
    owner: employee.owner,
    permissions: employee.permissions,
  };

  res.json(store.employees[index]);
});

// UPDATE employee permissions
r.put("/employees/:id/permissions", (req, res) => {
  const employee = store.employees.find(
    (item) => String(item.id) === String(req.params.id),
  );

  if (!employee) {
    res.status(404).json({
      message: "Employee not found",
    });
    return;
  }

  const body = req.body as { permissions?: unknown };

  if (!Array.isArray(body.permissions)) {
    res.status(400).json({
      message: "Permissions must be an array",
    });
    return;
  }

  employee.permissions = body.permissions as string[];

  res.json(employee);
});

export default r;
