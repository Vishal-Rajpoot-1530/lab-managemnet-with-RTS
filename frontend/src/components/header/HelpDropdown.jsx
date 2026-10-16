import { useNavigate } from "react-router-dom";
import {
  CircleHelp,
  Headphones,
} from "lucide-react";

export default function HelpDropdown() {
  const navigate = useNavigate();

  return (
    <div className="simple-menu">
      <button
        type="button"
        onClick={() => navigate("/help-center")}
      >
        <CircleHelp size={17} />
        <span>Help centre</span>
      </button>

      <button
        type="button"
        onClick={() => navigate("/contact-support")}
      >
        <Headphones size={17} />
        <span>Contact support</span>
      </button>
    </div>
  );
}
