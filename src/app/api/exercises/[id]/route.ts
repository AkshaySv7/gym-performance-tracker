import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
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

  const { id } = await context.params;

  const exercise = await prisma.exercise.findUnique({
    where: {
      id,
    },

    include: {
      muscles: {
        include: {
          muscleGroup: true,
        },
      },

      equipment: {
        include: {
          equipment: true,
        },
      },

      images: {
        orderBy: {
          displayOrder: "asc",
        },
      },
    },
  });

  if (!exercise) {
    return NextResponse.json(
      { error: "Exercise not found" },
      { status: 404 },
    );
  }

  const muscleNames = exercise.muscles.map(
    (item) => item.muscleGroup.name,
  );

  const warmups = await prisma.warmupRoutine.findMany({
    where: {
      muscles: {
        some: {
          muscleGroup: {
            name: {
              in: muscleNames,
            },
          },
        },
      },
    },

    include: {
      muscles: {
        include: {
          muscleGroup: true,
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

    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json({
    exercise,
    warmups,
  });
}