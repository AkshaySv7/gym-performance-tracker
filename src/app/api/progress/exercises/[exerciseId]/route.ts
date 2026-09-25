import { NextRequest, NextResponse } from "next/server";
import { ensureUser } from "@/features/profile/ensure-user";
import { getExerciseProgress } from "@/features/progress/progress-service";
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
  {
    params,
  }: {
    params: Promise<{
      exerciseId: string;
    }>;
  },
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

    const {
      exerciseId,
    } = await params;

    const range =
      getRange(
        request.nextUrl.searchParams.get(
          "range",
        ),
      );

    const result =
      await getExerciseProgress(
        user.id,
        exerciseId,
        range,
      );

    return NextResponse.json(
      result,
    );
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message ===
        "Exercise not found."
    ) {
      return NextResponse.json(
        {
          error: "Exercise not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        error:
          "Unable to load exercise progress.",
      },
      {
        status: 500,
      },
    );
  }
}