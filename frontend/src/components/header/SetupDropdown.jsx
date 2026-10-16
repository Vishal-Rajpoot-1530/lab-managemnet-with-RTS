import { useNavigate } from "react-router-dom";
import {
  FlaskConical,
  FileText,
  CreditCard,
  Bell,
} from "lucide-react";

export default function SetupDropdown() {
  const navigate = useNavigate();

  const settings = [
    {
      label: "Lab settings",
      path: "/settings/lab",
      icon: FlaskConical,
    },
    {
      label: "Report settings",
      path: "/settings/reports",
      icon: FileText,
    },
    {
      label: "Billing settings",
      path: "/settings/billing",
      icon: CreditCard,
    },
    {
      label: "Notification settings",
      path: "/settings/notifications",
      icon: Bell,
    },
  ];

  return (
    <div className="simple-menu">
      {settings.map(({ label, path, icon: Icon }) => (
        <button
          key={path}
          type="button"
          onClick={() => navigate(path)}
        >
          <Icon size={17} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
