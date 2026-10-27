import { useCallback, useEffect, useRef, useState } from "react";
import LabTable from "./LabTable";
import { reportApiService } from "../../api";
import "./lab.css";

/**
 * The reports API answers { items: [...] }. Other endpoints answer { data: [...] }
 * or a bare array. Accept all of them so the table never ends up empty by mistake.
 */
function toRows(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.items)) return result.items;
  if (Array.isArray(result?.data?.items)) return result.data.items;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.rows)) return result.rows;
  return [];
}

const columns = [
  { key: "registrationNo", label: "REG. NO." },
  { key: "patientName", label: "PATIENT" },
  { key: "referrerName", label: "REFERRED BY" },
  {
    key: "tests",
    label: "TESTS",
    render: (value) =>
      Array.isArray(value)
        ? value.map((test) => test.name || test).join(", ")
        : value || "—",
  },
  {
    key: "status",
    label: "STATUS",
    render: (value) => {
      const status = String(value || "Pending");
      const className = status.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      return (
        <span className={`lab-status lab-status-${className}`}>
          <span className="lab-status-dot" />
          {status}
        </span>
      );
    },
  },
];

export default function SearchReports() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Only the newest request may update the table (older, slower ones are ignored).
  const latestRequest = useRef(0);

  const load = useCallback(async (term) => {
    const requestId = ++latestRequest.current;
    setError("");
    setLoading(true);

    try {
      // No patient filter = every report; with a term = only matching patients.
      const result = await reportApiService.search(term ? { patient: term } : {});
      if (requestId === latestRequest.current) setRows(toRows(result));
    } catch (e) {
      if (requestId !== latestRequest.current) return;
      setRows([]);
      setError(e?.message || "Unable to load reports. Please try again.");
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, []);

  // Show everything on first open, then filter as the user types (short delay
  // so we do not call the server on every keystroke).
  useEffect(() => {
    const timer = setTimeout(() => load(q.trim()), q.trim() ? 300 : 0);
    return () => clearTimeout(timer);
  }, [q, load]);

  function submit(event) {
    event.preventDefault();
    load(q.trim()); // Enter / Search button: search right away
  }

  const filtering = q.trim().length > 0;

  return (
    <main className="lab-page">
      <header className="lab-page-header">
        <div>
          <div className="lab-breadcrumb">
            Dashboard <span>/</span> Reports <span>/</span> Search
          </div>
          <h1>Search lab reports</h1>
          <p className="lab-page-subtitle">
            All reports are listed below. Type a patient's name, mobile number
            or registration number to filter them.
          </p>
        </div>
      </header>

      <section className="lab-search-panel">
        <div className="lab-search-panel-heading">
          <div className="lab-search-heading-icon" aria-hidden="true">
            ⌕
          </div>
          <div>
            <h2>Find a report</h2>
            <p>Results update as you type.</p>
          </div>
        </div>

        <form className="lab-filters" onSubmit={submit}>
          <label className="lab-search-field">
            <span>Patient name</span>
            <input
              className="lab-input"
              type="text"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="e.g. Rahul Sharma"
              autoComplete="off"
            />
          </label>

          <div className="lab-search-actions">
            <button className="lab-btn primary" type="submit" disabled={loading}>
              <span aria-hidden="true">⌕</span>
              Search reports
            </button>

            {filtering && (
              <button
                className="lab-btn secondary"
                type="button"
                onClick={() => setQ("")}
              >
                Show all
              </button>
            )}
          </div>
        </form>
      </section>

      {error && (
        <div className="lab-search-error" role="alert">
          <span className="lab-state-icon">!</span>
          <div>
            <strong>Reports could not be loaded</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      <section className="lab-table-panel lab-search-results">
        <div className="lab-table-heading">
          <div>
            <h2>{filtering ? "Search results" : "All reports"}</h2>
            <p>
              {loading
                ? "Loading reports..."
                : error
                  ? "Results unavailable."
                  : filtering
                    ? `${rows.length} matching report${rows.length === 1 ? "" : "s"} found`
                    : `${rows.length} report${rows.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {!loading && !error && (
            <span className="lab-results-count">
              {rows.length} {rows.length === 1 ? "record" : "records"}
            </span>
          )}
        </div>

        {loading && rows.length === 0 ? (
          <div className="lab-state" role="status">
            <span className="lab-spinner" />
            <strong>Loading reports...</strong>
            <p>Please wait while we retrieve records.</p>
          </div>
        ) : error ? (
          <div className="lab-state">
            <span className="lab-state-icon">!</span>
            <strong>Results unavailable</strong>
            <p>Check your connection or try again.</p>
            <button
              className="lab-btn secondary"
              type="button"
              onClick={() => load(q.trim())}
            >
              Try again
            </button>
          </div>
        ) : rows.length === 0 ? (
          <div className="lab-state">
            <span className="lab-state-icon">⌕</span>
            <strong>{filtering ? "No reports found" : "No reports yet"}</strong>
            <p>
              {filtering
                ? "No matching records were returned. Check the spelling or try another patient name."
                : "Bills you create will appear here."}
            </p>
            {filtering && (
              <button
                className="lab-btn secondary"
                type="button"
                onClick={() => setQ("")}
              >
                Show all
              </button>
            )}
          </div>
        ) : (
          <div className="lab-table-wrap" style={{ opacity: loading ? 0.6 : 1 }}>
            <LabTable columns={columns} rows={rows} />
          </div>
        )}

        {!error && rows.length > 0 && (
          <footer className="lab-table-footer">
            <span>
              Showing <strong>{rows.length}</strong>{" "}
              {filtering ? "matching reports" : "reports"}
            </span>
            <span>Patient report search</span>
          </footer>
        )}
      </section>
    </main>
  );
}