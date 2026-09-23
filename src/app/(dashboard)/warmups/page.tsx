
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { WarmupRoutineCard } from "@/components/warmups/warmup-routine-card";

export default async function WarmupsPage() {
  const routines = await prisma.warmupRoutine.findMany({
    orderBy: {
      name: "asc",
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
            },
          },
        },
      },
    },
  });

  return (
    <main className="space-y-10 p-6">
      {/* Page Header */}
      <header>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Warm-ups
            </h1>

            <p className="mt-2 max-w-3xl text-gray-600">
              Prepare your body before training with structured
              warm-up routines and individual warm-up activities.
            </p>
          </div>

          <Link
            href="/warmups/activities"
            className="inline-flex w-fit items-center rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
          >
            Browse Activities
          </Link>
        </div>
      </header>

      {/* Routine Section */}
      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-gray-900">
            Warm-up Routines
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Choose a routine based on the body part you are training.
          </p>
        </div>

        {routines.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
            No warm-up routines available.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {routines.map((routine) => (
              <WarmupRoutineCard
                key={routine.id}
                routine={routine}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

