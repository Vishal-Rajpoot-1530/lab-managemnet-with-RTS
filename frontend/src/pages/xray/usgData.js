export const demoCases = [
  { id: "USG-1001", patientName: "Aarav Sharma", patientId: "PAT-2041", age: 34, gender: "Male", testName: "USG Whole Abdomen", referringDoctor: "Dr. Meera Kapoor", receivedAt: "09:15 AM", date: "2026-10-12", status: "Report Pending", priority: "Normal" },
  { id: "USG-1002", patientName: "Priya Verma", patientId: "PAT-2042", age: 28, gender: "Female", testName: "USG Pelvis", referringDoctor: "Dr. Anil Gupta", receivedAt: "09:32 AM", date: "2026-10-12", status: "In Progress", priority: "Urgent" },
  { id: "USG-1003", patientName: "Rohan Singh", patientId: "PAT-2043", age: 46, gender: "Male", testName: "USG KUB", referringDoctor: "Dr. Neha Malhotra", receivedAt: "10:05 AM", date: "2026-10-12", status: "Completed", priority: "Normal" },
  { id: "USG-1004", patientName: "Ananya Patel", patientId: "PAT-2044", age: 31, gender: "Female", testName: "Obstetric USG", referringDoctor: "Dr. Kavita Rao", receivedAt: "10:18 AM", date: "2026-10-12", status: "In Progress", priority: "Urgent" },
  { id: "USG-1005", patientName: "Vikram Joshi", patientId: "PAT-2045", age: 52, gender: "Male", testName: "USG Thyroid", referringDoctor: "Dr. Meera Kapoor", receivedAt: "10:44 AM", date: "2026-10-11", status: "Report Pending", priority: "Normal" },
  { id: "USG-1006", patientName: "Sneha Reddy", patientId: "PAT-2046", age: 25, gender: "Female", testName: "USG Breast", referringDoctor: "Dr. Anil Gupta", receivedAt: "11:10 AM", date: "2026-10-11", status: "Completed", priority: "Normal" },
  { id: "USG-1007", patientName: "Kabir Khan", patientId: "PAT-2047", age: 39, gender: "Male", testName: "Doppler USG", referringDoctor: "Dr. Neha Malhotra", receivedAt: "11:26 AM", date: "2026-10-10", status: "Report Pending", priority: "Urgent" },
];

export const initialTemplates = [
  { id: 1, name: "Whole Abdomen", category: "Abdomen", description: "Standard whole abdomen ultrasound report", updated: "2026-10-10", active: true },
  { id: 2, name: "Pelvis", category: "Pelvis", description: "Pelvic ultrasound findings and impression", updated: "2026-10-08", active: true },
  { id: 3, name: "KUB", category: "Urology", description: "Kidneys, ureters and bladder report", updated: "2026-10-05", active: true },
  { id: 4, name: "Obstetric Scan", category: "Obstetrics", description: "Obstetric ultrasound report template", updated: "2026-10-01", active: false },
];

export const initialSignatures = [
  { id: 1, name: "Dr. Meera Kapoor", role: "Consultant Radiologist", registration: "MED-10452", email: "meera@example.com", active: true, default: true },
  { id: 2, name: "Dr. Anil Gupta", role: "Senior Radiologist", registration: "MED-20871", email: "anil@example.com", active: true, default: false },
  { id: 3, name: "Dr. Neha Malhotra", role: "Radiologist", registration: "MED-30916", email: "neha@example.com", active: false, default: false },
];