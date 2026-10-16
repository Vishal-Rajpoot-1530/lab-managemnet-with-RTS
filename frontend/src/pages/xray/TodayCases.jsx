import { useMemo, useState } from "react";
import { Search, RefreshCw, CalendarDays, FileText, Clock, CheckCircle2, Activity, Eye, Pencil, X, AlertCircle } from "lucide-react";
import { demoCases } from "./usgData";
import "./todayCases.css";

export default function TodayCases() {
  const [cases, setCases] = useState(demoCases);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [priority, setPriority] = useState("All Priorities");
  const [selected, setSelected] = useState(null);

  const today = new Date().toISOString().slice(0, 10);
  const todaysCases = cases.filter((item) => item.date === today);

  const filtered = useMemo(() => cases.filter((item) => {
    const term = search.toLowerCase().trim();
    const matchesSearch = [item.id, item.patientName, item.patientId, item.testName, item.referringDoctor]
      .some((value) => value.toLowerCase().includes(term));
    return matchesSearch &&
      (status === "All Statuses" || item.status === status) &&
      (priority === "All Priorities" || item.priority === priority) &&
      item.date === today;
  }), [cases, search, status, priority, today]);

  function updateStatus(id, newStatus) {
    setCases((old) => old.map((item) => item.id === id ? { ...item, status: newStatus } : item));
    setSelected((old) => old?.id === id ? { ...old, status: newStatus } : old);
  }

  function reset() {
    setSearch("");
    setStatus("All Statuses");
    setPriority("All Priorities");
  }

  const count = (value) => todaysCases.filter((item) => !value || item.status === value).length;

  return (
    <main className="usg-page">
      <header className="usg-header">
        <div>
          <span className="usg-eyebrow">ULTRASOUND DEPARTMENT</span>
          <h1>Today's X-RAY Cases</h1>
          <p>Review and manage today's ultrasound cases.</p>
        </div>
        <div className="usg-header-actions">
          <span className="usg-date-chip"><CalendarDays size={16} /> {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
          <button className="usg-btn usg-btn-light" onClick={reset}><RefreshCw size={15} /> Reset filters</button>
        </div>
      </header>

      <section className="usg-stats">
        <Stat icon={<FileText />} label="Today's cases" value={todaysCases.length} />
        <Stat icon={<Clock />} label="Report pending" value={count("Report Pending")} tone="amber" />
        <Stat icon={<Activity />} label="In progress" value={count("In Progress")} tone="purple" />
        <Stat icon={<CheckCircle2 />} label="Completed" value={count("Completed")} tone="green" />
      </section>

      <section className="usg-panel">
        <div className="usg-panel-heading">
          <div><h2>Case list</h2><p>Search by patient, case ID, test, or referring doctor.</p></div>
          <span className="usg-count">{filtered.length} cases</span>
        </div>

        <div className="usg-filters">
          <label className="usg-search"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cases..." /></label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            <option>All Statuses</option><option>Report Pending</option><option>In Progress</option><option>Completed</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Filter by priority">
            <option>All Priorities</option><option>Normal</option><option>Urgent</option>
          </select>
          <button className="usg-btn usg-btn-text" onClick={reset}>Clear</button>
        </div>

        <div className="usg-table-wrap">
          <table className="usg-table">
            <thead><tr><th>Case / Patient</th><th>Age / Gender</th><th>Investigation</th><th>Referring doctor</th><th>Received</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.patientName}</strong><small className="usg-case-id">{item.id}</small><small>{item.patientId}</small></td>
                  <td>{item.age} years<small>{item.gender}</small></td>
                  <td>{item.testName}</td><td>{item.referringDoctor}</td><td>{item.receivedAt}</td>
                  <td><span className={`usg-badge ${item.priority === "Urgent" ? "urgent" : "normal"}`}>{item.priority === "Urgent" && <AlertCircle size={12} />} {item.priority}</span></td>
                  <td><span className={`usg-badge ${statusClass(item.status)}`}>{item.status}</span></td>
                  <td><div className="usg-row-actions">
                    <button className="usg-icon-btn" title="View details" onClick={() => setSelected(item)}><Eye size={16} /></button>
                    <button className="usg-icon-btn" title="Advance status" onClick={() => updateStatus(item.id, item.status === "Report Pending" ? "In Progress" : item.status === "In Progress" ? "Completed" : "Report Pending")}><Pencil size={15} /></button>
                  </div></td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan="8"><div className="usg-empty"><Search size={25} /><strong>No cases found</strong><p>Try changing your search or filters.</p><button className="usg-btn usg-btn-light" onClick={reset}>Clear filters</button></div></td></tr>}
            </tbody>
          </table>
        </div>
        <div className="usg-table-footer">Showing {filtered.length} of {todaysCases.length} today's cases <span>Demo data only</span></div>
      </section>

      {selected && <div className="usg-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
        <section className="usg-modal" role="dialog" aria-modal="true" aria-labelledby="case-title">
          <div className="usg-modal-head"><div><span className="usg-eyebrow">CASE DETAILS</span><h2 id="case-title">{selected.patientName}</h2><p>{selected.id} · {selected.patientId}</p></div><button className="usg-icon-btn" onClick={() => setSelected(null)} aria-label="Close"><X size={18} /></button></div>
          <div className="usg-detail-grid">
            <Detail label="Age" value={`${selected.age} years`} /><Detail label="Gender" value={selected.gender} />
            <Detail label="Investigation" value={selected.testName} /><Detail label="Referring doctor" value={selected.referringDoctor} />
            <Detail label="Received" value={selected.receivedAt} /><Detail label="Priority" value={selected.priority} />
          </div>
          <label className="usg-form-field">Case status<select value={selected.status} onChange={(e) => updateStatus(selected.id, e.target.value)}><option>Report Pending</option><option>In Progress</option><option>Completed</option></select></label>
          <div className="usg-modal-actions"><button className="usg-btn usg-btn-primary" onClick={() => setSelected(null)}>Done</button></div>
        </section>
      </div>}
    </main>
  );
}

function Stat({ icon, label, value, tone = "blue" }) {
  return <article className="usg-stat"><div className={`usg-stat-icon ${tone}`}>{icon}</div><div><p>{label}</p><strong>{value}</strong></div></article>;
}
function Detail({ label, value }) {
  return <div className="usg-detail"><span>{label}</span><strong>{value || "—"}</strong></div>;
}
function statusClass(status) {
  return status === "Completed" ? "completed" : status === "In Progress" ? "progress" : "pending";
}