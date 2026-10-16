/** Types for the in-memory demo store (billing, reports, employees, ...). */

export type Id = number | string;

export interface Referrer {
  id: number;
  title?: string;
  firstName?: string;
  lastName?: string;
  /** Some clients send a single display name instead of first/last name. */
  name?: string;
  degree?: string;
  mobile?: string;
  email?: string;
  address?: string;
  active: boolean;
}

export interface Agent {
  id: number;
  name?: string;
  active: boolean;
}

export type BillStatus = "Active" | "Cancelled";

export interface Investigation {
  name: string;
  price: number;
  type?: string;
  section?: string;
  unit?: string;
  reference?: string;
}

export interface PatientDetails {
  title?: string;
  firstName?: string;
  lastName?: string;
  years?: string | number | null;
  months?: string | number | null;
  days?: string | number | null;
  age?: string;
  mobile?: string;
  uhid?: string;
  sex?: string;
  online?: boolean;
}

export interface PaymentDetails {
  collectionCharge?: number | string;
  total?: number | string;
  discount?: number | string;
  received?: number | string;
  balance?: number;
  mode?: string;
  remarks?: string;
}

export interface Transaction {
  id: number;
  date: string;
  amount: number;
  mode: string;
  receivedBy: string;
}

export interface Bill {
  id: number;
  billNo?: string;
  regNo: string;
  registrationNo?: string;
  caseNo: string;
  status: BillStatus;
  createdAt: string;
  cancelReason?: string;

  patient: string;
  patientName?: string;
  patientDetails?: PatientDetails;
  mobile: string;
  uhid?: string;
  age?: string;
  sex?: string;
  onlineReportRequested?: boolean;

  referrerId?: Id | null;
  referrer: string;
  referrerName?: string;
  sampleCollectionAgentId?: Id | null;
  sampleCollectionAgentName?: string;
  collectionCentre?: string;

  investigations: Investigation[];

  total: number;
  discount: number;
  received: number;
  paid?: number;
  balance: number;
  collectionCharge?: number;
  mode: string;
  remarks?: string;
  payment?: PaymentDetails;
  transactions?: Transaction[];
}

export interface ReportTest {
  id: number;
  section: string;
  name: string;
  value: string;
  unit: string;
  reference: string;
}

export interface Report {
  id: number;
  billId: number;
  regNo: string;
  patient: string;
  age: string;
  referrer: string;
  status: string;
  tests: ReportTest[];
  interpretation: string;
  notes: string;
}

export interface Employee {
  id: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  mobile?: string;
  role?: string;
  active: boolean;
  owner: boolean;
  permissions: string[];
}

export interface Activity {
  id?: number | string;
  type?: string;
  createdAt?: string;
}

export interface Store {
  referrers: Referrer[];
  agents: Agent[];
  bills: Bill[];
  reports: Report[];
  employees: Employee[];
  activities?: Activity[];
}

/** Aggregated row used by the business reports (daily / monthly / referral). */
export interface BillingSummary {
  totalBills: number;
  totalAmount: number;
  receivedAmount: number;
  pendingAmount: number;
  discountAmount: number;
}
