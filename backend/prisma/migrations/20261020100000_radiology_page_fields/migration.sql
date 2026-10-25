-- AlterTable
ALTER TABLE `radiology_templates` ADD COLUMN `category` VARCHAR(80) NOT NULL DEFAULT 'General',
    ADD COLUMN `description` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `radiology_signatures` ADD COLUMN `email` VARCHAR(190) NULL;
