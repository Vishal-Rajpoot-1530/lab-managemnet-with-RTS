
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LabTable from "./LabTable";
import { reportApiService } from "../../api";
import useApiList from "../../api/core/useApiList";
import "./TodayReports.css";

const load = (q) => reportApiService.today(q);

const COMPLETED = ["completed", "complete", "reported"];

const isCompleted = (status) =>
  COMPLETED.includes(String(status || "").toLowerCase());

const formatTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function TodayReports() {
  const navigate = useNavigate();
  const { rows = [], loading, error, reload } = useApiList(load);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");

  // The backend sends regNo / patient / referrer / createdAt. The table
  // columns use registrationNo / patientName / referrerName / time, so map
  // them here. Each row also carries itself in `actions` for the Actions column.
  const reportRows = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        registrationNo: row.registrationNo ?? row.regNo ?? "",
        patientName: row.patientName ?? row.patient ?? "",
        referrerName: row.referrerName ?? row.referrer ?? "",
        time: formatTime(row.createdAt),
        actions: row,
      })),
    [rows],
  );

  const toggleStatus = async (row) => {
    setActionError("");
    setBusyId(row.id);

    try {
      await reportApiService.update(row.id, {
        status: isCompleted(row.status) ? "New" : "Completed",
      });

      await reload({});
    } catch (err) {
      setActionError(err?.message || "Could not update the report status.");
    } finally {
      setBusyId(null);
    }
  };

  const cols = [
    { key: "registrationNo", label: "REG. NO." },
    { key: "time", label: "TIME" },
    { key: "patientName", label: "PATIENT" },
    { key: "referrerName", label: "REFERRED BY" },
    {
      key: "tests",
      label: "TESTS",
      render: (v) =>
        Array.isArray(v) ? v.map((x) => x.name || x).join(", ") : v || "—",
    },
    {
      key: "status",
      label: "STATUS",
      render: (v) => (
        <span
          className={`lab-status lab-status-${String(v || "pending")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")}`}
        >
          <span className="lab-status-dot" />
          {v || "Pending"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (row) => {
        if (!row || typeof row !== "object") return "—";

        return (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              className="lab-btn secondary"
              style={{ padding: "4px 10px", fontSize: 12 }}
              disabled={!row.billId}
              onClick={() => navigate(`/cases/bill-details/${row.billId}`)}
            >
              View bill
            </button>

            <button
              type="button"
              className="lab-btn primary"
              style={{ padding: "4px 10px", fontSize: 12 }}
              disabled={busyId === row.id}
              onClick={() => toggleStatus(row)}
            >
              {busyId === row.id
                ? "Saving..."
                : isCompleted(row.status)
                  ? "Reopen"
                  : "Mark completed"}
            </button>
          </div>
        );
      },
    },
  ];

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return reportRows;

    return reportRows.filter((row) => {
      const tests = Array.isArray(row.tests)
        ? row.tests.map((x) => x.name || x).join(" ")
        : row.tests || "";

      return [
        row.registrationNo,
        row.patientName,
        row.referrerName,
        row.status,
        tests,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [reportRows, search]);

  const completedCount = reportRows.filter((row) =>
    isCompleted(row.status),
  ).length;

  const pendingCount = reportRows.length - completedCount;

  return (
    <main className="lab-page">
      <header className="lab-page-header">
        <div>
          <div className="lab-breadcrumb">
            Dashboard <span>/</span> Reports
          </div>
          <h1>Reports for today</h1>
          <p className="lab-page-subtitle">
            View and manage today's patient reports and test activity.
          </p>
        </div>

        <button
          className="lab-btn primary"
          type="button"
          onClick={() => reload({})}
          disabled={loading}
        >
          <span
            className={loading ? "lab-refresh-icon spinning" : "lab-refresh-icon"}
          >
            ↻
          </span>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <section className="lab-summary-grid">
        <article className="lab-summary-card">
          <div className="lab-summary-icon lab-icon-blue">▤</div>
          <div>
            <p>Total reports</p>
            <strong>{reportRows.length}</strong>
            <span>Today's registrations</span>
          </div>
        </article>

        <article className="lab-summary-card">
          <div className="lab-summary-icon lab-icon-green">✓</div>
          <div>
            <p>Completed</p>
            <strong>{completedCount}</strong>
            <span>Reports finalized</span>
          </div>
        </article>

        <article className="lab-summary-card">
          <div className="lab-summary-icon lab-icon-amber">◷</div>
          <div>
            <p>Pending</p>
            <strong>{pendingCount}</strong>
            <span>Awaiting completion</span>
          </div>
        </article>
      </section>

      <section className="lab-table-panel">
        <div className="lab-table-heading">
          <div>
            <h2>Today's registrations</h2>
            <p>Patient details and report status</p>
          </div>

          <label className="lab-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients, tests..."
              aria-label="Search today's reports"
            />
          </label>
        </div>

        {actionError && (
          <div className="lab-state lab-state-error" role="alert">
            <span className="lab-state-icon">!</span>
            <div>
              <strong>Action failed</strong>
              <p>{actionError}</p>
            </div>
          </div>
        )}

        {error ? (
          <div className="lab-state lab-state-error" role="alert">
            <span className="lab-state-icon">!</span>
            <div>
              <strong>Unable to load reports</strong>
              <p>{String(error)}</p>
              <button
                className="lab-btn secondary"
                type="button"
                onClick={() => reload({})}
              >
                Try again
              </button>
            </div>
          </div>
        ) : loading && reportRows.length === 0 ? (
          <div className="lab-state" role="status">
            <span className="lab-spinner" />
            <strong>Loading today's reports...</strong>
            <p>Please wait while we retrieve the latest records.</p>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="lab-state">
            <span className="lab-state-icon">⌕</span>
            <strong>
              {search ? "No matching reports" : "No reports available"}
            </strong>
            <p>
              {search
                ? "Try another patient name, registration number, or test."
                : "Today's registrations will appear here when available."}
            </p>
            {search && (
              <button
                className="lab-btn secondary"
                type="button"
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {loading && (
              <div className="lab-inline-loading" role="status">
                Refreshing report data…
              </div>
            )}
            <div className="lab-table-wrap">
              <LabTable columns={cols} rows={filteredRows} />
            </div>
            <footer className="lab-table-footer">
              <span>
                Showing <strong>{filteredRows.length}</strong> of{" "}
                <strong>{reportRows.length}</strong> reports
              </span>
              <span>Today's reports</span>
            </footer>
          </>
        )}
      </section>
    </main>
  );
}