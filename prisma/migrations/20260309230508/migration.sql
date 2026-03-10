-- CreateTable
CREATE TABLE "Leave" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "leaveType" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalDays" DOUBLE PRECISION,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "approvedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leave_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Leave_employeeId_idx" ON "Leave"("employeeId");

-- CreateIndex
CREATE INDEX "Leave_status_idx" ON "Leave"("status");

-- AddForeignKey
ALTER TABLE "Leave" ADD CONSTRAINT "Leave_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leave" ADD CONSTRAINT "Leave_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
