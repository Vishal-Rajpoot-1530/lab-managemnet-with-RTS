-- AlterTable
ALTER TABLE `interpretations` ADD COLUMN `panel_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `interpretations_panel_id_idx` ON `interpretations`(`panel_id`);

-- AddForeignKey
ALTER TABLE `interpretations` ADD CONSTRAINT `interpretations_panel_id_fkey` FOREIGN KEY (`panel_id`) REFERENCES `test_panels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
