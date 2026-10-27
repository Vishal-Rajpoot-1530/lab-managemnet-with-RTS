import { useEffect, useState } from "react";
import { manageApiService } from "../../api";

import "./manage.css";

// ---- Page helpers (kept in this file so no extra shared file is needed) ----
/** Redirects to /login on 401. Returns true when it did. */
function handleAuthError(err) {
  if (err?.status === 401) {
    window.location.assign("/login");
    return true;
  }
  return false;
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
// ---------------------------------------------------------------------------

const OPTIONS = [
  { key: "reportReady", title: "Report ready", text: "Email me when a patient's report is ready." },
  { key: "billingUpdates", title: "Billing updates", text: "Receipts, payment reminders and plan changes." },
  { key: "dailySummary", title: "Daily summary", text: "A short summary of the day's bills and reports." },
  { key: "securityAlerts", title: "Security alerts", text: "New sign-ins and password changes. Always on.", locked: true },
  { key: "productAnnouncements", title: "Product announcements", text: "News about new LabLIMS features." },
];

export default function EmailPreferences() {
  const [prefs, setPrefs] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useToast();

  useEffect(() => {
    manageApiService.emailPreferences
      .get()
      .then(setPrefs)
      .catch((err) => handleAuthError(err) || setError(err.message));
  }, []);

  async function save(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      setPrefs(await manageApiService.emailPreferences.save(prefs));
      setToast("Email preferences saved.");
    } catch (err) {
      if (!handleAuthError(err)) setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!prefs && !error) {
    return <PageShell title="Email preferences"><p role="status">Loading…</p></PageShell>;
  }

  return (
    <PageShell title="Email preferences" description="Choose which emails you receive. These settings apply to your account only.">
      <section className="employee-directory" style={{ padding: 24 }}>
        {prefs && (
          <form onSubmit={save}>
            {OPTIONS.map(({ key, title, text, locked }) => (
              <label key={key} htmlFor={`pref-${key}`}
                style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 0", borderBottom: "1px solid rgba(128,128,128,.2)", cursor: locked ? "default" : "pointer" }}>
                <input id={`pref-${key}`} type="checkbox" checked={!!prefs[key]} disabled={locked || saving}
                  onChange={(e) => setPrefs({ ...prefs, [key]: e.target.checked })} style={{ marginTop: 4, width: 18, height: 18 }} />
                <span>
                  <strong>{title}</strong>
                  <span style={{ display: "block", opacity: 0.7, fontSize: 14 }}>{text}</span>
                </span>
              </label>
            ))}
            {error && <p className="employee-form-error" role="alert">{error}</p>}
            <div className="employee-modal-actions">
              <button type="submit" className="employee-primary-btn" disabled={saving}>{saving ? "Saving…" : "Save preferences"}</button>
            </div>
          </form>
        )}
        {!prefs && error && <p className="employee-form-error" role="alert">{error}</p>}
      </section>
      <Toast message={toast} onClose={() => setToast("")} />
    </PageShell>
  );
}