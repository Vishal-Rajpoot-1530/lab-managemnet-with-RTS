import { useMemo, useState } from "react";
import { Search, Plus, UserRound, Pencil, Trash2, X, Check, Star, ShieldCheck, AlertCircle } from "lucide-react";
import { createRadiologyApi } from "../../api/services/radiologyApiService";
import { SECTIONS, errorMessage, useLoad } from "./radiologyCommon";

const blankSignature = { name: "", role: "Radiologist", registration: "", email: "", active: true, default: false };

export default function RadiologySignatures({ section }) {
  const config = SECTIONS[section];
  const api = useMemo(() => createRadiologyApi(config.base), [config.base]);

  const { data, loading, error, reload } = useLoad(() => api.signatures(), [api]);
  const signatures = data || [];

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blankSignature);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => signatures.filter((item) =>
    `${item.name} ${item.role} ${item.registration} ${item.email}`.toLowerCase().includes(search.toLowerCase().trim())
  ), [signatures, search]);

  function openNew() {
    setEditingId(null);
    setForm(blankSignature);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item.id);
    setForm({ name: item.name, role: item.role || "Radiologist", registration: item.registration, email: item.email, active: item.active, default: item.default });
    setFormError("");
    setModalOpen(true);
  }

  async function saveSignature(event) {
    event.preventDefault();
    if (!form.name.trim()) return setFormError("Please enter the radiologist's name.");
    if (!form.registration.trim()) return setFormError("Please enter the registration number.");

    setSaving(true);
    setFormError("");
    try {
      const payload = { ...form, name: form.name.trim(), registration: form.registration.trim() };
      if (editingId !== null) await api.updateSignature(editingId, payload);
      else await api.createSignature(payload);
      setModalOpen(false);
      reload();
    } catch (e) {
      setFormError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function run(action) {
    setActionError("");
    try {
      await action();
      reload();
    } catch (e) {
      setActionError(errorMessage(e));
    }
  }

  const setDefault = (item) => run(() => api.updateSignature(item.id, { default: true }));
  const toggleActive = (item) => run(() => api.updateSignature(item.id, { active: !item.active }));
  const deleteSignature = (id) => {
    if (window.confirm("Delete this signature profile?")) run(() => api.removeSignature(id));
  };

  return (
    <main className="usg-page">
      <header className="usg-header">
        <div><span className="usg-eyebrow">REPORT CONFIGURATION</span><h1>Signatures</h1><p>Manage radiologist profiles and report-signing preferences.</p></div>
        <button className="usg-btn usg-btn-primary" onClick={openNew}><Plus size={16} /> Add signature</button>
      </header>

      {(error || actionError) && <div className="usg-notice"><AlertCircle size={19} /><div><strong>Something went wrong</strong><p>{error || actionError}</p></div></div>}

      <div className="usg-notice"><ShieldCheck size={19} /><div><strong>Signature profile management</strong><p>Profiles are saved in your database. Connect an approved signing provider and authentication workflow before using electronic signatures for clinical reports.</p></div></div>

      <section className="usg-stats usg-stats-three">
        <Stat label="Total profiles" value={signatures.length} />
        <Stat label="Active profiles" value={signatures.filter((item) => item.active).length} tone="green" />
        <Stat label="Default profile" value={signatures.find((item) => item.default)?.name || "Not set"} />
      </section>

      <section className="usg-panel">
        <div className="usg-panel-heading"><div><h2>Radiologist profiles</h2><p>Choose which active profile is the default.</p></div><span className="usg-count">{filtered.length} profiles</span></div>
        <div className="usg-filters"><label className="usg-search"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, role, registration..." /></label></div>

        <div className="usg-signature-list">
          {filtered.map((item) => <article className="usg-signature-card" key={item.id}>
            <div className="usg-avatar"><UserRound size={23} /></div>
            <div className="usg-signature-info">
              <div className="usg-signature-name"><h3>{item.name}</h3>{item.default && <span className="usg-badge completed"><Star size={12} /> Default</span>}<span className={`usg-badge ${item.active ? "completed" : "normal"}`}>{item.active ? "Active" : "Inactive"}</span></div>
              <p>{item.role}</p>
              <div className="usg-signature-meta"><span>Registration: {item.registration || "—"}</span><span>{item.email || "No email added"}</span></div>
            </div>
            <div className="usg-signature-actions">
              {!item.default && item.active && <button className="usg-btn usg-btn-light" onClick={() => setDefault(item)}><Star size={14} /> Set default</button>}
              <button className="usg-icon-btn" title="Edit profile" onClick={() => openEdit(item)}><Pencil size={15} /></button>
              <button className="usg-icon-btn" title={item.active ? "Deactivate profile" : "Activate profile"} onClick={() => toggleActive(item)}>{item.active ? <ShieldCheck size={15} /> : <Check size={15} />}</button>
              <button className="usg-icon-btn usg-danger-icon" title="Delete profile" onClick={() => deleteSignature(item.id)}><Trash2 size={15} /></button>
            </div>
          </article>)}
          {!filtered.length && <div className="usg-empty"><Search size={25} /><strong>{loading ? "Loading profiles..." : "No profiles found"}</strong><p>{loading ? "Please wait." : "Try another search or add a signature profile."}</p>{!loading && <button className="usg-btn usg-btn-primary" onClick={openNew}><Plus size={15} /> Add signature</button>}</div>}
        </div>
      </section>

      {modalOpen && <div className="usg-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setModalOpen(false)}>
        <form className="usg-modal" onSubmit={saveSignature} role="dialog" aria-modal="true" aria-labelledby="signature-modal-title">
          <div className="usg-modal-head"><div><span className="usg-eyebrow">PROFILE SETTINGS</span><h2 id="signature-modal-title">{editingId !== null ? "Edit profile" : "Add signature profile"}</h2><p>Enter the radiologist's profile details.</p></div><button type="button" className="usg-icon-btn" onClick={() => setModalOpen(false)} aria-label="Close"><X size={18} /></button></div>
          <label className="usg-form-field">Full name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dr. Full Name" /></label>
          <label className="usg-form-field">Role<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{[...new Set(["Radiologist", "Senior Radiologist", "Consultant Radiologist", "Reporting Physician", form.role])].map((r) => <option key={r}>{r}</option>)}</select></label>
          <label className="usg-form-field">Medical registration number<input value={form.registration} onChange={(e) => setForm({ ...form, registration: e.target.value })} placeholder="Registration number" /></label>
          <label className="usg-form-field">Email address<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="doctor@example.com" /></label>
          <label className="usg-checkbox"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked, default: e.target.checked ? form.default : false })} /> Profile is active</label>
          <label className="usg-checkbox"><input type="checkbox" checked={form.default} disabled={!form.active} onChange={(e) => setForm({ ...form, default: e.target.checked })} /> Set as default profile</label>
          {formError && <p className="usg-form-error">{formError}</p>}
          <div className="usg-modal-actions"><button type="button" className="usg-btn usg-btn-light" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="usg-btn usg-btn-primary" disabled={saving}><Check size={15} /> {saving ? "Saving..." : "Save profile"}</button></div>
        </form>
      </div>}
    </main>
  );
}

function Stat({ label, value, tone = "blue" }) {
  return <article className="usg-stat"><div className={`usg-stat-icon ${tone}`}><UserRound size={20} /></div><div><p>{label}</p><strong className="usg-stat-value-text">{value}</strong></div></article>;
}
