import apiClient from "../core/apiClient";
import { API_CONFIG } from "../config/apiConfig";
import { asList, cleanQuery, unwrap } from "../core/apiUnwrap";

const E = API_CONFIG.ENDPOINTS.EXPENSES;

/** Business > Expenses. month = "YYYY-MM". */
export default {
  list: async (month) => asList(await apiClient.get(E.BASE, { query: cleanQuery({ month }) }), "expenses"),
  create: async (payload) => unwrap(await apiClient.post(E.BASE, payload), "expense"),
  update: async (id, payload) => unwrap(await apiClient.patch(E.BY_ID(id), payload), "expense"),
  remove: (id) => apiClient.delete(E.BY_ID(id)),

  categories: async () => asList(await apiClient.get(E.CATEGORIES), "categories"),
  createCategory: async (name) => unwrap(await apiClient.post(E.CATEGORIES, { name }), "category"),
  removeCategory: (id) => apiClient.delete(E.CATEGORY_BY_ID(id)),
};