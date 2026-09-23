
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { WarmupRoutineDetail } from "@/components/warmups/warmup-routine-detail";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WarmupRoutinePage({
  params,
}: PageProps) {
  const { id } = await params;

  const routine = await prisma.warmupRoutine.findUnique({
    where: {
      id,
    },
    include: {
      muscles: {
        include: {
          muscleGroup: {
            select: {
              id: true,
              name: true,
            },
          },
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
  });

  if (!routine) {
    notFound();
  }

  return (
    <main className="p-6">
      <div className="mb-6">
        <Link
          href="/warmups"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Warm-ups
        </Link>
      </div>

      <WarmupRoutineDetail routine={routine} />
    </main>
  );
}
