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
  AlertCircle,
  UserRoundPlus,
  RefreshCw,
  CircleCheck,
  CreditCard,
  FlaskConical,
  ChevronRight,
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
            View all
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {children}
    </section>
  );
}

function KpiCard({ label, value, meta, icon: Icon, tone }) {
  return (
    <article className="dash-kpi">
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
      </div>
    </article>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

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

  return (
    <div className="dash-page">
      <div className="dash-shell">

        {/* HEADER */}
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

        {/* KPI CARDS */}
        <section className="dash-kpi-grid">
          {kpis.map((item) => (
            <KpiCard
              key={item.label}
              label={item.label}
              value={item.value}
              meta={item.meta}
              icon={item.icon}
              tone={item.tone}
            />
          ))}
        </section>

        {/* QUICK ACTIONS */}
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

                <ArrowRight
                  size={16}
                  className="dash-arrow"
                />
              </button>
            );
          })}
        </section>

        {/* MAIN LAYOUT */}
        <div className="dash-layout">

          {/* MAIN COLUMN */}
          <main className="dash-main">

            {/* PAYMENTS + TRANSACTIONS */}
            <div className="dash-two">

              {/* PAYMENTS DUE */}
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

                      <span className="dash-due">
                        {item[3]}
                      </span>

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

              {/* RECENT TRANSACTIONS */}
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

                        <small>
                          Reg. no. {item[1]}
                        </small>
                      </div>

                      <span className="dash-positive">
                        {item[2]}
                      </span>

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

            {/* ACTIVITIES */}
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
                      <span
                        className={`dash-activity-icon ${item.tone}`}
                      >
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

          {/* SIDEBAR */}
          <aside className="dash-side">

            {/* SMS ALERT */}
            <div className="dash-alert">
              <span className="dash-alert-icon">
                <AlertCircle size={16} />
              </span>

              <div>
                <strong>SMS balance is low</strong>
                <p>
                  Review your messaging balance before sending
                  patient notifications.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/manage/employees")}
                aria-label="Open SMS settings"
              >
                <ArrowRight size={14} />
              </button>
            </div>

            {/* DEMO */}
            <div className="dash-demo">
              <div className="dash-demo-top">
                <span className="dash-demo-icon">
                  <CalendarDays size={17} />
                </span>

                <span className="dash-demo-status">
                  Scheduled
                </span>
              </div>

              <h3>Product demo</h3>

              <p>
                Your scheduled demo details and meeting
                information can appear here.
              </p>

              <button
                type="button"
                onClick={() => navigate("/getting-started")}
              >
                View details
                <ArrowRight size={14} />
              </button>
            </div>

            {/* REFERRAL */}
            <div className="dash-refer">
              <div className="dash-refer-label">
                REFERRAL PROGRAM
              </div>

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
                Refer a lab
                <ArrowRight size={15} />
              </button>
            </div>

            {/* SYSTEM STATUS */}
            <div className="dash-system">
              <div className="dash-system-title">
                <span className="dash-status-dot" />
                System status
              </div>

              <div className="dash-system-row">
                <span>Application</span>
                <strong>Operational</strong>
              </div>

              <div className="dash-system-row">
                <span>Database</span>
                <strong>Operational</strong>
              </div>
            </div>

            {/* FOOTER LINKS */}
            <div className="dash-links">
              <button type="button">
                Terms &amp; Conditions
              </button>

              <button type="button">
                Privacy Policy
              </button>

              <button type="button">
                Refund Policy
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}