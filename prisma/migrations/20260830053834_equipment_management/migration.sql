/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UserEquipment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "isSystem" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxWeightKg" DECIMAL(6,2),
ADD COLUMN     "minWeightKg" DECIMAL(6,2),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UserEquipment" DROP COLUMN "createdAt",
ADD COLUMN     "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notes" TEXT;

-- CreateIndex
CREATE INDEX "Equipment_equipmentType_idx" ON "Equipment"("equipmentType");

-- CreateIndex
CREATE INDEX "UserEquipment_equipmentId_idx" ON "UserEquipment"("equipmentId");
