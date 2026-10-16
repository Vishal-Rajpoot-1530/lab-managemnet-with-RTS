
import { useState } from "react";
import {
  FlaskConical,
  FileText,
  CreditCard,
  Bell,
  Save,
  Settings,
  CheckCircle2,
} from "lucide-react";
import "./SettingsPages.css";

const configs = {
  lab: {
    title: "Lab Settings",
    description: "Configure your laboratory details and preferences.",
    icon: FlaskConical,
    fields: [
      { name: "Laboratory name", placeholder: "Enter laboratory name" },
      { name: "Laboratory code", placeholder: "Enter lab code" },
      { name: "Contact number", placeholder: "Enter contact number" },
      { name: "Email address", placeholder: "Enter email address" },
      { name: "Laboratory address", placeholder: "Enter full address", wide: true },
    ],
  },

  reports: {
    title: "Report Settings",
    description: "Customize the appearance and information on reports.",
    icon: FileText,
    fields: [
      { name: "Report header", placeholder: "Enter report heading" },
      { name: "Report footer", placeholder: "Enter footer text" },
      { name: "Authorized signatory", placeholder: "Enter signatory name" },
      { name: "Report prefix", placeholder: "e.g. LAB-RPT-" },
    ],
  },

  billing: {
    title: "Billing Settings",
    description: "Manage invoice numbering and billing preferences.",
    icon: CreditCard,
    fields: [
      { name: "Invoice prefix", placeholder: "e.g. INV-" },
      { name: "Currency", type: "select", options: ["INR (₹)", "USD ($)"] },
      { name: "Tax percentage", type: "number", placeholder: "Enter tax percentage" },
      { name: "Payment terms (days)", type: "number", placeholder: "e.g. 30" },
    ],
  },

  notifications: {
    title: "Notification Settings",
    description: "Choose which laboratory updates you want to receive.",
    icon: Bell,
    fields: [
      { name: "Email notifications", type: "toggle" },
      { name: "New test order alerts", type: "toggle" },
      { name: "Report completion alerts", type: "toggle" },
      { name: "Payment reminder alerts", type: "toggle" },
    ],
  },
};

function SettingsPage({ page }) {
  const config = configs[page];
  const Icon = config.icon;

  const [values, setValues] = useState(() =>
    Object.fromEntries(
      config.fields.map((field) => [
        field.name,
        field.type === "toggle" ? true : "",
      ])
    )
  );

  const [saved, setSaved] = useState(false);

  function updateValue(name, value) {
    setValues((previous) => ({ ...previous, [name]: value }));
    setSaved(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSaved(true);
    // Connect this handler to your backend API to persist settings.
  }

  return (
    <main className="settings-page">
      <div className="settings-breadcrumb">
        <Settings size={15} />
        <span>Settings</span>
        <span>/</span>
        <span>{config.title}</span>
      </div>

      <header className="settings-heading">
        <div className="settings-heading-icon">
          <Icon size={25} />
        </div>
        <div>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
      </header>

      <form className="settings-card" onSubmit={handleSubmit}>
        <div className="settings-card-heading">
          <div>
            <h2>General configuration</h2>
            <p>Update the preferences for your LabLIMS workspace.</p>
          </div>
        </div>

        <div className="settings-fields">
          {config.fields.map((field) => (
            <label
              className={`settings-field ${field.wide ? "settings-field-wide" : ""}`}
              key={field.name}
            >
              <span>{field.name}</span>

              {field.type === "toggle" ? (
                <span className="settings-toggle-row">
                  <span className="settings-toggle-text">
                    {values[field.name] ? "Enabled" : "Disabled"}
                  </span>
                  <input
                    className="settings-toggle"
                    type="checkbox"
                    checked={values[field.name]}
                    onChange={(event) =>
                      updateValue(field.name, event.target.checked)
                    }
                  />
                </span>
              ) : field.type === "select" ? (
                <select
                  value={values[field.name]}
                  onChange={(event) =>
                    updateValue(field.name, event.target.value)
                  }
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={values[field.name]}
                  onChange={(event) =>
                    updateValue(field.name, event.target.value)
                  }
                />
              )}
            </label>
          ))}
        </div>

        <div className="settings-card-footer">
          {saved && (
            <span className="settings-saved">
              <CheckCircle2 size={17} />
              Changes applied in this session
            </span>
          )}

          <button className="settings-save-btn" type="submit">
            <Save size={17} />
            Apply settings
          </button>
        </div>
      </form>
    </main>
  );
}

export function LabSettings() {
  return <SettingsPage page="lab" />;
}

export function ReportSettings() {
  return <SettingsPage page="reports" />;
}

export function BillingSettings() {
  return <SettingsPage page="billing" />;
}

export function NotificationSettings() {
  return <SettingsPage page="notifications" />;
}
