

import apiClient from "../core/apiClient";
import { API_CONFIG } from "../config/apiConfig";
import { asList, cleanQuery, unwrap } from "../core/apiUnwrap";

const E = API_CONFIG.ENDPOINTS.BUSINESS;

export const businessApiService = {
  daily: (query) => apiClient.get(E.DAILY, { query }),
  monthly: (query) => apiClient.get(E.MONTHLY, { query }),
  referralReports: (query) => apiClient.get(E.REFERRAL_REPORTS, { query }),

  // Reports > Business Reports > Case Wise Report
  caseWiseOptions: async () => unwrap(await apiClient.get(E.CASE_WISE_OPTIONS), "options"),
  caseWiseReport: async ({ date, centre, types, excludeCancelled }) =>
    unwrap(
      await apiClient.get(E.CASE_WISE_REPORT, {
        query: cleanQuery({ date, centre, types: types.join(","), excludeCancelled: String(excludeCancelled) }),
      }),
      "report",
    ),

  // Business > Due reports. params: { from, to, q } -> array of bills that still have a balance
  dueReports: async (params) => asList(await apiClient.get(E.DUE_REPORTS, { query: cleanQuery(params) }), "items"),

  // Dashboard
  dashboard: async () => unwrap(await apiClient.get(E.DASHBOARD)),

  // Business > Data export
  exportHistory: async () => asList(await apiClient.get(E.DATA_EXPORT), "exports"),
  /** { entity, from, to } -> { export: {...history record}, csv } */
  exportRun: async ({ entity, from, to }) => unwrap(await apiClient.post(E.DATA_EXPORT, { entity, from, to })),
  /** -> { name, csv } */
  exportFile: async (id) => unwrap(await apiClient.get(E.DATA_EXPORT_FILE(id))),
};

export default businessApiService;