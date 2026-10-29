
import { useEffect, useState } from "react";
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

import "./dashboard.css";

const dues = [
  ["Demo Patient 01", "37431", "12/09/2026", "Rs.1,500"],
  ["Demo Patient 02", "37220", "10/09/2026", "Rs.1,100"],
  ["Demo Patient 03", "36961", "08/09/2026", "Rs.8,800"],
  ["Demo Patient 04", "35903", "25/08/2026", "Rs.2,100"],
  ["Demo Patient 05", "35860", "24/08/2026", "Rs.2,100"],
  ["Demo Patient 06", "35595", "21/08/2026", "Rs.2,100"],
];

const transactions = [
  ["Demo Patient A", "38388", "+ Rs.3,200"],
  ["Demo Patient B", "38385", "+ Rs.3,200"],
  ["Demo Patient C", "38384", "+ Rs.800"],
  ["Demo Patient D", "38383", "+ Rs.1,200"],
  ["Demo Patient E", "38382", "+ Rs.200"],
  ["Demo Patient F", "38381", "+ Rs.800"],
];

const activities = [
  {
    title: "Report completed",
    text: "CBC report marked ready for review.",
    time: "10 min ago",
    tone: "green",
    icon: CircleCheck,
  },
  {
    title: "New patient registered",
    text: "A new patient case was created.",
    time: "28 min ago",
    tone: "blue",
    icon: UserRoundPlus,
  },
  {
    title: "Payment received",
    text: "₹3,200 payment recorded against a bill.",
    time: "42 min ago",
    tone: "purple",
    icon: CreditCard,
  },
  {
    title: "Report awaiting review",
    text: "A diagnostic report is waiting for verification.",
    time: "1 hr ago",
    tone: "amber",
    icon: ClipboardList,
  },
];

const kpis = [
  {
    label: "Today's patients",
    value: "124",
    meta: "+8.4% vs yesterday",
    icon: Users,
    tone: "blue",
  },
  {
    label: "Reports completed",
    value: "86",
    meta: "12 awaiting review",
    icon: FileText,
    tone: "green",
  },
  {
    label: "Pending reports",
    value: "18",
    meta: "6 due today",
    icon: ClipboardList,
    tone: "amber",
  },
  {
    label: "Today's collection",
    value: "₹48,250",
    meta: "+6.2% vs yesterday",
    icon: ReceiptIndianRupee,
    tone: "purple",
  },
];

const todayPatients = [
  { id: "37431", name: "Demo Patient 01", age: 28, gender: "Male", tests: "CBC, LFT", status: "In Progress" },
  { id: "37432", name: "Demo Patient 02", age: 34, gender: "Female", tests: "Thyroid Profile", status: "Registered" },
  { id: "37433", name: "Demo Patient 03", age: 42, gender: "Male", tests: "Lipid Profile", status: "Completed" },
  { id: "37434", name: "Demo Patient 04", age: 25, gender: "Female", tests: "Blood Glucose", status: "In Progress" },
  { id: "37435", name: "Demo Patient 05", age: 51, gender: "Male", tests: "HbA1c", status: "Registered" },
  { id: "37436", name: "Demo Patient 06", age: 31, gender: "Female", tests: "CBC", status: "Completed" },
  { id: "37437", name: "Demo Patient 07", age: 39, gender: "Male", tests: "KFT, LFT", status: "In Progress" },
  { id: "37438", name: "Demo Patient 08", age: 46, gender: "Female", tests: "Vitamin D", status: "Registered" },
  { id: "37439", name: "Demo Patient 09", age: 29, gender: "Male", tests: "Lipid Profile", status: "Completed" },
  { id: "37440", name: "Demo Patient 10", age: 36, gender: "Female", tests: "Thyroid Profile", status: "In Progress" },
];

const completedReports = [
  { id: "RPT-1001", patient: "Demo Patient 01", test: "Complete Blood Count", time: "09:15 AM", status: "Completed" },
  { id: "RPT-1002", patient: "Demo Patient 02", test: "Liver Function Test", time: "09:30 AM", status: "Completed" },
  { id: "RPT-1003", patient: "Demo Patient 03", test: "Thyroid Profile", time: "09:45 AM", status: "Completed" },
  { id: "RPT-1004", patient: "Demo Patient 04", test: "Blood Glucose", time: "10:00 AM", status: "Completed" },
  { id: "RPT-1005", patient: "Demo Patient 05", test: "Lipid Profile", time: "10:20 AM", status: "Completed" },
  { id: "RPT-1006", patient: "Demo Patient 06", test: "HbA1c", time: "10:40 AM", status: "Completed" },
  { id: "RPT-1007", patient: "Demo Patient 07", test: "Kidney Function Test", time: "11:00 AM", status: "Completed" },
  { id: "RPT-1008", patient: "Demo Patient 08", test: "Vitamin D", time: "11:25 AM", status: "Completed" },
  { id: "RPT-1009", patient: "Demo Patient 09", test: "Lipid Profile", time: "11:45 AM", status: "Completed" },
  { id: "RPT-1010", patient: "Demo Patient 10", test: "Thyroid Profile", time: "12:10 PM", status: "Completed" },
];

const pendingReports = [
  { id: "RPT-2001", patient: "Demo Patient 11", test: "Complete Blood Count", time: "10:15 AM", status: "Pending Review" },
  { id: "RPT-2002", patient: "Demo Patient 12", test: "Liver Function Test", time: "10:30 AM", status: "In Progress" },
  { id: "RPT-2003", patient: "Demo Patient 13", test: "Thyroid Profile", time: "11:00 AM", status: "Pending Review" },
  { id: "RPT-2004", patient: "Demo Patient 14", test: "Lipid Profile", time: "11:20 AM", status: "In Progress" },
  { id: "RPT-2005", patient: "Demo Patient 15", test: "Blood Glucose", time: "11:45 AM", status: "Pending Review" },
];

function Panel({ title, subtitle, viewAll, children }) {
  return (
    <section className="dash-panel">
      <div className="dash-panel-head">
        <div>
          <h3>{title}</h3>
          {subtitle && <small>{subtitle}</small>}
        </div>

        {viewAll && (
          <button
            type="button"
            className="dash-view-all"
            onClick={viewAll}
          >
            View all <ChevronRight size={14} />
          </button>
        )}
      </div>

      {children}
    </section>
  );
}

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

        {clickable && (
          <span className="dash-kpi-hint">Click to view list →</span>
        )}
      </div>
    </article>
  );
}

function RecordsModal({ type, onClose, onViewPatient, onViewReport }) {
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const isPatients = type === "patients";
  const isPending = type === "pending";

  const records = isPatients
    ? todayPatients
    : isPending
      ? pendingReports
      : completedReports;

  const title = isPatients
    ? "Today's patients"
    : isPending
      ? "Pending reports"
      : "Completed reports";

  const subtitle = isPatients
    ? "Patient registrations and test details"
    : isPending
      ? "Reports awaiting completion or verification"
      : "Reports completed by the laboratory today";

  const filteredRecords = records.filter((record) =>
    Object.values(record)
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (selectedRecord) {
          setSelectedRecord(null);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, selectedRecord]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const openRecord = (record) => {
    setSelectedRecord(record);

    if (isPatients) {
      onViewPatient(record);
    } else {
      onViewReport(record);
    }
  };

  return (
    <div
      className="dash-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="dash-record-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dash-modal-title"
      >
        <header className="dash-modal-header">
          <div className="dash-modal-heading">
            <div className={`dash-modal-icon ${isPatients ? "blue" : "green"}`}>
              {isPatients ? <Users size={22} /> : <FileText size={22} />}
            </div>

            <div>
              <h2 id="dash-modal-title">{title}</h2>
              <p>{subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            className="dash-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
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
              placeholder={
                isPatients
                  ? "Search patient, ID, test or status..."
                  : "Search patient, report ID or test..."
              }
              aria-label={`Search ${title}`}
            />

            {search && (
              <button
                type="button"
                className="dash-search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
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
            filteredRecords.map((record) => {
              const name = isPatients ? record.name : record.patient;

              const details = isPatients
                ? `${record.id} · ${record.age} years · ${record.gender}`
                : `${record.id} · ${record.time}`;

              const test = isPatients ? record.tests : record.test;

              const statusClass = record.status
                .toLowerCase()
                .replace(/\s+/g, "-");

              return (
                <article className="dash-modal-record" key={record.id}>
                  <div className="dash-record-avatar">
                    {name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div className="dash-record-info">
                    <strong>{name}</strong>
                    <span>{details}</span>
                    <small>{test}</small>
                  </div>

                  <div className="dash-record-actions">
                    <span className={`dash-record-status ${statusClass}`}>
                      {record.status}
                    </span>

                    <button
                      type="button"
                      className="dash-record-view"
                      onClick={() => openRecord(record)}
                    >
                      {isPatients ? "View details" : "View report"}
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="dash-modal-empty">
              <Search size={28} />
              <strong>No records found</strong>
              <p>Try another name, ID, test, or status.</p>

              <button type="button" onClick={() => setSearch("")}>
                Clear search
              </button>
            </div>
          )}
        </div>

        <footer className="dash-modal-footer">
          <span>
            Showing {filteredRecords.length}{" "}
            {isPatients ? "patients" : "reports"}
          </span>

          <button
            type="button"
            className="dash-modal-done"
            onClick={onClose}
          >
            Done
          </button>
        </footer>
      </section>

      {selectedRecord && (
        <div
          className="dash-detail-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedRecord(null);
            }
          }}
        >
          <section
            className="dash-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dash-detail-title"
          >
            <header className="dash-detail-header">
              <div>
                <span className="dash-detail-eyebrow">
                  {isPatients ? "PATIENT INFORMATION" : "LABORATORY REPORT"}
                </span>

                <h2 id="dash-detail-title">
                  {isPatients ? selectedRecord.name : selectedRecord.id}
                </h2>

                <p>
                  {isPatients
                    ? `Patient ID: ${selectedRecord.id}`
                    : selectedRecord.patient}
                </p>
              </div>

              <button
                type="button"
                className="dash-modal-close"
                onClick={() => setSelectedRecord(null)}
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </header>

            <div className="dash-detail-body">
              <div className="dash-detail-summary">
                <span className="dash-detail-summary-icon">
                  {isPatients ? <Users size={24} /> : <FileText size={24} />}
                </span>

                <div>
                  <strong>
                    {isPatients
                      ? selectedRecord.name
                      : selectedRecord.test}
                  </strong>

                  <p>
                    {isPatients
                      ? selectedRecord.tests
                      : `Report ${selectedRecord.id}`}
                  </p>
                </div>

                <span
                  className={`dash-record-status ${selectedRecord.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {selectedRecord.status}
                </span>
              </div>

              <div className="dash-detail-grid">
                {Object.entries(selectedRecord).map(([key, value]) => (
                  <div className="dash-detail-field" key={key}>
                    <span>
                      {key === "id"
                        ? isPatients
                          ? "Patient ID"
                          : "Report ID"
                        : key === "patient"
                          ? "Patient name"
                          : key === "tests"
                            ? "Requested tests"
                            : key === "test"
                              ? "Test name"
                              : key === "time"
                                ? "Report time"
                                : key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>

                    <strong>{String(value)}</strong>
                  </div>
                ))}
              </div>

              {!isPatients && (
                <div className="dash-detail-notice">
                  <Activity size={18} />
                  <p>
                    This is a report summary. Actual test results and
                    verification information must be loaded from the
                    laboratory report record.
                  </p>
                </div>
              )}
            </div>

            <footer className="dash-detail-footer">
              <button
                type="button"
                className="dash-detail-back"
                onClick={() => setSelectedRecord(null)}
              >
                Back to list
              </button>

              <button
                type="button"
                className="dash-modal-done"
                onClick={onClose}
              >
                Close
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  const quick = [
    {
      label: "Employee management",
      description: "Manage staff access",
      icon: Users,
      path: "/manage/employees",
      tone: "green",
    },
    {
      label: "Browser security",
      description: "Review security settings",
      icon: ShieldCheck,
      path: "/manage/browser-security",
      tone: "blue",
    },
    {
      label: "Doctor portal",
      description: "Manage doctor access",
      icon: Stethoscope,
      path: "/manage/doctor-access",
      tone: "purple",
    },
  ];

  const handleViewPatient = (patient) => {
    // The selected patient is displayed in the details popup.
    // Connect this callback to the patient-details route/API when available.
  };

  const handleViewReport = (report) => {
    // The selected report is displayed in the details popup.
    // Connect this callback to the report-details route/API when available.
  };

  return (
    <div className="dash-page">
      <div className="dash-shell">
        <header className="dash-header">
          <div className="dash-header-copy">
            <div className="dash-eyebrow">
              <FlaskConical size={14} />
              LABORATORY OVERVIEW
            </div>

            <p>
              Here is what is happening across your laboratory today.
            </p>
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
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </header>

        <section className="dash-kpi-grid">
          {kpis.map((item) => (
            <KpiCard
              key={item.label}
              label={item.label}
              value={item.value}
              meta={item.meta}
              icon={item.icon}
              tone={item.tone}
              onClick={
                item.label === "Today's patients"
                  ? () => setActiveModal("patients")
                  : item.label === "Reports completed"
                    ? () => setActiveModal("reports")
                    : item.label === "Pending reports"
                      ? () => setActiveModal("pending")
                      : undefined
              }
            />
          ))}
        </section>

        <section className="dash-quick-grid">
          {quick.map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                className="dash-quick"
                key={item.label}
                onClick={() => navigate(item.path)}
              >
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
              <Panel
                title="Payments due"
                subtitle="Outstanding patient balances"
                viewAll={() => navigate("/business/due-reports")}
              >
                <div className="dash-table-head dash-payment-grid">
                  <span>PATIENT</span>
                  <span>DUE</span>
                  <span>ACCEPT</span>
                </div>

                <div className="dash-table-body">
                  {dues.map((item, index) => (
                    <div
                      className="dash-row dash-payment-grid"
                      key={`${item[1]}-${index}`}
                    >
                      <div className="dash-patient">
                        <strong>{item[0]}</strong>
                        <small>
                          Reg. {item[1]} <i>•</i> {item[2]}
                        </small>
                      </div>

                      <span className="dash-due">{item[3]}</span>

                      <button
                        type="button"
                        className="dash-icon-btn"
                        title="Open billing"
                        onClick={() => navigate("/cases/bills")}
                      >
                        <ReceiptIndianRupee size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel
                title="Recent transactions"
                subtitle="Payments received today"
                viewAll={() => navigate("/cases/transactions")}
              >
                <div className="dash-table-head dash-transaction-grid">
                  <span>PATIENT</span>
                  <span>AMOUNT</span>
                  <span>BILL</span>
                </div>

                <div className="dash-table-body">
                  {transactions.map((item, index) => (
                    <div
                      className="dash-row dash-transaction-grid"
                      key={`${item[1]}-${index}`}
                    >
                      <div className="dash-patient">
                        <strong>{item[0]}</strong>
                        <small>Reg. no. {item[1]}</small>
                      </div>

                      <span className="dash-positive">{item[2]}</span>

                      <button
                        type="button"
                        className="dash-view-bill"
                        onClick={() => navigate("/cases/bills")}
                      >
                        <FileText size={13} />
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            <Panel
              title="Recent activities"
              subtitle="Latest operational updates"
              viewAll={() => navigate("/business/activities")}
            >
              <div className="dash-activity-list">
                {activities.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      className="dash-activity-item"
                      key={`${item.title}-${index}`}
                    >
                      <span className={`dash-activity-icon ${item.tone}`}>
                        <Icon size={16} />
                      </span>

                      <div className="dash-activity-copy">
                        <strong>{item.title}</strong>
                        <p>{item.text}</p>
                      </div>

                      <span className="dash-activity-time">
                        <Clock3 size={12} />
                        {item.time}
                      </span>
                    </div>
                  );
                })}
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
              <p>
                Your scheduled demo details and meeting information can
                appear here.
              </p>

              <button
                type="button"
                onClick={() => navigate("/getting-started")}
              >
                View details <ArrowRight size={14} />
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

              <button
                type="button"
                onClick={() => navigate("/business/referral")}
              >
                Refer a lab <ArrowRight size={15} />
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

      {activeModal && (
        <RecordsModal
          type={activeModal}
          onClose={() => setActiveModal(null)}
          onViewPatient={handleViewPatient}
          onViewReport={handleViewReport}
        />
      )}
    </div>
  );
}
