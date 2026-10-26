import { useEffect, useState } from "react";
import {
  Activity,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Info,
  RefreshCw,
  UserRound,
  FlaskConical,
  ArrowUpRight,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import "./Activities.css";
import { getApiToken } from "../../api/core/apiAuth";

const API_URL = "http://localhost:4000/api/business/activities";

const ACTIVITY_TYPES = [
  "All Activities",
  "Case modified",
  "Patient name updated",
  "Investigation Added",
  "Referrer changed",
];

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getToday() {
  return formatDate(new Date());
}

function formatTimestamp(value) {
  if (!value) return "Unknown time";

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value);
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatActivityTime(value) {
  if (!value) return "Time unavailable";

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value);
  }

  return parsedDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getActivityStyle(type = "") {
  const normalized = type.toLowerCase();

  if (normalized.includes("investigation")) {
    return {
      icon: FlaskConical,
      className: "investigation",
    };
  }

  if (normalized.includes("patient")) {
    return {
      icon: UserRound,
      className: "patient",
    };
  }

  if (normalized.includes("referrer")) {
    return {
      icon: Activity,
      className: "referrer",
    };
  }

  return {
    icon: FileText,
    className: "case",
  };
}

export default function Activities() {
  const [date, setDate] = useState(getToday);
  const [type, setType] = useState("All Activities");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadActivities() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({ date });

        if (type !== "All Activities") {
          params.set("type", type);
        }

        const token = getApiToken();

        const response = await fetch(`${API_URL}?${params.toString()}`, {
          signal: controller.signal,
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        });

        if (!response.ok) {
          throw new Error(
            `Unable to fetch activities (HTTP ${response.status}).`
          );
        }

        const data = await response.json();

        setActivities(
          Array.isArray(data) ? data : Array.isArray(data.items) ? data.items : []
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load activities.");
          setActivities([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadActivities();

    return () => controller.abort();
  }, [date, type]);

  function changeDate(days) {
    const current = new Date(`${date}T12:00:00`);

    if (Number.isNaN(current.getTime())) {
      setDate(getToday());
      return;
    }

    current.setDate(current.getDate() + days);
    setDate(formatDate(current));
  }

  const isToday = date === getToday();

  return (
    <div className="business-page activities-page">
      {/* Page header */}
      <header className="activities-header">
        <div className="activities-heading">
          <div className="activities-heading-icon">
            <Activity size={25} />
          </div>

          <div>
            <div className="activities-eyebrow">
              BUSINESS INTELLIGENCE
            </div>

            <div className="biz-title activities-title">
              <h1>Activity log</h1>
            </div>

            <p className="activities-subtitle">
              Track important changes and stay informed about your laboratory.
            </p>
          </div>
        </div>

        <button
          className="biz-btn activities-today-btn"
          onClick={() => setDate(getToday())}
          disabled={isToday}
        >
          <CalendarDays size={16} />
          Today
        </button>
      </header>

      {/* Information section */}
      <section className="activities-info-grid">
        <article className="activities-info-card">
          <div className="activities-info-icon blue">
            <Info size={19} />
          </div>

          <div>
            <h3>About activity tracking</h3>
            <p>
              Review recorded business-sensitive changes, including when
              they happened and who performed them.
            </p>
          </div>
        </article>

        <article className="activities-info-card monitored-card">
          <div className="activities-info-icon purple">
            <Activity size={19} />
          </div>

          <div className="monitored-content">
            <h3>Activities monitored</h3>

            <div className="activities-tags">
              <span>Patient updates</span>
              <span>Referrer changes</span>
              <span>Investigations</span>
              <span>Case modifications</span>
            </div>
          </div>
        </article>
      </section>

      {/* Activity controls */}
      <section className="activities-controls-card">
        <div className="activities-controls-heading">
          <div>
            <h2>Activity history</h2>
            <p>Select a date and activity type to review recorded events.</p>
          </div>

          <button
            className="activities-refresh-btn"
            onClick={() => {
              setDate((current) => current);
              setType((current) => current);
            }}
            title="Reload activities"
            aria-label="Reload activities"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="activities-toolbar">
          <div className="activities-date-control">
            <button
              className="activities-nav-btn"
              onClick={() => changeDate(-1)}
              aria-label="Previous day"
            >
              <ChevronLeft size={19} />
            </button>

            <label className="activities-date-input">
              <CalendarDays size={17} />

              <input
                type="date"
                value={date}
                onChange={(event) => {
                  if (event.target.value) {
                    setDate(event.target.value);
                  }
                }}
                aria-label="Select activity date"
              />
            </label>

            <button
              className="activities-nav-btn"
              onClick={() => changeDate(1)}
              disabled={isToday}
              aria-label="Next day"
            >
              <ChevronRight size={19} />
            </button>
          </div>

          <label className="activities-filter">
            <span>Activity type</span>

            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              aria-label="Filter by activity type"
            >
              {ACTIVITY_TYPES.map((activityType) => (
                <option key={activityType} value={activityType}>
                  {activityType}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="activities-results-meta">
          <span>
            <span className="activities-live-dot" />
            {loading
              ? "Fetching activity records..."
              : `${activities.length} ${
                  activities.length === 1 ? "activity" : "activities"
                } found`}
          </span>

          <span className="activities-selected-date">
            {new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </section>

      {/* Timeline */}
      <section className="activities-timeline-section">
        <div className="activities-section-heading">
          <div>
            <h2>Recorded events</h2>
            <p>A chronological view of your business activity.</p>
          </div>

          <div className="activities-timeline-label">
            <Clock3 size={15} />
            Event timeline
          </div>
        </div>

        {loading ? (
          <div className="activities-state-card">
            <div className="activities-loading-icon">
              <RefreshCw size={23} />
            </div>
            <h3>Loading activities</h3>
            <p>Fetching the latest records for your selected date.</p>
            <div className="activities-skeleton-list">
              <div />
              <div />
              <div />
            </div>
          </div>
        ) : error ? (
          <div className="activities-state-card activities-error-state">
            <div className="activities-state-icon error">
              <AlertCircle size={25} />
            </div>

            <h3>Unable to load activities</h3>
            <p>{error}</p>

            <button
              className="biz-btn primary"
              onClick={() => {
                setDate((current) => {
                  // Changing the date triggers a new request only if it differs.
                  return current === "0000-00-00" ? getToday() : current;
                });
                // Trigger a reload without changing the selected date.
                window.dispatchEvent(new Event("activities:reload"));
              }}
            >
              <RotateCcw size={16} />
              Retry
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="activities-state-card">
            <div className="activities-state-icon empty">
              <CalendarDays size={27} />
            </div>

            <h3>No activities found</h3>
            <p>
              No activity records match your selected date and filter.
              Try another date or choose all activities.
            </p>

            <button
              className="biz-btn"
              onClick={() => {
                setDate(getToday());
                setType("All Activities");
              }}
            >
              View today's activities
            </button>
          </div>
        ) : (
          <div className="activities-timeline">
            {activities.map((activity, index) => {
              const style = getActivityStyle(activity.type);
              const Icon = style.icon;

              return (
                <article
                  className="activities-event"
                  key={activity.id ?? `${activity.createdAt}-${index}`}
                >
                  <div className="activities-event-rail">
                    <div
                      className={`activities-event-icon ${style.className}`}
                    >
                      <Icon size={18} />
                    </div>

                    {index !== activities.length - 1 && (
                      <div className="activities-event-line" />
                    )}
                  </div>

                  <div className="activities-event-card">
                    <div className="activities-event-top">
                      <div className="activities-event-title-group">
                        <span
                          className={`activities-event-category ${style.className}`}
                        >
                          {activity.type || "General activity"}
                        </span>

                        <h3>
                          {activity.description || "Activity recorded"}
                        </h3>
                      </div>

                      <div className="activities-event-time">
                        <Clock3 size={14} />
                        <span>{formatActivityTime(activity.createdAt)}</span>
                      </div>
                    </div>

                    <div className="activities-event-details">
                      <div className="activities-detail-item">
                        <UserRound size={15} />
                        <span className="activities-detail-label">Owner</span>
                        <strong>{activity.owner || "System"}</strong>
                      </div>

                      <div className="activities-detail-item">
                        <FileText size={15} />
                        <span className="activities-detail-label">
                          Registration no.
                        </span>
                        <strong>{activity.regNo || "N/A"}</strong>
                      </div>

                      <div className="activities-detail-item">
                        <CalendarDays size={15} />
                        <span className="activities-detail-label">
                          Recorded at
                        </span>
                        <strong>
                          {formatTimestamp(activity.createdAt)}
                        </strong>
                      </div>
                    </div>

                    <div className="activities-event-footer">
                      <span className="activities-event-status">
                        <span />
                        Recorded
                      </span>

                      {activity.billId ? (
                        <a
                          className="activities-bill-link"
                          href={`/billing/${encodeURIComponent(
                            activity.billId
                          )}`}
                        >
                          View bill
                          <ArrowUpRight size={15} />
                        </a>
                      ) : (
                        <span className="activities-no-bill">
                          <FileText size={14} />
                          No bill linked
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <footer className="activities-footer">
        <Info size={15} />
        Activity records depend on the events captured by your system.
      </footer>
    </div>
  );
}
