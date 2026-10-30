import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  CalendarDays,
  ReceiptText,
  Wallet,
  CircleDollarSign,
  Clock3,
  X,
  SlidersHorizontal,
  Info,
  ArrowUpRight,
} from "lucide-react";

import DataTable, { TableBadge, TableAction } from "../../components/common/DataTable";
import { businessApiService } from "../../api";
import "./DueReports.css";

const amountOf = (value) => {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amountOf(value));

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString("en-GB") : "—";
};

const badgeTone = (status) =>
  status === "Overdue" ? "danger" : status === "Partially Paid" ? "warning" : status === "Paid" ? "success" : "neutral";

export default function DueReports() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);

  // Bills with a balance. Search and the dates are applied by the server.
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await businessApiService.dueReports({ q: search.trim(), from: startDate, to: endDate }));
    } catch (err) {
      if (err?.status === 401) return window.location.assign("/login");
      setRows([]);
      setError(err?.message || "Unable to load the due reports.");
    } finally {
      setLoading(false);
    }
  }, [search, startDate, endDate]);

  useEffect(() => {
    const timer = setTimeout(load, search.trim() ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  // The status filter works on what was loaded.
  const filteredRows = useMemo(
    () => rows.filter((row) => statusFilter === "All" || row.status === statusFilter),
    [rows, statusFilter]
  );

  const totalBilled = rows.reduce((sum, row) => sum + amountOf(row.total), 0);
  const totalCollected = rows.reduce((sum, row) => sum + amountOf(row.paid), 0);
  const totalOutstanding = rows.reduce((sum, row) => sum + amountOf(row.outstanding), 0);
  const pendingCount = rows.length;

  const filtering = Boolean(search || statusFilter !== "All" || startDate || endDate);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setStartDate("");
    setEndDate("");
  };

  const exportCSV = () => {
    const headers = ["Bill Number", "Patient", "Patient ID", "Mobile", "Date", "Total Amount", "Discount", "Paid Amount", "Outstanding", "Status"];
    const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvRows = filteredRows.map((row) => [
      row.billNo, row.patientName, row.patientId, row.mobile, formatDate(row.date),
      amountOf(row.total), amountOf(row.discount), amountOf(row.paid), amountOf(row.outstanding), row.status,
    ]);

    const csvContent = [headers, ...csvRows].map((row) => row.map(escapeCSV).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");

    link.href = url;
    link.download = "due-reports.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      key: "billNo",
      label: "Bill details",
      render: (_, row) => (
        <div className="due-bill-cell">
          <span className="due-bill-icon">
            <ReceiptText size={17} />
          </span>
          <div>
            <strong>{row.billNo || "—"}</strong>
            <span>{formatDate(row.date)}</span>
          </div>
        </div>
      ),
    },
    {
      key: "patientName",
      label: "Patient",
      render: (_, row) => (
        <div className="due-patient-cell">
          <strong>{row.patientName || "—"}</strong>
          <span>ID: {row.patientId || "—"}</span>
        </div>
      ),
    },
    { key: "total", label: "Bill amount", render: (value) => <span className="due-money">{formatCurrency(value)}</span> },
    { key: "paid", label: "Paid", render: (value) => <span className="due-paid">{formatCurrency(value)}</span> },
    {
      key: "outstanding",
      label: "Outstanding",
      render: (value) => <strong className="due-outstanding">{formatCurrency(value)}</strong>,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <TableBadge tone={badgeTone(value)}>{value}</TableBadge>,
    },
    {
      key: "id",
      label: "Action",
      render: (_, row) => <TableAction onClick={() => setSelectedBill(row)}>View bill</TableAction>,
    },
  ];

  return (
    <div className="due-page">
      <div className="due-header">
        <div>
          <div className="due-eyebrow">
            <span className="due-eyebrow-dot" />
            BILLING & FINANCE
          </div>

          <h1>Due Reports</h1>

          <p>Track pending payments, monitor outstanding balances, and review patient billing records.</p>
        </div>

        <button className="due-export-btn" onClick={exportCSV} disabled={filteredRows.length === 0}>
          <Download size={17} />
          Export report
        </button>
      </div>

      <div className="due-summary-grid">
        <div className="due-summary-card due-summary-primary">
          <div className="due-summary-top">
            <span className="due-summary-label">Total outstanding</span>
            <span className="due-summary-icon">
              <CircleDollarSign size={20} />
            </span>
          </div>
          <h2>{formatCurrency(totalOutstanding)}</h2>
          <div className="due-summary-foot">
            <span className="due-summary-trend">
              <ArrowUpRight size={15} />
              {pendingCount} unpaid bills
            </span>
            <span>{filtering ? "For the current search" : "Across all records"}</span>
          </div>
        </div>

        <div className="due-summary-card">
          <div className="due-summary-top">
            <span className="due-summary-label">Pending bills</span>
            <span className="due-summary-icon due-icon-orange">
              <Clock3 size={20} />
            </span>
          </div>
          <h2>{pendingCount}</h2>
          <div className="due-summary-foot">
            <span>Require payment</span>
          </div>
        </div>

        <div className="due-summary-card">
          <div className="due-summary-top">
            <span className="due-summary-label">Total billed</span>
            <span className="due-summary-icon due-icon-blue">
              <ReceiptText size={20} />
            </span>
          </div>
          <h2>{formatCurrency(totalBilled)}</h2>
          <div className="due-summary-foot">
            <span>On these {rows.length} bills</span>
          </div>
        </div>

        <div className="due-summary-card">
          <div className="due-summary-top">
            <span className="due-summary-label">Total collected</span>
            <span className="due-summary-icon due-icon-green">
              <Wallet size={20} />
            </span>
          </div>
          <h2>{formatCurrency(totalCollected)}</h2>
          <div className="due-summary-foot">
            <span>Payments received so far</span>
          </div>
        </div>
      </div>

      <section className="due-report-panel">
        <div className="due-panel-heading">
          <div>
            <h3>Outstanding payments</h3>
            <p>Review and manage patient payment records.</p>
          </div>

          <span className="due-record-count">{filteredRows.length} records</span>
        </div>

        <div className="due-filter-panel">
          <div className="due-search-wrap">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search patient, ID, mobile or bill number..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button className="due-clear-search" onClick={() => setSearch("")} aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </div>

          <div className="due-filter-control">
            <SlidersHorizontal size={16} />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by payment status"
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Partially Paid">Partially paid</option>
              <option value="Overdue">Overdue (over 30 days)</option>
            </select>
          </div>

          <div className="due-date-control">
            <CalendarDays size={16} />
            <input type="date" aria-label="Start date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
            <span>to</span>
            <input type="date" aria-label="End date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </div>
        </div>

        <div className="due-filter-note">
          <Info size={15} />
          <span>Only bills with an unpaid balance are listed. Cancelled bills are left out.</span>
        </div>

        <div className="due-table-wrap">
          {error ? (
            <div className="due-empty-state" role="alert">
              <span className="due-empty-icon">
                <ReceiptText size={25} />
              </span>
              <h3>Could not load the due reports</h3>
              <p>{error}</p>
              <button onClick={load}>Try again</button>
            </div>
          ) : loading && rows.length === 0 ? (
            <div className="due-empty-state" role="status">
              <h3>Loading…</h3>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="due-empty-state">
              <span className="due-empty-icon">
                <ReceiptText size={25} />
              </span>
              <h3>{filtering ? "No billing records found" : "No outstanding payments"}</h3>
              <p>{filtering ? "Try changing your search, status, or date filters." : "Every bill is fully paid."}</p>
              {filtering && <button onClick={clearFilters}>Clear all filters</button>}
            </div>
          ) : (
            <DataTable columns={columns} rows={filteredRows} rowKey="id" loading={loading} />
          )}
        </div>
      </section>

      {selectedBill && (
        <div className="due-modal-overlay" onClick={() => setSelectedBill(null)}>
          <section
            className="due-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="due-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="due-modal-header">
              <div className="due-modal-heading-icon">
                <ReceiptText size={21} />
              </div>

              <div>
                <h2 id="due-modal-title">Bill details</h2>
                <p>Review the selected billing record.</p>
              </div>

              <button className="due-modal-close" onClick={() => setSelectedBill(null)} aria-label="Close bill details">
                <X size={20} />
              </button>
            </div>

            <div className="due-modal-content">
              <div className="due-modal-bill-number">
                <span>Bill number</span>
                <strong>{selectedBill.billNo || "—"}</strong>
              </div>

              <div className="due-detail-grid">
                <div>
                  <span>Patient name</span>
                  <strong>{selectedBill.patientName || "—"}</strong>
                </div>

                <div>
                  <span>Patient ID</span>
                  <strong>{selectedBill.patientId || "—"}</strong>
                </div>

                <div>
                  <span>Bill date</span>
                  <strong>{formatDate(selectedBill.date)}</strong>
                </div>

                <div>
                  <span>Payment status</span>
                  <strong>{selectedBill.status}</strong>
                </div>
              </div>

              <div className="due-modal-amounts">
                <div>
                  <span>Total amount</span>
                  <strong>{formatCurrency(selectedBill.total)}</strong>
                </div>

                <div>
                  <span>Amount paid</span>
                  <strong className="due-paid">{formatCurrency(selectedBill.paid)}</strong>
                </div>

                <div className="due-modal-balance">
                  <span>Outstanding balance</span>
                  <strong>{formatCurrency(selectedBill.outstanding)}</strong>
                </div>
              </div>
            </div>

            <div className="due-modal-footer">
              <button className="due-modal-secondary" onClick={() => setSelectedBill(null)}>
                Close
              </button>

              <button className="due-modal-secondary" onClick={() => navigate(`/cases/bill-details/${selectedBill.id}`)}>
                Open bill
              </button>

              <button
                className="due-modal-primary"
                onClick={() => {
                  const row = selectedBill;
                  const text = [
                    `Bill: ${row.billNo}`,
                    `Patient: ${row.patientName}`,
                    `Patient ID: ${row.patientId || "—"}`,
                    `Date: ${formatDate(row.date)}`,
                    `Status: ${row.status}`,
                    `Total: ${formatCurrency(row.total)}`,
                    `Paid: ${formatCurrency(row.paid)}`,
                    `Outstanding: ${formatCurrency(row.outstanding)}`,
                  ].join("\n");

                  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
                  const link = document.createElement("a");

                  link.href = url;
                  link.download = `bill-${row.billNo}.txt`;
                  link.click();

                  URL.revokeObjectURL(url);
                }}
              >
                <Download size={16} />
                Download details
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}