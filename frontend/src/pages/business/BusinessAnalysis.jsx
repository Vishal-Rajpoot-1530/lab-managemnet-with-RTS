// import { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   Activity,
//   Banknote,
//   CreditCard,
//   RefreshCw,
//   ShieldCheck,
//   TrendingUp,
//   Wallet,
//   CalendarDays,
//   CircleDollarSign,
// } from "lucide-react";
// import {
//   Area,
//   AreaChart,
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   Legend,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// import { businessApiService } from "../../api";
// import { apiArray } from "../../api/core/apiData";

// import "./business-update.css";

// // Sample data for testing the charts.
// // This is fictional data, not real laboratory revenue.
// const DUMMY_BUSINESS_DATA = [
//   { id: 1, day: "Oct 01", upi: 12500, cash: 6200, card: 4800, insurance: 8500 },
//   { id: 2, day: "Oct 02", upi: 14800, cash: 7100, card: 5200, insurance: 9200 },
//   { id: 3, day: "Oct 03", upi: 11200, cash: 5800, card: 4300, insurance: 7800 },
//   { id: 4, day: "Oct 04", upi: 18600, cash: 8500, card: 6900, insurance: 11500 },
//   { id: 5, day: "Oct 05", upi: 16200, cash: 7600, card: 6100, insurance: 9800 },
//   { id: 6, day: "Oct 06", upi: 21400, cash: 9200, card: 7500, insurance: 12800 },
//   { id: 7, day: "Oct 07", upi: 19800, cash: 8900, card: 7200, insurance: 13400 },
//   { id: 8, day: "Oct 08", upi: 23500, cash: 10500, card: 8100, insurance: 14200 },
//   { id: 9, day: "Oct 09", upi: 17200, cash: 7900, card: 6400, insurance: 10900 },
//   { id: 10, day: "Oct 10", upi: 25800, cash: 11800, card: 9200, insurance: 15600 },
//   { id: 11, day: "Oct 11", upi: 22100, cash: 9600, card: 7800, insurance: 14800 },
//   { id: 12, day: "Oct 12", upi: 28700, cash: 12500, card: 9800, insurance: 17200 },
//   { id: 13, day: "Oct 13", upi: 24600, cash: 11000, card: 8700, insurance: 16100 },
//   { id: 14, day: "Oct 14", upi: 31200, cash: 13900, card: 11200, insurance: 18500 },
// ].map((row) => ({
//   ...row,
//   total: row.upi + row.cash + row.card + row.insurance,
// }));

// const REFRESH_INTERVAL = 30000;

// const PAYMENT_METHODS = [
//   { key: "upi", label: "UPI", color: "#6366f1" },
//   { key: "cash", label: "Cash", color: "#10b981" },
//   { key: "card", label: "Card", color: "#f59e0b" },
//   { key: "insurance", label: "Insurance", color: "#06b6d4" },
// ];

// const numberValue = (value) => {
//   if (typeof value === "number") {
//     return Number.isFinite(value) ? value : 0;
//   }

//   const parsed = Number(String(value ?? "").replace(/[₹,\s]/g, ""));
//   return Number.isFinite(parsed) ? parsed : 0;
// };

// const formatCurrency = (value) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 0,
//   }).format(numberValue(value));

// const formatCompactCurrency = (value) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     notation: "compact",
//     maximumFractionDigits: 1,
//   }).format(numberValue(value));

// function normalizeRows(data) {
//   return data.map((row, index) => {
//     const upi = numberValue(row.upi);
//     const cash = numberValue(row.cash);
//     const card = numberValue(row.card);
//     const insurance = numberValue(row.insurance);

//     const calculatedTotal = upi + cash + card + insurance;
//     const suppliedTotal = numberValue(row.total);

//     return {
//       ...row,
//       id: row.id ?? index,
//       day: String(row.day ?? row.date ?? `Day ${index + 1}`),
//       upi,
//       cash,
//       card,
//       insurance,
//       total:
//         row.total !== undefined &&
//         row.total !== null &&
//         row.total !== ""
//           ? suppliedTotal
//           : calculatedTotal,
//     };
//   });
// }

// function MetricCard({ title, value, subtitle, icon: Icon, accent }) {
//   return (
//     <article className="ba-metric-card">
//       <div className="ba-metric-top">
//         <span className="ba-metric-title">{title}</span>

//         <span
//           className="ba-metric-icon"
//           style={{ "--metric-accent": accent }}
//         >
//           <Icon size={20} />
//         </span>
//       </div>

//       <div className="ba-metric-value">
//         {formatCurrency(value)}
//       </div>

//       <div className="ba-metric-subtitle">
//         <span className="ba-metric-indicator">
//           <Activity size={14} />
//         </span>
//         {subtitle}
//       </div>
//     </article>
//   );
// }

// function ChartTooltip({ active, payload, label }) {
//   if (!active || !payload?.length) return null;

//   return (
//     <div className="ba-tooltip">
//       {label && <p className="ba-tooltip-label">{label}</p>}

//       {payload.map((item) => (
//         <div className="ba-tooltip-row" key={item.dataKey}>
//           <span
//             className="ba-tooltip-dot"
//             style={{ background: item.color || item.fill }}
//           />
//           <span>{item.name || item.dataKey}</span>
//           <strong>{formatCurrency(item.value)}</strong>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default function BusinessAnalysis() {
//   // All React Hooks must be inside the component.
//   const [rows, setRows] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [range, setRange] = useState("all");

//   // FIX: demoMode belongs inside the component.
//   const [demoMode, setDemoMode] = useState(true);

//   const fetchBusinessData = useCallback(
//     async (manual = false) => {
//       if (manual) {
//         setRefreshing(true);
//       }

//       try {
//         if (demoMode) {
//           setRows(normalizeRows(DUMMY_BUSINESS_DATA));
//           setError("");
//           setLastUpdated(new Date());
//           return;
//         }

//         const response = await businessApiService.monthly();
//         const data = normalizeRows(apiArray(response));

//         setRows(data);
//         setError("");
//         setLastUpdated(new Date());
//       } catch (err) {
//         setError(
//           err?.message ||
//             "Unable to load business analysis. Please try again."
//         );
//       } finally {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     },
//     [demoMode]
//   );

//   // Fetch initially and refresh automatically every 30 seconds.
//   useEffect(() => {
//     fetchBusinessData();

//     const timer = setInterval(() => {
//       fetchBusinessData();
//     }, REFRESH_INTERVAL);

//     return () => clearInterval(timer);
//   }, [fetchBusinessData]);

//   const visibleRows = useMemo(() => {
//     if (range === "7") return rows.slice(-7);
//     if (range === "14") return rows.slice(-14);
//     return rows;
//   }, [rows, range]);

//   const summary = useMemo(() => {
//     return visibleRows.reduce(
//       (acc, row) => {
//         acc.upi += row.upi;
//         acc.cash += row.cash;
//         acc.card += row.card;
//         acc.insurance += row.insurance;
//         acc.total += row.total;
//         return acc;
//       },
//       { upi: 0, cash: 0, card: 0, insurance: 0, total: 0 }
//     );
//   }, [visibleRows]);

//   const pieData = useMemo(
//     () =>
//       PAYMENT_METHODS.map((method) => ({
//         name: method.label,
//         value: summary[method.key],
//         color: method.color,
//       })).filter((item) => item.value > 0),
//     [summary]
//   );

//   const averageDailyRevenue = visibleRows.length
//     ? summary.total / visibleRows.length
//     : 0;

//   return (
//     <main className="business-page analysis-page ba-page">
//       <section className="ba-heading">
//         <div>
//           <div className="ba-eyebrow">
//             <span className="ba-live-dot" />
//             BUSINESS INTELLIGENCE
//           </div>

//           <h1>Business Analysis</h1>

//           <p className="ba-heading-description">
//             Track collections, understand payment patterns, and monitor your
//             laboratory's financial performance.
//           </p>
//         </div>

//         <div className="ba-heading-actions">
//           <div className="ba-live-status">
//             <span className="ba-live-dot" />
//             Auto-refresh on
//           </div>

//           <button
//             type="button"
//             className={`ba-demo-toggle ${demoMode ? "active" : ""}`}
//             onClick={() => setDemoMode((current) => !current)}
//           >
//             {demoMode ? "Demo data: ON" : "Demo data: OFF"}
//           </button>

//           <button
//             type="button"
//             className="ba-refresh-button"
//             onClick={() => fetchBusinessData(true)}
//             disabled={loading || refreshing}
//           >
//             <RefreshCw
//               size={16}
//               className={refreshing ? "ba-spin" : ""}
//             />
//             {refreshing ? "Refreshing..." : "Refresh"}
//           </button>
//         </div>
//       </section>

//       <section className="ba-overview-bar">
//         <div className="ba-overview-icon">
//           <CalendarDays size={19} />
//         </div>

//         <div>
//           <strong>Revenue overview</strong>
//           <p>
//             {range === "all"
//               ? "All records returned by your data source"
//               : `Latest ${range} records returned by your data source`}
//           </p>
//         </div>

//         <div className="ba-range-control">
//           {[
//             { label: "7 records", value: "7" },
//             { label: "14 records", value: "14" },
//             { label: "All", value: "all" },
//           ].map((item) => (
//             <button
//               type="button"
//               key={item.value}
//               className={range === item.value ? "active" : ""}
//               onClick={() => setRange(item.value)}
//             >
//               {item.label}
//             </button>
//           ))}
//         </div>
//       </section>

//       {error && (
//         <div className="ba-error" role="alert">
//           <span>{error}</span>
//           <button type="button" onClick={() => fetchBusinessData(true)}>
//             Retry
//           </button>
//         </div>
//       )}

//       {loading ? (
//         <section className="ba-loading">
//           <span className="ba-loading-spinner" />
//           <p>Loading your business analytics...</p>
//         </section>
//       ) : (
//         <>
//           <section className="ba-metrics-grid">
//             <MetricCard
//               title="Total collections"
//               value={summary.total}
//               subtitle={`${visibleRows.length} records analysed`}
//               icon={CircleDollarSign}
//               accent="#6366f1"
//             />

//             <MetricCard
//               title="UPI collections"
//               value={summary.upi}
//               subtitle="Digital UPI payments"
//               icon={Wallet}
//               accent="#10b981"
//             />

//             <MetricCard
//               title="Cash collections"
//               value={summary.cash}
//               subtitle="Cash payments"
//               icon={Banknote}
//               accent="#f59e0b"
//             />

//             <MetricCard
//               title="Insurance collections"
//               value={summary.insurance}
//               subtitle="Insurance payments"
//               icon={ShieldCheck}
//               accent="#06b6d4"
//             />
//           </section>

//           <section className="ba-primary-grid">
//             <article className="ba-panel ba-revenue-panel">
//               <div className="ba-panel-header">
//                 <div>
//                   <span className="ba-panel-kicker">
//                     REVENUE OVERVIEW
//                   </span>
//                   <h2>Collection trends</h2>
//                   <p>
//                     Daily total collections over the selected records
//                   </p>
//                 </div>

//                 <span className="ba-panel-header-icon">
//                   <TrendingUp size={19} />
//                 </span>
//               </div>

//               <div className="ba-chart-summary">
//                 <div>
//                   <span>Total collections</span>
//                   <strong>{formatCurrency(summary.total)}</strong>
//                 </div>

//                 <div>
//                   <span>Average per record</span>
//                   <strong>{formatCurrency(averageDailyRevenue)}</strong>
//                 </div>
//               </div>

//               <div className="ba-chart ba-area-chart">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart
//                     data={visibleRows}
//                     margin={{ top: 10, right: 12, left: 4, bottom: 0 }}
//                   >
//                     <defs>
//                       <linearGradient
//                         id="baRevenueGradient"
//                         x1="0"
//                         y1="0"
//                         x2="0"
//                         y2="1"
//                       >
//                         <stop
//                           offset="0%"
//                           stopColor="#6366f1"
//                           stopOpacity={0.26}
//                         />
//                         <stop
//                           offset="95%"
//                           stopColor="#6366f1"
//                           stopOpacity={0.01}
//                         />
//                       </linearGradient>
//                     </defs>

//                     <CartesianGrid
//                       stroke="#e9edf5"
//                       strokeDasharray="4 5"
//                       vertical={false}
//                     />

//                     <XAxis
//                       dataKey="day"
//                       tick={{ fontSize: 11, fill: "#8b95a7" }}
//                       axisLine={false}
//                       tickLine={false}
//                       tickMargin={12}
//                       minTickGap={22}
//                     />

//                     <YAxis
//                       tickFormatter={formatCompactCurrency}
//                       tick={{ fontSize: 11, fill: "#8b95a7" }}
//                       axisLine={false}
//                       tickLine={false}
//                       width={76}
//                     />

//                     <Tooltip content={<ChartTooltip />} />

//                     <Area
//                       type="monotone"
//                       dataKey="total"
//                       name="Total collections"
//                       stroke="#6366f1"
//                       strokeWidth={3}
//                       fill="url(#baRevenueGradient)"
//                       activeDot={{ r: 5, strokeWidth: 0 }}
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//             </article>

//             <article className="ba-panel ba-payment-panel">
//               <div className="ba-panel-header">
//                 <div>
//                   <span className="ba-panel-kicker">
//                     PAYMENT BREAKDOWN
//                   </span>
//                   <h2>Collection channels</h2>
//                   <p>How revenue is distributed</p>
//                 </div>
//               </div>

//               {pieData.length ? (
//                 <>
//                   <div className="ba-chart ba-donut-chart">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={pieData}
//                           dataKey="value"
//                           nameKey="name"
//                           cx="50%"
//                           cy="50%"
//                           innerRadius="62%"
//                           outerRadius="83%"
//                           paddingAngle={4}
//                           stroke="none"
//                         >
//                           {pieData.map((entry) => (
//                             <Cell
//                               key={entry.name}
//                               fill={entry.color}
//                             />
//                           ))}
//                         </Pie>

//                         <Tooltip content={<ChartTooltip />} />
//                       </PieChart>
//                     </ResponsiveContainer>

//                     <div className="ba-donut-center">
//                       <span>Total revenue</span>
//                       <strong>
//                         {formatCompactCurrency(summary.total)}
//                       </strong>
//                     </div>
//                   </div>

//                   <div className="ba-payment-legend">
//                     {pieData.map((item) => {
//                       const percentage = summary.total
//                         ? (item.value / summary.total) * 100
//                         : 0;

//                       return (
//                         <div
//                           className="ba-payment-item"
//                           key={item.name}
//                         >
//                           <div className="ba-payment-name">
//                             <span
//                               className="ba-legend-dot"
//                               style={{ background: item.color }}
//                             />
//                             <span>{item.name}</span>
//                           </div>

//                           <div className="ba-payment-value">
//                             <strong>
//                               {formatCurrency(item.value)}
//                             </strong>
//                             <span>{percentage.toFixed(1)}%</span>
//                           </div>

//                           <div className="ba-payment-track">
//                             <span
//                               style={{
//                                 width: `${percentage}%`,
//                                 background: item.color,
//                               }}
//                             />
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </>
//               ) : (
//                 <div className="ba-empty-chart">
//                   <Wallet size={32} />
//                   <strong>No collection data yet</strong>
//                   <p>
//                     Payment distribution will appear when data is available.
//                   </p>
//                 </div>
//               )}
//             </article>
//           </section>

//           <section className="ba-panel ba-comparison-panel">
//             <div className="ba-panel-header">
//               <div>
//                 <span className="ba-panel-kicker">
//                   PAYMENT PERFORMANCE
//                 </span>
//                 <h2>Daily payment comparison</h2>
//                 <p>
//                   Compare each collection method across records
//                 </p>
//               </div>

//               <span className="ba-panel-header-icon">
//                 <CreditCard size={19} />
//               </span>
//             </div>

//             <div className="ba-chart ba-bar-chart">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={visibleRows}
//                   margin={{ top: 12, right: 12, left: 4, bottom: 0 }}
//                   barGap={4}
//                 >
//                   <CartesianGrid
//                     stroke="#e9edf5"
//                     strokeDasharray="4 5"
//                     vertical={false}
//                   />

//                   <XAxis
//                     dataKey="day"
//                     tick={{ fontSize: 11, fill: "#8b95a7" }}
//                     axisLine={false}
//                     tickLine={false}
//                     tickMargin={12}
//                     minTickGap={22}
//                   />

//                   <YAxis
//                     tickFormatter={formatCompactCurrency}
//                     tick={{ fontSize: 11, fill: "#8b95a7" }}
//                     axisLine={false}
//                     tickLine={false}
//                     width={76}
//                   />

//                   <Tooltip content={<ChartTooltip />} />

//                   <Legend
//                     verticalAlign="top"
//                     align="right"
//                     iconType="circle"
//                     wrapperStyle={{
//                       fontSize: 12,
//                       paddingBottom: 20,
//                     }}
//                   />

//                   {PAYMENT_METHODS.map((method) => (
//                     <Bar
//                       key={method.key}
//                       dataKey={method.key}
//                       name={method.label}
//                       fill={method.color}
//                       radius={[5, 5, 0, 0]}
//                       maxBarSize={24}
//                     />
//                   ))}
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </section>

//           <section className="ba-panel ba-table-panel">
//             <div className="ba-panel-header">
//               <div>
//                 <span className="ba-panel-kicker">
//                   DETAILED REPORT
//                 </span>
//                 <h2>Collection records</h2>
//                 <p>
//                   Payment-wise revenue details from your data source
//                 </p>
//               </div>
//             </div>

//             <div className="analysis-table-wrap ba-table-wrap">
//               <table className="analysis-table ba-table">
//                 <thead>
//                   <tr>
//                     <th>DAY</th>
//                     <th>UPI</th>
//                     <th>CASH</th>
//                     <th>CARD</th>
//                     <th>INSURANCE</th>
//                     <th>TOTAL</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {visibleRows.length ? (
//                     [...visibleRows].reverse().map((row, index) => (
//                       <tr key={row.id ?? index}>
//                         <td>
//                           <div className="ba-day-cell">
//                             <span className="ba-day-icon">
//                               <CalendarDays size={15} />
//                             </span>
//                             <strong>{row.day}</strong>
//                           </div>
//                         </td>

//                         <td>{formatCurrency(row.upi)}</td>
//                         <td>{formatCurrency(row.cash)}</td>
//                         <td>{formatCurrency(row.card)}</td>
//                         <td>{formatCurrency(row.insurance)}</td>

//                         <td>
//                           <strong className="ba-total-cell">
//                             {formatCurrency(row.total)}
//                           </strong>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={6} className="ba-table-empty">
//                         No business records are available yet.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>

//                 {visibleRows.length > 0 && (
//                   <tfoot>
//                     <tr>
//                       <th>TOTAL</th>
//                       <th>{formatCurrency(summary.upi)}</th>
//                       <th>{formatCurrency(summary.cash)}</th>
//                       <th>{formatCurrency(summary.card)}</th>
//                       <th>{formatCurrency(summary.insurance)}</th>
//                       <th>{formatCurrency(summary.total)}</th>
//                     </tr>
//                   </tfoot>
//                 )}
//               </table>
//             </div>
//           </section>

//           <footer className="ba-footer">
//             <div>
//               <span className="ba-footer-status">
//                 <span className="ba-live-dot" />
//                 {error
//                   ? "Last successful data retained"
//                   : demoMode
//                     ? "Demo analytics active"
//                     : "Analytics active"}
//               </span>

//               <span>
//                 {lastUpdated
//                   ? `Last synced at ${lastUpdated.toLocaleTimeString("en-IN")}`
//                   : "Waiting for data"}
//               </span>
//             </div>

//             <span>Refresh interval: 30 seconds</span>
//           </footer>
//         </>
//       )}
//     </main>
//   );
// }




import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Banknote,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Wallet,
  CalendarDays,
  CircleDollarSign,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { businessApiService } from "../../api";

import "./business-update.css";

const REFRESH_INTERVAL = 30000;

const PAYMENT_METHODS = [
  { key: "upi", label: "UPI", color: "#6366f1" },
  { key: "cash", label: "Cash", color: "#10b981" },
  { key: "card", label: "Card", color: "#f59e0b" },
  { key: "insurance", label: "Insurance", color: "#06b6d4" },
];

const numberValue = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const parsed = Number(String(value ?? "").replace(/[₹,\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numberValue(value));

const formatCompactCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(numberValue(value));

/** Finds the list of days in the response, whether it is a bare array or wrapped. */
function toRows(response) {
  if (Array.isArray(response)) return response;

  for (const key of ["items", "rows", "days", "data", "daily", "result"]) {
    const value = response?.[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      const nested = toRows(value);
      if (nested.length) return nested;
    }
  }

  const firstList = Object.values(response ?? {}).find(Array.isArray);
  return firstList ?? [];
}

/** Oldest day first, newest day last (so charts read left to right). */
function sortOldestFirst(rows) {
  const times = rows.map((row) => new Date(row.date ?? row.day ?? row.createdAt).getTime());

  // If the day labels are not real dates (e.g. "Day 1"), keep the order we were given.
  if (times.some((time) => Number.isNaN(time))) return rows;

  return rows
    .map((row, index) => ({ row, time: times[index] }))
    .sort((a, b) => a.time - b.time)
    .map((item) => item.row);
}

function normalizeRows(data) {
  const normalized = data.map((row, index) => {
    const upi = numberValue(row.upi);
    const cash = numberValue(row.cash);
    const card = numberValue(row.card);
    const insurance = numberValue(row.insurance);

    const calculatedTotal = upi + cash + card + insurance;
    const suppliedTotal = numberValue(row.total);

    return {
      ...row,
      id: row.id ?? index,
      day: String(row.day ?? row.date ?? `Day ${index + 1}`),
      upi,
      cash,
      card,
      insurance,
      total:
        row.total !== undefined &&
        row.total !== null &&
        row.total !== ""
          ? suppliedTotal
          : calculatedTotal,
    };
  });

  return sortOldestFirst(normalized);
}

function MetricCard({ title, value, subtitle, icon: Icon, accent }) {
  return (
    <article className="ba-metric-card">
      <div className="ba-metric-top">
        <span className="ba-metric-title">{title}</span>

        <span
          className="ba-metric-icon"
          style={{ "--metric-accent": accent }}
        >
          <Icon size={20} />
        </span>
      </div>

      <div className="ba-metric-value">
        {formatCurrency(value)}
      </div>

      <div className="ba-metric-subtitle">
        <span className="ba-metric-indicator">
          <Activity size={14} />
        </span>
        {subtitle}
      </div>
    </article>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="ba-tooltip">
      {label && <p className="ba-tooltip-label">{label}</p>}

      {payload.map((item) => (
        <div className="ba-tooltip-row" key={item.dataKey}>
          <span
            className="ba-tooltip-dot"
            style={{ background: item.color || item.fill }}
          />
          <span>{item.name || item.dataKey}</span>
          <strong>{formatCurrency(item.value)}</strong>
        </div>
      ))}
    </div>
  );
}

export default function BusinessAnalysis() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [range, setRange] = useState("all");

  const fetchBusinessData = useCallback(async (manual = false) => {
    if (manual) {
      setRefreshing(true);
    }

    try {
      const response = await businessApiService.monthly();

      setRows(normalizeRows(toRows(response)));
      setError("");
      setLastUpdated(new Date());
    } catch (err) {
      if (err?.status === 401) return window.location.assign("/login");

      setError(
        err?.message ||
          "Unable to load business analysis. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch initially and refresh automatically every 30 seconds.
  useEffect(() => {
    fetchBusinessData();

    const timer = setInterval(() => {
      fetchBusinessData();
    }, REFRESH_INTERVAL);

    return () => clearInterval(timer);
  }, [fetchBusinessData]);

  // rows are oldest -> newest, so the latest records are at the end.
  const visibleRows = useMemo(() => {
    if (range === "7") return rows.slice(-7);
    if (range === "14") return rows.slice(-14);
    return rows;
  }, [rows, range]);

  const summary = useMemo(() => {
    return visibleRows.reduce(
      (acc, row) => {
        acc.upi += row.upi;
        acc.cash += row.cash;
        acc.card += row.card;
        acc.insurance += row.insurance;
        acc.total += row.total;
        return acc;
      },
      { upi: 0, cash: 0, card: 0, insurance: 0, total: 0 }
    );
  }, [visibleRows]);

  const pieData = useMemo(
    () =>
      PAYMENT_METHODS.map((method) => ({
        name: method.label,
        value: summary[method.key],
        color: method.color,
      })).filter((item) => item.value > 0),
    [summary]
  );

  const averageDailyRevenue = visibleRows.length
    ? summary.total / visibleRows.length
    : 0;

  return (
    <main className="business-page analysis-page ba-page">
      <section className="ba-heading">
        <div>
          <div className="ba-eyebrow">
            <span className="ba-live-dot" />
            BUSINESS INTELLIGENCE
          </div>

          <h1>Business Analysis</h1>

          <p className="ba-heading-description">
            Track collections, understand payment patterns, and monitor your
            laboratory's financial performance.
          </p>
        </div>

        <div className="ba-heading-actions">
          <div className="ba-live-status">
            <span className="ba-live-dot" />
            Auto-refresh on
          </div>

          <button
            type="button"
            className="ba-refresh-button"
            onClick={() => fetchBusinessData(true)}
            disabled={loading || refreshing}
          >
            <RefreshCw
              size={16}
              className={refreshing ? "ba-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </section>

      <section className="ba-overview-bar">
        <div className="ba-overview-icon">
          <CalendarDays size={19} />
        </div>

        <div>
          <strong>Revenue overview</strong>
          <p>
            {range === "all"
              ? "All records returned by your data source"
              : `Latest ${range} records returned by your data source`}
          </p>
        </div>

        <div className="ba-range-control">
          {[
            { label: "7 records", value: "7" },
            { label: "14 records", value: "14" },
            { label: "All", value: "all" },
          ].map((item) => (
            <button
              type="button"
              key={item.value}
              className={range === item.value ? "active" : ""}
              onClick={() => setRange(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="ba-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => fetchBusinessData(true)}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <section className="ba-loading">
          <span className="ba-loading-spinner" />
          <p>Loading your business analytics...</p>
        </section>
      ) : (
        <>
          <section className="ba-metrics-grid">
            <MetricCard
              title="Total collections"
              value={summary.total}
              subtitle={`${visibleRows.length} records analysed`}
              icon={CircleDollarSign}
              accent="#6366f1"
            />

            <MetricCard
              title="UPI collections"
              value={summary.upi}
              subtitle="Digital UPI payments"
              icon={Wallet}
              accent="#10b981"
            />

            <MetricCard
              title="Cash collections"
              value={summary.cash}
              subtitle="Cash payments"
              icon={Banknote}
              accent="#f59e0b"
            />

            <MetricCard
              title="Insurance collections"
              value={summary.insurance}
              subtitle="Insurance payments"
              icon={ShieldCheck}
              accent="#06b6d4"
            />
          </section>

          <section className="ba-primary-grid">
            <article className="ba-panel ba-revenue-panel">
              <div className="ba-panel-header">
                <div>
                  <span className="ba-panel-kicker">
                    REVENUE OVERVIEW
                  </span>
                  <h2>Collection trends</h2>
                  <p>
                    Daily total collections over the selected records
                  </p>
                </div>

                <span className="ba-panel-header-icon">
                  <TrendingUp size={19} />
                </span>
              </div>

              <div className="ba-chart-summary">
                <div>
                  <span>Total collections</span>
                  <strong>{formatCurrency(summary.total)}</strong>
                </div>

                <div>
                  <span>Average per record</span>
                  <strong>{formatCurrency(averageDailyRevenue)}</strong>
                </div>
              </div>

              <div className="ba-chart ba-area-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={visibleRows}
                    margin={{ top: 10, right: 12, left: 4, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="baRevenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#6366f1"
                          stopOpacity={0.26}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0.01}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      stroke="#e9edf5"
                      strokeDasharray="4 5"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fill: "#8b95a7" }}
                      axisLine={false}
                      tickLine={false}
                      tickMargin={12}
                      minTickGap={22}
                    />

                    <YAxis
                      tickFormatter={formatCompactCurrency}
                      tick={{ fontSize: 11, fill: "#8b95a7" }}
                      axisLine={false}
                      tickLine={false}
                      width={76}
                    />

                    <Tooltip content={<ChartTooltip />} />

                    <Area
                      type="monotone"
                      dataKey="total"
                      name="Total collections"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fill="url(#baRevenueGradient)"
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="ba-panel ba-payment-panel">
              <div className="ba-panel-header">
                <div>
                  <span className="ba-panel-kicker">
                    PAYMENT BREAKDOWN
                  </span>
                  <h2>Collection channels</h2>
                  <p>How revenue is distributed</p>
                </div>
              </div>

              {pieData.length ? (
                <>
                  <div className="ba-chart ba-donut-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius="62%"
                          outerRadius="83%"
                          paddingAngle={4}
                          stroke="none"
                        >
                          {pieData.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={entry.color}
                            />
                          ))}
                        </Pie>

                        <Tooltip content={<ChartTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="ba-donut-center">
                      <span>Total revenue</span>
                      <strong>
                        {formatCompactCurrency(summary.total)}
                      </strong>
                    </div>
                  </div>

                  <div className="ba-payment-legend">
                    {pieData.map((item) => {
                      const percentage = summary.total
                        ? (item.value / summary.total) * 100
                        : 0;

                      return (
                        <div
                          className="ba-payment-item"
                          key={item.name}
                        >
                          <div className="ba-payment-name">
                            <span
                              className="ba-legend-dot"
                              style={{ background: item.color }}
                            />
                            <span>{item.name}</span>
                          </div>

                          <div className="ba-payment-value">
                            <strong>
                              {formatCurrency(item.value)}
                            </strong>
                            <span>{percentage.toFixed(1)}%</span>
                          </div>

                          <div className="ba-payment-track">
                            <span
                              style={{
                                width: `${percentage}%`,
                                background: item.color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="ba-empty-chart">
                  <Wallet size={32} />
                  <strong>No collection data yet</strong>
                  <p>
                    Payment distribution will appear when data is available.
                  </p>
                </div>
              )}
            </article>
          </section>

          <section className="ba-panel ba-comparison-panel">
            <div className="ba-panel-header">
              <div>
                <span className="ba-panel-kicker">
                  PAYMENT PERFORMANCE
                </span>
                <h2>Daily payment comparison</h2>
                <p>
                  Compare each collection method across records (oldest on the
                  left, newest on the right)
                </p>
              </div>

              <span className="ba-panel-header-icon">
                <CreditCard size={19} />
              </span>
            </div>

            <div className="ba-chart ba-bar-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={visibleRows}
                  margin={{ top: 12, right: 12, left: 4, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid
                    stroke="#e9edf5"
                    strokeDasharray="4 5"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#8b95a7" }}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={12}
                    minTickGap={22}
                  />

                  <YAxis
                    tickFormatter={formatCompactCurrency}
                    tick={{ fontSize: 11, fill: "#8b95a7" }}
                    axisLine={false}
                    tickLine={false}
                    width={76}
                  />

                  <Tooltip content={<ChartTooltip />} />

                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: 12,
                      paddingBottom: 20,
                    }}
                  />

                  {PAYMENT_METHODS.map((method) => (
                    <Bar
                      key={method.key}
                      dataKey={method.key}
                      name={method.label}
                      fill={method.color}
                      radius={[5, 5, 0, 0]}
                      maxBarSize={24}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="ba-panel ba-table-panel">
            <div className="ba-panel-header">
              <div>
                <span className="ba-panel-kicker">
                  DETAILED REPORT
                </span>
                <h2>Collection records</h2>
                <p>
                  Payment-wise revenue details from your data source
                </p>
              </div>
            </div>

            <div className="analysis-table-wrap ba-table-wrap">
              <table className="analysis-table ba-table">
                <thead>
                  <tr>
                    <th>DAY</th>
                    <th>UPI</th>
                    <th>CASH</th>
                    <th>CARD</th>
                    <th>INSURANCE</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleRows.length ? (
                    [...visibleRows].reverse().map((row, index) => (
                      <tr key={row.id ?? index}>
                        <td>
                          <div className="ba-day-cell">
                            <span className="ba-day-icon">
                              <CalendarDays size={15} />
                            </span>
                            <strong>{row.day}</strong>
                          </div>
                        </td>

                        <td>{formatCurrency(row.upi)}</td>
                        <td>{formatCurrency(row.cash)}</td>
                        <td>{formatCurrency(row.card)}</td>
                        <td>{formatCurrency(row.insurance)}</td>

                        <td>
                          <strong className="ba-total-cell">
                            {formatCurrency(row.total)}
                          </strong>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="ba-table-empty">
                        No business records are available yet.
                      </td>
                    </tr>
                  )}
                </tbody>

                {visibleRows.length > 0 && (
                  <tfoot>
                    <tr>
                      <th>TOTAL</th>
                      <th>{formatCurrency(summary.upi)}</th>
                      <th>{formatCurrency(summary.cash)}</th>
                      <th>{formatCurrency(summary.card)}</th>
                      <th>{formatCurrency(summary.insurance)}</th>
                      <th>{formatCurrency(summary.total)}</th>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </section>

          <footer className="ba-footer">
            <div>
              <span className="ba-footer-status">
                <span className="ba-live-dot" />
                {error ? "Last successful data retained" : "Analytics active"}
              </span>

              <span>
                {lastUpdated
                  ? `Last synced at ${lastUpdated.toLocaleTimeString("en-IN")}`
                  : "Waiting for data"}
              </span>
            </div>

            <span>Refresh interval: 30 seconds</span>
          </footer>
        </>
      )}
    </main>
  );
}