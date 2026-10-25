import { useMemo, useState } from "react";
import { Search, Plus, FileText, Pencil, Trash2, X, Check, Power, AlertCircle } from "lucide-react";
import { createRadiologyApi } from "../../api/services/radiologyApiService";
import { SECTIONS, errorMessage, useLoad } from "./radiologyCommon";

export default function RadiologyTemplates({ section }) {
  const config = SECTIONS[section];
  const api = useMemo(() => createRadiologyApi(config.base), [config.base]);
  const blankTemplate = { name: "", category: "General", description: "", body: "", active: true };

  const { data, loading, error, reload } = useLoad(() => api.templates(), [api]);
  const templates = data || [];

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blankTemplate);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => templates.filter((item) =>
    `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(search.toLowerCase().trim())
  ), [templates, search]);

  function openNew() {
    setEditingId(null);
    setForm(blankTemplate);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item.id);
    setForm({ name: item.name, category: item.category, description: item.description, body: item.body || "", active: item.active });
    setFormError("");
    setModalOpen(true);
  }

  async function saveTemplate(event) {
    event.preventDefault();
    if (!form.name.trim()) {
      setFormError("Please enter a template name.");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      const payload = { ...form, name: form.name.trim() };
      if (editingId !== null) await api.updateTemplate(editingId, payload);
      else await api.createTemplate(payload);
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

  const deleteTemplate = (id) => {
    if (window.confirm("Delete this template? This action cannot be undone.")) run(() => api.removeTemplate(id));
  };
  const toggleActive = (item) => run(() => api.updateTemplate(item.id, { active: !item.active }));

  return (
    <main className="usg-page">
      <header className="usg-header">
        <div><span className="usg-eyebrow">REPORT CONFIGURATION</span><h1>Report Templates</h1><p>{config.templateText}</p></div>
        <button className="usg-btn usg-btn-primary" onClick={openNew}><Plus size={16} /> New template</button>
      </header>

      {(error || actionError) && <div className="usg-notice"><AlertCircle size={19} /><div><strong>Something went wrong</strong><p>{error || actionError}</p></div></div>}

      <section className="usg-stats usg-stats-three">
        <Stat label="Total templates" value={templates.length} />
        <Stat label="Active templates" value={templates.filter((item) => item.active).length} tone="green" />
        <Stat label="Inactive templates" value={templates.filter((item) => !item.active).length} tone="amber" />
      </section>

      <section className="usg-panel">
        <div className="usg-panel-heading"><div><h2>Template library</h2><p>Manage your report formats and categories.</p></div><span className="usg-count">{filtered.length} templates</span></div>
        <div className="usg-filters"><label className="usg-search"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates..." /></label></div>

        <div className="usg-template-grid">
          {filtered.map((item) => <article className="usg-template-card" key={item.id}>
            <div className="usg-template-top"><div className="usg-template-icon"><FileText size={21} /></div><span className={`usg-badge ${item.active ? "completed" : "normal"}`}>{item.active ? "Active" : "Inactive"}</span></div>
            <span className="usg-template-category">{item.category}</span>
            <h3>{item.name}</h3>
            <p>{item.description || "No description added."}</p>
            <small>Last updated: {item.updated}</small>
            <div className="usg-template-actions">
              <button className="usg-btn usg-btn-light" onClick={() => openEdit(item)}><Pencil size={14} /> Edit</button>
              <button className="usg-btn usg-btn-light" onClick={() => toggleActive(item)}><Power size={14} /> {item.active ? "Disable" : "Enable"}</button>
              <button className="usg-icon-btn usg-danger-icon" title="Delete template" onClick={() => deleteTemplate(item.id)}><Trash2 size={15} /></button>
            </div>
          </article>)}
          {!filtered.length && <div className="usg-empty usg-template-empty"><Search size={25} /><strong>{loading ? "Loading templates..." : "No templates found"}</strong><p>{loading ? "Please wait." : "Try another search or create a new template."}</p>{!loading && <button className="usg-btn usg-btn-primary" onClick={openNew}><Plus size={15} /> New template</button>}</div>}
        </div>
      </section>

      {modalOpen && <div className="usg-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setModalOpen(false)}>
        <form className="usg-modal" onSubmit={saveTemplate} role="dialog" aria-modal="true" aria-labelledby="template-modal-title">
          <div className="usg-modal-head"><div><span className="usg-eyebrow">TEMPLATE SETTINGS</span><h2 id="template-modal-title">{editingId !== null ? "Edit template" : "Create template"}</h2><p>Enter the template details below.</p></div><button type="button" className="usg-icon-btn" onClick={() => setModalOpen(false)} aria-label="Close"><X size={18} /></button></div>
          <label className="usg-form-field">Template name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={config.templatePlaceholder} /></label>
          <label className="usg-form-field">Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{[...new Set([...config.categories, form.category])].map((c) => <option key={c}>{c}</option>)}</select></label>
          <label className="usg-form-field">Description<textarea rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the intended use of this template..." /></label>
          <label className="usg-form-field">Report text<textarea rows="6" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Default findings / impression text for this template..." /></label>
          <label className="usg-checkbox"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Template is active</label>
          {formError && <p className="usg-form-error">{formError}</p>}
          <div className="usg-modal-actions"><button type="button" className="usg-btn usg-btn-light" onClick={() => setModalOpen(false)}>Cancel</button><button className="usg-btn usg-btn-primary" type="submit" disabled={saving}><Check size={15} /> {saving ? "Saving..." : "Save template"}</button></div>
        </form>
      </div>}
    </main>
  );
}

function Stat({ label, value, tone = "blue" }) {
  return <article className="usg-stat"><div className={`usg-stat-icon ${tone}`}><FileText size={20} /></div><div><p>{label}</p><strong>{value}</strong></div></article>;
}
