
import { useEffect, useState } from "react";
import { referralApi } from "../../api/core/apiAuth";

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

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}
// ---------------------------------------------------------------------------

const money = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

export default function ReferralProgram() {
  const [data, setData] = useState(null);
  const [invitee, setInvitee] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useToast();

  useEffect(() => {
    referralApi
      .get()
      .then(setData)
      .catch((err) => handleAuthError(err) || setError(err.message));
  }, []);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(data.referralCode);
      setToast("Referral code copied.");
    } catch {
      setToast("Copy failed. Select the code and copy it manually.");
    }
  }

  async function sendInvite(event) {
    event.preventDefault();
    setError("");
    if (!invitee.trim()) return setError("Enter an email address or lab name.");
    setSending(true);
    try {
      setData(await referralApi.invite(invitee.trim()));
      setInvitee("");
      setToast("Invitation sent.");
    } catch (err) {
      if (!handleAuthError(err)) setError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (!data) {
    return (
      <PageShell title="Referral program">
        {error ? <p className="employee-form-error" role="alert">{error}</p> : <p role="status">Loading…</p>}
      </PageShell>
    );
  }

  return (
    <PageShell title="Referral program" description="Invite other labs and track your rewards.">
      <section className="employee-stats">
        <article className="employee-stat-card">
          <div className="employee-stat-top"><span>Your referral code</span></div>
          <strong style={{ letterSpacing: 1 }}>{data.referralCode}</strong>
          <button type="button" className="employee-secondary-btn" onClick={copyCode} style={{ marginTop: 10 }}>Copy code</button>
        </article>
        <article className="employee-stat-card">
          <div className="employee-stat-top"><span>Total referrals</span></div>
          <strong>{data.totalReferrals}</strong>
          <small>{data.successfulReferrals} joined</small>
        </article>
        <article className="employee-stat-card">
          <div className="employee-stat-top"><span>Reward balance</span></div>
          <strong>{money(data.rewardBalance)}</strong>
          <small>From joined referrals</small>
        </article>
      </section>

      <section className="employee-directory" style={{ padding: 24 }}>
        <h2>Invite a lab</h2>
        <form onSubmit={sendInvite} style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
          <input className="employee-input" style={{ flex: "1 1 260px" }} value={invitee} maxLength={190}
            onChange={(e) => setInvitee(e.target.value)} placeholder="Email address or lab name" aria-label="Invitee" />
          <button type="submit" className="employee-primary-btn" disabled={sending}>{sending ? "Sending…" : "Send invite"}</button>
        </form>
        {error && <p className="employee-form-error" role="alert">{error}</p>}
      </section>

      <section className="employee-directory">
        <div className="employee-directory-header"><div><h2>Your referrals</h2></div></div>
        <div className="employee-table-scroll">
          <table className="employee-table">
            <thead><tr><th>INVITED</th><th>STATUS</th><th>REWARD</th><th>DATE</th></tr></thead>
            <tbody>
              {data.referrals.map((r) => (
                <tr key={r.id}>
                  <td>{r.email || r.labName}</td>
                  <td style={{ textTransform: "capitalize" }}>{r.status}</td>
                  <td>{r.reward === null ? "—" : money(r.reward)}</td>
                  <td>{formatDate(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.referrals.length === 0 && (
            <div className="employee-empty">
              <h3>No referrals yet</h3>
              <p>Send an invite or share your code to get started.</p>
            </div>
          )}
        </div>
      </section>
      <Toast message={toast} onClose={() => setToast("")} />
    </PageShell>
  );
}