import apiClient from "../core/apiClient";
import { apiArray, apiObject } from "../core/apiData";

/**
 * Talks to the scan-report endpoints. `base` is "/usg" or "/xray".
 * Every call returns plain data (arrays / objects) and throws ApiException on failure.
 */
export function createRadiologyApi(base) {
  return {
    todayCases: (query) => apiClient.get(`${base}/today`, { query }).then(apiArray),
    searchCases: (query) => apiClient.get(`${base}/search`, { query }).then(apiArray),
    updateCase: (id, payload) => apiClient.patch(`${base}/${id}`, payload).then(apiObject),

    templates: () => apiClient.get(`${base}/templates`).then(apiArray),
    createTemplate: (payload) => apiClient.post(`${base}/templates`, payload).then(apiObject),
    updateTemplate: (id, payload) => apiClient.patch(`${base}/templates/${id}`, payload).then(apiObject),
    removeTemplate: (id) => apiClient.delete(`${base}/templates/${id}`),

    signatures: () => apiClient.get(`${base}/signatures`).then(apiArray),
    createSignature: (payload) => apiClient.post(`${base}/signatures`, payload).then(apiObject),
    updateSignature: (id, payload) => apiClient.patch(`${base}/signatures/${id}`, payload).then(apiObject),
    removeSignature: (id) => apiClient.delete(`${base}/signatures/${id}`),
  };
}

export default createRadiologyApi;
