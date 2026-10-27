import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Wallet,
  Plus,
  Search,
  Download,
  Tags,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  TrendingUp,
  ReceiptText,
  IndianRupee,
  Filter,
  X,
  FileSpreadsheet,
  ChartNoAxesCombined,
  Info,
  Trash2,
} from "lucide-react";

import DataTable from "../../components/common/DataTable";
import { expenseApiService } from "../../api";
import "./Expenses.css";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MODES = ["Cash", "UPI", "Card", "Bank Transfer", "Other"];
const UNCATEGORISED = "Uncategorised";

const todayInput = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const emptyForm = () => ({
  spent: todayInput(),
  name: "",
  amount: "",
  categoryId: "",
  mode: "Cash",
  paidTo: "",
  notes: "",
});

/** Accepts "2026-09-20" or a full ISO timestamp. */
function formatDate(value) {
  if (!value) return "—";
  const text = String(value);
  const date = new Date(text.length === 10 ? `${text}T12:00:00` : text);
  if (Number.isNaN(date.getTime())) return text;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

const modeLabel = (mode) => MODES.find((m) => m.toLowerCase() === String(mode).toLowerCase()) || mode || "—";
const categoryOf = (row) => row.category || UNCATEGORISED;

function escapeCsv(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export default function Expenses() {
  const today = new Date();

  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]); // [{ id, name }]
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [activeTab, setActiveTab] = useState("expenses");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [modeFilter, setModeFilter] = useState("All modes");
  const [showFilters, setShowFilters] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // expense being edited, or null when adding
  const [form, setForm] = useState(emptyForm());
  const [formError, setFormError] = useState("");
  const [deleting, setDeleting] = useState(null);

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  /* ---------------- data ---------------- */
  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setRows(await expenseApiService.list(monthKey));
    } catch (err) {
      if (err.status === 401) return window.location.assign("/login");
      setRows([]);
      setLoadError(err.message || "Unable to load expenses.");
    } finally {
      setLoading(false);
    }
  }, [monthKey]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    expenseApiService.categories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const fail = (err, setter = setToast) => {
    if (err.status === 401) return window.location.assign("/login");
    setter(err.message || "Something went wrong. Please try again.");
  };

  /* ---------------- derived ---------------- */
  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        !query ||
        [row.name, row.category, row.mode, row.paidTo, row.notes, row.by]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesCategory = categoryFilter === "All categories" || categoryOf(row) === categoryFilter;
      const matchesMode = modeFilter === "All modes" || String(row.mode).toLowerCase() === modeFilter.toLowerCase();
      return matchesSearch && matchesCategory && matchesMode;
    });
  }, [rows, search, categoryFilter, modeFilter]);

  const totalExpenses = rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  const visibleTotal = filteredRows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  const averageExpense = rows.length ? totalExpenses / rows.length : 0;

  const analysis = useMemo(() => {
    const totals = new Map();
    rows.forEach((row) => totals.set(categoryOf(row), (totals.get(categoryOf(row)) || 0) + (Number(row.amount) || 0)));
    return [...totals.entries()].map(([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount);
  }, [rows]);

  const columns = [
    { key: "spent", label: "SPENT ON", render: (value) => formatDate(value) },
    { key: "name", label: "EXPENSE NAME" },
    { key: "amount", label: "AMOUNT", render: (value) => <span className="expense-amount">{formatCurrency(value)}</span> },
    { key: "category", label: "CATEGORY", render: (value) => value || UNCATEGORISED },
    { key: "mode", label: "PAYMENT MODE", render: (value) => modeLabel(value) },
    { key: "by", label: "ADDED BY", render: (value) => value || "—" },
    { key: "on", label: "ADDED ON", render: (value) => formatDate(value) },
    { key: "notes", label: "NOTES", render: (value) => value || "—" },
    {
      key: "actions",
      label: "ACTIONS",
      render: (_, row) => (
        <div className="expenses-row-actions">
          <button type="button" className="expenses-link-btn" onClick={() => openEdit(row)}>Edit</button>
          <button type="button" className="expenses-link-btn danger" onClick={() => setDeleting(row)}>Delete</button>
        </div>
      ),
    },
  ];

  /* ---------------- actions ---------------- */
  function changeMonth(offset) {
    const next = new Date(year, month + offset, 1);
    setMonth(next.getMonth());
    setYear(next.getFullYear());
  }

  function openAdd() {
    setEditing(null);
    setForm(emptyForm());
    setFormError("");
    setShowForm(true);
  }

  function openEdit(row) {
    setEditing(row);
    setForm({
      spent: row.spent || todayInput(),
      name: row.name || "",
      amount: String(row.amount ?? ""),
      categoryId: row.categoryId ? String(row.categoryId) : "",
      mode: modeLabel(row.mode),
      paidTo: row.paidTo || "",
      notes: row.notes || "",
    });
    setFormError("");
    setShowForm(true);
  }

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function saveExpense(event) {
    event.preventDefault();
    setFormError("");

    if (!form.name.trim()) return setFormError("Please enter an expense name.");
    if (!form.spent) return setFormError("Please select the expense date.");
    if (!(Number(form.amount) > 0)) return setFormError("Enter an amount greater than zero.");

    const payload = {
      title: form.name.trim(),
      amount: Number(form.amount),
      date: form.spent,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      mode: form.mode,
      paidTo: form.paidTo.trim(),
      notes: form.notes.trim(),
    };

    setSaving(true);
    try {
      if (editing) await expenseApiService.update(editing.id, payload);
      else await expenseApiService.create(payload);

      // Jump to the month of the saved expense, then reload.
      const saved = new Date(`${form.spent}T12:00:00`);
      const sameMonth = saved.getMonth() === month && saved.getFullYear() === year;
      setSearch("");
      setCategoryFilter("All categories");
      setModeFilter("All modes");
      setActiveTab("expenses");
      setShowForm(false);
      setToast(editing ? "Expense updated." : "Expense added.");

      if (sameMonth) await load();
      else {
        setMonth(saved.getMonth());
        setYear(saved.getFullYear());
      }
    } catch (err) {
      fail(err, setFormError);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    setSaving(true);
    try {
      await expenseApiService.remove(deleting.id);
      setRows((current) => current.filter((row) => row.id !== deleting.id));
      setDeleting(null);
      setToast("Expense deleted.");
    } catch (err) {
      fail(err);
      setDeleting(null);
    } finally {
      setSaving(false);
    }
  }

  async function addCategory(event) {
    event.preventDefault();
    const name = newCategory.trim();
    if (!name) return;

    try {
      const category = await expenseApiService.createCategory(name);
      setCategories((current) => [...current.filter((c) => c.id !== category.id), category].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCategory("");
    } catch (err) {
      fail(err);
    }
  }

  async function removeCategory(category) {
    if (rows.some((row) => row.categoryId === category.id)) {
      setToast("This category is used by an expense in the month shown. Change those expenses first.");
      return;
    }
    try {
      await expenseApiService.removeCategory(category.id);
      setCategories((current) => current.filter((c) => c.id !== category.id));
      if (categoryFilter === category.name) setCategoryFilter("All categories");
    } catch (err) {
      fail(err);
    }
  }

  function exportCsv() {
    if (filteredRows.length === 0) {
      setToast("There are no expense records to export.");
      return;
    }

    const headers = ["Spent On", "Name", "Amount (INR)", "Category", "Payment Mode", "Paid To", "Added By", "Added On", "Notes"];
    const body = filteredRows.map((row) => [
      formatDate(row.spent), row.name, row.amount, categoryOf(row), modeLabel(row.mode),
      row.paidTo, row.by, formatDate(row.on), row.notes,
    ]);

    const csv = [headers.map(escapeCsv).join(","), ...body.map((r) => r.map(escapeCsv).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `expenses-${monthKey}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function clearFilters() {
    setSearch("");
    setCategoryFilter("All categories");
    setModeFilter("All modes");
  }

  const yearOptions = Array.from({ length: 7 }, (_, index) => today.getFullYear() - 3 + index);

  /* ---------------- render ---------------- */
  return (
    <div className="business-page expenses-page">
      <header className="expenses-header">
        <div className="expenses-header-main">
          <div className="expenses-header-icon">
            <Wallet size={25} />
          </div>
          <div className="expenses-heading-copy">
            <div className="expenses-eyebrow">BUSINESS MANAGEMENT</div>
            <div className="biz-title expenses-title">
              <h1>Expenses</h1>
            </div>
            <p>Manage laboratory spending, organize costs, and review expense records in one place.</p>
          </div>
        </div>

        <div className="expenses-header-actions">
          <button type="button" className="biz-btn" onClick={exportCsv}>
            <Download size={16} />
            Export CSV
          </button>
          <button type="button" className="biz-btn" onClick={() => setShowCategories((v) => !v)}>
            <Tags size={16} />
            Categories
          </button>
          <button type="button" className="biz-btn primary" onClick={openAdd}>
            <Plus size={17} />
            Add expense
          </button>
        </div>
      </header>

      <section className="expenses-stats">
        <article className="expenses-stat-card total">
          <div className="expenses-stat-top">
            <span>Total expenses</span>
            <div className="expenses-stat-icon purple"><IndianRupee size={19} /></div>
          </div>
          <strong>{formatCurrency(totalExpenses)}</strong>
          <p><CalendarDays size={13} />{MONTHS[month]} {year}</p>
        </article>

        <article className="expenses-stat-card">
          <div className="expenses-stat-top">
            <span>Recorded expenses</span>
            <div className="expenses-stat-icon blue"><ReceiptText size={19} /></div>
          </div>
          <strong>{rows.length}</strong>
          <p>Entries for this month</p>
        </article>

        <article className="expenses-stat-card">
          <div className="expenses-stat-top">
            <span>Average expense</span>
            <div className="expenses-stat-icon green"><TrendingUp size={19} /></div>
          </div>
          <strong>{formatCurrency(averageExpense)}</strong>
          <p>Average per recorded entry</p>
        </article>

        <article className="expenses-stat-card">
          <div className="expenses-stat-top">
            <span>Current view total</span>
            <div className="expenses-stat-icon orange"><Filter size={19} /></div>
          </div>
          <strong>{formatCurrency(visibleTotal)}</strong>
          <p>Based on active search and filters</p>
        </article>
      </section>

      <section className="expenses-help-banner">
        <div className="expenses-help-icon"><Info size={19} /></div>
        <div>
          <strong>Keep your expenses organized</strong>
          <p>Add spending records with a date, category, payment method, and optional notes for easier tracking.</p>
        </div>
      </section>

      {showCategories && (
        <section className="expenses-panel">
          <div className="expenses-panel-heading">
            <div>
              <h2>Manage categories</h2>
              <p>Create categories to organize your expenses.</p>
            </div>
            <button type="button" className="expenses-icon-button" onClick={() => setShowCategories(false)} aria-label="Close category manager">
              <X size={18} />
            </button>
          </div>

          <form className="expenses-add-category" onSubmit={addCategory}>
            <input
              className="biz-input"
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              placeholder="Enter a category name"
              aria-label="New category name"
              maxLength={120}
            />
            <button className="biz-btn primary" type="submit" disabled={!newCategory.trim()}>
              <Plus size={15} />
              Add category
            </button>
          </form>

          <div className="expenses-category-list">
            {categories.map((category) => (
              <div className="expenses-category-chip" key={category.id}>
                <Tags size={14} />
                <span>{category.name}</span>
                <button type="button" onClick={() => removeCategory(category)} aria-label={`Remove ${category.name} category`} title="Remove category">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="expenses-period-card">
        <div className="expenses-period-copy">
          <div className="expenses-small-icon"><CalendarDays size={18} /></div>
          <div>
            <h2>Expense overview</h2>
            <p>Choose a period to review your spending.</p>
          </div>
        </div>

        <div className="expenses-period-controls">
          <button type="button" className="expenses-period-arrow" onClick={() => changeMonth(-1)} aria-label="Previous month">
            <ChevronLeft size={19} />
          </button>

          <label className="expenses-period-select">
            <span className="sr-only">Month</span>
            <select value={month} onChange={(event) => setMonth(Number(event.target.value))}>
              {MONTHS.map((name, index) => (
                <option value={index} key={name}>{name}</option>
              ))}
            </select>
          </label>

          <label className="expenses-period-select year">
            <span className="sr-only">Year</span>
            <select value={year} onChange={(event) => setYear(Number(event.target.value))}>
              {yearOptions.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>

          <button type="button" className="expenses-period-arrow" onClick={() => changeMonth(1)} aria-label="Next month">
            <ChevronRight size={19} />
          </button>
        </div>
      </section>

      <div className="expenses-tabs" role="tablist" aria-label="Expense views">
        <button type="button" className={`expenses-tab ${activeTab === "expenses" ? "active" : ""}`}
          onClick={() => setActiveTab("expenses")} role="tab" aria-selected={activeTab === "expenses"}>
          <ReceiptText size={16} />
          Expenses
        </button>
        <button type="button" className={`expenses-tab ${activeTab === "analysis" ? "active" : ""}`}
          onClick={() => setActiveTab("analysis")} role="tab" aria-selected={activeTab === "analysis"}>
          <ChartNoAxesCombined size={16} />
          Analysis
        </button>
      </div>

      {loadError && (
        <div className="expenses-error" role="alert">
          <span>{loadError}</span>
          <button type="button" className="biz-btn" onClick={load}>Try again</button>
        </div>
      )}

      {activeTab === "expenses" ? (
        <section className="expenses-records-card">
          <div className="expenses-records-header">
            <div>
              <h2>Expense records</h2>
              <p>Search and manage your spending entries.</p>
            </div>
            <span className="expenses-record-count">{filteredRows.length} records</span>
          </div>

          <div className="expenses-record-toolbar">
            <label className="expenses-search">
              <Search size={17} />
              <input
                className="biz-input"
                placeholder="Search name, category, payment mode..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search expenses"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                  <X size={15} />
                </button>
              )}
            </label>

            <button type="button" className={`biz-btn ${showFilters ? "primary" : ""}`} onClick={() => setShowFilters((v) => !v)}>
              <Filter size={16} />
              Filters
            </button>

            <button type="button" className="biz-btn primary" onClick={openAdd}>
              <Plus size={16} />
              Add new
            </button>
          </div>

          {showFilters && (
            <div className="expenses-filter-panel">
              <label>
                <span>Category</span>
                <select className="biz-select" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                  <option>All categories</option>
                  {categories.map((category) => (
                    <option key={category.id}>{category.name}</option>
                  ))}
                  <option>{UNCATEGORISED}</option>
                </select>
              </label>

              <label>
                <span>Payment mode</span>
                <select className="biz-select" value={modeFilter} onChange={(event) => setModeFilter(event.target.value)}>
                  <option>All modes</option>
                  {MODES.map((mode) => (
                    <option key={mode}>{mode}</option>
                  ))}
                </select>
              </label>

              <button type="button" className="expenses-clear-filters" onClick={clearFilters}>
                Clear all
              </button>
            </div>
          )}

          <div className="expenses-table-wrap">
            <DataTable
              columns={columns}
              rows={filteredRows}
              loading={loading}
              emptyText="No expense records for this period"
            />
          </div>

          <div className="expenses-table-footer">
            <span>
              Showing <strong>{filteredRows.length}</strong> of <strong>{rows.length}</strong> expenses in this period
            </span>
            <span>
              Displayed total: <strong>{formatCurrency(visibleTotal)}</strong>
            </span>
          </div>
        </section>
      ) : (
        <section className="expenses-analysis-card">
          <div className="expenses-records-header">
            <div>
              <h2>Expense analysis</h2>
              <p>A category-wise summary of recorded expenses for {MONTHS[month]} {year}.</p>
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="expenses-analysis-empty">
              <div className="expenses-stat-icon purple"><ChartNoAxesCombined size={22} /></div>
              <h3>No data to analyze</h3>
              <p>Add expenses for this period to see your category breakdown.</p>
              <button type="button" className="biz-btn primary" onClick={openAdd}>
                <Plus size={16} />
                Add expense
              </button>
            </div>
          ) : (
            <div className="expenses-analysis-content">
              {analysis.map((item) => {
                const percentage = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;
                return (
                  <div className="expenses-analysis-row" key={item.category}>
                    <div className="expenses-analysis-row-top">
                      <span>{item.category}</span>
                      <strong>{formatCurrency(item.amount)}</strong>
                    </div>
                    <div className="expenses-progress-track" role="progressbar" aria-label={`${item.category} share of expenses`}
                      aria-valuenow={Math.round(percentage)} aria-valuemin={0} aria-valuemax={100}>
                      <div className="expenses-progress-fill" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="expenses-analysis-percent">{percentage.toFixed(1)}% of total</span>
                  </div>
                );
              })}

              <div className="expenses-analysis-total">
                <span>Total recorded spending</span>
                <strong>{formatCurrency(totalExpenses)}</strong>
              </div>
            </div>
          )}
        </section>
      )}

      {showForm && (
        <div className="expenses-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowForm(false)}>
          <section className="expenses-modal" role="dialog" aria-modal="true" aria-labelledby="expenses-modal-title">
            <div className="expenses-modal-header">
              <div>
                <div className="expenses-modal-icon"><FileSpreadsheet size={20} /></div>
                <h2 id="expenses-modal-title">{editing ? "Edit expense" : "Add new expense"}</h2>
                <p>Enter the details for this expense record.</p>
              </div>
              <button type="button" className="expenses-icon-button" onClick={() => setShowForm(false)} aria-label="Close form">
                <X size={19} />
              </button>
            </div>

            <form onSubmit={saveExpense}>
              <div className="expenses-form-grid">
                <label>
                  Expense name <span>*</span>
                  <input className="biz-input" name="name" value={form.name} onChange={updateForm}
                    placeholder="e.g. Printer paper" maxLength={255} required autoFocus />
                </label>

                <label>
                  Amount (₹) <span>*</span>
                  <input className="biz-input" name="amount" type="number" min="0.01" step="0.01"
                    value={form.amount} onChange={updateForm} placeholder="e.g. 750" required />
                </label>

                <label>
                  Spent on <span>*</span>
                  <input className="biz-input" name="spent" type="date" value={form.spent} onChange={updateForm} required />
                </label>

                <label>
                  Category
                  <select className="biz-select" name="categoryId" value={form.categoryId} onChange={updateForm}>
                    <option value="">{UNCATEGORISED}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Payment mode
                  <select className="biz-select" name="mode" value={form.mode} onChange={updateForm}>
                    {MODES.map((mode) => (
                      <option key={mode}>{mode}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Paid to
                  <input className="biz-input" name="paidTo" value={form.paidTo} onChange={updateForm}
                    placeholder="Shop or person (optional)" maxLength={255} />
                </label>

                <label className="expenses-notes-field">
                  Notes
                  <textarea name="notes" value={form.notes} onChange={updateForm}
                    placeholder="Optional details about this expense" rows={3} />
                </label>
              </div>

              {formError && <p className="expenses-form-error" role="alert">{formError}</p>}

              <div className="expenses-modal-actions">
                <button type="button" className="biz-btn" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="biz-btn primary" disabled={saving}>
                  <Plus size={16} />
                  {saving ? "Saving…" : editing ? "Save changes" : "Save expense"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleting && (
        <div className="expenses-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setDeleting(null)}>
          <section className="expenses-modal expenses-confirm" role="alertdialog" aria-modal="true" aria-labelledby="expenses-delete-title">
            <h2 id="expenses-delete-title">Delete expense?</h2>
            <p>
              Delete <strong>{deleting.name}</strong> ({formatCurrency(deleting.amount)})? This cannot be undone.
            </p>
            <div className="expenses-modal-actions">
              <button type="button" className="biz-btn" onClick={() => setDeleting(null)}>Cancel</button>
              <button type="button" className="biz-btn primary" onClick={confirmDelete} disabled={saving}>
                {saving ? "Deleting…" : "Delete"}
              </button>
            </div>
          </section>
        </div>
      )}

      {toast && (
        <div className="expenses-toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}