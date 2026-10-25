import { useMemo, useState } from "react";
import { Search, RefreshCw, CalendarDays, FileText, Clock, CheckCircle2, Activity, Eye, Pencil, X, AlertCircle } from "lucide-react";
import { createRadiologyApi } from "../../api/services/radiologyApiService";
import { SECTIONS, STATUSES, errorMessage, nextStatus, statusClass, toCaseView, useLoad } from "./radiologyCommon";

export default function RadiologyTodayCases({ section }) {
  const config = SECTIONS[section];
  const api = useMemo(() => createRadiologyApi(config.base), [config.base]);

  const { data, loading, error, reload, setData } = useLoad(
    async () => (await api.todayCases()).map(toCaseView),
    [api],
  );
  const cases = data || [];

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return cases.filter((item) => {
      const matches = !term || [item.id, item.regNo, item.patientName, item.patientId, item.testName, item.referringDoctor]
        .some((value) => String(value || "").toLowerCase().includes(term));
      return matches && (status === "All Statuses" || item.status === status);
    });
  }, [cases, search, status]);

  async function updateStatus(item, newStatus) {
    setSaving(true);
    setSaveError("");
    try {
      const saved = await api.updateCase(item.key, { status: newStatus });
      setData((old) => (old || []).map((row) => (row.key === item.key ? { ...row, status: saved.status } : row)));
      setSelected((old) => (old && old.key === item.key ? { ...old, status: saved.status } : old));
    } catch (e) {
      setSaveError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setSearch("");
    setStatus("All Statuses");
  }

  const count = (value) => cases.filter((item) => !value || item.status === value).length;

  return (
    <main className="usg-page">
      <header className="usg-header">
        <div>
          <span className="usg-eyebrow">{config.eyebrow}</span>
          <h1>{config.todayTitle}</h1>
          <p>{config.todayText}</p>
        </div>
        <div className="usg-header-actions">
          <span className="usg-date-chip"><CalendarDays size={16} /> {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
          <button className="usg-btn usg-btn-light" onClick={reload} disabled={loading}><RefreshCw size={15} /> Refresh</button>
          <button className="usg-btn usg-btn-light" onClick={reset}>Reset filters</button>
        </div>
      </header>

      {error && <div className="usg-notice"><AlertCircle size={19} /><div><strong>Could not load cases</strong><p>{error}</p></div></div>}
      {saveError && <div className="usg-notice"><AlertCircle size={19} /><div><strong>Could not save</strong><p>{saveError}</p></div></div>}

      <section className="usg-stats">
        <Stat icon={<FileText />} label="Today's cases" value={count()} />
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
            <option>All Statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button className="usg-btn usg-btn-text" onClick={reset}>Clear</button>
        </div>

        <div className="usg-table-wrap">
          <table className="usg-table">
            <thead><tr><th>Case / Patient</th><th>Age / Gender</th><th>Investigation</th><th>Referring doctor</th><th>Received</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.key}>
                  <td><strong>{item.patientName}</strong><small className="usg-case-id">{item.id}</small><small>{item.patientId}</small></td>
                  <td>{item.age || "—"}<small>{item.gender}</small></td>
                  <td>{item.testName}</td><td>{item.referringDoctor}</td><td>{item.receivedAt}</td>
                  <td><span className={`usg-badge ${statusClass(item.status)}`}>{item.status}</span></td>
                  <td><div className="usg-row-actions">
                    <button className="usg-icon-btn" title="View details" onClick={() => setSelected(item)}><Eye size={16} /></button>
                    <button className="usg-icon-btn" title="Advance status" disabled={saving} onClick={() => updateStatus(item, nextStatus(item.status))}><Pencil size={15} /></button>
                  </div></td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan="7"><div className="usg-empty"><Search size={25} /><strong>{loading ? "Loading cases..." : "No cases found"}</strong><p>{loading ? "Please wait." : cases.length ? "Try changing your search or filters." : "Cases appear here when a bill with this investigation is created today."}</p>{!loading && cases.length > 0 && <button className="usg-btn usg-btn-light" onClick={reset}>Clear filters</button>}</div></td></tr>}
            </tbody>
          </table>
        </div>
        <div className="usg-table-footer">Showing {filtered.length} of {cases.length} today's cases</div>
      </section>

      {selected && <div className="usg-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
        <section className="usg-modal" role="dialog" aria-modal="true" aria-labelledby="case-title">
          <div className="usg-modal-head"><div><span className="usg-eyebrow">CASE DETAILS</span><h2 id="case-title">{selected.patientName}</h2><p>{selected.id} · {selected.patientId}</p></div><button className="usg-icon-btn" onClick={() => setSelected(null)} aria-label="Close"><X size={18} /></button></div>
          <div className="usg-detail-grid">
            <Detail label="Age" value={selected.age} /><Detail label="Gender" value={selected.gender} />
            <Detail label="Investigation" value={selected.testName} /><Detail label="Referring doctor" value={selected.referringDoctor} />
            <Detail label="Received" value={selected.receivedAt} /><Detail label="Bill no." value={selected.regNo} />
          </div>
          <label className="usg-form-field">Case status<select value={selected.status} disabled={saving} onChange={(e) => updateStatus(selected, e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
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
