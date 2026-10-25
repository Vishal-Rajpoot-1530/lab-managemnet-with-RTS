

import { getApiToken, setApiTokenGetter } from "./apiToken";

// Other files (like apiClient.js) already import the token helpers from this
// file, so keep exporting them from here.
export { getApiToken, setApiTokenGetter };

const BASE_URL = (
  import.meta.env?.VITE_API_URL ?? "http://localhost:4000/api"
).replace(/\/$/, "");

const TOKEN_KEY = "token";

const readStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const storeToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Storage unavailable; the user will need to log in again after a reload.
  }
};

const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Nothing to clear.
  }
};

// Every API service that uses getApiToken() will now send the stored token.
setApiTokenGetter(readStoredToken);

async function request(path, { method = "GET", body } = {}) {
  const token = getApiToken();

  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Check your connection.");
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    // Response had no JSON body.
  }

  if (!response.ok) {
    // An expired or invalid token on a protected call means we are logged out.
    if (response.status === 401 && token) clearToken();

    const error = new Error(data?.error || `Request failed (${response.status}).`);
    error.status = response.status; // lets callers react to 401 / 403
    throw error;
  }

  return data;
}

export const authApi = {
  /** Logs in, stores the token, and returns { token, user }. */
  async login(email, password) {
    const data = await request("/auth/login", {
      method: "POST",
      body: { email: String(email).trim(), password },
    });

    if (!data?.token) throw new Error("The server did not return a token.");

    storeToken(data.token);

    return data;
  },

  /** Returns { user } if the stored token is still valid, otherwise throws. */
  me() {
    return request("/auth/me");
  },

  /** Tells the server, then always removes the local token. */
  async logout() {
    try {
      await request("/auth/logout", { method: "POST" });
    } catch {
      // Ignore server errors; logging out locally is what matters.
    } finally {
      clearToken();
    }
  },

  isLoggedIn() {
    return Boolean(readStoredToken());
  },
};

// Backends often wrap results ({ employees: [...] }, { data: [...] }).
// These helpers make the pages work with either a bare value or a wrapped one.
const unwrap = (data, ...keys) => {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    for (const key of [...keys, "data", "result"]) {
      if (data[key] !== undefined) return data[key];
    }
  }
  return data;
};

const asList = (data, ...keys) => {
  const value = unwrap(data, ...keys, "items", "rows");
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const firstList = Object.values(value).find(Array.isArray);
    if (firstList) return firstList;
  }
  return [];
};

/** Manage > Employees. Adding/changing is admin-only (enforced on the server). */
export const employeesApi = {
  list: async () => asList(await request("/manage/employees"), "employees"),
  create: async (payload) => unwrap(await request("/manage/employees", { method: "POST", body: payload }), "employee"),
  update: async (id, payload) =>
    unwrap(await request(`/manage/employees/${id}`, { method: "PATCH", body: payload }), "employee"),
};

/** Manage > Lab account and Setup lab. Saving is admin-only (enforced on the server). */
export const labApi = {
  get: async () => unwrap(await request("/manage/lab-account"), "lab", "labAccount"),
  save: async (payload) => unwrap(await request("/manage/lab-account", { method: "PUT", body: payload }), "lab", "labAccount"),
  create: async (payload) => unwrap(await request("/manage/labs", { method: "POST", body: payload }), "lab"),
};

/** Manage > E-mail preferences (per logged-in user). */
export const emailPrefsApi = {
  get: async () => unwrap(await request("/manage/email-preferences"), "preferences"),
  save: async (payload) =>
    unwrap(await request("/manage/email-preferences", { method: "PUT", body: payload }), "preferences"),
};

/** Manage > Referral program. */
export const referralApi = {
  get: async () => unwrap(await request("/manage/referrals"), "referral", "program"),
  invite: async (invitee) =>
    unwrap(await request("/manage/referrals", { method: "POST", body: { invitee } }), "referral", "program"),
};

/** Manage > Doctor access (logins for referring doctors). */
export const doctorAccessApi = {
  list: async () => asList(await request("/manage/doctor-access"), "doctorAccess", "doctors"),
  create: async (payload) =>
    unwrap(await request("/manage/doctor-access", { method: "POST", body: payload }), "doctorAccess", "doctor"),
  update: async (id, payload) =>
    unwrap(await request(`/manage/doctor-access/${id}`, { method: "PATCH", body: payload }), "doctorAccess", "doctor"),
  remove: (id) => request(`/manage/doctor-access/${id}`, { method: "DELETE" }),
};

/** Lab > Interpretations. Change LAB_BASE if your lab routes are mounted elsewhere. */
const LAB_BASE = "/lab";

export const interpretationApi = {
  list: async () => asList(await request(`${LAB_BASE}/interpretations`), "interpretations"),
  create: async (payload) =>
    unwrap(await request(`${LAB_BASE}/interpretations`, { method: "POST", body: payload }), "interpretation"),
  update: async (id, payload) =>
    unwrap(await request(`${LAB_BASE}/interpretations/${id}`, { method: "PATCH", body: payload }), "interpretation"),
  remove: (id) => request(`${LAB_BASE}/interpretations/${id}`, { method: "DELETE" }),
  // Used by the "linked to" dropdown. Adjust the paths to your existing test and panel list routes.
  tests: async () => asList(await request(`${LAB_BASE}/tests`), "tests"),
  panels: async () => asList(await request(`${LAB_BASE}/panels`), "panels"),
};

export default authApi;