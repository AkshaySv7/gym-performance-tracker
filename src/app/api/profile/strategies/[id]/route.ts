//11. API — update/delete custom strategy

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  deleteOrArchiveUserStrategy,
  getUserStrategy,
  updateUserStrategy,
} from "@/lib/training/strategy-service";

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

    const { id } = await params;

    const strategy = await getUserStrategy(user.id, id);

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

    return NextResponse.json({
      strategy,
    });
  } catch (error) {
    console.error(
      "GET /api/profile/strategies/[id] failed:",
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

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
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

    const { id } = await params;
    const body = await request.json();

    if (
      typeof body.name !== "string" ||
      !Array.isArray(body.days)
    ) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "name and days are required.",
          },
        },
        { status: 400 },
      );
    }

    const strategy = await updateUserStrategy(
      user.id,
      id,
      body.name,
      body.days,
    );

    return NextResponse.json({
      strategy,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";

    if (message === "STRATEGY_NOT_FOUND") {
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

    if (
      message === "PREDEFINED_STRATEGY_CANNOT_BE_EDITED" ||
      message === "STRATEGY_HAS_HISTORY"
    ) {
      return NextResponse.json(
        {
          error: {
            code: "CONFLICT",
            message:
              message === "STRATEGY_HAS_HISTORY"
                ? "This strategy already has workout history and cannot be modified."
                : "Predefined strategies cannot be modified.",
          },
        },
        { status: 409 },
      );
    }

    if (
      message === "INVALID_NAME" ||
      message === "NAME_TOO_LONG" ||
      message.includes("day") ||
      message.includes("Day")
    ) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message,
          },
        },
        { status: 400 },
      );
    }

    console.error(
      "PATCH /api/profile/strategies/[id] failed:",
      error,
    );

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to update strategy.",
        },
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
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

    const { id } = await params;

    const result = await deleteOrArchiveUserStrategy(
      user.id,
      id,
    );

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";

    if (message === "STRATEGY_NOT_FOUND") {
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

    if (message === "STRATEGY_HAS_HISTORY") {
      return NextResponse.json(
        {
          error: {
            code: "CONFLICT",
            message:
              "This strategy has workout history and cannot be deleted.",
          },
        },
        { status: 409 },
      );
    }

    console.error(
      "DELETE /api/profile/strategies/[id] failed:",
      error,
    );

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to remove strategy.",
        },
      },
      { status: 500 },
    );
  }
}