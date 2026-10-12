import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./app-layout.css";

export default function AppLayout() {
  return (
    <div className="app-shell">

      {/* Full width header */}
      <Header />

      {/* Sidebar + page content */}
      <div className="app-workspace">

        <Sidebar />

        <main className="app-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}