import { useEffect, useState } from "react";
import {
  Gift,
  Copy,
  Users,
  CheckCircle2,
  IndianRupee,
  Share2,
  Sparkles,
  ArrowUpRight,
  Clock3,
  FlaskConical,
  TrendingUp,
} from "lucide-react";
import { manageRequest } from "./manageApi";
import {
  ManageShell,
  Panel,
  StatusMessage,
  useStatus,
} from "./ManageUI";
import "./ReferralProgram.css";

const initial = {
  referralCode: "LAB-DEMO001",
  totalReferrals: 0,
  successfulReferrals: 0,
  rewardBalance: 0,
  referrals: [],
};

export default function ReferralProgram() {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const { status, success, error, dismiss } = useStatus();

  useEffect(() => {
    let active = true;

    manageRequest("/referrals")
      .then((result) => {
        if (active) {
          const referral = result.referral || result;

          setData({
            ...initial,
            ...referral,
            referrals: Array.isArray(referral.referrals)
              ? referral.referrals
              : [],
          });
        }
      })
      .catch(() => {
        if (active) {
          error("Unable to load referral information. Please refresh the page.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function copyText(text, message) {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(text);
      success(message);
    } catch {
      error("Could not copy. Please check your browser permissions.");
    }
  }

  async function copyCode() {
    await copyText(data.referralCode, "Referral code copied successfully.");
  }

  async function shareCode() {
    const text = `Join LabLIMS using my referral code: ${data.referralCode}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "LabLIMS referral",
          text,
        });
      } else {
        await copyText(text, "Referral message copied successfully.");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        error("Unable to share right now. Please try again.");
      }
    }
  }

  const total = Number(data.totalReferrals) || 0;
  const successful = Number(data.successfulReferrals) || 0;
  const rewards = Number(data.rewardBalance) || 0;
  const pending = Math.max(total - successful, 0);
  const conversion = total > 0
    ? Math.min((successful / total) * 100, 100)
    : 0;

  const stats = [
    {
      label: "Total referrals",
      value: total.toLocaleString("en-IN"),
      detail: "Laboratories invited",
      icon: Users,
      tone: "purple",
    },
    {
      label: "Successful sign-ups",
      value: successful.toLocaleString("en-IN"),
      detail: "Completed registrations",
      icon: CheckCircle2,
      tone: "green",
    },
    {
      label: "Reward balance",
      value: `₹${rewards.toLocaleString("en-IN")}`,
      detail: "Rewards recorded",
      icon: IndianRupee,
      tone: "orange",
    },
  ];

  function getStatusClass(value) {
    const normalized = String(value || "Pending").toLowerCase();

    if (
      normalized.includes("success") ||
      normalized.includes("complete") ||
      normalized.includes("approved")
    ) {
      return "referral-status-success";
    }

    if (
      normalized.includes("reject") ||
      normalized.includes("fail") ||
      normalized.includes("cancel")
    ) {
      return "referral-status-failed";
    }

    return "referral-status-pending";
  }

  return (
    <ManageShell
      title="Referral Program"
      subtitle="Invite laboratories to LabLIMS and track your referral activity."
      icon={Gift}
    >
      <div className="referral-page">
        <StatusMessage status={status} onDismiss={dismiss} />

        <section className="referral-hero">
          <div className="referral-hero-decoration referral-decoration-one" />
          <div className="referral-hero-decoration referral-decoration-two" />

          <div className="referral-hero-content">
            <div className="referral-eyebrow">
              <Sparkles size={15} />
              LABLIMS REWARDS
            </div>

            <h2>Good connections deserve rewards.</h2>

            <p className="referral-hero-description">
              Know a laboratory that could benefit from LabLIMS?
              Share your referral code and keep track of your invitations
              in one place.
            </p>

            <div className="referral-code-label">YOUR UNIQUE REFERRAL CODE</div>

            <div className="referral-code-box">
              <span className="referral-code-value">
                {data.referralCode || "Not available"}
              </span>

              <button
                type="button"
                className="referral-copy-icon"
                onClick={copyCode}
                disabled={!data.referralCode}
                aria-label="Copy referral code"
                title="Copy referral code"
              >
                <Copy size={18} />
              </button>
            </div>

            <div className="referral-hero-actions">
              <button
                type="button"
                className="referral-button referral-button-light"
                onClick={copyCode}
                disabled={!data.referralCode}
              >
                <Copy size={17} />
                Copy referral code
              </button>

              <button
                type="button"
                className="referral-button referral-button-outline"
                onClick={shareCode}
                disabled={!data.referralCode}
              >
                <Share2 size={17} />
                Share invitation
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          <div className="referral-hero-art" aria-hidden="true">
            <div className="referral-art-circle referral-art-circle-back" />
            <div className="referral-art-circle referral-art-circle-front" />
            <div className="referral-art-card">
              <div className="referral-art-icon">
                <Gift size={34} />
              </div>
              <span className="referral-art-title">Invite. Connect.</span>
              <span className="referral-art-subtitle">Grow together.</span>
              <div className="referral-art-divider" />
              <div className="referral-art-people">
                <span><Users size={17} /></span>
                <span><FlaskConical size={17} /></span>
                <span><CheckCircle2 size={17} /></span>
              </div>
            </div>
            <div className="referral-art-sparkle referral-art-sparkle-one">✦</div>
            <div className="referral-art-sparkle referral-art-sparkle-two">✧</div>
          </div>
        </section>

        <section className="referral-stats-grid" aria-label="Referral statistics">
          {stats.map(({ label, value, detail, icon: Icon, tone }) => (
            <article className="referral-stat-card" key={label}>
              <div className="referral-stat-top">
                <span className="referral-stat-label">{label}</span>
                <span className={`referral-stat-icon ${tone}`}>
                  <Icon size={21} />
                </span>
              </div>

              <div className="referral-stat-value">{value}</div>
              <div className="referral-stat-detail">{detail}</div>
            </article>
          ))}
        </section>

        <section className="referral-middle-grid">
          <Panel
            title="Referral performance"
            description="A quick look at your invitation progress."
          >
            <div className="referral-performance">
              <div className="referral-performance-header">
                <div className="referral-performance-icon">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <div className="referral-performance-title">
                    Sign-up conversion
                  </div>
                  <div className="referral-performance-subtitle">
                    Successful referrals compared with total referrals
                  </div>
                </div>
              </div>

              <div className="referral-progress-heading">
                <span>Conversion rate</span>
                <strong>{conversion.toFixed(0)}%</strong>
              </div>

              <div
                className="referral-progress-track"
                role="progressbar"
                aria-label="Referral conversion rate"
                aria-valuenow={Math.round(conversion)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="referral-progress-fill"
                  style={{ width: `${conversion}%` }}
                />
              </div>

              <div className="referral-performance-footer">
                <span>
                  <CheckCircle2 size={15} />
                  {successful} successful
                </span>
                <span>
                  <Clock3 size={15} />
                  {pending} remaining
                </span>
              </div>
            </div>
          </Panel>

          <aside className="referral-tip-card">
            <div className="referral-tip-icon">
              <Gift size={22} />
            </div>
            <span className="referral-tip-kicker">REFERRAL TIP</span>
            <h3>Spread the word.</h3>
            <p>
              Share your code with laboratory owners and teams who may find
              LabLIMS useful for managing their laboratory operations.
            </p>
            <button
              type="button"
              className="referral-tip-action"
              onClick={shareCode}
              disabled={!data.referralCode}
            >
              Share your code
              <ArrowUpRight size={16} />
            </button>
            <p className="referral-tip-note">
              Rewards are subject to your organization&apos;s referral program
              rules and eligibility requirements.
            </p>
          </aside>
        </section>

        <Panel
          title="Referral history"
          description="Review laboratories associated with your referral code."
        >
          <div className="referral-history">
            {loading ? (
              <div className="referral-empty-state">
                <div className="referral-loading-spinner" />
                <p>Loading referral history...</p>
              </div>
            ) : data.referrals.length > 0 ? (
              <div className="referral-table-wrapper">
                <table className="referral-table">
                  <thead>
                    <tr>
                      <th>Laboratory</th>
                      <th>Referral date</th>
                      <th>Status</th>
                      <th>Reward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.referrals.map((item, index) => {
                      const itemStatus = item.status || "Pending";

                      return (
                        <tr key={item.id || index}>
                          <td>
                            <div className="referral-lab-cell">
                              <span className="referral-lab-avatar">
                                <FlaskConical size={17} />
                              </span>
                              <div className="referral-lab-details">
                                <strong>
                                  {item.labName ||
                                    item.name ||
                                    item.email ||
                                    "Referred laboratory"}
                                </strong>
                                {item.email &&
                                  item.labName &&
                                  item.email !== item.labName && (
                                    <span>{item.email}</span>
                                  )}
                              </div>
                            </div>
                          </td>
                          <td>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "—"}
                          </td>
                          <td>
                            <span
                              className={`referral-status-pill ${getStatusClass(
                                itemStatus
                              )}`}
                            >
                              <span className="referral-status-dot" />
                              {itemStatus}
                            </span>
                          </td>
                          <td className="referral-reward-cell">
                            {item.reward == null
                              ? "—"
                              : `₹${Number(item.reward).toLocaleString("en-IN")}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="referral-empty-state">
                <div className="referral-empty-icon">
                  <Users size={27} />
                </div>
                <h3>No referrals yet</h3>
                <p>
                  Your referral activity will appear here when laboratories
                  start registering through your invitations.
                </p>
                <button
                  type="button"
                  className="referral-empty-button"
                  onClick={shareCode}
                  disabled={!data.referralCode}
                >
                  <Share2 size={16} />
                  Invite your first laboratory
                </button>
              </div>
            )}
          </div>
        </Panel>

        <div className="referral-page-footnote">
          <ShieldCheckIcon />
          <span>
            Your referral statistics and reward balance reflect the information
            returned by your LabLIMS backend.
          </span>
        </div>
      </div>
    </ManageShell>
  );
}

function ShieldCheckIcon() {
  return <CheckCircle2 size={16} />;
}