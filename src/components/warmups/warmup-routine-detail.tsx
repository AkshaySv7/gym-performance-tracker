type WarmupRoutineDetailProps = {
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
      id: string;
      orderIndex: number;

      activity: {
        id: string;
        name: string;
        description: string;
        warmupType: string;
        recommendedSets: number | null;
        recommendedReps: number | null;
        recommendedDurationSeconds: number | null;
        restSeconds: number | null;
        purpose: string | null;
        instructions: string | null;
        beginnerNotes: string | null;
      };
    }[];
  };
};

function formatPrescription(
  activity: WarmupRoutineDetailProps["routine"]["activities"][number]["activity"],
) {
  const parts: string[] = [];

  if (activity.recommendedSets !== null) {
    parts.push(`${activity.recommendedSets} sets`);
  }

  if (activity.recommendedReps !== null) {
    parts.push(`${activity.recommendedReps} reps`);
  }

  if (activity.recommendedDurationSeconds !== null) {
    const seconds = activity.recommendedDurationSeconds;

    if (seconds >= 60 && seconds % 60 === 0) {
      parts.push(`${seconds / 60} min`);
    } else {
      parts.push(`${seconds} sec`);
    }
  }

  return parts.length > 0 ? parts.join(" • ") : "As needed";
}

function formatWarmupType(type: string) {
  return type
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function WarmupRoutineDetail({
  routine,
}: WarmupRoutineDetailProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Routine Header */}
      <header>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {routine.name}
            </h1>

            {routine.description && (
              <p className="mt-2 max-w-3xl leading-7 text-gray-600">
                {routine.description}
              </p>
            )}
          </div>

          <div className="shrink-0 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700">
            {routine.activities.length} activities
          </div>
        </div>

        {routine.purpose && (
          <div className="mt-5 rounded-xl border bg-gray-50 p-5">
            <p className="text-sm font-semibold text-gray-900">
              Purpose
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              {routine.purpose}
            </p>
          </div>
        )}
      </header>

      {/* Target Muscles */}
      {routine.muscles.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            Target muscles
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
            {routine.muscles.map(({ muscleGroup }) => (
              <span
                key={muscleGroup.id}
                className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700"
              >
                {muscleGroup.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Activities */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Activities
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Complete these activities in order before starting your workout.
          </p>
        </div>

        {routine.activities.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
            No activities have been added to this routine yet.
          </div>
        ) : (
          <div className="space-y-4">
            {routine.activities.map(
              ({ id, activity }, index) => (
                <article
                  key={id}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex gap-4">
                    {/* Step Number */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Activity Header */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {activity.name}
                          </h3>

                          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                            {formatWarmupType(activity.warmupType)}
                          </p>
                        </div>

                        <span className="w-fit rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
                          {formatPrescription(activity)}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="mt-4 text-sm leading-6 text-gray-600">
                        {activity.description}
                      </p>

                      {/* Purpose */}
                      {activity.purpose && (
                        <div className="mt-5">
                          <p className="text-sm font-semibold text-gray-900">
                            Purpose
                          </p>

                          <p className="mt-1 text-sm leading-6 text-gray-600">
                            {activity.purpose}
                          </p>
                        </div>
                      )}

                      {/* Instructions */}
                      {activity.instructions && (
                        <div className="mt-5">
                          <p className="text-sm font-semibold text-gray-900">
                            Instructions
                          </p>

                          <p className="mt-1 text-sm leading-6 text-gray-600">
                            {activity.instructions}
                          </p>
                        </div>
                      )}

                      {/* Beginner Notes */}
                      {activity.beginnerNotes && (
                        <div className="mt-5 rounded-lg bg-gray-50 p-3">
                          <p className="text-sm font-semibold text-gray-900">
                            Beginner note
                          </p>

                          <p className="mt-1 text-sm leading-6 text-gray-600">
                            {activity.beginnerNotes}
                          </p>
                        </div>
                      )}

                      {/* Rest */}
                      {activity.restSeconds !== null && (
                        <p className="mt-4 text-xs text-gray-500">
                          Recommended rest: {activity.restSeconds} seconds
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}