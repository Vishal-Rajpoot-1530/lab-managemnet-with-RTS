import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { reportApiService } from "../../api";
import { apiArray, apiObject } from "../../api/core/apiData";
import "./lab.css";

const COMPLETED = ["completed", "complete", "reported"];

const isCompleted = (status) =>
  COMPLETED.includes(String(status || "").toLowerCase());

export default function LabReport() {
  const { billId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReport() {
      setLoading(true);
      setError("");

      try {
        const response = await reportApiService.list({ billId });
        const found = apiArray(response).find(
          (item) => String(item.billId) === String(billId),
        );

        if (!found) throw new Error("No lab report was found for this bill.");

        if (active) setReport(found);
      } catch (err) {
        if (active) setError(err?.message || "Could not load the lab report.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadReport();

    return () => {
      active = false;
    };
  }, [billId]);

  const setTestValue = (testId, value) => {
    setReport((current) => ({
      ...current,
      tests: current.tests.map((test) =>
        test.id === testId ? { ...test, value } : test,
      ),
    }));
  };

  const setField = (field, value) => {
    setReport((current) => ({ ...current, [field]: value }));
  };

  const save = async (status) => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await reportApiService.update(report.id, {
        tests: report.tests,
        interpretation: report.interpretation,
        notes: report.notes,
        ...(status ? { status } : {}),
      });

      const updated = apiObject(response);

      if (updated && typeof updated === "object") setReport(updated);

      setMessage(
        status === "Completed" ? "Report marked as completed." : "Report saved.",
      );
    } catch (err) {
      setError(err?.message || "Could not save the report.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="lab-page">
        <div className="lab-state" role="status">
          <span className="lab-spinner" />
          <strong>Loading lab report...</strong>
        </div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="lab-page">
        <div className="lab-state lab-state-error" role="alert">
          <span className="lab-state-icon">!</span>
          <div>
            <strong>Unable to open the lab report</strong>
            <p>{error || "Report not found."}</p>
            <button
              type="button"
              className="lab-btn secondary"
              onClick={() => navigate(`/cases/bill-details/${billId}`)}
            >
              Back to bill
            </button>
          </div>
        </div>
      </main>
    );
  }

  const tests = Array.isArray(report.tests) ? report.tests : [];
  const completed = isCompleted(report.status);

  // Group the tests by section (HAEMATOLOGY, BIOCHEMISTRY, ...).
  const sections = tests.reduce((groups, test) => {
    const name = test.section || "LABORATORY";
    (groups[name] = groups[name] || []).push(test);
    return groups;
  }, {});

  const cell = { padding: "8px 10px", textAlign: "left" };

  return (
    <main className="lab-page">
      <header className="lab-page-header">
        <div>
          <div className="lab-breadcrumb">
            Dashboard <span>/</span> Reports <span>/</span> #{report.regNo}
          </div>
          <h1>Lab report</h1>
          <p className="lab-page-subtitle">
            {report.patient} · {report.age || "—"} · Referred by{" "}
            {report.referrer || "Self"} · Status: {report.status || "New"}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            className="lab-btn secondary"
            onClick={() => navigate(`/cases/bill-details/${billId}`)}
          >
            Back to bill
          </button>

          <button
            type="button"
            className="lab-btn secondary"
            onClick={() => window.print()}
          >
            Print
          </button>
        </div>
      </header>

      {error && (
        <div className="lab-state lab-state-error" role="alert">
          <span className="lab-state-icon">!</span>
          <div>
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {message && (
        <div className="lab-state" role="status">
          <strong>{message}</strong>
        </div>
      )}

      <section className="lab-table-panel">
        {Object.entries(sections).map(([section, rows]) => (
          <div key={section} style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 14, margin: "8px 0" }}>{section}</h2>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.04)" }}>
                  <th style={cell}>TEST</th>
                  <th style={cell}>RESULT</th>
                  <th style={cell}>UNIT</th>
                  <th style={cell}>REFERENCE RANGE</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((test) => (
                  <tr
                    key={test.id}
                    style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
                  >
                    <td style={cell}>{test.name}</td>

                    <td style={cell}>
                      <input
                        value={test.value ?? ""}
                        onChange={(e) => setTestValue(test.id, e.target.value)}
                        aria-label={`Result for ${test.name}`}
                        style={{ width: 120 }}
                      />
                    </td>

                    <td style={cell}>{test.unit || "—"}</td>
                    <td style={cell}>{test.reference || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {!tests.length && <p>No tests are listed on this report.</p>}

        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <label>
            Interpretation
            <textarea
              rows={3}
              style={{ width: "100%" }}
              value={report.interpretation ?? ""}
              onChange={(e) => setField("interpretation", e.target.value)}
            />
          </label>

          <label>
            Notes
            <textarea
              rows={3}
              style={{ width: "100%" }}
              value={report.notes ?? ""}
              onChange={(e) => setField("notes", e.target.value)}
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button
            type="button"
            className="lab-btn secondary"
            disabled={saving}
            onClick={() => save()}
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            className="lab-btn primary"
            disabled={saving || completed}
            onClick={() => save("Completed")}
          >
            {completed ? "Completed" : "Save and mark completed"}
          </button>
        </div>
      </section>
    </main>
  );
}