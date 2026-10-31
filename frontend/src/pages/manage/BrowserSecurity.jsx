import { useEffect, useMemo, useState } from "react";
import { manageApiService } from "../../api";
import { authApi } from "../../api/core/apiAuth";
import "./manage.css";

/** Redirects to /login on 401. Returns true when it did. */
function handleAuthError(err) {
  if (err?.status === 401) {
    window.location.assign("/login");
    return true;
  }
  return false;
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 20 6v5.5c0 4.8-3.3 7.7-8 9.5-4.7-1.8-8-4.7-8-9.5V6l8-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BrowserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="4"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 21h8m-4-4v4M3 9h18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="6" cy="6.5" r=".7" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle
        cx="10.8"
        cy="10.8"
        r="6.8"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Pulls a rough "Chrome on Windows"-style label out of a User-Agent string. */
function parseUserAgent(ua) {
  if (!ua) return { browser: "Unknown browser", os: "Unknown device" };

  const osMatch =
    ua.match(/Windows NT [\d.]+/) ||
    ua.match(/Mac OS X [\d_.]+/) ||
    ua.match(/Android [\d.]+/) ||
    ua.match(/(?:iPhone|iPad)[^)]*OS [\d_]+/) ||
    ua.match(/Linux/);

  const os = osMatch
    ? osMatch[0].replace(/_/g, ".").replace("NT ", "").replace("Mac OS X", "macOS")
    : "Unknown device";

  let browser = "Unknown browser";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\//.test(ua)) browser = "Opera";
  else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua) && /Version\//.test(ua)) browser = "Safari";

  return { browser, os };
}

function formatDate(iso) {
  if (!iso) return "Not available";
  return new Date(iso).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Loads the signed-in user once. Sessions are available to any signed-in user, no admin check. */
function useManageSession() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authApi.isLoggedIn()) {
      window.location.assign("/login");
      return;
    }
    authApi
      .me()
      .catch(handleAuthError)
      .finally(() => setLoading(false));
  }, []);

  return { loading };
}

export default function BrowserSecurity() {
  const { loading: sessionLoading } = useManageSession();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [signingOutOthers, setSigningOutOthers] = useState(false);

  const load = () => {
    setLoading(true);
    setLoadError("");
    manageApiService.sessions
      .list()
      .then(setSessions)
      .catch((err) => handleAuthError(err) || setLoadError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (sessionLoading) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionLoading]);

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();

    return sessions
      .map((session) => ({ ...session, ...parseUserAgent(session.userAgent) }))
      .filter((session) => {
        const matchesSearch =
          !query ||
          session.browser.toLowerCase().includes(query) ||
          session.os.toLowerCase().includes(query) ||
          (session.ipAddress ?? "").toLowerCase().includes(query);

        const matchesFilter = filter === "all" || (filter === "current" && session.current);

        return matchesSearch && matchesFilter;
      });
  }, [sessions, q, filter]);

  const currentCount = sessions.filter((session) => session.current).length;
  const otherCount = sessions.length - currentCount;

  const signOutSession = async (session) => {
    if (session.current) {
      setNotice("Your current browser cannot be signed out from this screen.");
      return;
    }

    setBusyId(session.id);
    try {
      await manageApiService.sessions.remove(session.id);
      setSessions((previous) => previous.filter((item) => item.id !== session.id));
      setNotice("Browser signed out successfully.");
    } catch (err) {
      if (!handleAuthError(err)) setNotice(err.message || "Could not sign out that browser.");
    } finally {
      setBusyId(null);
    }
  };

  const signOutOthers = async () => {
    setSigningOutOthers(true);
    try {
      const revoked = await manageApiService.sessions.removeOthers();
      setSessions((previous) => previous.filter((session) => session.current));
      setNotice(
        revoked
          ? `Signed out ${revoked} other browser${revoked === 1 ? "" : "s"}.`
          : "No other browsers were signed in."
      );
    } catch (err) {
      if (!handleAuthError(err)) setNotice(err.message || "Could not sign out other browsers.");
    } finally {
      setSigningOutOthers(false);
    }
  };

  const resetFilters = () => {
    setQ("");
    setFilter("all");
  };

  if (sessionLoading) return null;

  return (
    <main className="manage-page">
      <nav className="manage-breadcrumb" aria-label="Breadcrumb">
        <span>Dashboard</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-active">Manage browsers</span>
      </nav>

      <section className="manage-page-heading">
        <div>
          <div className="manage-eyebrow">ACCESS CONTROL</div>
          <h1>
            Browser security
            <span className="beta">BETA</span>
          </h1>
          <p className="manage-subtitle">
            Review where you're signed in and sign out browsers you don't recognize.
          </p>
        </div>

        <div className="manage-heading-icon">
          <ShieldIcon />
        </div>
      </section>

      <section className="security-card security-enabled">
        <div className="security-card-top">
          <div className="security-card-identity">
            <div className="security-shield">
              <ShieldIcon />
            </div>

            <div>
              <div className="security-card-label">LABORATORY PROTECTION</div>
              <h2>Sign out other browsers</h2>
              <p>
                If you don't recognize a browser below, sign out everywhere else and
                change your password from My account.
              </p>
            </div>
          </div>
        </div>

        <div className="security-card-bottom">
          <div className="security-helper">
            <span className="security-info-icon">i</span>
            {otherCount > 0
              ? `You're signed in on ${otherCount} other browser${otherCount === 1 ? "" : "s"} besides this one.`
              : "This is the only browser you're currently signed in on."}
          </div>

          <button
            type="button"
            className="security-toggle"
            onClick={signOutOthers}
            disabled={signingOutOthers || otherCount === 0}
          >
            <span>{signingOutOthers ? "Signing out..." : "Sign out other browsers"}</span>
          </button>
        </div>
      </section>

      <section className="browser-stats" aria-label="Browser statistics">
        <article className="browser-stat">
          <div className="browser-stat-icon stat-total">
            <BrowserIcon />
          </div>
          <div>
            <span className="browser-stat-label">Active sessions</span>
            <strong>{sessions.length}</strong>
            <small>Signed-in browsers</small>
          </div>
        </article>

        <article className="browser-stat">
          <div className="browser-stat-icon stat-allowed">
            <span>✓</span>
          </div>
          <div>
            <span className="browser-stat-label">This browser</span>
            <strong>{currentCount}</strong>
            <small>Current session</small>
          </div>
        </article>

        <article className="browser-stat">
          <div className="browser-stat-icon stat-blocked">
            <span>⊘</span>
          </div>
          <div>
            <span className="browser-stat-label">Other browsers</span>
            <strong>{otherCount}</strong>
            <small>Can be signed out</small>
          </div>
        </article>
      </section>

      <section className="browser-section">
        <div className="browser-section-heading">
          <div>
            <h2>All browsers</h2>
            <p>Review your signed-in sessions and sign out ones you don't recognize.</p>
          </div>

          <span className="browser-count">
            {rows.length} {rows.length === 1 ? "browser" : "browsers"}
          </span>
        </div>

        <div className="manage-toolbar">
          <label className="manage-search">
            <SearchIcon />

            <input
              type="search"
              placeholder="Search by browser, device or IP address..."
              value={q}
              onChange={(event) => setQ(event.target.value)}
              aria-label="Search browsers"
            />

            {q && (
              <button
                type="button"
                className="manage-clear-search"
                onClick={() => setQ("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>

          <label className="manage-filter">
            <span>Filter</span>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter browsers"
            >
              <option value="all">All browsers</option>
              <option value="current">Current browser</option>
            </select>
          </label>
        </div>

        {notice && (
          <div className="manage-notice" role="status">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {loadError && (
          <div className="manage-notice" role="alert">
            <span>{loadError}</span>
            <button type="button" onClick={load}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="browser-empty">
            <p role="status">Loading your sessions...</p>
          </div>
        ) : rows.length > 0 ? (
          <div className="browser-grid">
            {rows.map((session) => (
              <article
                className={`browser-card ${session.current ? "is-allowed" : ""}`}
                key={session.id}
              >
                <div className="browser-card-top">
                  <div className="browser-avatar">
                    <BrowserIcon />
                  </div>

                  <div className="browser-card-title">
                    <h3>{session.browser}</h3>
                    <span className="browser-record-id">{session.os}</span>
                  </div>

                  {session.current && (
                    <span className="browser-status-tag tag-allowed">
                      <span />
                      Current
                    </span>
                  )}
                </div>

                <div className="browser-card-divider" />

                <div className="browser-detail">
                  <span>Last active</span>
                  <strong>{formatDate(session.lastSeenAt)}</strong>
                </div>

                <div className="browser-detail">
                  <span>Signed in</span>
                  <strong>{formatDate(session.createdAt)}</strong>
                </div>

                <div className="browser-detail browser-code-row">
                  <span>IP address</span>
                  <code>{session.ipAddress || "Not available"}</code>
                </div>

                {session.current && (
                  <div className="current-browser-note">
                    <span className="current-browser-dot" />
                    This is your current browser
                  </div>
                )}

                <div className="browser-card-footer">
                  <span className="browser-access-label">
                    {session.current ? "This device" : "Signed in"}
                  </span>

                  <button
                    type="button"
                    className="browser-action action-block"
                    onClick={() => signOutSession(session)}
                    disabled={session.current || busyId === session.id}
                  >
                    <span aria-hidden="true">⊘</span>
                    {busyId === session.id ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="browser-empty">
            <div className="browser-empty-icon">
              <SearchIcon />
            </div>
            <h3>No browsers found</h3>
            <p>
              Try a different search term or change the selected filter.
            </p>
            <button
              type="button"
              className="manage-reset-button"
              onClick={resetFilters}
            >
              Clear search and filters
            </button>
          </div>
        )}

        <div className="browser-list-footer">
          Showing <strong>{rows.length}</strong> of{" "}
          <strong>{sessions.length}</strong> browser records
        </div>
      </section>
    </main>
  );
}