
import { useMemo, useState } from "react";
import {
  Search,
  Download,
  CalendarDays,
  ReceiptText,
  Wallet,
  CircleDollarSign,
  Clock3,
  Eye,
  X,
  SlidersHorizontal,
  Info,
  ArrowUpRight,
} from "lucide-react";

import DataTable, {
  TableBadge,
  TableAction,
} from "../../components/common/DataTable";

import { dueRows } from "./mockData";
import "./DueReports.css";

const getAmount = (value) => {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(getAmount(value));

const getOutstanding = (row) => {
  const total = getAmount(row.total ?? row.amount ?? row.billAmount);
  const paid = getAmount(row.paid ?? row.paidAmount);
  return Math.max(0, total - paid);
};

const getStatus = (row) => {
  if (getOutstanding(row) <= 0) return "Paid";

  const status = String(row.status ?? "").toLowerCase();

  if (status.includes("partial")) return "Partially Paid";
  if (status.includes("overdue")) return "Overdue";

  return "Pending";
};

export default function DueReports() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBill, setSelectedBill] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const rows = useMemo(
    () =>
      (Array.isArray(dueRows) ? dueRows : []).map((row, index) => ({
        ...row,
        _id: row.id ?? row.billId ?? row.billNo ?? index,
        _outstanding: getOutstanding(row),
        _status: getStatus(row),
      })),
    []
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((row) => {
      const searchableText = [
        row.patientName,
        row.patient,
        row.patientId,
        row.billNo,
        row.billNumber,
        row.invoiceNo,
        row.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesStatus =
        statusFilter === "All" || row._status === statusFilter;

      const rawDate = row.date ?? row.billDate ?? "";
      const parsedDate = rawDate ? new Date(rawDate) : null;
      const validDate =
        parsedDate && !Number.isNaN(parsedDate.getTime());

      const matchesStart =
        !startDate ||
        (validDate && parsedDate >= new Date(`${startDate}T00:00:00`));

      const matchesEnd =
        !endDate ||
        (validDate && parsedDate <= new Date(`${endDate}T23:59:59`));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesStart &&
        matchesEnd
      );
    });
  }, [rows, search, statusFilter, startDate, endDate]);

  const totalBilled = rows.reduce(
    (sum, row) =>
      sum + getAmount(row.total ?? row.amount ?? row.billAmount),
    0
  );

  const totalCollected = rows.reduce(
    (sum, row) => sum + getAmount(row.paid ?? row.paidAmount),
    0
  );

  const totalOutstanding = rows.reduce(
    (sum, row) => sum + row._outstanding,
    0
  );

  const pendingCount = rows.filter(
    (row) => row._outstanding > 0
  ).length;

  const exportCSV = () => {
    const headers = [
      "Bill Number",
      "Patient",
      "Patient ID",
      "Date",
      "Total Amount",
      "Paid Amount",
      "Outstanding",
      "Status",
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvRows = filteredRows.map((row) => [
      row.billNo ?? row.billNumber ?? row.invoiceNo ?? row.id,
      row.patientName ?? row.patient,
      row.patientId,
      row.date ?? row.billDate,
      getAmount(row.total ?? row.amount ?? row.billAmount),
      getAmount(row.paid ?? row.paidAmount),
      row._outstanding,
      row._status,
    ]);

    const csvContent = [headers, ...csvRows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "due-reports.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      header: "Bill details",
      accessor: "billNo",
      render: (_, row) => (
        <div className="due-bill-cell">
          <span className="due-bill-icon">
            <ReceiptText size={17} />
          </span>
          <div>
            <strong>
              {row.billNo ?? row.billNumber ?? row.invoiceNo ?? "—"}
            </strong>
            <span>
              {row.date ?? row.billDate ?? "Date unavailable"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Patient",
      accessor: "patientName",
      render: (_, row) => (
        <div className="due-patient-cell">
          <strong>{row.patientName ?? row.patient ?? "—"}</strong>
          <span>ID: {row.patientId ?? "—"}</span>
        </div>
      ),
    },
    {
      header: "Bill amount",
      accessor: "total",
      render: (_, row) => (
        <span className="due-money">
          {formatCurrency(row.total ?? row.amount ?? row.billAmount)}
        </span>
      ),
    },
    {
      header: "Paid",
      accessor: "paid",
      render: (_, row) => (
        <span className="due-paid">
          {formatCurrency(row.paid ?? row.paidAmount)}
        </span>
      ),
    },
    {
      header: "Outstanding",
      accessor: "_outstanding",
      render: (_, row) => (
        <strong className="due-outstanding">
          {formatCurrency(row._outstanding)}
        </strong>
      ),
    },
    {
      header: "Status",
      accessor: "_status",
      render: (_, row) => (
        <TableBadge
          value={row._status}
          label={row._status}
        />
      ),
    },
    {
      header: "Action",
      accessor: "_id",
      render: (_, row) => (
        <TableAction
          label="View bill"
          onClick={() => setSelectedBill(row)}
        />
      ),
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

          <p>
            Track pending payments, monitor outstanding balances, and
            review patient billing records.
          </p>
        </div>

        <button className="due-export-btn" onClick={exportCSV}>
          <Download size={17} />
          Export report
        </button>
      </div>

      <div className="due-summary-grid">
        <div className="due-summary-card due-summary-primary">
          <div className="due-summary-top">
            <span className="due-summary-label">
              Total outstanding
            </span>
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
            <span>Across all records</span>
          </div>
        </div>

        <div className="due-summary-card">
          <div className="due-summary-top">
            <span className="due-summary-label">
              Pending bills
            </span>
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
            <span className="due-summary-label">
              Total billed
            </span>
            <span className="due-summary-icon due-icon-blue">
              <ReceiptText size={20} />
            </span>
          </div>
          <h2>{formatCurrency(totalBilled)}</h2>
          <div className="due-summary-foot">
            <span>{rows.length} total records</span>
          </div>
        </div>

        <div className="due-summary-card">
          <div className="due-summary-top">
            <span className="due-summary-label">
              Total collected
            </span>
            <span className="due-summary-icon due-icon-green">
              <Wallet size={20} />
            </span>
          </div>
          <h2>{formatCurrency(totalCollected)}</h2>
          <div className="due-summary-foot">
            <span>Payments received</span>
          </div>
        </div>
      </div>

      <section className="due-report-panel">
        <div className="due-panel-heading">
          <div>
            <h3>Outstanding payments</h3>
            <p>Review and manage patient payment records.</p>
          </div>

          <span className="due-record-count">
            {filteredRows.length} records
          </span>
        </div>

        <div className="due-filter-panel">
          <div className="due-search-wrap">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search patient, ID or bill number..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                className="due-clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
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
              <option value="Overdue">Overdue</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <div className="due-date-control">
            <CalendarDays size={16} />
            <input
              type="date"
              aria-label="Start date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
            <span>to</span>
            <input
              type="date"
              aria-label="End date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
        </div>

        <div className="due-filter-note">
          <Info size={15} />
          <span>
            Showing billing records matching your selected filters.
          </span>
        </div>

        <div className="due-table-wrap">
          <DataTable
            columns={columns}
            data={filteredRows}
            rows={filteredRows}
          />

          {filteredRows.length === 0 && (
            <div className="due-empty-state">
              <span className="due-empty-icon">
                <ReceiptText size={25} />
              </span>
              <h3>No billing records found</h3>
              <p>
                Try changing your search, status, or date filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setStartDate("");
                  setEndDate("");
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {selectedBill && (
        <div
          className="due-modal-overlay"
          onClick={() => setSelectedBill(null)}
        >
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

              <button
                className="due-modal-close"
                onClick={() => setSelectedBill(null)}
                aria-label="Close bill details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="due-modal-content">
              <div className="due-modal-bill-number">
                <span>Bill number</span>
                <strong>
                  {selectedBill.billNo ??
                    selectedBill.billNumber ??
                    selectedBill.invoiceNo ??
                    selectedBill.id ??
                    "—"}
                </strong>
              </div>

              <div className="due-detail-grid">
                <div>
                  <span>Patient name</span>
                  <strong>
                    {selectedBill.patientName ??
                      selectedBill.patient ??
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>Patient ID</span>
                  <strong>{selectedBill.patientId ?? "—"}</strong>
                </div>

                <div>
                  <span>Bill date</span>
                  <strong>
                    {selectedBill.date ??
                      selectedBill.billDate ??
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>Payment status</span>
                  <strong>{selectedBill._status}</strong>
                </div>
              </div>

              <div className="due-modal-amounts">
                <div>
                  <span>Total amount</span>
                  <strong>
                    {formatCurrency(
                      selectedBill.total ??
                        selectedBill.amount ??
                        selectedBill.billAmount
                    )}
                  </strong>
                </div>

                <div>
                  <span>Amount paid</span>
                  <strong className="due-paid">
                    {formatCurrency(
                      selectedBill.paid ?? selectedBill.paidAmount
                    )}
                  </strong>
                </div>

                <div className="due-modal-balance">
                  <span>Outstanding balance</span>
                  <strong>
                    {formatCurrency(selectedBill._outstanding)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="due-modal-footer">
              <button
                className="due-modal-secondary"
                onClick={() => setSelectedBill(null)}
              >
                Close
              </button>
              <button
                className="due-modal-primary"
                onClick={() => {
                  const row = selectedBill;
                  const billNumber =
                    row.billNo ??
                    row.billNumber ??
                    row.invoiceNo ??
                    row.id ??
                    "—";

                  const text = [
                    `Bill: ${billNumber}`,
                    `Patient: ${row.patientName ?? row.patient ?? "—"}`,
                    `Patient ID: ${row.patientId ?? "—"}`,
                    `Status: ${row._status}`,
                    `Outstanding: ${formatCurrency(row._outstanding)}`,
                  ].join("\n");

                  const blob = new Blob([text], {
                    type: "text/plain;charset=utf-8",
                  });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");

                  link.href = url;
                  link.download = `bill-${billNumber}.txt`;
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
