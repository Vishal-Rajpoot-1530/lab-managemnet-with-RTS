import { useEffect, useMemo, useState } from "react";
import { Search, X, Eye, CalendarDays, RefreshCw, AlertCircle } from "lucide-react";
import { createRadiologyApi } from "../../api/services/radiologyApiService";
import { SECTIONS, STATUSES, errorMessage, statusClass, toCaseView } from "./radiologyCommon";

export default function RadiologySearchCases({ section }) {
  const config = SECTIONS[section];
  const api = useMemo(() => createRadiologyApi(config.base), [config.base]);

  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  // Searches the database 300 ms after the last change to a filter.
  useEffect(() => {
    let stale = false;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const items = await api.searchCases({
          q: search.trim() || undefined,
          status: status === "All Statuses" ? undefined : status,
          from: date || undefined,
          to: date || undefined,
        });
        if (!stale) { setCases(items.map(toCaseView)); setError(""); }
      } catch (e) {
        if (!stale) setError(errorMessage(e));
      } finally {
        if (!stale) setLoading(false);
      }
    }, 300);

    return () => { stale = true; clearTimeout(timer); };
  }, [api, search, status, date, tick]);

  function reset() {
    setSearch("");
    setStatus("All Statuses");
    setDate("");
  }

  return (
    <main className="usg-page">
      <header className="usg-header">
        <div><span className="usg-eyebrow">CASE MANAGEMENT</span><h1>Search Cases</h1><p>{config.searchText}</p></div>
        <div className="usg-header-actions">
          <button className="usg-btn usg-btn-light" onClick={() => setTick((t) => t + 1)} disabled={loading}><RefreshCw size={15} /> Refresh</button>
          <button className="usg-btn usg-btn-light" onClick={reset}>Reset</button>
        </div>
      </header>

      {error && <div className="usg-notice"><AlertCircle size={19} /><div><strong>Could not load cases</strong><p>{error}</p></div></div>}

      <section className="usg-panel">
        <div className="usg-panel-heading">
          <div><h2>Search filters</h2><p>Use one or more filters to narrow the results.</p></div>
          <span className="usg-count">{cases.length} results</span>
        </div>

        <div className="usg-search-grid">
          <label className="usg-search"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Patient name, bill no., case ID, doctor..." /></label>
          <label className="usg-form-field">Date received<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <label className="usg-form-field">Status<select value={status} onChange={(e) => setStatus(e.target.value)}><option>All Statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
        </div>

        <div className="usg-table-wrap">
          <table className="usg-table">
            <thead><tr><th>Case / Patient</th><th>Patient ID</th><th>Investigation</th><th>Date</th><th>Referring doctor</th><th>Status</th><th>View</th></tr></thead>
            <tbody>
              {cases.map((item) => <tr key={item.key}>
                <td><strong>{item.patientName}</strong><small className="usg-case-id">{item.id}</small></td>
                <td>{item.patientId}</td><td>{item.testName}</td><td>{item.dateDisplay}</td><td>{item.referringDoctor}</td>
                <td><span className={`usg-badge ${statusClass(item.status)}`}>{item.status}</span></td>
                <td><button className="usg-icon-btn" onClick={() => setSelected(item)} aria-label={`View ${item.id}`}><Eye size={16} /></button></td>
              </tr>)}
              {!cases.length && <tr><td colSpan="7"><div className="usg-empty"><Search size={25} /><strong>{loading ? "Searching..." : "No matching cases"}</strong><p>{loading ? "Please wait." : "Try a different search term or date."}</p>{!loading && <button className="usg-btn usg-btn-light" onClick={reset}>Clear filters</button>}</div></td></tr>}
            </tbody>
          </table>
        </div>
        <div className="usg-table-footer">Showing {cases.length} cases <span><CalendarDays size={13} /> Newest first</span></div>
      </section>

      {selected && <div className="usg-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
        <section className="usg-modal" role="dialog" aria-modal="true" aria-labelledby="search-case-title">
          <div className="usg-modal-head"><div><span className="usg-eyebrow">CASE DETAILS</span><h2 id="search-case-title">{selected.patientName}</h2><p>{selected.id} · {selected.patientId}</p></div><button className="usg-icon-btn" onClick={() => setSelected(null)} aria-label="Close"><X size={18} /></button></div>
          <div className="usg-detail-grid">
            <Detail label="Age" value={selected.age} /><Detail label="Gender" value={selected.gender} />
            <Detail label="Investigation" value={selected.testName} /><Detail label="Date" value={selected.dateDisplay} />
            <Detail label="Referring doctor" value={selected.referringDoctor} /><Detail label="Received" value={selected.receivedAt} />
            <Detail label="Bill no." value={selected.regNo} /><Detail label="Status" value={selected.status} />
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
