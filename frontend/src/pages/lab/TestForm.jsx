import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import testCategoryApiService from "../../api/services/testCategoryApiService";
import unitApiService from "../../api/services/unitApiService";
import inputTypeApiService from "../../api/services/inputTypeApiService";
import testApiService from "../../api/services/testApiService";
import labLogo from "../../assets/logo2.png";
import "./Testform.css";
import "./Testform-view.css";

const unwrap = (r) =>
  Array.isArray(r) ? r : r?.data || r?.items || r?.rows || [];

const emptyParam = (order = 1) => ({
  order,
  name: "",
  unitId: "",
  inputType: "single_line",
  groupBy: "",
  defaultResult: "",
  optional: false,
  parentIndex: null,
});

export default function TestForm() {
  const { type, id } = useParams();
  const nav = useNavigate();
  const location = useLocation();

  const viewing = location.pathname.includes("/view/");
  const editing = Boolean(id) && !viewing;

  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [inputTypes, setInputTypes] = useState([]);

  const [unitModal, setUnitModal] = useState(false);
  const [unitName, setUnitName] = useState("");
  const [unitError, setUnitError] = useState("");
  const [savingUnit, setSavingUnit] = useState(false);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingTest, setLoadingTest] = useState(Boolean(id));

  const [f, setF] = useState({
    type: type || "single",
    name: "",
    shortName: "",
    categoryId: "",
    price: "",
    unitId: "",
    inputType: "single_line",
    defaultResult: "",
    optional: false,
    displayName: true,
    method: "",
    instrument: "",
    interpretation: "",
    parameters: [emptyParam(1), emptyParam(2)],
  });

  // Load categories, units and input types.
  useEffect(() => {
    let active = true;

    Promise.all([
      testCategoryApiService.list(),
      unitApiService.list(),
      inputTypeApiService.list(),
    ])
      .then(([c, u, i]) => {
        if (!active) return;
        setCategories(unwrap(c));
        setUnits(unwrap(u));
        setInputTypes(unwrap(i));
      })
      .catch((e) => {
        if (active) setError(e?.message || "Unable to load form options.");
      });

    return () => {
      active = false;
    };
  }, []);

  // Load the selected test for both Edit and View.
  useEffect(() => {
    let active = true;

    if (!id) {
      setLoadingTest(false);
      return () => {
        active = false;
      };
    }

    setLoadingTest(true);
    setError("");

    testApiService
      .getById(id)
      .then((r) => {
        if (!active) return;
        const x = r?.data || r;

        setF((prev) => ({
          ...prev,
          ...x,
          type: x.type || type || prev.type,
          parameters:
            Array.isArray(x.parameters) && x.parameters.length
              ? x.parameters
              : prev.parameters,
        }));
      })
      .catch((e) => {
        if (active) setError(e?.message || "Unable to load test details.");
      })
      .finally(() => {
        if (active) setLoadingTest(false);
      });

    return () => {
      active = false;
    };
  }, [id, type]);

  const set = (key, value) => {
    if (viewing) return;
    setF((prev) => ({ ...prev, [key]: value }));
  };

  const setP = (idx, key, value) => {
    if (viewing) return;
    setF((prev) => ({
      ...prev,
      parameters: prev.parameters.map((p, i) =>
        i === idx ? { ...p, [key]: value } : p
      ),
    }));
  };

  async function addUnit(e) {
    e.preventDefault();
    if (viewing) return;

    if (!unitName.trim()) {
      setUnitError("Please enter the unit name.");
      return;
    }

    setSavingUnit(true);
    try {
      await unitApiService.create({ name: unitName.trim() });
      const r = await unitApiService.list();
      setUnits(unwrap(r));
      setUnitName("");
      setUnitError("");
      setUnitModal(false);
    } catch (e) {
      setUnitError(e?.message || "Unable to create unit.");
    } finally {
      setSavingUnit(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (viewing || saving) return;

    if (!f.name.trim()) {
      setError("Please enter the test name.");
      return;
    }

    if (!f.categoryId) {
      setError("Please select a category.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        ...f,
        price: Number(f.price || 0),
        categoryId: Number(f.categoryId),
        unitId: f.unitId ? Number(f.unitId) : null,
        parameters: ["multi", "nested"].includes(f.type)
          ? f.parameters.map((p, i) => ({
              ...p,
              order: Number(p.order || i + 1),
              unitId: p.unitId ? Number(p.unitId) : null,
            }))
          : [],
      };

      if (editing) {
        await testApiService.update(id, payload);
      } else {
        await testApiService.create(payload);
      }

      nav("/lab/tests");
    } catch (e) {
      setError(e?.message || "Unable to save test.");
    } finally {
      setSaving(false);
    }
  }

  const unitSelect = (value, onChange) => (
    <div className="td-unit">
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select unit</option>
        {units.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
      <button type="button" onClick={() => setUnitModal(true)}>
        ＋ Add new
      </button>
    </div>
  );

  const inputSelect = (value, onChange) => (
    <select value={value || ""} onChange={(e) => onChange(e.target.value)}>
      {inputTypes.map((x) => (
        <option key={x.value} value={x.value}>
          {x.label}
        </option>
      ))}
    </select>
  );

  const testTypeLabel =
    f.type === "single"
      ? "single parameter"
      : f.type === "multi"
        ? "multi parameter"
        : f.type === "nested"
          ? "multi parameter nested"
          : "document";

  const pageTitle = editing
    ? "Edit test"
    : `New test (${testTypeLabel})`;

  if (loadingTest) {
    return (
      <div className="td-page">
        <div className="td-loading">
          <span className="td-spinner" />
          <span>Loading test details...</span>
        </div>
      </div>
    );
  }

  // ---------- READ-ONLY VIEW HELPERS ----------
  const displayValue = (value) => {
    if (value === null || value === undefined || String(value).trim() === "") {
      return "Not specified";
    }
    return String(value);
  };

  const categoryName =
    categories.find((c) => String(c.id) === String(f.categoryId))?.name ||
    "Not specified";

  const unitNameFor = (unitId) =>
    units.find((u) => String(u.id) === String(unitId))?.name ||
    "No unit selected";

  const inputTypeName = (value) =>
    inputTypes.find((item) => item.value === value)?.label ||
    displayValue(value);

  const typeName = {
    single: "Single parameter",
    multi: "Multiple parameters",
    nested: "Nested parameters",
    document: "Document",
  }[f.type] || "Test";

  if (viewing) {
    const detail = (label, value) => (
      <div className="td-view-field" key={label}>
        <span className="td-view-label">{label}</span>
        <div className="td-view-value">{displayValue(value)}</div>
      </div>
    );

    const resultBlock = (label, value) => (
      <div className="td-view-result" key={label}>
        <span className="td-view-label">{label}</span>
        <div className="td-view-result-content">{displayValue(value)}</div>
      </div>
    );

    return (
      <div className="td-page td-view-mode">
        <div className="td-view-brandbar">
          <div className="td-view-brand">
            <img src={labLogo} alt="LabLIMS logo" />
            <div className="td-view-brand-copy">
              <strong>LabLIMS</strong>
              <span>Laboratory Information Management System</span>
            </div>
          </div>
          <div className="td-view-record-mark">
            <span className="td-view-record-mark-dot" />
            Test record
          </div>
        </div>

        <div className="td-crumb">
          <span>Test database</span><span className="td-view-crumb-separator">/</span><strong>View test details</strong>
        </div>

        {error && <div className="td-error" role="alert">{error}</div>}

        <header className="td-view-header">
          <div className="td-view-heading-main">
            <div className="td-view-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="26"
                height="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 18.5z" />
                <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
                <path d="M8 7h8M8 11h6" />
              </svg>
            </div>
            <div>
              <h1>{displayValue(f.name)}</h1>
              <p>Complete configuration details for review. Editing is disabled in this view.</p>
            </div>
          </div>

          <div className="td-view-header-right">
            <span className="td-view-badge">
              <span className="td-view-status-dot" />
              Read-only
            </span>
            <span className="td-view-type-badge">{typeName}</span>
          </div>
        </header>
        <section className="td-view-card">
          <div className="td-view-card-heading">
            <div className="td-view-section-icon">01</div>
            <div>
              <h2>Basic information</h2>
              <p>Identity and classification of this test.</p>
            </div>
          </div>
          <div className="td-view-grid">
            {detail("Test name", f.name)}
            {detail("Short name", f.shortName)}
            {detail("Category", categoryName)}
            {detail("Test type", typeName)}
            {detail(
              "Price",
              f.price === "" || f.price == null
                ? "Not specified"
                : `₹${Number(f.price).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
            )}
          </div>
        </section>

        {f.type === "single" && (
          <section className="td-view-card">
            <div className="td-view-card-heading">
              <div className="td-view-section-icon">02</div>
              <div>
                <h2>Result configuration</h2>
                <p>Measurement and result input settings.</p>
              </div>
            </div>
            <div className="td-view-grid">
              {detail("Unit", unitNameFor(f.unitId))}
              {detail("Input type", inputTypeName(f.inputType))}
              {detail("Optional parameter", f.optional ? "Yes" : "No")}
            </div>
            {resultBlock("Default result", f.defaultResult)}
          </section>
        )}

        {["multi", "nested"].includes(f.type) && (
          <section className="td-view-card">
            <div className="td-view-card-heading">
              <div className="td-view-section-icon">02</div>
              <div>
                <h2>Test parameters</h2>
                <p>
                  {(f.parameters || []).length} parameter
                  {(f.parameters || []).length === 1 ? "" : "s"} configured
                  for this test.
                </p>
              </div>
              <span className="td-view-count">
                {(f.parameters || []).length} total
              </span>
            </div>

            {(f.parameters || []).length > 0 ? (
              <div className="td-view-parameters">
                {f.parameters.map((p, idx) => (
                  <article className="td-view-parameter" key={idx}>
                    <div className="td-view-parameter-heading">
                      <div className="td-view-parameter-number">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="td-view-parameter-title">
                        <h3>{displayValue(p.name)}</h3>
                        <span>Parameter order: {displayValue(p.order)}</span>
                      </div>
                      <span
                        className={`td-view-optional ${
                          p.optional ? "is-optional" : ""
                        }`}
                      >
                        {p.optional ? "Optional" : "Required"}
                      </span>
                    </div>
                    <div className="td-view-grid">
                      {detail("Unit", unitNameFor(p.unitId))}
                      {detail("Input type", inputTypeName(p.inputType))}
                      {f.type === "nested" && detail("Group by", p.groupBy)}
                    </div>
                    {resultBlock("Default result", p.defaultResult)}
                  </article>
                ))}
              </div>
            ) : (
              <div className="td-view-empty">
                No parameters have been configured for this test.
              </div>
            )}
          </section>
        )}

        {f.type === "document" && (
          <section className="td-view-card">
            <div className="td-view-card-heading">
              <div className="td-view-section-icon">02</div>
              <div>
                <h2>Document configuration</h2>
                <p>Report display preferences and default content.</p>
              </div>
            </div>
            <div className="td-view-grid">
              {detail(
                "Display test name in report",
                f.displayName ? "Yes" : "No"
              )}
            </div>
            {resultBlock("Default result", f.defaultResult)}
          </section>
        )}

        {f.type !== "document" && (
          <section className="td-view-card">
            <div className="td-view-card-heading">
              <div className="td-view-section-icon">03</div>
              <div>
                <h2>Additional details</h2>
                <p>Methodology, instruments, and interpretation.</p>
              </div>
            </div>
            <div className="td-view-grid">
              {detail("Method", f.method)}
              {detail("Instrument", f.instrument)}
            </div>
            {resultBlock("Interpretation", f.interpretation)}
          </section>
        )}

        <footer className="td-view-footer">
          <button
            type="button"
            className="td-view-back"
            onClick={() => nav("/lab/tests")}
          >
            <span aria-hidden="true">←</span> Back to tests
          </button>
        </footer>
      </div>
    );
  }

  // ---------- EXISTING NEW / EDIT FORM ----------
  return (
    <div className="td-page">
      <div className="td-crumb">
        Test database › {editing ? "Edit test" : "New test"}
      </div>

      <div className="td-form-page-heading">
        <div>
          <h1>{pageTitle}</h1>
          <p className="td-note">
            ⓘ Ratelist entry will be created for this test automatically.
          </p>
        </div>
      </div>

      <h3>Test details</h3>

      {error && <div className="td-error" role="alert">{error}</div>}

      <form onSubmit={submit} className="td-form">
        <div className="td-grid">
          <label>
            Name
            <input
              value={f.name ?? ""}
              onChange={(e) => set("name", e.target.value)}
            />
          </label>

          <label>
            Short name
            <input
              value={f.shortName ?? ""}
              onChange={(e) => set("shortName", e.target.value)}
            />
          </label>

          <label>
            Category
            <select
              value={f.categoryId ?? ""}
              onChange={(e) => set("categoryId", e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          {f.type === "nested" && (
            <label>
              Template
              <select disabled>
                <option>default</option>
              </select>
            </label>
          )}

          <label>
            Price
            <input
              type="number"
              min="0"
              step="0.01"
              value={f.price ?? ""}
              onChange={(e) => set("price", e.target.value)}
            />
          </label>
        </div>

        {f.type === "single" && (
          <>
            <div className="td-grid td-gap">
              <label>
                Unit
                {unitSelect(f.unitId, (v) => set("unitId", v))}
              </label>
              <label>
                Input type
                {inputSelect(f.inputType, (v) => set("inputType", v))}
              </label>
            </div>

            <label className="td-wide">
              Default result
              <textarea
                value={f.defaultResult ?? ""}
                onChange={(e) => set("defaultResult", e.target.value)}
              />
            </label>

            <label className="td-check">
              <input
                type="checkbox"
                checked={Boolean(f.optional)}
                onChange={(e) => set("optional", e.target.checked)}
              />{" "}
              Optional
            </label>
          </>
        )}

        {["multi", "nested"].includes(f.type) && (
          <section className="td-parameters">
            <h3>Parameters</h3>
            {f.parameters.map((p, idx) => (
              <div className="td-param" key={idx}>
                <button
                  type="button"
                  className="td-remove"
                  onClick={() =>
                    setF((prev) => ({
                      ...prev,
                      parameters: prev.parameters.filter((_, i) => i !== idx),
                    }))
                  }
                >
                  − Remove
                </button>

                <label>
                  Order
                  <input
                    type="number"
                    value={p.order ?? ""}
                    onChange={(e) => setP(idx, "order", e.target.value)}
                  />
                </label>

                <label>
                  Name
                  <input
                    value={p.name ?? ""}
                    onChange={(e) => setP(idx, "name", e.target.value)}
                  />
                </label>

                <label>
                  Unit
                  {unitSelect(p.unitId, (v) => setP(idx, "unitId", v))}
                </label>

                <label>
                  Input type
                  {inputSelect(p.inputType, (v) => setP(idx, "inputType", v))}
                </label>

                {f.type === "nested" && (
                  <label>
                    Group By
                    <input
                      value={p.groupBy ?? ""}
                      onChange={(e) => setP(idx, "groupBy", e.target.value)}
                    />
                  </label>
                )}

                <label>
                  Default result
                  <textarea
                    value={p.defaultResult ?? ""}
                    onChange={(e) => setP(idx, "defaultResult", e.target.value)}
                  />
                </label>

                <label className="td-check">
                  <input
                    type="checkbox"
                    checked={Boolean(p.optional)}
                    onChange={(e) => setP(idx, "optional", e.target.checked)}
                  />{" "}
                  Optional
                </label>
              </div>
            ))}

            <button
              type="button"
              className="td-link"
              onClick={() =>
                setF((prev) => ({
                  ...prev,
                  parameters: [
                    ...prev.parameters,
                    emptyParam(prev.parameters.length + 1),
                  ],
                }))
              }
            >
              ＋ Add more parameters
            </button>
          </section>
        )}

        {f.type === "document" && (
          <>
            <label className="td-check">
              <input
                type="checkbox"
                checked={Boolean(f.displayName)}
                onChange={(e) => set("displayName", e.target.checked)}
              />{" "}
              Display test name in report
            </label>
            <label className="td-editor">
              Default result
              <textarea
                value={f.defaultResult ?? ""}
                onChange={(e) => set("defaultResult", e.target.value)}
              />
            </label>
          </>
        )}

        {f.type !== "document" && (
          <>
            <div className="td-tabs">
              More details <span>Format options</span>
            </div>
            <div className="td-grid">
              <label>
                Method
                <input
                  value={f.method ?? ""}
                  onChange={(e) => set("method", e.target.value)}
                />
              </label>
              <label>
                Instrument
                <input
                  value={f.instrument ?? ""}
                  onChange={(e) => set("instrument", e.target.value)}
                />
              </label>
            </div>
            <label className="td-editor">
              Interpretation
              <textarea
                value={f.interpretation ?? ""}
                onChange={(e) => set("interpretation", e.target.value)}
              />
            </label>
          </>
        )}

        <div className="td-form-actions">
          <button className="td-save" type="submit" disabled={saving}>
            {saving ? "Saving..." : editing ? "Save changes" : "Save"}
          </button>
        </div>
      </form>

      {unitModal && (
        <div className="td-overlay">
          <form className="td-modal" onSubmit={addUnit}>
            <div className="td-modal-head">
              <b>Add new Unit</b>
              <button type="button" onClick={() => setUnitModal(false)}>
                ×
              </button>
            </div>

            <label>
              * Unit
              <input
                autoFocus
                value={unitName}
                onChange={(e) => {
                  setUnitName(e.target.value);
                  if (e.target.value.trim()) setUnitError("");
                }}
              />
            </label>

            {unitError && (
              <small className="td-field-error">{unitError}</small>
            )}

            <button className="td-save" disabled={savingUnit}>
              {savingUnit ? "Creating..." : "Create"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
