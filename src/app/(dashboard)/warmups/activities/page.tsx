
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { WarmupActivityCard } from "@/components/warmups/warmup-activity-card";

export default async function WarmupActivitiesPage() {
  const activities = await prisma.warmupActivity.findMany({
    orderBy: {
      name: "asc",
    },
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
  });

  return (
    <main className="space-y-8 p-6">
      {/* Page Header */}
      <header>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Warm-up Activities
            </h1>

            <p className="mt-2 max-w-3xl text-gray-600">
              Browse individual warm-up movements, their instructions,
              recommended prescriptions, and beginner guidance.
            </p>
          </div>

          <Link
            href="/warmups"
            className="inline-flex w-fit items-center rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
          >
            ← Back to Routines
          </Link>
        </div>
      </header>

      {/* Activity Library */}
      <section>
        {activities.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
            No warm-up activities available.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {activities.map((activity) => (
              <WarmupActivityCard
                key={activity.id}
                activity={activity}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
