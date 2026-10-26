import { useMemo, useState } from "react";
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
import "./Expenses.css";

const DEFAULT_CATEGORIES = [
  "General",
  "Office Supplies",
  "Equipment",
  "Utilities",
  "Travel",
  "Maintenance",
  "Other",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const INITIAL_FORM = {
  spent: new Date().toISOString().slice(0, 10),
  name: "",
  amount: "",
  category: "General",
  mode: "Cash",
  by: "Lab Owner",
  notes: "",
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export default function Expenses() {
  const today = new Date();

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [activeTab, setActiveTab] = useState("expenses");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [modeFilter, setModeFilter] = useState("All modes");
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");

  const monthRows = useMemo(
    () =>
      rows.filter((row) => {
        const date = new Date(`${row.spent}T12:00:00`);

        return (
          !Number.isNaN(date.getTime()) &&
          date.getMonth() === month &&
          date.getFullYear() === year
        );
      }),
    [rows, month, year]
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return monthRows.filter((row) => {
      const matchesSearch = Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(query);

      const matchesCategory =
        categoryFilter === "All categories" ||
        row.category === categoryFilter;

      const matchesMode =
        modeFilter === "All modes" || row.mode === modeFilter;

      return matchesSearch && matchesCategory && matchesMode;
    });
  }, [monthRows, search, categoryFilter, modeFilter]);

  const totalExpenses = monthRows.reduce(
    (total, row) => total + (Number(row.amount) || 0),
    0
  );

  const visibleTotal = filteredRows.reduce(
    (total, row) => total + (Number(row.amount) || 0),
    0
  );

  const averageExpense =
    monthRows.length > 0 ? totalExpenses / monthRows.length : 0;

  const columns = [
    {
      key: "spent",
      label: "SPENT ON",
      render: (row) => formatDate(row.spent),
    },
    {
      key: "name",
      label: "EXPENSE NAME",
    },
    {
      key: "amount",
      label: "AMOUNT",
      render: (row) => (
        <span className="expense-amount">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: "category",
      label: "CATEGORY",
    },
    {
      key: "mode",
      label: "PAYMENT MODE",
    },
    {
      key: "by",
      label: "ADDED BY",
    },
    {
      key: "on",
      label: "ADDED ON",
      render: (row) => formatDate(row.on),
    },
    {
      key: "notes",
      label: "NOTES",
    },
  ];

  function changeMonth(offset) {
    const next = new Date(year, month + offset, 1);

    setMonth(next.getMonth());
    setYear(next.getFullYear());
  }

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function saveExpense(event) {
    event.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Please enter an expense name.");
      return;
    }

    if (!form.spent) {
      setFormError("Please select the expense date.");
      return;
    }

    if (form.amount === "" || !Number.isFinite(Number(form.amount)) ||
        Number(form.amount) <= 0) {
      setFormError("Enter an amount greater than zero.");
      return;
    }

    const addedDate = new Date();
    const expenseDate = new Date(`${form.spent}T12:00:00`);

    const newRow = {
      id: Date.now(),
      spent: form.spent,
      name: form.name.trim(),
      amount: Number(form.amount),
      category: form.category,
      mode: form.mode,
      by: form.by,
      on: formatDate(formatDateInput(addedDate)),
      notes: form.notes.trim() || "—",
    };

    setRows((current) => [...current, newRow]);
    setMonth(expenseDate.getMonth());
    setYear(expenseDate.getFullYear());
    setSearch("");
    setCategoryFilter("All categories");
    setModeFilter("All modes");
    setActiveTab("expenses");
    setForm(INITIAL_FORM);
    setShowForm(false);
  }

  function formatDateInput(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  }

  function exportCsv() {
    if (filteredRows.length === 0) {
      window.alert("There are no expense records to export.");
      return;
    }

    const headers = [
      "Spent On",
      "Name",
      "Amount (INR)",
      "Category",
      "Payment Mode",
      "Added By",
      "Added On",
      "Notes",
    ];

    const csvRows = filteredRows.map((row) => [
      formatDate(row.spent),
      row.name,
      row.amount,
      row.category,
      row.mode,
      row.by,
      row.on,
      row.notes,
    ]);

    const csv = [
      headers.map(escapeCsv).join(","),
      ...csvRows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `expenses-${year}-${String(month + 1).padStart(2, "0")}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function addCategory(event) {
    event.preventDefault();

    const value = newCategory.trim();

    if (
      value &&
      !categories.some(
        (category) => category.toLowerCase() === value.toLowerCase()
      )
    ) {
      setCategories((current) => [...current, value]);
      setNewCategory("");
    }
  }

  function removeCategory(category) {
    const isUsed = rows.some((row) => row.category === category);

    if (isUsed) {
      window.alert("This category is being used by an expense record.");
      return;
    }

    setCategories((current) =>
      current.filter((item) => item !== category)
    );

    if (categoryFilter === category) {
      setCategoryFilter("All categories");
    }
  }

  function clearFilters() {
    setSearch("");
    setCategoryFilter("All categories");
    setModeFilter("All modes");
  }

  const yearOptions = Array.from(
    { length: 7 },
    (_, index) => today.getFullYear() - 3 + index
  );

  return (
    <div className="business-page expenses-page">
      {/* Header */}
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

            <p>
              Manage laboratory spending, organize costs, and review expense
              records in one place.
            </p>
          </div>
        </div>

        <div className="expenses-header-actions">
          <button className="biz-btn" onClick={exportCsv}>
            <Download size={16} />
            Export CSV
          </button>

          <button
            className="biz-btn"
            onClick={() => setShowCategories((value) => !value)}
          >
            <Tags size={16} />
            Categories
          </button>

          <button
            className="biz-btn primary"
            onClick={() => {
              setFormError("");
              setShowForm(true);
            }}
          >
            <Plus size={17} />
            Add expense
          </button>
        </div>
      </header>

      {/* Summary cards */}
      <section className="expenses-stats">
        <article className="expenses-stat-card total">
          <div className="expenses-stat-top">
            <span>Total expenses</span>
            <div className="expenses-stat-icon purple">
              <IndianRupee size={19} />
            </div>
          </div>

          <strong>{formatCurrency(totalExpenses)}</strong>

          <p>
            <CalendarDays size={13} />
            {MONTHS[month]} {year}
          </p>
        </article>

        <article className="expenses-stat-card">
          <div className="expenses-stat-top">
            <span>Recorded expenses</span>
            <div className="expenses-stat-icon blue">
              <ReceiptText size={19} />
            </div>
          </div>

          <strong>{monthRows.length}</strong>
          <p>Entries for this month</p>
        </article>

        <article className="expenses-stat-card">
          <div className="expenses-stat-top">
            <span>Average expense</span>
            <div className="expenses-stat-icon green">
              <TrendingUp size={19} />
            </div>
          </div>

          <strong>{formatCurrency(averageExpense)}</strong>
          <p>Average per recorded entry</p>
        </article>

        <article className="expenses-stat-card">
          <div className="expenses-stat-top">
            <span>Current view total</span>
            <div className="expenses-stat-icon orange">
              <Filter size={19} />
            </div>
          </div>

          <strong>{formatCurrency(visibleTotal)}</strong>
          <p>Based on active search and filters</p>
        </article>
      </section>

      {/* Feedback and help */}
      <section className="expenses-help-banner">
        <div className="expenses-help-icon">
          <Info size={19} />
        </div>

        <div>
          <strong>Keep your expenses organized</strong>
          <p>
            Add spending records with a date, category, payment method, and
            optional notes for easier tracking.
          </p>
        </div>
      </section>

      {/* Category manager */}
      {showCategories && (
        <section className="expenses-panel">
          <div className="expenses-panel-heading">
            <div>
              <h2>Manage categories</h2>
              <p>Create categories to organize your expenses.</p>
            </div>

            <button
              className="expenses-icon-button"
              onClick={() => setShowCategories(false)}
              aria-label="Close category manager"
            >
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
            />

            <button
              className="biz-btn primary"
              type="submit"
              disabled={!newCategory.trim()}
            >
              <Plus size={15} />
              Add category
            </button>
          </form>

          <div className="expenses-category-list">
            {categories.map((category) => (
              <div className="expenses-category-chip" key={category}>
                <Tags size={14} />
                <span>{category}</span>

                <button
                  type="button"
                  onClick={() => removeCategory(category)}
                  aria-label={`Remove ${category} category`}
                  title="Remove category"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Month selector */}
      <section className="expenses-period-card">
        <div className="expenses-period-copy">
          <div className="expenses-small-icon">
            <CalendarDays size={18} />
          </div>

          <div>
            <h2>Expense overview</h2>
            <p>Choose a period to review your spending.</p>
          </div>
        </div>

        <div className="expenses-period-controls">
          <button
            className="expenses-period-arrow"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
          >
            <ChevronLeft size={19} />
          </button>

          <label className="expenses-period-select">
            <span className="sr-only">Month</span>
            <select
              value={month}
              onChange={(event) => setMonth(Number(event.target.value))}
            >
              {MONTHS.map((name, index) => (
                <option value={index} key={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label className="expenses-period-select year">
            <span className="sr-only">Year</span>
            <select
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
            >
              {yearOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <button
            className="expenses-period-arrow"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
          >
            <ChevronRight size={19} />
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="expenses-tabs" role="tablist" aria-label="Expense views">
        <button
          className={`expenses-tab ${activeTab === "expenses" ? "active" : ""}`}
          onClick={() => setActiveTab("expenses")}
          role="tab"
          aria-selected={activeTab === "expenses"}
        >
          <ReceiptText size={16} />
          Expenses
        </button>

        <button
          className={`expenses-tab ${activeTab === "analysis" ? "active" : ""}`}
          onClick={() => setActiveTab("analysis")}
          role="tab"
          aria-selected={activeTab === "analysis"}
        >
          <ChartNoAxesCombined size={16} />
          Analysis
        </button>
      </div>

      {activeTab === "expenses" ? (
        <>
          {/* Search and filters */}
          <section className="expenses-records-card">
            <div className="expenses-records-header">
              <div>
                <h2>Expense records</h2>
                <p>Search and manage your spending entries.</p>
              </div>

              <span className="expenses-record-count">
                {filteredRows.length} records
              </span>
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
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </label>

              <button
                className={`biz-btn ${showFilters ? "primary" : ""}`}
                onClick={() => setShowFilters((value) => !value)}
              >
                <Filter size={16} />
                Filters
              </button>

              <button
                className="biz-btn primary"
                onClick={() => {
                  setFormError("");
                  setShowForm(true);
                }}
              >
                <Plus size={16} />
                Add new
              </button>
            </div>

            {showFilters && (
              <div className="expenses-filter-panel">
                <label>
                  <span>Category</span>
                  <select
                    className="biz-select"
                    value={categoryFilter}
                    onChange={(event) =>
                      setCategoryFilter(event.target.value)
                    }
                  >
                    <option>All categories</option>
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Payment mode</span>
                  <select
                    className="biz-select"
                    value={modeFilter}
                    onChange={(event) => setModeFilter(event.target.value)}
                  >
                    <option>All modes</option>
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                    <option>Other</option>
                  </select>
                </label>

                <button className="expenses-clear-filters" onClick={clearFilters}>
                  Clear all
                </button>
              </div>
            )}

            <div className="expenses-table-wrap">
              <DataTable
                columns={columns}
                rows={filteredRows}
                emptyText="No expense records for this period"
              />
            </div>

            <div className="expenses-table-footer">
              <span>
                Showing <strong>{filteredRows.length}</strong> of{" "}
                <strong>{monthRows.length}</strong> expenses in this period
              </span>

              <span>
                Displayed total: <strong>{formatCurrency(visibleTotal)}</strong>
              </span>
            </div>
          </section>
        </>
      ) : (
        /* Analysis */
        <section className="expenses-analysis-card">
          <div className="expenses-records-header">
            <div>
              <h2>Expense analysis</h2>
              <p>
                A category-wise summary of recorded expenses for{" "}
                {MONTHS[month]} {year}.
              </p>
            </div>
          </div>

          {monthRows.length === 0 ? (
            <div className="expenses-analysis-empty">
              <div className="expenses-stat-icon purple">
                <ChartNoAxesCombined size={22} />
              </div>
              <h3>No data to analyze</h3>
              <p>Add expenses for this period to see your category breakdown.</p>
              <button
                className="biz-btn primary"
                onClick={() => setShowForm(true)}
              >
                <Plus size={16} />
                Add expense
              </button>
            </div>
          ) : (
            <div className="expenses-analysis-content">
              {categories
                .map((category) => {
                  const amount = monthRows
                    .filter((row) => row.category === category)
                    .reduce(
                      (sum, row) => sum + (Number(row.amount) || 0),
                      0
                    );

                  return { category, amount };
                })
                .filter((item) => item.amount > 0)
                .sort((a, b) => b.amount - a.amount)
                .map((item) => {
                  const percentage =
                    totalExpenses > 0
                      ? (item.amount / totalExpenses) * 100
                      : 0;

                  return (
                    <div
                      className="expenses-analysis-row"
                      key={item.category}
                    >
                      <div className="expenses-analysis-row-top">
                        <span>{item.category}</span>
                        <strong>{formatCurrency(item.amount)}</strong>
                      </div>

                      <div
                        className="expenses-progress-track"
                        role="progressbar"
                        aria-label={`${item.category} share of expenses`}
                        aria-valuenow={Math.round(percentage)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="expenses-progress-fill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <span className="expenses-analysis-percent">
                        {percentage.toFixed(1)}% of total
                      </span>
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

      {/* Add expense modal */}
      {showForm && (
        <div
          className="expenses-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <section
            className="expenses-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="expenses-modal-title"
          >
            <div className="expenses-modal-header">
              <div>
                <div className="expenses-modal-icon">
                  <FileSpreadsheet size={20} />
                </div>
                <h2 id="expenses-modal-title">Add new expense</h2>
                <p>Enter the details for this expense record.</p>
              </div>

              <button
                className="expenses-icon-button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={saveExpense}>
              <div className="expenses-form-grid">
                <label>
                  Expense name <span>*</span>
                  <input
                    className="biz-input"
                    name="name"
                    value={form.name}
                    onChange={updateForm}
                    placeholder="e.g. Printer paper"
                    required
                    autoFocus
                  />
                </label>

                <label>
                  Amount (₹) <span>*</span>
                  <input
                    className="biz-input"
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={updateForm}
                    placeholder="e.g. 750"
                    required
                  />
                </label>

                <label>
                  Spent on <span>*</span>
                  <input
                    className="biz-input"
                    name="spent"
                    type="date"
                    value={form.spent}
                    onChange={updateForm}
                    required
                  />
                </label>

                <label>
                  Category
                  <select
                    className="biz-select"
                    name="category"
                    value={form.category}
                    onChange={updateForm}
                  >
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Payment mode
                  <select
                    className="biz-select"
                    name="mode"
                    value={form.mode}
                    onChange={updateForm}
                  >
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  Added by
                  <input
                    className="biz-input"
                    name="by"
                    value={form.by}
                    onChange={updateForm}
                    placeholder="Person's name"
                  />
                </label>

                <label className="expenses-notes-field">
                  Notes
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={updateForm}
                    placeholder="Optional details about this expense"
                    rows={3}
                  />
                </label>
              </div>

              {formError && (
                <p className="expenses-form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="expenses-modal-actions">
                <button
                  type="button"
                  className="biz-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="biz-btn primary">
                  <Plus size={16} />
                  Save expense
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
