//7. API — predefined strategy catalog

import { NextResponse } from "next/server";
import { listPredefinedStrategies } from "@/lib/training/strategy-service";
import { getStrategyDefinition } from "@/lib/training/strategy-definitions";

export async function GET() {
  try {
    const strategies = await listPredefinedStrategies();

    const result = strategies.map((strategy) => {
      const definition = getStrategyDefinition(
        strategy.strategyType,
      );

      return {
        ...strategy,
        recommendedTrainingDays:
          definition?.recommendedTrainingDays ?? null,
        days: definition?.days ?? [],
      };
    });

    return NextResponse.json({
      strategies: result,
    });
  } catch (error) {
    console.error("GET /api/strategies failed:", error);

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to load strategies.",
        },
      },
      { status: 500 },
    );
  }
}