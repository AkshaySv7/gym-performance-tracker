import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { activateUserStrategy } from "@/lib/training/strategy-service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: Request,
  { params }: RouteContext,
) {
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

    const { id } = await params;

    const strategy = await activateUserStrategy(
      user.id,
      id,
    );

    return NextResponse.json({
      strategy,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";

    if (message === "STRATEGY_NOT_FOUND") {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Strategy not found.",
          },
        },
        { status: 404 },
      );
    }

    console.error(
      "POST /api/profile/strategies/[id]/activate failed:",
      error,
    );

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to activate strategy.",
        },
      },
      { status: 500 },
    );
  }
}