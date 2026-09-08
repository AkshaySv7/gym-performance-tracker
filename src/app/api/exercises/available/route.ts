import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createClient } from "@/lib/supabase/server";

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

  const userEquipment =
    await prisma.userEquipment.findMany({
      where: {
        userId: user.id,
      },
      select: {
        equipmentId: true,
      },
    });

  const equipmentIds =
    userEquipment.map(
      (item) => item.equipmentId,
    );

  const exercises =
    await prisma.exercise.findMany({
      where: {
        OR: [
          {
            equipment: {
              none: {},
            },
          },

          {
            equipment: {
              every: {
                equipmentId: {
                  in: equipmentIds,
                },
              },
            },
          },
        ],
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
          take: 1,
          orderBy: {
            displayOrder: "asc",
          },
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