import { useEffect, useState } from "react";
import {
  Mail,
  BellRing,
  FileText,
  Wallet,
  Megaphone,
  ShieldCheck,
  CheckCircle2,
  Clock3,
  Save,
  Info,
  Sparkles,
} from "lucide-react";
import { manageRequest } from "./manageApi";
import {
  ManageShell,
  Panel,
  SaveButton,
  StatusMessage,
  useStatus,
} from "./ManageUI";
import "./EmailPreferences.css";

const defaults = {
  reportReady: true,
  billingUpdates: true,
  dailySummary: false,
  securityAlerts: true,
  productAnnouncements: false,
};

const options = [
  {
    key: "reportReady",
    title: "Reports ready",
    description: "Know when a laboratory report is ready for review.",
    detail: "Report notifications",
    icon: FileText,
    category: "LAB OPERATIONS",
    color: "blue",
  },
  {
    key: "billingUpdates",
    title: "Billing updates",
    description: "Stay informed about invoices, payments, and billing activity.",
    detail: "Financial notifications",
    icon: Wallet,
    category: "BILLING",
    color: "green",
  },
  {
    key: "dailySummary",
    title: "Daily summary",
    description: "Receive a daily overview of cases and laboratory activity.",
    detail: "Daily digest",
    icon: BellRing,
    category: "ACTIVITY",
    color: "orange",
  },
  {
    key: "securityAlerts",
    title: "Security alerts",
    description: "Important sign-in events and account security notifications.",
    detail: "Essential account protection",
    icon: ShieldCheck,
    category: "SECURITY",
    color: "red",
    locked: true,
  },
  {
    key: "productAnnouncements",
    title: "Product announcements",
    description: "Hear about new features, improvements, and product updates.",
    detail: "Product news",
    icon: Megaphone,
    category: "UPDATES",
    color: "purple",
  },
];

export default function EmailPreferences() {
  const [form, setForm] = useState(defaults);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { status, success, error, dismiss } = useStatus();

  useEffect(() => {
    let active = true;

    manageRequest("/email-preferences")
      .then((data) => {
        if (active) {
          setForm({
            ...defaults,
            ...(data.preferences || {}),
            securityAlerts: true,
          });
        }
      })
      .catch(() => {
        if (active) {
          error("Unable to load saved preferences. Default settings are shown.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function toggle(key) {
    const option = options.find((item) => item.key === key);

    if (option?.locked) return;

    setForm((old) => ({ ...old, [key]: !old[key] }));
  }

  async function submit(e) {
    e.preventDefault();

    if (saving) return;

    setSaving(true);

    try {
      await manageRequest("/email-preferences", {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          securityAlerts: true,
        }),
      });

      setForm((old) => ({ ...old, securityAlerts: true }));
      success("Your email preferences have been saved.");
    } catch (err) {
      error(err.message || "Unable to save preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const enabledCount = options.filter(({ key }) => form[key]).length;

  return (
    <ManageShell
      title="Email Preferences"
      subtitle="Personalize the LabLIMS updates you receive in your inbox."
      icon={Mail}
    >
      <div className="email-preferences-page">
        <StatusMessage status={status} onDismiss={dismiss} />

        <section className="email-preferences-hero">
          <div className="email-hero-decoration email-hero-decoration-one" />
          <div className="email-hero-decoration email-hero-decoration-two" />

          <div className="email-hero-copy">
            <div className="email-hero-eyebrow">
              <Sparkles size={15} />
              YOUR INBOX, YOUR WAY
            </div>

            <h2>Stay informed. Stay in control.</h2>

            <p>
              Choose the updates that matter to your workflow.
              Keep essential security notifications enabled while
              tailoring the rest to your needs.
            </p>

            <div className="email-hero-status">
              <span className="email-hero-status-icon">
                <CheckCircle2 size={17} />
              </span>
              <span>
                <strong>{enabledCount} of {options.length}</strong> notification
                categories enabled
              </span>
            </div>
          </div>

          <div className="email-hero-art" aria-hidden="true">
            <div className="email-art-orbit email-art-orbit-one" />
            <div className="email-art-orbit email-art-orbit-two" />

            <div className="email-art-envelope">
              <div className="email-art-envelope-icon">
                <Mail size={39} />
              </div>
              <span className="email-art-envelope-line email-art-line-one" />
              <span className="email-art-envelope-line email-art-line-two" />
              <span className="email-art-envelope-line email-art-line-three" />

              <span className="email-art-notification">
                <BellRing size={18} />
              </span>
            </div>

            <span className="email-art-star email-art-star-one">✦</span>
            <span className="email-art-star email-art-star-two">✧</span>
          </div>
        </section>

        <div className="email-preferences-layout">
          <div className="email-preferences-main">
            <Panel
              title="Notification settings"
              description="Enable or disable the email updates you want to receive."
            >
              <form onSubmit={submit}>
                <div className="email-preferences-list">
                  {options.map(
                    ({
                      key,
                      title,
                      description,
                      detail,
                      icon: Icon,
                      category,
                      color,
                      locked,
                    }) => (
                      <div
                        className={`email-preference-item ${
                          form[key] ? "is-enabled" : ""
                        }`}
                        key={key}
                      >
                        <div className={`email-preference-icon ${color}`}>
                          <Icon size={21} />
                        </div>

                        <div className="email-preference-copy">
                          <div className="email-preference-category">
                            {category}
                          </div>

                          <div className="email-preference-title-row">
                            <h3>{title}</h3>

                            {locked && (
                              <span className="email-required-badge">
                                <ShieldCheck size={12} />
                                Required
                              </span>
                            )}
                          </div>

                          <p>{description}</p>

                          <span className="email-preference-detail">
                            {detail}
                          </span>
                        </div>

                        <div className="email-preference-control">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={Boolean(form[key])}
                            aria-label={`${title}: ${
                              form[key] ? "enabled" : "disabled"
                            }`}
                            disabled={locked || loading || saving}
                            onClick={() => toggle(key)}
                            className={`email-toggle ${
                              form[key] ? "is-on" : ""
                            }`}
                          >
                            <span className="email-toggle-thumb" />
                          </button>

                          <span
                            className={`email-toggle-label ${
                              form[key] ? "enabled" : ""
                            }`}
                          >
                            {form[key] ? "On" : "Off"}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="email-preferences-save-bar">
                  <div className="email-save-caption">
                    <Save size={16} />
                    <span>
                      {loading
                        ? "Loading your saved settings..."
                        : "Remember to save your changes."}
                    </span>
                  </div>

                  <SaveButton saving={saving}>
                    Save preferences
                  </SaveButton>
                </div>
              </form>
            </Panel>

            <div className="email-security-note">
              <span className="email-security-note-icon">
                <ShieldCheck size={19} />
              </span>

              <div>
                <strong>Security notifications stay enabled</strong>
                <p>
                  Important account security alerts cannot be disabled
                  from this page.
                </p>
              </div>
            </div>
          </div>

          <aside className="email-preferences-sidebar">
            <Panel title="About notifications">
              <div className="email-sidebar-icon">
                <Mail size={25} />
              </div>

              <h3 className="email-sidebar-heading">
                The updates that work for you
              </h3>

              <p className="email-sidebar-description">
                These preferences control which categories of email
                notifications you choose to receive from LabLIMS.
              </p>

              <div className="email-sidebar-divider" />

              <div className="email-sidebar-point">
                <span className="email-sidebar-point-icon">
                  <CheckCircle2 size={16} />
                </span>
                <div>
                  <strong>Flexible preferences</strong>
                  <p>Change your notification choices whenever you need.</p>
                </div>
              </div>

              <div className="email-sidebar-point">
                <span className="email-sidebar-point-icon">
                  <Clock3 size={16} />
                </span>
                <div>
                  <strong>Timely updates</strong>
                  <p>Stay aware of reports, billing, and lab activity.</p>
                </div>
              </div>

              <div className="email-sidebar-point">
                <span className="email-sidebar-point-icon">
                  <ShieldCheck size={16} />
                </span>
                <div>
                  <strong>Account protection</strong>
                  <p>Keep essential security notifications enabled.</p>
                </div>
              </div>
            </Panel>

            <div className="email-delivery-card">
              <div className="email-delivery-icon">
                <Info size={19} />
              </div>

              <h3>About email delivery</h3>

              <p>
                Saving these settings does not send emails by itself.
                Your backend needs a configured email service and notification
                logic to deliver messages.
              </p>
            </div>
          </aside>
        </div>

        <div className="email-preferences-footer">
          <ShieldCheck size={16} />
          <span>
            Your preferences are saved through your LabLIMS account.
          </span>
        </div>
      </div>
    </ManageShell>
  );
}