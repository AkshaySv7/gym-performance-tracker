//10. API — custom strategy creation

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { createCustomStrategy } from "@/lib/training/strategy-service";

export async function POST(request: Request) {
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

    const body = await request.json();

    if (typeof body.name !== "string") {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Strategy name is required.",
          },
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.days)) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Days must be an array.",
          },
        },
        { status: 400 },
      );
    }

    const strategy = await createCustomStrategy(
      user.id,
      body.name,
      body.days,
    );

    return NextResponse.json(
      {
        strategy,
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";

    const validationErrors = [
      "INVALID_NAME",
      "NAME_TOO_LONG",
    ];

    if (
      validationErrors.includes(message) ||
      message.includes("Days") ||
      message.includes("day") ||
      message.includes("Day")
    ) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message:
              message === "INVALID_NAME"
                ? "Strategy name must contain at least 2 characters."
                : message === "NAME_TOO_LONG"
                  ? "Strategy name is too long."
                  : message || "Invalid strategy data.",
          },
        },
        { status: 400 },
      );
    }

    console.error(
      "POST /api/profile/strategies/custom failed:",
      error,
    );

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to create custom strategy.",
        },
      },
      { status: 500 },
    );
  }
}