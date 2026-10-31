import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ShieldCheck,
  Stethoscope,
  ReceiptIndianRupee,
  FileText,
  Activity,
  ArrowRight,
  CalendarDays,
  ClipboardList,
  TrendingUp,
  Clock3,
  UserRoundPlus,
  RefreshCw,
  CircleCheck,
  CreditCard,
  FlaskConical,
  ChevronRight,
  X,
  Search,
} from "lucide-react";

import { businessApiService } from "../../api";
import "./dashboard.css";

const REFRESH_INTERVAL = 60_000;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const rupees = (value) => `Rs.${Number(value || 0).toLocaleString("en-IN")}`;
const rupeeSymbol = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDay = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString("en-GB") : "—";
};

const formatTime = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "";
};

function timeAgo(value) {
  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60000);

  if (!Number.isFinite(minutes) || minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/* "reportUpdated" -> "Report updated" */
const humanize = (type) => {
  const text = String(type || "Activity")
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase();

  return text.charAt(0).toUpperCase() + text.slice(1);
};

function activityStyle(type) {
  const key = String(type || "").toLowerCase();

  if (/payment|transaction|receipt/.test(key)) return { tone: "purple", icon: CreditCard };
  if (/report/.test(key)) return { tone: "green", icon: CircleCheck };
  if (/bill|patient|case|created|register/.test(key)) return { tone: "blue", icon: UserRoundPlus };
  if (/cancel|delete|remove/.test(key)) return { tone: "amber", icon: ClipboardList };

  return { tone: "blue", icon: Activity };
}

/* Status words -> the status colours that already exist in dashboard.css */
const STATUS_CLASS = {
  paid: "completed",
  unpaid: "pending",
  "partially-paid": "in-progress",
};

/* ------------------------------------------------------------------ */
/* Reusable dashboard panel                                            */
/* ------------------------------------------------------------------ */

function Panel({ title, subtitle, viewAll, children }) {
  return (
    <section className="dash-panel">
      <div className="dash-panel-head">
        <div>
          <h3>{title}</h3>
          {subtitle && <small>{subtitle}</small>}
        </div>

        {viewAll && (
          <button type="button" className="dash-view-all" onClick={viewAll}>
            View all
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {children}
    </section>
  );
}

function EmptyRow({ children }) {
  return (
    <div className="dash-row" style={{ justifyContent: "center", opacity: 0.7, padding: "22px 12px" }}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* KPI card                                                            */
/* ------------------------------------------------------------------ */

function KpiCard({ label, value, meta, icon: Icon, tone, onClick }) {
  const clickable = Boolean(onClick);

  return (
    <article
      className={`dash-kpi ${clickable ? "dash-kpi-clickable" : ""}`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (clickable && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-haspopup={clickable ? "dialog" : undefined}
      title={clickable ? `View ${label.toLowerCase()} list` : undefined}
    >
      <div className={`dash-kpi-icon ${tone}`}>
        <Icon size={19} strokeWidth={2} />
      </div>

      <div className="dash-kpi-content">
        <span>{label}</span>
        <strong>{value}</strong>

        <small>
          <TrendingUp size={12} />
          {meta}
        </small>

        {clickable && <span className="dash-kpi-hint">Click to view list →</span>}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Records popup: patients, completed bills, pending bills, collection  */
/* ------------------------------------------------------------------ */

function RecordsModal({ type, lists, totals, onClose }) {
  const [search, setSearch] = useState("");

  const isPatients = type === "patients";
  const isCollection = type === "collection";
  const isCompleted = type === "completed";
  const isPending = type === "pending";

  const config = {
    patients: {
      title: "All patients",
      subtitle: "Every registered patient, newest first",
      icon: Users,
      tone: "blue",
      records: lists.patients,
      empty: "Registered patients will appear here.",
      noun: "patients",
    },
    completed: {
      title: "Completed bills",
      subtitle: "Bills with no balance left to pay",
      icon: FileText,
      tone: "green",
      records: lists.completedBills,
      empty: "Fully paid bills will appear here.",
      noun: "bills",
    },
    pending: {
      title: "Pending bills",
      subtitle: "Bills that still have a balance to pay, oldest first",
      icon: ClipboardList,
      tone: "amber",
      records: lists.pendingBills,
      empty: "There are no pending bills.",
      noun: "bills",
    },
    collection: {
      title: "Total collection",
      subtitle: "Payments received from patients, newest first",
      icon: ReceiptIndianRupee,
      tone: "purple",
      records: lists.collections,
      empty: "Payments received will appear here.",
      noun: "payments",
    },
  };

  const current = config[type] || config.patients;
  const ModalIcon = current.icon;
  const records = Array.isArray(current.records) ? current.records : [];
  const totalCount = totals?.[type] ?? records.length;

  const filteredRecords = records.filter((record) =>
    Object.values(record || {})
      .filter((value) => value != null)
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const amountOf = (record) => Number(record.amount ?? 0);
  const collectionTotal = filteredRecords.reduce((sum, record) => sum + amountOf(record), 0);

  return (
    <div
      className="dash-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="dash-record-modal" role="dialog" aria-modal="true" aria-labelledby="dash-modal-title">
        <header className="dash-modal-header">
          <div className="dash-modal-heading">
            <div className={`dash-modal-icon ${current.tone}`}>
              <ModalIcon size={22} />
            </div>

            <div>
              <h2 id="dash-modal-title">{current.title}</h2>
              <p>{current.subtitle}</p>
            </div>
          </div>

          <button type="button" className="dash-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </header>

        <div className="dash-modal-toolbar">
          <div className="dash-modal-search">
            <Search size={18} />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${current.title.toLowerCase()}...`}
              aria-label={`Search ${current.title}`}
            />

            {search && (
              <button type="button" className="dash-search-clear" onClick={() => setSearch("")} aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </div>

          <span className="dash-modal-count">
            {filteredRecords.length} of {records.length}
          </span>
        </div>

        <div className="dash-modal-list">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record, index) => {
              const name = record.name || record.patient || "Unknown patient";
              const status = record.status || "—";
              const statusKey = String(status).toLowerCase().replace(/\s+/g, "-");
              const statusClass = STATUS_CLASS[statusKey] || statusKey;

              const details = isPatients
                ? [
                    record.id,
                    record.age
                      ? /[a-z]/i.test(String(record.age))
                        ? record.age
                        : `${record.age} years`
                      : null,
                    record.gender,
                  ]
                    .filter(Boolean)
                    .join(" · ")
                : isCollection
                  ? `Reg. no. ${record.regNo ?? "—"}`
                  : `Reg. no. ${record.id ?? "—"}`;

              const lastLine = isPatients
                ? `${record.tests} · Registered ${formatDay(record.createdAt)}`
                : isCollection
                  ? `${record.test} · ${formatDay(record.time)} ${formatTime(record.time)}`
                  : `${record.test} · ${formatDay(record.createdAt)}`;

              const amountLine = isCollection
                ? `+ ${rupeeSymbol(amountOf(record))}`
                : isCompleted
                  ? `Billed ${rupeeSymbol(amountOf(record))}`
                  : isPending
                    ? `Due ${rupeeSymbol(amountOf(record))}`
                    : null;

              const avatar = String(name)
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <article className="dash-modal-record" key={`${record.billId ?? record.patientId ?? record.id}-${index}`}>
                  <div className="dash-record-avatar">{avatar || "?"}</div>

                  <div className="dash-record-info">
                    <strong>{name}</strong>
                    <span>{details}</span>
                    <small>{lastLine}</small>

                    {amountLine && <strong className="dash-modal-amount">{amountLine}</strong>}
                  </div>

                  <span className={`dash-record-status ${statusClass}`}>{status}</span>
                </article>
              );
            })
          ) : (
            <div className="dash-modal-empty">
              <Search size={28} />

              <strong>{records.length ? "No records found" : "Nothing to show yet"}</strong>

              <p>{records.length ? "Try another name, ID, test, or status." : current.empty}</p>

              {search && (
                <button type="button" onClick={() => setSearch("")}>
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {isCollection && filteredRecords.length > 0 && (
          <div className="dash-modal-total">
            <span>Total shown</span>
            <strong>{rupeeSymbol(collectionTotal)}</strong>
          </div>
        )}

        <footer className="dash-modal-footer">
          <span>
            Showing {filteredRecords.length} {current.noun}
            {totalCount > records.length ? ` (latest ${records.length} of ${totalCount})` : ""}
          </span>

          <button type="button" className="dash-modal-done" onClick={onClose}>
            Done
          </button>
        </footer>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);

    try {
      setData(await businessApiService.dashboard());
      setError("");
    } catch (err) {
      if (err?.status === 401) return window.location.assign("/login");

      setError(err?.message || "Unable to load the dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

    const timer = setInterval(load, REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [load]);

  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  const k = data?.kpis;
  const dash = "—";

  /* ---------------------------------------------------------------- */
  /* KPI cards: overall, not just today                                */
  /* ---------------------------------------------------------------- */

  const kpis = [
    {
      label: "All patients",
      value: k ? k.patients.total.toLocaleString("en-IN") : dash,
      meta: k ? `${k.patients.newToday} new today` : "Loading…",
      icon: Users,
      tone: "blue",
      modal: "patients",
    },
    {
      label: "Completed bills",
      value: k ? k.completedBills.total.toLocaleString("en-IN") : dash,
      meta: k ? `${k.completedBills.share}% of all bills` : "Loading…",
      icon: FileText,
      tone: "green",
      modal: "completed",
    },
    {
      label: "Pending bills",
      value: k ? k.pendingBills.total.toLocaleString("en-IN") : dash,
      meta: k ? `${rupees(k.pendingBills.outstanding)} outstanding` : "Loading…",
      icon: ClipboardList,
      tone: "amber",
      modal: "pending",
    },
    {
      label: "Total collection",
      value: k ? rupeeSymbol(k.collection.total) : dash,
      meta: k ? `${rupeeSymbol(k.collection.today)} received today` : "Loading…",
      icon: ReceiptIndianRupee,
      tone: "purple",
      modal: "collection",
    },
  ];

  /* ---------------------------------------------------------------- */
  /* Quick actions                                                     */
  /* ---------------------------------------------------------------- */

  const quick = [
    { label: "Employee management", description: "Manage staff access", icon: Users, path: "/manage/employees", tone: "green" },
    { label: "Browser security", description: "Review security settings", icon: ShieldCheck, path: "/manage/browser-security", tone: "blue" },
    { label: "Doctor portal", description: "Manage doctor access", icon: Stethoscope, path: "/manage/doctor-access", tone: "purple" },
  ];

  return (
    <div className="dash-page">
      <div className="dash-shell">
        <header className="dash-header">
          <div className="dash-header-copy">
            <div className="dash-eyebrow">
              <FlaskConical size={14} />
              OVERALL OVERVIEW
            </div>

            <p>Here is an overall summary of your laboratory: patients, bills and payments.</p>
          </div>

          <div className="dash-header-meta">
            <div className="dash-date">
              <CalendarDays size={17} />

              <div>
                <span>Today</span>
                <strong>{today}</strong>
              </div>
            </div>

            <button
              type="button"
              className="dash-refresh"
              aria-label="Refresh dashboard"
              title="Refresh dashboard"
              onClick={load}
              disabled={loading}
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            style={{
              margin: "0 0 16px",
              padding: "12px 16px",
              borderRadius: 10,
              background: "rgba(220,38,38,.08)",
              color: "#b42318",
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <span>{error}</span>

            <button type="button" onClick={load}>
              Try again
            </button>
          </div>
        )}

        <section className="dash-kpi-grid">
          {kpis.map((item) => (
            <KpiCard
              key={item.label}
              label={item.label}
              value={item.value}
              meta={item.meta}
              icon={item.icon}
              tone={item.tone}
              onClick={data ? () => setActiveModal(item.modal) : undefined}
            />
          ))}
        </section>

        <section className="dash-quick-grid">
          {quick.map((item) => {
            const Icon = item.icon;

            return (
              <button type="button" className="dash-quick" key={item.label} onClick={() => navigate(item.path)}>
                <span className={`dash-qicon ${item.tone}`}>
                  <Icon size={18} />
                </span>

                <span className="dash-quick-copy">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>

                <ArrowRight size={16} className="dash-arrow" />
              </button>
            );
          })}
        </section>

        <div className="dash-layout">
          <main className="dash-main">
            <div className="dash-two">
              {/* Payments due */}
              <Panel
                title="Payments due"
                subtitle={
                  data?.duesSummary?.count
                    ? `${data.duesSummary.count} bills · ${rupees(data.duesSummary.amount)} outstanding`
                    : "Outstanding patient balances"
                }
                viewAll={() => navigate("/business/due-reports")}
              >
                <div className="dash-table-head dash-payment-grid">
                  <span>PATIENT</span>
                  <span>DUE</span>
                  <span>ACCEPT</span>
                </div>

                <div className="dash-table-body">
                  {(data?.dues ?? []).map((item) => (
                    <div className="dash-row dash-payment-grid" key={item.id}>
                      <div className="dash-patient">
                        <strong>{item.patient}</strong>

                        <small>
                          Reg. {item.regNo} <i>•</i> {formatDay(item.createdAt)}
                        </small>
                      </div>

                      <span className="dash-due">{rupees(item.due)}</span>

                      <button type="button" className="dash-icon-btn" title="Open billing" onClick={() => navigate("/cases/bills")}>
                        <ReceiptIndianRupee size={15} />
                      </button>
                    </div>
                  ))}

                  {data && (data.dues ?? []).length === 0 && <EmptyRow>No outstanding balances</EmptyRow>}
                  {!data && !error && <EmptyRow>Loading…</EmptyRow>}
                </div>
              </Panel>

              {/* Recent transactions */}
              <Panel title="Recent transactions" subtitle="Latest payments received" viewAll={() => navigate("/cases/transactions")}>
                <div className="dash-table-head dash-transaction-grid">
                  <span>PATIENT</span>
                  <span>AMOUNT</span>
                  <span>BILL</span>
                </div>

                <div className="dash-table-body">
                  {(data?.transactions ?? []).map((item) => (
                    <div className="dash-row dash-transaction-grid" key={item.id}>
                      <div className="dash-patient">
                        <strong>{item.patient}</strong>
                        <small>
                          Reg. no. {item.regNo} <i>•</i> {formatDay(item.paidAt)}
                        </small>
                      </div>

                      <span className="dash-positive">+ {rupees(item.amount)}</span>

                      <button type="button" className="dash-view-bill" onClick={() => navigate("/cases/bills")}>
                        <FileText size={13} />
                        View
                      </button>
                    </div>
                  ))}

                  {data && (data.transactions ?? []).length === 0 && <EmptyRow>No payments received yet</EmptyRow>}
                  {!data && !error && <EmptyRow>Loading…</EmptyRow>}
                </div>
              </Panel>
            </div>

            {/* Recent activities */}
            <Panel title="Recent activities" subtitle="Latest operational updates" viewAll={() => navigate("/business/activities")}>
              <div className="dash-activity-list">
                {(data?.activities ?? []).map((item) => {
                  const { tone, icon: Icon } = activityStyle(item.type);

                  return (
                    <div className="dash-activity-item" key={item.id}>
                      <span className={`dash-activity-icon ${tone}`}>
                        <Icon size={16} />
                      </span>

                      <div className="dash-activity-copy">
                        <strong>{humanize(item.type)}</strong>

                        <p>
                          {item.summary}
                          {item.user ? ` · ${item.user}` : ""}
                        </p>
                      </div>

                      <span className="dash-activity-time">
                        <Clock3 size={12} />
                        {timeAgo(item.createdAt)}
                      </span>
                    </div>
                  );
                })}

                {data && (data.activities ?? []).length === 0 && <EmptyRow>No activity yet</EmptyRow>}
                {!data && !error && <EmptyRow>Loading…</EmptyRow>}
              </div>
            </Panel>
          </main>

          <aside className="dash-side">
            <div className="dash-demo">
              <div className="dash-demo-top">
                <span className="dash-demo-icon">
                  <CalendarDays size={17} />
                </span>

                <span className="dash-demo-status">Scheduled</span>
              </div>

              <h3>Product demo</h3>

              <p>Your scheduled demo details and meeting information can appear here.</p>

              <button type="button" onClick={() => navigate("/getting-started")}>
                View details
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="dash-refer">
              <div className="dash-refer-label">REFERRAL PROGRAM</div>

              <h2>
                Refer a lab
                <br />
                and save ₹3,000
              </h2>

              <div className="dash-refer-list">
                <div>
                  <span>01</span>
                  <p>Invite a lab with your referral code</p>
                </div>

                <div>
                  <span>02</span>
                  <p>They register for the free trial</p>
                </div>

                <div>
                  <span>03</span>
                  <p>Save on renewal after purchase</p>
                </div>
              </div>

              <button type="button" onClick={() => navigate("/business/referral")}>
                Refer a lab
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="dash-links">
              <button type="button">Terms &amp; Conditions</button>
              <button type="button">Privacy Policy</button>
              <button type="button">Refund Policy</button>
            </div>
          </aside>
        </div>
      </div>

      {activeModal && data && (
        <RecordsModal
          type={activeModal}
          lists={{
            patients: data.patients ?? [],
            completedBills: data.completedBills ?? [],
            pendingBills: data.pendingBills ?? [],
            collections: data.collections ?? [],
          }}
          totals={{
            patients: data.kpis.patients.total,
            completed: data.kpis.completedBills.total,
            pending: data.kpis.pendingBills.total,
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}