import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Headphones,
  Mail,
  MessageSquare,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import "./ContactSupport.css";

const initialForm = {
  name: "",
  email: "",
  category: "Technical Issue",
  priority: "Normal",
  subject: "",
  message: "",
};

export default function ContactSupport() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Frontend demonstration only.
    // Connect this handler to your support API to create real tickets.
    setSubmitted(true);
  };

  const resetForm = () => {
    setForm(initialForm);
    setSubmitted(false);
  };

  return (
    <main className="support-page">
      <Link to="/help-center" className="support-back">
        <ArrowLeft size={16} />
        Back to Help Center
      </Link>

      <section className="support-heading">
        <div className="support-heading-icon">
          <Headphones size={28} />
        </div>

        <span className="support-eyebrow">
          LABLIMS CUSTOMER CARE
        </span>

        <h1>Contact Support</h1>

        <p>
          Having an issue or need assistance? Send us the details
          so your support team can help.
        </p>
      </section>

      <div className="support-layout">
        <section className="support-form-card">
          {submitted ? (
            <div className="support-success">
              <div className="support-success-icon">
                <CheckCircle2 size={40} />
              </div>

              <h2>Message submitted</h2>

              <p>
                Your message passed the form validation in this
                demo. No support ticket has been sent to a server.
                Connect the form to your backend to enable real
                ticket submission.
              </p>

              <button
                type="button"
                className="support-submit"
                onClick={resetForm}
              >
                Submit another message
                <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <>
              <div className="support-form-heading">
                <h2>Tell us how we can help</h2>
                <p>
                  Fields marked with * are required.
                </p>
              </div>

              <form
                className="support-form"
                onSubmit={handleSubmit}
              >
                <div className="support-form-row">
                  <label>
                    Full name *
                    <input
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={updateField}
                      autoComplete="name"
                      required
                    />
                  </label>

                  <label>
                    Email address *
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={updateField}
                      autoComplete="email"
                      required
                    />
                  </label>
                </div>

                <div className="support-form-row">
                  <label>
                    Issue category *
                    <select
                      name="category"
                      value={form.category}
                      onChange={updateField}
                      required
                    >
                      <option>Technical Issue</option>
                      <option>Patient Management</option>
                      <option>Laboratory Investigation</option>
                      <option>Billing and Payments</option>
                      <option>Reports</option>
                      <option>Account and Access</option>
                      <option>Feature Request</option>
                      <option>Other</option>
                    </select>
                  </label>

                  <label>
                    Priority
                    <select
                      name="priority"
                      value={form.priority}
                      onChange={updateField}
                    >
                      <option>Low</option>
                      <option>Normal</option>
                      <option>High</option>
                    </select>
                  </label>
                </div>

                <label>
                  Subject *
                  <input
                    name="subject"
                    type="text"
                    placeholder="Briefly describe your issue"
                    value={form.subject}
                    onChange={updateField}
                    required
                  />
                </label>

                <label>
                  Message *
                  <textarea
                    name="message"
                    placeholder="Explain what happened and what you were trying to do..."
                    value={form.message}
                    onChange={updateField}
                    rows={6}
                    required
                  />
                </label>

                <div className="support-form-note">
                  <MessageSquare size={17} />
                  <span>
                    Please do not include patient medical records
                    or other sensitive patient information.
                  </span>
                </div>

                <button
                  type="submit"
                  className="support-submit"
                >
                  Submit request
                  <ArrowRight size={17} />
                </button>
              </form>
            </>
          )}
        </section>

        <aside className="support-info-column">
          <div className="support-info-card support-info-primary">
            <div className="support-info-icon">
              <Mail size={23} />
            </div>

            <h3>Need more assistance?</h3>

            <p>
              Use this form to describe your problem. Your actual
              support contact details can be added here.
            </p>
          </div>

          <div className="support-info-card">
            <div className="support-info-icon muted">
              <Clock3 size={21} />
            </div>

            <h3>Response time</h3>

            <p>
              Response times depend on your support team's
              availability and the issue reported.
            </p>
          </div>

          <div className="support-info-card">
            <div className="support-info-icon muted">
              <MessageSquare size={21} />
            </div>

            <h3>Before contacting us</h3>

            <p>
              Include the page name, what you expected to happen,
              and the error message if one appeared.
            </p>

            <Link to="/help-center" className="support-help-link">
              Browse FAQs
              <ArrowRight size={15} />
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}