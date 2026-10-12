
import { useEffect, useState } from "react";
import {
  UserRound,
  ShieldCheck,
  Mail,
  LockKeyhole,
  UserCircle,
  KeyRound,
  ArrowRight,
} from "lucide-react";

import "./MyAccount.css";

import { manageRequest } from "./manageApi";
import {
  ManageShell,
  Panel,
  Field,
  SaveButton,
  StatusMessage,
  useStatus,
} from "./ManageUI";

const initial = {
  fullName: "Demo Lab Owner",
  email: "",
  phone: "",
  role: "Lab owner",
};

const emptyPassword = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function MyAccount() {
  const [form, setForm] = useState(initial);
  const [password, setPassword] = useState(emptyPassword);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const { status, success, error, dismiss } = useStatus();

  useEffect(() => {
    let active = true;

    manageRequest("/profile")
      .then((data) => {
        if (active) {
          setForm({ ...initial, ...(data.profile || {}) });
        }
      })
      .catch(() => {
        // Keep the initial form values if the profile endpoint is unavailable.
      });

    return () => {
      active = false;
    };
  }, []);

  const changeForm = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const changePasswordForm = (e) => {
    const { name, value } = e.target;
    setPassword((previous) => ({ ...previous, [name]: value }));
  };

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await manageRequest("/profile", {
        method: "PUT",
        body: JSON.stringify(form),
      });

      success("Your account details have been saved.");
    } catch (err) {
      error(err.message || "Unable to save account details.");
    } finally {
      setSaving(false);
    }
  }

  async function savePassword(e) {
    e.preventDefault();

    if (password.newPassword.length < 8) {
      error("Your new password must contain at least 8 characters.");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      error("The new passwords do not match.");
      return;
    }

    if (password.currentPassword === password.newPassword) {
      error("Choose a new password different from your current password.");
      return;
    }

    setSavingPassword(true);

    try {
      await manageRequest("/change-password", {
        method: "PUT",
        body: JSON.stringify(password),
      });

      setPassword({ ...emptyPassword });
      success("Your password has been updated.");
    } catch (err) {
      error(err.message || "Unable to update your password.");
    } finally {
      setSavingPassword(false);
    }
  }

  const initials =
    form.fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "U";

  return (
    <ManageShell
      title="My Account"
      subtitle="Manage your profile, personal information, and account security."
      icon={UserRound}
    >
      <div className="account-page">
        <StatusMessage status={status} onDismiss={dismiss} />

        {/* Profile overview */}
        <section className="account-profile-card">
          <div className="account-profile-main">
            <div className="account-avatar" aria-label="Profile initials">
              {initials}
            </div>

            <div className="account-profile-details">
              <span className="account-eyebrow">YOUR PROFILE</span>
              <h2>{form.fullName || "Your name"}</h2>

              <div className="account-profile-meta">
                <span className="account-role">
                  <UserCircle size={15} />
                  {form.role || "Account member"}
                </span>

                {form.email && (
                  <span className="account-profile-email">
                    <Mail size={15} />
                    {form.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="account-profile-side">
            <div className="account-security-indicator">
              <span className="account-security-dot" />
              Account settings
            </div>
            <p>Keep your details up to date.</p>
          </div>
        </section>

        {/* Account settings */}
        <div className="account-settings-grid">
          <Panel
            title="Personal information"
            description="Update the personal details associated with your LabLIMS account."
          >
            <form onSubmit={saveProfile} className="account-form">
              <div className="account-section-label">
                <span className="account-section-icon">
                  <UserRound size={18} />
                </span>
                <div>
                  <h3>Basic details</h3>
                  <p>Your profile information</p>
                </div>
              </div>

              <div className="account-form-grid">
                <div className="account-field">
                  <Field
                    label="Full name"
                    name="fullName"
                    value={form.fullName}
                    onChange={changeForm}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="account-field">
                  <Field
                    label="Email address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={changeForm}
                    required
                    placeholder="you@example.com"
                  />
                </div>

                <div className="account-field">
                  <Field
                    label="Phone number"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={changeForm}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="account-field">
                  <Field
                    label="Role"
                    name="role"
                    value={form.role}
                    onChange={changeForm}
                    required
                    placeholder="Enter your role"
                  />
                </div>
              </div>

              <div className="account-form-footer">
                <p>
                  <ShieldCheck size={16} />
                  Your account details are managed securely.
                </p>

                <SaveButton saving={saving}>
                  Save changes
                </SaveButton>
              </div>
            </form>
          </Panel>

          <Panel
            title="Password & security"
            description="Protect your account by using a strong, unique password."
          >
            <div className="account-security-banner">
              <div className="account-security-banner-icon">
                <LockKeyhole size={21} />
              </div>
              <div>
                <h3>Keep your account secure</h3>
                
                <p>
                  Use at least 8 characters and avoid reusing passwords from
                  other accounts.
                </p>
              </div>
            </div>

            <form onSubmit={savePassword} className="account-form">
              <div className="account-section-label">
                <span className="account-section-icon">
                  <KeyRound size={18} />
                </span>
                <div>
                  <h3>Change your password</h3>
                  <p>Enter your current and new password</p>
                </div>
              </div>

              <div className="account-password-fields">
                <Field
                  label="Current password"
                  name="currentPassword"
                  type="password"
                  value={password.currentPassword}
                  onChange={changePasswordForm}
                  required
                  placeholder="Enter current password"
                />

                <Field
                  label="New password"
                  name="newPassword"
                  type="password"
                  value={password.newPassword}
                  onChange={changePasswordForm}
                  required
                  placeholder="At least 8 characters"
                />

                <Field
                  label="Confirm new password"
                  name="confirmPassword"
                  type="password"
                  value={password.confirmPassword}
                  onChange={changePasswordForm}
                  required
                  placeholder="Re-enter new password"
                />
              </div>

              <div className="account-password-hint">
                <ShieldCheck size={16} />
                Never share your password with anyone.
              </div>

              <div className="account-form-footer account-password-footer">
                <span className="account-footer-caption">
                  Changes apply after the server accepts your request.
                </span>

                <SaveButton saving={savingPassword}>
                  Update password
                  <ArrowRight size={16} />
                </SaveButton>
              </div>
            </form>
          </Panel>
        </div>
      </div>
    </ManageShell>
  );
}
