// add or remove exercises from a workout

import { NextResponse } from "next/server";
import { ensureUser } from "@/features/profile/ensure-user";
import {
  addWorkoutExercise,
  removeWorkoutExercise,
} from "@/features/workouts/workout-service";
import { prisma } from "@/lib/db/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext,
) {
  try {
    const user = await ensureUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    const body = await request.json();

    if (
      typeof body.exerciseId !== "string" ||
      !body.exerciseId
    ) {
      return NextResponse.json(
        { error: "exerciseId is required." },
        { status: 400 },
      );
    }

    const workoutExercise =
      await addWorkoutExercise(
        user.id,
        id,
        body.exerciseId,
      );

    /*
     * Return the complete workout exercise so
     * the frontend can update the current workout
     * without reloading the entire page.
     */
    const completeWorkoutExercise =
      await prisma.workoutExercise.findFirst({
        where: {
          id: workoutExercise.id,
          workoutId: id,
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
      });

    if (!completeWorkoutExercise) {
      return NextResponse.json(
        {
          error:
            "Unable to load the added exercise.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        workoutExercise:
          completeWorkoutExercise,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to add exercise.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext,
) {
  try {
    const user = await ensureUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    const url = new URL(request.url);

    const workoutExerciseId =
      url.searchParams.get(
        "workoutExerciseId",
      );

    if (!workoutExerciseId) {
      return NextResponse.json(
        {
          error:
            "workoutExerciseId is required.",
        },
        { status: 400 },
      );
    }

    await removeWorkoutExercise(
      user.id,
      id,
      workoutExerciseId,
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to remove exercise.",
      },
      { status: 400 },
    );
  }
}