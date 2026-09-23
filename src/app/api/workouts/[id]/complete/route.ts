import { NextResponse } from "next/server";
import { ensureUser } from "@/features/profile/ensure-user";
import { completeWorkout } from "@/features/workouts/workout-service";

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

    let notes: string | undefined;

    try {
      const body = await request.json();

      if (typeof body.notes === "string") {
        notes = body.notes;
      }
    } catch {
      // No body is acceptable.
    }

    const workout = await completeWorkout(
      user.id,
      id,
      notes,
    );

    return NextResponse.json({ workout });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to complete workout.",
      },
      { status: 400 },
    );
  }
}