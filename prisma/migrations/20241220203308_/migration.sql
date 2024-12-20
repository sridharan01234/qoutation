-- AlterTable
ALTER TABLE `quotation` ADD COLUMN `statusChangedBy` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Quotation` ADD CONSTRAINT `Quotation_statusChangedBy_fkey` FOREIGN KEY (`statusChangedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
