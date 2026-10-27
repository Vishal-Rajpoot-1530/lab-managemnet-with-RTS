/**
 * Small helpers shared by the API services.
 * Responses can be a bare value or wrapped ({ items: [...] }, { data: [...] },
 * { success, data }). These make a service return the value the page needs.
 */

/** Returns the wrapped value (looking under the given keys, then "data" / "result"). */
export const unwrap = (data, ...keys) => {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    for (const key of [...keys, "data", "result"]) {
      if (data[key] !== undefined) return data[key];
    }
  }
  return data;
};

/** Always returns an array. */
export const asList = (data, ...keys) => {
  const value = unwrap(data, ...keys, "items", "rows");
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const firstList = Object.values(value).find(Array.isArray);
    if (firstList) return firstList;
  }
  return [];
};

/** Drops empty values so they are not sent as ?status=&q= */
export const cleanQuery = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );