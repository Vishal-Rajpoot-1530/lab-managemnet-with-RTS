import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  CalendarDays,
  FileText,
  IndianRupee,
  CircleAlert,
  CheckCircle2,
  RotateCcw,
  ArrowUpRight,
} from "lucide-react";

import { casesApiService } from "../../api";

import "./cases.css";

/* =========================================================
   HELPERS
   ========================================================= */

const STATUSES = ["Pending", "Sent", "Received", "Completed"];

const money = (value) => `Rs.${Number(value || 0).toLocaleString("en-IN")}`;

const isDone = (status) =>
  ["received", "completed"].includes(String(status || "").toLowerCase());

const formatDay = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-GB");
};

function getDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/* =========================================================
   MAIN PAGE
   ========================================================= */

export default function OutsourceCases() {
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
  const [lab, setLab] = useState("");

  const [filters, setFilters] = useState(null); // null = nothing applied

  const [expandedId, setExpandedId] = useState(null);
  const [menuId, setMenuId] = useState(null);

  /* ---- load (date, status and text are filtered by the server) ---- */
  const load = useCallback(async (applied) => {
    setLoading(true);
    setError("");

    try {
      const list = await casesApiService.outsource.list({
        from: applied?.fromDate,
        to: applied?.toDate,
        status: applied?.status,
        q: applied?.search,
      });
      setRows(list);
    } catch (err) {
      if (err.status === 401) return window.location.assign("/login");
      setRows([]);
      setError(err.message || "Unable to load outsource cases.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filters);
  }, [load, filters]);

  /* ---- lab dropdown options ---- */
  const labs = useMemo(
    () => [...new Set(rows.map((row) => row.labName).filter(Boolean))],
    [rows]
  );

  /* ---- lab filter is applied here ---- */
  const filteredRows = useMemo(
    () => (filters?.lab ? rows.filter((row) => row.labName === filters.lab) : rows),
    [rows, filters]
  );

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
    setFilters({ fromDate, toDate, search: search.trim(), status, lab });
  }

  function clearFilters() {
    setDuration("all");
    setFromDate("");
    setToDate("");
    setSearch("");
    setStatus("");
    setLab("");
    setFilters(null);
  }

  /* ---- summary ---- */
  const summary = useMemo(
    () => ({
      count: filteredRows.length,
      cost: filteredRows.reduce((sum, row) => sum + Number(row.cost || 0), 0),
      pending: filteredRows.filter((row) => !isDone(row.status)).length,
      done: filteredRows.filter((row) => isDone(row.status)).length,
    }),
    [filteredRows]
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
          <h1>Outsource cases</h1>
          <p>Track tests that are sent to other laboratories.</p>
        </div>

        <div className="bills-heading-actions">
          <button
            type="button"
            className="case-btn bills-refresh-btn"
            onClick={() => load(filters)}
          >
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
          <div className="bills-summary-icon green">
            <IndianRupee size={17} />
          </div>
          <div>
            <span>Outsource cost</span>
            <strong>{money(summary.cost)}</strong>
          </div>
        </div>

        <div className="bills-summary-card">
          <div className="bills-summary-icon orange">
            <CircleAlert size={17} />
          </div>
          <div>
            <span>Pending</span>
            <strong>{summary.pending}</strong>
          </div>
          <div className="bills-summary-mark warning">awaiting result</div>
        </div>

        <div className="bills-summary-card">
          <div className="bills-summary-icon teal">
            <CheckCircle2 size={17} />
          </div>
          <div>
            <span>Received</span>
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
            <label htmlFor="oc-duration">Date range</label>

            <div className="bills-duration-control">
              <select
                id="oc-duration"
                value={duration}
                onChange={(event) => updateDuration(event.target.value)}
              >
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
            <label htmlFor="oc-search">Patient, reg. no. or test</label>
            <input
              id="oc-search"
              placeholder="Search..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="case-field bills-filter-field">
            <label htmlFor="oc-status">Status</label>
            <select id="oc-status" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All statuses</option>
              {STATUSES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="case-field bills-filter-field">
            <label htmlFor="oc-lab">Outsource lab</label>
            <select id="oc-lab" value={lab} onChange={(event) => setLab(event.target.value)}>
              <option value="">All labs</option>
              {labs.map((name) => (
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
          <strong>Loading outsource cases</strong>
          <span>Fetching the latest records...</span>
        </div>
      ) : error ? (
        <div className="api-error bills-error-card">
          <div>
            <strong>Unable to load outsource cases</strong>
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
              <strong>Outsource records</strong>
              <span>
                Showing <b>{filteredRows.length}</b> of {rows.length} records
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
                  <th>OUTSOURCE LAB</th>
                  <th>COST</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((row) => {
                  const expanded = expandedId === row.id;

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
                        </td>

                        <td className="bills-patient-cell" title={row.patient}>
                          <div className="bills-patient">
                            <div className="bills-patient-avatar">
                              {String(row.patient || "?").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong>{row.patient || "—"}</strong>
                              <small>Bill {row.billId}</small>
                            </div>
                          </div>
                        </td>

                        <td className="bills-referrer-cell" title={row.investigations}>
                          {row.investigations || "—"}
                        </td>

                        <td className="bills-referrer-cell" title={row.labName}>
                          {row.labName || "Not assigned"}
                        </td>

                        <td className="bills-amount">{money(row.cost)}</td>

                        <td>
                          <span className={`bills-status ${isDone(row.status) ? "paid" : "due"}`}>
                            <span />
                            {row.status || "Pending"}
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
                          <td colSpan={8}>
                            <div className="bills-expanded-content">
                              <div className="bills-expanded-item">
                                <span>Sent on</span>
                                <strong>{formatDay(row.sentAt)}</strong>
                              </div>

                              <div className="bills-expanded-item">
                                <span>Received on</span>
                                <strong>{formatDay(row.receivedAt)}</strong>
                              </div>

                              <div className="bills-expanded-item">
                                <span>Test</span>
                                <strong>{row.testName || "—"}</strong>
                              </div>

                              <div className="bills-expanded-item">
                                <span>Remarks</span>
                                <strong>{row.remarks || "—"}</strong>
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

                {!filteredRows.length && (
                  <tr>
                    <td colSpan={9} className="bills-no-results">
                      <div className="bills-empty-icon">
                        <Search size={20} />
                      </div>
                      <strong>No outsource cases found</strong>
                      <span>
                        {filters
                          ? "Try changing your search criteria."
                          : "Bills with outsourced tests appear here."}
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
            <span>{filteredRows.length} records displayed</span>
            <span>
              Outsource cost: <strong>{money(summary.cost)}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}