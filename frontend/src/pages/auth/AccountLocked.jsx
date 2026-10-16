import { Link } from "react-router-dom";
import {
  LockKeyhole,
  FlaskConical,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import AuthCard from "../../components/common/AuthCard";
import Button from "../../components/common/Button";
import "./account-locked.css";

export default function AccountLocked() {
  return (
    <div className="locked-layout">
      <section className="locked-visual">
        <div className="locked-brand">
          <span className="locked-brand-icon">
            <FlaskConical size={24} />
          </span>
          <div>
            <strong>LabLIMS</strong>
            <small>Laboratory Management System</small>
          </div>
        </div>

        <div className="locked-art">
          <div className="locked-art-circle" />
          <div className="locked-flask">
            <FlaskConical size={100} strokeWidth={1.5} />
          </div>
          <div className="locked-float locked-float-top">
            <FlaskConical size={23} />
          </div>
          <div className="locked-float locked-float-bottom">
            <ShieldCheck size={23} />
          </div>
        </div>

        <div className="locked-visual-copy">
          <span className="locked-eyebrow">ACCOUNT SECURITY</span>
          <h2>Your laboratory workspace, protected.</h2>
          <p>
            Your account security matters. Follow the recovery
            steps to safely regain access to your laboratory
            management workspace.
          </p>
        </div>

        <div className="locked-trust">
          <span>Secure</span><i />
          <span>Reliable</span><i />
          <span>Efficient</span>
        </div>
      </section>

      <section className="locked-form-panel">
        <main className="locked-form-content">
          <div className="locked-mobile-brand">
            <FlaskConical size={23} />
            <strong>LabLIMS</strong>
          </div>

          <AuthCard title="Account locked">
            <div className="locked-status-icon">
              <LockKeyhole size={29} strokeWidth={1.8} />
            </div>

            <p className="locked-description">
              Your account may be temporarily locked after multiple
              unsuccessful login attempts. Recover your account or
              contact your administrator.
            </p>

            <div className="locked-primary-action">
              <Link to="/forgot-password">
                <Button>
                  Recover account <ArrowRight size={17} />
                </Button>
              </Link>
            </div>

            <Link className="locked-back-link" to="/login">
              <span>←</span> Back to login
            </Link>
          </AuthCard>

          <footer className="locked-footer">
            <p>Need help? <strong>Contact your administrator</strong></p>
            <small>© 2026 LabLIMS · Laboratory Management System</small>
          </footer>
        </main>
      </section>
    </div>
  );
}