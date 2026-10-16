import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FlaskConical,
  Mail,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import AuthCard from "../../components/common/AuthCard";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import "./forgetpass.css";

export default function ForgotPassword() {
  const [identity, setIdentity] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="forgot-layout">
      <section className="forgot-visual">
        <div className="forgot-brand">
          <span className="forgot-brand-icon">
            <FlaskConical size={24} />
          </span>
          <div>
            <strong>LabLIMS</strong>
            <small>Laboratory Management System</small>
          </div>
        </div>

        <div className="forgot-art">
          <div className="forgot-art-circle" />

          <div className="forgot-mail-illustration">
            <div className="forgot-mail-icon">
              <Mail size={72} strokeWidth={1.5} />
            </div>
            <div className="forgot-mail-line forgot-line-one" />
            <div className="forgot-mail-line forgot-line-two" />
            <div className="forgot-mail-line forgot-line-three" />
          </div>

          <div className="forgot-float forgot-float-top">
            <Mail size={22} />
          </div>

          <div className="forgot-float forgot-float-bottom">
            <ShieldCheck size={23} />
          </div>
        </div>

        <div className="forgot-visual-copy">
          <span className="forgot-eyebrow">ACCOUNT RECOVERY</span>
          <h2>A secure way back to your workspace.</h2>
          <p>
            Forgot your password? Start your account recovery
            using your registered email address or mobile number.
            We'll help you get back to managing your laboratory.
          </p>
        </div>

        <div className="forgot-trust">
          <span>Secure</span><i />
          <span>Reliable</span><i />
          <span>Efficient</span>
        </div>
      </section>

      <section className="forgot-form-panel">
        <main className="forgot-form-content">
          <div className="forgot-mobile-brand">
            <FlaskConical size={23} />
            <strong>LabLIMS</strong>
          </div>

          <AuthCard
            title="Forgot Password?"
            subtitle="Enter your registered email or mobile number to receive recovery instructions."
          >
            <div className="forgot-status-icon">
              <Mail size={28} strokeWidth={1.8} />
            </div>

            {sent && (
              <div className="forgot-alert">
                <Alert>
                  Recovery instructions have been requested.
                </Alert>
              </div>
            )}

            <form
              className="forgot-form"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <Input
                label="Email / Mobile number"
                value={identity}
                onChange={(e) => {
                  setIdentity(e.target.value);
                  setSent(false);
                }}
                placeholder="Enter registered email or mobile"
              />

              <div className="forgot-submit">
                <Button type="submit">
                  Continue <ArrowRight size={17} />
                </Button>
              </div>
            </form>

            <Link className="forgot-back-link" to="/login">
              ← Back to login
            </Link>
          </AuthCard>

          <footer className="forgot-footer">
            <p>
              Need help? <strong>Contact your administrator</strong>
            </p>
            <small>
              © 2026 LabLIMS · Laboratory Management System
            </small>
          </footer>
        </main>
      </section>
    </div>
  );
}