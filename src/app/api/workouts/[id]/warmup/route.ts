import { NextResponse } from "next/server";
import { ensureUser } from "@/features/profile/ensure-user";
import { prisma } from "@/lib/db/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function getRoutineNamesForFocus(
  focus: string,
): string[] {
  const value = focus.toLowerCase();

  if (value.includes("push")) {
    return [
      "Chest Warm-up",
      "Shoulder Warm-up",
      "Triceps Warm-up",
    ];
  }

  if (value.includes("pull")) {
    return [
      "Back Warm-up",
      "Biceps Warm-up",
    ];
  }

  if (value.includes("upper")) {
    return [
      "Chest Warm-up",
      "Back Warm-up",
      "Shoulder Warm-up",
      "Biceps Warm-up",
      "Triceps Warm-up",
    ];
  }

  if (value.includes("lower")) {
    return [
      "Legs Warm-up",
      "Abs / Core Warm-up",
    ];
  }

  const mappings = [
    "Chest",
    "Triceps",
    "Back",
    "Biceps",
    "Shoulder",
    "Abs",
    "Core",
    "Leg",
  ];

  for (const mapping of mappings) {
    if (value.includes(mapping.toLowerCase())) {
      if (
        mapping === "Abs" ||
        mapping === "Core"
      ) {
        return ["Abs / Core Warm-up"];
      }

      if (mapping === "Leg") {
        return ["Legs Warm-up"];
      }

      if (mapping === "Shoulder") {
        return ["Shoulder Warm-up"];
      }

      return [`${mapping} Warm-up`];
    }
  }

  return [];
}

export async function GET(
  _request: Request,
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

    const workout = await prisma.workout.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        strategyDay: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!workout) {
      return NextResponse.json(
        { error: "Workout not found." },
        { status: 404 },
      );
    }

    const focus = workout.strategyDay.name;

    const routineNames =
      getRoutineNamesForFocus(focus);

    if (routineNames.length === 0) {
      return NextResponse.json({
        workout: {
          id: workout.id,
          workoutDate: workout.workoutDate,
          focus,
        },
        routines: [],
      });
    }

    const routines =
      await prisma.warmupRoutine.findMany({
        where: {
          name: {
            in: routineNames,
          },
        },
        orderBy: {
          name: "asc",
        },
        include: {
          activities: {
            orderBy: {
              orderIndex: "asc",
            },
            include: {
              activity: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  warmupType: true,
                  recommendedSets: true,
                  recommendedReps: true,
                  recommendedDurationSeconds: true,
                  purpose: true,
                },
              },
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
      });

    const completedRoutineIds =
      new Set(
        (
          await prisma.workoutWarmup.findMany({
            where: {
              workoutId: workout.id,
            },
            select: {
              routineId: true,
            },
          })
        ).map((item) => item.routineId),
      );

    return NextResponse.json({
      workout: {
        id: workout.id,
        workoutDate: workout.workoutDate,
        focus,
      },
      routines: routines.map((routine) => ({
        id: routine.id,
        name: routine.name,
        description: routine.description,
        purpose: routine.purpose,
        muscles: routine.muscles.map(
          (item) => item.muscleGroup.name,
        ),
        activities: routine.activities.map(
          (item) => item.activity,
        ),
        completed: completedRoutineIds.has(
          routine.id,
        ),
      })),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Unable to load warm-up routines.",
      },
      { status: 500 },
    );
  }
}

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

    const workout = await prisma.workout.findFirst({
      where: {
        id,
        userId: user.id,
        completedAt: null,
      },
    });

    if (!workout) {
      return NextResponse.json(
        { error: "Active workout not found." },
        { status: 404 },
      );
    }

    const body = await request.json();

    if (
      typeof body.routineId !== "string" ||
      !body.routineId
    ) {
      return NextResponse.json(
        { error: "routineId is required." },
        { status: 400 },
      );
    }

    const routine =
      await prisma.warmupRoutine.findUnique({
        where: {
          id: body.routineId,
        },
      });

    if (!routine) {
      return NextResponse.json(
        { error: "Warm-up routine not found." },
        { status: 404 },
      );
    }

    const workoutWarmup =
      await prisma.workoutWarmup.upsert({
        where: {
          workoutId_routineId: {
            workoutId: workout.id,
            routineId: routine.id,
          },
        },
        update: {
          notes:
            typeof body.notes === "string"
              ? body.notes
              : undefined,
        },
        create: {
          workoutId: workout.id,
          routineId: routine.id,
          notes:
            typeof body.notes === "string"
              ? body.notes
              : null,
        },
        include: {
          routine: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

    return NextResponse.json({
      warmup: workoutWarmup,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save warm-up.",
      },
      { status: 400 },
    );
  }
}