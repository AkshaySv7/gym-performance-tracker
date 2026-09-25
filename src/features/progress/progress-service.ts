import { prisma } from "@/lib/db/prisma";
import type {
  ExercisePerformance,
  ExerciseProgressSummary,
  PersonalRecord,
  ProgressOverview,
  ProgressRange,
  ProgressSet,
  WorkoutFrequency,
} from "./progress-types";

type CompletedWorkoutRecord = {
  id: string;
  workoutDate: Date;
  completedAt: Date | null;
  exercises: {
    exerciseId: string;
    exercise: {
      id: string;
      name: string;
    };
    sets: {
      id: string;
      setNumber: number;
      weight: unknown;
      repetitions: number | null;
    }[];
  }[];
};

function toNumber(
  value: unknown,
): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function dateKey(
  value: Date,
): string {
  return value.toISOString().slice(0, 10);
}

function formatDate(
  value: Date,
): string {
  return dateKey(value);
}

function rangeStart(
  range: ProgressRange,
): Date | null {
  if (range === "all") {
    return null;
  }

  const start = new Date();

  if (range === "4w") {
    start.setUTCDate(
      start.getUTCDate() - 28,
    );
  }

  if (range === "3m") {
    start.setUTCDate(
      start.getUTCDate() - 90,
    );
  }

  if (range === "6m") {
    start.setUTCDate(
      start.getUTCDate() - 180,
    );
  }

  start.setUTCHours(
    0,
    0,
    0,
    0,
  );

  return start;
}

function calculateSetVolume(
  weight: number | null,
  repetitions: number | null,
): number {
  if (
    weight === null ||
    repetitions === null
  ) {
    return 0;
  }

  return weight * repetitions;
}

function calculateExerciseVolume(
  sets: {
    weight: unknown;
    repetitions: number | null;
  }[],
): number {
  return sets.reduce(
    (total, set) => {
      return (
        total +
        calculateSetVolume(
          toNumber(set.weight),
          set.repetitions,
        )
      );
    },
    0,
  );
}

function getMaxWeight(
  sets: {
    weight: unknown;
  }[],
): number | null {
  const weights = sets
    .map((set) => toNumber(set.weight))
    .filter(
      (value): value is number =>
        value !== null,
    );

  if (weights.length === 0) {
    return null;
  }

  return Math.max(...weights);
}

function getMaxRepetitions(
  sets: {
    repetitions: number | null;
  }[],
): number | null {
  const repetitions = sets
    .map(
      (set) => set.repetitions,
    )
    .filter(
      (value): value is number =>
        value !== null &&
        Number.isFinite(value),
    );

  if (repetitions.length === 0) {
    return null;
  }

  return Math.max(...repetitions);
}

async function getCompletedWorkouts(
  userId: string,
  range?: ProgressRange,
): Promise<CompletedWorkoutRecord[]> {
  const start =
    range && range !== "all"
      ? rangeStart(range)
      : null;

  return prisma.workout.findMany({
    where: {
      userId,
      completedAt: {
        not: null,
      },
      ...(start
        ? {
            workoutDate: {
              gte: start,
            },
          }
        : {}),
    },
    orderBy: [
      {
        workoutDate: "asc",
      },
      {
        completedAt: "asc",
      },
    ],
    select: {
      id: true,
      workoutDate: true,
      completedAt: true,
      exercises: {
        orderBy: {
          orderIndex: "asc",
        },
        select: {
          exerciseId: true,
          exercise: {
            select: {
              id: true,
              name: true,
            },
          },
          sets: {
            orderBy: {
              setNumber: "asc",
            },
            select: {
              id: true,
              setNumber: true,
              weight: true,
              repetitions: true,
            },
          },
        },
      },
    },
  });
}

function buildExercisePerformance(
  workout: CompletedWorkoutRecord,
  workoutExercise: CompletedWorkoutRecord["exercises"][number],
): ExercisePerformance {
  const sets: ProgressSet[] =
    workoutExercise.sets.map(
      (set) => ({
        id: set.id,
        setNumber: set.setNumber,
        weight: toNumber(set.weight),
        repetitions:
          set.repetitions,
      }),
    );

  return {
    workoutId: workout.id,
    workoutDate: formatDate(
      workout.workoutDate,
    ),
    completedAt:
      workout.completedAt
        ? workout.completedAt.toISOString()
        : "",
    exerciseId:
      workoutExercise.exerciseId,
    exerciseName:
      workoutExercise.exercise.name,
    sets,
    totalVolume:
      calculateExerciseVolume(
        workoutExercise.sets,
      ),
    maxWeight:
      getMaxWeight(
        workoutExercise.sets,
      ),
    maxRepetitions:
      getMaxRepetitions(
        workoutExercise.sets,
      ),
  };
}

export async function getExerciseHistory(
  userId: string,
): Promise<ExerciseProgressSummary[]> {
  const workouts =
    await getCompletedWorkouts(
      userId,
      "all",
    );

  const summaries =
    new Map<
      string,
      ExerciseProgressSummary
    >();

  for (const workout of workouts) {
    for (const workoutExercise of workout.exercises) {
      const exerciseId =
        workoutExercise.exerciseId;

      const volume =
        calculateExerciseVolume(
          workoutExercise.sets,
        );

      const bestWeight =
        getMaxWeight(
          workoutExercise.sets,
        );

      const bestRepetitions =
        getMaxRepetitions(
          workoutExercise.sets,
        );

      const existing =
        summaries.get(exerciseId);

      if (!existing) {
        summaries.set(
          exerciseId,
          {
            exerciseId,
            exerciseName:
              workoutExercise.exercise
                .name,
            workoutCount: 1,
            totalSets:
              workoutExercise.sets
                .length,
            totalVolume: volume,
            bestVolume: volume,
            bestWeight,
            bestRepetitions,
            firstWorkoutDate:
              formatDate(
                workout.workoutDate,
              ),
            latestWorkoutDate:
              formatDate(
                workout.workoutDate,
              ),
          },
        );

        continue;
      }

      existing.workoutCount += 1;

      existing.totalSets +=
        workoutExercise.sets.length;

      existing.totalVolume += volume;

      if (
        existing.bestVolume === null ||
        volume > existing.bestVolume
      ) {
        existing.bestVolume = volume;
      }

      if (
        bestWeight !== null &&
        (
          existing.bestWeight === null ||
          bestWeight >
            existing.bestWeight
        )
      ) {
        existing.bestWeight =
          bestWeight;
      }

      if (
        bestRepetitions !== null &&
        (
          existing.bestRepetitions === null ||
          bestRepetitions >
            existing.bestRepetitions
        )
      ) {
        existing.bestRepetitions =
          bestRepetitions;
      }

      existing.latestWorkoutDate =
        formatDate(
          workout.workoutDate,
        );
    }
  }

  return Array.from(
    summaries.values(),
  ).sort(
    (a, b) =>
      b.latestWorkoutDate!.localeCompare(
        a.latestWorkoutDate!,
      ),
  );
}

export async function getExerciseProgress(
  userId: string,
  exerciseId: string,
  range: ProgressRange = "all",
) {
  const exercise =
    await prisma.exercise.findUnique({
      where: {
        id: exerciseId,
      },
      select: {
        id: true,
        name: true,
      },
    });

  if (!exercise) {
    throw new Error(
      "Exercise not found.",
    );
  }

  const allWorkouts =
    await getCompletedWorkouts(
      userId,
      "all",
    );

  const allHistory: ExercisePerformance[] =
    [];

  for (const workout of allWorkouts) {
    for (const workoutExercise of workout.exercises) {
      if (
        workoutExercise.exerciseId !==
        exerciseId
      ) {
        continue;
      }

      allHistory.push(
        buildExercisePerformance(
          workout,
          workoutExercise,
        ),
      );
    }
  }

  const sortedHistory =
    allHistory.sort((a, b) =>
      a.workoutDate.localeCompare(
        b.workoutDate,
      ),
    );

  const bestWeightValues =
    sortedHistory
      .map(
        (item) => item.maxWeight,
      )
      .filter(
        (value): value is number =>
          value !== null,
      );

  const bestRepetitionValues =
    sortedHistory
      .map(
        (item) =>
          item.maxRepetitions,
      )
      .filter(
        (value): value is number =>
          value !== null,
      );

  const totalVolume =
    sortedHistory.reduce(
      (total, item) =>
        total + item.totalVolume,
      0,
    );

  const filteredStart =
    rangeStart(range);

  const filteredHistory =
    filteredStart
      ? sortedHistory.filter(
          (item) =>
            item.workoutDate >=
            formatDate(
              filteredStart,
            ),
        )
      : sortedHistory;

  const previousSession =
    sortedHistory.length > 0
      ? sortedHistory[
          sortedHistory.length - 1
        ]
      : null;

  return {
    exercise,
    summary: {
      workoutCount:
        sortedHistory.length,
      bestWeight:
        bestWeightValues.length > 0
          ? Math.max(
              ...bestWeightValues,
            )
          : null,
      bestRepetitions:
        bestRepetitionValues.length > 0
          ? Math.max(
              ...bestRepetitionValues,
            )
          : null,
      totalVolume,
    },
    history: filteredHistory,
    previousSession,
  };
}

export async function getPersonalRecords(
  userId: string,
): Promise<PersonalRecord[]> {
  const workouts =
    await getCompletedWorkouts(
      userId,
      "all",
    );

  const records = new Map<
    string,
    PersonalRecord
  >();

  for (const workout of workouts) {
    for (const workoutExercise of workout.exercises) {
      const exerciseId =
        workoutExercise.exerciseId;

      const exerciseName =
        workoutExercise.exercise.name;

      const performance =
        buildExercisePerformance(
          workout,
          workoutExercise,
        );

      if (
        performance.maxWeight !== null
      ) {
        const key =
          `${exerciseId}:WEIGHT`;

        const existing =
          records.get(key);

        if (
          !existing ||
          performance.maxWeight >
            existing.value
        ) {
          records.set(
            key,
            {
              exerciseId,
              exerciseName,
              recordType:
                "WEIGHT",
              value:
                performance.maxWeight,
              workoutDate:
                performance.workoutDate,
            },
          );
        }
      }

      if (
        performance.maxRepetitions !==
        null
      ) {
        const key =
          `${exerciseId}:REPETITIONS`;

        const existing =
          records.get(key);

        if (
          !existing ||
          performance.maxRepetitions >
            existing.value
        ) {
          records.set(
            key,
            {
              exerciseId,
              exerciseName,
              recordType:
                "REPETITIONS",
              value:
                performance.maxRepetitions,
              workoutDate:
                performance.workoutDate,
            },
          );
        }
      }

      if (
        performance.totalVolume > 0
      ) {
        const key =
          `${exerciseId}:VOLUME`;

        const existing =
          records.get(key);

        if (
          !existing ||
          performance.totalVolume >
            existing.value
        ) {
          records.set(
            key,
            {
              exerciseId,
              exerciseName,
              recordType:
                "VOLUME",
              value:
                performance.totalVolume,
              workoutDate:
                performance.workoutDate,
            },
          );
        }
      }
    }
  }

  return Array.from(
    records.values(),
  ).sort((a, b) =>
    b.workoutDate.localeCompare(
      a.workoutDate,
    ),
  );
}

function startOfMonday(
  date: Date,
): Date {
  const result =
    new Date(date);

  result.setUTCHours(
    0,
    0,
    0,
    0,
  );

  const day =
    result.getUTCDay();

  const daysSinceMonday =
    day === 0 ? 6 : day - 1;

  result.setUTCDate(
    result.getUTCDate() -
      daysSinceMonday,
  );

  return result;
}

function addDays(
  date: Date,
  amount: number,
): Date {
  const result =
    new Date(date);

  result.setUTCDate(
    result.getUTCDate() + amount,
  );

  return result;
}

export async function getWorkoutFrequency(
  userId: string,
  range: ProgressRange = "4w",
): Promise<WorkoutFrequency[]> {
  const workouts =
    await getCompletedWorkouts(
      userId,
      range,
    );

  const today =
    new Date();

  const rangeStartDate =
    range === "all"
      ? workouts.length > 0
        ? new Date(
            workouts[0].workoutDate,
          )
        : today
      : rangeStart(range) ?? today;

  const firstWeek =
    startOfMonday(
      rangeStartDate,
    );

  const lastWeek =
    startOfMonday(today);

  const result: WorkoutFrequency[] =
    [];

  let current =
    firstWeek;

  while (
    current.getTime() <=
    lastWeek.getTime()
  ) {
    const periodStart =
      new Date(current);

    const periodEnd =
      addDays(
        periodStart,
        6,
      );

    const startKey =
      dateKey(periodStart);

    const endKey =
      dateKey(periodEnd);

    const count =
      workouts.filter(
        (workout) => {
          const key =
            dateKey(
              workout.workoutDate,
            );

          return (
            key >= startKey &&
            key <= endKey
          );
        },
      ).length;

    result.push({
      periodStart: startKey,
      periodEnd: endKey,
      workoutCount: count,
    });

    current =
      addDays(
        current,
        7,
      );
  }

  return result;
}

export async function getProgressOverview(
  userId: string,
  range: ProgressRange = "4w",
): Promise<ProgressOverview> {
  const workouts =
    await getCompletedWorkouts(
      userId,
      "all",
    );

  let totalExerciseSets = 0;
  let totalVolume = 0;

  for (const workout of workouts) {
    for (const workoutExercise of workout.exercises) {
      totalExerciseSets +=
        workoutExercise.sets.length;

      totalVolume +=
        calculateExerciseVolume(
          workoutExercise.sets,
        );
    }
  }

  const personalRecords =
    await getPersonalRecords(
      userId,
    );

  const frequency =
    await getWorkoutFrequency(
      userId,
      range,
    );

  return {
    completedWorkoutCount:
      workouts.length,
    totalExerciseSets,
    totalVolume,
    personalRecords,
    frequency,
  };
}