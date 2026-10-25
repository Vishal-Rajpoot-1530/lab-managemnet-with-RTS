// import { useEffect, useState } from "react";
// import "./business.css";

// const API_URL = "http://localhost:4000/api/business/activities";

// function formatDate(date) {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// }

// function formatTimestamp(value) {
//   if (!value) return "Unknown time";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) return value;

//   return date.toLocaleString("en-IN", {
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// }

// export default function Activities() {
//   const [date, setDate] = useState("2026-09-21");
//   const [type, setType] = useState("All Activities");
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const controller = new AbortController();

//     async function loadActivities() {
//       try {
//         setLoading(true);
//         setError("");

//         const params = new URLSearchParams({ date });

//         if (type !== "All Activities") {
//           params.set("type", type);
//         }

//         const response = await fetch(`${API_URL}?${params}`, {
//           signal: controller.signal,
//         });

//         if (!response.ok) {
//           throw new Error(`Request failed: ${response.status}`);
//         }

//         const data = await response.json();

//         setActivities(data.items || []);
//       } catch (err) {
//         if (err.name !== "AbortError") {
//           setError(err.message || "Unable to load activities.");
//         }
//       } finally {
//         if (!controller.signal.aborted) {
//           setLoading(false);
//         }
//       }
//     }

//     loadActivities();

//     return () => controller.abort();
//   }, [date, type]);

//   function changeDate(days) {
//     const current = new Date(`${date}T12:00:00`);
//     current.setDate(current.getDate() + days);
//     setDate(formatDate(current));
//   }

//   return (
//     <div className="business-page">
//       <div className="biz-title">
//         <h1>Activities</h1>
//         <span className="feature">★ Advanced plan feature</span>
//       </div>

//       <div className="activity-intro">
//         <div>
//           <h3>ⓘ &nbsp; How does this work?</h3>
//           <p>
//             Business-sensitive activities can be monitored and recorded
//             with a timestamp, activity description, and owner.
//           </p>
//         </div>

//         <div>
//           <h3>▣ &nbsp; Activities monitored:</h3>
//           <ul>
//             <li>Patient name changes.</li>
//             <li>Referrer changes.</li>
//             <li>Investigations added or updated.</li>
//             <li>Case modifications.</li>
//           </ul>
//         </div>
//       </div>

//       <div className="biz-toolbar">
//         <button
//           className="biz-btn"
//           onClick={() => changeDate(-1)}
//           aria-label="Previous day"
//         >
//           ‹
//         </button>

//         <input
//           className="biz-input"
//           type="date"
//           value={date}
//           onChange={(event) => setDate(event.target.value)}
//         />

//         <button
//           className="biz-btn"
//           onClick={() => changeDate(1)}
//           aria-label="Next day"
//         >
//           ›
//         </button>

//         <select
//           className="biz-select"
//           value={type}
//           onChange={(event) => setType(event.target.value)}
//         >
//           <option>All Activities</option>
//           <option>Case modified</option>
//           <option>Patient name updated</option>
//           <option>Investigation Added</option>
//           <option>Referrer changed</option>
//         </select>
//       </div>

//       <div className="timeline">
//         {loading && <p>Loading activities...</p>}

//         {!loading && error && (
//           <p role="alert">Unable to load activities: {error}</p>
//         )}

//         {!loading && !error && activities.length === 0 && (
//           <p>No activities recorded for this date.</p>
//         )}

//         {!loading &&
//           !error &&
//           activities.map((activity) => (
//             <div
//               className={
//                 "event " +
//                 (activity.type === "Investigation Added" ? "add" : "")
//               }
//               key={activity.id}
//             >
//               <h3>{activity.type || "Activity"}</h3>

//               <b>{formatTimestamp(activity.createdAt)}</b>

//               <p>
//                 {activity.description || "No description available"}
//                 <br />
//                 Reg. no. {activity.regNo || "N/A"}
//               </p>

//               <p>
//                 - {activity.owner || "System"}
//                 {" | "}
//                 {activity.billId ? (
//                   <a href={`/billing/${activity.billId}`}>
//                     View bill
//                   </a>
//                 ) : (
//                   <span>Bill unavailable</span>
//                 )}
//               </p>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import "./business.css";
import { getApiToken } from "../../api/core/apiAuth";

const API_URL = "http://localhost:4000/api/business/activities";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTimestamp(value) {
  if (!value) return "Unknown time";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function Activities() {
  const [date, setDate] = useState("2026-09-21");
  const [type, setType] = useState("All Activities");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadActivities() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({ date });

        if (type !== "All Activities") {
          params.set("type", type);
        }

        const token = getApiToken();
        const response = await fetch(`${API_URL}?${params}`, {
          signal: controller.signal,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();

        setActivities(data.items || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load activities.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadActivities();

    return () => controller.abort();
  }, [date, type]);

  function changeDate(days) {
    const current = new Date(`${date}T12:00:00`);
    current.setDate(current.getDate() + days);
    setDate(formatDate(current));
  }

  return (
    <div className="business-page">
      <div className="biz-title">
        <h1>Activities</h1>
        <span className="feature">★ Advanced plan feature</span>
      </div>

      <div className="activity-intro">
        <div>
          <h3>ⓘ &nbsp; How does this work?</h3>
          <p>
            Business-sensitive activities can be monitored and recorded
            with a timestamp, activity description, and owner.
          </p>
        </div>

        <div>
          <h3>▣ &nbsp; Activities monitored:</h3>
          <ul>
            <li>Patient name changes.</li>
            <li>Referrer changes.</li>
            <li>Investigations added or updated.</li>
            <li>Case modifications.</li>
          </ul>
        </div>
      </div>

      <div className="biz-toolbar">
        <button
          className="biz-btn"
          onClick={() => changeDate(-1)}
          aria-label="Previous day"
        >
          ‹
        </button>

        <input
          className="biz-input"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />

        <button
          className="biz-btn"
          onClick={() => changeDate(1)}
          aria-label="Next day"
        >
          ›
        </button>

        <select
          className="biz-select"
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option>All Activities</option>
          <option>Case modified</option>
          <option>Patient name updated</option>
          <option>Investigation Added</option>
          <option>Referrer changed</option>
        </select>
      </div>

      <div className="timeline">
        {loading && <p>Loading activities...</p>}

        {!loading && error && (
          <p role="alert">Unable to load activities: {error}</p>
        )}

        {!loading && !error && activities.length === 0 && (
          <p>No activities recorded for this date.</p>
        )}

        {!loading &&
          !error &&
          activities.map((activity) => (
            <div
              className={
                "event " +
                (activity.type === "Investigation Added" ? "add" : "")
              }
              key={activity.id}
            >
              <h3>{activity.type || "Activity"}</h3>

              <b>{formatTimestamp(activity.createdAt)}</b>

              <p>
                {activity.description || "No description available"}
                <br />
                Reg. no. {activity.regNo || "N/A"}
              </p>

              <p>
                - {activity.owner || "System"}
                {" | "}
                {activity.billId ? (
                  <a href={`/billing/${activity.billId}`}>
                    View bill
                  </a>
                ) : (
                  <span>Bill unavailable</span>
                )}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
