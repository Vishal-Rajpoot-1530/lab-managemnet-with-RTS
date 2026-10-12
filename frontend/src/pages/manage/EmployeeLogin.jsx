
import { useMemo, useState } from "react";
import "./manage.css";

const SEED = [
  {
    id: 1,
    name: "Demo Lab Owner",
    mobile: "+91 9000000001",
    email: "owner@example.com",
    active: true,
    date: "30 Nov 2024",
    permission: "Account owner",
  },
  {
    id: 2,
    name: "Demo Technician",
    mobile: "+91 9000000002",
    email: "technician@example.com",
    active: false,
    date: "24 Dec 2024",
    permission: "Configure",
  },
];

const PERMISSIONS = [
  "Account owner",
  "Administrator",
  "Configure",
  "Reports only",
  "View only",
];

function Icon({ name, size = 19 }) {
  const shapes = {
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    userPlus: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M19 8v6M16 11h6" />
      </>
    ),
    userCheck: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M3 21v-2a6 6 0 0 1 12 0v2M16 11l2 2 4-4" />
      </>
    ),
    ban: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m5.6 5.6 12.8 12.8" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6" />
        <path d="M10 11v5M14 11v5" />
      </>
    ),
    close: <path d="m18 6-12 12M6 6l12 12" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    phone: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.7l.5 2.8a2 2 0 0 1-.6 1.9L8.1 11a16 16 0 0 0 4.9 4.9l1.6-1.9a2 2 0 0 1 1.9-.6l2.8.5a2 2 0 0 1 1.7 2Z" />
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </>
    ),
    play: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m10 8 6 4-6 4z" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[name] || shapes.users}
    </svg>
  );
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function today() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

export default function EmployeeLogin() {
  const [rows, setRows] = useState(SEED);
  const [tab, setTab] = useState("Active");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    permission: "Configure",
  });

  const [error, setError] = useState("");

  const activeCount = rows.filter((row) => row.active).length;
  const blockedCount = rows.length - activeCount;

  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((row) => {
      const statusMatches = tab === "All" ||
        (tab === "Active" ? row.active : !row.active);

      const searchMatches =
        !query ||
        row.name.toLowerCase().includes(query) ||
        row.email.toLowerCase().includes(query) ||
        row.mobile.toLowerCase().includes(query);

      return statusMatches && searchMatches;
    });
  }, [rows, tab, search]);

  function notify(message) {
    setToast(message);
  }

  function openAdd(type) {
    setForm({
      name: "",
      mobile: "",
      email: "",
      permission: "Configure",
    });
    setError("");
    setModal(type);
  }

  function submitEmployee(event) {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const mobile = form.mobile.trim();

    if (!name || !email || !mobile) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[+()\d\s-]{7,20}$/.test(mobile)) {
      setError("Please enter a valid mobile number.");
      return;
    }

    if (rows.some((row) => row.email.toLowerCase() === email)) {
      setError("An employee with this email already exists.");
      return;
    }

    if (rows.some((row) => row.mobile === mobile)) {
      setError("An employee with this mobile number already exists.");
      return;
    }

    const employee = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      name,
      mobile,
      email,
      active: true,
      date: today(),
      permission: form.permission,
    };

    setRows((current) => [employee, ...current]);
    setTab("Active");
    setSearch("");
    setModal(null);
    notify(
      modal === "existing"
        ? "Employee added to this directory."
        : "Employee added successfully."
    );
  }

  function toggleStatus(employee) {
    const nextStatus = !employee.active;

    setRows((current) =>
      current.map((row) =>
        row.id === employee.id ? { ...row, active: nextStatus } : row
      )
    );

    setMenuId(null);
    notify(
      nextStatus
        ? `${employee.name} is now active.`
        : `${employee.name} has been blocked.`
    );
  }

  function savePermission(event) {
    event.preventDefault();

    if (!selected) return;

    setRows((current) =>
      current.map((row) =>
        row.id === selected.id
          ? { ...row, permission: selected.permission }
          : row
      )
    );

    setModal(null);
    setSelected(null);
    notify("Employee permissions updated.");
  }

  function confirmDelete() {
    if (!selected) return;

    setRows((current) =>
      current.filter((row) => row.id !== selected.id)
    );

    setModal(null);
    setSelected(null);
    setMenuId(null);
    notify("Employee removed from the directory.");
  }

  function openPermissions(employee) {
    setSelected({ ...employee });
    setMenuId(null);
    setModal("permissions");
  }

  return (
    <main className="employee-page">
      <div className="employee-container">
        <header className="employee-header">
          <div>
            <div className="employee-eyebrow">
              <span />
              LABLIMS ADMINISTRATION
            </div>
            <h1>Manage employee logins</h1>
            <p>
              Manage team accounts, control access, and configure employee
              permissions.
            </p>
          </div>

          <button
            type="button"
            className="employee-video-btn"
            onClick={() =>
              notify("Connect your employee-management tutorial video here.")
            }
          >
            <Icon name="play" size={18} />
            Watch video
          </button>
        </header>

        <section className="employee-overview">
          <div className="employee-overview-copy">
            <div className="employee-overview-icon">
              <Icon name="shield" size={23} />
            </div>
            <div>
              <strong>Employee access overview</strong>
              <p>
                {activeCount} active accounts · {blockedCount} blocked accounts
              </p>
            </div>
          </div>
          <div className="employee-overview-note">
            <Icon name="users" size={17} />
            Team account management
          </div>
        </section>

        <section className="employee-stats">
          <article className="employee-stat-card">
            <div className="employee-stat-top">
              <span>Total employees</span>
              <div className="employee-stat-icon employee-blue">
                <Icon name="users" />
              </div>
            </div>
            <strong>{rows.length}</strong>
            <small>All registered accounts</small>
          </article>

          <article className="employee-stat-card">
            <div className="employee-stat-top">
              <span>Active employees</span>
              <div className="employee-stat-icon employee-green">
                <Icon name="userCheck" />
              </div>
            </div>
            <strong>{activeCount}</strong>
            <small>Currently enabled in this list</small>
          </article>

          <article className="employee-stat-card">
            <div className="employee-stat-top">
              <span>Blocked employees</span>
              <div className="employee-stat-icon employee-red">
                <Icon name="ban" />
              </div>
            </div>
            <strong>{blockedCount}</strong>
            <small>Marked as blocked</small>
          </article>
        </section>

        <section className="employee-directory">
          <div className="employee-directory-header">
            <div>
              <h2>Employee directory</h2>
              <p>Manage login status and account permissions.</p>
            </div>

            <div className="employee-header-actions">
              <button
                type="button"
                className="employee-secondary-btn"
                onClick={() => openAdd("existing")}
              >
                <Icon name="users" size={17} />
                Existing employee
              </button>
              <button
                type="button"
                className="employee-primary-btn"
                onClick={() => openAdd("new")}
              >
                <Icon name="plus" size={18} />
                New employee
              </button>
            </div>
          </div>

          <div className="employee-tools">
            <label className="employee-search">
              <Icon name="search" size={19} />
              <input
                type="search"
                placeholder="Search name, email, or mobile..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search employees"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </label>

            <button
              type="button"
              className="employee-reset-btn"
              onClick={() => {
                setSearch("");
                setTab("Active");
              }}
            >
              Reset filters
            </button>
          </div>

          <div className="employee-tabs" role="tablist" aria-label="Employee status">
            {[
              { label: "Active", count: activeCount },
              { label: "Blocked", count: blockedCount },
              { label: "All employees", count: rows.length },
            ].map((item) => (
              <button
                type="button"
                role="tab"
                aria-selected={tab === item.label.replace(" employees", "")}
                className={`employee-tab ${
                  tab === item.label.replace(" employees", "") ? "active" : ""
                }`}
                key={item.label}
                onClick={() => setTab(item.label.replace(" employees", ""))}
              >
                {item.label}
                <span>{item.count}</span>
              </button>
            ))}
          </div>

          <div className="employee-table-scroll">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>MOBILE NUMBER</th>
                  <th>EMAIL ADDRESS</th>
                  <th>STATUS</th>
                  <th>REGISTERED ON</th>
                  <th>PERMISSIONS</th>
                  <th className="employee-action-heading">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {visibleRows.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="employee-person">
                        <div className="employee-avatar">
                          {initials(employee.name)}
                        </div>
                        <div className="employee-person-info">
                          <strong>{employee.name}</strong>
                          {employee.permission === "Account owner" && (
                            <span className="employee-owner-tag">
                              Account owner
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="employee-mobile">
                      <Icon name="phone" size={15} />
                      {employee.mobile}
                    </td>

                    <td className="employee-email">
                      <Icon name="mail" size={15} />
                      {employee.email}
                    </td>

                    <td>
                      <span
                        className={`employee-status ${
                          employee.active ? "is-active" : "is-blocked"
                        }`}
                      >
                        <span />
                        {employee.active ? "Active" : "Blocked"}
                      </span>
                    </td>

                    <td className="employee-date">{employee.date}</td>

                    <td>
                      <button
                        type="button"
                        className="employee-permission-btn"
                        onClick={() => openPermissions(employee)}
                      >
                        <Icon name="settings" size={15} />
                        {employee.permission}
                      </button>
                    </td>

                    <td>
                      <div className="employee-action-cell">
                        <button
                          type="button"
                          className="employee-icon-btn"
                          aria-label={`Actions for ${employee.name}`}
                          aria-expanded={menuId === employee.id}
                          onClick={() =>
                            setMenuId((current) =>
                              current === employee.id ? null : employee.id
                            )
                          }
                        >
                          <Icon name="more" size={19} />
                        </button>

                        {menuId === employee.id && (
                          <div className="employee-action-menu">
                            <button
                              type="button"
                              onClick={() => openPermissions(employee)}
                            >
                              <Icon name="settings" size={16} />
                              Configure permissions
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleStatus(employee)}
                            >
                              <Icon
                                name={employee.active ? "ban" : "userCheck"}
                                size={16}
                              />
                              {employee.active
                                ? "Block employee"
                                : "Reactivate employee"}
                            </button>
                            {employee.permission !== "Account owner" && (
                              <button
                                type="button"
                                className="menu-delete"
                                onClick={() => {
                                  setSelected(employee);
                                  setMenuId(null);
                                  setModal("delete");
                                }}
                              >
                                <Icon name="trash" size={16} />
                                Remove employee
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {visibleRows.length === 0 && (
              <div className="employee-empty">
                <div className="employee-empty-icon">
                  <Icon name={search ? "search" : "users"} size={27} />
                </div>
                <h3>
                  {search
                    ? "No employees found"
                    : tab === "Blocked"
                    ? "No blocked employees"
                    : "No employees in this view"}
                </h3>
                <p>
                  {search
                    ? "Try searching with a different name, email, or mobile number."
                    : "Add an employee to begin managing your team accounts."}
                </p>
                {search && (
                  <button
                    type="button"
                    className="employee-secondary-btn"
                    onClick={() => setSearch("")}
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>

          <footer className="employee-table-footer">
            <span>
              Showing {visibleRows.length} of {rows.length} employees
            </span>
            <span>
              <Icon name="shield" size={15} />
              Permissions should follow your lab's access policy
            </span>
          </footer>
        </section>

        <div className="employee-security-note">
          <Icon name="shield" size={17} />
          <p>
            <strong>Security reminder:</strong> UI status changes do not
            automatically block login access. Enforce account status and
            permissions in your authentication backend.
          </p>
        </div>
      </div>

      {(modal === "new" || modal === "existing") && (
        <div
          className="employee-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModal(null);
          }}
        >
          <section
            className="employee-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-form-title"
          >
            <div className="employee-modal-top">
              <div className="employee-modal-icon">
                <Icon
                  name={modal === "new" ? "userPlus" : "users"}
                  size={22}
                />
              </div>
              <button
                type="button"
                className="employee-icon-btn"
                onClick={() => setModal(null)}
                aria-label="Close dialog"
              >
                <Icon name="close" />
              </button>
            </div>

            <h2 id="employee-form-title">
              {modal === "new" ? "Add new employee" : "Add existing employee"}
            </h2>
            <p className="employee-modal-description">
              {modal === "new"
                ? "Enter the employee's details and choose their access level."
                : "Enter the existing employee's details to add them to this lab directory."}
            </p>

            <form onSubmit={submitEmployee}>
              <label className="employee-label" htmlFor="employee-name">
                Full name <span>*</span>
              </label>
              <input
                id="employee-name"
                className="employee-input"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Enter full name"
                maxLength={100}
                required
                autoFocus
              />

              <label className="employee-label" htmlFor="employee-mobile">
                Mobile number <span>*</span>
              </label>
              <input
                id="employee-mobile"
                className="employee-input"
                type="tel"
                value={form.mobile}
                onChange={(event) =>
                  setForm({ ...form, mobile: event.target.value })
                }
                placeholder="+91 9876543210"
                maxLength={20}
                required
              />

              <label className="employee-label" htmlFor="employee-email">
                Email address <span>*</span>
              </label>
              <input
                id="employee-email"
                className="employee-input"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder="employee@lab.com"
                maxLength={254}
                required
              />

              <label className="employee-label" htmlFor="employee-permission">
                Permissions
              </label>
              <select
                id="employee-permission"
                className="employee-input"
                value={form.permission}
                onChange={(event) =>
                  setForm({ ...form, permission: event.target.value })
                }
              >
                {PERMISSIONS.filter((p) => p !== "Account owner").map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {error && (
                <p className="employee-form-error" role="alert">
                  {error}
                </p>
              )}

              <div className="employee-form-note">
                <Icon name="shield" size={17} />
                <span>
                  This demo adds an entry to the local page only. It does not
                  create credentials or send an invitation.
                </span>
              </div>

              <div className="employee-modal-actions">
                <button
                  type="button"
                  className="employee-secondary-btn"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="employee-primary-btn">
                  <Icon name="check" size={17} />
                  Add employee
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {modal === "permissions" && selected && (
        <div
          className="employee-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModal(null);
          }}
        >
          <section
            className="employee-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-permissions-title"
          >
            <div className="employee-modal-top">
              <div className="employee-modal-icon">
                <Icon name="settings" size={22} />
              </div>
              <button
                type="button"
                className="employee-icon-btn"
                onClick={() => setModal(null)}
                aria-label="Close dialog"
              >
                <Icon name="close" />
              </button>
            </div>

            <h2 id="employee-permissions-title">Configure permissions</h2>
            <p className="employee-modal-description">
              Choose the access profile for {selected.name}.
            </p>

            <form onSubmit={savePermission}>
              <label className="employee-label" htmlFor="permission-profile">
                Access profile
              </label>
              <select
                id="permission-profile"
                className="employee-input"
                value={selected.permission}
                disabled={selected.permission === "Account owner"}
                onChange={(event) =>
                  setSelected({
                    ...selected,
                    permission: event.target.value,
                  })
                }
              >
                {PERMISSIONS.map((permission) => (
                  <option key={permission} value={permission}>
                    {permission}
                  </option>
                ))}
              </select>

              {selected.permission === "Account owner" && (
                <p className="employee-form-hint">
                  The account owner's role cannot be changed from this screen.
                </p>
              )}

              <div className="employee-permission-explainer">
                <Icon name="shield" size={19} />
                <div>
                  <strong>{selected.permission}</strong>
                  <p>
                    Apply the corresponding access rules on your backend.
                    Selecting a profile here only updates this page's state.
                  </p>
                </div>
              </div>

              <div className="employee-modal-actions">
                <button
                  type="button"
                  className="employee-secondary-btn"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="employee-primary-btn"
                  disabled={selected.permission === "Account owner"}
                >
                  Save permissions
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {modal === "delete" && selected && (
        <div
          className="employee-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModal(null);
          }}
        >
          <section
            className="employee-modal employee-delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="employee-delete-title"
          >
            <div className="employee-delete-icon">
              <Icon name="trash" size={23} />
            </div>
            <h2 id="employee-delete-title">Remove employee?</h2>
            <p>
              Remove <strong>{selected.name}</strong> from this directory? This
              demo only deletes the local entry.
            </p>
            <div className="employee-modal-actions">
              <button
                type="button"
                className="employee-secondary-btn"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="employee-danger-btn"
                onClick={confirmDelete}
              >
                Remove employee
              </button>
            </div>
          </section>
        </div>
      )}

      {toast && (
        <div className="employee-toast" role="status">
          <span>{toast}</span>
          <button
            type="button"
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            <Icon name="close" size={17} />
          </button>
        </div>
      )}
    </main>
  );
}
