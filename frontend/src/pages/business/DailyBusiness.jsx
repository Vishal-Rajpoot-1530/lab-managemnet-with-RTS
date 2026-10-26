
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";

import DataTable from "../../components/common/DataTable";
import { businessApiService } from "../../api";
import { apiArray, apiObject } from "../../api/core/apiData";
import "./DailyBusiness.css";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const getDate = (row) =>
  row.date ?? row.createdAt ?? row.transactionDate ?? row.billDate ?? "";

const getPaymentMode = (row) =>
  row.paymentMode ?? row.paymentMethod ?? row.method ?? "Not specified";

export default function DailyBusiness() {
  const [data, setData] = useState({
    summary: {},
    transactions: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await businessApiService.daily();
      const result = apiObject(response);

      setData({
        summary: result.summary || {},
        transactions: apiArray(result.transactions || result),
      });
    } catch (err) {
      setError(err?.message || "Unable to load daily business data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const summary = data.summary;
  const transactions = data.transactions;

  const paymentOptions = useMemo(
    () => [
      ...new Set(
        transactions
          .map(getPaymentMode)
          .filter((value) => value !== "Not specified")
      ),
    ],
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((row) => {
      const searchable = [
        row.id,
        row.registrationNo,
        row.patientName,
        row.referrerName,
        row.receivedBy,
        getPaymentMode(row),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchable.includes(query);

      const matchesPayment =
        paymentFilter === "All" ||
        getPaymentMode(row) === paymentFilter;

      const rawDate = getDate(row);
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
        matchesPayment &&
        matchesStart &&
        matchesEnd
      );
    });
  }, [transactions, search, paymentFilter, startDate, endDate]);

  const totalVisibleAmount = filteredTransactions.reduce(
    (total, row) => total + Number(row.amount || 0),
    0
  );

  const exportCSV = () => {
    const headers = [
      "ID",
      "Registration No.",
      "Patient Name",
      "Referred By",
      "Amount",
      "Payment Method",
      "Received By",
      "Date",
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = filteredTransactions.map((row) => [
      row.id,
      row.registrationNo,
      row.patientName,
      row.referrerName,
      row.amount,
      getPaymentMode(row),
      row.receivedBy,
      getDate(row),
    ]);

    const content = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + content], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "daily-business-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      key: "id",
      label: "TRANSACTION",
      render: (value, row) => (
        <div className="db-transaction-cell">
          <span className="db-transaction-icon">
            <FileSpreadsheet size={17} />
          </span>
          <div>
            <strong>#{value ?? "—"}</strong>
            <span>{getDate(row) || "Date unavailable"}</span>
          </div>
        </div>
      ),
    },
    {
      key: "registrationNo",
      label: "REG. NO.",
      render: (value) => (
        <span className="db-registration">
          {value || "—"}
        </span>
      ),
    },
    {
      key: "patientName",
      label: "PATIENT",
      render: (value) => (
        <span className="db-patient-name">{value || "—"}</span>
      ),
    },
    {
      key: "referrerName",
      label: "REFERRED BY",
      render: (value) => (
        <span className="db-muted-text">{value || "—"}</span>
      ),
    },
    {
      key: "amount",
      label: "AMOUNT",
      render: (value) => (
        <strong className="db-amount">{money(value)}</strong>
      ),
    },
    {
      key: "paymentMode",
      label: "METHOD",
      render: (value, row) => {
        const method = getPaymentMode({
          ...row,
          paymentMode: value ?? row.paymentMode,
        });

        const normalized = method.toLowerCase();
        const methodClass = normalized.includes("cash")
          ? "cash"
          : normalized.includes("upi")
            ? "upi"
            : normalized.includes("card")
              ? "card"
              : "other";

        return (
          <span className={`db-method db-method-${methodClass}`}>
            <span className="db-method-dot" />
            {method}
          </span>
        );
      },
    },
    {
      key: "receivedBy",
      label: "RECEIVED BY",
      render: (value) => (
        <div className="db-received-cell">
          <span className="db-received-avatar">
            {(value || "U").trim().charAt(0).toUpperCase()}
          </span>
          <span>{value || "—"}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="business-page db-page">
      <header className="db-header">
        <div>
          <div className="db-eyebrow">
            <span className="db-eyebrow-dot" />
            FINANCE OVERVIEW
          </div>

          <h1>Daily Business</h1>

          <p>
            Monitor daily collections, expenses, and patient transactions
            from one place.
          </p>
        </div>

        <div className="db-header-actions">
          <button
            className="db-refresh-btn"
            onClick={loadData}
            disabled={loading}
            title="Refresh report"
          >
            <RefreshCw
              size={16}
              className={loading ? "db-spin" : ""}
            />
          </button>

          <button
            className="db-export-btn"
            onClick={exportCSV}
            disabled={loading || filteredTransactions.length === 0}
          >
            <Download size={17} />
            Export report
          </button>
        </div>
      </header>

      <section className="db-summary-grid">
        <article className="db-summary-card db-income-card">
          <div className="db-card-top">
            <span className="db-card-label">Total income</span>
            <span className="db-card-icon db-icon-indigo">
              <CircleDollarSign size={21} />
            </span>
          </div>

          <h2>{money(summary.totalIncome)}</h2>

          <div className="db-card-footer">
            <span className="db-card-trend">
              <TrendingUp size={14} />
              Gross collection
            </span>
          </div>
        </article>

        <article className="db-summary-card">
          <div className="db-card-top">
            <span className="db-card-label">Collection charge</span>
            <span className="db-card-icon db-icon-blue">
              <Banknote size={21} />
            </span>
          </div>

          <h2>{money(summary.collectionCharge)}</h2>

          <div className="db-card-footer">
            <span>Collection-related charges</span>
          </div>
        </article>

        <article className="db-summary-card">
          <div className="db-card-top">
            <span className="db-card-label">Expenses</span>
            <span className="db-card-icon db-icon-orange">
              <Wallet size={21} />
            </span>
          </div>

          <h2>{money(summary.expenses)}</h2>

          <div className="db-card-footer">
            <span>Recorded business expenses</span>
          </div>
        </article>

        <article className="db-summary-card db-net-card">
          <div className="db-card-top">
            <span className="db-card-label">Net income</span>
            <span className="db-card-icon db-icon-green">
              <Activity size={21} />
            </span>
          </div>

          <h2>{money(summary.netIncome)}</h2>

          <div className="db-card-footer">
            <span className="db-card-trend db-net-trend">
              <ArrowUpRight size={14} />
              After expenses
            </span>
          </div>
        </article>
      </section>

      <section className="db-transaction-panel">
        <div className="db-panel-heading">
          <div className="db-panel-title">
            <span className="db-panel-icon">
              <FileSpreadsheet size={20} />
            </span>
            <div>
              <h3>Daily transactions</h3>
              <p>View and filter your patient collection records.</p>
            </div>
          </div>

          <span className="db-record-count">
            {filteredTransactions.length} records
          </span>
        </div>

        <div className="db-toolbar">
          <div className="db-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search patient, registration or ID..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <label className="db-payment-filter">
            <SlidersHorizontal size={16} />
            <select
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value)}
              aria-label="Filter by payment method"
            >
              <option value="All">All payment methods</option>
              {paymentOptions.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </label>

          <div className="db-date-filter">
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

        <div className="db-table-info">
          <span>
            <CheckCircle2 size={15} />
            Transaction records
          </span>
          <span className="db-visible-total">
            Filtered amount: <strong>{money(totalVisibleAmount)}</strong>
          </span>
        </div>

        {error ? (
          <div className="db-error-state">
            <span className="db-state-icon db-error-icon">
              <Clock3 size={23} />
            </span>
            <h3>Unable to load transactions</h3>
            <p>{error}</p>
            <button onClick={loadData}>
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="db-loading-state">
            <span className="db-loader" />
            <p>Loading daily business records...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="db-empty-state">
            <span className="db-state-icon">
              <Search size={23} />
            </span>
            <h3>No transactions found</h3>
            <p>
              There are no records matching your current filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setPaymentFilter("All");
                setStartDate("");
                setEndDate("");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="db-table-wrap">
            <DataTable
              columns={columns}
              rows={filteredTransactions}
            />
          </div>
        )}

        <footer className="db-panel-footer">
          <span>
            <CheckCircle2 size={14} />
            Data provided by your LabLIMS records
          </span>
          <span>
            <ArrowDownToLine size={14} />
            CSV export available
          </span>
        </footer>
      </section>
    </div>
  );
}
