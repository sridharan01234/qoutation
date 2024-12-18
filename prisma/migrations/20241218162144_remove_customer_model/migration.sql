/*
  Warnings:

  - You are about to drop the column `customerId` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `Customer` DROP FOREIGN KEY `Customer_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Quotation` DROP FOREIGN KEY `Quotation_customerId_fkey`;

-- AlterTable
ALTER TABLE `Quotation` DROP COLUMN `customerId`;

-- DropTable
DROP TABLE `Address`;

-- DropTable
DROP TABLE `Customer`;
