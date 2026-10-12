import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  FlaskConical,
  RefreshCw,
} from "lucide-react";

import AuthCard from "../../components/common/AuthCard";
import Input from "../../components/common/Input";
import OtpInput from "../../components/common/OtpInput";
import Button from "../../components/common/Button";

import "./auth.css";

export default function SmsOtp() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="auth-page">

      {/* =====================================================
          LEFT VISUAL PANEL
      ===================================================== */}

      <section className="auth-visual">

        {/* Brand */}

        <div className="auth-visual-brand">

          <div className="auth-logo-mark">
            <FlaskConical size={22} />
          </div>

          <div>
            <div className="auth-logo">
              LabLIMS
            </div>

            <div className="auth-logo-caption">
              Laboratory Management System
            </div>
          </div>

        </div>


        {/* Illustration */}

        <div className="auth-illustration">

          <div className="auth-illustration-circle" />

          <div className="auth-lab-card auth-lab-card--one">
            <FlaskConical size={19} />
          </div>

          <div className="auth-lab-card auth-lab-card--two">
            <ShieldCheck size={18} />
          </div>

          <div className="auth-test-tube tube-one" />
          <div className="auth-test-tube tube-two" />

          <div className="auth-beaker">
            <div className="auth-beaker-liquid" />
          </div>

          <div className="auth-microscope">
            <div className="microscope-head" />
            <div className="microscope-arm" />
            <div className="microscope-base" />
            <div className="microscope-stage" />
          </div>

        </div>


        {/* Left content */}

        <div className="auth-visual-content">

          <span>
            SECURE VERIFICATION
          </span>

          <h2>
            Verify your
            <br />
            laboratory account.
          </h2>

          <p>
            We'll securely verify your registered mobile
            number before giving you access to your
            laboratory workspace.
          </p>

        </div>


        <div className="auth-visual-footer">
          <span>Secure</span>
          <span>•</span>
          <span>Private</span>
          <span>•</span>
          <span>Reliable</span>
        </div>

      </section>


      {/* =====================================================
          RIGHT LOGIN PANEL
      ===================================================== */}

      <section className="auth-login-panel">

        <div className="auth-login-container">

          {/* Mobile brand */}

          <div className="auth-mobile-brand">

            <div className="auth-logo-mark">
              <FlaskConical size={20} />
            </div>

            <span>
              LabLIMS
            </span>

          </div>


          {/* Heading */}

          <div className="auth-login-heading">

            <div className="auth-page-icon">
              <MessageSquare size={21} />
            </div>

            <h1>
              Mobile verification
            </h1>

            <p>
              {!sent
                ? "We'll send a 6-digit OTP to your registered mobile number."
                : "Enter the 6-digit OTP sent to your mobile number."
              }
            </p>

          </div>


          <AuthCard title="">

            <div className="otp-form">

              {!sent ? (

                <>
                  <Input
                    label="Mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter mobile number"
                  />

                  <Button
                    onClick={() => setSent(true)}
                  >
                    <MessageSquare size={15} />

                    <span>
                      Send SMS OTP
                    </span>

                    <ArrowRight size={14} />
                  </Button>
                </>

              ) : (

                <>

                  {/* OTP sent message */}

                  <div className="otp-sent-message">

                    <div className="otp-sent-icon">
                      <MessageSquare size={17} />
                    </div>

                    <div>

                      <strong>
                        OTP sent successfully
                      </strong>

                      <span>
                        Check your messages for the verification code.
                      </span>

                    </div>

                  </div>


                  {/* OTP */}

                  <div className="auth-otp-wrapper">

                    <span className="auth-otp-label">
                      Enter 6-digit OTP
                    </span>

                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                    />

                  </div>


                  {/* Verify */}

                  <Button
                    disabled={otp.length !== 6}
                  >
                    <ShieldCheck size={15} />

                    <span>
                      Verify & Log in
                    </span>
                  </Button>


                  {/* Resend */}

                  <button
                    type="button"
                    className="auth-text-btn"
                    onClick={() => setOtp("")}
                  >
                    <RefreshCw size={13} />
                    Resend OTP
                  </button>

                </>

              )}

            </div>


            {/* Back */}

            <Link
              className="auth-centered-link"
              to="/login"
            >
              ← Back to login
            </Link>

          </AuthCard>


          {/* Support */}

          <div className="auth-help otp-help">

            <span>
              Need help?
            </span>

            <strong>
              +91 90000 00000
            </strong>

            <small>
              Monday to Friday · 11:00 AM – 5:00 PM
            </small>

          </div>


          {/* Footer */}

          <div className="auth-footer">
            © {new Date().getFullYear()} LabLIMS
          </div>

        </div>

      </section>

    </div>
  );
}