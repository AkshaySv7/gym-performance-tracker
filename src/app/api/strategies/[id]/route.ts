//8. API — predefined strategy details

import { NextResponse } from "next/server";
import { getPredefinedStrategy } from "@/lib/training/strategy-service";
import { getStrategyDefinition } from "@/lib/training/strategy-definitions";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    const strategy = await getPredefinedStrategy(id);

    if (!strategy) {
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

    const definition = getStrategyDefinition(
      strategy.strategyType,
    );

    return NextResponse.json({
      strategy: {
        ...strategy,
        recommendedTrainingDays:
          definition?.recommendedTrainingDays ?? null,
        days: definition?.days ?? [],
      },
    });
  } catch (error) {
    console.error(
      "GET /api/strategies/[id] failed:",
      error,
    );

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to load strategy.",
        },
      },
      { status: 500 },
    );
  }
}