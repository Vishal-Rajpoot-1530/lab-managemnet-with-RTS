import { useMemo, useState } from "react";
import { Search, Plus, UserRound, Pencil, Trash2, X, Check, Star, ShieldCheck } from "lucide-react";
import { initialSignatures } from "./usgData";
import "./usg.css";

const blankSignature = {
  name: "",
  role: "Radiologist",
  registration: "",
  email: "",
  active: true,
  default: false,
};

export default function Signatures() {
  const [signatures, setSignatures] = useState(initialSignatures);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blankSignature);
  const [error, setError] = useState("");

  const filtered = useMemo(() => signatures.filter((item) =>
    `${item.name} ${item.role} ${item.registration} ${item.email}`
      .toLowerCase().includes(search.toLowerCase().trim())
  ), [signatures, search]);

  function openNew() {
    setEditingId(null);
    setForm(blankSignature);
    setError("");
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      role: item.role,
      registration: item.registration,
      email: item.email,
      active: item.active,
      default: item.default,
    });
    setError("");
    setModalOpen(true);
  }

  function saveSignature(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter the radiologist's name.");
      return;
    }
    if (!form.registration.trim()) {
      setError("Please enter the registration number.");
      return;
    }

    setSignatures((old) => {
      let next = old.map((item) => ({
        ...item,
        default: form.default ? false : item.default,
      }));

      if (editingId !== null) {
        next = next.map((item) => item.id === editingId
          ? { ...item, ...form, name: form.name.trim() }
          : item);
      } else {
        next.push({ ...form, id: Date.now(), name: form.name.trim() });
      }

      if (!next.some((item) => item.default) && next.length) {
        const firstActive = next.find((item) => item.active);
        if (firstActive) next = next.map((item) => ({ ...item, default: item.id === firstActive.id }));
      }
      return next;
    });

    setModalOpen(false);
  }

  function setDefault(id) {
    setSignatures((old) => old.map((item) => ({
      ...item,
      default: item.id === id && item.active,
    })));
  }

  function toggleActive(id) {
    setSignatures((old) => old.map((item) => {
      if (item.id !== id) return item;
      const active = !item.active;
      return { ...item, active, default: active ? item.default : false };
    }));
  }

  function deleteSignature(id) {
    if (window.confirm("Delete this signature profile?")) {
      setSignatures((old) => {
        const next = old.filter((item) => item.id !== id);
        if (!next.some((item) => item.default)) {
          const firstActive = next.find((item) => item.active);
          if (firstActive) return next.map((item) => ({ ...item, default: item.id === firstActive.id }));
        }
        return next;
      });
    }
  }

  return (
    <main className="usg-page">
      <header className="usg-header">
        <div><span className="usg-eyebrow">REPORT CONFIGURATION</span><h1>Signatures</h1><p>Manage radiologist profiles and report-signing preferences.</p></div>
        <button className="usg-btn usg-btn-primary" onClick={openNew}><Plus size={16} /> Add signature</button>
      </header>

      <div className="usg-notice"><ShieldCheck size={19} /><div><strong>Signature profile management</strong><p>These are demo profile settings. Connect an approved signing provider and authentication workflow before using electronic signatures for clinical reports.</p></div></div>

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
              <div className="usg-signature-meta"><span>Registration: {item.registration}</span><span>{item.email || "No email added"}</span></div>
            </div>
            <div className="usg-signature-actions">
              {!item.default && item.active && <button className="usg-btn usg-btn-light" onClick={() => setDefault(item.id)}><Star size={14} /> Set default</button>}
              <button className="usg-icon-btn" title="Edit profile" onClick={() => openEdit(item)}><Pencil size={15} /></button>
              <button className="usg-icon-btn" title={item.active ? "Deactivate profile" : "Activate profile"} onClick={() => toggleActive(item.id)}>{item.active ? <ShieldCheck size={15} /> : <Check size={15} />}</button>
              <button className="usg-icon-btn usg-danger-icon" title="Delete profile" onClick={() => deleteSignature(item.id)}><Trash2 size={15} /></button>
            </div>
          </article>)}
          {!filtered.length && <div className="usg-empty"><Search size={25} /><strong>No profiles found</strong><p>Try another search or add a signature profile.</p><button className="usg-btn usg-btn-primary" onClick={openNew}><Plus size={15} /> Add signature</button></div>}
        </div>
      </section>

      {modalOpen && <div className="usg-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setModalOpen(false)}>
        <form className="usg-modal" onSubmit={saveSignature} role="dialog" aria-modal="true" aria-labelledby="signature-modal-title">
          <div className="usg-modal-head"><div><span className="usg-eyebrow">PROFILE SETTINGS</span><h2 id="signature-modal-title">{editingId !== null ? "Edit profile" : "Add signature profile"}</h2><p>Enter the radiologist's profile details.</p></div><button type="button" className="usg-icon-btn" onClick={() => setModalOpen(false)} aria-label="Close"><X size={18} /></button></div>
          <label className="usg-form-field">Full name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dr. Full Name" /></label>
          <label className="usg-form-field">Role<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option>Radiologist</option><option>Senior Radiologist</option><option>Consultant Radiologist</option><option>Reporting Physician</option></select></label>
          <label className="usg-form-field">Medical registration number<input value={form.registration} onChange={(e) => setForm({ ...form, registration: e.target.value })} placeholder="Registration number" /></label>
          <label className="usg-form-field">Email address<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="doctor@example.com" /></label>
          <label className="usg-checkbox"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked, default: e.target.checked ? form.default : false })} /> Profile is active</label>
          <label className="usg-checkbox"><input type="checkbox" checked={form.default} disabled={!form.active} onChange={(e) => setForm({ ...form, default: e.target.checked })} /> Set as default profile</label>
          {error && <p className="usg-form-error">{error}</p>}
          <div className="usg-modal-actions"><button type="button" className="usg-btn usg-btn-light" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="usg-btn usg-btn-primary"><Check size={15} /> Save profile</button></div>
        </form>
      </div>}
    </main>
  );
}

function Stat({ label, value, tone = "blue" }) {
  return <article className="usg-stat"><div className={`usg-stat-icon ${tone}`}><UserRound size={20} /></div><div><p>{label}</p><strong className="usg-stat-value-text">{value}</strong></div></article>;
}