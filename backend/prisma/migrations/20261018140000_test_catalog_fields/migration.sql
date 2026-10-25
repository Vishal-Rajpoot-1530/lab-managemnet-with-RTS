-- AlterTable
ALTER TABLE `tests` ADD COLUMN `display_name` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `instrument` VARCHAR(160) NULL;

-- AlterTable
ALTER TABLE `test_parameters` ADD COLUMN `group_by` VARCHAR(160) NULL;
