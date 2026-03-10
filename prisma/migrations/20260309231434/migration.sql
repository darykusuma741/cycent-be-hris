/*
  Warnings:

  - A unique constraint covering the columns `[leaveType]` on the table `LeavePolicy` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LeavePolicy_leaveType_key" ON "LeavePolicy"("leaveType");
