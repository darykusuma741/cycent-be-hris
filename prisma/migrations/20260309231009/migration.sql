-- CreateTable
CREATE TABLE "LeavePolicy" (
    "id" SERIAL NOT NULL,
    "leaveType" TEXT NOT NULL,
    "annualQuota" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeavePolicy_pkey" PRIMARY KEY ("id")
);
