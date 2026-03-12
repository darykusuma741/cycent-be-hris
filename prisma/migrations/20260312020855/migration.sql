/*
  Warnings:

  - Added the required column `attendancePeriodId` to the `PayrollPeriod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "allowances" INTEGER NOT NULL DEFAULT 1000000,
ADD COLUMN     "salary" INTEGER NOT NULL DEFAULT 10000000;

-- AlterTable
ALTER TABLE "PayrollPeriod" ADD COLUMN     "attendancePeriodId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PayrollPeriod" ADD CONSTRAINT "PayrollPeriod_attendancePeriodId_fkey" FOREIGN KEY ("attendancePeriodId") REFERENCES "AttendancePeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
