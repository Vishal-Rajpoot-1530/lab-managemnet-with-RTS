-- CreateTable
CREATE TABLE `lab_profile` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `name` VARCHAR(255) NOT NULL,
    `tagline` VARCHAR(255) NULL,
    `address` TEXT NULL,
    `city` VARCHAR(120) NULL,
    `state` VARCHAR(120) NULL,
    `pincode` VARCHAR(12) NULL,
    `phone` VARCHAR(30) NULL,
    `alt_phone` VARCHAR(30) NULL,
    `email` VARCHAR(190) NULL,
    `website` VARCHAR(255) NULL,
    `logo_path` VARCHAR(500) NULL,
    `registration_no` VARCHAR(80) NULL,
    `gstin` VARCHAR(20) NULL,
    `bill_footer` TEXT NULL,
    `report_footer` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `collection_centres` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(160) NOT NULL,
    `address` TEXT NULL,
    `phone` VARCHAR(30) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `collection_centres_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `app_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL DEFAULT 0,
    `scope` VARCHAR(40) NOT NULL,
    `setting_key` VARCHAR(120) NOT NULL,
    `setting_value` JSON NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `app_settings_scope_idx`(`scope`),
    UNIQUE INDEX `app_settings_user_id_scope_setting_key_key`(`user_id`, `scope`, `setting_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `first_name` VARCHAR(120) NULL,
    `last_name` VARCHAR(120) NULL,
    `email` VARCHAR(190) NOT NULL,
    `mobile` VARCHAR(20) NULL,
    `role` VARCHAR(80) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `is_owner` BOOLEAN NOT NULL DEFAULT false,
    `permissions` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `employees_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(190) NOT NULL,
    `mobile` VARCHAR(20) NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` VARCHAR(30) NOT NULL DEFAULT 'owner',
    `email_verified_at` DATETIME(3) NULL,
    `mobile_verified_at` DATETIME(3) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `failed_login_count` INTEGER NOT NULL DEFAULT 0,
    `locked_until` DATETIME(3) NULL,
    `last_login_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_mobile_key`(`mobile`),
    INDEX `users_employee_id_idx`(`employee_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_otps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `channel` ENUM('email', 'sms') NOT NULL,
    `destination` VARCHAR(190) NOT NULL,
    `purpose` ENUM('login', 'signup', 'password_reset', 'verify') NOT NULL,
    `code_hash` VARCHAR(255) NOT NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `expires_at` DATETIME(3) NOT NULL,
    `consumed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_otps_destination_purpose_idx`(`destination`, `purpose`),
    INDEX `user_otps_expires_at_idx`(`expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auth_sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `token_id` CHAR(36) NOT NULL,
    `user_agent` VARCHAR(500) NULL,
    `ip_address` VARCHAR(64) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_seen_at` DATETIME(3) NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `revoked_at` DATETIME(3) NULL,

    UNIQUE INDEX `auth_sessions_token_id_key`(`token_id`),
    INDEX `auth_sessions_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ip_allowlist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ip_address` VARCHAR(64) NOT NULL,
    `label` VARCHAR(160) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ip_allowlist_ip_address_key`(`ip_address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `referrers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(20) NULL,
    `first_name` VARCHAR(120) NULL,
    `last_name` VARCHAR(120) NULL,
    `name` VARCHAR(255) NULL,
    `degree` VARCHAR(120) NULL,
    `mobile` VARCHAR(20) NULL,
    `email` VARCHAR(190) NULL,
    `address` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `doctor_access` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referrer_id` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(190) NOT NULL,
    `mobile` VARCHAR(20) NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `can_view_reports` BOOLEAN NOT NULL DEFAULT true,
    `can_download_reports` BOOLEAN NOT NULL DEFAULT true,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `last_login_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `doctor_access_email_key`(`email`),
    INDEX `doctor_access_referrer_id_idx`(`referrer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uhid` VARCHAR(60) NULL,
    `title` VARCHAR(20) NULL,
    `first_name` VARCHAR(120) NOT NULL,
    `last_name` VARCHAR(120) NULL,
    `sex` VARCHAR(20) NULL,
    `years` INTEGER NULL,
    `months` INTEGER NULL,
    `days` INTEGER NULL,
    `date_of_birth` DATE NULL,
    `mobile` VARCHAR(20) NOT NULL,
    `email` VARCHAR(190) NULL,
    `address` TEXT NULL,
    `aadhaar` VARCHAR(12) NULL,
    `history` TEXT NULL,
    `online_report` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `patients_uhid_key`(`uhid`),
    INDEX `patients_mobile_idx`(`mobile`),
    INDEX `patients_first_name_last_name_idx`(`first_name`, `last_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outsource_labs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `contact` VARCHAR(160) NULL,
    `mobile` VARCHAR(20) NULL,
    `email` VARCHAR(190) NULL,
    `address` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `outsource_labs_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(160) NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `test_categories_name_key`(`name`),
    INDEX `test_categories_sort_order_idx`(`sort_order`),
    INDEX `test_categories_active_idx`(`active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `units` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(60) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `units_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `input_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(40) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `input_types_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NULL,
    `code` VARCHAR(40) NULL,
    `name` VARCHAR(255) NOT NULL,
    `short_name` VARCHAR(80) NULL,
    `department` VARCHAR(30) NOT NULL DEFAULT 'lab',
    `test_type` VARCHAR(30) NOT NULL DEFAULT 'single',
    `price` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `sample_type` VARCHAR(80) NULL,
    `container` VARCHAR(80) NULL,
    `method` VARCHAR(160) NULL,
    `turnaround_hours` INTEGER NULL,
    `is_outsource` BOOLEAN NOT NULL DEFAULT false,
    `outsource_lab_id` INTEGER NULL,
    `description` TEXT NULL,
    `patient_instructions` TEXT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `tests_name_idx`(`name`),
    INDEX `tests_category_id_idx`(`category_id`),
    INDEX `tests_department_idx`(`department`),
    INDEX `tests_active_idx`(`active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_parameters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `test_id` INTEGER NOT NULL,
    `parent_id` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `input_type_id` INTEGER NULL,
    `unit_id` INTEGER NULL,
    `decimals` TINYINT NULL,
    `option_values` JSON NULL,
    `default_value` VARCHAR(255) NULL,
    `formula` VARCHAR(500) NULL,
    `is_heading` BOOLEAN NOT NULL DEFAULT false,
    `is_required` BOOLEAN NOT NULL DEFAULT false,
    `show_in_report` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER NOT NULL DEFAULT 0,

    INDEX `test_parameters_test_id_sort_order_idx`(`test_id`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_reference_ranges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parameter_id` INTEGER NOT NULL,
    `sex` ENUM('ANY', 'MALE', 'FEMALE', 'OTHER') NOT NULL DEFAULT 'ANY',
    `age_from_days` INTEGER NOT NULL DEFAULT 0,
    `age_to_days` INTEGER NULL,
    `low_value` DECIMAL(14, 4) NULL,
    `high_value` DECIMAL(14, 4) NULL,
    `critical_low` DECIMAL(14, 4) NULL,
    `critical_high` DECIMAL(14, 4) NULL,
    `range_text` VARCHAR(255) NULL,
    `notes` VARCHAR(255) NULL,

    INDEX `test_reference_ranges_parameter_id_idx`(`parameter_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `interpretations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `test_id` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `content` MEDIUMTEXT NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `interpretations_test_id_idx`(`test_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_packages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(40) NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `description` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `test_packages_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_package_items` (
    `package_id` INTEGER NOT NULL,
    `test_id` INTEGER NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`package_id`, `test_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_panels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(40) NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `description` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `test_panels_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_panel_items` (
    `panel_id` INTEGER NOT NULL,
    `test_id` INTEGER NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`panel_id`, `test_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reg_no` VARCHAR(20) NOT NULL,
    `case_no` VARCHAR(20) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'Active',
    `cancel_reason` VARCHAR(255) NULL,
    `patient_id` INTEGER NULL,
    `patient_name` VARCHAR(255) NOT NULL,
    `patient_details` JSON NULL,
    `mobile` VARCHAR(20) NOT NULL DEFAULT '',
    `uhid` VARCHAR(60) NULL,
    `age` VARCHAR(60) NULL,
    `sex` VARCHAR(20) NULL,
    `online_report` BOOLEAN NOT NULL DEFAULT false,
    `referrer_id` INTEGER NULL,
    `referrer` VARCHAR(255) NOT NULL DEFAULT 'Self',
    `agent_id` INTEGER NULL,
    `agent_name` VARCHAR(255) NULL,
    `collection_centre` VARCHAR(120) NULL,
    `total` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `discount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `received` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `balance` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `collection_charge` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `mode` VARCHAR(30) NOT NULL DEFAULT 'cash',
    `remarks` TEXT NULL,
    `payment` JSON NULL,
    `created_by` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `bills_reg_no_key`(`reg_no`),
    INDEX `bills_patient_id_idx`(`patient_id`),
    INDEX `bills_mobile_idx`(`mobile`),
    INDEX `bills_status_idx`(`status`),
    INDEX `bills_referrer_id_idx`(`referrer_id`),
    INDEX `bills_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bill_investigations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bill_id` INTEGER NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `test_id` INTEGER NULL,
    `modality` VARCHAR(30) NOT NULL DEFAULT 'lab',
    `section` VARCHAR(80) NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `unit` VARCHAR(60) NULL,
    `reference` VARCHAR(255) NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'Pending',
    `sample_collected_at` DATETIME(3) NULL,

    INDEX `bill_investigations_bill_id_idx`(`bill_id`),
    INDEX `bill_investigations_test_id_idx`(`test_id`),
    INDEX `bill_investigations_modality_idx`(`modality`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bill_modality_payments` (
    `bill_id` INTEGER NOT NULL,
    `modality` VARCHAR(30) NOT NULL,
    `paid` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `discount` DECIMAL(12, 2) NOT NULL DEFAULT 0,

    PRIMARY KEY (`bill_id`, `modality`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bill_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bill_id` INTEGER NOT NULL,
    `tx_no` INTEGER NOT NULL DEFAULT 1,
    `amount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `mode` VARCHAR(30) NOT NULL DEFAULT 'cash',
    `received_by` VARCHAR(255) NULL,
    `paid_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `bill_transactions_bill_id_idx`(`bill_id`),
    INDEX `bill_transactions_paid_at_idx`(`paid_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bill_id` INTEGER NOT NULL,
    `reg_no` VARCHAR(20) NOT NULL,
    `patient` VARCHAR(255) NOT NULL,
    `age` VARCHAR(60) NULL,
    `referrer` VARCHAR(255) NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'New',
    `interpretation` TEXT NULL,
    `notes` TEXT NULL,
    `verified_by` VARCHAR(255) NULL,
    `reported_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `reports_bill_id_key`(`bill_id`),
    INDEX `reports_status_idx`(`status`),
    INDEX `reports_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report_tests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `report_id` INTEGER NOT NULL,
    `test_no` INTEGER NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `test_id` INTEGER NULL,
    `parameter_id` INTEGER NULL,
    `section` VARCHAR(80) NULL,
    `name` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NULL,
    `unit` VARCHAR(60) NULL,
    `reference` VARCHAR(255) NULL,
    `flag` VARCHAR(10) NULL,

    INDEX `report_tests_report_id_idx`(`report_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `radiology_templates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modality` VARCHAR(30) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `body` MEDIUMTEXT NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `radiology_templates_modality_idx`(`modality`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `radiology_signatures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modality` VARCHAR(30) NOT NULL,
    `doctor_name` VARCHAR(255) NOT NULL,
    `qualification` VARCHAR(255) NULL,
    `registration_no` VARCHAR(80) NULL,
    `signature_path` VARCHAR(500) NULL,
    `is_default` BOOLEAN NOT NULL DEFAULT false,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `radiology_signatures_modality_idx`(`modality`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `radiology_reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bill_id` INTEGER NOT NULL,
    `bill_investigation_id` INTEGER NULL,
    `modality` VARCHAR(30) NOT NULL,
    `study_name` VARCHAR(255) NOT NULL,
    `template_id` INTEGER NULL,
    `signature_id` INTEGER NULL,
    `findings` MEDIUMTEXT NULL,
    `impression` TEXT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'New',
    `reported_by` VARCHAR(255) NULL,
    `reported_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `radiology_reports_bill_id_idx`(`bill_id`),
    INDEX `radiology_reports_modality_status_idx`(`modality`, `status`),
    INDEX `radiology_reports_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `radiology_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `radiology_report_id` INTEGER NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `caption` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `radiology_images_radiology_report_id_idx`(`radiology_report_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outsource_cases` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bill_id` INTEGER NOT NULL,
    `bill_investigation_id` INTEGER NULL,
    `outsource_lab_id` INTEGER NULL,
    `test_name` VARCHAR(255) NOT NULL,
    `sent_at` DATETIME(3) NULL,
    `received_at` DATETIME(3) NULL,
    `cost` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `status` VARCHAR(30) NOT NULL DEFAULT 'Pending',
    `remarks` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `outsource_cases_bill_id_idx`(`bill_id`),
    INDEX `outsource_cases_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expense_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `expense_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expenses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NULL,
    `expense_date` DATE NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `mode` VARCHAR(30) NOT NULL DEFAULT 'cash',
    `paid_to` VARCHAR(255) NULL,
    `notes` TEXT NULL,
    `created_by` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `expenses_expense_date_idx`(`expense_date`),
    INDEX `expenses_category_id_idx`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bill_id` INTEGER NULL,
    `user_name` VARCHAR(255) NULL,
    `type` VARCHAR(60) NOT NULL,
    `summary` VARCHAR(500) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `activities_bill_id_idx`(`bill_id`),
    INDEX `activities_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bill_id` INTEGER NULL,
    `channel` VARCHAR(20) NOT NULL,
    `destination` VARCHAR(190) NOT NULL,
    `template` VARCHAR(80) NULL,
    `body` TEXT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'sent',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `message_logs_bill_id_idx`(`bill_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_exports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `export_type` VARCHAR(60) NOT NULL,
    `params` JSON NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'pending',
    `file_path` VARCHAR(500) NULL,
    `created_by` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `referral_program_invites` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(40) NOT NULL,
    `invitee` VARCHAR(190) NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'sent',
    `reward` VARCHAR(160) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `referral_program_invites_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `support_tickets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(255) NULL,
    `email` VARCHAR(190) NULL,
    `subject` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'open',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(255) NULL,
    `action` VARCHAR(60) NOT NULL,
    `entity` VARCHAR(60) NOT NULL,
    `entity_id` VARCHAR(60) NULL,
    `details` JSON NULL,
    `ip_address` VARCHAR(64) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_entity_entity_id_idx`(`entity`, `entity_id`),
    INDEX `audit_logs_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `auth_sessions` ADD CONSTRAINT `auth_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tests` ADD CONSTRAINT `tests_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `test_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tests` ADD CONSTRAINT `tests_outsource_lab_id_fkey` FOREIGN KEY (`outsource_lab_id`) REFERENCES `outsource_labs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_parameters` ADD CONSTRAINT `test_parameters_test_id_fkey` FOREIGN KEY (`test_id`) REFERENCES `tests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_parameters` ADD CONSTRAINT `test_parameters_input_type_id_fkey` FOREIGN KEY (`input_type_id`) REFERENCES `input_types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_parameters` ADD CONSTRAINT `test_parameters_unit_id_fkey` FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_reference_ranges` ADD CONSTRAINT `test_reference_ranges_parameter_id_fkey` FOREIGN KEY (`parameter_id`) REFERENCES `test_parameters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `interpretations` ADD CONSTRAINT `interpretations_test_id_fkey` FOREIGN KEY (`test_id`) REFERENCES `tests`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_package_items` ADD CONSTRAINT `test_package_items_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `test_packages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_package_items` ADD CONSTRAINT `test_package_items_test_id_fkey` FOREIGN KEY (`test_id`) REFERENCES `tests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_panel_items` ADD CONSTRAINT `test_panel_items_panel_id_fkey` FOREIGN KEY (`panel_id`) REFERENCES `test_panels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test_panel_items` ADD CONSTRAINT `test_panel_items_test_id_fkey` FOREIGN KEY (`test_id`) REFERENCES `tests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bill_investigations` ADD CONSTRAINT `bill_investigations_bill_id_fkey` FOREIGN KEY (`bill_id`) REFERENCES `bills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bill_modality_payments` ADD CONSTRAINT `bill_modality_payments_bill_id_fkey` FOREIGN KEY (`bill_id`) REFERENCES `bills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bill_transactions` ADD CONSTRAINT `bill_transactions_bill_id_fkey` FOREIGN KEY (`bill_id`) REFERENCES `bills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_bill_id_fkey` FOREIGN KEY (`bill_id`) REFERENCES `bills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report_tests` ADD CONSTRAINT `report_tests_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `radiology_reports` ADD CONSTRAINT `radiology_reports_bill_id_fkey` FOREIGN KEY (`bill_id`) REFERENCES `bills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `radiology_reports` ADD CONSTRAINT `radiology_reports_template_id_fkey` FOREIGN KEY (`template_id`) REFERENCES `radiology_templates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `radiology_reports` ADD CONSTRAINT `radiology_reports_signature_id_fkey` FOREIGN KEY (`signature_id`) REFERENCES `radiology_signatures`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `radiology_images` ADD CONSTRAINT `radiology_images_radiology_report_id_fkey` FOREIGN KEY (`radiology_report_id`) REFERENCES `radiology_reports`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outsource_cases` ADD CONSTRAINT `outsource_cases_bill_id_fkey` FOREIGN KEY (`bill_id`) REFERENCES `bills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `outsource_cases` ADD CONSTRAINT `outsource_cases_outsource_lab_id_fkey` FOREIGN KEY (`outsource_lab_id`) REFERENCES `outsource_labs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `expense_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
