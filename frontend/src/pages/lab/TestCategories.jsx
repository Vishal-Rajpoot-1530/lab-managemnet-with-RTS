import { useCallback, useEffect, useMemo, useState } from "react";
import LabTable, { Action } from "./LabTable";
import testCategoryApiService from "../../api/services/testCategoryApiService";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import IconButton from "../../components/common/IconButton";
import "./test-categories.css";

export default function TestCategories() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showGuide, setShowGuide] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await testCategoryApiService.list();

      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.items)
            ? response.items
            : Array.isArray(response?.rows)
              ? response.rows
              : [];

      setRows(
        data.map((item, index) => ({
          ...item,
          id: item.id ?? item.categoryId ?? index + 1,
          order: item.order ?? item.sortOrder ?? index + 1,
          name: item.name ?? item.categoryName ?? "",
        }))
      );
    } catch (err) {
      console.error("[TEST CATEGORIES GET ERROR]", err);
      setRows([]);
      setError(err?.message || "Unable to load test categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return rows;

    return rows.filter((row) =>
      String(row.name || "").toLowerCase().includes(query)
    );
  }, [rows, search]);

  function openAddModal() {
    setEditingCategory(null);
    setName("");
    setNameError("");
    setError("");
    setModal(true);
  }

  function openEditModal(row) {
    setEditingCategory(row);
    setName(row?.name || "");
    setNameError("");
    setError("");
    setModal(true);
  }

  function closeModal() {
    if (saving) return;

    setModal(false);
    setEditingCategory(null);
    setName("");
    setNameError("");
    setError("");
  }

  function validateForm() {
    const cleanName = name.trim();

    if (!cleanName) {
      setNameError("Category name is required.");
      return false;
    }

    const duplicate = rows.some(
      (row) =>
        String(row.name || "").trim().toLowerCase() ===
          cleanName.toLowerCase() &&
        String(row.id) !== String(editingCategory?.id)
    );

    if (duplicate) {
      setNameError("A category with this name already exists.");
      return false;
    }

    setNameError("");
    return true;
  }

  async function submit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const cleanName = name.trim();

    setSaving(true);
    setError("");

    try {
      if (editingCategory) {
        await testCategoryApiService.update(editingCategory.id, {
          name: cleanName,
        });
      } else {
        await testCategoryApiService.create({
          name: cleanName,
        });
      }

      setModal(false);
      setEditingCategory(null);
      setName("");
      setNameError("");

      await load();
    } catch (err) {
      console.error("[TEST CATEGORY SAVE ERROR]", err);
      setError(
        err?.message ||
          (editingCategory
            ? "Unable to update category."
            : "Unable to create category.")
      );
    } finally {
      setSaving(false);
    }
  }

  const cols = [
    {
      key: "order",
      label: "ORDER",
      render: (value) => (
        <span className="tc-order">
          <span className="tc-order-number">
            {String(value ?? "—").padStart(2, "0")}
          </span>
        </span>
      ),
    },
    {
      key: "name",
      label: "CATEGORY",
      render: (value) => (
        <div className="tc-category-cell">
          <span className="tc-category-symbol" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="6" height="6" rx="1.5" />
              <rect x="14" y="4" width="6" height="6" rx="1.5" />
              <rect x="4" y="14" width="6" height="6" rx="1.5" />
              <rect x="14" y="14" width="6" height="6" rx="1.5" />
            </svg>
          </span>
          <span className="tc-category-title">
            {value || "Untitled category"}
          </span>
        </div>
      ),
    },
    {
      key: "action",
      label: "ACTIONS",
      render: (_, row) => (
        <div className="tc-row-actions">
          <Action onClick={() => openEditModal(row)}>Edit</Action>
          <span className="tc-action-divider" />
          <Action>View tests</Action>
        </div>
      ),
    },
  ];

  return (
    <main className="lab-page tc-page">
      <header className="tc-header">
        <div className="tc-heading-copy">
          <div className="tc-breadcrumb">
            <span>Laboratory</span>
            <span aria-hidden="true">/</span>
            <span>Test configuration</span>
          </div>

          <div className="tc-title-line">
            <div>
              <h1>Test categories</h1>
              <p>
                Manage the categories that keep your laboratory tests
                organized.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={openAddModal}
        >
          <span className="tc-button-plus" aria-hidden="true">
            +
          </span>
          Add category
        </Button>
      </header>

      <section className="tc-summary" aria-label="Category summary">
        <div className="tc-summary-main">
          <span className="tc-summary-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="6" height="6" rx="1.5" />
              <rect x="14" y="4" width="6" height="6" rx="1.5" />
              <rect x="4" y="14" width="6" height="6" rx="1.5" />
              <rect x="14" y="14" width="6" height="6" rx="1.5" />
            </svg>
          </span>

          <div>
            <span className="tc-summary-label">Total categories</span>
            <div className="tc-summary-value">
              {loading ? "—" : rows.length}
            </div>
            <span className="tc-summary-note">
              {loading
                ? "Retrieving category data"
                : "Based on your current category list"}
            </span>
          </div>
        </div>

        <div className="tc-summary-divider" />

        <div className="tc-summary-detail">
          <span className="tc-summary-detail-label">Current view</span>
          <strong>{loading ? "Loading" : "All categories"}</strong>
          <span className="tc-summary-detail-note">
            {loading
              ? "Please wait"
              : `${filteredRows.length} shown${
                  search.trim() ? " · filtered" : ""
                }`}
          </span>
        </div>
      </section>

      <section className="tc-guide">
        <button
          className="tc-guide-toggle"
          type="button"
          aria-expanded={showGuide}
          onClick={() => setShowGuide((value) => !value)}
        >
          <span className="tc-guide-mark" aria-hidden="true">
            i
          </span>

          <span className="tc-guide-text">
            <strong>About category ordering</strong>
            <span>
              Understand how categories are currently displayed.
            </span>
          </span>

          <span
            className={`tc-guide-arrow ${showGuide ? "is-open" : ""}`}
            aria-hidden="true"
          >
            ⌄
          </span>
        </button>

        {showGuide && (
          <div className="tc-guide-content">
            Categories follow the order provided by the API. To change their
            order, your application needs a supported reorder operation.
            The order numbers on this page are indicators, not drag-and-drop
            controls.
          </div>
        )}
      </section>

      {error && !modal && (
        <div className="tc-alert" role="alert">
          <span className="tc-alert-mark" aria-hidden="true">
            !
          </span>

          <div className="tc-alert-copy">
            <strong>Something went wrong</strong>
            <span>{error}</span>
          </div>

          <button
            type="button"
            className="tc-retry"
            onClick={load}
            disabled={loading}
          >
            Retry
          </button>
        </div>
      )}

      <section className="tc-table-card">
        <div className="tc-table-toolbar">
          <div className="tc-table-title">
            <h2>Category directory</h2>
            <p>Review and maintain your laboratory category list.</p>
          </div>

          <div className="tc-table-tools">
            <div className="tc-search">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.2 4.2" />
              </svg>

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories"
                aria-label="Search categories"
              />

              {search && (
                <button
                  type="button"
                  className="tc-search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="tc-table-meta">
          <span className="tc-meta-dot" />

          {loading
            ? "Loading category data…"
            : error && rows.length === 0
              ? "Category data unavailable"
              : search.trim()
                ? `${filteredRows.length} matching ${
                    filteredRows.length === 1 ? "category" : "categories"
                  }`
                : `${rows.length} ${
                    rows.length === 1 ? "category" : "categories"
                  } in total`}
        </div>

        <div className="tc-table-content">
          {loading ? (
            <div className="tc-state">
              <span className="tc-spinner" />
              <strong>Loading categories</strong>
              <p>
                Getting the latest information from your laboratory system.
              </p>
            </div>
          ) : error && rows.length === 0 ? (
            <div className="tc-state">
              <span className="tc-state-symbol">!</span>
              <strong>We couldn't load your categories</strong>
              <p>Try again. Your category data has not been changed.</p>
              <Button type="button" variant="primary" onClick={load}>
                Try again
              </Button>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="tc-state">
              <span className="tc-state-symbol">
                {search.trim() ? "⌕" : "+"}
              </span>

              <strong>
                {search.trim()
                  ? "No matching categories"
                  : "No categories yet"}
              </strong>

              <p>
                {search.trim()
                  ? "Try a different search term or clear your search."
                  : "Create your first category to start organizing laboratory tests."}
              </p>

              {search.trim() ? (
                <button
                  type="button"
                  className="tc-text-button"
                  onClick={() => setSearch("")}
                >
                  Clear search
                </button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  onClick={openAddModal}
                >
                  Add your first category
                </Button>
              )}
            </div>
          ) : (
            <LabTable columns={cols} rows={filteredRows} />
          )}
        </div>

        {!loading && !error && rows.length > 0 && (
          <footer className="tc-table-footer">
            <span>
              Showing <strong>{filteredRows.length}</strong> of{" "}
              <strong>{rows.length}</strong> categories
            </span>

            {search.trim() && (
              <button
                type="button"
                className="tc-footer-clear"
                onClick={() => setSearch("")}
              >
                Clear filter
              </button>
            )}
          </footer>
        )}
      </section>

      {modal && (
        <div
          className="tc-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !saving) closeModal();
          }}
        >
          <section
            className="tc-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tc-modal-title"
          >
            <header className="tc-modal-header">
              <div className="tc-modal-heading">
                <span className="tc-modal-symbol" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="4" width="6" height="6" rx="1.5" />
                    <rect x="14" y="4" width="6" height="6" rx="1.5" />
                    <rect x="4" y="14" width="6" height="6" rx="1.5" />
                    <rect x="14" y="14" width="6" height="6" rx="1.5" />
                  </svg>
                </span>

                <div>
                  <span className="tc-modal-eyebrow">
                    CATEGORY MANAGEMENT
                  </span>

                  <h2 id="tc-modal-title">
                    {editingCategory ? "Edit category" : "New category"}
                  </h2>

                  <p>
                    {editingCategory
                      ? "Make changes to this category."
                      : "Create a category for your laboratory tests."}
                  </p>
                </div>
              </div>

              <IconButton
                label="Close"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </IconButton>
            </header>

            <form onSubmit={submit}>
              <div className="tc-modal-body">
                {error && (
                  <div className="tc-alert tc-modal-alert" role="alert">
                    <span className="tc-alert-mark">!</span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="tc-form-section-label">
                  CATEGORY DETAILS
                </div>

                <Input
                  label="Category name *"
                  autoFocus
                  value={name}
                  error={nameError}
                  placeholder="Enter a category name"
                  onChange={(e) => {
                    const value = e.target.value;
                    setName(value);
                    if (value.trim()) setNameError("");
                  }}
                />

                <p className="tc-field-hint">
                  Choose a clear name that your laboratory team will
                  recognize.
                </p>
              </div>

              <footer className="tc-modal-footer">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  loading={saving}
                >
                  {saving
                    ? "Saving…"
                    : editingCategory
                      ? "Save changes"
                      : "Create category"}
                </Button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}