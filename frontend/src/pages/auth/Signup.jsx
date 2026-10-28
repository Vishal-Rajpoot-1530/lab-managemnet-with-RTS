import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
} from "lucide-react";

import AuthCard from "../../components/common/AuthCard";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";
import labLimsLogo from "../../assets/logo2.png";
import "./auth.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    // Frontend phase only.
    // Connect signup API here when backend integration is ready.
    navigate("/login");
  };

  return (
    <div className="auth-page">

      {/* =====================================================
          LEFT VISUAL PANEL
      ===================================================== */}

      <section className="auth-visual">

        <div className="auth-visual-brand">

          <div className="auth-logo-mark">
                   <img src={labLimsLogo} alt="LabLIMS Logo" />
                   </div>

          <div>
            <div className="auth-logo">
              <span className="lp-brand-text">
           LAB<span>LIMS</span>
          </span>
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

          <span>LABORATORY OPERATIONS</span>

          <h2>
            Start managing
            <br />
            your laboratory.
          </h2>

          <p>
            Create your LabLIMS account and manage patients,
            investigations, reports and laboratory workflows
            from one secure workspace.
          </p>
       </div>
      </section>


      {/* =====================================================
          RIGHT SIGNUP PANEL
      ===================================================== */}

      <section className="auth-login-panel">

        <div className="auth-login-container signup-container">

          {/* Mobile brand */}

          <div className="auth-mobile-brand">

            <div className="auth-logo-mark">
              <FlaskConical size={20} />
            </div>

            <span>LabLIMS</span>

          </div>


          {/* Heading */}

          <div className="auth-login-heading">

            <h1>
              Create your account
            </h1>

            <p>
              Register your laboratory account to get started
            </p>

          </div>


          <AuthCard title="">

            <form onSubmit={submit}>

              <Input
                label="Full name"
                value={form.fullName}
                placeholder="Enter your full name"
                onChange={(e) =>
                  updateField("fullName", e.target.value)
                }
              />


              <Input
                label="Email address"
                value={form.email}
                placeholder="Enter email address"
                onChange={(e) =>
                  updateField("email", e.target.value)
                }
              />


              <Input
                label="Mobile number"
                value={form.mobile}
                placeholder="Enter mobile number"
                onChange={(e) =>
                  updateField("mobile", e.target.value)
                }
              />


              <PasswordInput
                value={form.password}
                placeholder="Create a password"
                onChange={(e) =>
                  updateField("password", e.target.value)
                }
              />


              <PasswordInput
                value={form.confirmPassword}
                placeholder="Confirm your password"
                onChange={(e) =>
                  updateField(
                    "confirmPassword",
                    e.target.value
                  )
                }
              />


              <Button type="submit">

                <span>
                  Create account
                </span>

                <ArrowRight size={15} />

              </Button>

            </form>


            <div className="auth-divider">
              <span>OR</span>
            </div>


            <Link
              className="auth-centered-link signup-back-link"
              to="/login"
            >
              ← Back to login
            </Link>

          </AuthCard>


          {/* Help */}

          <div className="auth-help">

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


          <div className="auth-footer">
            © {new Date().getFullYear()} LabLIMS
          </div>

        </div>

      </section>

    </div>
  );
}