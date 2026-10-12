import { useEffect, useRef, useState } from "react";
import {
  Search,
  Headphones,
  Settings,
  Play,
  HelpCircle,
  Bell,
  UserRound,
  ChevronDown,
  ThumbsUp,
  Megaphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Dropdown from "../common/Dropdown";
import IconButton from "../common/IconButton";
import ProfileDropdown from "../header/ProfileDropdown";
import HelpDropdown from "../header/HelpDropdown";
import SetupDropdown from "../header/SetupDropdown";
import logo from "../../assets/logo2.png";

import "./header.css";

const notifications = [
  {
    date: "01 October, 2026",
    message:
      "On account of Gandhi Jayanti, customer support team will not be available tomorrow (2nd Oct'26).",
    likes: 11,
  },
  {
    date: "23 September, 2026",
    message:
      "We are always here to help! But we are also busy on call with customers. Please raise a support ticket and we will call you back.",
    likes: 5,
  },
  {
    date: "09 September, 2026",
    message:
      "Manage entire panels from a single page. Try now Lab > Test Panels",
    likes: 0,
  },
];

function NotificationPanel() {
  return (
    <div
      className="notification-panel"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="notification-header">
        <strong>Notification</strong>
      </div>

      <div className="notification-list">
        {notifications.map((notification, index) => (
          <div className="notification-item" key={index}>
            <div className="notification-meta">
              <span className="notification-badge">
                Announcement
              </span>

              <span className="notification-date">
                {notification.date}
              </span>
            </div>

            <div className="notification-message">
              {notification.message}
            </div>

            <div className="notification-feedback">
              <button type="button" className="notification-like">
                <ThumbsUp size={14} />
                <span>{notification.likes}</span>
              </button>

              <button type="button" className="notification-feedback-button">
                <Megaphone size={14} />
                Feedback?
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="notification-footer">
        <div className="notification-footer-text">
          <strong>Follow us</strong>
          <strong>on</strong>
          <strong>Instagram</strong>
        </div>

        <div className="notification-instagram">
          <div className="notification-qr">
            <span>◎</span>
          </div>

          <small>@LABSMARTLIS</small>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [o, setO] = useState(null);
  const [q, setQ] = useState("");

  const nav = useNavigate();

  const notificationRef = useRef(null);

  const t = (x) => {
    setO((current) => (current === x ? null : x));
  };

  /*
   * Close notification when clicking anywhere outside it.
   */
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        o === "notifications" &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setO(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [o]);

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
        <b>LabLIMS</b>
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
                encodeURIComponent(q),
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

        {/* WATCH VIDEO */}
        <button className="watch">
          <Play />
          Watch Video
        </button>

        {/* NOTIFICATIONS */}
        <div
          className="notification-wrapper"
          ref={notificationRef}
        >
          <div className="notification-button-wrap">
            <IconButton
              label="Notifications"
              onClick={() => t("notifications")}
            >
              <Bell />
            </IconButton>

            {/* Notification count */}
            <span className="notification-dot" />
          </div>

          {o === "notifications" && <NotificationPanel />}
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