
import { useState, useEffect, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  FlaskConical,
  PlusCircle,
  Gift,
  Mail,
  Save,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

import "./ManageUI.css";

const links = [
  { label: "My Account", path: "/manage/my-account", icon: UserRound },
  { label: "Lab Account", path: "/manage/lab-account", icon: FlaskConical },
  { label: "Setup a New Lab", path: "/manage/setup-lab", icon: PlusCircle },
  { label: "Referral Program", path: "/manage/referral-program", icon: Gift },
  { label: "Email Preferences", path: "/manage/email-preferences", icon: Mail },
];

export function ManageShell({ title, subtitle, icon: Icon, children }) {
  return (
    <main className="manage-page">
      <div className="manage-container">
        <Link to="/dashboard" className="manage-back-link">
          <ArrowLeft size={16} />
          <span>Back to dashboard</span>
        </Link>

        <header className="manage-header">
          <div className="manage-page-icon">
            {Icon ? <Icon size={25} strokeWidth={1.8} /> : <UserRound size={25} />}
          </div>

          <div className="manage-header-copy">
            <span className="manage-header-eyebrow">LABLIMS SETTINGS</span>
            <h1 className="manage-heading">{title}</h1>
            {subtitle && <p className="manage-subtitle">{subtitle}</p>}
          </div>
        </header>

        <nav className="manage-nav" aria-label="Account settings">
          {links.map(({ label, path, icon: NavIcon }) => (
            <NavLink
              key={path}
              to={path}
              end
              className={({ isActive }) =>
                `manage-nav-link${isActive ? " active" : ""}`
              }
            >
              <NavIcon size={17} strokeWidth={1.9} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="manage-main-content">{children}</div>

        <footer className="manage-footer">
          <span>LabLIMS</span>
          <span>Account &amp; workspace settings</span>
        </footer>
      </div>
    </main>
  );
}

export function Panel({
  title,
  description,
  children,
  className = "",
}) {
  return (
    <section className={`manage-panel ${className}`.trim()}>
      {(title || description) && (
        <div className="manage-panel-header">
          {title && <h2>{title}</h2>}
          {description && <p>{description}</p>}
        </div>
      )}

      <div className="manage-panel-body">{children}</div>
    </section>
  );
}

export function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
  options,
  rows,
  disabled = false,
}) {
  const fieldId = `manage-field-${name}`;

  const sharedProps = {
    id: fieldId,
    name,
    value: value ?? "",
    onChange,
    required,
    disabled,
    placeholder,
    "aria-required": required,
  };

  return (
    <div className="manage-field">
      <label className="manage-label" htmlFor={fieldId}>
        {label}
        {required && <span className="manage-required"> *</span>}
      </label>

      {options ? (
        <select
          {...sharedProps}
          className="manage-input manage-select"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : rows ? (
        <textarea
          {...sharedProps}
          rows={rows}
          className="manage-input manage-textarea"
        />
      ) : (
        <input
          {...sharedProps}
          type={type}
          className="manage-input"
        />
      )}
    </div>
  );
}

export function SaveButton({
  saving = false,
  children = "Save changes",
  disabled = false,
}) {
  return (
    <button
      type="submit"
      disabled={saving || disabled}
      className="manage-save-button"
    >
      {saving ? (
        <LoaderCircle size={17} className="manage-loading-icon" />
      ) : (
        <Save size={16} />
      )}

      <span>{saving ? "Saving..." : children}</span>
    </button>
  );
}

export function useStatus() {
  const [status, setStatus] = useState(null);

  const dismiss = useCallback(() => {
    setStatus(null);
  }, []);

  const success = useCallback((message) => {
    setStatus({ type: "success", message });
  }, []);

  const error = useCallback((message) => {
    setStatus({
      type: "error",
      message: message || "Something went wrong. Please try again.",
    });
  }, []);

  useEffect(() => {
    if (!status) return undefined;

    const timer = setTimeout(() => {
      setStatus(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [status]);

  return {
    status,
    setStatus,
    success,
    error,
    dismiss,
  };
}

export function StatusMessage({ status, onDismiss }) {
  if (!status) return null;

  const good = status.type === "success";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`manage-status ${
        good ? "manage-status-success" : "manage-status-error"
      }`}
    >
      <span className="manage-status-icon">
        {good ? <CheckCircle2 size={19} /> : <AlertCircle size={19} />}
      </span>

      <span className="manage-status-message">
        {status.message || status.success || status.error}
      </span>

      <button
        type="button"
        className="manage-status-close"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <X size={17} />
      </button>
    </div>
  );
}
