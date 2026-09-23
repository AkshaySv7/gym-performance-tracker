import { prisma } from "@/lib/db/prisma";
import { expandFocusMuscles } from "@/lib/training/strategy-definitions";

type StrategyDay = {
  id: string;
  userStrategyId: string;
  dayNumber: number;
  name: string;
  description: string | null;
  dayType: "WORKOUT" | "REST";
  focusMuscleGroups: string[];
};

function normalize(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function matchesFocus(
  muscleName: string,
  focusMuscles: string[],
): boolean {
  const muscle =
    normalize(muscleName);

  const expandedFocusMuscles =
    expandFocusMuscles(
      focusMuscles,
    );

  return expandedFocusMuscles.some(
    (focus) => {
      const target =
        normalize(focus);

      if (
        muscle === target
      ) {
        return true;
      }

      if (
        muscle.includes(target) ||
        target.includes(muscle)
      ) {
        return true;
      }

      return false;
    },
  );
}

async function getActiveStrategy(
  userId: string,
) {
  return prisma.userStrategy.findFirst({
    where: {
      userId,
      isActive: true,
    },
    include: {
      days: {
        orderBy: {
          dayNumber: "asc",
        },
      },
    },
  });
}

export async function getCurrentStrategyDay(
  userId: string,
) {
  const strategy =
    await getActiveStrategy(userId);

  if (!strategy) {
    return null;
  }

  const days =
    strategy.days as StrategyDay[];

  if (days.length === 0) {
    return null;
  }

  /*
   * If the user already has an unfinished workout,
   * that workout remains the current cycle position.
   */
  const activeWorkout =
    await prisma.workout.findFirst({
      where: {
        userId,
        userStrategyId: strategy.id,
        completedAt: null,
      },
      include: {
        strategyDay: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  if (activeWorkout) {
    return activeWorkout.strategyDay;
  }

  /*
   * Find the most recently completed workout
   * belonging to the active strategy.
   */
  const lastWorkout =
    await prisma.workout.findFirst({
      where: {
        userId,
        userStrategyId: strategy.id,
        completedAt: {
          not: null,
        },
      },
      orderBy: {
        completedAt: "desc",
      },
      include: {
        strategyDay: true,
      },
    });

  /*
   * Find the most recent recovery entry that is
   * explicitly attached to a day in this strategy.
   *
   * strategyDayId is what connects the recovery
   * entry to the continuous strategy cycle.
   */
  const lastRecovery =
    await prisma.recoveryLog.findFirst({
      where: {
        userId,
        strategyDay: {
          userStrategyId: strategy.id,
        },
      },
      orderBy: [
        {
          recoveryDate: "desc",
        },
        {
          updatedAt: "desc",
        },
      ],
      include: {
        strategyDay: true,
      },
    });

  /*
   * Determine which activity happened most recently.
   *
   * Workout activity is represented by completedAt.
   * Recovery activity is represented by recoveryDate.
   */
  let lastDayNumber: number | null = null;

  const workoutTime =
    lastWorkout?.completedAt?.getTime() ??
    0;

  const recoveryTime =
    lastRecovery?.recoveryDate?.getTime() ??
    0;

  if (
    lastWorkout &&
    workoutTime >= recoveryTime
  ) {
    lastDayNumber =
      lastWorkout.strategyDay.dayNumber;
  } else if (
      lastRecovery?.strategyDay
    ) {
      lastDayNumber =
        lastRecovery.strategyDay.dayNumber;
    }

  /*
   * No previous workout or recovery entry means
   * the user is starting at the first position.
   */
  if (lastDayNumber === null) {
    return days[0];
  }

  const currentIndex =
    days.findIndex(
      (day) =>
        day.dayNumber ===
        lastDayNumber,
    );

  if (currentIndex === -1) {
    return days[0];
  }

  /*
   * Advance exactly one position in the cycle.
   * The cycle wraps back to the first day.
   */
  const nextIndex =
    (currentIndex + 1) %
    days.length;

  return days[nextIndex];
}

export async function getWorkoutById(
  userId: string,
  workoutId: string,
) {
  return prisma.workout.findFirst({
    where: {
      id: workoutId,
      userId,
    },
    include: {
      userStrategy: {
        select: {
          id: true,
          name: true,
          isActive: true,
        },
      },

      strategyDay: {
        select: {
          id: true,
          dayNumber: true,
          name: true,
          description: true,
          dayType: true,
          focusMuscleGroups: true,
        },
      },

      warmups: {
        include: {
          routine: {
            select: {
              id: true,
              name: true,
              description: true,
              purpose: true,
            },
          },
        },
      },

      exercises: {
        orderBy: {
          orderIndex: "asc",
        },
        include: {
          exercise: {
            select: {
              id: true,
              name: true,
              description: true,
              category: true,
              movementType: true,
              difficultyLevel: true,
              instructions: true,
              breathingGuidance: true,
              rangeOfMotion: true,
              commonMistakes: true,
              beginnerNotes: true,

              equipment: {
                include: {
                  equipment: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },

              muscles: {
                include: {
                  muscleGroup: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },

          sets: {
            orderBy: {
              setNumber: "asc",
            },
          },
        },
      },
    },
  });
}

export async function getWorkoutHistory(
  userId: string,
) {
  return prisma.workout.findMany({
    where: {
      userId,
    },
    orderBy: {
      workoutDate: "desc",
    },
    include: {
      strategyDay: {
        select: {
          name: true,
          dayNumber: true,
          dayType: true,
          focusMuscleGroups: true,
        },
      },

      userStrategy: {
        select: {
          name: true,
        },
      },

      exercises: {
        select: {
          id: true,
          exercise: {
            select: {
              name: true,
            },
          },
          sets: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
}

async function populateInitialExercises(
  userId: string,
  workoutId: string,
  strategyDay: StrategyDay,
) {
  if (
    strategyDay.dayType ===
    "REST"
  ) {
    return;
  }

  const focusMuscles =
    strategyDay.focusMuscleGroups;

  if (focusMuscles.length === 0) {
    return;
  }

  const existing =
    await prisma.workoutExercise.findMany(
      {
        where: {
          workoutId,
        },
        select: {
          exerciseId: true,
        },
      },
    );

  const existingIds =
    new Set(
      existing.map(
        (item) => item.exerciseId,
      ),
    );

  const equipment =
    await prisma.userEquipment.findMany(
      {
        where: {
          userId,
        },
        select: {
          equipmentId: true,
        },
      },
    );

  const equipmentIds =
    new Set(
      equipment.map(
        (item) =>
          item.equipmentId,
      ),
    );

  const exercises =
    await prisma.exercise.findMany({
      include: {
        equipment: {
          where: {
            isRequired: true,
          },
          select: {
            equipmentId: true,
          },
        },

        muscles: {
          include: {
            muscleGroup: {
              select: {
                name: true,
              },
            },
          },
        },
      },

      orderBy: [
        {
          createdAt: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

  const candidates =
    exercises.filter(
      (exercise) => {
        if (
          existingIds.has(
            exercise.id,
          )
        ) {
          return false;
        }

        const equipmentAvailable =
          exercise.equipment.every(
            (requirement) =>
              equipmentIds.has(
                requirement.equipmentId,
              ),
          );

        if (
          !equipmentAvailable
        ) {
          return false;
        }

        return exercise.muscles.some(
          (item) =>
            matchesFocus(
              item.muscleGroup.name,
              focusMuscles,
            ),
        );
      },
    );

  const selected: typeof candidates =
    [];

  const covered =
    new Set<string>();

  for (const exercise of candidates) {
    if (
      selected.length >= 4
    ) {
      break;
    }

    const matchedMuscles =
      exercise.muscles
        .map(
          (item) =>
            item.muscleGroup.name,
        )
        .filter((muscle) =>
          matchesFocus(
            muscle,
            focusMuscles,
          ),
        );

    const newMuscle =
      matchedMuscles.find(
        (muscle) =>
          !covered.has(
            normalize(muscle),
          ),
      );

    if (
      selected.length < 2 ||
      newMuscle
    ) {
      selected.push(
        exercise,
      );

      matchedMuscles.forEach(
        (muscle) =>
          covered.add(
            normalize(muscle),
          ),
      );
    }
  }

  let orderIndex = 1;

  for (const exercise of selected) {
    await prisma.workoutExercise.create(
      {
        data: {
          workoutId,
          exerciseId:
            exercise.id,
          orderIndex,
          recommendationType:
            "RECOMMENDED",
          recommendationReason:
            `Selected for ${strategyDay.name} based on today's target muscles and available equipment.`,
        },
      },
    );

    orderIndex++;
  }
}

export async function createWorkout(
  userId: string,
  strategyDayId?: string,
) {
  const currentDay =
    await getCurrentStrategyDay(
      userId,
    );

  if (!currentDay) {
    throw new Error(
      "No active training strategy found.",
    );
  }

  if (
    currentDay.dayType ===
    "REST"
  ) {
    throw new Error(
      "Today is a recovery day. Complete your recovery log instead.",
    );
  }

  if (
    strategyDayId &&
    strategyDayId !==
      currentDay.id
  ) {
    throw new Error(
      "This is not the current training day in your active strategy.",
    );
  }

  const existingWorkout =
    await prisma.workout.findFirst({
      where: {
        userId,
        strategyDayId:
          currentDay.id,
        completedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  if (existingWorkout) {
    return existingWorkout;
  }

  const workout =
    await prisma.workout.create({
      data: {
        userId,
        userStrategyId:
          currentDay.userStrategyId,
        strategyDayId:
          currentDay.id,
        workoutDate:
          new Date(),
        startedAt:
          new Date(),
      },
    });

  await populateInitialExercises(
    userId,
    workout.id,
    currentDay,
  );

  return workout;
}

export async function addWorkoutExercise(
  userId: string,
  workoutId: string,
  exerciseId: string,
) {
  const workout =
    await prisma.workout.findFirst({
      where: {
        id: workoutId,
        userId,
        completedAt: null,
      },
    });

  if (!workout) {
    throw new Error(
      "Active workout not found.",
    );
  }

  const exercise =
    await prisma.exercise.findUnique({
      where: {
        id: exerciseId,
      },
      include: {
        equipment: {
          where: {
            isRequired: true,
          },
          select: {
            equipmentId: true,
          },
        },
      },
    });

  if (!exercise) {
    throw new Error(
      "Exercise not found.",
    );
  }

  const requiredEquipmentIds =
    exercise.equipment.map(
      (item) =>
        item.equipmentId,
    );

  if (
    requiredEquipmentIds.length >
    0
  ) {
    const availableEquipment =
      await prisma.userEquipment.findMany(
        {
          where: {
            userId,
            equipmentId: {
              in: requiredEquipmentIds,
            },
          },
          select: {
            equipmentId: true,
          },
        },
      );

    const availableIds =
      new Set(
        availableEquipment.map(
          (item) =>
            item.equipmentId,
        ),
      );

    const missing =
      requiredEquipmentIds.some(
        (id) =>
          !availableIds.has(id),
      );

    if (missing) {
      throw new Error(
        "This exercise requires equipment that is not available in your gym.",
      );
    }
  }

  const existing =
    await prisma.workoutExercise.findFirst(
      {
        where: {
          workoutId,
          exerciseId,
        },
      },
    );

  if (existing) {
    return existing;
  }

  const lastExercise =
    await prisma.workoutExercise.findFirst(
      {
        where: {
          workoutId,
        },
        orderBy: {
          orderIndex: "desc",
        },
        select: {
          orderIndex: true,
        },
      },
    );

  const orderIndex =
    (lastExercise?.orderIndex ??
      0) + 1;

  return prisma.workoutExercise.create(
    {
      data: {
        workoutId,
        exerciseId,
        orderIndex,
        recommendationType:
          "USER_SELECTED",
        recommendationReason:
          "Added by the user during the workout.",
      },
    },
  );
}

export async function removeWorkoutExercise(
  userId: string,
  workoutId: string,
  workoutExerciseId: string,
) {
  const workout =
    await prisma.workout.findFirst({
      where: {
        id: workoutId,
        userId,
        completedAt: null,
      },
    });

  if (!workout) {
    throw new Error(
      "Active workout not found.",
    );
  }

  const workoutExercise =
    await prisma.workoutExercise.findFirst(
      {
        where: {
          id: workoutExerciseId,
          workoutId,
        },
      },
    );

  if (!workoutExercise) {
    throw new Error(
      "Workout exercise not found.",
    );
  }

  await prisma.workoutExercise.delete(
    {
      where: {
        id: workoutExerciseId,
      },
    },
  );
}

export async function saveWorkoutSet(
  userId: string,
  workoutExerciseId: string,
  data: {
    setNumber: number;
    weight?: number | null;
    repetitions?: number | null;
  },
) {
  if (
    !Number.isInteger(
      data.setNumber,
    ) ||
    data.setNumber < 1
  ) {
    throw new Error(
      "Invalid set number.",
    );
  }

  const workoutExercise =
    await prisma.workoutExercise.findFirst(
      {
        where: {
          id: workoutExerciseId,
          workout: {
            userId,
            completedAt: null,
          },
        },
      },
    );

  if (!workoutExercise) {
    throw new Error(
      "Active workout exercise not found.",
    );
  }

  return prisma.workoutSet.upsert(
    {
      where: {
        workoutExerciseId_setNumber:
          {
            workoutExerciseId,
            setNumber:
              data.setNumber,
          },
      },

      update: {
        weight:
          data.weight ?? null,
        repetitions:
          data.repetitions ??
          null,
      },

      create: {
        workoutExerciseId,
        setNumber:
          data.setNumber,
        weight:
          data.weight ?? null,
        repetitions:
          data.repetitions ??
          null,
      },
    },
  );
}

export async function deleteWorkoutSet(
  userId: string,
  workoutExerciseId: string,
  setId: string,
) {
  const workoutExercise =
    await prisma.workoutExercise.findFirst(
      {
        where: {
          id: workoutExerciseId,
          workout: {
            userId,
            completedAt: null,
          },
        },
      },
    );

  if (!workoutExercise) {
    throw new Error(
      "Active workout exercise not found.",
    );
  }

  const set =
    await prisma.workoutSet.findFirst({
      where: {
        id: setId,
        workoutExerciseId,
      },
    });

  if (!set) {
    throw new Error(
      "Workout set not found.",
    );
  }

  await prisma.workoutSet.delete({
    where: {
      id: set.id,
    },
  });
}

export async function completeWorkout(
  userId: string,
  workoutId: string,
  notes?: string,
) {
  const workout =
    await prisma.workout.findFirst({
      where: {
        id: workoutId,
        userId,
      },
    });

  if (!workout) {
    throw new Error(
      "Workout not found.",
    );
  }

  if (workout.completedAt) {
    return workout;
  }

  const completedAt =
    new Date();

  const durationSeconds =
    workout.startedAt
      ? Math.max(
          0,
          Math.floor(
            (completedAt.getTime() -
              workout.startedAt.getTime()) /
              1000,
          ),
        )
      : null;

  return prisma.workout.update({
    where: {
      id: workoutId,
    },
    data: {
      completedAt,
      durationSeconds,
      notes:
        notes !== undefined
          ? notes
          : workout.notes,
    },
  });
}