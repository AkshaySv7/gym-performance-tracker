import { NextRequest, NextResponse } from "next/server";
import { ensureUser } from "@/features/profile/ensure-user";
import {
  createWorkout,
  getWorkoutHistory,
} from "@/features/workouts/workout-service";

export async function GET() {
  try {
    const user = await ensureUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const workouts = await getWorkoutHistory(user.id);

    return NextResponse.json({
      workouts,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to load workouts.",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const user = await ensureUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    if (
      typeof body.strategyDayId !== "string" ||
      !body.strategyDayId
    ) {
      return NextResponse.json(
        {
          error: "strategyDayId is required.",
        },
        { status: 400 },
      );
    }

    const workout = await createWorkout(
      user.id,
      body.strategyDayId,
    );

    return NextResponse.json(
      { workout },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create workout.",
      },
      { status: 400 },
    );
  }
}