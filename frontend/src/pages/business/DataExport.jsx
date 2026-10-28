import { useEffect, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  Users,
  ReceiptText,
  ArrowLeftRight,
  FlaskConical,
  Wallet,
  CalendarDays,
  Clock3,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  History,
  ArrowRight,
  FileText,
} from "lucide-react";

import { businessApiService } from "../../api";
import "./dataexport.css";

// The limits are also enforced by the server.
const EXPORT_ENTITIES = [
  { label: "Bill", description: "Billing and case records", icon: ReceiptText, color: "#6366f1", limit: 31 },
  { label: "Patient", description: "Patient information", icon: Users, color: "#0d9488", limit: 365 },
  { label: "Transaction", description: "Payment transactions", icon: ArrowLeftRight, color: "#d97706", limit: 31 },
  { label: "Lab report", description: "Laboratory report records", icon: FlaskConical, color: "#0284c7", limit: 31 },
  { label: "Expense", description: "Expenses and cost records", icon: Wallet, color: "#db2777", limit: 365 },
];

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatDateTime = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString("en-IN");
};

const getDuration = (from, to) => {
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);

  return Math.floor((end - start) / 86400000) + 1;
};

/** Saves CSV text as a file in the browser. */
function saveCsv(name, csv) {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function DataExport() {
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [entity, setEntity] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const selectedEntity = EXPORT_ENTITIES.find((item) => item.label === entity);

  const handleError = (err) => {
    if (err?.status === 401) return window.location.assign("/login");
    setError(err?.message || "Something went wrong. Please try again.");
  };

  // Past exports are kept on the server.
  useEffect(() => {
    businessApiService
      .exportHistory()
      .then(setHistory)
      .catch(handleError)
      .finally(() => setHistoryLoading(false));
  }, []);

  const run = async () => {
    setError("");

    if (!entity || !fromDate || !toDate) {
      setError("Please select an entity and both dates.");
      return;
    }

    if (fromDate > toDate) {
      setError("The start date cannot be after the end date.");
      return;
    }

    if (getDuration(fromDate, toDate) > selectedEntity.limit) {
      setError(
        `${entity} exports are limited to ${selectedEntity.limit} days. Please select a shorter date range.`
      );
      return;
    }

    setRunning(true);

    try {
      const { export: record, csv } = await businessApiService.exportRun({
        entity,
        from: fromDate,
        to: toDate,
      });

      saveCsv(record.name, csv);
      setHistory((previous) => [record, ...previous]);
    } catch (err) {
      handleError(err);
    } finally {
      setRunning(false);
    }
  };

  const downloadAgain = async (item) => {
    setError("");
    setDownloadingId(item.id);

    try {
      const file = await businessApiService.exportFile(item.id);
      saveCsv(file.name || item.name, file.csv);
    } catch (err) {
      handleError(err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <main className="business-page data-export-page">
      {/* Page heading */}
      <header className="de-page-header">
        <div className="de-heading-content">
          <div className="de-breadcrumb">
            Business
            <ArrowRight size={13} />
            <span>Data export</span>
          </div>

          <div className="de-title-row">
            <div className="de-title-icon">
              <FileSpreadsheet size={25} />
            </div>

            <div>
              <h1>Data export</h1>
              <p>Export and manage your laboratory data in one place.</p>
            </div>
          </div>
        </div>

        <div className="de-header-illustration" aria-hidden="true">
          <div className="de-illustration-orbit de-orbit-one" />
          <div className="de-illustration-orbit de-orbit-two" />
          <div className="de-illustration-card">
            <FileSpreadsheet size={37} />
            <span>CSV</span>
          </div>
          <span className="de-float-icon de-float-one">
            <Download size={18} />
          </span>
          <span className="de-float-icon de-float-two">
            <ShieldCheck size={18} />
          </span>
        </div>
      </header>

      {/* Export history */}
      <section className="de-history-section">
        <div className="de-section-heading">
          <div className="de-section-icon">
            <History size={19} />
          </div>

          <div>
            <h2>Export history</h2>
            <p>Your most recent exports. Download them again any time.</p>
          </div>

          <span className="de-history-count">
            {history.length} {history.length === 1 ? "file" : "files"}
          </span>
        </div>

        {historyLoading ? (
          <div className="de-empty-history">
            <div className="de-empty-icon">
              <Clock3 size={25} />
            </div>

            <div>
              <strong>Loading exports…</strong>
            </div>
          </div>
        ) : history.length === 0 ? (
          <div className="de-empty-history">
            <div className="de-empty-icon">
              <FileText size={25} />
            </div>

            <div>
              <strong>No exports yet</strong>
              <p>Your generated export files will appear here.</p>
            </div>

            <span className="de-empty-badge">Awaiting export</span>
          </div>
        ) : (
          <div className="de-history-list">
            {history.map((item) => (
              <article className="de-history-item" key={item.id}>
                <div className="de-file-icon">
                  <FileSpreadsheet size={22} />
                </div>

                <div className="de-file-details">
                  <strong>{item.name}</strong>
                  <span>
                    {item.entity} · {formatDate(item.fromDate)} – {formatDate(item.toDate)}
                    {typeof item.rows === "number" ? ` · ${item.rows} rows` : ""}
                  </span>
                  <small>
                    Created {formatDateTime(item.createdAt)}
                    {item.createdBy ? ` by ${item.createdBy}` : ""}
                  </small>
                </div>

                <span className="de-ready-status">
                  <CheckCircle2 size={14} />
                  {item.status || "Ready"}
                </span>

                <button
                  type="button"
                  className="de-download-again"
                  title="Download CSV again"
                  aria-label={`Download ${item.name} again`}
                  disabled={downloadingId === item.id}
                  onClick={() => downloadAgain(item)}
                >
                  <Download size={17} />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Export form */}
      <section className="de-export-card">
        <div className="de-form-header">
          <div>
            <span className="de-overline">EXPORT CONFIGURATION</span>
            <h2>Create a new export</h2>
            <p>Choose your data category and date range to generate a CSV file.</p>
          </div>

          <div className="de-format-badge">
            <FileSpreadsheet size={17} />
            CSV format
          </div>
        </div>

        <div className="de-form-divider" />

        {/* Entity selection */}
        <div className="de-field-section">
          <div className="de-field-heading">
            <span className="de-step-number">01</span>
            <div>
              <h3>Select data entity</h3>
              <p>Choose which records you want to export.</p>
            </div>
          </div>

          <div className="de-entity-grid">
            {EXPORT_ENTITIES.map((item) => {
              const Icon = item.icon;
              const isSelected = entity === item.label;

              return (
                <button
                  type="button"
                  key={item.label}
                  className={`de-entity-option ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    setEntity(item.label);
                    setError("");
                  }}
                  aria-pressed={isSelected}
                  style={{ "--entity-color": item.color }}
                >
                  <span className="de-entity-icon">
                    <Icon size={21} />
                  </span>

                  <span className="de-entity-copy">
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>

                  <span className="de-entity-check">
                    <CheckCircle2 size={17} />
                  </span>
                </button>
              );
            })}
          </div>

          {selectedEntity && (
            <div className="de-selection-info">
              <ShieldCheck size={17} />
              <span>
                <strong>{selectedEntity.label}</strong> export supports a maximum date range of{" "}
                <strong>{selectedEntity.limit} days</strong>.
              </span>
            </div>
          )}
        </div>

        {/* Date selection */}
        <div className="de-field-section de-date-section">
          <div className="de-field-heading">
            <span className="de-step-number">02</span>
            <div>
              <h3>Choose date range</h3>
              <p>Select the start and end dates for your records.</p>
            </div>
          </div>

          <div className="de-date-grid">
            <label className="de-date-field">
              <span>
                From date <b>*</b>
              </span>

              <div className="de-date-input-wrap">
                <CalendarDays size={18} />
                <input
                  type="date"
                  value={fromDate}
                  max={toDate || undefined}
                  onChange={(event) => {
                    setFromDate(event.target.value);
                    setError("");
                  }}
                  required
                />
              </div>
            </label>

            <div className="de-date-connector">
              <ArrowRight size={17} />
            </div>

            <label className="de-date-field">
              <span>
                To date <b>*</b>
              </span>

              <div className="de-date-input-wrap">
                <CalendarDays size={18} />
                <input
                  type="date"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(event) => {
                    setToDate(event.target.value);
                    setError("");
                  }}
                  required
                />
              </div>
            </label>
          </div>

          {fromDate && toDate && fromDate <= toDate && (
            <div className="de-duration-note">
              <Clock3 size={15} />
              Selected duration: <strong>{getDuration(fromDate, toDate)} days</strong>
              {selectedEntity && getDuration(fromDate, toDate) > selectedEntity.limit && (
                <span className="de-duration-error">Exceeds the {selectedEntity.limit}-day limit</span>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="de-error-message" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="de-form-footer">
          <div className="de-secure-note">
            <ShieldCheck size={18} />
            <span>
              <strong>Data export</strong>
              <small>Review the selected entity and dates before exporting.</small>
            </span>
          </div>

          <button type="button" className="de-export-button" onClick={run} disabled={running}>
            <Download size={18} />
            {running ? "Exporting…" : "Run export"}
            <ArrowRight size={17} />
          </button>
        </div>
      </section>

      {/* Export limits */}
      <section className="de-limits-card">
        <div className="de-limits-heading">
          <div className="de-limits-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <h2>Export duration limits</h2>
            <p>Maximum date range allowed for each data category.</p>
          </div>
        </div>

        <div className="de-limits-grid">
          {EXPORT_ENTITIES.map((item) => {
            const Icon = item.icon;

            return (
              <div className="de-limit-item" key={item.label}>
                <span className="de-limit-icon" style={{ "--entity-color": item.color }}>
                  <Icon size={18} />
                </span>

                <div>
                  <strong>{item.label}</strong>
                  <span>Up to {item.limit} days</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}