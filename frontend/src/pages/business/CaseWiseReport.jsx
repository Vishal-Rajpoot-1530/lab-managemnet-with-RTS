
// import { useMemo, useState } from "react";
// import {
//   Activity,
//   Scan,
//   ScanLine,
//   FlaskConical,
//   HeartPulse,
//   Brain,
//   Stethoscope,
//   CalendarDays,
//   Building2,
//   Search,
//   FileText,
//   Check,
//   CheckCheck,
//   RotateCcw,
//   ChevronDown,
//   CircleAlert,
//   Sparkles,
//   ClipboardList,
//   X,
// } from "lucide-react";

// import "./CaseWiseReport.css";

// const types = [
//   { name: "LabCase", label: "Laboratory", icon: FlaskConical },
//   { name: "UsgCase", label: "Ultrasound (USG)", icon: Scan },
//   { name: "DigitalXrayCase", label: "Digital X-ray", icon: ScanLine },
//   { name: "XrayCase", label: "X-ray", icon: ScanLine },
//   { name: "OutsourceLabCase", label: "Outsource Lab", icon: Building2 },
//   { name: "EcgCase", label: "ECG", icon: Activity },
//   { name: "CtScanCase", label: "CT Scan", icon: Scan },
//   { name: "MriCase", label: "MRI Scan", icon: Brain },
//   { name: "EpsCase", label: "EPS", icon: Activity },
//   { name: "OpgCase", label: "OPG", icon: Scan },
//   { name: "CardiologyCase", label: "Cardiology", icon: HeartPulse },
//   { name: "EegCase", label: "EEG", icon: Brain },
//   { name: "MammographyCase", label: "Mammography", icon: Stethoscope },
// ];

// const initialSelected = ["LabCase", "OutsourceLabCase"];

// export default function CaseWiseReport() {
//   const [selected, setSelected] = useState(initialSelected);
//   const [excludeCancelled, setExcludeCancelled] = useState(true);
//   const [centre, setCentre] = useState("Main");
//   const [reportDate, setReportDate] = useState("2026-09-21");
//   const [search, setSearch] = useState("");
//   const [generated, setGenerated] = useState(false);

//   const filteredTypes = useMemo(
//     () =>
//       types.filter(
//         (type) =>
//           type.label.toLowerCase().includes(search.toLowerCase()) ||
//           type.name.toLowerCase().includes(search.toLowerCase())
//       ),
//     [search]
//   );

//   const toggle = (name) => {
//     setSelected((current) =>
//       current.includes(name)
//         ? current.filter((item) => item !== name)
//         : [...current, name]
//     );
//     setGenerated(false);
//   };

//   const selectAll = () => {
//     const visibleNames = filteredTypes.map((type) => type.name);
//     const allVisibleSelected = visibleNames.every((name) =>
//       selected.includes(name)
//     );

//     setSelected((current) =>
//       allVisibleSelected
//         ? current.filter((name) => !visibleNames.includes(name))
//         : [...new Set([...current, ...visibleNames])]
//     );
//     setGenerated(false);
//   };

//   const resetFilters = () => {
//     setSelected(initialSelected);
//     setExcludeCancelled(true);
//     setCentre("Main");
//     setReportDate("2026-09-21");
//     setSearch("");
//     setGenerated(false);
//   };

//   const handleGenerate = () => {
//     if (selected.length === 0) {
//       window.alert("Please select at least one case type.");
//       return;
//     }

//     setGenerated(true);
//   };

//   const formattedDate = reportDate
//     ? new Date(`${reportDate}T00:00:00`).toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       })
//     : "Not selected";

//   return (
//     <div className="cwr-page">
//       <div className="cwr-container">
//         {/* Page heading */}
//         <header className="cwr-page-header">
//           <div className="cwr-heading-icon">
//             <ClipboardList size={25} />
//           </div>

//           <div className="cwr-heading-copy">
//             <div className="cwr-breadcrumb">
//               Reports <span>/</span> Business Reports
//             </div>
//             <h1>Case Wise Report</h1>
//             <p>
//               Configure your filters to prepare a case-wise business report.
//             </p>
//           </div>

//           <div className="cwr-header-badge">
//             <Sparkles size={15} />
//             Report Center
//           </div>
//         </header>

//         {/* Main report card */}
//         <section className="cwr-card">
//           <div className="cwr-card-header">
//             <div className="cwr-card-title-group">
//               <div className="cwr-section-icon">
//                 <FileText size={19} />
//               </div>
//               <div>
//                 <h2>Report configuration</h2>
//                 <p>Choose your reporting preferences below.</p>
//               </div>
//             </div>

//             <span className="cwr-required-note">
//               <span>*</span> Required fields
//             </span>
//           </div>

//           <div className="cwr-card-content">
//             {/* Cancelled cases */}
//             <div className="cwr-info-banner">
//               <div className="cwr-info-symbol">
//                 <CircleAlert size={19} />
//               </div>

//               <div className="cwr-info-copy">
//                 <strong>Report preferences</strong>
//                 <span>
//                   Choose whether cancelled cases should be excluded.
//                 </span>
//               </div>

//               <label className="cwr-switch">
//                 <input
//                   type="checkbox"
//                   checked={excludeCancelled}
//                   onChange={(event) => {
//                     setExcludeCancelled(event.target.checked);
//                     setGenerated(false);
//                   }}
//                 />
//                 <span className="cwr-switch-track" />
//               </label>

//               <span className="cwr-switch-label">
//                 {excludeCancelled ? "Exclude cancelled" : "Include cancelled"}
//               </span>
//             </div>

//             {/* Form fields */}
//             <div className="cwr-form-grid">
//               <div className="cwr-field">
//                 <label htmlFor="cwr-centre">
//                   Collection centre <span>*</span>
//                 </label>

//                 <div className="cwr-input-wrap">
//                   <Building2 size={17} className="cwr-input-icon" />

//                   <select
//                     id="cwr-centre"
//                     value={centre}
//                     onChange={(event) => {
//                       setCentre(event.target.value);
//                       setGenerated(false);
//                     }}
//                   >
//                     <option value="Main">Main</option>
//                   </select>

//                   <ChevronDown size={16} className="cwr-select-chevron" />
//                 </div>

//                 <small>Select the centre for this report.</small>
//               </div>

//               <div className="cwr-field">
//                 <label htmlFor="cwr-date">
//                   Report date <span>*</span>
//                 </label>

//                 <div className="cwr-input-wrap">
//                   <CalendarDays size={17} className="cwr-input-icon" />

//                   <input
//                     id="cwr-date"
//                     type="date"
//                     value={reportDate}
//                     onChange={(event) => {
//                       setReportDate(event.target.value);
//                       setGenerated(false);
//                     }}
//                   />
//                 </div>

//                 <small>Choose the date for your report.</small>
//               </div>
//             </div>

//             {/* Case types */}
//             <div className="cwr-types-section">
//               <div className="cwr-types-header">
//                 <div>
//                   <h3>
//                     Case types <span>*</span>
//                   </h3>
//                   <p>Select the categories to include in your report.</p>
//                 </div>

//                 <div className="cwr-selected-count">
//                   <Check size={15} />
//                   {selected.length} of {types.length} selected
//                 </div>
//               </div>

//               <div className="cwr-types-toolbar">
//                 <div className="cwr-search">
//                   <Search size={17} />
//                   <input
//                     type="text"
//                     placeholder="Search case types..."
//                     value={search}
//                     onChange={(event) => setSearch(event.target.value)}
//                     aria-label="Search case types"
//                   />

//                   {search && (
//                     <button
//                       type="button"
//                       className="cwr-clear-search"
//                       onClick={() => setSearch("")}
//                       aria-label="Clear search"
//                     >
//                       <X size={15} />
//                     </button>
//                   )}
//                 </div>

//                 <button
//                   type="button"
//                   className="cwr-select-all"
//                   onClick={selectAll}
//                 >
//                   <CheckCheck size={16} />
//                   {filteredTypes.length > 0 &&
//                   filteredTypes.every((type) =>
//                     selected.includes(type.name)
//                   )
//                     ? "Deselect visible"
//                     : "Select visible"}
//                 </button>
//               </div>

//               <div className="cwr-types-grid">
//                 {filteredTypes.map(({ name, label, icon: Icon }) => {
//                   const isSelected = selected.includes(name);

//                   return (
//                     <label
//                       key={name}
//                       className={`cwr-type-option ${
//                         isSelected ? "is-selected" : ""
//                       }`}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={isSelected}
//                         onChange={() => toggle(name)}
//                       />

//                       <span className="cwr-type-icon">
//                         <Icon size={20} strokeWidth={1.8} />
//                       </span>

//                       <span className="cwr-type-name">{label}</span>

//                       <span className="cwr-type-check">
//                         {isSelected && <Check size={14} strokeWidth={3} />}
//                       </span>
//                     </label>
//                   );
//                 })}

//                 {filteredTypes.length === 0 && (
//                   <div className="cwr-empty-search">
//                     <Search size={23} />
//                     <strong>No case types found</strong>
//                     <span>Try another search term.</span>
//                   </div>
//                 )}
//               </div>

//               <div className="cwr-types-summary">
//                 <span>
//                   <span className="cwr-summary-dot" />
//                   {selected.length} case {selected.length === 1 ? "type" : "types"}{" "}
//                   selected for reporting
//                 </span>

//                 <button
//                   type="button"
//                   className="cwr-clear-selection"
//                   onClick={() => {
//                     setSelected([]);
//                     setGenerated(false);
//                   }}
//                   disabled={selected.length === 0}
//                 >
//                   Clear selection
//                 </button>
//               </div>
//             </div>

//             {/* Generated report preview */}
//             {generated && (
//               <div className="cwr-success-panel" role="status">
//                 <div className="cwr-success-icon">
//                   <Check size={19} />
//                 </div>

//                 <div>
//                   <strong>Report configuration ready</strong>
//                   <p>
//                     {selected.length} case types · {centre} centre ·{" "}
//                     {formattedDate}
//                     {excludeCancelled
//                       ? " · Cancelled cases excluded"
//                       : " · Cancelled cases included"}
//                   </p>
//                   <small>
//                     The filters are ready. Connect your report API to retrieve
//                     and export the actual report data.
//                   </small>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Footer actions */}
//           <footer className="cwr-card-footer">
//             <div className="cwr-footer-hint">
//               <span className="cwr-footer-dot" />
//               {selected.length === 0
//                 ? "Select at least one case type to continue."
//                 : `${selected.length} case types ready to configure`}
//             </div>

//             <div className="cwr-footer-actions">
//               <button
//                 type="button"
//                 className="cwr-reset-btn"
//                 onClick={resetFilters}
//               >
//                 <RotateCcw size={16} />
//                 Reset filters
//               </button>

//               <button
//                 type="button"
//                 className="cwr-generate-btn"
//                 onClick={handleGenerate}
//                 disabled={selected.length === 0 || !reportDate}
//               >
//                 <FileText size={17} />
//                 Generate report
//               </button>
//             </div>
//           </footer>
//         </section>

//         <div className="cwr-bottom-note">
//           <Activity size={15} />
//           <span>
//             Report results depend on the cases recorded in your laboratory
//             system.
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }





import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Scan,
  ScanLine,
  FlaskConical,
  HeartPulse,
  Brain,
  Stethoscope,
  CalendarDays,
  Building2,
  Search,
  FileText,
  Check,
  CheckCheck,
  RotateCcw,
  ChevronDown,
  CircleAlert,
  Sparkles,
  ClipboardList,
  Download,
  X,
} from "lucide-react";

import { businessApiService } from "../../api";
import "./CaseWiseReport.css";

const types = [
  { name: "LabCase", label: "Laboratory", icon: FlaskConical },
  { name: "UsgCase", label: "Ultrasound (USG)", icon: Scan },
  { name: "DigitalXrayCase", label: "Digital X-ray", icon: ScanLine },
  { name: "XrayCase", label: "X-ray", icon: ScanLine },
  { name: "OutsourceLabCase", label: "Outsource Lab", icon: Building2 },
  { name: "EcgCase", label: "ECG", icon: Activity },
  { name: "CtScanCase", label: "CT Scan", icon: Scan },
  { name: "MriCase", label: "MRI Scan", icon: Brain },
  { name: "EpsCase", label: "EPS", icon: Activity },
  { name: "OpgCase", label: "OPG", icon: Scan },
  { name: "CardiologyCase", label: "Cardiology", icon: HeartPulse },
  { name: "EegCase", label: "EEG", icon: Brain },
  { name: "MammographyCase", label: "Mammography", icon: Stethoscope },
];

const initialSelected = ["LabCase", "OutsourceLabCase"];

const todayInput = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const money = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number(value) || 0);

const csvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const cell = { padding: "10px 14px", textAlign: "left", borderBottom: "1px solid rgba(128,128,128,.2)", fontSize: 14 };

export default function CaseWiseReport() {
  const [selected, setSelected] = useState(initialSelected);
  const [excludeCancelled, setExcludeCancelled] = useState(true);
  const [centres, setCentres] = useState(["Main"]);
  const [centre, setCentre] = useState("Main");
  const [reportDate, setReportDate] = useState(todayInput());
  const [search, setSearch] = useState("");

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Collection centres for the dropdown.
  useEffect(() => {
    businessApiService
      .caseWiseOptions()
      .then((options) => {
        if (Array.isArray(options?.centres) && options.centres.length) setCentres(options.centres);
      })
      .catch(() => {}); // the dropdown keeps "Main"
  }, []);

  const filteredTypes = useMemo(
    () =>
      types.filter(
        (type) =>
          type.label.toLowerCase().includes(search.toLowerCase()) ||
          type.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  // Any change to the settings makes the shown report out of date, so hide it.
  const invalidate = () => {
    setReport(null);
    setError("");
  };

  const toggle = (name) => {
    setSelected((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name]
    );
    invalidate();
  };

  const selectAll = () => {
    const visibleNames = filteredTypes.map((type) => type.name);
    const allVisibleSelected = visibleNames.every((name) => selected.includes(name));

    setSelected((current) =>
      allVisibleSelected
        ? current.filter((name) => !visibleNames.includes(name))
        : [...new Set([...current, ...visibleNames])]
    );
    invalidate();
  };

  const resetFilters = () => {
    setSelected(initialSelected);
    setExcludeCancelled(true);
    setCentre("Main");
    setReportDate(todayInput());
    setSearch("");
    invalidate();
  };

  async function handleGenerate() {
    if (selected.length === 0) return setError("Please select at least one case type.");
    if (!reportDate) return setError("Please choose the report date.");

    setLoading(true);
    setError("");
    setReport(null);

    try {
      setReport(
        await businessApiService.caseWiseReport({ date: reportDate, centre, types: selected, excludeCancelled })
      );
    } catch (err) {
      if (err.status === 401) return window.location.assign("/login");
      setError(err.message || "Unable to generate the report. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function exportCsv() {
    if (!report) return;

    const header = ["Case type", "Reg. no.", "Date", "Patient", "Tests", "Billed amount (INR)", "Outsource cost (INR)"];
    const lines = report.groups.flatMap((group) =>
      group.rows.map((row) => [group.label, row.regNo, row.date, row.patient, row.tests, row.amount, row.cost])
    );

    const csv = [header, ...lines].map((line) => line.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `case-wise-report-${report.date}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const formattedDate = reportDate
    ? new Date(`${reportDate}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not selected";

  return (
    <div className="cwr-page">
      <div className="cwr-container">
        {/* Page heading */}
        <header className="cwr-page-header">
          <div className="cwr-heading-icon">
            <ClipboardList size={25} />
          </div>

          <div className="cwr-heading-copy">
            <div className="cwr-breadcrumb">
              Reports <span>/</span> Business Reports
            </div>
            <h1>Case Wise Report</h1>
            <p>Configure your filters to prepare a case-wise business report.</p>
          </div>

          <div className="cwr-header-badge">
            <Sparkles size={15} />
            Report Center
          </div>
        </header>

        {/* Main report card */}
        <section className="cwr-card">
          <div className="cwr-card-header">
            <div className="cwr-card-title-group">
              <div className="cwr-section-icon">
                <FileText size={19} />
              </div>
              <div>
                <h2>Report configuration</h2>
                <p>Choose your reporting preferences below.</p>
              </div>
            </div>

            <span className="cwr-required-note">
              <span>*</span> Required fields
            </span>
          </div>

          <div className="cwr-card-content">
            {/* Cancelled cases */}
            <div className="cwr-info-banner">
              <div className="cwr-info-symbol">
                <CircleAlert size={19} />
              </div>

              <div className="cwr-info-copy">
                <strong>Report preferences</strong>
                <span>Choose whether cancelled cases should be excluded.</span>
              </div>

              <label className="cwr-switch">
                <input
                  type="checkbox"
                  checked={excludeCancelled}
                  onChange={(event) => {
                    setExcludeCancelled(event.target.checked);
                    invalidate();
                  }}
                />
                <span className="cwr-switch-track" />
              </label>

              <span className="cwr-switch-label">
                {excludeCancelled ? "Exclude cancelled" : "Include cancelled"}
              </span>
            </div>

            {/* Form fields */}
            <div className="cwr-form-grid">
              <div className="cwr-field">
                <label htmlFor="cwr-centre">
                  Collection centre <span>*</span>
                </label>

                <div className="cwr-input-wrap">
                  <Building2 size={17} className="cwr-input-icon" />

                  <select
                    id="cwr-centre"
                    value={centre}
                    onChange={(event) => {
                      setCentre(event.target.value);
                      invalidate();
                    }}
                  >
                    {centres.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown size={16} className="cwr-select-chevron" />
                </div>

                <small>Select the centre for this report.</small>
              </div>

              <div className="cwr-field">
                <label htmlFor="cwr-date">
                  Report date <span>*</span>
                </label>

                <div className="cwr-input-wrap">
                  <CalendarDays size={17} className="cwr-input-icon" />

                  <input
                    id="cwr-date"
                    type="date"
                    value={reportDate}
                    onChange={(event) => {
                      setReportDate(event.target.value);
                      invalidate();
                    }}
                  />
                </div>

                <small>Choose the date for your report.</small>
              </div>
            </div>

            {/* Case types */}
            <div className="cwr-types-section">
              <div className="cwr-types-header">
                <div>
                  <h3>
                    Case types <span>*</span>
                  </h3>
                  <p>Select the categories to include in your report.</p>
                </div>

                <div className="cwr-selected-count">
                  <Check size={15} />
                  {selected.length} of {types.length} selected
                </div>
              </div>

              <div className="cwr-types-toolbar">
                <div className="cwr-search">
                  <Search size={17} />
                  <input
                    type="text"
                    placeholder="Search case types..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search case types"
                  />

                  {search && (
                    <button type="button" className="cwr-clear-search" onClick={() => setSearch("")} aria-label="Clear search">
                      <X size={15} />
                    </button>
                  )}
                </div>

                <button type="button" className="cwr-select-all" onClick={selectAll}>
                  <CheckCheck size={16} />
                  {filteredTypes.length > 0 && filteredTypes.every((type) => selected.includes(type.name))
                    ? "Deselect visible"
                    : "Select visible"}
                </button>
              </div>

              <div className="cwr-types-grid">
                {filteredTypes.map(({ name, label, icon: Icon }) => {
                  const isSelected = selected.includes(name);

                  return (
                    <label key={name} className={`cwr-type-option ${isSelected ? "is-selected" : ""}`}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggle(name)} />

                      <span className="cwr-type-icon">
                        <Icon size={20} strokeWidth={1.8} />
                      </span>

                      <span className="cwr-type-name">{label}</span>

                      <span className="cwr-type-check">{isSelected && <Check size={14} strokeWidth={3} />}</span>
                    </label>
                  );
                })}

                {filteredTypes.length === 0 && (
                  <div className="cwr-empty-search">
                    <Search size={23} />
                    <strong>No case types found</strong>
                    <span>Try another search term.</span>
                  </div>
                )}
              </div>

              <div className="cwr-types-summary">
                <span>
                  <span className="cwr-summary-dot" />
                  {selected.length} case {selected.length === 1 ? "type" : "types"} selected for reporting
                </span>

                <button
                  type="button"
                  className="cwr-clear-selection"
                  onClick={() => {
                    setSelected([]);
                    invalidate();
                  }}
                  disabled={selected.length === 0}
                >
                  Clear selection
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" style={{ color: "#b42318", margin: "16px 0 0" }}>
                {error}
              </p>
            )}
          </div>

          {/* Footer actions */}
          <footer className="cwr-card-footer">
            <div className="cwr-footer-hint">
              <span className="cwr-footer-dot" />
              {selected.length === 0
                ? "Select at least one case type to continue."
                : `${selected.length} case types · ${centre} centre · ${formattedDate}`}
            </div>

            <div className="cwr-footer-actions">
              <button type="button" className="cwr-reset-btn" onClick={resetFilters}>
                <RotateCcw size={16} />
                Reset filters
              </button>

              <button
                type="button"
                className="cwr-generate-btn"
                onClick={handleGenerate}
                disabled={selected.length === 0 || !reportDate || loading}
              >
                <FileText size={17} />
                {loading ? "Generating…" : "Generate report"}
              </button>
            </div>
          </footer>
        </section>

        {/* Generated report */}
        {report && (
          <section className="cwr-card" style={{ marginTop: 24 }} aria-live="polite">
            <div className="cwr-card-header">
              <div className="cwr-card-title-group">
                <div className="cwr-section-icon">
                  <ClipboardList size={19} />
                </div>
                <div>
                  <h2>Report results</h2>
                  <p>
                    {formattedDate} · {report.centre} centre ·{" "}
                    {report.excludeCancelled ? "Cancelled cases excluded" : "Cancelled cases included"}
                  </p>
                </div>
              </div>

              <button type="button" className="cwr-reset-btn" onClick={exportCsv}>
                <Download size={16} />
                Export CSV
              </button>
            </div>

            <div className="cwr-card-content">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 16, marginBottom: 24 }}>
                {[
                  ["Total cases", report.totals.cases],
                  ["Tests / studies", report.totals.tests],
                  ["Billed amount", money(report.totals.amount)],
                  ["Outsource cost", money(report.totals.cost)],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: 16, border: "1px solid rgba(128,128,128,.25)", borderRadius: 12 }}>
                    <div style={{ fontSize: 13, opacity: 0.7 }}>{label}</div>
                    <strong style={{ fontSize: 22 }}>{value}</strong>
                  </div>
                ))}
              </div>

              {report.groups.map((group) => (
                <details key={group.type} open={group.caseCount > 0} style={{ marginBottom: 14, border: "1px solid rgba(128,128,128,.25)", borderRadius: 12 }}>
                  <summary style={{ padding: "14px 16px", cursor: "pointer", display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "space-between" }}>
                    <strong>{group.label}</strong>
                    <span style={{ opacity: 0.75, fontSize: 14 }}>
                      {group.caseCount} {group.caseCount === 1 ? "case" : "cases"} · {group.testCount} tests · {money(group.amount)}
                      {group.cost > 0 ? ` · cost ${money(group.cost)}` : ""}
                    </span>
                  </summary>

                  {group.rows.length === 0 ? (
                    <p style={{ padding: "0 16px 16px", opacity: 0.7, margin: 0 }}>No cases for this date.</p>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr>
                            {["Reg. no.", "Patient", "Tests", "Amount"].map((h) => (
                              <th key={h} style={{ ...cell, fontSize: 12, opacity: 0.7 }}>{h.toUpperCase()}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {group.rows.map((row) => (
                            <tr key={`${group.type}-${row.billId}`}>
                              <td style={cell}>{row.regNo}</td>
                              <td style={cell}>{row.patient}</td>
                              <td style={cell}>{row.tests}</td>
                              <td style={cell}>{money(row.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="cwr-bottom-note">
          <Activity size={15} />
          <span>Report results depend on the cases recorded in your laboratory system.</span>
        </div>
      </div>
    </div>
  );
}