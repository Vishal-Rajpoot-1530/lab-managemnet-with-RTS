
import { useState } from "react";
import {
  PlusCircle,
  Building2,
  MapPin,
  Mail,
  Phone,
  Hash,
  CheckCircle2,
  ClipboardCheck,
  FlaskConical,
  ArrowRight,
  Info,
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

import "./SetupLab.css";

const initial = {
  labName: "",
  labType: "Diagnostic laboratory",
  labId: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
};

const labTypes = [
  { value: "Diagnostic laboratory", label: "Diagnostic laboratory" },
  { value: "Pathology laboratory", label: "Pathology laboratory" },
  { value: "Imaging centre", label: "Imaging centre" },
  {
    value: "Multi-specialty laboratory",
    label: "Multi-specialty laboratory",
  },
  { value: "Other", label: "Other" },
];

export default function SetupLab() {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(null);

  const { status, success, error, dismiss } = useStatus();

  const update = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setCreated(null);
  };

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setCreated(null);

    try {
      const result = await manageRequest("/labs", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const newLab = result.lab || result;
      setCreated(newLab);
      setForm(initial);
      success("New laboratory created successfully.");
    } catch (err) {
      error(err.message || "Unable to create the laboratory.");
    } finally {
      setSaving(false);
    }
  }

  const location = [form.city, form.state].filter(Boolean).join(", ");

  return (
    <ManageShell
      title="Setup a New Lab"
      subtitle="Register a new laboratory location and add it to your LabLIMS workspace."
      icon={PlusCircle}
    >
      <div className="setup-lab-page">
        <StatusMessage status={status} onDismiss={dismiss} />

        {created && (
          <section className="setup-success-card" aria-live="polite">
            <div className="setup-success-icon">
              <CheckCircle2 size={27} />
            </div>

            <div className="setup-success-content">
              <span className="setup-success-eyebrow">
                REGISTRATION COMPLETE
              </span>
              <h2>Laboratory created successfully!</h2>
              <p>
                {created.labName || "Your new laboratory"} has been
                registered.
              </p>

              <div className="setup-success-details">
                <span>
                  <Hash size={15} />
                  Lab ID: {created.labId || "Assigned by server"}
                </span>
                {created.email && (
                  <span>
                    <Mail size={15} />
                    {created.email}
                  </span>
                )}
              </div>
            </div>

            <CheckCircle2
              className="setup-success-watermark"
              size={74}
              aria-hidden="true"
            />
          </section>
        )}

        <div className="setup-lab-layout">
          <div className="setup-lab-main">
            <div className="setup-progress-card">
              <div className="setup-progress-icon">
                <ClipboardCheck size={21} />
              </div>

              <div className="setup-progress-copy">
                <strong>New laboratory registration</strong>
                <span>
                  Complete the required information and create your lab.
                </span>
              </div>

              <span className="setup-required-label">
                <span className="setup-required-dot" />
                Required fields marked *
              </span>
            </div>

            <form onSubmit={submit} className="setup-lab-form">
              <Panel
                title="Laboratory details"
                description="Start with the identity and classification of your new facility."
              >
                <div className="setup-section-heading">
                  <span className="setup-section-icon">
                    <Building2 size={19} />
                  </span>
                  <div>
                    <h3>Basic information</h3>
                    <p>Identify the laboratory</p>
                  </div>
                </div>

                <div className="setup-fields-grid">
                  <div className="setup-field-full">
                    <Field
                      label="Laboratory name"
                      name="labName"
                      value={form.labName}
                      onChange={update}
                      placeholder="e.g. City Diagnostic Laboratory"
                      required
                    />
                  </div>

                  <Field
                    label="Laboratory type"
                    name="labType"
                    value={form.labType}
                    onChange={update}
                    options={labTypes}
                    required
                  />

                  <Field
                    label="Lab ID (optional)"
                    name="labId"
                    value={form.labId}
                    onChange={update}
                    placeholder="Leave blank if generated automatically"
                  />
                </div>

                <div className="setup-info-note">
                  <Info size={17} />
                  <span>
                    Use a unique laboratory ID if your system supports
                    manually assigned IDs.
                  </span>
                </div>
              </Panel>

              <Panel
                title="Contact information"
                description="Provide the primary contact details for this laboratory."
              >
                <div className="setup-section-heading">
                  <span className="setup-section-icon">
                    <Phone size={19} />
                  </span>
                  <div>
                    <h3>How to reach this lab</h3>
                    <p>Contact details for administrative communication</p>
                  </div>
                </div>

                <div className="setup-fields-grid">
                  <Field
                    label="Contact email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={update}
                    placeholder="lab@example.com"
                    required
                  />

                  <Field
                    label="Contact phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={update}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </Panel>

              <Panel
                title="Laboratory address"
                description="Add the location details for your laboratory records."
              >
                <div className="setup-section-heading">
                  <span className="setup-section-icon">
                    <MapPin size={19} />
                  </span>
                  <div>
                    <h3>Physical location</h3>
                    <p>Enter the complete address</p>
                  </div>
                </div>

                <div className="setup-fields-grid">
                  <div className="setup-field-full">
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

                  <Field
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={update}
                    placeholder="Enter city"
                    required
                  />

                  <Field
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={update}
                    placeholder="Enter state"
                    required
                  />

                  <Field
                    label="Postal code"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={update}
                    placeholder="Enter postal code"
                  />
                </div>
              </Panel>

              <div className="setup-submit-bar">
                <div className="setup-submit-copy">
                  <ShieldCheckIcon />
                  <div>
                    <strong>Review before submitting</strong>
                    <span>
                      Check your details before creating the laboratory.
                    </span>
                  </div>
                </div>

                <SaveButton saving={saving}>
                  Create laboratory
                </SaveButton>
              </div>
            </form>
          </div>

          <aside className="setup-lab-sidebar">
            <section className="setup-preview-card">
              <div className="setup-preview-top">
                <span className="setup-preview-icon">
                  <FlaskConical size={24} />
                </span>
                <span className="setup-preview-badge">LIVE PREVIEW</span>
              </div>

              <p className="setup-preview-label">LABORATORY PROFILE</p>
              <h2>{form.labName.trim() || "Your new laboratory"}</h2>
              <p className="setup-preview-type">{form.labType}</p>

              <div className="setup-preview-divider" />

              <div className="setup-preview-row">
                <MapPin size={16} />
                <span>
                  {location || "City and state will appear here"}
                </span>
              </div>

              <div className="setup-preview-row">
                <Mail size={16} />
                <span>{form.email || "Contact email not added"}</span>
              </div>

              <div className="setup-preview-row">
                <Phone size={16} />
                <span>{form.phone || "Contact phone not added"}</span>
              </div>

              <div className="setup-preview-row">
                <Hash size={16} />
                <span>{form.labId || "Lab ID pending"}</span>
              </div>

              <div className="setup-preview-footer">
                <span className="setup-preview-dot" />
                Preview updates as you type
              </div>
            </section>

            <section className="setup-checklist-card">
              <div className="setup-checklist-heading">
                <ClipboardCheck size={19} />
                <h3>Registration checklist</h3>
              </div>

              <p className="setup-checklist-description">
                Make sure the following details are ready.
              </p>

              {[
                {
                  label: "Laboratory name",
                  complete: Boolean(form.labName.trim()),
                },
                {
                  label: "Contact details",
                  complete: Boolean(form.email.trim() && form.phone.trim()),
                },
                {
                  label: "Complete address",
                  complete: Boolean(
                    form.address.trim() &&
                      form.city.trim() &&
                      form.state.trim()
                  ),
                },
              ].map((item) => (
                <div className="setup-checklist-item" key={item.label}>
                  <span
                    className={`setup-check-icon ${
                      item.complete ? "complete" : ""
                    }`}
                  >
                    {item.complete ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <span />
                    )}
                  </span>
                  <span className={item.complete ? "complete-text" : ""}>
                    {item.label}
                  </span>
                </div>
              ))}

              <div className="setup-checklist-note">
                <Info size={16} />
                <p>
                  Creating a lab does not automatically create employee
                  accounts. Configure access separately.
                </p>
              </div>
            </section>

            <div className="setup-help-card">
              <div className="setup-help-icon">
                <ArrowRight size={18} />
              </div>
              <div>
                <strong>What happens next?</strong>
                <p>
                  After registration, verify the new lab in your workspace
                  and configure its access and operational settings.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </ManageShell>
  );
}

function ShieldCheckIcon() {
  return (
    <span className="setup-shield-icon" aria-hidden="true">
      <CheckCircle2 size={19} />
    </span>
  );
}
