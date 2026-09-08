import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const [
      equipment,
      muscles,
      strategies,
      exercises,
    ] = await Promise.all([
      prisma.equipment.count(),
      prisma.muscleGroup.count(),
      prisma.trainingStrategy.count(),
      prisma.exercise.count(),
    ]);

    return NextResponse.json({
      success: true,
      database: "connected",
      counts: {
        equipment,
        muscles,
        strategies,
        exercises,
      },
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return NextResponse.json(
      {
        success: false,
        database: "disconnected",
      },
      {
        status: 500,
      },
    );
  }
}