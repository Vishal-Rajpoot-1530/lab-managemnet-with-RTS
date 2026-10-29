import { useCallback, useEffect, useState } from "react";
import { superAdminApiService } from "../../api";
import "./AdminAccess.css";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";

function generatePassword(length = 14) {
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, (v) => ALPHABET[v % ALPHABET.length]).join("");
}

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Never";

const EMPTY_FORM = { adminName: "", labName: "", email: "", password: "" };

/* ------------------------------------------------------------------ */
/*  Sign in                                                            */
/* ------------------------------------------------------------------ */
function SuperAdminSignIn({ onDone }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      onDone(await superAdminApiService.login(email, password));
    } catch (err) {
      setError(err.message || "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="aa-page aa-center">
      <section className="aa-card narrow">
        <div className="aa-eyebrow">PLATFORM</div>
        <h1 className="aa-title">Super admin sign in</h1>
        <p className="aa-sub">Create and manage the lab admin accounts.</p>

        <form className="aa-form" onSubmit={submit}>
          <label className="aa-field">
            Email address
            <input className="aa-input" type="email" autoComplete="username" value={email}
              onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </label>
          <label className="aa-field">
            Password
            <input className="aa-input" type="password" autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <p className="aa-error" role="alert">{error}</p>}
          <button type="submit" className="aa-btn primary" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Panel                                                              */
/* ------------------------------------------------------------------ */
export default function SuperAdminPanel() {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(superAdminApiService.isLoggedIn());

  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(null); // credentials, shown once

  const [modal, setModal] = useState(null); // { type: "reset" | "remove", lab }
  const [newPassword, setNewPassword] = useState("");
  const [modalError, setModalError] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const signOut = useCallback(() => {
    superAdminApiService.logout();
    setAdmin(null);
    setLabs([]);
  }, []);

  const handleError = useCallback(
    (err, setter = setToast) => {
      if (err.status === 401) return signOut();
      setter(err.message || "Something went wrong.");
    },
    [signOut]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setLabs(await superAdminApiService.tenants.list());
    } catch (err) {
      handleError(err, setLoadError);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Restore an existing sign-in.
  useEffect(() => {
    if (!superAdminApiService.isLoggedIn()) return;
    superAdminApiService
      .me()
      .then(setAdmin)
      .catch(() => superAdminApiService.logout())
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (admin) load();
  }, [admin, load]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function createLab(event) {
    event.preventDefault();
    setFormError("");
    setCreated(null);

    if (!form.adminName.trim() || !form.labName.trim() || !form.email.trim()) {
      return setFormError("Please fill in the admin name, lab name and email.");
    }
    if (form.password.length < 8) return setFormError("Password must be at least 8 characters.");

    setCreating(true);
    try {
      const lab = await superAdminApiService.tenants.create({
        adminName: form.adminName.trim(),
        labName: form.labName.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setLabs((current) => [lab, ...current]);
      setCreated({ email: lab.adminEmail, password: form.password, lab: lab.labName });
      setForm(EMPTY_FORM);
    } catch (err) {
      handleError(err, setFormError);
    } finally {
      setCreating(false);
    }
  }

  async function copyCredentials() {
    const text = `Lab: ${created.lab}\nAdmin login page: ${window.location.origin}/admin-login\nEmail: ${created.email}\nPassword: ${created.password}`;
    try {
      await navigator.clipboard.writeText(text);
      setToast("Credentials copied.");
    } catch {
      setToast("Copy failed. Select the text and copy it manually.");
    }
  }

  async function toggleActive(lab) {
    try {
      const updated = await superAdminApiService.tenants.update(lab.id, { active: !lab.active });
      setLabs((current) => current.map((l) => (l.id === updated.id ? updated : l)));
      setToast(updated.active ? `${updated.labName} is active again.` : `${updated.labName} has been disabled.`);
    } catch (err) {
      handleError(err);
    }
  }

  async function submitModal(event) {
    event?.preventDefault();
    setModalError("");

    if (modal.type === "reset" && newPassword.length < 8) {
      return setModalError("Password must be at least 8 characters.");
    }

    setBusy(true);
    try {
      if (modal.type === "reset") {
        await superAdminApiService.tenants.update(modal.lab.id, { password: newPassword });
        setCreated({ email: modal.lab.adminEmail, password: newPassword, lab: modal.lab.labName });
        setToast("Password reset.");
      } else {
        await superAdminApiService.tenants.remove(modal.lab.id);
        setLabs((current) => current.filter((l) => l.id !== modal.lab.id));
        setToast("Lab account removed.");
      }
      setModal(null);
      setNewPassword("");
    } catch (err) {
      handleError(err, setModalError);
    } finally {
      setBusy(false);
    }
  }

  if (checking) return <main className="aa-page aa-center"><p role="status">Loading…</p></main>;
  if (!admin) return <SuperAdminSignIn onDone={(a) => { setAdmin(a); setChecking(false); }} />;

  const connected = labs.filter((l) => l.connected).length;
  const disabled = labs.filter((l) => !l.active).length;

  return (
    <main className="aa-page">
      <div className="aa-wrap">
        <header className="aa-header">
          <div>
            <div className="aa-eyebrow">PLATFORM</div>
            <h1 className="aa-title">Super admin panel</h1>
            <p className="aa-sub" style={{ marginBottom: 0 }}>
              Create lab admin accounts and hand them their sign-in details. Signed in as {admin.email}.
            </p>
          </div>
          <button type="button" className="aa-btn" onClick={signOut}>Sign out</button>
        </header>

        <section className="aa-stats">
          <div className="aa-stat"><span>Lab accounts</span><strong>{labs.length}</strong></div>
          <div className="aa-stat"><span>Database connected</span><strong>{connected}</strong></div>
          <div className="aa-stat"><span>Disabled</span><strong>{disabled}</strong></div>
        </section>

        <section className="aa-card">
          <h2 className="aa-title" style={{ fontSize: 18 }}>Create an admin account</h2>
          <p className="aa-sub">
            The admin signs in on the Admin login page with this email and password, then connects their own database.
          </p>

          <form className="aa-form" onSubmit={createLab}>
            <div className="aa-grid">
              <label className="aa-field">
                Admin name
                <input className="aa-input" value={form.adminName} maxLength={255}
                  onChange={(e) => setForm({ ...form, adminName: e.target.value })} required />
              </label>
              <label className="aa-field">
                Lab name
                <input className="aa-input" value={form.labName} maxLength={255}
                  onChange={(e) => setForm({ ...form, labName: e.target.value })} required />
              </label>
              <label className="aa-field">
                Admin email
                <input className="aa-input" type="email" autoComplete="off" value={form.email} maxLength={190}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </label>
              <label className="aa-field">
                Password
                <span className="aa-row">
                  <input className="aa-input" type="text" autoComplete="off" value={form.password} maxLength={72}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                  <button type="button" className="aa-btn" onClick={() => setForm({ ...form, password: generatePassword() })}>
                    Generate
                  </button>
                </span>
              </label>
            </div>

            {formError && <p className="aa-error" role="alert">{formError}</p>}

            <div>
              <button type="submit" className="aa-btn primary" disabled={creating}>
                {creating ? "Creating…" : "Create admin account"}
              </button>
            </div>
          </form>

          {created && (
            <div className="aa-credentials" style={{ marginTop: 20 }} role="status">
              <strong>Share these sign-in details with the admin for {created.lab}</strong>
              <span>Admin login page: <code>{window.location.origin}/admin-login</code></span>
              <span>Email: <code>{created.email}</code></span>
              <span>Password: <code>{created.password}</code></span>
              <small style={{ color: "#6b7280" }}>The password is shown only now. It is stored hashed and cannot be shown again.</small>
              <div className="aa-actions">
                <button type="button" className="aa-btn small" onClick={copyCredentials}>Copy</button>
                <button type="button" className="aa-btn small" onClick={() => setCreated(null)}>Hide</button>
              </div>
            </div>
          )}
        </section>

        <section className="aa-card">
          <div className="aa-header" style={{ marginBottom: 20 }}>
            <div>
              <h2 className="aa-title" style={{ fontSize: 18 }}>Lab accounts</h2>
              <p className="aa-sub" style={{ marginBottom: 0 }}>Each lab keeps its data in its own database.</p>
            </div>
            <button type="button" className="aa-btn small" onClick={load} disabled={loading}>
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>

          {loadError && <p className="aa-error" role="alert">{loadError}</p>}

          <div className="aa-table-wrap">
            <table className="aa-table">
              <thead>
                <tr>
                  <th>LAB</th>
                  <th>ADMIN</th>
                  <th>DATABASE</th>
                  <th>STATUS</th>
                  <th>LAST SIGN-IN</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {labs.map((lab) => (
                  <tr key={lab.id}>
                    <td><strong>{lab.labName}</strong><small>Created {formatDate(lab.createdAt)}</small></td>
                    <td>{lab.adminName}<small>{lab.adminEmail}</small></td>
                    <td>
                      {lab.connected ? (
                        <><span className="aa-badge ok">Connected</span><small>{lab.dbHost}</small></>
                      ) : (
                        <span className="aa-badge warn">Not connected yet</span>
                      )}
                    </td>
                    <td>
                      <span className={`aa-badge ${lab.active ? "ok" : "off"}`}>{lab.active ? "Active" : "Disabled"}</span>
                    </td>
                    <td>{formatDate(lab.lastLoginAt)}</td>
                    <td>
                      <div className="aa-actions">
                        <button type="button" className="aa-btn small"
                          onClick={() => { setModal({ type: "reset", lab }); setNewPassword(generatePassword()); setModalError(""); }}>
                          Reset password
                        </button>
                        <button type="button" className="aa-btn small" onClick={() => toggleActive(lab)}>
                          {lab.active ? "Disable" : "Enable"}
                        </button>
                        <button type="button" className="aa-btn small danger"
                          onClick={() => { setModal({ type: "remove", lab }); setModalError(""); }}>
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!labs.length && !loading && (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "#6b7280" }}>No lab accounts yet. Create the first one above.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {modal && (
        <div className="aa-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setModal(null)}>
          <form className="aa-modal" onSubmit={submitModal} role="dialog" aria-modal="true">
            {modal.type === "reset" ? (
              <>
                <h2>Reset password</h2>
                <p>Set a new password for {modal.lab.adminName} ({modal.lab.adminEmail}). It applies the next time they use the Admin login page.</p>
                <span className="aa-row">
                  <input className="aa-input" type="text" value={newPassword} maxLength={72} autoComplete="off"
                    onChange={(e) => setNewPassword(e.target.value)} aria-label="New password" />
                  <button type="button" className="aa-btn" onClick={() => setNewPassword(generatePassword())}>Generate</button>
                </span>
              </>
            ) : (
              <>
                <h2>Remove lab account?</h2>
                <p>
                  Remove <strong>{modal.lab.labName}</strong>? Its admin and employees will no longer be able to sign in.
                  The lab's own database is not deleted.
                </p>
              </>
            )}

            {modalError && <p className="aa-error" role="alert" style={{ marginTop: 12 }}>{modalError}</p>}

            <div className="aa-modal-actions">
              <button type="button" className="aa-btn" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" className={`aa-btn ${modal.type === "remove" ? "danger" : "primary"}`} disabled={busy}>
                {busy ? "Working…" : modal.type === "reset" ? "Reset password" : "Remove"}
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && <div className="aa-toast" role="status">{toast}</div>}
    </main>
  );
}