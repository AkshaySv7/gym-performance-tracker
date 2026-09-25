import { NextResponse } from "next/server";
import { ensureUser } from "@/features/profile/ensure-user";
import { getExerciseHistory } from "@/features/progress/progress-service";

export async function GET() {
  try {
    const user =
      await ensureUser();

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

    const exercises =
      await getExerciseHistory(
        user.id,
      );

    return NextResponse.json({
      exercises,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Unable to load exercise history.",
      },
      {
        status: 500,
      },
    );
  }
}