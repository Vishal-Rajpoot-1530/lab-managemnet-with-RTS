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

/** Authentication only. Every other API lives in api/services/*. */
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

export default authApi;