import { useMemo, useState } from "react";
import { Search, X, Eye, CalendarDays, RefreshCw } from "lucide-react";
import { demoCases } from "./usgData";
import "./SearchCases.css";

export default function SearchCases() {
  const [cases] = useState(demoCases);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [priority, setPriority] = useState("All Priorities");
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => cases.filter((item) => {
    const term = search.trim().toLowerCase();
    const matchesText = !term || [
      item.id, item.patientName, item.patientId, item.testName, item.referringDoctor,
    ].some((value) => value.toLowerCase().includes(term));

    return matchesText &&
      (status === "All Statuses" || item.status === status) &&
      (priority === "All Priorities" || item.priority === priority) &&
      (!date || item.date === date);
  }), [cases, search, status, priority, date]);

  function reset() {
    setSearch("");
    setStatus("All Statuses");
    setPriority("All Priorities");
    setDate("");
  }

  return (
    <main className="usg-page">
      <header className="usg-header">
        <div><span className="usg-eyebrow">CASE MANAGEMENT</span><h1>Search Cases</h1><p>Find ultrasound cases by patient, date, or case details.</p></div>
        <button className="usg-btn usg-btn-light" onClick={reset}><RefreshCw size={15} /> Reset</button>
      </header>

      <section className="usg-panel">
        <div className="usg-panel-heading">
          <div><h2>Search filters</h2><p>Use one or more filters to narrow the results.</p></div>
          <span className="usg-count">{filtered.length} results</span>
        </div>

        <div className="usg-search-grid">
          <label className="usg-search"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Patient name, patient ID, case ID..." /></label>
          <label className="usg-form-field">Date received<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <label className="usg-form-field">Status<select value={status} onChange={(e) => setStatus(e.target.value)}><option>All Statuses</option><option>Report Pending</option><option>In Progress</option><option>Completed</option></select></label>
          <label className="usg-form-field">Priority<select value={priority} onChange={(e) => setPriority(e.target.value)}><option>All Priorities</option><option>Normal</option><option>Urgent</option></select></label>
        </div>

        <div className="usg-table-wrap">
          <table className="usg-table">
            <thead><tr><th>Case / Patient</th><th>Patient ID</th><th>Investigation</th><th>Date</th><th>Referring doctor</th><th>Priority</th><th>Status</th><th>View</th></tr></thead>
            <tbody>
              {filtered.map((item) => <tr key={item.id}>
                <td><strong>{item.patientName}</strong><small className="usg-case-id">{item.id}</small></td>
                <td>{item.patientId}</td><td>{item.testName}</td><td>{item.date}</td><td>{item.referringDoctor}</td>
                <td><span className={`usg-badge ${item.priority === "Urgent" ? "urgent" : "normal"}`}>{item.priority}</span></td>
                <td><span className={`usg-badge ${item.status === "Completed" ? "completed" : item.status === "In Progress" ? "progress" : "pending"}`}>{item.status}</span></td>
                <td><button className="usg-icon-btn" onClick={() => setSelected(item)} aria-label={`View ${item.id}`}><Eye size={16} /></button></td>
              </tr>)}
              {!filtered.length && <tr><td colSpan="8"><div className="usg-empty"><Search size={25} /><strong>No matching cases</strong><p>Try a different search term or date.</p><button className="usg-btn usg-btn-light" onClick={reset}>Clear filters</button></div></td></tr>}
            </tbody>
          </table>
        </div>
        <div className="usg-table-footer">Showing {filtered.length} of {cases.length} demo cases <span><CalendarDays size={13} /> Sample records only</span></div>
      </section>

      {selected && <div className="usg-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
        <section className="usg-modal" role="dialog" aria-modal="true" aria-labelledby="search-case-title">
          <div className="usg-modal-head"><div><span className="usg-eyebrow">CASE DETAILS</span><h2 id="search-case-title">{selected.patientName}</h2><p>{selected.id} · {selected.patientId}</p></div><button className="usg-icon-btn" onClick={() => setSelected(null)} aria-label="Close"><X size={18} /></button></div>
          <div className="usg-detail-grid">
            <Detail label="Age" value={`${selected.age} years`} /><Detail label="Gender" value={selected.gender} />
            <Detail label="Investigation" value={selected.testName} /><Detail label="Date" value={selected.date} />
            <Detail label="Referring doctor" value={selected.referringDoctor} /><Detail label="Received" value={selected.receivedAt} />
            <Detail label="Priority" value={selected.priority} /><Detail label="Status" value={selected.status} />
          </div>
          <div className="usg-modal-actions"><button className="usg-btn usg-btn-primary" onClick={() => setSelected(null)}>Close</button></div>
        </section>
      </div>}
    </main>
  );
}

function Detail({ label, value }) {
  return <div className="usg-detail"><span>{label}</span><strong>{value || "—"}</strong></div>;
}