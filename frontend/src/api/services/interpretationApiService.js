import apiClient from "../core/apiClient";
import { API_CONFIG } from "../config/apiConfig";
import { asList, unwrap } from "../core/apiUnwrap";

const E = API_CONFIG.ENDPOINTS;

/** Lab > Interpretations (tests() and panels() fill the "linked to" dropdown). */
export default {
  list: async () => asList(await apiClient.get(E.INTERPRETATIONS.BASE), "interpretations"),
  create: async (payload) => unwrap(await apiClient.post(E.INTERPRETATIONS.BASE, payload), "interpretation"),
  update: async (id, payload) =>
    unwrap(await apiClient.patch(E.INTERPRETATIONS.BY_ID(id), payload), "interpretation"),
  remove: (id) => apiClient.delete(E.INTERPRETATIONS.BY_ID(id)),
  tests: async () => asList(await apiClient.get(E.TESTS.BASE), "tests"),
  panels: async () => asList(await apiClient.get(E.PANELS.BASE), "panels"),
};