import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  CalendarDays,
  FileText,
  CircleAlert,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowUpRight,
} from "lucide-react";

import { casesApiService } from "../../api";

import "./cases.css";

const MODALITY = "ctScan";
const STATUSES = ["New", "In progress", "Completed"];

/* =========================================================
   HELPERS
   ========================================================= */

const isDone = (status) => String(status || "").toLowerCase() === "completed";

function getDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTime(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "";
}

const statusClass = (status) =>
  isDone(status) ? "paid" : String(status || "").toLowerCase() === "new" ? "due" : "due";

/* =========================================================
   MAIN PAGE
   ========================================================= */

export default function CTScanCases() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---- filter inputs (applied when "Search cases" is pressed) ---- */
  const [duration, setDuration] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [filters, setFilters] = useState(null); // null = nothing applied

  const [expandedId, setExpandedId] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const load = useCallback(async (applied) => {
    setLoading(true);
    setError("");

    try {
      const list = await casesApiService.radiology.list(MODALITY, {
        from: applied?.fromDate,
        to: applied?.toDate,
        status: applied?.status,
        q: applied?.search,
      });
      setRows(list);
    } catch (err) {
      if (err.status === 401) return window.location.assign("/login");
      setRows([]);
      setError(err.message || "Unable to load CT scan cases.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filters);
  }, [load, filters]);

  /* ---- duration presets ---- */
  function updateDuration(value) {
    setDuration(value);
    if (value === "custom") return;

    if (value === "all") {
      setFromDate("");
      setToDate("");
      return;
    }

    const end = new Date();
    const start = new Date();
    if (value === "7") start.setDate(end.getDate() - 6);
    if (value === "30") start.setDate(end.getDate() - 29);
    if (value === "month") start.setDate(1);

    setFromDate(getDateInputValue(start));
    setToDate(getDateInputValue(end));
  }

  function applyFilters(event) {
    event?.preventDefault();
    setFilters({ fromDate, toDate, search: search.trim(), status });
  }

  function clearFilters() {
    setDuration("all");
    setFromDate("");
    setToDate("");
    setSearch("");
    setStatus("");
    setFilters(null);
  }

  /* ---- summary ---- */
  const summary = useMemo(
    () => ({
      count: rows.length,
      fresh: rows.filter((row) => String(row.status).toLowerCase() === "new").length,
      progress: rows.filter((row) => String(row.status).toLowerCase() === "in progress").length,
      done: rows.filter((row) => isDone(row.status)).length,
    }),
    [rows]
  );

  /* ---- navigation ---- */
  const openBill = (row) => row.billId && navigate(`/cases/bill-details/${row.billId}`);
  const modifyBill = (row) => row.billId && navigate(`/cases/bills/${row.billId}/modify`);

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="cases-page bills-page">
      {/* ---------------- HEADER ---------------- */}
      <header className="bills-page-heading">
        <div className="bills-heading-copy">
          <div className="bills-eyebrow">CASE MANAGEMENT</div>
          <h1>CT scan cases</h1>
          <p>Review patients booked for CT scans and their report progress.</p>
        </div>

        <div className="bills-heading-actions">
          <button type="button" className="case-btn bills-refresh-btn" onClick={() => load(filters)}>
            <RotateCcw size={14} />
            Refresh
          </button>
        </div>
      </header>

      {/* ---------------- SUMMARY ---------------- */}
      <section className="bills-summary-grid">
        <div className="bills-summary-card">
          <div className="bills-summary-icon blue">
            <FileText size={17} />
          </div>
          <div>
            <span>Total cases</span>
            <strong>{summary.count}</strong>
          </div>
          <div className="bills-summary-mark">{filters ? "Filtered" : "All records"}</div>
        </div>

        <div className="bills-summary-card">
          <div className="bills-summary-icon orange">
            <CircleAlert size={17} />
          </div>
          <div>
            <span>New</span>
            <strong>{summary.fresh}</strong>
          </div>
          <div className="bills-summary-mark warning">not started</div>
        </div>

        <div className="bills-summary-card">
          <div className="bills-summary-icon green">
            <Clock size={17} />
          </div>
          <div>
            <span>In progress</span>
            <strong>{summary.progress}</strong>
          </div>
        </div>

        <div className="bills-summary-card">
          <div className="bills-summary-icon teal">
            <CheckCircle2 size={17} />
          </div>
          <div>
            <span>Completed</span>
            <strong>{summary.done}</strong>
          </div>
        </div>
      </section>

      {/* ---------------- FILTERS ---------------- */}
      <form className="case-filters bills-filter-panel" onSubmit={applyFilters}>
        <div className="bills-filter-heading">
          <div>
            <strong>Find cases</strong>
            <span>Narrow the records using the filters below.</span>
          </div>

          {filters && (
            <button type="button" className="bills-clear-top" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        <div className="bills-filter-grid">
          <div className="case-field bills-duration-field">
            <label htmlFor="ct-duration">Date range</label>

            <div className="bills-duration-control">
              <select id="ct-duration" value={duration} onChange={(event) => updateDuration(event.target.value)}>
                <option value="all">All time</option>
                <option value="7">Past 7 days</option>
                <option value="30">Past 30 days</option>
                <option value="month">This month</option>
                <option value="custom">Custom</option>
              </select>

              <div className="bills-date-range">
                <CalendarDays size={14} />
                <input
                  aria-label="From date"
                  type="date"
                  value={fromDate}
                  onChange={(event) => {
                    setFromDate(event.target.value);
                    setDuration("custom");
                  }}
                />
                <span>to</span>
                <input
                  aria-label="To date"
                  type="date"
                  value={toDate}
                  onChange={(event) => {
                    setToDate(event.target.value);
                    setDuration("custom");
                  }}
                />
              </div>
            </div>
          </div>

          <div className="case-field bills-filter-field">
            <label htmlFor="ct-search">Patient, mobile, reg. no. or scan</label>
            <input
              id="ct-search"
              placeholder="Search..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="case-field bills-filter-field">
            <label htmlFor="ct-status">Status</label>
            <select id="ct-status" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All statuses</option>
              {STATUSES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bills-filter-footer">
          <div className="bills-filter-options" />

          <div className="bills-filter-buttons">
            <button type="button" className="case-btn" onClick={clearFilters}>
              Clear
            </button>
            <button type="submit" className="case-btn primary">
              <Search size={14} />
              Search cases
            </button>
          </div>
        </div>
      </form>

      {/* ---------------- TABLE ---------------- */}
      {loading ? (
        <div className="bills-state-card">
          <div className="bills-loading-spinner" />
          <strong>Loading CT scan cases</strong>
          <span>Fetching the latest records...</span>
        </div>
      ) : error ? (
        <div className="api-error bills-error-card">
          <div>
            <strong>Unable to load CT scan cases</strong>
            <span>{error}</span>
          </div>
          <button type="button" className="case-btn" onClick={() => load(filters)}>
            Retry
          </button>
        </div>
      ) : (
        <div className="bills-table-container">
          <div className="bills-table-header">
            <div>
              <strong>CT scan records</strong>
              <span>
                Showing <b>{rows.length}</b> records
              </span>
            </div>
            {filters && <span className="bills-filter-active">Filters applied</span>}
          </div>

          <div className="bills-table-scroll">
            <table className="bills-table">
              <thead>
                <tr>
                  <th className="bills-expand-column" aria-label="Expand" />
                  <th>REG. NO.</th>
                  <th>DATE</th>
                  <th>PATIENT</th>
                  <th>INVESTIGATIONS</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => {
                  const expanded = expandedId === row.id;
                  const details = [row.age, row.sex].filter(Boolean).join(" · ");

                  return (
                    <Fragment key={row.id}>
                      <tr className={expanded ? "bills-row bills-row-expanded" : "bills-row"}>
                        <td className="bills-expand-column">
                          <button
                            type="button"
                            className="bills-expand-button"
                            aria-label={expanded ? "Collapse case" : "Expand case"}
                            onClick={() => setExpandedId(expanded ? null : row.id)}
                          >
                            {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                          </button>
                        </td>

                        <td className="bills-registration">
                          <span>{row.regNo || "—"}</span>
                        </td>

                        <td className="bills-date-cell">
                          <span>{row.date || "—"}</span>
                          {formatTime(row.createdAt) && <small>{formatTime(row.createdAt)}</small>}
                        </td>

                        <td className="bills-patient-cell" title={row.patient}>
                          <div className="bills-patient">
                            <div className="bills-patient-avatar">
                              {String(row.patient || "?").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong>{row.patient || "—"}</strong>
                              <small>{details || `Bill ${row.billId}`}</small>
                            </div>
                          </div>
                        </td>

                        <td className="bills-referrer-cell" title={row.investigations}>
                          {row.investigations || "—"}
                        </td>

                        <td>
                          <span className={`bills-status ${statusClass(row.status)}`}>
                            <span />
                            {row.status || "New"}
                          </span>
                        </td>

                        <td className="bills-actions-cell">
                          <button type="button" className="bills-view-link" onClick={() => openBill(row)}>
                            View
                            <ArrowUpRight size={13} />
                          </button>

                          <div className="bills-menu-wrap">
                            <button
                              type="button"
                              className="bills-more-button"
                              aria-label="More case actions"
                              aria-expanded={menuId === row.id}
                              onClick={() => setMenuId(menuId === row.id ? null : row.id)}
                            >
                              <MoreHorizontal size={17} />
                            </button>

                            {menuId === row.id && (
                              <div className="bills-action-menu">
                                <button type="button" onClick={() => openBill(row)}>
                                  View bill
                                </button>
                                <button type="button" onClick={() => modifyBill(row)}>
                                  Modify bill
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>

                      {expanded && (
                        <tr className="bills-expanded-details">
                          <td />
                          <td colSpan={6}>
                            <div className="bills-expanded-content">
                              <div className="bills-expanded-item">
                                <span>Mobile</span>
                                <strong>{row.mobile || "—"}</strong>
                              </div>

                              <div className="bills-expanded-item">
                                <span>Referred by</span>
                                <strong>{row.referrerName || "—"}</strong>
                              </div>

                              <div className="bills-expanded-item bills-investigations">
                                <span>Scans</span>
                                <div className="bills-test-list">
                                  {row.tests?.length ? (
                                    row.tests.map((test, index) => (
                                      <span className="bills-test-chip" key={`${test.name}-${index}`}>
                                        {test.name}
                                      </span>
                                    ))
                                  ) : (
                                    <strong>—</strong>
                                  )}
                                </div>
                              </div>

                              <button
                                type="button"
                                className="case-btn bills-details-button"
                                onClick={() => openBill(row)}
                              >
                                View full details
                                <ArrowUpRight size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}

                {!rows.length && (
                  <tr>
                    <td colSpan={7} className="bills-no-results">
                      <div className="bills-empty-icon">
                        <Search size={20} />
                      </div>
                      <strong>No CT scan cases found</strong>
                      <span>
                        {filters ? "Try changing your search criteria." : "Bills with a CT scan appear here."}
                      </span>
                      {filters && (
                        <button type="button" className="case-link" onClick={clearFilters}>
                          Clear filters
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bills-table-footer">
            <span>{rows.length} records displayed</span>
            <span>CT scan cases</span>
          </div>
        </div>
      )}
    </div>
  );
}