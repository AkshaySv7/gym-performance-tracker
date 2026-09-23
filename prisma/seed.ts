import "dotenv/config";

import { exercises } from "./seed-data/exercises";
import { warmupActivities } from "./seed-data/warmup-activities";
import { warmupRoutines } from "./seed-data/warmup-routines";
import { equipment } from "./seed-data/equipment";
import { muscles } from "./seed-data/muscles";
import { strategies } from "./seed-data/strategies";

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL is not defined");
}

console.log("🔥 Seed file loaded");

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seed...");

  // ============================================================
  // MUSCLE GROUPS
  // ============================================================

  console.log("💪 Seeding muscle groups...");

  for (const muscle of muscles) {
    await prisma.muscleGroup.upsert({
      where: {
        name: muscle.name,
      },
      update: {
        bodyRegion: muscle.bodyRegion,
        description: muscle.description,
      },
      create: {
        name: muscle.name,
        bodyRegion: muscle.bodyRegion,
        description: muscle.description,
      },
    });
  }

  console.log("✅ Muscle groups seeded");

  // ============================================================
  // EQUIPMENT
  // ============================================================

  console.log("🏋️ Seeding equipment...");

  for (const item of equipment) {
    await prisma.equipment.upsert({
      where: {
        name: item.name,
      },
      update: {
        equipmentType: item.equipmentType,
        description: item.description,
        minWeightKg: item.minWeightKg,
        maxWeightKg: item.maxWeightKg,
      },
      create: {
        name: item.name,
        equipmentType: item.equipmentType,
        description: item.description,
        minWeightKg: item.minWeightKg,
        maxWeightKg: item.maxWeightKg,
        isSystem: true,
      },
    });
  }

  console.log("✅ Equipment seeded");

  // ============================================================
  // EXERCISES
  // ============================================================

  console.log("🏋️ Seeding exercises...");

  for (const exerciseData of exercises) {
    const exercise = await prisma.exercise.upsert({
      where: {
        name: exerciseData.name,
      },
      update: {
        category: exerciseData.category,
        movementType: exerciseData.movementType,
        difficultyLevel: exerciseData.difficultyLevel,
        description: exerciseData.description,
        instructions: exerciseData.instructions,
        breathingGuidance: exerciseData.breathingGuidance,
        rangeOfMotion: exerciseData.rangeOfMotion,
        commonMistakes: exerciseData.commonMistakes,
        beginnerNotes: exerciseData.beginnerNotes,
      },
      create: {
        name: exerciseData.name,
        category: exerciseData.category,
        movementType: exerciseData.movementType,
        difficultyLevel: exerciseData.difficultyLevel,
        description: exerciseData.description,
        instructions: exerciseData.instructions,
        breathingGuidance: exerciseData.breathingGuidance,
        rangeOfMotion: exerciseData.rangeOfMotion,
        commonMistakes: exerciseData.commonMistakes,
        beginnerNotes: exerciseData.beginnerNotes,
      },
    });

    // ----------------------------
    // Exercise → Muscle
    // ----------------------------

    await prisma.exerciseMuscle.deleteMany({
      where: {
        exerciseId: exercise.id,
      },
    });

    for (const muscle of exerciseData.muscles) {
      const muscleGroup = await prisma.muscleGroup.findUnique({
        where: {
          name: muscle.name,
        },
      });

      if (!muscleGroup) {
        throw new Error(
          `Muscle group not found: ${muscle.name}`
        );
      }

      await prisma.exerciseMuscle.create({
        data: {
          exerciseId: exercise.id,
          muscleGroupId: muscleGroup.id,
          role: muscle.role,
        },
      });
    }

    // ----------------------------
    // Exercise → Equipment
    // ----------------------------

    await prisma.exerciseEquipment.deleteMany({
      where: {
        exerciseId: exercise.id,
      },
    });

    for (const equipmentItem of exerciseData.equipment) {
      const equipmentRecord = await prisma.equipment.findUnique({
        where: {
          name: equipmentItem.name,
        },
      });

      if (!equipmentRecord) {
        throw new Error(
          `Equipment not found: ${equipmentItem.name}`
        );
      }

      await prisma.exerciseEquipment.create({
        data: {
          exerciseId: exercise.id,
          equipmentId: equipmentRecord.id,
          isRequired: equipmentItem.isRequired,
        },
      });
    }
  }

  console.log("✅ Exercises seeded");

  // ============================================================
  // WARM-UP ACTIVITIES
  // ============================================================

  console.log("🔥 Seeding warm-up activities...");

  for (const activityData of warmupActivities) {
    const activity = await prisma.warmupActivity.upsert({
      where: {
        name: activityData.name,
      },
      update: {
        warmupType: activityData.warmupType,
        recommendedSets: activityData.recommendedSets,
        recommendedReps: activityData.recommendedReps,
        recommendedDurationSeconds:
          activityData.recommendedDurationSeconds,
        restSeconds: activityData.restSeconds,
        purpose: activityData.purpose,
        description: activityData.description,
        instructions: activityData.instructions,
        beginnerNotes: activityData.beginnerNotes,
      },
      create: {
        name: activityData.name,
        warmupType: activityData.warmupType,
        recommendedSets: activityData.recommendedSets,
        recommendedReps: activityData.recommendedReps,
        recommendedDurationSeconds:
          activityData.recommendedDurationSeconds,
        restSeconds: activityData.restSeconds,
        purpose: activityData.purpose,
        description: activityData.description,
        instructions: activityData.instructions,
        beginnerNotes: activityData.beginnerNotes,
      },
    });

    console.log(`   ✓ ${activity.name}`);
  }

  console.log("✅ Warm-up activities seeded");

  // ============================================================
  // WARM-UP ROUTINES
  // ============================================================

  console.log("🔥 Seeding warm-up routines...");

  for (const routineData of warmupRoutines) {
    const routine = await prisma.warmupRoutine.upsert({
      where: {
        name: routineData.name,
      },
      update: {
        description: routineData.description,
        purpose: routineData.purpose,
      },
      create: {
        name: routineData.name,
        description: routineData.description,
        purpose: routineData.purpose,
      },
    });

    // ----------------------------
    // Routine → Activities
    // ----------------------------

    await prisma.warmupRoutineActivity.deleteMany({
      where: {
        routineId: routine.id,
      },
    });

    for (
      let index = 0;
      index < routineData.activities.length;
      index++
    ) {
      const activityName = routineData.activities[index];

      const activity = await prisma.warmupActivity.findUnique({
        where: {
          name: activityName,
        },
      });

      if (!activity) {
        throw new Error(
          `Warm-up activity not found: ${activityName}`
        );
      }

      await prisma.warmupRoutineActivity.create({
        data: {
          routineId: routine.id,
          activityId: activity.id,
          orderIndex: index + 1,
        },
      });
    }

    // ----------------------------
    // Routine → Muscles
    // ----------------------------

    await prisma.warmupRoutineMuscle.deleteMany({
      where: {
        routineId: routine.id,
      },
    });

    for (const muscleName of routineData.muscles) {
      const muscle = await prisma.muscleGroup.findUnique({
        where: {
          name: muscleName,
        },
      });

      if (!muscle) {
        throw new Error(
          `Warm-up routine muscle not found: ${muscleName}`
        );
      }

      await prisma.warmupRoutineMuscle.create({
        data: {
          routineId: routine.id,
          muscleGroupId: muscle.id,
        },
      });
    }

    console.log(`   ✓ ${routine.name}`);
  }

  console.log("✅ Warm-up routines seeded");

  // ============================================================
  // TRAINING STRATEGIES
  // ============================================================

  console.log("📋 Seeding training strategies...");

  for (const strategy of strategies) {
    const existing = await prisma.trainingStrategy.findFirst({
      where: {
        name: strategy.name,
      },
    });

    if (existing) {
      await prisma.trainingStrategy.update({
        where: {
          id: existing.id,
        },
        data: {
          description: strategy.description,
          strategyType: strategy.strategyType,
          isSystemDefined: true,
        },
      });
    } else {
      await prisma.trainingStrategy.create({
        data: {
          name: strategy.name,
          description: strategy.description,
          strategyType: strategy.strategyType,
          isSystemDefined: true,
        },
      });
    }
  }

  console.log("✅ Training strategies seeded");

  console.log("🎉 Database seed completed successfully!");
}

// ============================================================
// RUN SEED
// ============================================================

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });