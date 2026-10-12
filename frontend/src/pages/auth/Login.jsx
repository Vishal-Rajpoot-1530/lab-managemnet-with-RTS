import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
} from "lucide-react";
import AuthCard from "../../components/common/AuthCard";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";
import "./auth.css";

export default function EmployeeLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identity: "",
    password: "",
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();

    // Frontend phase only.
    // Replace with authApi.login() when backend integration starts.
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">

      {/* ================= LEFT SIDE ================= */}
      <section className="auth-visual">

        <div className="auth-visual-brand">
          <div className="auth-logo-mark">
            <FlaskConical size={23} />
          </div>

          <div>
            <div className="auth-logo">LabLIMS</div>
            <div className="auth-logo-caption">
              Laboratory Management System
            </div>
          </div>
        </div>

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

        <div className="auth-visual-content">
          <span>LABORATORY OPERATIONS</span>

          <h2>
            Smarter laboratory
            <br />
            management.
          </h2>

          <p>
            Manage patients, investigations, reports and
            laboratory workflows from one secure workspace.
          </p>
        </div>

        <div className="auth-visual-footer">
          <span>Secure</span>
          <span>•</span>
          <span>Reliable</span>
          <span>•</span>
          <span>Efficient</span>
        </div>

      </section>


      {/* ================= RIGHT SIDE ================= */}
      <section className="auth-login-panel">

        <div className="auth-login-container">

          <div className="auth-mobile-brand">
            <div className="auth-logo-mark">
              <FlaskConical size={20} />
            </div>

            <span>LabLIMS</span>
          </div>

          <div className="auth-login-heading">
            <h1>Login</h1>

            <p>
              Sign in to your account to continue
            </p>
          </div>


          <AuthCard title="">

            <form onSubmit={submit}>

              <Input
                label="Email / Mobile number"
                value={form.identity}
                placeholder="Enter email or mobile number"
                onChange={(e) =>
                  setForm({
                    ...form,
                    identity: e.target.value,
                  })
                }
              />

              <PasswordInput
                value={form.password}
                placeholder="Enter password"
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                rightElement={
                  <Link to="/forgot-password">
                    Forgot Password?
                  </Link>
                }
              />

              <label className="auth-check">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      remember: e.target.checked,
                    })
                  }
                />

                <span>Remember me</span>
              </label>

              <Button type="submit">
                <span>Log in</span>
                <ArrowRight size={15} />
              </Button>

            </form>


            <div className="auth-divider">
              <span>OR</span>
            </div>


            <div className="auth-otp-options">

              <Button
                variant="outline"
                onClick={() => navigate("/email-otp")}
              >
                <Mail size={16} />

                <span>
                  Login via Email OTP
                </span>
              </Button>


              <Button
                variant="outline"
                onClick={() => navigate("/sms-otp")}
              >
                <MessageSquare size={16} />

                <span>
                  Login via SMS OTP
                </span>
              </Button>

            </div>


            <Link
              className="auth-centered-link"
              to="/account-locked"
            >
              Account locked?
            </Link>

          </AuthCard>


          <div className="auth-signup">
            Don't have an account?{" "}
            <a
              href="/Signup"
               onClick={() => navigate("/Signup")}
            >
              Sign Up
            </a>
          </div>


          <div className="auth-help">
            <span>Need help?</span>

            <strong>
              +91 90000 00000
            </strong>

            <small>
              Monday to Friday · 11:00 AM – 5:00 PM
            </small>
          </div>


          <div className="auth-footer">
            © {new Date().getFullYear()} LabLIMS
          </div>

        </div>

      </section>

    </div>
  );
}