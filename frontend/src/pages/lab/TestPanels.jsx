
import { useMemo, useState } from "react";
import LabTable from "./LabTable";
import { panels } from "./mockData";
import "./lab.css";

const getId = (item) => item?.id ?? item?._id ?? "";

const getTests = (panel) => {
  const value = panel?.tests ?? panel?.includedTests ?? [];

  if (Array.isArray(value)) {
    return value
      .map((test) =>
        typeof test === "string"
          ? test
          : test?.name ?? test?.testName ?? test?.title ?? ""
      )
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(",").map((test) => test.trim()).filter(Boolean);
  }

  return [];
};

const ratelistFallbacks = {
  "Complete Blood Count (CBC)": [
    "CB with GBP",
    "Complete Blood Count (CBC)",
  ],
  "CBC (with absolute counts)": [
    "Antenatal Package",
    "Cardiac package",
    "CBC (with absolute counts)",
    "Dialysis package",
    "Fitness Package",
    "Full body checkup (Female)",
    "Full body checkup (Male)",
    "Preoperative",
    "Thyroid package",
  ],
  "CBC with ESR": [
    "Anemia package",
    "Arthritis Package",
    "CBC with ESR",
    "Fever package",
  ],
  "BT & CT": ["BT & CT"],
  "Coagulation Profile": ["Coagulation Profile"],
  "Blood Sugar Fasting & PP": [
    "Blood Sugar Fasting & PP",
    "Diabetic package",
  ],
};

const getRatelistEntries = (panel) => {
  const value =
    panel?.ratelistEntries ??
    panel?.ratelist_entries ??
    panel?.ratelist ??
    panel?.entries ??
    panel?.packages;

  let entries = [];

  if (Array.isArray(value)) {
    entries = value
      .map((entry) =>
        typeof entry === "string"
          ? entry
          : entry?.name ?? entry?.title ?? ""
      )
      .filter(Boolean);
  } else if (typeof value === "string") {
    entries = value.split(",").map((entry) => entry.trim()).filter(Boolean);
  }

  if (entries.length) return entries;

  return ratelistFallbacks[panel?.name] ?? (panel?.name ? [panel.name] : []);
};

const getFee = (panel, entry) => {
  const originalEntries =
    panel?.ratelistEntries ??
    panel?.ratelist_entries ??
    panel?.ratelist ??
    panel?.entries ??
    panel?.packages ??
    [];

  if (!Array.isArray(originalEntries)) return null;

  const original = originalEntries.find((item) =>
    typeof item === "string"
      ? item === entry
      : (item?.name ?? item?.title) === entry
  );

  const fee = original?.fee ?? original?.price;
  return fee != null && fee !== "" && Number.isFinite(Number(fee))
    ? Number(fee)
    : null;
};

const getNotes = (panel) =>
  panel?.interpretation ?? panel?.notes ?? panel?.clinicalNotes ?? "";

export default function TestPanels() {
  const [rows, setRows] = useState(panels);
  const [helpOpen, setHelpOpen] = useState(false);
  const [editingPanel, setEditingPanel] = useState(null);
  const [form, setForm] = useState(null);
  const [newTest, setNewTest] = useState("");
  const [error, setError] = useState("");
  const [viewingPanel, setViewingPanel] = useState(null);
  const [viewHelpOpen, setViewHelpOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(
    () => [...new Set(rows.map((panel) => panel.category).filter(Boolean))],
    [rows]
  );

  const displayRows = useMemo(
    () =>
      rows.map((panel, index) => ({
        ...panel,
        order: index + 1,
        tests: getTests(panel),
        ratelistEntries: getRatelistEntries(panel),
      })),
    [rows]
  );

  const stats = useMemo(
    () => [
      {
        label: "Total Panels",
        value: rows.length,
        icon: "▤",
        color: "blue",
      },
      {
        label: "Total Tests",
        value: rows.reduce(
          (total, panel) => total + getTests(panel).length,
          0
        ),
        icon: "⊕",
        color: "green",
      },
      {
        label: "Categories",
        value: categories.length,
        icon: "◈",
        color: "purple",
      },
    ],
    [rows, categories]
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return displayRows.filter((panel) => {
      const matchesSearch = [
        panel.name,
        panel.category,
        ...panel.tests,
        ...panel.ratelistEntries,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );

      const matchesCategory =
        selectedCategory === "All" ||
        panel.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [displayRows, search, selectedCategory]);

  const openView = (panel) => {
    setViewingPanel(panel);
    setViewHelpOpen(false);
  };

  const closeView = () => {
    setViewingPanel(null);
    setViewHelpOpen(false);
  };

  const openEdit = (panel) => {
    setEditingPanel(panel);
    setForm({
      name: panel.name || "",
      category: panel.category || "",
      tests: getTests(panel),
      interpretation: getNotes(panel),
      hideInterpretation: Boolean(
        panel.hideInterpretation ?? panel.hideIndividualInterpretation
      ),
      hideMethod: Boolean(
        panel.hideMethod ?? panel.hideIndividualMethod
      ),
    });
    setNewTest("");
    setError("");
  };

  const closeModal = () => {
    setEditingPanel(null);
    setForm(null);
    setNewTest("");
    setError("");
  };

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const addTest = () => {
    const name = newTest.trim();

    if (!name || !form) return;

    if (
      form.tests.some(
        (test) => test.toLowerCase() === name.toLowerCase()
      )
    ) {
      setError("This test has already been added.");
      return;
    }

    updateForm("tests", [...form.tests, name]);
    setNewTest("");
  };

  const savePanel = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter the panel name.");
      return;
    }

    if (!form.category.trim()) {
      setError("Please select or enter a category.");
      return;
    }

    const updatedPanel = {
      ...editingPanel,
      name: form.name.trim(),
      category: form.category.trim(),
      tests: form.tests,
      interpretation: form.interpretation,
      hideInterpretation: form.hideInterpretation,
      hideMethod: form.hideMethod,
    };

    const isNew = String(getId(editingPanel)).startsWith("new-");

    setRows((current) =>
      isNew
        ? [...current, updatedPanel]
        : current.map((panel) =>
            String(getId(panel)) === String(getId(editingPanel))
              ? updatedPanel
              : panel
          )
    );

    closeModal();
  };

  const movePanel = (panel, direction) => {
    setRows((current) => {
      const index = current.findIndex(
        (item) => String(getId(item)) === String(getId(panel))
      );

      const target = index + direction;

      if (index < 0 || target < 0 || target >= current.length) {
        return current;
      }

      const updated = [...current];
      [updated[index], updated[target]] = [
        updated[target],
        updated[index],
      ];

      return updated;
    });
  };

  const columns = [
    {
      key: "order",
      label: "ORDER",
      render: (value, row) => (
        <div className="tp-order">
          <span className="tp-order-arrows">
            <button
              type="button"
              disabled={value <= 1}
              onClick={() => movePanel(row, -1)}
              aria-label={`Move ${row.name} up`}
              title="Move up"
            >
              ⌃
            </button>
            <button
              type="button"
              disabled={value >= rows.length}
              onClick={() => movePanel(row, 1)}
              aria-label={`Move ${row.name} down`}
              title="Move down"
            >
              ⌄
            </button>
          </span>
          <span>{value}.</span>
        </div>
      ),
    },
    {
      key: "name",
      label: "NAME",
      render: (value) => (
        <span className="tp-panel-name">{value}</span>
      ),
    },
    {
      key: "category",
      label: "CATEGORY",
      render: (value) => (
        <span className="tp-category-badge">{value || "Uncategorized"}</span>
      ),
    },
    {
      key: "tests",
      label: "TESTS",
      render: (value) => {
        const tests = Array.isArray(value) ? value : [];

        return (
          <div className="tp-table-tests">
            <div className="tp-test-preview">
              {tests.length ? tests.slice(0, 3).join(", ") : "No tests"}
              {tests.length > 3 ? "..." : ""}
            </div>

            {tests.length > 0 && (
              <div className="tp-test-tooltip-wrap">
                <button
                  type="button"
                  className="tp-test-count"
                  aria-label={`Show all ${tests.length} tests`}
                >
                  {tests.length} tests <span>⌄</span>
                </button>

                <div className="tp-test-tooltip" role="tooltip">
                  <strong>Included tests</strong>
                  <span>{tests.join(", ")}</span>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "ratelistEntries",
      label: "RATELIST ENTRIES",
      render: (value) => {
        const entries = Array.isArray(value) ? value : [];

        return (
          <div
            className="tp-ratelist"
            title={entries.join(", ")}
          >
            {entries.length ? entries.join(", ") : "—"}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (_, row) => (
        <div className="tp-row-actions">
          <button
            type="button"
            className="tp-edit-button"
            onClick={() => openEdit(row)}
          >
            <span aria-hidden="true">✎</span> Edit
          </button>

          <button
            type="button"
            className="tp-view-button"
            onClick={() => openView(row)}
          >
            <span aria-hidden="true">⊙</span> View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="lab-page tp-page">
      {/* Page heading */}
      <div className="tp-page-heading">
        <div>
          <div className="tp-eyebrow">
            LABORATORY MANAGEMENT
          </div>

          <h1>
            Test <span>Panels</span>
          </h1>

          <p className="tp-subtitle">
            Manage diagnostic panels, included tests, and ratelist entries.
          </p>
        </div>

        <button
          type="button"
          className="lab-btn primary tp-add-button"
          onClick={() =>
            openEdit({
              id: `new-${Date.now()}`,
              name: "",
              category: categories[0] || "",
              tests: [],
              ratelistEntries: [],
            })
          }
        >
          <span className="tp-plus">＋</span>
          Add New Panel
        </button>
      </div>

      {/* Dashboard statistics */}
      <div className="tp-stats-grid">
        {stats.map((stat) => (
          <div className="tp-stat-card" key={stat.label}>
            <div className={`tp-stat-icon tp-stat-${stat.color}`}>
              {stat.icon}
            </div>

            <div>
              <p>{stat.label}</p>
              <h2>{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Search and filters */}
      <div className="tp-toolbar">
        <div className="tp-search">
          <span aria-hidden="true">⌕</span>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search panels, tests, or ratelist entries..."
            aria-label="Search test panels"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <select
          className="tp-category-filter"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          aria-label="Filter by category"
        >
          <option value="All">All Categories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Reordering help */}
      <button
        type="button"
        className="tp-help-bar"
        onClick={() => setHelpOpen((open) => !open)}
        aria-expanded={helpOpen}
      >
        <span className="tp-help-left">
          <span className="tp-help-icon">ⓘ</span>
          How to reorder panels?
        </span>

        <span
          className={`tp-chevron ${
            helpOpen ? "tp-chevron-open" : ""
          }`}
        >
          ⌄
        </span>
      </button>

      {helpOpen && (
        <div className="tp-help-content">
          Use the arrows in the Order column to move panels up or down.
          The new order is reflected immediately in this table.
        </div>
      )}

      {/* Main table */}
      <div className="tp-table-wrap">
        <LabTable columns={columns} rows={filteredRows} />

        {!filteredRows.length && (
          <div className="tp-empty-state">
            <div className="tp-empty-icon">⌕</div>
            <h3>No test panels found</h3>
            <p>
              Try another search term or change the category filter.
            </p>

            <button
              type="button"
              className="tp-reset-button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* View panel modal */}
      {viewingPanel && (
        <div
          className="tp-overlay tp-view-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeView();
          }}
        >
          <div
            className="tp-modal tp-view-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tp-view-title"
          >
            <div className="tp-modal-header">
              <strong>Test panel details</strong>

              <button
                type="button"
                className="tp-close"
                onClick={closeView}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="tp-modal-body">
              <div className="tp-view-title-row">
                <h2 id="tp-view-title">{viewingPanel.name}</h2>

                <span className="tp-watch-video">
                  <span>▷</span> Panel Details
                </span>
              </div>

              <div className="tp-view-flags">
                <div>
                  <span className="tp-view-dot">●</span>
                  Individual test interpretations, notes, and comments{" "}
                  {(
                    viewingPanel.hideInterpretation ??
                    viewingPanel.hideIndividualInterpretation
                  )
                    ? "are hidden."
                    : "are not configured to be hidden."}
                </div>

                <div>
                  <span className="tp-view-dot">●</span>
                  Individual test methods and instruments{" "}
                  {(
                    viewingPanel.hideMethod ??
                    viewingPanel.hideIndividualMethod
                  )
                    ? "are hidden."
                    : "are not configured to be hidden."}
                </div>

                <div>
                  <strong>●</strong> Category:{" "}
                  {viewingPanel.category || "—"}
                </div>
              </div>

              {/* Included tests */}
              <div className="tp-view-content-grid">
                <div className="tp-view-tests-section">
                  <table className="tp-view-data-table">
                    <thead>
                      <tr>
                        <th>ORDER</th>
                        <th>LAB TESTS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {getTests(viewingPanel).map((test, index) => (
                        <tr key={`${test}-${index}`}>
                          <td>{index + 1}.</td>
                          <td>{test}</td>
                        </tr>
                      ))}

                      {!getTests(viewingPanel).length && (
                        <tr>
                          <td colSpan={2}>No tests added.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="tp-view-help-section">
                  <button
                    type="button"
                    className="tp-view-help-toggle"
                    onClick={() =>
                      setViewHelpOpen((open) => !open)
                    }
                    aria-expanded={viewHelpOpen}
                  >
                    <span>ⓘ How to reorder?</span>
                    <span>{viewHelpOpen ? "⌃" : "⌄"}</span>
                  </button>

                  {viewHelpOpen && (
                    <div className="tp-view-help-description">
                      The order of tests determines the sequence in which
                      they appear in the panel report. Edit the panel to
                      update its tests.
                    </div>
                  )}
                </div>
              </div>

              {/* Clinical notes */}
              <div className="tp-view-notes-section">
                <div className="tp-view-section-heading">
                  Clinical Notes
                </div>

                <div className="tp-view-clinical-notes">
                  <strong>Interpretation / Notes</strong>
                  <p>
                    {getNotes(viewingPanel) ||
                      "No clinical notes available for this panel."}
                  </p>
                </div>
              </div>

              {/* Ratelist */}
              <div className="tp-view-ratelist-section">
                <div className="tp-view-section-heading">
                  Available in ratelist under names
                </div>

                <table className="tp-view-data-table tp-view-ratelist-table">
                  <thead>
                    <tr>
                      <th>S. NO.</th>
                      <th>NAME</th>
                      <th>FEE</th>
                    </tr>
                  </thead>

                  <tbody>
                    {getRatelistEntries(viewingPanel).map(
                      (entry, index) => {
                        const fee = getFee(viewingPanel, entry);

                        return (
                          <tr key={`${entry}-${index}`}>
                            <td>{index + 1}.</td>
                            <td>{entry}</td>
                            <td>
                              {fee != null
                                ? `₹${fee.toLocaleString("en-IN")}`
                                : "—"}
                            </td>
                          </tr>
                        );
                      }
                    )}

                    {!getRatelistEntries(viewingPanel).length && (
                      <tr>
                        <td colSpan={3}>
                          No ratelist entries available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="tp-modal-footer">
              <button
                type="button"
                className="tp-cancel"
                onClick={closeView}
              >
                Close
              </button>

              <button
                type="button"
                className="tp-save"
                onClick={() => {
                  const panel = viewingPanel;
                  closeView();
                  openEdit(panel);
                }}
              >
                Edit Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit panel modal */}
      {editingPanel && form && (
        <div
          className="tp-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <form
            className="tp-modal"
            onSubmit={savePanel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tp-edit-title"
          >
            <div className="tp-modal-header">
              <strong id="tp-edit-title">
                {String(getId(editingPanel)).startsWith("new-")
                  ? "Add Test Panel"
                  : "Edit Test Panel"}
              </strong>

              <button
                type="button"
                className="tp-close"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="tp-modal-body">
              <div className="tp-field">
                <label htmlFor="tp-panel-name">Panel Name</label>

                <input
                  id="tp-panel-name"
                  value={form.name}
                  onChange={(event) =>
                    updateForm("name", event.target.value)
                  }
                  placeholder="Enter panel name"
                  required
                />
              </div>

              <div className="tp-field">
                <label htmlFor="tp-panel-category">Category</label>

                <select
                  id="tp-panel-category"
                  value={form.category}
                  onChange={(event) =>
                    updateForm("category", event.target.value)
                  }
                  required
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}

                  {form.category &&
                    !categories.includes(form.category) && (
                      <option value={form.category}>
                        {form.category}
                      </option>
                    )}
                </select>
              </div>

              <label className="tp-checkbox">
                <input
                  type="checkbox"
                  checked={form.hideInterpretation}
                  onChange={(event) =>
                    updateForm(
                      "hideInterpretation",
                      event.target.checked
                    )
                  }
                />
                <span>
                  Hide individual test interpretations, notes, and
                  comments from the report.
                </span>
              </label>

              <label className="tp-checkbox">
                <input
                  type="checkbox"
                  checked={form.hideMethod}
                  onChange={(event) =>
                    updateForm("hideMethod", event.target.checked)
                  }
                />
                <span>
                  Hide individual test methods and instruments from
                  the report.
                </span>
              </label>

              {/* Test chips */}
              <div className="tp-field">
                <label>Included Tests</label>

                <div className="tp-test-box">
                  <div className="tp-test-chips">
                    {form.tests.map((test, index) => (
                      <span
                        className="tp-chip"
                        key={`${test}-${index}`}
                      >
                        {test}

                        <button
                          type="button"
                          onClick={() =>
                            updateForm(
                              "tests",
                              form.tests.filter(
                                (_, testIndex) => testIndex !== index
                              )
                            )
                          }
                          aria-label={`Remove ${test}`}
                          title={`Remove ${test}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {!form.tests.length && (
                      <span className="tp-empty">
                        No tests added yet
                      </span>
                    )}
                  </div>

                  <div className="tp-add-test">
                    <input
                      value={newTest}
                      onChange={(event) =>
                        setNewTest(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addTest();
                        }
                      }}
                      placeholder="Enter a test name"
                      aria-label="New test name"
                    />

                    <button type="button" onClick={addTest}>
                      + Add Test
                    </button>
                  </div>
                </div>

                <small>
                  Add individual tests to include in this panel.
                </small>
              </div>

              <div className="tp-library-note">
                ✦ Update the clinical interpretation and notes below.
              </div>

              <div className="tp-field">
                <label htmlFor="tp-interpretation">
                  Interpretation / Clinical Notes
                </label>

                <textarea
                  id="tp-interpretation"
                  className="tp-interpretation"
                  value={form.interpretation}
                  onChange={(event) =>
                    updateForm("interpretation", event.target.value)
                  }
                  placeholder="Enter clinical notes and interpretation..."
                  rows={5}
                />
              </div>

              {error && (
                <div className="tp-error" role="alert">
                  {error}
                </div>
              )}
            </div>

            <div className="tp-modal-footer">
              <button className="tp-save" type="submit">
                Save Panel
              </button>

              <button
                className="tp-cancel"
                type="button"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
