"use client";

import { useEffect, useState } from "react";

type Warmup = {
  id: string;
  name: string;
  description: string;
  recommendedSets: number | null;
  recommendedReps: number | null;
  recommendedDurationSeconds: number | null;
  purpose: string | null;
  focus: string;
  completed: boolean;
  completion: {
    id: string;
    setsCompleted: number | null;
    repsCompleted: number | null;
    durationSeconds: number | null;
    notes: string | null;
  } | null;
};

type WarmupResponse = {
  workout: {
    id: string;
    workoutDate: string;
    focus: string;
  };
  focuses: string[];
  warmups: Warmup[];
};

type WarmupSectionProps = {
  workoutId: string;
};

export default function WarmupSection({
  workoutId,
}: WarmupSectionProps) {
  const [data, setData] =
    useState<WarmupResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] =
    useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWarmup() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/workouts/${workoutId}/warmup`,
          {
            cache: "no-store",
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error?.message ||
              "Unable to load warm-up.",
          );
        }

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load warm-up.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadWarmup();
  }, [workoutId]);

  async function completeWarmup(
    warmup: Warmup,
  ) {
    try {
      setSavingId(warmup.id);
      setError("");

      const response = await fetch(
        `/api/workouts/${workoutId}/warmup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exerciseWarmupId: warmup.id,
            setsCompleted:
              warmup.recommendedSets,
            repsCompleted:
              warmup.recommendedReps,
            durationSeconds:
              warmup.recommendedDurationSeconds,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error?.message ||
            "Unable to save warm-up.",
        );
      }

      setData((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          warmups: current.warmups.map(
            (item) =>
              item.id === warmup.id
                ? {
                    ...item,
                    completed: true,
                    completion: {
                      id: result.warmup.id,
                      setsCompleted:
                        result.warmup.setsCompleted,
                      repsCompleted:
                        result.warmup.repsCompleted,
                      durationSeconds:
                        result.warmup.durationSeconds,
                      notes:
                        result.warmup.notes,
                    },
                  }
                : item,
          ),
        };
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save warm-up.",
      );
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">
          Preparing your warm-up...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">
          Warm-up unavailable
        </h2>

        <p className="mt-2 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  const completedCount =
    data.warmups.filter(
      (warmup) => warmup.completed,
    ).length;

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
              Warm-up
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Prepare for {data.workout.focus}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Complete these preparation movements before
              your main exercises.
            </p>
          </div>

          <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700">
            {completedCount} / {data.warmups.length} completed
          </div>
        </div>
      </div>

      {data.warmups.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="font-semibold text-gray-900">
            No specific warm-up found
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            There is currently no warm-up knowledge associated
            with this training focus.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {data.warmups.map((warmup, index) => (
          <div
            key={warmup.id}
            className={`rounded-2xl border bg-white p-6 shadow-sm ${
              warmup.completed
                ? "border-green-300"
                : "border-gray-200"
            }`}
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                  {index + 1}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {warmup.name}
                    </h3>

                    {warmup.completed && (
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                        Completed
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {warmup.description}
                  </p>

                  {warmup.purpose && (
                    <div className="mt-4 rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Purpose
                      </p>

                      <p className="mt-1 text-sm leading-6 text-gray-700">
                        {warmup.purpose}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {warmup.recommendedSets != null && (
                      <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700">
                        {warmup.recommendedSets} sets
                      </span>
                    )}

                    {warmup.recommendedReps != null && (
                      <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700">
                        {warmup.recommendedReps} reps
                      </span>
                    )}

                    {warmup.recommendedDurationSeconds !=
                      null && (
                      <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700">
                        {warmup.recommendedDurationSeconds}s
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={
                  warmup.completed ||
                  savingId === warmup.id
                }
                onClick={() =>
                  completeWarmup(warmup)
                }
                className="shrink-0 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingId === warmup.id
                  ? "Saving..."
                  : warmup.completed
                    ? "Completed"
                    : "Mark Complete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}