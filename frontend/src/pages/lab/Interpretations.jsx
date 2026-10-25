import { useCallback, useEffect, useMemo, useState } from "react";
import LabTable, { Action } from "./LabTable";
import { interpretationApi } from "../../api/core/apiAuth"; // adjust the path to where apiAuth.js lives
import "./lab.css";

const EMPTY_FORM = { kind: "Test", linkId: "", name: "", text: "" };

const overlay = {
  position: "fixed", inset: 0, background: "rgba(15,23,42,.45)", display: "grid",
  placeItems: "center", padding: 16, zIndex: 50,
};
const dialog = {
  background: "var(--surface, #fff)", color: "inherit", borderRadius: 14, padding: 24,
  width: "min(640px, 100%)", maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 50px rgba(0,0,0,.25)",
};
const field = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(128,128,128,.4)", font: "inherit", boxSizing: "border-box" };

export default function Interpretations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [tab, setTab] = useState("Test");
  const [q, setQ] = useState("");

  const [modal, setModal] = useState(null); // "form" | "view" | "delete"
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [tests, setTests] = useState([]);
  const [panels, setPanels] = useState([]);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoadError("");
    try {
      setItems(await interpretationApi.list());
    } catch (err) {
      if (err.status === 401) return window.location.assign("/login");
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Optional link targets. If these routes differ the dropdowns are simply empty.
    interpretationApi.tests().then(setTests).catch(() => {});
    interpretationApi.panels().then(setPanels).catch(() => {});
  }, [load]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const testCount = items.filter((item) => item.kind === "Test").length;
  const panelCount = items.filter((item) => item.kind === "Panel").length;

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter(
      (item) =>
        item.kind === tab &&
        (!query ||
          String(item.name || "").toLowerCase().includes(query) ||
          String(item.text || "").toLowerCase().includes(query) ||
          String(item.testName || item.panelName || "").toLowerCase().includes(query))
    );
  }, [items, tab, q]);

  const close = () => { setModal(null); setSelected(null); setFormError(""); };

  function openAdd() {
    setForm({ ...EMPTY_FORM, kind: tab });
    setSelected(null);
    setFormError("");
    setModal("form");
  }

  function openEdit(row) {
    setSelected(row);
    setForm({
      kind: row.kind,
      linkId: String((row.kind === "Panel" ? row.panelId : row.testId) ?? ""),
      name: row.name || "",
      text: row.text || "",
    });
    setFormError("");
    setModal("form");
  }

  async function submit(event) {
    event.preventDefault();
    setFormError("");

    if (!form.name.trim()) return setFormError("Enter a name.");
    if (!form.text.trim()) return setFormError("Enter the interpretation text.");
    if (form.kind === "Panel" && !form.linkId) return setFormError("Choose the panel this interpretation belongs to.");

    const payload = {
      kind: form.kind,
      name: form.name.trim(),
      content: form.text.trim(),
      testId: form.kind === "Test" && form.linkId ? Number(form.linkId) : null,
      panelId: form.kind === "Panel" ? Number(form.linkId) : null,
    };

    setSaving(true);
    try {
      const saved = selected
        ? await interpretationApi.update(selected.id, payload)
        : await interpretationApi.create(payload);

      setItems((current) =>
        selected ? current.map((i) => (i.id === saved.id ? saved : i)) : [saved, ...current]
      );
      setTab(saved.kind);
      close();
      setToast(selected ? "Interpretation updated." : "Interpretation added.");
    } catch (err) {
      if (err.status === 401) return window.location.assign("/login");
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    setSaving(true);
    try {
      await interpretationApi.remove(selected.id);
      setItems((current) => current.filter((i) => i.id !== selected.id));
      close();
      setToast("Interpretation deleted.");
    } catch (err) {
      if (err.status === 401) return window.location.assign("/login");
      setToast(err.message);
      close();
    } finally {
      setSaving(false);
    }
  }

  const cols = [
    {
      key: "id",
      label: "S. NO.",
      render: (value) => <span className="int-number">{String(value ?? "—").padStart(2, "0")}</span>,
    },
    {
      key: "name",
      label: "NAME",
      render: (value, row) => (
        <div className="int-name-cell">
          <span className="int-name-icon" aria-hidden="true">{tab === "Test" ? "T" : "P"}</span>
          <span>
            <span className="int-name">{value || "Untitled"}</span>
            {(row.testName || row.panelName) && (
              <small style={{ display: "block", opacity: 0.65 }}>{row.testName || row.panelName}</small>
            )}
          </span>
        </div>
      ),
    },
    {
      key: "text",
      label: "INTERPRETATION",
      render: (value) => (
        <span className="lab-strong int-description">
          {value ? (value.length > 140 ? `${value.slice(0, 140)}…` : value) : "No interpretation available"}
        </span>
      ),
    },
    {
      key: "action",
      label: "ACTIONS",
      render: (_, row) => (
        <div className="int-actions">
          <button type="button" className="int-view-button" onClick={() => { setSelected(row); setModal("view"); }}>
            View all
          </button>
          <span className="int-action-divider" />
          <Action onClick={() => openEdit(row)}>Edit</Action>
          <span className="int-action-divider" />
          <Action onClick={() => { setSelected(row); setModal("delete"); }}>Delete</Action>
        </div>
      ),
    },
  ];

  const linkOptions = form.kind === "Panel" ? panels : tests;

  return (
    <main className="lab-page int-page">
      <header className="int-header">
        <div>
          <div className="int-breadcrumb">
            <span>Laboratory</span>
            <span>/</span>
            <span>Test configuration</span>
          </div>
          <h1>Interpretations</h1>
          <p className="int-subtitle">Manage interpretation text for tests and panels.</p>
        </div>

        <button type="button" className="lab-btn primary int-add-button" onClick={openAdd}>
          <span aria-hidden="true">＋</span>
          Add new
        </button>
      </header>

      <section className="int-summary">
        <div className="int-summary-item">
          <span className="int-summary-icon int-icon-blue">T</span>
          <div>
            <span className="int-summary-label">Test interpretations</span>
            <strong className="int-summary-value">{testCount}</strong>
            <span className="int-summary-note">Interpretations linked to tests</span>
          </div>
        </div>
        <div className="int-summary-divider" />
        <div className="int-summary-item">
          <span className="int-summary-icon int-icon-purple">P</span>
          <div>
            <span className="int-summary-label">Panel interpretations</span>
            <strong className="int-summary-value">{panelCount}</strong>
            <span className="int-summary-note">Interpretations linked to panels</span>
          </div>
        </div>
      </section>

      <div className="int-notice" role="note">
        <span className="int-notice-icon" aria-hidden="true">i</span>
        <div className="int-notice-copy">
          <strong>Keep interpretations up to date</strong>
          <span>You can copy interpretations from the Library to update your existing content.</span>
        </div>
        <span className="int-new-badge">NEW</span>
      </div>

      <section className="int-directory">
        <div className="int-directory-header">
          <div>
            <h2>Interpretation library</h2>
            <p>Browse and manage interpretation records.</p>
          </div>
        </div>

        <div className="int-toolbar">
          <div className="int-tabs" role="tablist" aria-label="Interpretation type">
            {[["Test", "Tests", testCount], ["Panel", "Panels", panelCount]].map(([key, label, count]) => (
              <button key={key} type="button" role="tab" aria-selected={tab === key}
                className={`int-tab ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>
                {label}
                <span className="int-count-pill">{count}</span>
              </button>
            ))}
          </div>

          <div className="int-search">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.2 4.2" />
            </svg>
            <input type="search" placeholder="Search interpretations" aria-label="Search interpretations"
              value={q} onChange={(event) => setQ(event.target.value)} />
            {q && (
              <button type="button" className="int-clear-search" aria-label="Clear search" onClick={() => setQ("")}>×</button>
            )}
          </div>
        </div>

        <div className="int-table-meta">
          <span className="int-status-dot" />
          {loading ? "Loading…" : `Showing ${rows.length} ${rows.length === 1 ? "record" : "records"}${q.trim() ? " matching your search" : ""}`}
        </div>

        <div className="int-table-wrap">
          {loadError ? (
            <div className="int-empty" role="alert">
              <h3>Could not load interpretations</h3>
              <p>{loadError}</p>
              <button type="button" className="int-clear-button" onClick={load}>Try again</button>
            </div>
          ) : rows.length > 0 ? (
            <LabTable columns={cols} rows={rows} />
          ) : !loading ? (
            <div className="int-empty">
              <span className="int-empty-icon" aria-hidden="true">⌕</span>
              <h3>No interpretations found</h3>
              <p>
                {q.trim()
                  ? "Try another search term or clear your search."
                  : `There are no ${tab.toLowerCase()} interpretations yet. Use Add new to create one.`}
              </p>
              {q.trim() && (
                <button type="button" className="int-clear-button" onClick={() => setQ("")}>Clear search</button>
              )}
            </div>
          ) : null}
        </div>

        <footer className="int-footer">
          <span>
            Viewing <strong>{rows.length}</strong> of <strong>{tab === "Test" ? testCount : panelCount}</strong>{" "}
            {tab.toLowerCase()} interpretations
          </span>
          {q.trim() && (
            <button type="button" className="int-clear-button" onClick={() => setQ("")}>Clear filter</button>
          )}
        </footer>
      </section>

      {modal === "form" && (
        <div style={overlay} onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <section style={dialog} role="dialog" aria-modal="true" aria-labelledby="int-form-title">
            <h2 id="int-form-title" style={{ marginTop: 0 }}>{selected ? "Edit interpretation" : "Add interpretation"}</h2>
            <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
              <label>
                Type
                <select style={field} value={form.kind} disabled={!!selected}
                  onChange={(e) => setForm({ ...form, kind: e.target.value, linkId: "" })}>
                  <option value="Test">Test</option>
                  <option value="Panel">Panel</option>
                </select>
              </label>

              <label>
                {form.kind === "Panel" ? "Panel" : "Linked test (optional)"}
                <select style={field} value={form.linkId} required={form.kind === "Panel"}
                  onChange={(e) => setForm({ ...form, linkId: e.target.value })}>
                  <option value="">{form.kind === "Panel" ? "Choose a panel" : "Not linked to a test"}</option>
                  {linkOptions.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </label>

              <label>
                Name
                <input style={field} value={form.name} maxLength={255} autoFocus required
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>

              <label>
                Interpretation
                <textarea style={{ ...field, minHeight: 180, resize: "vertical" }} value={form.text} required
                  onChange={(e) => setForm({ ...form, text: e.target.value })} />
              </label>

              {formError && <p role="alert" style={{ color: "#b42318", margin: 0 }}>{formError}</p>}

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="button" className="lab-btn" onClick={close}>Cancel</button>
                <button type="submit" className="lab-btn primary" disabled={saving}>
                  {saving ? "Saving…" : selected ? "Save changes" : "Add interpretation"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {modal === "view" && selected && (
        <div style={overlay} onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <section style={dialog} role="dialog" aria-modal="true" aria-labelledby="int-view-title">
            <h2 id="int-view-title" style={{ marginTop: 0 }}>{selected.name}</h2>
            {(selected.testName || selected.panelName) && (
              <p style={{ opacity: 0.7 }}>{selected.kind}: {selected.testName || selected.panelName}</p>
            )}
            <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{selected.text || "No interpretation available"}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button" className="lab-btn" onClick={() => openEdit(selected)}>Edit</button>
              <button type="button" className="lab-btn primary" onClick={close}>Close</button>
            </div>
          </section>
        </div>
      )}

      {modal === "delete" && selected && (
        <div style={overlay} onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <section style={dialog} role="alertdialog" aria-modal="true" aria-labelledby="int-del-title">
            <h2 id="int-del-title" style={{ marginTop: 0 }}>Delete interpretation?</h2>
            <p>Delete <strong>{selected.name}</strong>? This cannot be undone.</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button" className="lab-btn" onClick={close}>Cancel</button>
              <button type="button" className="lab-btn primary" disabled={saving} onClick={confirmDelete}>
                {saving ? "Deleting…" : "Delete"}
              </button>
            </div>
          </section>
        </div>
      )}

      {toast && (
        <div role="status" style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#0f172a", color: "#fff", padding: "12px 18px", borderRadius: 10, zIndex: 60 }}>
          {toast}
        </div>
      )}
    </main>
  );
}