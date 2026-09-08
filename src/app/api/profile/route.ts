import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/features/profile/ensure-user";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const profile = await ensureUserProfile(user);

  const preferences =
    await prisma.userTrainingPreferences.findUnique({
      where: {
        userId: profile.id,
      },
    });

  return NextResponse.json({
    profile,
    preferences,
  });
}

export async function PUT(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await request.json();

  const profile = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      displayName: body.displayName,
      experienceLevel: body.experienceLevel,
      primaryGoal: body.primaryGoal,
      typicalWorkoutDuration:
        body.typicalWorkoutDuration,
    },
  });

  const preferences =
    await prisma.userTrainingPreferences.upsert({
      where: {
        userId: user.id,
      },
      update: {
        preferredTrainingDays:
          body.preferredTrainingDays,
        preferredVariety:
          body.preferredVariety,
        preferredScheduleType:
          body.preferredScheduleType,
      },
      create: {
        userId: user.id,
        preferredTrainingDays:
          body.preferredTrainingDays,
        preferredVariety:
          body.preferredVariety,
        preferredScheduleType:
          body.preferredScheduleType,
      },
    });

  return NextResponse.json({
    profile,
    preferences,
  });
}