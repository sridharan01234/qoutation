-- AlterTable
ALTER TABLE `User` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `company` VARCHAR(191) NULL,
    ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `currency` VARCHAR(191) NULL DEFAULT 'USD',
    ADD COLUMN `dateOfBirth` DATETIME(3) NULL,
    ADD COLUMN `department` VARCHAR(191) NULL,
    ADD COLUMN `displayName` VARCHAR(191) NULL,
    ADD COLUMN `emailNotifications` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `firstName` VARCHAR(191) NULL,
    ADD COLUMN `gender` ENUM('MALE', 'FEMALE', 'OTHER') NULL,
    ADD COLUMN `jobTitle` VARCHAR(191) NULL,
    ADD COLUMN `language` VARCHAR(191) NULL DEFAULT 'en',
    ADD COLUMN `lastLoginAt` DATETIME(3) NULL,
    ADD COLUMN `lastName` VARCHAR(191) NULL,
    ADD COLUMN `linkedinUrl` VARCHAR(191) NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL,
    ADD COLUMN `postalCode` VARCHAR(191) NULL,
    ADD COLUMN `smsNotifications` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `state` VARCHAR(191) NULL,
    ADD COLUMN `timezone` VARCHAR(191) NULL DEFAULT 'UTC',
    ADD COLUMN `twitterUrl` VARCHAR(191) NULL,
    ADD COLUMN `websiteUrl` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Quotation_createdAt_idx` ON `Quotation`(`createdAt`);

-- CreateIndex
CREATE INDEX `Quotation_date_idx` ON `Quotation`(`date`);
