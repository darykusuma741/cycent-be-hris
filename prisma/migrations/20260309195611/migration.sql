/*
  Warnings:

  - You are about to drop the column `officeLocationId` on the `Attendance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_officeLocationId_fkey";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "officeLocationId",
ADD COLUMN     "checkInOfficeId" INTEGER,
ADD COLUMN     "checkOutOfficeId" INTEGER;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_checkInOfficeId_fkey" FOREIGN KEY ("checkInOfficeId") REFERENCES "OfficeLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_checkOutOfficeId_fkey" FOREIGN KEY ("checkOutOfficeId") REFERENCES "OfficeLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
