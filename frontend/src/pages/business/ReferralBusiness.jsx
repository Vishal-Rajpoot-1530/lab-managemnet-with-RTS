import { useMemo, useState } from "react";
import {
  Users,
  UserRoundCheck,
  BriefcaseMedical,
  TrendingUp,
  RefreshCw,
  CalendarDays,
  Search,
  ArrowUpRight,
  Handshake,
  Phone,
  RotateCcw,
  Activity,
  ChevronRight,
  Building2,
} from "lucide-react";

import DataTable from "../../components/common/DataTable";
import { businessApiService } from "../../api";
import useApiList from "../../api/core/useApiList";

import "./ReferralBusiness.css";

const load = (q) => businessApiService.referralReports(q);

const PERIODS = [
  { label: "Today", value: "today" },
  { label: "This week", value: "week" },
  { label: "This month", value: "month" },
  { label: "All time", value: "all" },
];

const numberValue = (value) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

function StatCard({ title, value, subtitle, icon: Icon, accent }) {
  return (
    <article className="rb-stat-card">
      <div className="rb-stat-top">
        <span className="rb-stat-label">{title}</span>
        <span
          className="rb-stat-icon"
          style={{ "--rb-accent": accent }}
        >
          <Icon size={20} />
        </span>
      </div>

      <strong className="rb-stat-value">{value}</strong>

      <div className="rb-stat-subtitle">
        <Activity size={14} />
        <span>{subtitle}</span>
      </div>
    </article>
  );
}

export default function ReferralBusiness() {
  const { rows, loading, error, reload } = useApiList(load);

  const [period, setPeriod] = useState("all");
  const [search, setSearch] = useState("");

  const safeRows = Array.isArray(rows) ? rows : [];

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return safeRows;

    return safeRows.filter((row) =>
      [
        row.referrerId,
        row.referrerName,
        row.contact,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      )
    );
  }, [safeRows, search]);

  const stats = useMemo(() => {
    const totalReferrers = safeRows.length;

    const totalCases = safeRows.reduce(
      (sum, row) => sum + numberValue(row.totalCases),
      0
    );

    const filteredCases = safeRows.reduce(
      (sum, row) => sum + numberValue(row.filteredCases),
      0
    );

    const activeReferrers = safeRows.filter(
      (row) => numberValue(row.filteredCases) > 0
    ).length;

    return {
      totalReferrers,
      totalCases,
      filteredCases,
      activeReferrers,
    };
  }, [safeRows]);

  const columns = useMemo(
    () => [
      {
        key: "referrerId",
        label: "REFERRER ID",
      },
      {
        key: "referrerName",
        label: "REFERRER NAME",
      },
      {
        key: "contact",
        label: "CONTACT",
      },
      {
        key: "totalCases",
        label: "TOTAL CASES",
      },
      {
        key: "filteredCases",
        label: "CASES IN PERIOD",
      },
    ],
    []
  );

  const handlePeriodChange = (value) => {
    setPeriod(value);
    reload({ period: value });
  };

  const handleRefresh = () => {
    reload({ period });
  };

  return (
    <main className="business-page rb-page">
      {/* Header */}
      <header className="rb-header">
        <div className="rb-header-content">
          <div className="rb-breadcrumb">
            Business
            <ChevronRight size={14} />
            <span>Referral reports</span>
          </div>

          <div className="rb-title-row">
            <div className="rb-title-icon">
              <Handshake size={25} />
            </div>

            <div>
              <h1>Referral business</h1>
              <p>
                Understand referral activity, track cases, and monitor
                your referral network.
              </p>
            </div>
          </div>


        </div>

        <div className="rb-header-art" aria-hidden="true">
          <div className="rb-art-ring rb-art-ring-one" />
          <div className="rb-art-ring rb-art-ring-two" />

          <div className="rb-art-main">
            <Users size={35} />
          </div>

          <span className="rb-art-bubble rb-art-bubble-one">
            <TrendingUp size={18} />
          </span>

          <span className="rb-art-bubble rb-art-bubble-two">
            <BriefcaseMedical size={18} />
          </span>
        </div>
      </header>

      {/* Summary cards */}
      <section className="rb-stats-grid">
        <StatCard
          title="Total referrers"
          value={stats.totalReferrers}
          subtitle="Registered referral sources"
          icon={Users}
          accent="#6366f1"
        />

        <StatCard
          title="Active referrers"
          value={stats.activeReferrers}
          subtitle="With cases in selected data"
          icon={UserRoundCheck}
          accent="#0d9488"
        />

        <StatCard
          title="Total cases"
          value={stats.totalCases.toLocaleString("en-IN")}
          subtitle="Cases across listed referrers"
          icon={BriefcaseMedical}
          accent="#f59e0b"
        />

        <StatCard
          title="Cases in period"
          value={stats.filteredCases.toLocaleString("en-IN")}
          subtitle="Cases matching the API filter"
          icon={TrendingUp}
          accent="#0284c7"
        />
      </section>

      {/* Report section */}
      <section className="rb-report-card">
        <div className="rb-report-header">
          <div className="rb-report-title">
            <div className="rb-report-icon">
              <Building2 size={19} />
            </div>

            <div>
              <h2>Referral summary report</h2>
              <p>
                Review referral details and case volumes.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="rb-refresh-button"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw
              size={15}
              className={loading ? "rb-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="rb-toolbar">
          <div className="rb-period-control">
            <span className="rb-toolbar-label">
              <CalendarDays size={15} />
              Report period
            </span>

            <div className="rb-period-options">
              {PERIODS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={
                    period === item.value ? "active" : ""
                  }
                  onClick={() => handlePeriodChange(item.value)}
                  disabled={loading}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <label className="rb-search">
            <Search size={17} />

            <input
              type="search"
              placeholder="Search name, ID or contact..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <button
                type="button"
                className="rb-clear-search"
                aria-label="Clear search"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="rb-error" role="alert">
            <span>{String(error)}</span>

            <button type="button" onClick={handleRefresh}>
              <RotateCcw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        <div className="rb-table-heading">
          <div>
            <h3>Referral records</h3>
            <p>
              {loading
                ? "Fetching referral information..."
                : `Showing ${filteredRows.length} of ${safeRows.length} referrers`}
            </p>
          </div>

          <span className="rb-record-count">
            <Users size={14} />
            {filteredRows.length} records
          </span>
        </div>

        {loading ? (
          <div className="rb-loading">
            <span className="rb-loader" />
            <strong>Loading referral reports</strong>
            <p>Please wait while your data is retrieved.</p>
          </div>
        ) : error ? (
          <div className="rb-empty">
            <div className="rb-empty-icon">
              <BriefcaseMedical size={24} />
            </div>
            <strong>Unable to load referral reports</strong>
            <p>Check your connection and try again.</p>
            <button
              type="button"
              className="rb-retry-button"
              onClick={handleRefresh}
            >
              Retry loading
            </button>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="rb-empty">
            <div className="rb-empty-icon">
              <Search size={24} />
            </div>
            <strong>
              {search
                ? "No matching referrers"
                : "No referral records found"}
            </strong>
            <p>
              {search
                ? "Try another name, referrer ID, or contact."
                : "Try another reporting period or refresh the data."}
            </p>

            {search && (
              <button
                type="button"
                className="rb-retry-button"
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="rb-table-wrap">
            <DataTable columns={columns} rows={filteredRows} />
          </div>
        )}

        <footer className="rb-report-footer">
          <span>
            <span className="rb-status-dot" />
            {loading ? "Updating report" : "Report view ready"}
          </span>

          <span>
            Period:{" "}
            {PERIODS.find((item) => item.value === period)?.label}
          </span>
        </footer>
      </section>

      {/* Information panel */}
      <section className="rb-info-panel">
        <div className="rb-info-icon">
          <Phone size={19} />
        </div>

        <div>
          <strong>Referral network insights</strong>
          <p>
            Use the reporting period and search filters to review referral
            activity. Case counts reflect the data returned by your API.
          </p>
        </div>
      </section>
    </main>
  );
}
