import { NextResponse } from "next/server";
import { ensureUser } from "@/features/profile/ensure-user";
import { getWorkoutById } from "@/features/workouts/workout-service";
import { prisma } from "@/lib/db/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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

    const workout = await getWorkoutById(
      user.id,
      id,
    );

    if (!workout) {
      return NextResponse.json(
        { error: "Workout not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ workout });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to load workout." },
      { status: 500 },
    );
  }
}

export async function PATCH(
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
      },
    });

    if (!workout) {
      return NextResponse.json(
        { error: "Workout not found." },
        { status: 404 },
      );
    }

    if (workout.completedAt) {
      return NextResponse.json(
        {
          error:
            "Completed workouts cannot be edited.",
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    const updated = await prisma.workout.update({
      where: {
        id,
      },
      data: {
        notes:
          typeof body.notes === "string"
            ? body.notes
            : workout.notes,
      },
    });

    return NextResponse.json({
      workout: updated,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to update workout." },
      { status: 500 },
    );
  }
}