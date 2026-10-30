import { API_CONFIG } from "../config/apiConfig";

const E = API_CONFIG.ENDPOINTS.SUPER_ADMIN;

// The super admin has its own token, kept apart from the lab users' token.
const KEY = "superAdminToken";
const read = () => {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
};
const write = (token) => {
  try {
    if (token) sessionStorage.setItem(KEY, token);
    else sessionStorage.removeItem(KEY);
  } catch {
    // Storage unavailable: the panel asks for the sign-in again after a reload.
  }
};

async function request(path, { method = "GET", body } = {}) {
  const token = read();
  let response;

  try {
    response = await fetch(`${API_CONFIG.BASE_URL}${path}`, {
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
    // no JSON body (for example 204)
  }

  if (!response.ok) {
    if (response.status === 401) write(null);
    const error = new Error(data?.error || data?.message || `Request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }

  return data;
}

/** Super admin panel: sign in, and manage the lab (admin) accounts. */
export default {
  isLoggedIn: () => Boolean(read()),

  async login(email, password) {
    const data = await request(E.LOGIN, { method: "POST", body: { email: String(email).trim(), password } });
    if (!data?.token) throw new Error("The server did not return a token.");
    write(data.token);
    return data.admin;
  },

  logout: () => write(null),

  me: async () => (await request(E.ME)).admin,

  tenants: {
    list: async () => (await request(E.TENANTS)).items ?? [],
    create: (payload) => request(E.TENANTS, { method: "POST", body: payload }),
    update: (id, payload) => request(E.TENANT_BY_ID(id), { method: "PATCH", body: payload }),
    remove: (id) => request(E.TENANT_BY_ID(id), { method: "DELETE" }),
  },

  /** Messages shown in the labs' notification bar. */
  notifications: {
    list: async () => (await request(E.NOTIFICATIONS)).items ?? [],
    create: (payload) => request(E.NOTIFICATIONS, { method: "POST", body: payload }),
    update: (id, payload) => request(E.NOTIFICATION_BY_ID(id), { method: "PATCH", body: payload }),
    remove: (id) => request(E.NOTIFICATION_BY_ID(id), { method: "DELETE" }),
  },
};