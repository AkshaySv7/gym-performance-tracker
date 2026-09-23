import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const routine = await prisma.warmupRoutine.findUnique({
      where: {
        id,
      },
      include: {
        muscles: {
          include: {
            muscleGroup: {
              select: {
                id: true,
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
                description: true,
                warmupType: true,
                recommendedSets: true,
                recommendedReps: true,
                recommendedDurationSeconds: true,
                restSeconds: true,
                purpose: true,
                instructions: true,
                beginnerNotes: true,
              },
            },
          },
        },
      },
    });

    if (!routine) {
      return NextResponse.json(
        {
          error: "Warm-up routine not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(routine);
  } catch (error) {
    console.error("Failed to fetch warm-up routine:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch warm-up routine",
      },
      {
        status: 500,
      },
    );
  }
}