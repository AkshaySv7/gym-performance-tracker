import { NextResponse } from "next/server";
import { ensureUser } from "@/features/profile/ensure-user";
import {
  deleteWorkoutSet,
  saveWorkoutSet,
} from "@/features/workouts/workout-service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext,
) {
  try {
    const user = await ensureUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    const body = await request.json();

    const setNumber = Number(body.setNumber);

    if (
      !Number.isInteger(setNumber) ||
      setNumber < 1
    ) {
      return NextResponse.json(
        { error: "Invalid set number." },
        { status: 400 },
      );
    }

    const weight =
      body.weight === null ||
      body.weight === undefined ||
      body.weight === ""
        ? null
        : Number(body.weight);

    const repetitions =
      body.repetitions === null ||
      body.repetitions === undefined ||
      body.repetitions === ""
        ? null
        : Number(body.repetitions);

    if (
      weight !== null &&
      (!Number.isFinite(weight) ||
        weight < 0)
    ) {
      return NextResponse.json(
        { error: "Invalid weight." },
        { status: 400 },
      );
    }

    if (
      repetitions !== null &&
      (!Number.isInteger(repetitions) ||
        repetitions < 0)
    ) {
      return NextResponse.json(
        { error: "Invalid repetitions." },
        { status: 400 },
      );
    }

    const set = await saveWorkoutSet(
      user.id,
      id,
      {
        setNumber,
        weight,
        repetitions,
      },
    );

    return NextResponse.json({ set });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save set.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext,
) {
  try {
    const user = await ensureUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    const url = new URL(request.url);

    const setId = url.searchParams.get("setId");

    if (!setId) {
      return NextResponse.json(
        { error: "setId is required." },
        { status: 400 },
      );
    }

    await deleteWorkoutSet(
      user.id,
      id,
      setId,
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete set.",
      },
      { status: 400 },
    );
  }
}