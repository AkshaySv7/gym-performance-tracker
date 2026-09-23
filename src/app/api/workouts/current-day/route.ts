import { NextResponse } from "next/server";
import { ensureUser } from "@/features/profile/ensure-user";
import { getCurrentStrategyDay } from "@/features/workouts/workout-service";

export async function GET() {
  try {
    const user =
      await ensureUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        { status: 401 },
      );
    }

    const currentDay =
      await getCurrentStrategyDay(
        user.id,
      );

    return NextResponse.json({
      currentDay,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Unable to determine current training day.",
      },
      { status: 500 },
    );
  }
}