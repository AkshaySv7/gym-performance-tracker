import { NextRequest, NextResponse } from "next/server";
import { ensureUser } from "@/features/profile/ensure-user";
import { getWorkoutFrequency } from "@/features/progress/progress-service";
import type { ProgressRange } from "@/features/progress/progress-types";

function getRange(
  value: string | null,
): ProgressRange {
  if (
    value === "3m" ||
    value === "6m" ||
    value === "all"
  ) {
    return value;
  }

  return "4w";
}

export async function GET(
  request: NextRequest,
) {
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

    const range =
      getRange(
        request.nextUrl.searchParams.get(
          "range",
        ),
      );

    const frequency =
      await getWorkoutFrequency(
        user.id,
        range,
      );

    return NextResponse.json({
      frequency,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Unable to load workout frequency.",
      },
      {
        status: 500,
      },
    );
  }
}