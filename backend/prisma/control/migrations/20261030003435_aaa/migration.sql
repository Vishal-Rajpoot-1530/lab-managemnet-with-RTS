/*
  Warnings:

  - You are about to alter the column `title` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(160)`.
  - You are about to drop the `notification_reads` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `notification_reads` DROP FOREIGN KEY `notification_reads_notification_id_fkey`;

-- DropForeignKey
ALTER TABLE `notification_reads` DROP FOREIGN KEY `notification_reads_tenant_id_fkey`;

-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `all_labs` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `severity` VARCHAR(20) NOT NULL DEFAULT 'info',
    MODIFY `title` VARCHAR(160) NOT NULL;

-- DropTable
DROP TABLE `notification_reads`;

-- CreateTable
CREATE TABLE `notification_targets` (
    `notification_id` INTEGER NOT NULL,
    `tenant_id` INTEGER NOT NULL,

    INDEX `notification_targets_tenant_id_idx`(`tenant_id`),
    PRIMARY KEY (`notification_id`, `tenant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notification_targets` ADD CONSTRAINT `notification_targets_notification_id_fkey` FOREIGN KEY (`notification_id`) REFERENCES `notifications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification_targets` ADD CONSTRAINT `notification_targets_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
