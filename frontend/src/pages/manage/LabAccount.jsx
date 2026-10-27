
import { useEffect, useState } from "react";
import { manageApiService } from "../../api";

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
// ---------------------------------------------------------------------------

const EMPTY_LAB = {
  labName: "", labId: "", registrationNumber: "", email: "", phone: "", address: "",
  city: "", state: "", postalCode: "", openingTime: "09:00", closingTime: "18:00",
};
const EMPTY_NEW = { labName: "", labType: "", labId: "", email: "", phone: "", address: "", city: "", state: "", postalCode: "" };

export default function LabAccount() {
  const { isAdmin, loading: sessionLoading } = useManageSession();
  const [lab, setLab] = useState(EMPTY_LAB);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useToast();

  const [newLabOpen, setNewLabOpen] = useState(false);
  const [newLab, setNewLab] = useState(EMPTY_NEW);
  const [newLabError, setNewLabError] = useState("");

  useEffect(() => {
    manageApiService.lab
      .get()
      .then((data) => setLab({ ...EMPTY_LAB, ...data }))
      .catch((err) => handleAuthError(err) || setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const set = (key) => (event) => setLab({ ...lab, [key]: event.target.value });

  async function save(event) {
    event.preventDefault();
    setError("");
    if (!lab.labName.trim()) return setError("Laboratory name is required.");
    setSaving(true);
    try {
      setLab({ ...EMPTY_LAB, ...(await manageApiService.lab.save(lab)) });
      setToast("Lab account saved.");
    } catch (err) {
      if (!handleAuthError(err)) setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function createLab(event) {
    event.preventDefault();
    setNewLabError("");
    if (!newLab.labName.trim()) return setNewLabError("Laboratory name is required.");
    setSaving(true);
    try {
      const created = await manageApiService.lab.create(newLab);
      setNewLabOpen(false);
      setNewLab(EMPTY_NEW);
      setToast(`${created.labName} was added (ID ${created.labId}).`);
    } catch (err) {
      if (!handleAuthError(err)) setNewLabError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading || sessionLoading) {
    return <PageShell title="Lab account"><p role="status">Loading lab details…</p></PageShell>;
  }

  return (
    <PageShell
      title="Lab account"
      description="These details appear on bills and reports."
      actions={
        isAdmin && (
          <button type="button" className="employee-secondary-btn" onClick={() => { setNewLab(EMPTY_NEW); setNewLabError(""); setNewLabOpen(true); }}>
            Add another laboratory
          </button>
        )
      }
    >
      <section className="employee-directory" style={{ padding: 24 }}>
        <form onSubmit={save}>
          <fieldset disabled={!isAdmin || saving} style={{ border: 0, padding: 0, margin: 0 }}>
            <div style={gridStyle}>
              <Field label="Laboratory name" id="lab-name" required>
                <input id="lab-name" className="employee-input" value={lab.labName} onChange={set("labName")} maxLength={255} required />
              </Field>
              <Field label="Lab ID" id="lab-id">
                <input id="lab-id" className="employee-input" value={lab.labId} onChange={set("labId")} maxLength={40} />
              </Field>
              <Field label="Registration number" id="lab-reg">
                <input id="lab-reg" className="employee-input" value={lab.registrationNumber} onChange={set("registrationNumber")} maxLength={80} />
              </Field>
              <Field label="Email address" id="lab-email">
                <input id="lab-email" className="employee-input" type="email" value={lab.email} onChange={set("email")} maxLength={190} />
              </Field>
              <Field label="Phone" id="lab-phone">
                <input id="lab-phone" className="employee-input" type="tel" value={lab.phone} onChange={set("phone")} maxLength={30} />
              </Field>
              <Field label="City" id="lab-city">
                <input id="lab-city" className="employee-input" value={lab.city} onChange={set("city")} maxLength={120} />
              </Field>
              <Field label="State" id="lab-state">
                <input id="lab-state" className="employee-input" value={lab.state} onChange={set("state")} maxLength={120} />
              </Field>
              <Field label="Postal code" id="lab-pin">
                <input id="lab-pin" className="employee-input" value={lab.postalCode} onChange={set("postalCode")} maxLength={12} />
              </Field>
              <Field label="Opening time" id="lab-open">
                <input id="lab-open" className="employee-input" type="time" value={lab.openingTime} onChange={set("openingTime")} />
              </Field>
              <Field label="Closing time" id="lab-close">
                <input id="lab-close" className="employee-input" type="time" value={lab.closingTime} onChange={set("closingTime")} />
              </Field>
            </div>
            <div style={{ marginTop: 16 }}>
              <Field label="Address" id="lab-address">
                <textarea id="lab-address" className="employee-input" rows={3} value={lab.address} onChange={set("address")} maxLength={5000} />
              </Field>
            </div>
          </fieldset>

          {error && <p className="employee-form-error" role="alert">{error}</p>}
          {!isAdmin && <p className="employee-form-hint">Only an administrator can change lab details.</p>}

          {isAdmin && (
            <div className="employee-modal-actions">
              <button type="submit" className="employee-primary-btn" disabled={saving}>
                {saving ? "Saving…" : "Save lab account"}
              </button>
            </div>
          )}
        </form>
      </section>

      {newLabOpen && (
        <div className="employee-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setNewLabOpen(false)}>
          <section className="employee-modal" role="dialog" aria-modal="true" aria-labelledby="new-lab-title">
            <h2 id="new-lab-title">Add another laboratory</h2>
            <p className="employee-modal-description">Adds a new lab or collection centre to this account.</p>
            <form onSubmit={createLab}>
              {[
                ["labName", "Laboratory name", true, "text"],
                ["labType", "Laboratory type", false, "text"],
                ["labId", "Lab ID (optional)", false, "text"],
                ["email", "Email address", false, "email"],
                ["phone", "Phone", false, "tel"],
                ["address", "Address", false, "text"],
                ["city", "City", false, "text"],
                ["state", "State", false, "text"],
                ["postalCode", "Postal code", false, "text"],
              ].map(([key, label, required, type]) => (
                <Field key={key} label={label} id={`new-${key}`} required={required}>
                  <input id={`new-${key}`} className="employee-input" type={type} value={newLab[key]} required={required}
                    onChange={(e) => setNewLab({ ...newLab, [key]: e.target.value })} />
                </Field>
              ))}
              {newLabError && <p className="employee-form-error" role="alert">{newLabError}</p>}
              <div className="employee-modal-actions">
                <button type="button" className="employee-secondary-btn" onClick={() => setNewLabOpen(false)}>Cancel</button>
                <button type="submit" className="employee-primary-btn" disabled={saving}>{saving ? "Adding…" : "Add laboratory"}</button>
              </div>
            </form>
          </section>
        </div>
      )}

      <Toast message={toast} onClose={() => setToast("")} />
    </PageShell>
  );
}