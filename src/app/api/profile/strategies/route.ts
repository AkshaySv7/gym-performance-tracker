//9. API — user's strategies

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  getUserStrategies,
  selectPredefinedStrategy,
} from "@/lib/training/strategy-service";

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

    const strategies = await getUserStrategies(user.id);

    return NextResponse.json({
      strategies,
    });
  } catch (error) {
    console.error(
      "GET /api/profile/strategies failed:",
      error,
    );

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to load your strategies.",
        },
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();

    if (
      typeof body.strategyId !== "string" ||
      !body.strategyId
    ) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "strategyId is required.",
          },
        },
        { status: 400 },
      );
    }

    const strategy = await selectPredefinedStrategy(
      user.id,
      body.strategyId,
    );

    return NextResponse.json(
      {
        strategy,
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";

    if (message === "PREDEFINED_STRATEGY_NOT_FOUND") {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Predefined strategy not found.",
          },
        },
        { status: 404 },
      );
    }

    if (message === "STRATEGY_STRUCTURE_NOT_FOUND") {
      return NextResponse.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message:
              "The selected strategy does not have a weekly structure.",
          },
        },
        { status: 500 },
      );
    }

    console.error(
      "POST /api/profile/strategies failed:",
      error,
    );

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to select strategy.",
        },
      },
      { status: 500 },
    );
  }
}