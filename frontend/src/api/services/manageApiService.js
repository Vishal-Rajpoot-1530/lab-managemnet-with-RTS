import apiClient from "../core/apiClient";
import { API_CONFIG } from "../config/apiConfig";
import { asList, unwrap } from "../core/apiUnwrap";

const E = API_CONFIG.ENDPOINTS;

/** Manage menu: employees, lab account, e-mail preferences, referrals, doctor access. */
export default {
  /** Adding and changing employees is admin-only (enforced on the server). */
  employees: {
    list: async () => asList(await apiClient.get(E.EMPLOYEES.BASE), "employees"),
    create: async (payload) => unwrap(await apiClient.post(E.EMPLOYEES.BASE, payload), "employee"),
    update: async (id, payload) => unwrap(await apiClient.patch(E.EMPLOYEES.BY_ID(id), payload), "employee"),
  },

  lab: {
    get: async () => unwrap(await apiClient.get(E.LAB_ACCOUNT.BASE), "lab", "labAccount"),
    save: async (payload) => unwrap(await apiClient.put(E.LAB_ACCOUNT.BASE, payload), "lab", "labAccount"),
    create: async (payload) => unwrap(await apiClient.post(E.LAB_ACCOUNT.LABS, payload), "lab"),
  },

  emailPreferences: {
    get: async () => unwrap(await apiClient.get(E.EMAIL_PREFERENCES.BASE), "preferences"),
    save: async (payload) => unwrap(await apiClient.put(E.EMAIL_PREFERENCES.BASE, payload), "preferences"),
  },

  referrals: {
    get: async () => unwrap(await apiClient.get(E.REFERRALS.BASE), "referral", "program"),
    invite: async (invitee) => unwrap(await apiClient.post(E.REFERRALS.BASE, { invitee }), "referral", "program"),
  },

  /** Messages from the super admin, for the notification bar. */
  notifications: {
    list: async () => asList(await apiClient.get(E.NOTIFICATIONS.BASE), "notifications"),
  },

  doctorAccess: {
    list: async () => asList(await apiClient.get(E.DOCTOR_ACCESS.BASE), "doctorAccess", "doctors"),
    create: async (payload) => unwrap(await apiClient.post(E.DOCTOR_ACCESS.BASE, payload), "doctorAccess", "doctor"),
    update: async (id, payload) =>
      unwrap(await apiClient.patch(E.DOCTOR_ACCESS.BY_ID(id), payload), "doctorAccess", "doctor"),
    remove: (id) => apiClient.delete(E.DOCTOR_ACCESS.BY_ID(id)),
  },
};