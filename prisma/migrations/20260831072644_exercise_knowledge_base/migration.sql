/*
  Warnings:

  - You are about to drop the column `exerciseWarmupId` on the `WorkoutWarmup` table. All the data in the column will be lost.
  - You are about to drop the `ExerciseWarmup` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `warmupId` to the `WorkoutWarmup` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WarmupType" AS ENUM ('MOBILITY', 'ACTIVATION', 'DYNAMIC', 'GENERAL');

-- DropForeignKey
ALTER TABLE "ExerciseWarmup" DROP CONSTRAINT "ExerciseWarmup_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutWarmup" DROP CONSTRAINT "WorkoutWarmup_exerciseWarmupId_fkey";

-- AlterTable
ALTER TABLE "WorkoutWarmup" DROP COLUMN "exerciseWarmupId",
ADD COLUMN     "warmupId" UUID NOT NULL;

-- DropTable
DROP TABLE "ExerciseWarmup";

-- CreateTable
CREATE TABLE "WarmupMuscle" (
    "id" UUID NOT NULL,
    "warmupId" UUID NOT NULL,
    "muscleGroupId" UUID NOT NULL,

    CONSTRAINT "WarmupMuscle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warmup" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "warmupType" "WarmupType" NOT NULL,
    "recommendedSets" INTEGER,
    "recommendedReps" INTEGER,
    "recommendedDurationSeconds" INTEGER,
    "restSeconds" INTEGER,
    "purpose" TEXT,
    "instructions" TEXT,
    "beginnerNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Warmup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WarmupMuscle_warmupId_idx" ON "WarmupMuscle"("warmupId");

-- CreateIndex
CREATE INDEX "WarmupMuscle_muscleGroupId_idx" ON "WarmupMuscle"("muscleGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "WarmupMuscle_warmupId_muscleGroupId_key" ON "WarmupMuscle"("warmupId", "muscleGroupId");

-- CreateIndex
CREATE INDEX "Warmup_warmupType_idx" ON "Warmup"("warmupType");

-- CreateIndex
CREATE INDEX "WorkoutWarmup_warmupId_idx" ON "WorkoutWarmup"("warmupId");

-- AddForeignKey
ALTER TABLE "WarmupMuscle" ADD CONSTRAINT "WarmupMuscle_warmupId_fkey" FOREIGN KEY ("warmupId") REFERENCES "Warmup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarmupMuscle" ADD CONSTRAINT "WarmupMuscle_muscleGroupId_fkey" FOREIGN KEY ("muscleGroupId") REFERENCES "MuscleGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutWarmup" ADD CONSTRAINT "WorkoutWarmup_warmupId_fkey" FOREIGN KEY ("warmupId") REFERENCES "Warmup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
