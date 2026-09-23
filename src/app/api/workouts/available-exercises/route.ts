import { NextRequest, NextResponse } from "next/server";
import { ensureUser } from "@/features/profile/ensure-user";
import { prisma } from "@/lib/db/prisma";
import { expandFocusMuscles } from "@/lib/training/strategy-definitions";

function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function matchesMuscle(
  muscleName: string,
  targetMuscles: string[],
) {
  const muscle = normalize(muscleName);

  return targetMuscles.some((target) => {
    const normalizedTarget =
      normalize(target);

    return (
      muscle === normalizedTarget ||
      muscle.includes(normalizedTarget) ||
      normalizedTarget.includes(muscle)
    );
  });
}

function formatExercise(exercise: {
  id: string;
  name: string;
  category: string | null;
  muscles: {
    muscleGroup: {
      id: string;
      name: string;
    } | null;
  }[];
}) {
  return {
    id: exercise.id,
    name: exercise.name,
    category: exercise.category,
    muscles: exercise.muscles
      .filter(
        (item) =>
          item?.muscleGroup?.name,
      )
      .map((item) => ({
        muscleGroup: {
          id: item.muscleGroup!.id,
          name: item.muscleGroup!.name,
        },
      })),
  };
}

export async function GET(
  request: NextRequest,
) {
  try {
    const user = await ensureUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const workoutId =
      request.nextUrl.searchParams.get(
        "workoutId",
      );

    const muscle =
      request.nextUrl.searchParams.get(
        "muscle",
      );

    if (!workoutId) {
      return NextResponse.json(
        {
          error:
            "workoutId is required.",
        },
        {
          status: 400,
        },
      );
    }

    const workout =
      await prisma.workout.findFirst({
        where: {
          id: workoutId,
          userId: user.id,
          completedAt: null,
        },

        include: {
          strategyDay: {
            select: {
              focusMuscleGroups: true,
            },
          },

          exercises: {
            select: {
              exerciseId: true,
            },
          },
        },
      });

    if (!workout) {
      return NextResponse.json(
        {
          error:
            "Active workout not found.",
        },
        {
          status: 404,
        },
      );
    }

    const equipment =
      await prisma.userEquipment.findMany({
        where: {
          userId: user.id,
        },

        select: {
          equipmentId: true,
        },
      });

    const availableEquipment =
      new Set(
        equipment.map(
          (item) =>
            item.equipmentId,
        ),
      );

    const existingExerciseIds =
      new Set(
        workout.exercises.map(
          (item) =>
            item.exerciseId,
        ),
      );

    const exercises =
      await prisma.exercise.findMany({
        orderBy: {
          name: "asc",
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
      });

    /*
     * First determine which exercises are
     * actually available to the user.
     *
     * An exercise is available when:
     *
     * 1. It is not already in the workout.
     * 2. Every required equipment item is
     *    available to the user.
     */
    const available =
      exercises.filter(
        (exercise) => {
          if (
            existingExerciseIds.has(
              exercise.id,
            )
          ) {
            return false;
          }

          return exercise.equipment.every(
            (requirement) =>
              availableEquipment.has(
                requirement.equipmentId,
              ),
          );
        },
      );

    /*
     * These are the strategy-level focus names
     * stored on the strategy day.
     *
     * Example:
     *
     * ["Legs"]
     */
    const focusMuscles =
      workout.strategyDay
        .focusMuscleGroups;

    /*
     * Expand broad strategy targets into the
     * specific muscle groups used by exercises.
     *
     * Example:
     *
     * Legs
     * -> Quadriceps
     * -> Hamstrings
     * -> Glutes
     * -> Calves
     */
    const expandedFocusMuscles =
      expandFocusMuscles(
        focusMuscles,
      );

    /*
     * Recommended exercises:
     *
     * Available exercises that target
     * at least one actual muscle represented
     * by today's strategy focus.
     */
    const recommended =
      available.filter(
        (exercise) =>
          exercise.muscles.some(
            (item) =>
              item.muscleGroup &&
              matchesMuscle(
                item.muscleGroup.name,
                expandedFocusMuscles,
              ),
          ),
      );

    /*
     * If the user selected a specific
     * muscle chip, expand that target too.
     *
     * Example:
     *
     * muscle=Legs
     *
     * becomes:
     *
     * Quadriceps, Hamstrings, Glutes, Calves
     */
    const selectedMuscles =
      muscle
        ? expandFocusMuscles([
            muscle,
          ])
        : [];

    const filtered = muscle
      ? available.filter(
          (exercise) =>
            exercise.muscles.some(
              (item) =>
                item.muscleGroup &&
                matchesMuscle(
                  item.muscleGroup.name,
                  selectedMuscles,
                ),
            ),
        )
      : available;

    return NextResponse.json({
      focusMuscles,

      exercises:
        filtered.map(formatExercise),

      recommended:
        recommended.map(formatExercise),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Unable to load available exercises.",
      },
      {
        status: 500,
      },
    );
  }
}