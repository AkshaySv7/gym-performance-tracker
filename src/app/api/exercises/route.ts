import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);

  const muscle = searchParams.get("muscle");
  const equipment = searchParams.get("equipment");
  const difficulty =
    searchParams.get("difficulty");
  const search = searchParams.get("search");

  const exercises =
    await prisma.exercise.findMany({
      where: {
        ...(muscle
          ? {
              muscles: {
                some: {
                  role: "PRIMARY",
                  muscleGroup: {
                    name: muscle,
                  },
                },
              },
            }
          : {}),

        ...(equipment
          ? {
              equipment: {
                some: {
                  equipment: {
                    name: equipment,
                  },
                },
              },
            }
          : {}),

        ...(difficulty
          ? {
              difficultyLevel: difficulty,
            }
          : {}),

        ...(search
          ? {
              name: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {}),
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
          take: 1,
        },
      },

      orderBy: {
        name: "asc",
      },
    });

  return NextResponse.json({
    exercises,
  });
}