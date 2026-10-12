import { NavLink } from "react-router-dom";
import {
  Activity,
  CalendarDays,
  FileText,
  FileSignature,
  Search,
} from "lucide-react";
import "./USG.css";

const navigation = [
  { to: "/usg/today", label: "Today's Cases", icon: CalendarDays },
  { to: "/usg/search", label: "Search Cases", icon: Search },
  { to: "/usg/templates", label: "Report Templates", icon: FileText },
  { to: "/usg/signatures", label: "Signatures", icon: FileSignature },
];

export default function UsgPageLayout({
  title,
  subtitle,
  children,
  action,
}) {
  return (
    <main className="usg-workspace">
      <header className="usg-heading">
        <div className="usg-heading-icon">
          <Activity size={23} />
        </div>

        <div className="usg-heading-copy">
          <span className="usg-eyebrow">LABLIMS / ULTRASOUND</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        {action && <div className="usg-heading-action">{action}</div>}
      </header>

      <nav className="usg-tabs" aria-label="USG navigation">
        {navigation.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `usg-tab${isActive ? " active" : ""}`
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <section className="usg-content">{children}</section>
    </main>
  );
}