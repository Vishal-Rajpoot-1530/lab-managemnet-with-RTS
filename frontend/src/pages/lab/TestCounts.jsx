
import { useMemo, useState } from "react";
import LabTable from "./LabTable";
import { counts } from "./mockData";
import "./lab.css";


export default function TestCounts() {
  const [q, setQ] = useState("");
  const [startDate, setStartDate] = useState("2026-09-21");
  const [endDate, setEndDate] = useState("2026-09-21");
  const [appliedDates, setAppliedDates] = useState({
    start: "2026-09-21",
    end: "2026-09-21",
  });

  const rows = useMemo(
    () =>
      counts.filter(
        (x) =>
          !q ||
          String(x.name ?? "").toLowerCase().includes(q.toLowerCase()) ||
          String(x.id ?? "").toLowerCase().includes(q.toLowerCase()) ||
          String(x.count ?? "").toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );

  const totalCount = rows.reduce(
    (sum, row) => sum + (Number(row.count) || 0),
    0
  );

  const cols = [
    { key: "id", label: "S. NO." },
    {
      key: "name",
      label: "BILL ENTRY",
      render: (value) => <span className="tc-name">{value}</span>,
    },
    {
      key: "count",
      label: "COUNT",
      render: (value) => <span className="tc-count">{value}</span>,
    },
  ];

  function handleShow() {
    setAppliedDates({ start: startDate, end: endDate });
  }

  return (
    <div className="lab-page tc-page">
      <div className="tc-heading">
        <div>
          <div className="tc-eyebrow">REPORTS / ANALYTICS</div>
          <h1>Test counts</h1>
          <p className="tc-subtitle">
            Review bill entries and their test counts for a selected period.
          </p>
        </div>
        <div className="tc-heading-icon" aria-hidden="true">
          ▤
        </div>
      </div>

      <div className="lab-notice tc-notice">
        <span className="tc-notice-icon">ⓘ</span>
        <div>
          <strong>Preview feature</strong>
          <p>
            This feature is currently available for preview only. Upgrade
            options may be available in the future.
          </p>
        </div>
        <span className="tc-preview-badge">PREVIEW</span>
      </div>

      <div className="tc-summary-grid">
        <div className="tc-summary-card">
          <div className="tc-summary-top">
            <span>Total bill entries</span>
            <span className="tc-summary-icon">▤</span>
          </div>
          <div className="tc-summary-value">{rows.length}</div>
          <div className="tc-summary-foot">Matching entries</div>
        </div>

        <div className="tc-summary-card">
          <div className="tc-summary-top">
            <span>Total count</span>
            <span className="tc-summary-icon tc-purple">#</span>
          </div>
          <div className="tc-summary-value">{totalCount}</div>
          <div className="tc-summary-foot">Across matching entries</div>
        </div>
      </div>

      <section className="tc-panel">
        <div className="tc-panel-heading">
          <div>
            <h2>Filter records</h2>
            <p>Select a date range, then show the report.</p>
          </div>
          <span className="tc-filter-symbol">⚙</span>
        </div>

        <div className="tc-filter-row">
          <label className="tc-field">
            <span>From date</span>
            <input
              className="lab-input"
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>

          <label className="tc-field">
            <span>To date</span>
            <input
              className="lab-input"
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>

          <button
            className="lab-btn primary tc-show-btn"
            onClick={handleShow}
            disabled={!startDate || !endDate || startDate > endDate}
          >
            Show report <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="tc-applied-date">
          <span className="tc-date-dot" />
          Applied range: {appliedDates.start} — {appliedDates.end}
        </div>
      </section>

      <section className="tc-panel tc-table-panel">
        <div className="tc-table-heading">
          <div>
            <h2>Test count records</h2>
            <p>Search and review bill entry counts.</p>
          </div>
          <span className="tc-record-badge">{rows.length} records</span>
        </div>

        <div className="tc-search-wrap">
          <span aria-hidden="true">⌕</span>
          <input
            className="lab-input lab-search"
            placeholder="Search bill entry, serial number, or count..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search test count records"
          />
          {q && (
            <button
              className="tc-clear-search"
              onClick={() => setQ("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {rows.length > 0 ? (
          <LabTable columns={cols} rows={rows} />
        ) : (
          <div className="tc-empty">
            <div className="tc-empty-icon">⌕</div>
            <h3>No records found</h3>
            <p>Try another search term to find a bill entry.</p>
            {q && (
              <button className="lab-btn" onClick={() => setQ("")}>
                Clear search
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
