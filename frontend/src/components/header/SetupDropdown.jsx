import {
  FlaskConical,
  FileText,
  CreditCard,
  Bell,
} from "lucide-react";

export default function SetupDropdown() {
  return (
    <div className="simple-menu">
      <button>
        <FlaskConical size={17} />
        <span>Lab settings</span>
      </button>

      <button>
        <FileText size={17} />
        <span>Report settings</span>
      </button>

      <button>
        <CreditCard size={17} />
        <span>Billing settings</span>
      </button>

      <button>
        <Bell size={17} />
        <span>Notification settings</span>
      </button>
    </div>
  );
}
