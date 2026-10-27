import apiClient from "../core/apiClient";
import { API_CONFIG } from "../config/apiConfig";
import { asList, cleanQuery, unwrap } from "../core/apiUnwrap";

const E = API_CONFIG.ENDPOINTS;

/** Cases menu: outsource cases and scan cases (USG, X-ray, CT scan, MRI). */
export default {
  outsource: {
    list: async (params) => asList(await apiClient.get(E.OUTSOURCE.BASE, { query: cleanQuery(params) }), "outsourceCases"),
    update: async (id, payload) => unwrap(await apiClient.patch(E.OUTSOURCE.BY_ID(id), payload), "case"),
    labs: async () => asList(await apiClient.get(E.OUTSOURCE.LABS), "labs"),
  },

  radiology: {
    /** modality: "ctScan" | "usg" | "xray" | "digitalXray" | "mri" */
    list: async (modality, params) =>
      asList(await apiClient.get(E.RADIOLOGY_CASES.BASE, { query: cleanQuery({ modality, ...params }) }), "cases"),
  },
};