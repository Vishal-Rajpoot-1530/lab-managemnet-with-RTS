import {
  CircleHelp,
  Headphones,
  Keyboard,
} from "lucide-react";

export default function HelpDropdown() {
  return (
    <div className="simple-menu">
      <button>
        <CircleHelp size={17} />
        <span>Help centre</span>
      </button>

      <button>
        <Headphones size={17} />
        <span>Contact support</span>
      </button>

      <button>
        <Keyboard size={17} />
        <span>Keyboard shortcuts</span>
      </button>
    </div>
  );
}