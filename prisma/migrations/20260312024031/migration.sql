/*
  Warnings:

  - Added the required column `updatedAt` to the `PayrollPeriod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PayrollPeriod" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isClosed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
