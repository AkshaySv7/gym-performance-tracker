type WarmupActivityCardProps = {
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
};

function formatPrescription(
  activity: WarmupActivityCardProps["activity"],
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

export function WarmupActivityCard({
  activity,
}: WarmupActivityCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {activity.name}
          </h3>

          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            {formatWarmupType(activity.warmupType)}
          </p>
        </div>

        <div className="w-fit rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
          {formatPrescription(activity)}
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-600">
        {activity.description}
      </p>

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

      {activity.restSeconds !== null && (
        <div className="mt-auto pt-5">
          <p className="text-xs text-gray-500">
            Recommended rest: {activity.restSeconds} seconds
          </p>
        </div>
      )}
    </article>
  );
}