import { useState } from "react";
import { authApi } from "../../api/core/apiAuth";
import "./AdminAccess.css";

/** Lab admin sign-in: email + password + the lab's own database URL. */
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [showSecrets, setShowSecrets] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) return setError("Enter your email and password.");

    setBusy(true);
    try {
      await authApi.adminLogin(email, password, databaseUrl);
      window.location.assign("/"); // reload so every page starts with the new session
    } catch (err) {
      setError(err.message || "Could not sign in. Please try again.");
      setBusy(false);
    }
  }

  return (
    <main className="aa-page aa-center">
      <section className="aa-card narrow">
        <div className="aa-eyebrow">LAB ADMIN</div>
        <h1 className="aa-title">Admin sign in</h1>
        <p className="aa-sub">
          Sign in with the email and password you received, and connect your lab's own database.
        </p>

        <form className="aa-form" onSubmit={submit}>
          <label className="aa-field">
            Email address
            <input className="aa-input" type="email" autoComplete="username" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="admin@yourlab.com" required autoFocus />
          </label>

          <label className="aa-field">
            Password
            <input className="aa-input" type={showSecrets ? "text" : "password"} autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          <label className="aa-field">
            Database URL
            <input className="aa-input" type={showSecrets ? "text" : "password"} autoComplete="off" spellCheck="false"
              value={databaseUrl} onChange={(e) => setDatabaseUrl(e.target.value)}
              placeholder="mysql://user:password@host:3306/database" />
            <small>
              Needed the first time, to connect your lab. After that you can leave it blank and your saved
              connection is used. An empty database is set up automatically.
            </small>
          </label>

          <label style={{ display: "flex", gap: 8, fontSize: 13, alignItems: "center" }}>
            <input type="checkbox" checked={showSecrets} onChange={(e) => setShowSecrets(e.target.checked)} />
            Show password and database URL
          </label>

          {error && <p className="aa-error" role="alert">{error}</p>}

          <button type="submit" className="aa-btn primary" disabled={busy}>
            {busy ? "Connecting…" : "Connect and sign in"}
          </button>

          <p className="aa-note">
            Employees do not use this page. They sign in on the normal login page with their own email and password.
          </p>
        </form>
      </section>
    </main>
  );
}