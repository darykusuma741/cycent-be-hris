/*
  Warnings:

  - You are about to drop the column `shiftId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `ShiftAssignment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employeeId,startDateTime]` on the table `ShiftAssignment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endDateTime` to the `ShiftAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDateTime` to the `ShiftAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_shiftId_fkey";

-- DropIndex
DROP INDEX "ShiftAssignment_employeeId_date_key";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "shiftId";

-- AlterTable
ALTER TABLE "ShiftAssignment" DROP COLUMN "date",
ADD COLUMN     "endDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ShiftAssignment_employeeId_startDateTime_key" ON "ShiftAssignment"("employeeId", "startDateTime");
