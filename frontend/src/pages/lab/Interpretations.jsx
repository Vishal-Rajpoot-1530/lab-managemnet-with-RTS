
import { useMemo, useState } from "react";
import LabTable, { Action } from "./LabTable";
import { interpretations } from "./mockData";
import "./lab.css";
import "./lab.css";

export default function Interpretations() {
  const [tab, setTab] = useState("Test");
  const [q, setQ] = useState("");

  const testCount = interpretations.filter(
    (item) => item.kind === "Test"
  ).length;

  const panelCount = interpretations.filter(
    (item) => item.kind === "Panel"
  ).length;

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();

    return interpretations.filter(
      (item) =>
        item.kind === tab &&
        (!query ||
          String(item.name || "").toLowerCase().includes(query) ||
          String(item.text || "").toLowerCase().includes(query))
    );
  }, [tab, q]);

  const cols = [
    {
      key: "id",
      label: "S. NO.",
      render: (value) => (
        <span className="int-number">
          {String(value ?? "—").padStart(2, "0")}
        </span>
      ),
    },
    {
      key: "name",
      label: "NAME",
      render: (value) => (
        <div className="int-name-cell">
          <span className="int-name-icon" aria-hidden="true">
            {tab === "Test" ? "T" : "P"}
          </span>
          <span className="int-name">{value || "Untitled"}</span>
        </div>
      ),
    },
    {
      key: "text",
      label: "INTERPRETATION",
      render: (value) => (
        <span className="lab-strong int-description">
          {value || "No interpretation available"}
        </span>
      ),
    },
    {
      key: "action",
      label: "ACTIONS",
      render: (_, row) => (
        <div className="int-actions">
          <button
            type="button"
            className="int-view-button"
            onClick={() =>
              window.alert(
                `${row.name}\n\n${row.text || "No interpretation available"}`
              )
            }
          >
            View all
          </button>
          <span className="int-action-divider" />
          <Action
            onClick={() =>
              window.alert(
                "Connect this action to your interpretation editor."
              )
            }
          >
            Edit
          </Action>
        </div>
      ),
    },
  ];

  return (
    <main className="lab-page int-page">
      <header className="int-header">
        <div>
          <div className="int-breadcrumb">
            <span>Laboratory</span>
            <span>/</span>
            <span>Test configuration</span>
          </div>

          <h1>Interpretations</h1>
          <p className="int-subtitle">
            Manage interpretation text for tests and panels.
          </p>
        </div>

        <button
          type="button"
          className="lab-btn primary int-add-button"
          onClick={() =>
            window.alert(
              "Connect this action to your add interpretation form."
            )
          }
        >
          <span aria-hidden="true">＋</span>
          Add new
        </button>
      </header>

      <section className="int-summary">
        <div className="int-summary-item">
          <span className="int-summary-icon int-icon-blue">T</span>
          <div>
            <span className="int-summary-label">Test interpretations</span>
            <strong className="int-summary-value">{testCount}</strong>
            <span className="int-summary-note">
              Interpretations linked to tests
            </span>
          </div>
        </div>

        <div className="int-summary-divider" />

        <div className="int-summary-item">
          <span className="int-summary-icon int-icon-purple">P</span>
          <div>
            <span className="int-summary-label">Panel interpretations</span>
            <strong className="int-summary-value">{panelCount}</strong>
            <span className="int-summary-note">
              Interpretations linked to panels
            </span>
          </div>
        </div>
      </section>

      <div className="int-notice" role="note">
        <span className="int-notice-icon" aria-hidden="true">i</span>
        <div className="int-notice-copy">
          <strong>Keep interpretations up to date</strong>
          <span>
            You can copy interpretations from the Library to update your
            existing content.
          </span>
        </div>
        <span className="int-new-badge">NEW</span>
      </div>

      <section className="int-directory">
        <div className="int-directory-header">
          <div>
            <h2>Interpretation library</h2>
            <p>Browse and manage interpretation records.</p>
          </div>
        </div>

        <div className="int-toolbar">
          <div className="int-tabs" role="tablist" aria-label="Interpretation type">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "Test"}
              className={`int-tab ${tab === "Test" ? "active" : ""}`}
              onClick={() => setTab("Test")}
            >
              Tests
              <span className="int-count-pill">{testCount}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={tab === "Panel"}
              className={`int-tab ${tab === "Panel" ? "active" : ""}`}
              onClick={() => setTab("Panel")}
            >
              Panels
              <span className="int-count-pill">{panelCount}</span>
            </button>
          </div>

          <div className="int-search">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.2 4.2" />
            </svg>

            <input
              type="search"
              placeholder="Search interpretations"
              aria-label="Search interpretations"
              value={q}
              onChange={(event) => setQ(event.target.value)}
            />

            {q && (
              <button
                type="button"
                className="int-clear-search"
                aria-label="Clear search"
                onClick={() => setQ("")}
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="int-table-meta">
          <span className="int-status-dot" />
          Showing {rows.length} {rows.length === 1 ? "record" : "records"}
          {q.trim() ? " matching your search" : ""}
        </div>

        <div className="int-table-wrap">
          {rows.length > 0 ? (
            <LabTable columns={cols} rows={rows} />
          ) : (
            <div className="int-empty">
              <span className="int-empty-icon" aria-hidden="true">⌕</span>
              <h3>No interpretations found</h3>
              <p>
                {q.trim()
                  ? "Try another search term or clear your search."
                  : `There are no ${tab.toLowerCase()} interpretations to display.`}
              </p>
              {q.trim() && (
                <button
                  type="button"
                  className="int-clear-button"
                  onClick={() => setQ("")}
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        <footer className="int-footer">
          <span>
            Viewing <strong>{rows.length}</strong> of{" "}
            <strong>{tab === "Test" ? testCount : panelCount}</strong>{" "}
            {tab.toLowerCase()} interpretations
          </span>

          {q.trim() && (
            <button
              type="button"
              className="int-clear-button"
              onClick={() => setQ("")}
            >
              Clear filter
            </button>
          )}
        </footer>
      </section>
    </main>
  );
}
