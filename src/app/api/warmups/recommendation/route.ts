import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const muscleParameter =
      request.nextUrl.searchParams.get("muscles");

    if (!muscleParameter) {
      return NextResponse.json(
        {
          error:
            "Provide muscles using ?muscles=Quadriceps,Glutes,Hamstrings",
        },
        {
          status: 400,
        },
      );
    }

    const requestedMuscles = muscleParameter
      .split(",")
      .map((muscle) => muscle.trim())
      .filter(Boolean);

    if (requestedMuscles.length === 0) {
      return NextResponse.json(
        {
          error: "At least one muscle is required",
        },
        {
          status: 400,
        },
      );
    }

    const routines = await prisma.warmupRoutine.findMany({
      include: {
        muscles: {
          include: {
            muscleGroup: {
              select: {
                name: true,
              },
            },
          },
        },
        activities: {
          orderBy: {
            orderIndex: "asc",
          },
          include: {
            activity: {
              select: {
                id: true,
                name: true,
                warmupType: true,
                recommendedSets: true,
                recommendedReps: true,
                recommendedDurationSeconds: true,
                restSeconds: true,
              },
            },
          },
        },
      },
    });

    const normalizedRequestedMuscles =
      requestedMuscles.map((muscle) => muscle.toLowerCase());

    const rankedRoutines = routines
      .map((routine) => {
        const routineMuscles = routine.muscles.map(
          (item) => item.muscleGroup.name,
        );

        const matchedMuscles = routineMuscles.filter((muscle) =>
          normalizedRequestedMuscles.includes(
            muscle.toLowerCase(),
          ),
        );

        return {
          ...routine,
          matchCount: matchedMuscles.length,
          matchedMuscles,
        };
      })
      .filter((routine) => routine.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);

    if (rankedRoutines.length === 0) {
      return NextResponse.json({
        recommendation: null,
        requestedMuscles,
        message:
          "No warm-up routine matched the requested muscles.",
      });
    }

    const bestRoutine = rankedRoutines[0];

    return NextResponse.json({
      recommendation: bestRoutine,
      alternatives: rankedRoutines.slice(1, 4),
      requestedMuscles,
    });
  } catch (error) {
    console.error(
      "Failed to generate warm-up recommendation:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to generate warm-up recommendation",
      },
      {
        status: 500,
      },
    );
  }
}