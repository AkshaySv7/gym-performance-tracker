import "dotenv/config";
import { exercises } from "./seed-data/exercises";
import { warmups } from "./seed-data/warmups";
import {
  PrismaClient,
} from "../src/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";

import { equipment } from "./seed-data/equipment";
import { muscles } from "./seed-data/muscles";
import { strategies } from "./seed-data/strategies";

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seeddd...");

  // ----------------------------
  // Muscle groups
  // ----------------------------

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

  // ----------------------------
  // Equipment
  // ----------------------------

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

  // ----------------------------
  // Exercises Seeding Section
  // ----------------------------

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

  await prisma.exerciseMuscle.deleteMany({
    where: {
      exerciseId: exercise.id,
    },
  });

  for (const muscle of exerciseData.muscles) {
    const muscleGroup =
      await prisma.muscleGroup.findUnique({
        where: {
          name: muscle.name,
        },
      });

    if (!muscleGroup) {
      throw new Error(
        `Muscle group not found: ${muscle.name}`,
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

  await prisma.exerciseEquipment.deleteMany({
    where: {
      exerciseId: exercise.id,
    },
  });

  for (const equipment of exerciseData.equipment) {
    const equipmentRecord =
      await prisma.equipment.findUnique({
        where: {
          name: equipment.name,
        },
      });

    if (!equipmentRecord) {
      throw new Error(
        `Equipment not found: ${equipment.name}`,
      );
    }

    await prisma.exerciseEquipment.create({
      data: {
        exerciseId: exercise.id,
        equipmentId: equipmentRecord.id,
        isRequired: equipment.isRequired,
      },
    });
  }

  //await prisma.exerciseImage.deleteMany({
  //where: {
  //    exerciseId: exercise.id,
  //  },
  //});

  //await prisma.exerciseImage.create({
  //  data: {
  //    exerciseId: exercise.id,
  //    imageUrl: exerciseData.imageFile,
  //    imageType: "EXERCISE",
  //    altText: `${exercise.name} exercise`,
  //    displayOrder: 0,
  //  },
  //});
  //}

  console.log("✅ Exercises seeded");

  // ----------------------------
  // Warmups Seeding Section
  // ----------------------------

  console.log("🔥 Seeding warm-ups...");

  for (const warmupData of warmups) {
    const warmup = await prisma.warmup.upsert({
      where: {
        name: warmupData.name,
      },

      update: {
        warmupType: warmupData.warmupType,
        recommendedSets: warmupData.recommendedSets,
        recommendedReps: warmupData.recommendedReps,
        recommendedDurationSeconds:
          warmupData.recommendedDurationSeconds,
        restSeconds: warmupData.restSeconds,
        purpose: warmupData.purpose,
        description: warmupData.description,
        instructions: warmupData.instructions,
        beginnerNotes: warmupData.beginnerNotes,
      },

      create: {
        name: warmupData.name,
        warmupType: warmupData.warmupType,
        recommendedSets: warmupData.recommendedSets,
        recommendedReps: warmupData.recommendedReps,
        recommendedDurationSeconds:
          warmupData.recommendedDurationSeconds,
        restSeconds: warmupData.restSeconds,
        purpose: warmupData.purpose,
        description: warmupData.description,
        instructions: warmupData.instructions,
        beginnerNotes: warmupData.beginnerNotes,
      },
    });

    await prisma.warmupMuscle.deleteMany({
      where: {
        warmupId: warmup.id,
      },
    });

    for (const muscleName of warmupData.muscleGroups) {
      const muscle =
        await prisma.muscleGroup.findUnique({
          where: {
            name: muscleName,
          },
        });

      if (!muscle) {
        throw new Error(
          `Warmup muscle not found: ${muscleName}`,
        );
      }

      await prisma.warmupMuscle.create({
        data: {
          warmupId: warmup.id,
          muscleGroupId: muscle.id,
        },
      });
    } 
  }

  console.log("✅ Warm-ups seeded");

  // ----------------------------
  // Training strategies
  // ----------------------------

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

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
}