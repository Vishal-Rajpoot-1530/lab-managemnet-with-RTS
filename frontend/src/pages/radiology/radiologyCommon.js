import { useCallback, useEffect, useState } from "react";

/** Wording and options that differ between the USG and X-ray sections. */
export const SECTIONS = {
  usg: {
    base: "/usg",
    eyebrow: "ULTRASOUND DEPARTMENT",
    todayTitle: "Today's USG Cases",
    todayText: "Review and manage today's ultrasound cases.",
    searchText: "Find ultrasound cases by patient, date, or case details.",
    templateText: "Create and manage reusable ultrasound report templates.",
    categories: ["General", "Abdomen", "Pelvis", "Urology", "Obstetrics", "Vascular", "Small Parts"],
    templatePlaceholder: "e.g. Whole Abdomen",
  },
  xray: {
    base: "/xray",
    eyebrow: "X-RAY DEPARTMENT",
    todayTitle: "Today's X-RAY Cases",
    todayText: "Review and manage today's X-ray cases.",
    searchText: "Find X-ray cases by patient, date, or case details.",
    templateText: "Create and manage reusable X-ray report templates.",
    categories: ["General", "Chest", "Spine", "Skull", "Upper Limb", "Lower Limb", "Abdomen", "Pelvis"],
    templatePlaceholder: "e.g. Chest PA View",
  },
};

export const STATUSES = ["Report Pending", "In Progress", "Completed"];

/** The next status when the pencil button is pressed. */
export const nextStatus = (status) =>
  status === "Report Pending" ? "In Progress" : status === "In Progress" ? "Completed" : "Report Pending";

export const statusClass = (status) =>
  status === "Completed" ? "completed" : status === "In Progress" ? "progress" : "pending";

export const errorMessage = (error) =>
  (error && error.message && error.message !== "[object Object]" && error.message) ||
  "Something went wrong. Please try again.";

/** Converts a case from the API into the shape the pages display. */
export function toCaseView(c) {
  return {
    key: c.id, // database id, used when saving
    id: c.caseId, // what the user sees, e.g. USG-0007
    regNo: c.regNo,
    patientName: c.patientName,
    patientId: c.patientCode,
    age: c.age,
    gender: c.sex,
    testName: c.studyName,
    referringDoctor: c.referrerName,
    receivedAt: c.time,
    date: c.date, // YYYY-MM-DD
    dateDisplay: c.dateDisplay,
    status: c.status,
  };
}

/** Loads data when the page opens (and again on reload()). */
export function useLoad(loader, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let stale = false;
    setState((s) => ({ ...s, loading: true }));

    loader()
      .then((data) => !stale && setState({ data, loading: false, error: "" }))
      .catch((error) => !stale && setState((s) => ({ ...s, loading: false, error: errorMessage(error) })));

    return () => {
      stale = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  const setData = useCallback(
    (update) => setState((s) => ({ ...s, data: typeof update === "function" ? update(s.data) : update })),
    [],
  );

  return { ...state, reload, setData };
}
