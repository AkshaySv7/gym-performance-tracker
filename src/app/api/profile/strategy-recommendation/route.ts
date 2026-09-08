// 13. API — strategy recommendation

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { generateStrategyRecommendation } from "@/lib/training/strategy-recommendation";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHENTICATED",
            message: "Authentication required.",
          },
        },
        { status: 401 },
      );
    }

    const recommendation =
      await generateStrategyRecommendation(user.id);

    return NextResponse.json(recommendation);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";

    if (message === "USER_NOT_FOUND") {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "User profile not found.",
          },
        },
        { status: 404 },
      );
    }

    console.error(
      "GET /api/profile/strategy-recommendation failed:",
      error,
    );

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message:
            "Unable to generate a strategy recommendation.",
        },
      },
      { status: 500 },
    );
  }
}