
import { useState } from "react";
import LabTable from "./LabTable";
import { reportApiService } from "../../api";
import { apiArray } from "../../api/core/apiData";
import "./lab.css";

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
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function search(event) {
    event?.preventDefault();

    const patient = q.trim();

    if (!patient) {
      setError("Enter a patient name to search for reports.");
      setRows([]);
      setSearched(false);
      return;
    }

    setError("");
    setLoading(true);
    setSearched(true);

    try {
      const result = await reportApiService.search({ patient });
      setRows(apiArray(result));
    } catch (e) {
      setRows([]);
      setError(e?.message || "Unable to search reports. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function clearSearch() {
    setQ("");
    setRows([]);
    setError("");
    setSearched(false);
  }

  return (
    <main className="lab-page">
      <header className="lab-page-header">
        <div>
          <div className="lab-breadcrumb">
            Dashboard <span>/</span> Reports <span>/</span> Search
          </div>
          <h1>Search lab reports</h1>
          <p className="lab-page-subtitle">
            Find patient reports using the patient's name.
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
            <p>Enter the patient name to view matching records.</p>
          </div>
        </div>

        <form className="lab-filters" onSubmit={search}>
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
            <button
              className="lab-btn primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="lab-spinner-small" />
                  Searching...
                </>
              ) : (
                <>
                  <span aria-hidden="true">⌕</span>
                  Search reports
                </>
              )}
            </button>

            {(q || searched || error) && (
              <button
                className="lab-btn secondary"
                type="button"
                onClick={clearSearch}
                disabled={loading}
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </section>

      {error && (
        <div className="lab-search-error" role="alert">
          <span className="lab-state-icon">!</span>
          <div>
            <strong>Search could not be completed</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      <section className="lab-table-panel lab-search-results">
        <div className="lab-table-heading">
          <div>
            <h2>Search results</h2>
            <p>
              {loading
                ? "Searching patient records..."
                : searched && !error
                  ? `${rows.length} matching report${rows.length === 1 ? "" : "s"} found`
                  : "Matching patient reports will appear here."}
            </p>
          </div>

          {searched && !loading && !error && (
            <span className="lab-results-count">
              {rows.length} {rows.length === 1 ? "record" : "records"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="lab-state" role="status">
            <span className="lab-spinner" />
            <strong>Searching reports...</strong>
            <p>Please wait while we retrieve matching records.</p>
          </div>
        ) : error ? (
          <div className="lab-state">
            <span className="lab-state-icon">!</span>
            <strong>Results unavailable</strong>
            <p>Correct the search or try again.</p>
            <button
              className="lab-btn secondary"
              type="button"
              onClick={search}
            >
              Try again
            </button>
          </div>
        ) : !searched ? (
          <div className="lab-state">
            <span className="lab-state-icon">⌕</span>
            <strong>Start your search</strong>
            <p>Enter a patient name above to find laboratory reports.</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="lab-state">
            <span className="lab-state-icon">⌕</span>
            <strong>No reports found</strong>
            <p>
              No matching records were returned. Check the spelling or try
              another patient name.
            </p>
          </div>
        ) : (
          <div className="lab-table-wrap">
            <LabTable columns={columns} rows={rows} />
          </div>
        )}

        {searched && !loading && !error && rows.length > 0 && (
          <footer className="lab-table-footer">
            <span>
              Showing <strong>{rows.length}</strong> matching reports
            </span>
            <span>Patient report search</span>
          </footer>
        )}
      </section>
    </main>
  );
}
