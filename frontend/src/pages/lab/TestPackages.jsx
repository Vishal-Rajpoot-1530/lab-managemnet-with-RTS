
import { useMemo, useState } from "react";
import { packages } from "./mockData";
import "./TestPackages.css";

const getId = (item) => item?.id ?? item?._id ?? "";

const getIncluded = (item) => {
  const value =
    item?.included ??
    item?.includedTests ??
    item?.tests ??
    item?.panels ??
    [];

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

const formatFee = (fee) => {
  const value = Number(fee);

  return Number.isFinite(value)
    ? `₹${value.toLocaleString("en-IN")}`
    : "—";
};

export default function TestPackages() {
  const [rows, setRows] = useState(packages);
  const [tab, setTab] = useState(true);
  const [q, setQ] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [helpOpen, setHelpOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState(null);
  const [newIncluded, setNewIncluded] = useState("");

  const ratelistCount = useMemo(
    () => rows.filter((item) => item.ratelist === true).length,
    [rows]
  );

  const notRatelistCount = useMemo(
    () => rows.filter((item) => item.ratelist !== true).length,
    [rows]
  );

  const totalFees = useMemo(
    () =>
      rows.reduce((sum, item) => {
        const fee = Number(item.fee);
        return sum + (Number.isFinite(fee) ? fee : 0);
      }, 0),
    [rows]
  );

  const categories = useMemo(
    () =>
      [...new Set(rows.map((item) => item.gender).filter(Boolean))],
    [rows]
  );

  const filteredRows = useMemo(() => {
    const query = q.trim().toLowerCase();

    return rows
      .filter((item) => item.ratelist === tab)
      .filter((item) => {
        if (!query) return true;

        const searchable = [
          item.name,
          item.gender,
          ...getIncluded(item),
        ];

        return searchable.some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );
      })
      .filter(
        (item) =>
          genderFilter === "All" || item.gender === genderFilter
      );
  }, [rows, tab, q, genderFilter]);

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const openAdd = () => {
    setEditingPackage({
      id: `new-${Date.now()}`,
    });

    setForm({
      name: "",
      fee: "",
      gender: "All",
      included: [],
      ratelist: tab,
    });

    setNewIncluded("");
    setError("");
  };

  const openEdit = (item) => {
    setEditingPackage(item);

    setForm({
      name: item.name ?? "",
      fee: item.fee ?? "",
      gender: item.gender ?? "All",
      included: getIncluded(item),
      ratelist: Boolean(item.ratelist),
    });

    setNewIncluded("");
    setError("");
  };

  const closeModal = () => {
    setEditingPackage(null);
    setForm(null);
    setNewIncluded("");
    setError("");
  };

  const addIncluded = () => {
    const name = newIncluded.trim();

    if (!name || !form) return;

    if (
      form.included.some(
        (item) => item.toLowerCase() === name.toLowerCase()
      )
    ) {
      setError("This test or panel is already included.");
      return;
    }

    updateForm("included", [...form.included, name]);
    setNewIncluded("");
  };

  const savePackage = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter a package name.");
      return;
    }

    if (
      form.fee === "" ||
      !Number.isFinite(Number(form.fee)) ||
      Number(form.fee) < 0
    ) {
      setError("Please enter a valid, non-negative fee.");
      return;
    }

    const isNew = String(getId(editingPackage)).startsWith("new-");

    const updated = {
      ...editingPackage,
      name: form.name.trim(),
      fee: Number(form.fee),
      gender: form.gender,
      included: form.included,
      ratelist: form.ratelist,
    };

    setRows((current) =>
      isNew
        ? [...current, { ...updated, id: updated.id ?? Date.now() }]
        : current.map((item) =>
            String(getId(item)) === String(getId(editingPackage))
              ? updated
              : item
          )
    );

    closeModal();
  };

  const deletePackage = (item) => {
    const confirmed = window.confirm(
      `Delete the package "${item.name}"?`
    );

    if (!confirmed) return;

    setRows((current) =>
      current.filter(
        (row) => String(getId(row)) !== String(getId(item))
      )
    );
  };

  const columns = [
    {
      key: "id",
      label: "S. NO.",
      render: (value, row) => (
        <span className="tp-order">
          {rows.findIndex(
            (item) => String(getId(item)) === String(getId(row))
          ) + 1}.
        </span>
      ),
    },
    {
      key: "name",
      label: "PACKAGE NAME",
      render: (value) => (
        <span className="tp-panel-name">{value}</span>
      ),
    },
    {
      key: "fee",
      label: "FEE",
      render: (value) => (
        <span className="pkg-fee">{formatFee(value)}</span>
      ),
    },
    {
      key: "gender",
      label: "FOR GENDER",
      render: (value) => (
        <span className="tp-category-badge">
          {value || "All"}
        </span>
      ),
    },
    {
      key: "included",
      label: "INCLUDED TESTS AND PANELS",
      render: (_, row) => {
        const included = getIncluded(row);

        return (
          <div className="pkg-included">
            <span>
              {included.length
                ? included.slice(0, 3).join(", ")
                : "No tests or panels added"}
              {included.length > 3 ? "..." : ""}
            </span>

            {included.length > 0 && (
              <span className="pkg-included-count">
                {included.length} items
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "action",
      label: "ACTIONS",
      render: (_, row) => (
        <div className="tp-row-actions">
          <button
            type="button"
            className="tp-edit-button"
            onClick={() => openEdit(row)}
          >
            ✎ Edit
          </button>

          <button
            type="button"
            className="pkg-delete-button"
            onClick={() => deletePackage(row)}
            aria-label={`Delete ${row.name}`}
            title="Delete package"
          >
            ×
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="lab-page tp-page pkg-page">
      {/* Heading */}
      <div className="tp-page-heading">
        <div>
          <div className="tp-eyebrow">
            LABORATORY MANAGEMENT
          </div>

          <h1>
            Test <span>Packages</span>
          </h1>

          <p className="tp-subtitle">
            Manage diagnostic packages, pricing, gender eligibility,
            and included tests.
          </p>
        </div>

        <button
          type="button"
          className="lab-btn primary tp-add-button"
          onClick={openAdd}
        >
          <span className="tp-plus">＋</span>
          Add New Package
        </button>
      </div>

      {/* Statistics */}
      <div className="tp-stats-grid">
        <div className="tp-stat-card">
          <div className="tp-stat-icon tp-stat-blue">▤</div>
          <div>
            <p>Total Packages</p>
            <h2>{rows.length}</h2>
          </div>
        </div>

        <div className="tp-stat-card">
          <div className="tp-stat-icon tp-stat-green">✓</div>
          <div>
            <p>In Ratelist</p>
            <h2>{ratelistCount}</h2>
          </div>
        </div>

        <div className="tp-stat-card">
          <div className="tp-stat-icon tp-stat-purple">₹</div>
          <div>
            <p>Combined Package Fees</p>
            <h2>{formatFee(totalFees)}</h2>
          </div>
        </div>
      </div>

      {/* Help */}
      <button
        type="button"
        className="tp-help-bar"
        onClick={() => setHelpOpen((open) => !open)}
        aria-expanded={helpOpen}
      >
        <span className="tp-help-left">
          <span className="tp-help-icon">ⓘ</span>
          How do test packages work?
        </span>

        <span className={`tp-chevron ${helpOpen ? "tp-chevron-open" : ""}`}>
          ⌄
        </span>
      </button>

      {helpOpen && (
        <div className="tp-help-content">
          Test packages combine multiple laboratory tests or panels into
          a single offering. Set the package fee, specify gender
          eligibility, and choose whether the package appears in the
          ratelist.
        </div>
      )}

      {/* Tabs */}
      <div className="pkg-tabs">
        <button
          type="button"
          className={`pkg-tab ${tab ? "active" : ""}`}
          onClick={() => setTab(true)}
        >
          In Ratelist
          <span className="lab-count-pill">{ratelistCount}</span>
        </button>

        <button
          type="button"
          className={`pkg-tab ${!tab ? "active" : ""}`}
          onClick={() => setTab(false)}
        >
          Not in Ratelist
          <span className="lab-count-pill">{notRatelistCount}</span>
        </button>
      </div>

      {/* Search and filters */}
      <div className="tp-toolbar">
        <div className="tp-search">
          <span aria-hidden="true">⌕</span>

          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search packages, tests, or panels..."
            aria-label="Search packages"
          />

          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <select
          className="tp-category-filter"
          value={genderFilter}
          onChange={(event) => setGenderFilter(event.target.value)}
          aria-label="Filter by gender"
        >
          <option value="All">All Genders</option>

          {categories
            .filter((gender) => gender !== "All")
            .map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
        </select>
      </div>

      {/* Package table */}
      <div className="tp-table-wrap">
        <div className="pkg-table-heading">
          <div>
            <h2>{tab ? "Packages in Ratelist" : "Packages not in Ratelist"}</h2>
            <p>
              Showing {filteredRows.length} of{" "}
              {tab ? ratelistCount : notRatelistCount} packages
            </p>
          </div>
        </div>

        <div className="pkg-table-scroll">
          <table className="pkg-table">
            <thead>
              <tr>
                <th>S. NO.</th>
                <th>PACKAGE NAME</th>
                <th>FEE</th>
                <th>FOR GENDER</th>
                <th>INCLUDED TESTS AND PANELS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={getId(row) || `${row.name}-${index}`}>
                  <td>
                    {rows.findIndex(
                      (item) =>
                        String(getId(item)) === String(getId(row))
                    ) + 1}.
                  </td>

                  <td>
                    <span className="tp-panel-name">{row.name}</span>
                  </td>

                  <td>
                    <span className="pkg-fee">{formatFee(row.fee)}</span>
                  </td>

                  <td>
                    <span className="tp-category-badge">
                      {row.gender || "All"}
                    </span>
                  </td>

                  <td>
                    <div className="pkg-included">
                      <span>
                        {getIncluded(row).length
                          ? getIncluded(row).slice(0, 3).join(", ")
                          : "No tests or panels added"}
                        {getIncluded(row).length > 3 ? "..." : ""}
                      </span>

                      {getIncluded(row).length > 0 && (
                        <span className="pkg-included-count">
                          {getIncluded(row).length} items
                        </span>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className="tp-row-actions">
                      <button
                        type="button"
                        className="tp-edit-button"
                        onClick={() => openEdit(row)}
                      >
                        ✎ Edit
                      </button>

                      <button
                        type="button"
                        className="pkg-delete-button"
                        onClick={() => deletePackage(row)}
                        aria-label={`Delete ${row.name}`}
                      >
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!filteredRows.length && (
                <tr>
                  <td colSpan={6}>
                    <div className="tp-empty-state">
                      <div className="tp-empty-icon">⌕</div>
                      <h3>No packages found</h3>
                      <p>
                        Try another search or adjust the selected filters.
                      </p>

                      <button
                        type="button"
                        className="tp-reset-button"
                        onClick={() => {
                          setQ("");
                          setGenderFilter("All");
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit modal */}
      {editingPackage && form && (
        <div
          className="tp-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <form
            className="tp-modal"
            onSubmit={savePackage}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pkg-modal-title"
          >
            <div className="tp-modal-header">
              <strong id="pkg-modal-title">
                {String(getId(editingPackage)).startsWith("new-")
                  ? "Add Test Package"
                  : "Edit Test Package"}
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
                <label htmlFor="pkg-name">Package Name</label>
                <input
                  id="pkg-name"
                  value={form.name}
                  onChange={(event) =>
                    updateForm("name", event.target.value)
                  }
                  placeholder="Enter package name"
                  required
                />
              </div>

              <div className="pkg-form-grid">
                <div className="tp-field">
                  <label htmlFor="pkg-fee">Package Fee (₹)</label>
                  <input
                    id="pkg-fee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.fee}
                    onChange={(event) =>
                      updateForm("fee", event.target.value)
                    }
                    placeholder="Enter fee"
                    required
                  />
                </div>

                <div className="tp-field">
                  <label htmlFor="pkg-gender">For Gender</label>
                  <select
                    id="pkg-gender"
                    value={form.gender}
                    onChange={(event) =>
                      updateForm("gender", event.target.value)
                    }
                  >
                    <option value="All">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="tp-field">
                <label>Included Tests and Panels</label>

                <div className="tp-test-box">
                  <div className="tp-test-chips">
                    {form.included.map((item, index) => (
                      <span
                        className="tp-chip"
                        key={`${item}-${index}`}
                      >
                        {item}

                        <button
                          type="button"
                          onClick={() =>
                            updateForm(
                              "included",
                              form.included.filter(
                                (_, itemIndex) => itemIndex !== index
                              )
                            )
                          }
                          aria-label={`Remove ${item}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {!form.included.length && (
                      <span className="tp-empty">
                        No tests or panels added
                      </span>
                    )}
                  </div>

                  <div className="tp-add-test">
                    <input
                      value={newIncluded}
                      onChange={(event) =>
                        setNewIncluded(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addIncluded();
                        }
                      }}
                      placeholder="Enter test or panel name"
                      aria-label="Included test or panel name"
                    />

                    <button type="button" onClick={addIncluded}>
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              <label className="tp-checkbox">
                <input
                  type="checkbox"
                  checked={form.ratelist}
                  onChange={(event) =>
                    updateForm("ratelist", event.target.checked)
                  }
                />
                <span>
                  Include this package in the ratelist.
                </span>
              </label>

              {error && (
                <div className="tp-error" role="alert">
                  {error}
                </div>
              )}
            </div>

            <div className="tp-modal-footer">
              <button type="submit" className="tp-save">
                Save Package
              </button>

              <button
                type="button"
                className="tp-cancel"
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
