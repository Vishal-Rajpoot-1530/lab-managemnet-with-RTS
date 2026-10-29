-- CreateTable
CREATE TABLE `super_admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(190) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `super_admins_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tenants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lab_name` VARCHAR(255) NOT NULL,
    `admin_name` VARCHAR(255) NOT NULL,
    `admin_email` VARCHAR(190) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `db_url_encrypted` TEXT NULL,
    `db_host` VARCHAR(255) NULL,
    `db_fingerprint` CHAR(64) NULL,
    `connected_at` DATETIME(3) NULL,
    `last_login_at` DATETIME(3) NULL,
    `failed_login_count` INTEGER NOT NULL DEFAULT 0,
    `locked_until` DATETIME(3) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tenants_admin_email_key`(`admin_email`),
    UNIQUE INDEX `tenants_db_fingerprint_key`(`db_fingerprint`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tenant_users` (
    `email` VARCHAR(190) NOT NULL,
    `tenant_id` INTEGER NOT NULL,

    INDEX `tenant_users_tenant_id_idx`(`tenant_id`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tenant_sessions` (
    `token_hash` CHAR(64) NOT NULL,
    `tenant_id` INTEGER NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,

    INDEX `tenant_sessions_tenant_id_idx`(`tenant_id`),
    INDEX `tenant_sessions_expires_at_idx`(`expires_at`),
    PRIMARY KEY (`token_hash`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tenant_users` ADD CONSTRAINT `tenant_users_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tenant_sessions` ADD CONSTRAINT `tenant_sessions_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
