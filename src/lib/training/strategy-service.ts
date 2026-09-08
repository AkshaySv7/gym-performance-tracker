//4. Create the main strategy service
 
import { prisma } from "@/lib/db/prisma";
import {
  getStrategyDefinition,
  StrategyDayDefinition,
  StrategyTypeValue,
} from "@/lib/training/strategy-definitions";

function today(): Date {
  return new Date();
}

function validateDays(days: StrategyDayDefinition[]) {
  if (!Array.isArray(days)) {
    throw new Error("Days must be an array.");
  }

  if (days.length < 1 || days.length > 7) {
    throw new Error("A strategy must contain between 1 and 7 days.");
  }

  const dayNumbers = new Set<number>();

  for (const day of days) {
    if (!Number.isInteger(day.dayNumber)) {
      throw new Error("Each day number must be an integer.");
    }

    if (day.dayNumber < 1 || day.dayNumber > 7) {
      throw new Error("Day number must be between 1 and 7.");
    }

    if (dayNumbers.has(day.dayNumber)) {
      throw new Error("Day numbers cannot be duplicated.");
    }

    dayNumbers.add(day.dayNumber);

    if (!day.name || day.name.trim().length < 2) {
      throw new Error("Every training day needs a name.");
    }

    if (day.name.trim().length > 80) {
      throw new Error("Training day name is too long.");
    }

    if (day.description && day.description.length > 300) {
      throw new Error("Training day description is too long.");
    }
  }
}

async function deactivateCurrentStrategy(
  userId: string,
  tx: typeof prisma,
) {
  await tx.userStrategy.updateMany({
    where: {
      userId,
      isActive: true,
    },
    data: {
      isActive: false,
      endedAt: today(),
    },
  });
}

export async function listPredefinedStrategies() {
  return prisma.trainingStrategy.findMany({
    where: {
      isSystemDefined: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getPredefinedStrategy(id: string) {
  return prisma.trainingStrategy.findFirst({
    where: {
      id,
      isSystemDefined: true,
    },
  });
}

export async function getUserStrategies(userId: string) {
  return prisma.userStrategy.findMany({
    where: {
      userId,
    },
    include: {
      strategy: true,
      days: {
        orderBy: {
          dayNumber: "asc",
        },
      },
    },
    orderBy: [
      {
        isActive: "desc",
      },
      {
        startedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function getUserStrategy(
  userId: string,
  strategyId: string,
) {
  return prisma.userStrategy.findFirst({
    where: {
      id: strategyId,
      userId,
    },
    include: {
      strategy: true,
      days: {
        orderBy: {
          dayNumber: "asc",
        },
      },
    },
  });
}

export async function selectPredefinedStrategy(
  userId: string,
  strategyId: string,
) {
  const predefinedStrategy =
    await prisma.trainingStrategy.findFirst({
      where: {
        id: strategyId,
        isSystemDefined: true,
      },
    });

  if (!predefinedStrategy) {
    throw new Error("PREDEFINED_STRATEGY_NOT_FOUND");
  }

  const strategyType =
    predefinedStrategy.strategyType as StrategyTypeValue;

  const definition = getStrategyDefinition(strategyType);

  if (!definition) {
    throw new Error("STRATEGY_STRUCTURE_NOT_FOUND");
  }

  return prisma.$transaction(async (tx) => {
    await deactivateCurrentStrategy(userId, tx);

    const userStrategy = await tx.userStrategy.create({
      data: {
        userId,
        strategyId: predefinedStrategy.id,
        name: predefinedStrategy.name,
        isCustom: false,
        isActive: true,
        startedAt: today(),
      },
    });

    await tx.trainingStrategyDay.createMany({
      data: definition.days.map((day) => ({
        userStrategyId: userStrategy.id,
        dayNumber: day.dayNumber,
        name: day.name,
        description: day.description,
      })),
    });

    return tx.userStrategy.findUnique({
      where: {
        id: userStrategy.id,
      },
      include: {
        strategy: true,
        days: {
          orderBy: {
            dayNumber: "asc",
          },
        },
      },
    });
  });
}

export async function createCustomStrategy(
  userId: string,
  name: string,
  days: StrategyDayDefinition[],
) {
  const cleanName = name.trim();

  if (cleanName.length < 2) {
    throw new Error("INVALID_NAME");
  }

  if (cleanName.length > 100) {
    throw new Error("NAME_TOO_LONG");
  }

  validateDays(days);

  return prisma.$transaction(async (tx) => {
    await deactivateCurrentStrategy(userId, tx);

    const userStrategy = await tx.userStrategy.create({
      data: {
        userId,
        strategyId: null,
        name: cleanName,
        isCustom: true,
        isActive: true,
        startedAt: today(),
      },
    });

    await tx.trainingStrategyDay.createMany({
      data: days.map((day) => ({
        userStrategyId: userStrategy.id,
        dayNumber: day.dayNumber,
        name: day.name.trim(),
        description: day.description?.trim() || null,
      })),
    });

    return tx.userStrategy.findUnique({
      where: {
        id: userStrategy.id,
      },
      include: {
        strategy: true,
        days: {
          orderBy: {
            dayNumber: "asc",
          },
        },
      },
    });
  });
}

export async function activateUserStrategy(
  userId: string,
  strategyId: string,
) {
  const target = await prisma.userStrategy.findFirst({
    where: {
      id: strategyId,
      userId,
    },
  });

  if (!target) {
    throw new Error("STRATEGY_NOT_FOUND");
  }

  if (target.isActive) {
    return getUserStrategy(userId, strategyId);
  }

  return prisma.$transaction(async (tx) => {
    await deactivateCurrentStrategy(userId, tx);

    await tx.userStrategy.update({
      where: {
        id: strategyId,
      },
      data: {
        isActive: true,
        endedAt: null,
        startedAt: today(),
      },
    });

    return tx.userStrategy.findUnique({
      where: {
        id: strategyId,
      },
      include: {
        strategy: true,
        days: {
          orderBy: {
            dayNumber: "asc",
          },
        },
      },
    });
  });
}

export async function updateUserStrategy(
  userId: string,
  strategyId: string,
  name: string,
  days: StrategyDayDefinition[],
) {
  const target = await prisma.userStrategy.findFirst({
    where: {
      id: strategyId,
      userId,
    },
  });

  if (!target) {
    throw new Error("STRATEGY_NOT_FOUND");
  }

  if (!target.isCustom) {
    throw new Error("PREDEFINED_STRATEGY_CANNOT_BE_EDITED");
  }

  const existingWorkout = await prisma.workout.findFirst({
    where: {
      userStrategyId: strategyId,
    },
    select: {
      id: true,
    },
  });

  if (existingWorkout) {
    throw new Error("STRATEGY_HAS_HISTORY");
  }

  const cleanName = name.trim();

  if (cleanName.length < 2) {
    throw new Error("INVALID_NAME");
  }

  if (cleanName.length > 100) {
    throw new Error("NAME_TOO_LONG");
  }

  validateDays(days);

  return prisma.$transaction(async (tx) => {
    await tx.userStrategy.update({
      where: {
        id: strategyId,
      },
      data: {
        name: cleanName,
      },
    });

    await tx.trainingStrategyDay.deleteMany({
      where: {
        userStrategyId: strategyId,
      },
    });

    await tx.trainingStrategyDay.createMany({
      data: days.map((day) => ({
        userStrategyId: strategyId,
        dayNumber: day.dayNumber,
        name: day.name.trim(),
        description: day.description?.trim() || null,
      })),
    });

    return tx.userStrategy.findUnique({
      where: {
        id: strategyId,
      },
      include: {
        strategy: true,
        days: {
          orderBy: {
            dayNumber: "asc",
          },
        },
      },
    });
  });
}

export async function deleteOrArchiveUserStrategy(
  userId: string,
  strategyId: string,
) {
  const target = await prisma.userStrategy.findFirst({
    where: {
      id: strategyId,
      userId,
    },
  });

  if (!target) {
    throw new Error("STRATEGY_NOT_FOUND");
  }

  const existingWorkout = await prisma.workout.findFirst({
    where: {
      userStrategyId: strategyId,
    },
    select: {
      id: true,
    },
  });

  if (existingWorkout) {
    throw new Error("STRATEGY_HAS_HISTORY");
  }

  if (target.isActive) {
    await prisma.userStrategy.update({
      where: {
        id: strategyId,
      },
      data: {
        isActive: false,
        endedAt: today(),
      },
    });

    return {
      action: "archived",
    };
  }

  await prisma.userStrategy.delete({
    where: {
      id: strategyId,
    },
  });

  return {
    action: "deleted",
  };
}