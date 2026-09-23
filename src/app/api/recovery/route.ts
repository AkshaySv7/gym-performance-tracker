import { NextRequest, NextResponse } from "next/server";
import { ensureUser } from "@/features/profile/ensure-user";
import { prisma } from "@/lib/db/prisma";
import { getCurrentStrategyDay } from "@/features/workouts/workout-service";

export async function GET() {
  try {
    const user =
      await ensureUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        { status: 401 },
      );
    }

    const currentDay =
      await getCurrentStrategyDay(
        user.id,
      );

    if (!currentDay) {
      return NextResponse.json(
        {
          error:
            "No active training strategy found.",
        },
        { status: 400 },
      );
    }

    const recovery =
      await prisma.recoveryLog.findUnique(
        {
          where: {
            userId_recoveryDate: {
              userId:
                user.id,
              recoveryDate:
                new Date(),
            },
          },
        },
      );

    return NextResponse.json({
      currentDay,
      recovery,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Unable to load recovery.",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const user =
      await ensureUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        { status: 401 },
      );
    }

    const body =
      await request.json();

    const currentDay =
      await getCurrentStrategyDay(
        user.id,
      );

    if (!currentDay) {
      return NextResponse.json(
        {
          error:
            "No active training strategy found.",
        },
        { status: 400 },
      );
    }

    if (
      currentDay.dayType !==
      "REST"
    ) {
      return NextResponse.json(
        {
          error:
            "Today is not a recovery day.",
        },
        { status: 400 },
      );
    }

    const sleepHours =
      body.sleepHours ===
      null ||
      body.sleepHours ===
      undefined ||
      body.sleepHours ===
      ""
        ? null
        : Number(
            body.sleepHours,
          );

    const energyLevel =
      body.energyLevel ===
      null ||
      body.energyLevel ===
      undefined ||
      body.energyLevel ===
      ""
        ? null
        : Number(
            body.energyLevel,
          );

    const sorenessLevel =
      body.sorenessLevel ===
      null ||
      body.sorenessLevel ===
      undefined ||
      body.sorenessLevel ===
      ""
        ? null
        : Number(
            body.sorenessLevel,
          );

    if (
      sleepHours !== null &&
      (!Number.isFinite(
        sleepHours,
      ) ||
        sleepHours < 0 ||
        sleepHours > 24)
    ) {
      return NextResponse.json(
        {
          error:
            "Sleep hours must be between 0 and 24.",
        },
        { status: 400 },
      );
    }

    if (
      energyLevel !== null &&
      (!Number.isInteger(
        energyLevel,
      ) ||
        energyLevel < 1 ||
        energyLevel > 10)
    ) {
      return NextResponse.json(
        {
          error:
            "Energy level must be between 1 and 10.",
        },
        { status: 400 },
      );
    }

    if (
      sorenessLevel !== null &&
      (!Number.isInteger(
        sorenessLevel,
      ) ||
        sorenessLevel < 1 ||
        sorenessLevel > 10)
    ) {
      return NextResponse.json(
        {
          error:
            "Soreness level must be between 1 and 10.",
        },
        { status: 400 },
      );
    }

    const recovery =
      await prisma.recoveryLog.upsert(
        {
          where: {
            userId_recoveryDate: {
              userId:
                user.id,
              recoveryDate:
                new Date(),
            },
          },

          update: {
            strategyDayId:
              currentDay.id,
            sleepHours,
            energyLevel,
            sorenessLevel,
            notes:
              typeof body.notes ===
              "string"
                ? body.notes.trim() ||
                  null
                : null,
          },

          create: {
            userId:
              user.id,
            strategyDayId:
              currentDay.id,
            recoveryDate:
              new Date(),
            sleepHours,
            energyLevel,
            sorenessLevel,
            notes:
              typeof body.notes ===
              "string"
                ? body.notes.trim() ||
                  null
                : null,
          },
        },
      );

    return NextResponse.json({
      recovery,
      nextDay:
        await getCurrentStrategyDay(
          user.id,
        ),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save recovery.",
      },
      { status: 400 },
    );
  }
}