const env = import.meta.env;
const BASE_URL=(env.VITE_API_BASE_URL||"http://localhost:4000/api").replace(/\/+$/,'');
export const API_CONFIG=Object.freeze({
 BASE_URL,
 TIMEOUT_MS:Number(env.VITE_API_TIMEOUT_MS||30000),
 DEBUG:env.DEV || env.VITE_API_DEBUG==="true",
 RETRY_COUNT:Number(env.VITE_API_RETRY_COUNT||0),
 ENDPOINTS:Object.freeze({
  BILLING:Object.freeze({BASE:"/billing",BY_ID:id=>`/billing/${id}`,TRANSACTIONS:"/billing/transactions"}),
  PATIENTS:Object.freeze({BASE:"/patients",BY_ID:id=>`/patients/${id}`,SEARCH:"/patients/search"}),
  REFERRERS:Object.freeze({BASE:"/doctors",BY_ID:id=>`/doctors/${id}`}),
  AGENTS:Object.freeze({BASE:"/cases/agents",BY_ID:id=>`/cases/agents/${id}`}),
  BUSINESS:Object.freeze({BASE:"/business",DAILY:"/business/daily",MONTHLY:"/business/monthly",REFERRAL_REPORTS:"/business/referral-reports",CASE_WISE_REPORT:"/business/case-wise-report",CASE_WISE_OPTIONS:"/business/case-wise-report/options",DATA_EXPORT:"/business/data-export",DATA_EXPORT_FILE:id=>`/business/data-export/${id}/file`}),
  REPORTS:Object.freeze({BASE:"/reports",TODAY:"/reports/today",SEARCH:"/reports/search",BY_ID:id=>`/reports/${id}`}),
  LAB:Object.freeze({BASE:"/lab",TODAY:"/lab/today",TESTS:"/lab/tests"}),
  TESTS:Object.freeze({BASE:"/lab/tests",BY_ID:id=>`/lab/tests/${id}`}),
  TEST_CATEGORIES:Object.freeze({BASE:"/lab/test-categories",BY_ID:id=>`/lab/test-categories/${id}`}),
  EMPLOYEES:Object.freeze({BASE:"/manage/employees",BY_ID:id=>`/manage/employees/${id}`}),
  UNITS:Object.freeze({BASE:"/lab/units",BY_ID:id=>`/lab/units/${id}`}),
  INPUT_TYPES:Object.freeze({BASE:"/lab/input-types"}),

  // ---- Manage
  LAB_ACCOUNT:Object.freeze({BASE:"/manage/lab-account",LABS:"/manage/labs"}),
  EMAIL_PREFERENCES:Object.freeze({BASE:"/manage/email-preferences"}),
  REFERRALS:Object.freeze({BASE:"/manage/referrals"}),
  DOCTOR_ACCESS:Object.freeze({BASE:"/manage/doctor-access",BY_ID:id=>`/manage/doctor-access/${id}`}),

  // ---- Lab
  INTERPRETATIONS:Object.freeze({BASE:"/lab/interpretations",BY_ID:id=>`/lab/interpretations/${id}`}),
  PANELS:Object.freeze({BASE:"/lab/panels",BY_ID:id=>`/lab/panels/${id}`}),

  // ---- Cases
  OUTSOURCE:Object.freeze({BASE:"/cases/outsource",BY_ID:id=>`/cases/outsource/${id}`,LABS:"/cases/outsource-labs"}),
  RADIOLOGY_CASES:Object.freeze({BASE:"/cases/radiology"}),

  // ---- Business > Expenses
  EXPENSES:Object.freeze({
   BASE:"/business/expenses",
   BY_ID:id=>`/business/expenses/${id}`,
   CATEGORIES:"/business/expense-categories",
   CATEGORY_BY_ID:id=>`/business/expense-categories/${id}`,
  }),
 })
});
export default API_CONFIG;