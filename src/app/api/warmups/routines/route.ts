import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const routines = await prisma.warmupRoutine.findMany({
      orderBy: {
        name: "asc",
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

    return NextResponse.json(routines);
  } catch (error) {
    console.error("Failed to fetch warm-up routines:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch warm-up routines",
      },
      {
        status: 500,
      },
    );
  }
}