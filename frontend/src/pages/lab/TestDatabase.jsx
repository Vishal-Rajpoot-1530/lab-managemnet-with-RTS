import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LabTable, { Action } from "./LabTable";
import testApiService from "../../api/services/testApiService";
import testCategoryApiService from "../../api/services/testCategoryApiService";
import "./test-database.css";

const unwrap = (r) =>
  Array.isArray(r) ? r : r?.data || r?.items || r?.rows || [];

export default function TestDatabase() {
  const nav = useNavigate();

  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [t, c] = await Promise.all([
        testApiService.list(),
        testCategoryApiService.list(),
      ]);

      setTests(unwrap(t));
      setCategories(unwrap(c));
    } catch (e) {
      setError(e?.message || "Unable to load test database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const rows = useMemo(
    () =>
      tests.filter((x) => {
        const matchesCategory =
          cat === "All" || String(x.categoryId) === String(cat);

        const search = q.trim().toLowerCase();

        const matchesSearch =
          !search ||
          [x.name, x.shortName, x.typeLabel, x.categoryName, x.order].some(
            (value) =>
              String(value ?? "")
                .toLowerCase()
                .includes(search),
          );

        return matchesCategory && matchesSearch;
      }),
    [tests, cat, q],
  );

  const categoryCounts = useMemo(() => {
    const result = {};

    tests.forEach((test) => {
      const key = String(test.categoryId);
      result[key] = (result[key] || 0) + 1;
    });

    return result;
  }, [tests]);

  const cols = [
    {
      key: "order",
      label: "S. NO.",
      render: (v, r, i) => <span className="td-order">{v || i + 1}</span>,
    },
    {
      key: "name",
      label: "TEST NAME",
      render: (v) => <span className="td-test-name">{v || "—"}</span>,
    },
    {
      key: "typeLabel",
      label: "TEST TYPE",
      render: (v) => <span className="td-type-badge">{v || "—"}</span>,
    },
    {
      key: "shortName",
      label: "SHORT NAME",
      render: (v) => <span className="td-short-name">{v || "—"}</span>,
    },
    {
      key: "categoryName",
      label: "CATEGORY",
      render: (v) => <span className="td-category-name">{v || "—"}</span>,
    },
    {
      key: "action",
      label: "ACTIONS",
      render: (_, r) => (
        <div className="td-actions">
          <Action onClick={() => nav(`/lab/tests/${r.id}/edit/${r.type}`)}>
            ✎ Edit
          </Action>

          <Action onClick={() => nav(`/lab/tests/${r.id}/view/${r.type}`)}>
            ◉ View
          </Action>
        </div>
      ),
    },
  ];

  return (
    <div className="lab-page td-page">
      <div className="td-page-header">
        <div>
          <div className="td-eyebrow">LABORATORY MANAGEMENT</div>
          <h1>Test database</h1>
          <p className="td-subtitle">
            Manage laboratory tests, categories, and test configurations.
          </p>
        </div>

        <div className="td-header-actions">
          <button className="lab-btn" onClick={load} disabled={loading}>
            ↻ Refresh
          </button>

          <button
            className="lab-btn primary"
            onClick={() => nav("/lab/tests/select-type")}
          >
            ＋ Add new test
          </button>

          <button
            className="lab-btn td-import-btn"
            onClick={() =>
              window.alert("Connect this button to your import workflow.")
            }
          >
            ⇧ Import
          </button>
        </div>
      </div>

      <div className="td-important">
        <div className="td-important-icon">!</div>
        <div>
          <strong>Important: Verify reference ranges</strong>
          <p>
            Your laboratory should proofread and update the provided reference
            ranges before using them in printed laboratory reports.
          </p>
        </div>
      </div>

      <div className="td-stats">
        <div className="td-stat-card">
          <div className="td-stat-icon td-stat-blue">▤</div>
          <div>
            <div className="td-stat-label">Total tests</div>
            <div className="td-stat-value">{tests.length}</div>
          </div>
        </div>

        <div className="td-stat-card">
          <div className="td-stat-icon td-stat-purple">▦</div>
          <div>
            <div className="td-stat-label">Categories</div>
            <div className="td-stat-value">{categories.length}</div>
          </div>
        </div>

        <div className="td-stat-card">
          <div className="td-stat-icon td-stat-green">✓</div>
          <div>
            <div className="td-stat-label">Matching tests</div>
            <div className="td-stat-value">{rows.length}</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="td-error">
          <span>ⓘ {error}</span>
          <button className="lab-btn" onClick={load}>
            Try again
          </button>
        </div>
      )}

      <section className="td-panel">
        <div className="td-section-heading">
          <div>
            <h2>Browse by category</h2>
            <p>Select a category to narrow down the available tests.</p>
          </div>
          <span className="td-section-count">
            {categories.length} categories
          </span>
        </div>

        <div className="td-category-list">
          <button
            className={`td-category-chip ${cat === "All" ? "active" : ""}`}
            onClick={() => setCat("All")}
          >
            All tests <span>{tests.length}</span>
          </button>

          {categories.map((x) => (
            <button
              key={x.id}
              className={`td-category-chip ${
                String(cat) === String(x.id) ? "active" : ""
              }`}
              onClick={() => setCat(x.id)}
            >
              {x.name}
              <span>{categoryCounts[String(x.id)] || 0}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="td-panel td-database-panel">
        <div className="td-section-heading td-database-heading">
          <div>
            <h2>All laboratory tests</h2>
            <p>Search and manage your test database.</p>
          </div>
          <span className="td-result-count">
            {rows.length} {rows.length === 1 ? "result" : "results"}
          </span>
        </div>

        <div className="td-search-row">
          <div className="td-search-box">
            <span className="td-search-icon">⌕</span>
            <input
              className="lab-input lab-search"
              placeholder="Search test name, short name, type..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search tests"
            />

            {q && (
              <button
                className="td-clear-search"
                onClick={() => setQ("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {(q || cat !== "All") && (
            <button
              className="lab-btn"
              onClick={() => {
                setQ("");
                setCat("All");
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="td-loading">
            <span className="td-spinner" />
            <span>Loading laboratory tests...</span>
          </div>
        ) : rows.length > 0 ? (
          <div className="td-table-wrap">
            <LabTable columns={cols} rows={rows} />
          </div>
        ) : (
          <div className="td-empty">
            <div className="td-empty-icon">⌕</div>
            <h3>{tests.length ? "No matching tests" : "No tests available"}</h3>
            <p>
              {tests.length
                ? "Try another search term or select a different category."
                : "Add a new test to get started with your database."}
            </p>

            {tests.length > 0 ? (
              <button
                className="lab-btn"
                onClick={() => {
                  setQ("");
                  setCat("All");
                }}
              >
                Clear filters
              </button>
            ) : (
              <button
                className="lab-btn primary"
                onClick={() => nav("/lab/tests/select-type")}
              >
                ＋ Add new test
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
