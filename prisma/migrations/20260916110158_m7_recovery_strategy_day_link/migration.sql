-- AlterTable
ALTER TABLE "RecoveryLog" ADD COLUMN     "strategyDayId" UUID;

-- CreateIndex
CREATE INDEX "RecoveryLog_strategyDayId_idx" ON "RecoveryLog"("strategyDayId");

-- AddForeignKey
ALTER TABLE "RecoveryLog" ADD CONSTRAINT "RecoveryLog_strategyDayId_fkey" FOREIGN KEY ("strategyDayId") REFERENCES "TrainingStrategyDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
