import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  getStrategyDefinition,
  StrategyDayDefinition,
  StrategyTypeValue,
} from "@/lib/training/strategy-definitions";

type DayType = "WORKOUT" | "REST";

export type StrategyDayInput =
  StrategyDayDefinition & {
    dayType?: DayType;
    focusMuscleGroups?: string[];
  };

function today(): Date {
  return new Date();
}

function normalizeMuscleName(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function normalizeFocusMuscles(
  muscles:
    | string[]
    | undefined,
): string[] {
  if (
    !Array.isArray(muscles)
  ) {
    return [];
  }

  return Array.from(
    new Set(
      muscles
        .map((muscle) =>
          muscle.trim(),
        )
        .filter(Boolean),
    ),
  );
}

/**
 * Determines whether a strategy day is a workout
 * or recovery day.
 *
 * Explicit dayType always has priority.
 *
 * The text fallback exists so existing predefined
 * strategy definitions that do not yet contain
 * dayType can still correctly create REST days.
 */
function inferDayType(
  day: StrategyDayInput,
): DayType {
  if (
    day.dayType ===
    "REST"
  ) {
    return "REST";
  }

  if (
    day.dayType ===
    "WORKOUT"
  ) {
    return "WORKOUT";
  }

  const text =
    `${day.name} ${
      day.description ?? ""
    }`.toLowerCase();

  if (
    text.includes("rest") ||
    text.includes("recovery") ||
    text.includes("off day") ||
    text.includes("off-day")
  ) {
    return "REST";
  }

  return "WORKOUT";
}

/**
 * Converts the textual focus of a predefined
 * strategy day into the canonical muscle names
 * used by the workout recommendation system.
 *
 * Explicit focusMuscleGroups always has priority.
 */
function inferFocusMuscles(
  day: StrategyDayInput,
): string[] {
  const explicit =
    normalizeFocusMuscles(
      day.focusMuscleGroups,
    );

  if (
    explicit.length > 0
  ) {
    return explicit;
  }

  const text =
    `${day.name} ${
      day.description ?? ""
    }`.toLowerCase();

  const muscles =
    new Set<string>();

  if (
    text.includes("chest") ||
    text.includes("push")
  ) {
    muscles.add("Chest");
  }

  if (
    text.includes("tricep") ||
    text.includes("push")
  ) {
    muscles.add("Triceps");
  }

  if (
    text.includes("shoulder") ||
    text.includes("push")
  ) {
    muscles.add("Shoulders");
  }

  if (
    text.includes("back") ||
    text.includes("pull")
  ) {
    muscles.add("Back");
  }

  if (
    text.includes("bicep") ||
    text.includes("pull")
  ) {
    muscles.add("Biceps");
  }

  if (
    text.includes("leg") ||
    text.includes("lower body") ||
    text.includes("quad") ||
    text.includes("hamstring")
  ) {
    muscles.add("Legs");
  }

  if (
    text.includes("abs") ||
    text.includes("core")
  ) {
    muscles.add("Abs / Core");
  }

  if (
    text.includes("trap")
  ) {
    muscles.add("Traps");
  }

  if (
    text.includes("forearm")
  ) {
    muscles.add("Forearms");
  }

  if (
    text.includes("lower back") ||
    text.includes("posterior chain")
  ) {
    muscles.add(
      "Lower Back / Posterior Chain",
    );
  }

  return Array.from(
    muscles,
  );
}

/**
 * Validates the complete ordered cycle.
 *
 * A strategy may contain 1–7 positions.
 * Day numbers must be unique and sequential.
 */
function validateDays(
  days: StrategyDayInput[],
) {
  if (
    !Array.isArray(days)
  ) {
    throw new Error(
      "Days must be an array.",
    );
  }

  if (
    days.length < 1 ||
    days.length > 7
  ) {
    throw new Error(
      "A strategy must contain between 1 and 7 days.",
    );
  }

  const dayNumbers =
    new Set<number>();

  for (
    let index = 0;
    index < days.length;
    index++
  ) {
    const day =
      days[index];

    if (
      !Number.isInteger(
        day.dayNumber,
      )
    ) {
      throw new Error(
        "Each day number must be an integer.",
      );
    }

    const expectedDayNumber =
      index + 1;

    if (
      day.dayNumber !==
      expectedDayNumber
    ) {
      throw new Error(
        "Strategy day numbers must be sequential starting from Day 1.",
      );
    }

    if (
      day.dayNumber < 1 ||
      day.dayNumber > 7
    ) {
      throw new Error(
        "Day number must be between 1 and 7.",
      );
    }

    if (
      dayNumbers.has(
        day.dayNumber,
      )
    ) {
      throw new Error(
        "Day numbers cannot be duplicated.",
      );
    }

    dayNumbers.add(
      day.dayNumber,
    );

    const cleanDayName =
      day.name?.trim();

    if (
      !cleanDayName ||
      cleanDayName.length < 2
    ) {
      throw new Error(
        `Day ${day.dayNumber} needs a name.`,
      );
    }

    if (
      cleanDayName.length > 80
    ) {
      throw new Error(
        `Day ${day.dayNumber} name is too long.`,
      );
    }

    if (
      day.description &&
      day.description.length >
        300
    ) {
      throw new Error(
        `Day ${day.dayNumber} description is too long.`,
      );
    }

    const dayType =
      inferDayType(day);

    if (
      dayType ===
      "WORKOUT"
    ) {
      const focus =
        inferFocusMuscles(
          day,
        );

      if (
        focus.length === 0
      ) {
        throw new Error(
          `Day ${day.dayNumber} needs at least one target muscle.`,
        );
      }
    }
  }
}

async function deactivateCurrentStrategy(
  userId: string,
  tx: Prisma.TransactionClient,
) {
  await tx.userStrategy.updateMany(
    {
      where: {
        userId,
        isActive: true,
      },
      data: {
        isActive: false,
        endedAt: today(),
      },
    },
  );
}

export async function listPredefinedStrategies() {
  return prisma.trainingStrategy.findMany(
    {
      where: {
        isSystemDefined: true,
      },
      orderBy: {
        name: "asc",
      },
    },
  );
}

export async function getPredefinedStrategy(
  id: string,
) {
  return prisma.trainingStrategy.findFirst(
    {
      where: {
        id,
        isSystemDefined: true,
      },
    },
  );
}

export async function getUserStrategies(
  userId: string,
) {
  return prisma.userStrategy.findMany(
    {
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
    },
  );
}

export async function getUserStrategy(
  userId: string,
  strategyId: string,
) {
  return prisma.userStrategy.findFirst(
    {
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
    },
  );
}

export async function selectPredefinedStrategy(
  userId: string,
  strategyId: string,
) {
  const predefinedStrategy =
    await prisma.trainingStrategy.findFirst(
      {
        where: {
          id: strategyId,
          isSystemDefined: true,
        },
      },
    );

  if (
    !predefinedStrategy
  ) {
    throw new Error(
      "PREDEFINED_STRATEGY_NOT_FOUND",
    );
  }

  const strategyType =
    predefinedStrategy.strategyType as StrategyTypeValue;

  const definition =
    getStrategyDefinition(
      strategyType,
    );

  if (!definition) {
    throw new Error(
      "STRATEGY_STRUCTURE_NOT_FOUND",
    );
  }

  return prisma.$transaction(
    async (tx) => {
      await deactivateCurrentStrategy(
        userId,
        tx,
      );

      const userStrategy =
        await tx.userStrategy.create(
          {
            data: {
              userId,
              strategyId:
                predefinedStrategy.id,
              name:
                predefinedStrategy.name,
              isCustom: false,
              isActive: true,
              startedAt:
                today(),
            },
          },
        );

            const typedDays =
        definition.days.map(
          (day) =>
            day as StrategyDayInput,
        );

      validateDays(
        typedDays,
      );

      const strategyDays =
        typedDays.map(
          (day) => {
            const dayType =
              inferDayType(day);

            const focusMuscleGroups =
              dayType === "REST"
                ? []
                : normalizeFocusMuscles(
                    day.focusMuscleGroups,
                  ).length > 0
                  ? normalizeFocusMuscles(
                      day.focusMuscleGroups,
                    )
                  : inferFocusMuscles(day);

            return {
              userStrategyId:
                userStrategy.id,
              dayNumber:
                day.dayNumber,
              name:
                day.name.trim(),
              description:
                day.description?.trim() ||
                null,
              dayType,
              focusMuscleGroups,
            };
          },
        );

      await tx.trainingStrategyDay.createMany(
        {
          data:
            strategyDays,
        },
      );

      return tx.userStrategy.findUnique(
        {
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
        },
      );
    },
  );
}

export async function createCustomStrategy(
  userId: string,
  name: string,
  days: StrategyDayInput[],
) {
  const cleanName =
    name.trim();

  if (
    cleanName.length < 2
  ) {
    throw new Error(
      "INVALID_NAME",
    );
  }

  if (
    cleanName.length > 100
  ) {
    throw new Error(
      "NAME_TOO_LONG",
    );
  }

  validateDays(days);

  return prisma.$transaction(
    async (tx) => {
      await deactivateCurrentStrategy(
        userId,
        tx,
      );

      const userStrategy =
        await tx.userStrategy.create(
          {
            data: {
              userId,
              strategyId: null,
              name: cleanName,
              isCustom: true,
              isActive: true,
              startedAt:
                today(),
            },
          },
        );

      await tx.trainingStrategyDay.createMany(
        {
          data: days.map(
            (day) => {
              const dayType =
                inferDayType(
                  day,
                );

              return {
                userStrategyId:
                  userStrategy.id,
                dayNumber:
                  day.dayNumber,
                name:
                  day.name.trim(),
                description:
                  day.description?.trim() ||
                  null,
                dayType,
                focusMuscleGroups:
                  dayType ===
                  "REST"
                    ? []
                    : inferFocusMuscles(
                        day,
                      ),
              };
            },
          ),
        },
      );

      return tx.userStrategy.findUnique(
        {
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
        },
      );
    },
  );
}

export async function activateUserStrategy(
  userId: string,
  strategyId: string,
) {
  const target =
    await prisma.userStrategy.findFirst(
      {
        where: {
          id: strategyId,
          userId,
        },
      },
    );

  if (!target) {
    throw new Error(
      "STRATEGY_NOT_FOUND",
    );
  }

  if (target.isActive) {
    return getUserStrategy(
      userId,
      strategyId,
    );
  }

  return prisma.$transaction(
    async (tx) => {
      await deactivateCurrentStrategy(
        userId,
        tx,
      );

      await tx.userStrategy.update(
        {
          where: {
            id: strategyId,
          },

          data: {
            isActive: true,
            endedAt: null,
            startedAt:
              today(),
          },
        },
      );

      return tx.userStrategy.findUnique(
        {
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
        },
      );
    },
  );
}

export async function updateUserStrategy(
  userId: string,
  strategyId: string,
  name: string,
  days: StrategyDayInput[],
) {
  const target =
    await prisma.userStrategy.findFirst(
      {
        where: {
          id: strategyId,
          userId,
        },
      },
    );

  if (!target) {
    throw new Error(
      "STRATEGY_NOT_FOUND",
    );
  }

  if (
    !target.isCustom
  ) {
    throw new Error(
      "PREDEFINED_STRATEGY_CANNOT_BE_EDITED",
    );
  }

  const existingWorkout =
    await prisma.workout.findFirst(
      {
        where: {
          userStrategyId:
            strategyId,
        },

        select: {
          id: true,
        },
      },
    );

  if (
    existingWorkout
  ) {
    throw new Error(
      "STRATEGY_HAS_HISTORY",
    );
  }

  const cleanName =
    name.trim();

  if (
    cleanName.length < 2
  ) {
    throw new Error(
      "INVALID_NAME",
    );
  }

  if (
    cleanName.length > 100
  ) {
    throw new Error(
      "NAME_TOO_LONG",
    );
  }

  validateDays(days);

  return prisma.$transaction(
    async (tx) => {
      await tx.userStrategy.update(
        {
          where: {
            id: strategyId,
          },

          data: {
            name: cleanName,
          },
        },
      );

      await tx.trainingStrategyDay.deleteMany(
        {
          where: {
            userStrategyId:
              strategyId,
          },
        },
      );

      await tx.trainingStrategyDay.createMany(
        {
          data: days.map(
            (day) => {
              const dayType =
                inferDayType(
                  day,
                );

              return {
                userStrategyId:
                  strategyId,
                dayNumber:
                  day.dayNumber,
                name:
                  day.name.trim(),
                description:
                  day.description?.trim() ||
                  null,
                dayType,
                focusMuscleGroups:
                  dayType ===
                  "REST"
                    ? []
                    : inferFocusMuscles(
                        day,
                      ),
              };
            },
          ),
        },
      );

      return tx.userStrategy.findUnique(
        {
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
        },
      );
    },
  );
}

export async function deleteOrArchiveUserStrategy(
  userId: string,
  strategyId: string,
) {
  const target =
    await prisma.userStrategy.findFirst(
      {
        where: {
          id: strategyId,
          userId,
        },
      },
    );

  if (!target) {
    throw new Error(
      "STRATEGY_NOT_FOUND",
    );
  }

  const existingWorkout =
    await prisma.workout.findFirst(
      {
        where: {
          userStrategyId:
            strategyId,
        },

        select: {
          id: true,
        },
      },
    );

  if (
    existingWorkout
  ) {
    throw new Error(
      "STRATEGY_HAS_HISTORY",
    );
  }

  if (
    target.isActive
  ) {
    await prisma.userStrategy.update(
      {
        where: {
          id: strategyId,
        },

        data: {
          isActive: false,
          endedAt: today(),
        },
      },
    );

    return {
      action: "archived",
    };
  }

  await prisma.userStrategy.delete(
    {
      where: {
        id: strategyId,
      },
    },
  );

  return {
    action: "deleted",
  };
}