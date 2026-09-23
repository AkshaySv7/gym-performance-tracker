-- CreateEnum
CREATE TYPE "StrategyDayType" AS ENUM ('WORKOUT', 'REST');

-- AlterTable
ALTER TABLE "TrainingStrategyDay" ADD COLUMN     "dayType" "StrategyDayType" NOT NULL DEFAULT 'WORKOUT',
ADD COLUMN     "focusMuscleGroups" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "RecoveryLog" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "recoveryDate" DATE NOT NULL,
    "sleepHours" DECIMAL(4,2),
    "energyLevel" INTEGER,
    "sorenessLevel" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecoveryLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecoveryLog_userId_recoveryDate_idx" ON "RecoveryLog"("userId", "recoveryDate");

-- CreateIndex
CREATE UNIQUE INDEX "RecoveryLog_userId_recoveryDate_key" ON "RecoveryLog"("userId", "recoveryDate");

-- AddForeignKey
ALTER TABLE "RecoveryLog" ADD CONSTRAINT "RecoveryLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
