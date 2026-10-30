import { useState } from "react";
import {
  Search,
  Headphones,
  Settings,
  UserRound,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Dropdown from "../common/Dropdown";
import IconButton from "../common/IconButton";
import ProfileDropdown from "../header/ProfileDropdown";
import HelpDropdown from "../header/HelpDropdown";
import SetupDropdown from "../header/SetupDropdown";
import logo from "../../assets/logo2.png";

import "./header.css";
import NotificationBell from "../../pages/access/NotificationBell";

export default function Header() {
  const [o, setO] = useState(null);
  const [q, setQ] = useState("");

  const nav = useNavigate();

  const t = (x) => {
    setO((current) => (current === x ? null : x));
  };

  return (
    <header className="app-header">

      {/* =====================================================
          3D LAB BACKGROUND
          Decorative only - does not affect functionality
          ===================================================== */}

      <div className="header-3d-bg" aria-hidden="true">

        {/* Floating glass/orb elements */}
        <div className="lab-orb orb-1"></div>
        <div className="lab-orb orb-2"></div>
        <div className="lab-orb orb-3"></div>

        {/* Molecule 1 */}
        <div className="molecule molecule-1">
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Molecule 2 */}
        <div className="molecule molecule-2">
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Small floating particles */}
        <span className="lab-particle particle-1"></span>
        <span className="lab-particle particle-2"></span>
        <span className="lab-particle particle-3"></span>
        <span className="lab-particle particle-4"></span>

      </div>

      {/* BRAND */}
      <div className="brand">
        <img src={logo} alt="LabLIMS Logo" />

        <span className="lp-brand-text">
          LAB<span>LIMS</span>
        </span>
      </div>

      {/* SEARCH */}
      <div className="search">
        <Search />

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            q.trim() &&
            nav(
              "/cases/bills?search=" +
                encodeURIComponent(q)
            )
          }
          placeholder="Search any bills, reports"
        />
      </div>

      {/* ACTIONS */}
      <div className="actions">

        {/* HELP */}
        <div className="rel">
          <button
            className="action help"
            onClick={() => t("help")}
          >
            <Headphones />
            Help
            <ChevronDown />
          </button>

          <Dropdown
            open={o === "help"}
            onClose={() => setO(null)}
          >
            <HelpDropdown />
          </Dropdown>
        </div>

        {/* SETUP */}
        <div className="rel">
          <button
            className="action setup"
            onClick={() => t("setup")}
          >
            <Settings />
            Setup
            <ChevronDown />
          </button>

          <Dropdown
            open={o === "setup"}
            onClose={() => setO(null)}
          >
            <SetupDropdown />
          </Dropdown>
        </div>

        {/* NOTIFICATIONS - BACKEND CONNECTED */}
        <div className="notification-wrapper">
          <div className="notification-button-wrap">
            <NotificationBell />
          </div>
        </div>

        {/* PROFILE */}
        <div className="rel">
          <IconButton
            label="Account"
            onClick={() => t("profile")}
          >
            <UserRound />
          </IconButton>

          <Dropdown
            open={o === "profile"}
            onClose={() => setO(null)}
            className="profile-drop"
          >
            <ProfileDropdown
              onClose={() => setO(null)}
            />
          </Dropdown>
        </div>

      </div>
    </header>
  );
}
