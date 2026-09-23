"use client";

import Link from "next/link";

type WarmupRoutineCardProps = {
  routine: {
    id: string;
    name: string;
    description: string | null;
    purpose: string | null;

    muscles: {
      muscleGroup: {
        id: string;
        name: string;
      };
    }[];

    activities: {
      orderIndex: number;
      activity: {
        id: string;
        name: string;
      };
    }[];
  };
};

export function WarmupRoutineCard({
  routine,
}: WarmupRoutineCardProps) {
  const previewActivities = routine.activities.slice(0, 4);

  const remainingActivities = Math.max(
    routine.activities.length - previewActivities.length,
    0,
  );

  return (
    <article className="flex h-full flex-col rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {routine.name}
        </h3>

        {routine.description && (
          <p className="mt-2 text-sm leading-6 text-gray-600">
            {routine.description}
          </p>
        )}
      </div>

      {/* Target Muscles */}
      {routine.muscles.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Target muscles
          </p>

          <div className="flex flex-wrap gap-2">
            {routine.muscles.slice(0, 5).map(({ muscleGroup }) => (
              <span
                key={muscleGroup.id}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
              >
                {muscleGroup.name}
              </span>
            ))}

            {routine.muscles.length > 5 && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                +{routine.muscles.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Activity Preview */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Activities
          </p>

          <span className="text-xs text-gray-500">
            {routine.activities.length} total
          </span>
        </div>

        {routine.activities.length === 0 ? (
          <p className="text-sm text-gray-500">
            No activities added yet.
          </p>
        ) : (
          <ol className="space-y-2">
            {previewActivities.map(
              ({ orderIndex, activity }) => (
                <li
                  key={`${routine.id}-${activity.id}`}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                    {orderIndex}
                  </span>

                  <span className="truncate">
                    {activity.name}
                  </span>
                </li>
              ),
            )}
          </ol>
        )}

        {remainingActivities > 0 && (
          <p className="mt-2 text-xs text-gray-500">
            +{remainingActivities} more activities
          </p>
        )}
      </div>

      {/* Action */}
      <div className="mt-auto pt-6">
        <Link
          href={`/warmups/${routine.id}`}
          className="inline-flex w-full items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
        >
          View Routine
        </Link>
      </div>
    </article>
  );
}