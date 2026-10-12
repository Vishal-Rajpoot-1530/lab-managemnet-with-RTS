
import { useMemo, useState } from "react";
import "./manage.css";

const initial = [
  { id: 1, name: "LAB OWNER", last: "21 Sep 2026, 7:36 PM", code: "131D", blocked: true },
  { id: 2, name: "LAB OWNER", last: "21 Sep 2026, 1:07 PM", code: "D0F2", blocked: true },
  { id: 3, name: "LAB OWNER", last: "21 Sep 2026, 6:39 PM", code: "53D8", blocked: true, current: true },
  { id: 4, name: "LAB OWNER", last: "21 Sep 2026, 4:15 PM", code: "EEB4", blocked: true },
  { id: 5, name: "LAB OWNER", last: "20 Sep 2026, 1:55 PM", code: "D908", blocked: true },
  { id: 6, name: "LAB OWNER", last: "18 Sep 2026, 5:21 PM", code: "BDF4", blocked: true },
  { id: 7, name: "LAB OWNER", last: "Not available", code: "0315", blocked: false },
  { id: 8, name: "LAB OWNER", last: "Not available", code: "3B60", blocked: false },
];

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

export default function BrowserSecurity() {
  const [items, setItems] = useState(initial);
  const [q, setQ] = useState("");
  const [security, setSecurity] = useState(true);
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState("");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.last.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "blocked" && item.blocked) ||
        (filter === "allowed" && !item.blocked) ||
        (filter === "current" && item.current);

      return matchesSearch && matchesFilter;
    });
  }, [items, q, filter]);

  const blockedCount = items.filter((item) => item.blocked).length;
  const allowedCount = items.length - blockedCount;

  const toggleBrowser = (id) => {
    const browser = items.find((item) => item.id === id);
    if (!browser) return;

    if (browser.current && !browser.blocked) {
      setNotice("Your current browser cannot be blocked from this screen.");
      return;
    }

    const nextBlocked = !browser.blocked;

    setItems((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, blocked: nextBlocked } : item
      )
    );

    setNotice(
      `${browser.code}: Browser ${
        nextBlocked ? "blocked" : "unblocked"
      } successfully.`
    );
  };

  const handleSecurityToggle = () => {
    const next = !security;
    setSecurity(next);
    setNotice(
      `Browser security ${next ? "enabled" : "disabled"} locally.`
    );
  };

  const resetFilters = () => {
    setQ("");
    setFilter("all");
  };

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
            Manage browser access and monitor laboratory workstations.
          </p>
        </div>

        <div className="manage-heading-icon">
          <ShieldIcon />
        </div>
      </section>

      <section
        className={`security-card ${
          security ? "security-enabled" : "security-disabled"
        }`}
      >
        <div className="security-card-top">
          <div className="security-card-identity">
            <div className="security-shield">
              <ShieldIcon />
            </div>

            <div>
              <div className="security-card-label">
                LABORATORY PROTECTION
              </div>
              <h2>Control browser access</h2>
              <p>
                Manage which browsers are permitted to access your
                laboratory workspace.
              </p>
            </div>
          </div>

          <div className="security-status">
            <span className="security-status-dot" />
            <span>
              {security ? "Protection enabled" : "Protection disabled"}
            </span>
          </div>
        </div>

        <div className="security-card-bottom">
          <div className="security-helper">
            <span className="security-info-icon">i</span>
            {security
              ? "Browser protection is marked as enabled."
              : "Browser protection is currently marked as disabled."}
          </div>

          <button
            type="button"
            className={`security-toggle ${security ? "is-on" : ""}`}
            role="switch"
            aria-checked={security}
            onClick={handleSecurityToggle}
          >
            <span className="security-toggle-knob" />
            <span>{security ? "Turn off" : "Turn on"}</span>
          </button>
        </div>
      </section>

      <section className="browser-stats" aria-label="Browser statistics">
        <article className="browser-stat">
          <div className="browser-stat-icon stat-total">
            <BrowserIcon />
          </div>
          <div>
            <span className="browser-stat-label">Total browsers</span>
            <strong>{items.length}</strong>
            <small>Registered records</small>
          </div>
        </article>

        <article className="browser-stat">
          <div className="browser-stat-icon stat-blocked">
            <span>⊘</span>
          </div>
          <div>
            <span className="browser-stat-label">Blocked browsers</span>
            <strong>{blockedCount}</strong>
            <small>Marked as blocked</small>
          </div>
        </article>

        <article className="browser-stat">
          <div className="browser-stat-icon stat-allowed">
            <span>✓</span>
          </div>
          <div>
            <span className="browser-stat-label">Allowed browsers</span>
            <strong>{allowedCount}</strong>
            <small>Not marked as blocked</small>
          </div>
        </article>
      </section>

      <section className="browser-section">
        <div className="browser-section-heading">
          <div>
            <h2>All browsers</h2>
            <p>
              Review browser records and manage access permissions.
            </p>
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
              placeholder="Search by browser code, name or last login..."
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
              <option value="blocked">Blocked</option>
              <option value="allowed">Allowed</option>
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

        {rows.length > 0 ? (
          <div className="browser-grid">
            {rows.map((browser) => (
              <article
                className={`browser-card ${
                  browser.blocked ? "is-blocked" : "is-allowed"
                }`}
                key={browser.id}
              >
                <div className="browser-card-top">
                  <div className="browser-avatar">
                    <BrowserIcon />
                  </div>

                  <div className="browser-card-title">
                    <h3>{browser.name}</h3>
                    <span className="browser-record-id">
                      Browser record #{browser.id}
                    </span>
                  </div>

                  <span
                    className={`browser-status-tag ${
                      browser.blocked ? "tag-blocked" : "tag-allowed"
                    }`}
                  >
                    <span />
                    {browser.blocked ? "Blocked" : "Allowed"}
                  </span>
                </div>

                <div className="browser-card-divider" />

                <div className="browser-detail">
                  <span>Last login</span>
                  <strong>{browser.last}</strong>
                </div>

                <div className="browser-detail browser-code-row">
                  <span>Browser code</span>
                  <code>{browser.code}</code>
                </div>

                {browser.current && (
                  <div className="current-browser-note">
                    <span className="current-browser-dot" />
                    This is your current browser
                  </div>
                )}

                <div className="browser-card-footer">
                  <span className="browser-access-label">
                    {browser.blocked
                      ? "Access restricted"
                      : "Access permitted"}
                  </span>

                  <button
                    type="button"
                    className={`browser-action ${
                      browser.blocked ? "action-unblock" : "action-block"
                    }`}
                    onClick={() => toggleBrowser(browser.id)}
                    disabled={browser.current && !browser.blocked}
                  >
                    <span aria-hidden="true">
                      {browser.blocked ? "↗" : "⊘"}
                    </span>
                    {browser.blocked ? "Unblock" : "Block"}
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
          <strong>{items.length}</strong> browser records
        </div>
      </section>
    </main>
  );
}
