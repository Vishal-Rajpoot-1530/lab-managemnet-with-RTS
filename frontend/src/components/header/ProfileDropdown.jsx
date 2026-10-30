import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  UserRound,
  FlaskConical,
  PlusCircle,
  Gift,
  Mail,
  LogOut,
  IndianRupee,
} from "lucide-react";

import Toggle from "../common/Toggle";
import { manageRequest } from "../../pages/manage/manageApi";

export default function ProfileDropdown({ onClose }) {
  const nav = useNavigate();

  const [n, setN] = useState(true);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: "",
    labId: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch logged-in user's profile
  useEffect(() => {
    let active = true;

    manageRequest("/profile")
      .then((data) => {
        if (active) {
          setProfile((previous) => ({
            ...previous,
            ...(data?.profile || {}),
          }));
        }
      })
      .catch((error) => {
        console.error("Failed to load profile:", error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const go = (p) => {
    onClose();
    nav(p);
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();

    onClose();
    nav("/login", { replace: true });
  };

  const displayName = loading
    ? "Loading..."
    : profile.fullName || "Account";

  const displayRole = profile.role || "Account member";

  return (
    <div>
      {/* PROFILE HEADER */}
      <div className="profile-head">
        <strong>{displayName}</strong>

        <b>{displayRole}</b>

        {profile.email && (
          <small>{profile.email}</small>
        )}

        {profile.labId && (
          <small>Lab ID #: {profile.labId}</small>
        )}
      </div>

      {/* TODAY'S TOTAL */}
      <button type="button" className="today">
        <IndianRupee />
        My today's total : <span>Rs.0</span>⌄
      </button>

      {/* PROFILE LINKS */}
      <div className="profile-links">

        <button onClick={() => go("/manage/my-account")}>
          <UserRound />
          My account
        </button>

        <button onClick={() => go("/manage/lab-account")}>
          <FlaskConical />
          Lab account
        </button>

        <button onClick={() => go("/manage/setup-lab")}>
          <PlusCircle />
          Setup a new lab
        </button>

        <button onClick={() => go("/manage/referral-program")}>
          <Gift />
          Referral program
        </button>

        <button onClick={() => go("/manage/email-preferences")}>
          <Mail />
          Email subscription preferences
        </button>

      </div>

      {/* NAVIGATION TOGGLE */}
      <Toggle
        label="Enable new navigation"
        checked={n}
        onChange={setN}
      />

      {/* LOGOUT */}
      <button className="logout" onClick={logout}>
        <LogOut />
        Logout
      </button>
    </div>
  );
}
