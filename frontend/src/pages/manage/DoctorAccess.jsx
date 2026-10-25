
import { useEffect, useState } from "react";
import { doctorAccessApi } from "../../api/core/apiAuth";

import { authApi } from "../../api/core/apiAuth";
import "./manage.css";

// ---- Page helpers (kept in this file so no extra shared file is needed) ----
/** Login roles allowed to change lab-wide settings and accounts. */
const isAdminUser = (user) => !!user && ["owner", "admin"].includes(user.role);

/** Redirects to /login on 401. Returns true when it did. */
function handleAuthError(err) {
  if (err?.status === 401) {
    window.location.assign("/login");
    return true;
  }
  return false;
}

/** Loads the signed-in user once. */
function useManageSession() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authApi.isLoggedIn()) {
      window.location.assign("/login");
      return;
    }
    authApi
      .me()
      .then(({ user }) => setMe(user))
      .catch(handleAuthError)
      .finally(() => setLoading(false));
  }, []);

  return { me, isAdmin: isAdminUser(me), loading };
}

function useToast() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [message]);
  return [message, setMessage];
}

function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="employee-toast" role="status">
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Dismiss notification">×</button>
    </div>
  );
}

function PageShell({ title, description, actions, children }) {
  return (
    <main className="employee-page">
      <div className="employee-container">
        <header className="employee-header">
          <div>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </div>
          {actions}
        </header>
        {children}
      </div>
    </main>
  );
}

function AdminOnly({ title = "Administrators only", children }) {
  return (
    <PageShell title={title}>
      <section className="employee-empty">
        <h3>Administrators only</h3>
        <p>{children || "Ask your lab administrator for access to this page."}</p>
      </section>
    </PageShell>
  );
}

function Field({ label, id, required, hint, children }) {
  return (
    <div>
      <label className="employee-label" htmlFor={id}>
        {label} {required && <span>*</span>}
      </label>
      {children}
      {hint && <p className="employee-form-hint">{hint}</p>}
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
};

function formatDateTime(value) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(value));
}
// ---------------------------------------------------------------------------

const EMPTY = { name: "", email: "", mobile: "", password: "", referrerId: "", canViewReports: true, canDownloadReports: true };

export default function DoctorAccess() {
  const { isAdmin, loading: sessionLoading } = useManageSession();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [modal, setModal] = useState(null); // "add" | "edit" | "remove"
  const [form, setForm] = useState(EMPTY);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useToast();

  useEffect(() => {
    if (sessionLoading) return;
    if (!isAdmin) { setLoading(false); return; }
    doctorAccessApi
      .list()
      .then(setRows)
      .catch((err) => handleAuthError(err) || setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [sessionLoading, isAdmin]);

  const replace = (row) => setRows((cur) => cur.map((r) => (r.id === row.id ? row : r)));
  const close = () => { setModal(null); setSelected(null); setError(""); };

  function openAdd() { setForm(EMPTY); setError(""); setModal("add"); }
  function openEdit(row) {
    setSelected(row);
    setForm({ ...EMPTY, name: row.name, email: row.email, mobile: row.mobile, referrerId: row.referrerId ?? "",
      canViewReports: row.canViewReports, canDownloadReports: row.canDownloadReports });
    setError("");
    setModal("edit");
  }

  async function run(action, onDone) {
    setSaving(true);
    setError("");
    try {
      await action();
      onDone?.();
    } catch (err) {
      if (!handleAuthError(err)) { setError(err.message); setToast(err.message); }
    } finally {
      setSaving(false);
    }
  }

  function submit(event) {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    if (!form.name.trim()) return setError("Enter the doctor's name.");
    if (modal === "add") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email address.");
      if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    } else if (form.password && form.password.length < 8) {
      return setError("New password must be at least 8 characters.");
    }

    const payload = {
      name: form.name.trim(),
      mobile: form.mobile.trim(),
      canViewReports: form.canViewReports,
      canDownloadReports: form.canDownloadReports && form.canViewReports,
      ...(form.referrerId !== "" ? { referrerId: Number(form.referrerId) } : {}),
      ...(form.password ? { password: form.password } : {}),
    };

    if (modal === "add") {
      run(async () => {
        const row = await doctorAccessApi.create({ ...payload, email });
        setRows((cur) => [...cur, row]);
      }, () => { close(); setToast("Doctor access created."); });
    } else {
      run(async () => replace(await doctorAccessApi.update(selected.id, payload)),
        () => { close(); setToast("Doctor access updated."); });
    }
  }

  const toggleActive = (row) =>
    run(async () => replace(await doctorAccessApi.update(row.id, { active: !row.active })),
      () => setToast(row.active ? `${row.name} has been blocked.` : `${row.name} is active again.`));

  const confirmRemove = () =>
    run(async () => {
      await doctorAccessApi.remove(selected.id);
      setRows((cur) => cur.filter((r) => r.id !== selected.id));
    }, () => { close(); setToast("Doctor access removed."); });

  if (loading || sessionLoading) return <PageShell title="Doctor access"><p role="status">Loading…</p></PageShell>;
  if (!isAdmin) return <AdminOnly title="Doctor access">Only an administrator can manage doctor logins.</AdminOnly>;

  return (
    <PageShell
      title="Doctor access"
      description="Give referring doctors a login to view and download their patients' reports."
      actions={<button type="button" className="employee-primary-btn" onClick={openAdd}>Add doctor</button>}
    >
      {loadError && <p className="employee-form-error" role="alert">{loadError}</p>}

      <section className="employee-directory">
        <div className="employee-table-scroll">
          <table className="employee-table">
            <thead>
              <tr><th>DOCTOR</th><th>MOBILE</th><th>EMAIL</th><th>REPORTS</th><th>STATUS</th><th>LAST LOGIN</th><th>ACTIONS</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.mobile || "—"}</td>
                  <td>{row.email}</td>
                  <td>{row.canViewReports ? (row.canDownloadReports ? "View and download" : "View only") : "No access"}</td>
                  <td>
                    <span className={`employee-status ${row.active ? "is-active" : "is-blocked"}`}>
                      <span />{row.active ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td>{formatDateTime(row.lastLoginAt)}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button type="button" className="employee-secondary-btn" onClick={() => openEdit(row)}>Edit</button>
                      <button type="button" className="employee-secondary-btn" disabled={saving} onClick={() => toggleActive(row)}>
                        {row.active ? "Block" : "Reactivate"}
                      </button>
                      <button type="button" className="employee-secondary-btn" onClick={() => { setSelected(row); setModal("remove"); }}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="employee-empty">
              <h3>No doctor logins yet</h3>
              <p>Add a doctor so they can see their patients' reports online.</p>
            </div>
          )}
        </div>
      </section>

      {(modal === "add" || modal === "edit") && (
        <div className="employee-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <section className="employee-modal" role="dialog" aria-modal="true" aria-labelledby="doctor-title">
            <h2 id="doctor-title">{modal === "add" ? "Add doctor access" : `Edit ${selected.name}`}</h2>
            <form onSubmit={submit}>
              <div style={gridStyle}>
                <Field label="Full name" id="doc-name" required>
                  <input id="doc-name" className="employee-input" value={form.name} maxLength={255} required autoFocus
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </Field>
                <Field label="Mobile number" id="doc-mobile">
                  <input id="doc-mobile" className="employee-input" type="tel" value={form.mobile} maxLength={20}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                </Field>
              </div>
              <Field label="Email address" id="doc-email" required={modal === "add"}>
                <input id="doc-email" className="employee-input" type="email" value={form.email} maxLength={190}
                  disabled={modal === "edit"} required={modal === "add"} autoComplete="off"
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field label={modal === "add" ? "Password" : "New password"} id="doc-password" required={modal === "add"}
                hint={modal === "edit" ? "Leave blank to keep the current password." : "At least 8 characters."}>
                <input id="doc-password" className="employee-input" type="password" value={form.password} maxLength={72}
                  autoComplete="new-password" required={modal === "add"}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </Field>
              <Field label="Referrer ID (optional)" id="doc-referrer" hint="Links this login to a referrer record.">
                <input id="doc-referrer" className="employee-input" type="number" min="1" value={form.referrerId}
                  onChange={(e) => setForm({ ...form, referrerId: e.target.value })} />
              </Field>

              <label style={{ display: "flex", gap: 10, margin: "14px 0 6px" }}>
                <input type="checkbox" checked={form.canViewReports}
                  onChange={(e) => setForm({ ...form, canViewReports: e.target.checked, canDownloadReports: e.target.checked && form.canDownloadReports })} />
                Can view reports
              </label>
              <label style={{ display: "flex", gap: 10 }}>
                <input type="checkbox" checked={form.canDownloadReports && form.canViewReports} disabled={!form.canViewReports}
                  onChange={(e) => setForm({ ...form, canDownloadReports: e.target.checked })} />
                Can download reports
              </label>

              {error && <p className="employee-form-error" role="alert">{error}</p>}
              <div className="employee-modal-actions">
                <button type="button" className="employee-secondary-btn" onClick={close}>Cancel</button>
                <button type="submit" className="employee-primary-btn" disabled={saving}>
                  {saving ? "Saving…" : modal === "add" ? "Add doctor" : "Save changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {modal === "remove" && selected && (
        <div className="employee-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <section className="employee-modal employee-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="doc-remove-title">
            <h2 id="doc-remove-title">Remove doctor access?</h2>
            <p>Remove <strong>{selected.name}</strong>? They will no longer be able to sign in.</p>
            <div className="employee-modal-actions">
              <button type="button" className="employee-secondary-btn" onClick={close}>Cancel</button>
              <button type="button" className="employee-danger-btn" disabled={saving} onClick={confirmRemove}>
                {saving ? "Removing…" : "Remove access"}
              </button>
            </div>
          </section>
        </div>
      )}

      <Toast message={toast} onClose={() => setToast("")} />
    </PageShell>
  );
}