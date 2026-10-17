-- =====================================================================
--  LabLIMS - complete MySQL schema (MySQL 8.0+ recommended)
--  Run once:  mysql -u root -p < lab_lims_full_schema.sql
--  Every table uses IF NOT EXISTS, so it is safe to run again.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS lab_lims
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE lab_lims;

-- ---------------------------------------------------------------------
-- OPTIONAL RESET: only if you already ran the earlier billing/reports
-- schema and have NO real data in those tables yet. Uncomment to rebuild
-- them with the new columns used below.
-- ---------------------------------------------------------------------
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP TABLE IF EXISTS report_tests, reports, bill_transactions,
--   bill_investigations, bill_modality_payments, bills,
--   referrers, agents, employees;
-- SET FOREIGN_KEY_CHECKS = 1;


-- =====================================================================
-- 1. LAB SETUP AND SETTINGS
-- =====================================================================

-- One row only: the lab's own details (shown on bills and reports)
CREATE TABLE IF NOT EXISTS lab_profile (
  id              TINYINT      PRIMARY KEY DEFAULT 1,
  name            VARCHAR(255) NOT NULL,
  tagline         VARCHAR(255) NULL,
  address         TEXT         NULL,
  city            VARCHAR(120) NULL,
  state           VARCHAR(120) NULL,
  pincode         VARCHAR(12)  NULL,
  phone           VARCHAR(30)  NULL,
  alt_phone       VARCHAR(30)  NULL,
  email           VARCHAR(190) NULL,
  website         VARCHAR(255) NULL,
  logo_path       VARCHAR(500) NULL,
  registration_no VARCHAR(80)  NULL,
  gstin           VARCHAR(20)  NULL,
  bill_footer     TEXT         NULL,
  report_footer   TEXT         NULL,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_lab_profile_single CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS collection_centres (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(160) NOT NULL,
  address    TEXT         NULL,
  phone      VARCHAR(30)  NULL,
  active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_collection_centres_name (name)
);

-- Settings pages (lab / report / billing / notification / email preferences).
-- scope = which page, setting_key = the option, user_id 0 = applies to everyone.
CREATE TABLE IF NOT EXISTS app_settings (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id       BIGINT       NOT NULL DEFAULT 0,
  scope         VARCHAR(40)  NOT NULL,
  setting_key   VARCHAR(120) NOT NULL,
  setting_value JSON         NULL,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_app_settings (user_id, scope, setting_key),
  KEY idx_app_settings_scope (scope)
);


-- =====================================================================
-- 2. LOGIN, SECURITY AND ACCESS
-- =====================================================================

-- People and roles in the lab (same shape the backend already uses)
CREATE TABLE IF NOT EXISTS employees (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(255) NULL,
  first_name  VARCHAR(120) NULL,
  last_name   VARCHAR(120) NULL,
  email       VARCHAR(190) NOT NULL,
  mobile      VARCHAR(20)  NULL,
  role        VARCHAR(80)  NULL,
  active      BOOLEAN      NOT NULL DEFAULT TRUE,
  is_owner    BOOLEAN      NOT NULL DEFAULT FALSE,
  permissions JSON         NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_employees_email (email)
);

-- Login credentials (password is always a bcrypt hash)
CREATE TABLE IF NOT EXISTS users (
  id                BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id       BIGINT       NULL,
  name              VARCHAR(255) NOT NULL,
  email             VARCHAR(190) NOT NULL,
  mobile            VARCHAR(20)  NULL,
  password_hash     VARCHAR(255) NOT NULL,
  role              VARCHAR(30)  NOT NULL DEFAULT 'owner',
  email_verified_at DATETIME     NULL,
  mobile_verified_at DATETIME    NULL,
  active            BOOLEAN      NOT NULL DEFAULT TRUE,
  failed_login_count INT         NOT NULL DEFAULT 0,
  locked_until      DATETIME     NULL,
  last_login_at     DATETIME     NULL,
  created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_mobile (mobile),
  KEY idx_users_employee (employee_id)
);

-- Email / SMS one-time passwords (login, signup, password reset)
CREATE TABLE IF NOT EXISTS user_otps (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id     BIGINT       NULL,
  channel     ENUM('email','sms') NOT NULL,
  destination VARCHAR(190) NOT NULL,
  purpose     ENUM('login','signup','password_reset','verify') NOT NULL,
  code_hash   VARCHAR(255) NOT NULL,
  attempts    INT          NOT NULL DEFAULT 0,
  expires_at  DATETIME     NOT NULL,
  consumed_at DATETIME     NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_user_otps_lookup (destination, purpose),
  KEY idx_user_otps_expires (expires_at)
);

-- Where the user is logged in (Manage > Browser security)
CREATE TABLE IF NOT EXISTS auth_sessions (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id      BIGINT       NOT NULL,
  token_id     CHAR(36)     NOT NULL,
  user_agent   VARCHAR(500) NULL,
  ip_address   VARCHAR(64)  NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at DATETIME     NULL,
  expires_at   DATETIME     NOT NULL,
  revoked_at   DATETIME     NULL,
  UNIQUE KEY uq_auth_sessions_token (token_id),
  KEY idx_auth_sessions_user (user_id),
  CONSTRAINT fk_auth_sessions_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ip_allowlist (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  ip_address VARCHAR(64)  NOT NULL,
  label      VARCHAR(160) NULL,
  active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ip_allowlist (ip_address)
);


-- =====================================================================
-- 3. PEOPLE: REFERRERS, AGENTS, PATIENTS, OUTSOURCE LABS
-- =====================================================================

CREATE TABLE IF NOT EXISTS referrers (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  title      VARCHAR(20)  NULL,
  first_name VARCHAR(120) NULL,
  last_name  VARCHAR(120) NULL,
  name       VARCHAR(255) NULL,
  degree     VARCHAR(120) NULL,
  mobile     VARCHAR(20)  NULL,
  email      VARCHAR(190) NULL,
  address    TEXT         NULL,
  active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agents (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(255) NULL,
  active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Referring doctors who can log in to view their patients' reports
CREATE TABLE IF NOT EXISTS doctor_access (
  id                   BIGINT PRIMARY KEY AUTO_INCREMENT,
  referrer_id          BIGINT       NULL,
  name                 VARCHAR(255) NOT NULL,
  email                VARCHAR(190) NOT NULL,
  mobile               VARCHAR(20)  NULL,
  password_hash        VARCHAR(255) NOT NULL,
  can_view_reports     BOOLEAN      NOT NULL DEFAULT TRUE,
  can_download_reports BOOLEAN      NOT NULL DEFAULT TRUE,
  active               BOOLEAN      NOT NULL DEFAULT TRUE,
  last_login_at        DATETIME     NULL,
  created_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_doctor_access_email (email),
  KEY idx_doctor_access_referrer (referrer_id)
);

CREATE TABLE IF NOT EXISTS patients (
  id                BIGINT PRIMARY KEY AUTO_INCREMENT,
  uhid              VARCHAR(60)  NULL,
  title             VARCHAR(20)  NULL,
  first_name        VARCHAR(120) NOT NULL,
  last_name         VARCHAR(120) NULL,
  sex               VARCHAR(20)  NULL,
  years             INT          NULL,
  months            INT          NULL,
  days              INT          NULL,
  date_of_birth     DATE         NULL,
  mobile            VARCHAR(20)  NOT NULL,
  email             VARCHAR(190) NULL,
  address           TEXT         NULL,
  aadhaar           VARCHAR(12)  NULL,
  history           TEXT         NULL,
  online_report     BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_patients_uhid (uhid),
  KEY idx_patients_mobile (mobile),
  KEY idx_patients_name (first_name, last_name)
);

CREATE TABLE IF NOT EXISTS outsource_labs (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(255) NOT NULL,
  contact    VARCHAR(160) NULL,
  mobile     VARCHAR(20)  NULL,
  email      VARCHAR(190) NULL,
  address    TEXT         NULL,
  active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_outsource_labs_name (name)
);


-- =====================================================================
-- 4. TEST CATALOG (Lab > Categories, Test database, Packages, Panels...)
-- =====================================================================

-- Same definition you already have
CREATE TABLE IF NOT EXISTS test_categories (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(160) NOT NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_test_categories_name (name),
  KEY idx_test_categories_order (sort_order),
  KEY idx_test_categories_active (active)
);

CREATE TABLE IF NOT EXISTS units (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(60)  NOT NULL,
  active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_units_name (name)
);

-- How a result is entered: numeric, text, dropdown, ...
CREATE TABLE IF NOT EXISTS input_types (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  code       VARCHAR(40)  NOT NULL,
  name       VARCHAR(120) NOT NULL,
  active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_input_types_code (code)
);

CREATE TABLE IF NOT EXISTS tests (
  id                 BIGINT PRIMARY KEY AUTO_INCREMENT,
  category_id        BIGINT        NULL,
  code               VARCHAR(40)   NULL,
  name               VARCHAR(255)  NOT NULL,
  short_name         VARCHAR(80)   NULL,
  department         VARCHAR(30)   NOT NULL DEFAULT 'lab',   -- lab, usg, xray, ctScan, mri, ...
  test_type          VARCHAR(30)   NOT NULL DEFAULT 'single',
  price              DECIMAL(12,2) NOT NULL DEFAULT 0,
  sample_type        VARCHAR(80)   NULL,
  container          VARCHAR(80)   NULL,
  method             VARCHAR(160)  NULL,
  turnaround_hours   INT           NULL,
  is_outsource       BOOLEAN       NOT NULL DEFAULT FALSE,
  outsource_lab_id   BIGINT        NULL,
  description        TEXT          NULL,
  patient_instructions TEXT        NULL,
  sort_order         INT           NOT NULL DEFAULT 0,
  active             BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_tests_name (name),
  KEY idx_tests_category (category_id),
  KEY idx_tests_department (department),
  KEY idx_tests_active (active),
  CONSTRAINT fk_tests_category
    FOREIGN KEY (category_id) REFERENCES test_categories (id) ON DELETE SET NULL,
  CONSTRAINT fk_tests_outsource_lab
    FOREIGN KEY (outsource_lab_id) REFERENCES outsource_labs (id) ON DELETE SET NULL
);

-- The result fields of a test (e.g. Hemoglobin, TLC inside a CBC)
CREATE TABLE IF NOT EXISTS test_parameters (
  id             BIGINT PRIMARY KEY AUTO_INCREMENT,
  test_id        BIGINT       NOT NULL,
  parent_id      BIGINT       NULL,
  name           VARCHAR(255) NOT NULL,
  input_type_id  BIGINT       NULL,
  unit_id        BIGINT       NULL,
  decimals       TINYINT      NULL,
  option_values  JSON         NULL,      -- choices for dropdown inputs
  default_value  VARCHAR(255) NULL,
  formula        VARCHAR(500) NULL,      -- for calculated results
  is_heading     BOOLEAN      NOT NULL DEFAULT FALSE,
  is_required    BOOLEAN      NOT NULL DEFAULT FALSE,
  show_in_report BOOLEAN      NOT NULL DEFAULT TRUE,
  sort_order     INT          NOT NULL DEFAULT 0,
  KEY idx_test_parameters_test (test_id, sort_order),
  CONSTRAINT fk_test_parameters_test
    FOREIGN KEY (test_id) REFERENCES tests (id) ON DELETE CASCADE,
  CONSTRAINT fk_test_parameters_input_type
    FOREIGN KEY (input_type_id) REFERENCES input_types (id) ON DELETE SET NULL,
  CONSTRAINT fk_test_parameters_unit
    FOREIGN KEY (unit_id) REFERENCES units (id) ON DELETE SET NULL
);

-- Normal ranges, by sex and age
CREATE TABLE IF NOT EXISTS test_reference_ranges (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  parameter_id  BIGINT        NOT NULL,
  sex           ENUM('ANY','MALE','FEMALE','OTHER') NOT NULL DEFAULT 'ANY',
  age_from_days INT           NOT NULL DEFAULT 0,
  age_to_days   INT           NULL,
  low_value     DECIMAL(14,4) NULL,
  high_value    DECIMAL(14,4) NULL,
  critical_low  DECIMAL(14,4) NULL,
  critical_high DECIMAL(14,4) NULL,
  range_text    VARCHAR(255)  NULL,
  notes         VARCHAR(255)  NULL,
  KEY idx_reference_ranges_parameter (parameter_id),
  CONSTRAINT fk_reference_ranges_parameter
    FOREIGN KEY (parameter_id) REFERENCES test_parameters (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS interpretations (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  test_id    BIGINT       NULL,
  name       VARCHAR(255) NOT NULL,
  content    MEDIUMTEXT   NOT NULL,
  active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_interpretations_test (test_id),
  CONSTRAINT fk_interpretations_test
    FOREIGN KEY (test_id) REFERENCES tests (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS test_packages (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  code        VARCHAR(40)   NULL,
  name        VARCHAR(255)  NOT NULL,
  price       DECIMAL(12,2) NOT NULL DEFAULT 0,
  description TEXT          NULL,
  active      BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_test_packages_name (name)
);

CREATE TABLE IF NOT EXISTS test_package_items (
  package_id BIGINT NOT NULL,
  test_id    BIGINT NOT NULL,
  sort_order INT    NOT NULL DEFAULT 0,
  PRIMARY KEY (package_id, test_id),
  CONSTRAINT fk_package_items_package
    FOREIGN KEY (package_id) REFERENCES test_packages (id) ON DELETE CASCADE,
  CONSTRAINT fk_package_items_test
    FOREIGN KEY (test_id) REFERENCES tests (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS test_panels (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  code        VARCHAR(40)   NULL,
  name        VARCHAR(255)  NOT NULL,
  price       DECIMAL(12,2) NOT NULL DEFAULT 0,
  description TEXT          NULL,
  active      BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_test_panels_name (name)
);

CREATE TABLE IF NOT EXISTS test_panel_items (
  panel_id   BIGINT NOT NULL,
  test_id    BIGINT NOT NULL,
  sort_order INT    NOT NULL DEFAULT 0,
  PRIMARY KEY (panel_id, test_id),
  CONSTRAINT fk_panel_items_panel
    FOREIGN KEY (panel_id) REFERENCES test_panels (id) ON DELETE CASCADE,
  CONSTRAINT fk_panel_items_test
    FOREIGN KEY (test_id) REFERENCES tests (id) ON DELETE CASCADE
);


-- =====================================================================
-- 5. BILLING (Cases > New bill, Bills, Transactions)
-- =====================================================================

CREATE TABLE IF NOT EXISTS bills (
  id                BIGINT PRIMARY KEY AUTO_INCREMENT,
  reg_no            VARCHAR(20)   NOT NULL,
  case_no           VARCHAR(20)   NOT NULL,
  status            VARCHAR(20)   NOT NULL DEFAULT 'Active',
  cancel_reason     VARCHAR(255)  NULL,

  patient_id        BIGINT        NULL,
  patient_name      VARCHAR(255)  NOT NULL,
  patient_details   JSON          NULL,
  mobile            VARCHAR(20)   NOT NULL DEFAULT '',
  uhid              VARCHAR(60)   NULL,
  age               VARCHAR(60)   NULL,
  sex               VARCHAR(20)   NULL,
  online_report     BOOLEAN       NOT NULL DEFAULT FALSE,

  referrer_id       BIGINT        NULL,
  referrer          VARCHAR(255)  NOT NULL DEFAULT 'Self',
  agent_id          BIGINT        NULL,
  agent_name        VARCHAR(255)  NULL,
  collection_centre VARCHAR(120)  NULL,

  total             DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount          DECIMAL(12,2) NOT NULL DEFAULT 0,
  received          DECIMAL(12,2) NOT NULL DEFAULT 0,
  balance           DECIMAL(12,2) NOT NULL DEFAULT 0,
  collection_charge DECIMAL(12,2) NOT NULL DEFAULT 0,
  mode              VARCHAR(30)   NOT NULL DEFAULT 'cash',
  remarks           TEXT          NULL,
  payment           JSON          NULL,

  created_by        VARCHAR(255)  NULL,
  created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_bills_reg_no (reg_no),
  KEY idx_bills_patient (patient_id),
  KEY idx_bills_mobile (mobile),
  KEY idx_bills_status (status),
  KEY idx_bills_referrer (referrer_id),
  KEY idx_bills_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS bill_investigations (
  id                  BIGINT PRIMARY KEY AUTO_INCREMENT,
  bill_id             BIGINT        NOT NULL,
  sort_order          INT           NOT NULL DEFAULT 0,
  test_id             BIGINT        NULL,
  modality            VARCHAR(30)   NOT NULL DEFAULT 'lab',
  section             VARCHAR(80)   NULL,
  name                VARCHAR(255)  NOT NULL,
  price               DECIMAL(12,2) NOT NULL DEFAULT 0,
  unit                VARCHAR(60)   NULL,
  reference           VARCHAR(255)  NULL,
  status              VARCHAR(30)   NOT NULL DEFAULT 'Pending',
  sample_collected_at DATETIME      NULL,
  KEY idx_bill_investigations_bill (bill_id),
  KEY idx_bill_investigations_test (test_id),
  KEY idx_bill_investigations_modality (modality),
  CONSTRAINT fk_bill_investigations_bill
    FOREIGN KEY (bill_id) REFERENCES bills (id) ON DELETE CASCADE
);

-- The Paid / Discount boxes of each modality section on the bill form
CREATE TABLE IF NOT EXISTS bill_modality_payments (
  bill_id  BIGINT        NOT NULL,
  modality VARCHAR(30)   NOT NULL,
  paid     DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount DECIMAL(12,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (bill_id, modality),
  CONSTRAINT fk_bill_modality_payments_bill
    FOREIGN KEY (bill_id) REFERENCES bills (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bill_transactions (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  bill_id     BIGINT        NOT NULL,
  tx_no       INT           NOT NULL DEFAULT 1,
  amount      DECIMAL(12,2) NOT NULL DEFAULT 0,
  mode        VARCHAR(30)   NOT NULL DEFAULT 'cash',
  received_by VARCHAR(255)  NULL,
  paid_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_bill_transactions_bill (bill_id),
  KEY idx_bill_transactions_paid_at (paid_at),
  CONSTRAINT fk_bill_transactions_bill
    FOREIGN KEY (bill_id) REFERENCES bills (id) ON DELETE CASCADE
);


-- =====================================================================
-- 6. LAB REPORTS (Lab > Today's reports, Search reports)
-- =====================================================================

CREATE TABLE IF NOT EXISTS reports (
  id             BIGINT PRIMARY KEY AUTO_INCREMENT,
  bill_id        BIGINT       NOT NULL,
  reg_no         VARCHAR(20)  NOT NULL,
  patient        VARCHAR(255) NOT NULL,
  age            VARCHAR(60)  NULL,
  referrer       VARCHAR(255) NULL,
  status         VARCHAR(30)  NOT NULL DEFAULT 'New',
  interpretation TEXT         NULL,
  notes          TEXT         NULL,
  verified_by    VARCHAR(255) NULL,
  reported_at    DATETIME     NULL,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_reports_bill (bill_id),
  KEY idx_reports_status (status),
  KEY idx_reports_created_at (created_at),
  CONSTRAINT fk_reports_bill
    FOREIGN KEY (bill_id) REFERENCES bills (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS report_tests (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  report_id    BIGINT       NOT NULL,
  test_no      INT          NOT NULL,
  sort_order   INT          NOT NULL DEFAULT 0,
  test_id      BIGINT       NULL,
  parameter_id BIGINT       NULL,
  section      VARCHAR(80)  NULL,
  name         VARCHAR(255) NOT NULL,
  value        VARCHAR(255) NULL,
  unit         VARCHAR(60)  NULL,
  reference    VARCHAR(255) NULL,
  flag         VARCHAR(10)  NULL,          -- H, L, N, C ...
  KEY idx_report_tests_report (report_id),
  CONSTRAINT fk_report_tests_report
    FOREIGN KEY (report_id) REFERENCES reports (id) ON DELETE CASCADE
);


-- =====================================================================
-- 7. USG, X-RAY, CT AND OTHER RADIOLOGY REPORTS
-- =====================================================================

-- modality uses the same keys as the bill form: usg, xray, digitalXray, ctScan, mri, ...
CREATE TABLE IF NOT EXISTS radiology_templates (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  modality   VARCHAR(30)  NOT NULL,
  name       VARCHAR(255) NOT NULL,
  body       MEDIUMTEXT   NOT NULL,
  active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_radiology_templates_modality (modality)
);

CREATE TABLE IF NOT EXISTS radiology_signatures (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  modality        VARCHAR(30)  NOT NULL,
  doctor_name     VARCHAR(255) NOT NULL,
  qualification   VARCHAR(255) NULL,
  registration_no VARCHAR(80)  NULL,
  signature_path  VARCHAR(500) NULL,
  is_default      BOOLEAN      NOT NULL DEFAULT FALSE,
  active          BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_radiology_signatures_modality (modality)
);

-- One row per scan on a bill (today's cases / search cases)
CREATE TABLE IF NOT EXISTS radiology_reports (
  id                    BIGINT PRIMARY KEY AUTO_INCREMENT,
  bill_id               BIGINT       NOT NULL,
  bill_investigation_id BIGINT       NULL,
  modality              VARCHAR(30)  NOT NULL,
  study_name            VARCHAR(255) NOT NULL,
  template_id           BIGINT       NULL,
  signature_id          BIGINT       NULL,
  findings              MEDIUMTEXT   NULL,
  impression            TEXT         NULL,
  status                VARCHAR(30)  NOT NULL DEFAULT 'New',
  reported_by           VARCHAR(255) NULL,
  reported_at           DATETIME     NULL,
  created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_radiology_reports_bill (bill_id),
  KEY idx_radiology_reports_modality (modality, status),
  KEY idx_radiology_reports_created_at (created_at),
  CONSTRAINT fk_radiology_reports_bill
    FOREIGN KEY (bill_id) REFERENCES bills (id) ON DELETE CASCADE,
  CONSTRAINT fk_radiology_reports_template
    FOREIGN KEY (template_id) REFERENCES radiology_templates (id) ON DELETE SET NULL,
  CONSTRAINT fk_radiology_reports_signature
    FOREIGN KEY (signature_id) REFERENCES radiology_signatures (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS radiology_images (
  id                  BIGINT PRIMARY KEY AUTO_INCREMENT,
  radiology_report_id BIGINT       NOT NULL,
  file_path           VARCHAR(500) NOT NULL,
  caption             VARCHAR(255) NULL,
  created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_radiology_images_report (radiology_report_id),
  CONSTRAINT fk_radiology_images_report
    FOREIGN KEY (radiology_report_id) REFERENCES radiology_reports (id) ON DELETE CASCADE
);

-- Tests sent to another lab (Cases > Outsource cases)
CREATE TABLE IF NOT EXISTS outsource_cases (
  id                    BIGINT PRIMARY KEY AUTO_INCREMENT,
  bill_id               BIGINT        NOT NULL,
  bill_investigation_id BIGINT        NULL,
  outsource_lab_id      BIGINT        NULL,
  test_name             VARCHAR(255)  NOT NULL,
  sent_at               DATETIME      NULL,
  received_at           DATETIME      NULL,
  cost                  DECIMAL(12,2) NOT NULL DEFAULT 0,
  status                VARCHAR(30)   NOT NULL DEFAULT 'Pending',
  remarks               TEXT          NULL,
  created_at            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_outsource_cases_bill (bill_id),
  KEY idx_outsource_cases_status (status),
  CONSTRAINT fk_outsource_cases_bill
    FOREIGN KEY (bill_id) REFERENCES bills (id) ON DELETE CASCADE,
  CONSTRAINT fk_outsource_cases_lab
    FOREIGN KEY (outsource_lab_id) REFERENCES outsource_labs (id) ON DELETE SET NULL
);


-- =====================================================================
-- 8. BUSINESS, ACTIVITY AND SUPPORT
-- =====================================================================

CREATE TABLE IF NOT EXISTS expense_categories (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(120) NOT NULL,
  active     BOOLEAN      NOT NULL DEFAULT TRUE,
  UNIQUE KEY uq_expense_categories_name (name)
);

CREATE TABLE IF NOT EXISTS expenses (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  category_id  BIGINT        NULL,
  expense_date DATE          NOT NULL,
  title        VARCHAR(255)  NOT NULL,
  amount       DECIMAL(12,2) NOT NULL DEFAULT 0,
  mode         VARCHAR(30)   NOT NULL DEFAULT 'cash',
  paid_to      VARCHAR(255)  NULL,
  notes        TEXT          NULL,
  created_by   VARCHAR(255)  NULL,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_expenses_date (expense_date),
  KEY idx_expenses_category (category_id),
  CONSTRAINT fk_expenses_category
    FOREIGN KEY (category_id) REFERENCES expense_categories (id) ON DELETE SET NULL
);

-- Activity feed (Business > Activities, and a bill's Activities panel)
CREATE TABLE IF NOT EXISTS activities (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  bill_id    BIGINT       NULL,
  user_name  VARCHAR(255) NULL,
  type       VARCHAR(60)  NOT NULL,
  summary    VARCHAR(500) NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_activities_bill (bill_id),
  KEY idx_activities_created_at (created_at)
);

-- WhatsApp / SMS / email sent to patients
CREATE TABLE IF NOT EXISTS message_logs (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  bill_id     BIGINT       NULL,
  channel     VARCHAR(20)  NOT NULL,
  destination VARCHAR(190) NOT NULL,
  template    VARCHAR(80)  NULL,
  body        TEXT         NULL,
  status      VARCHAR(30)  NOT NULL DEFAULT 'sent',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_message_logs_bill (bill_id)
);

-- Business > Data export history
CREATE TABLE IF NOT EXISTS data_exports (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  export_type VARCHAR(60) NOT NULL,
  params     JSON         NULL,
  status     VARCHAR(30)  NOT NULL DEFAULT 'pending',
  file_path  VARCHAR(500) NULL,
  created_by VARCHAR(255) NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Manage > Referral program
CREATE TABLE IF NOT EXISTS referral_program_invites (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  code        VARCHAR(40)  NOT NULL,
  invitee     VARCHAR(190) NULL,
  status      VARCHAR(30)  NOT NULL DEFAULT 'sent',
  reward      VARCHAR(160) NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_referral_program_code (code)
);

-- Help center > Contact support
CREATE TABLE IF NOT EXISTS support_tickets (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_name  VARCHAR(255) NULL,
  email      VARCHAR(190) NULL,
  subject    VARCHAR(255) NOT NULL,
  message    TEXT         NOT NULL,
  status     VARCHAR(30)  NOT NULL DEFAULT 'open',
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Who changed what (for security and audits)
CREATE TABLE IF NOT EXISTS audit_logs (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_name  VARCHAR(255) NULL,
  action     VARCHAR(60)  NOT NULL,
  entity     VARCHAR(60)  NOT NULL,
  entity_id  VARCHAR(60)  NULL,
  details    JSON         NULL,
  ip_address VARCHAR(64)  NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_audit_logs_entity (entity, entity_id),
  KEY idx_audit_logs_created_at (created_at)
);


-- =====================================================================
-- 9. READY-MADE VIEWS FOR THE BUSINESS PAGES
-- =====================================================================

CREATE OR REPLACE VIEW v_due_bills AS
SELECT id, reg_no, patient_name, mobile, referrer, total, discount, received, balance, created_at
FROM bills
WHERE status = 'Active' AND balance > 0;

CREATE OR REPLACE VIEW v_daily_business AS
SELECT DATE(created_at) AS business_date,
       COUNT(*)         AS total_bills,
       SUM(total)       AS total_amount,
       SUM(discount)    AS discount_amount,
       SUM(received)    AS received_amount,
       SUM(balance)     AS pending_amount
FROM bills
WHERE status = 'Active'
GROUP BY DATE(created_at);

CREATE OR REPLACE VIEW v_referral_business AS
SELECT referrer_id,
       referrer         AS referrer_name,
       COUNT(*)         AS total_bills,
       SUM(total)       AS total_amount,
       SUM(received)    AS received_amount,
       SUM(balance)     AS pending_amount
FROM bills
WHERE status = 'Active'
GROUP BY referrer_id, referrer;

CREATE OR REPLACE VIEW v_test_counts AS
SELECT bi.modality,
       bi.name          AS test_name,
       COUNT(*)         AS times_ordered,
       SUM(bi.price)    AS revenue
FROM bill_investigations bi
JOIN bills b ON b.id = bi.bill_id
WHERE b.status = 'Active'
GROUP BY bi.modality, bi.name;


-- =====================================================================
-- 10. STARTING DATA
--     (referrers, agents and employees are filled by the backend on first start)
-- =====================================================================

INSERT IGNORE INTO lab_profile (id, name, address, phone)
VALUES (1, 'Advance Edge Diagnosis', 'CHS Apollo Hospital Gesa Colony, Hospital Road', '7049390120');

INSERT IGNORE INTO collection_centres (name) VALUES ('Main');

INSERT IGNORE INTO test_categories (name, sort_order) VALUES
  ('Haematology', 1), ('Biochemistry', 2), ('Serology & Immunology', 3),
  ('Clinical Pathology', 4), ('Cytology', 5), ('Microbiology', 6),
  ('Endocrinology', 7), ('Histopathology', 8), ('Others', 9), ('Miscellaneous', 10);

INSERT IGNORE INTO input_types (code, name) VALUES
  ('numeric',   'Numeric'),
  ('text',      'Text'),
  ('dropdown',  'Dropdown'),
  ('paragraph', 'Paragraph'),
  ('date',      'Date'),
  ('formula',   'Calculated (formula)'),
  ('heading',   'Heading only');

INSERT IGNORE INTO units (name) VALUES
  ('g/dL'), ('mg/dL'), ('/cumm'), ('%'), ('fL'), ('pg'), ('U/L'), ('mmol/L'),
  ('IU/mL'), ('ng/mL'), ('pg/mL'), ('µg/dL'), ('µIU/mL'), ('mIU/L'),
  ('million/cumm'), ('lakhs/cumm'), ('mm/hr'), ('sec'), ('mEq/L');

INSERT IGNORE INTO expense_categories (name) VALUES
  ('Rent'), ('Salaries'), ('Reagents and consumables'), ('Equipment and repairs'),
  ('Electricity and water'), ('Transport'), ('Marketing'), ('Miscellaneous');

INSERT IGNORE INTO app_settings (user_id, scope, setting_key, setting_value) VALUES
  (0, 'billing', 'reg_no_start',        '41025'),
  (0, 'billing', 'case_no_prefix',      '"L"'),
  (0, 'billing', 'default_payment_mode','"cash"'),
  (0, 'report',  'show_lab_logo',       'true'),
  (0, 'report',  'show_signature',      'true'),
  (0, 'notification', 'whatsapp_bill',  'true'),
  (0, 'notification', 'email_reports',  'false');

-- ---------------------------------------------------------------------
-- FIRST LOGIN USER (optional - you can also keep using ADMIN_EMAIL in .env)
-- 1) Make a hash:  node -e "console.log(require('bcryptjs').hashSync('YourPassword123', 10))"
-- 2) Run (replace the email and the hash):
--
-- INSERT INTO users (name, email, password_hash, role, email_verified_at)
-- VALUES ('Owner', 'you@example.com', '<paste bcrypt hash>', 'owner', NOW());
-- ---------------------------------------------------------------------