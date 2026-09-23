import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { ExerciseDetail } from "@/components/exercise/exercise-detail";

export default async function ExercisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { id } = await params;

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
    notFound();
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

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <ExerciseDetail
          exercise={exercise}
          warmups={warmups}
        />
      </div>
    </main>
  );
}