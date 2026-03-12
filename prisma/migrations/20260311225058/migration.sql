-- CreateTable
CREATE TABLE "AttendancePeriod" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendancePeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceSheet" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "periodId" INTEGER NOT NULL,
    "totalPresent" INTEGER NOT NULL DEFAULT 0,
    "totalLate" INTEGER NOT NULL DEFAULT 0,
    "totalEarlyLeave" INTEGER NOT NULL DEFAULT 0,
    "totalOvertime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalNotCheckedOut" INTEGER NOT NULL DEFAULT 0,
    "totalLeaveDays" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAbsentDays" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceSheet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttendancePeriod_startDate_endDate_key" ON "AttendancePeriod"("startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceSheet_employeeId_periodId_key" ON "AttendanceSheet"("employeeId", "periodId");

-- AddForeignKey
ALTER TABLE "AttendanceSheet" ADD CONSTRAINT "AttendanceSheet_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceSheet" ADD CONSTRAINT "AttendanceSheet_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "AttendancePeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
