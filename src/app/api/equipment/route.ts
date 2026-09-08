import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("AUTHENTICATED USER:", user?.id);
  console.log("AUTHENTICATED EMAIL:", user?.email);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const equipment = await prisma.equipment.findMany({
    orderBy: [
      {
        equipmentType: "asc",
      },
      {
        name: "asc",
      },
    ],
  });

  const userEquipment =
    await prisma.userEquipment.findMany({
      where: {
        userId: user.id,
      },
      select: {
        equipmentId: true,
      },
    });

  const selectedIds = new Set(
    userEquipment.map(
      (item) => item.equipmentId,
    ),
  );

  return NextResponse.json({
    equipment: equipment.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      equipmentType: item.equipmentType,
      minWeightKg: item.minWeightKg
        ? Number(item.minWeightKg)
        : null,
      maxWeightKg: item.maxWeightKg
        ? Number(item.maxWeightKg)
        : null,
      selected: selectedIds.has(item.id),
    })),
  });
}

export async function POST(request: Request) {
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

  if (!body.equipmentId) {
    return NextResponse.json(
      {
        error: "Equipment ID is required",
      },
      { status: 400 },
    );
  }

  const equipment =
    await prisma.equipment.findUnique({
      where: {
        id: body.equipmentId,
      },
    });

  if (!equipment) {
    return NextResponse.json(
      {
        error: "Equipment not found",
      },
      { status: 404 },
    );
  }

  const userEquipment =
    await prisma.userEquipment.upsert({
      where: {
        userId_equipmentId: {
          userId: user.id,
          equipmentId: body.equipmentId,
        },
      },

      update: {
        notes: body.notes ?? null,
      },

      create: {
        userId: user.id,
        equipmentId: body.equipmentId,
        notes: body.notes ?? null,
      },
    });

  return NextResponse.json({
    success: true,
    userEquipment,
  });
}

export async function DELETE(request: Request) {
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

  if (!body.equipmentId) {
    return NextResponse.json(
      {
        error: "Equipment ID is required",
      },
      { status: 400 },
    );
  }

  await prisma.userEquipment.deleteMany({
    where: {
      userId: user.id,
      equipmentId: body.equipmentId,
    },
  });

  return NextResponse.json({
    success: true,
  });
}