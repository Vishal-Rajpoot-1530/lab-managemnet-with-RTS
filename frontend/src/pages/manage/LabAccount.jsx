
import { useEffect, useState } from "react";
import {
  FlaskConical,
  MapPin,
  Clock3,
  Building2,
  Phone,
  Mail,
  Hash,
  ShieldCheck,
  MapPinned,
} from "lucide-react";

import { manageRequest } from "./manageApi";
import {
  ManageShell,
  Panel,
  Field,
  SaveButton,
  StatusMessage,
  useStatus,
} from "./ManageUI";

import "./LabAccount.css";

const initial = {
  labName: "Demo Diagnostic Laboratory",
  labId: "DEMO001",
  registrationNumber: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  openingTime: "09:00",
  closingTime: "18:00",
};

export default function LabAccount() {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const { status, success, error, dismiss } = useStatus();

  useEffect(() => {
    let active = true;

    manageRequest("/lab-account")
      .then((data) => {
        if (active) {
          setForm({ ...initial, ...(data.lab || {}) });
        }
      })
      .catch(() => {
        // Keep the initial values if the lab profile cannot be loaded.
      });

    return () => {
      active = false;
    };
  }, []);

  const update = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  async function submit(e) {
    e.preventDefault();

    if (form.openingTime >= form.closingTime) {
      error("Closing time must be later than opening time.");
      return;
    }

    setSaving(true);

    try {
      await manageRequest("/lab-account", {
        method: "PUT",
        body: JSON.stringify(form),
      });

      success("Laboratory details saved successfully.");
    } catch (err) {
      error(err.message || "Unable to save laboratory details.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ManageShell
      title="Lab Account"
      subtitle="Manage your laboratory profile, contact information, and operating hours."
      icon={FlaskConical}
    >
      <div className="lab-account-page">
        <StatusMessage status={status} onDismiss={dismiss} />

        {/* Laboratory overview */}
        <section className="lab-overview-card">
          <div className="lab-overview-main">
            <div className="lab-overview-icon">
              <FlaskConical size={30} strokeWidth={1.7} />
            </div>

            <div className="lab-overview-details">
              <span className="lab-overview-eyebrow">
                LABORATORY PROFILE
              </span>

              <h2>{form.labName || "Your Laboratory"}</h2>

              <div className="lab-overview-meta">
                <span className="lab-id-badge">
                  <Hash size={14} />
                  {form.labId || "Lab ID not set"}
                </span>

                {form.city && (
                  <span className="lab-location-label">
                    <MapPin size={14} />
                    {form.city}
                    {form.state ? `, ${form.state}` : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="lab-overview-status">
            <span className="lab-status-dot" />
            Lab profile
          </div>
        </section>

        <form onSubmit={submit} className="lab-account-form">
          {/* Laboratory identity */}
          <Panel
            title="Laboratory information"
            description="Maintain the official identity and primary contact details for your laboratory."
          >
            <div className="lab-section-intro">
              <span className="lab-section-icon">
                <Building2 size={19} />
              </span>

              <div>
                <h3>Lab identity</h3>
                <p>Official laboratory and registration details</p>
              </div>
            </div>

            <div className="lab-fields-grid">
              <div className="lab-field">
                <Field
                  label="Laboratory name"
                  name="labName"
                  value={form.labName}
                  onChange={update}
                  placeholder="Enter laboratory name"
                  required
                />
              </div>

              <div className="lab-field">
                <Field
                  label="Laboratory ID"
                  name="labId"
                  value={form.labId}
                  onChange={update}
                  placeholder="e.g. LAB001"
                  required
                />
              </div>

              <div className="lab-field">
                <Field
                  label="Registration number"
                  name="registrationNumber"
                  value={form.registrationNumber}
                  onChange={update}
                  placeholder="Enter registration number"
                />
              </div>

              <div className="lab-field">
                <Field
                  label="Contact email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  placeholder="lab@example.com"
                  required
                />
              </div>

              <div className="lab-field">
                <Field
                  label="Contact phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={update}
                  placeholder="Enter contact number"
                  required
                />
              </div>
            </div>

            <div className="lab-info-note">
              <ShieldCheck size={17} />
              <p>
                Keep your laboratory identity and contact information accurate
                for administrative and operational use.
              </p>
            </div>
          </Panel>

          {/* Address */}
          <Panel
            title="Address and location"
            description="Add the physical address associated with this laboratory."
          >
            <div className="lab-section-intro">
              <span className="lab-section-icon">
                <MapPinned size={19} />
              </span>

              <div>
                <h3>Laboratory address</h3>
                <p>Where your laboratory is located</p>
              </div>
            </div>

            <div className="lab-fields-grid">
              <div className="lab-field lab-field-wide">
                <Field
                  label="Street address"
                  name="address"
                  value={form.address}
                  onChange={update}
                  placeholder="Building, street, area, or landmark"
                  rows={3}
                  required
                />
              </div>

              <div className="lab-field">
                <Field
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={update}
                  placeholder="Enter city"
                  required
                />
              </div>

              <div className="lab-field">
                <Field
                  label="State"
                  name="state"
                  value={form.state}
                  onChange={update}
                  placeholder="Enter state"
                  required
                />
              </div>

              <div className="lab-field">
                <Field
                  label="Postal code"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={update}
                  placeholder="Enter postal code"
                />
              </div>
            </div>
          </Panel>

          {/* Operating hours */}
          <Panel
            title="Operating hours"
            description="Set the usual daily opening and closing times for your laboratory."
          >
            <div className="lab-section-intro">
              <span className="lab-section-icon">
                <Clock3 size={19} />
              </span>

              <div>
                <h3>Daily schedule</h3>
                <p>Configure your standard operating hours</p>
              </div>
            </div>

            <div className="lab-hours-card">
              <div className="lab-hours-copy">
                <Clock3 size={21} />
                <div>
                  <h3>Regular working hours</h3>
                  <p>
                    {form.openingTime && form.closingTime
                      ? `${form.openingTime} – ${form.closingTime}`
                      : "Set your working hours"}
                  </p>
                </div>
              </div>

              <span className="lab-hours-tag">Daily schedule</span>
            </div>

            <div className="lab-fields-grid lab-time-grid">
              <div className="lab-field">
                <Field
                  label="Opening time"
                  name="openingTime"
                  type="time"
                  value={form.openingTime}
                  onChange={update}
                  required
                />
              </div>

              <div className="lab-field">
                <Field
                  label="Closing time"
                  name="closingTime"
                  type="time"
                  value={form.closingTime}
                  onChange={update}
                  required
                />
              </div>
            </div>
          </Panel>

          {/* Form actions */}
          <div className="lab-save-bar">
            <div className="lab-save-copy">
              <ShieldCheck size={18} />
              <div>
                <strong>Ready to save?</strong>
                <span>Save to apply your laboratory profile changes.</span>
              </div>
            </div>

            <SaveButton saving={saving}>
              Save lab details
            </SaveButton>
          </div>
        </form>
      </div>
    </ManageShell>
  );
}
