import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const activities = await prisma.warmupActivity.findMany({
      orderBy: {
        name: "asc",
      },
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
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Failed to fetch warm-up activities:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch warm-up activities",
      },
      {
        status: 500,
      },
    );
  }
}