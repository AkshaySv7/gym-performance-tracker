"use client";

import { useEffect, useState } from "react";

type Activity = {
  id: string;
  name: string;
  description: string;
  warmupType: string;
  recommendedSets: number | null;
  recommendedReps: number | null;
  recommendedDurationSeconds: number | null;
  purpose: string | null;
};

type WarmupRoutine = {
  id: string;
  name: string;
  description: string | null;
  purpose: string | null;
  muscles: string[];
  activities: Activity[];
  completed: boolean;
};

type WarmupResponse = {
  workout: {
    id: string;
    workoutDate: string;
    focus: string;
  };
  routines: WarmupRoutine[];
};

type WarmupSectionProps = {
  workoutId: string;
};

export default function WarmupSection({
  workoutId,
}: WarmupSectionProps) {
  const [data, setData] =
    useState<WarmupResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [savingId, setSavingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadWarmups() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/workouts/${workoutId}/warmup`,
          {
            cache: "no-store",
          },
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error ??
              "Unable to load warm-up.",
          );
        }

        setData(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load warm-up.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadWarmups();
  }, [workoutId]);

  async function completeRoutine(
    routineId: string,
  ) {
    try {
      setSavingId(routineId);
      setError("");

      const response = await fetch(
        `/api/workouts/${workoutId}/warmup`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            routineId,
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ??
            "Unable to save warm-up.",
        );
      }

      setData((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          routines: current.routines.map(
            (routine) =>
              routine.id === routineId
                ? {
                    ...routine,
                    completed: true,
                  }
                : routine,
          ),
        };
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
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
    data.routines.filter(
      (routine) => routine.completed,
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
              Prepare for{" "}
              {data.workout.focus}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Complete the recommended
              preparation routines before
              your main exercises.
            </p>
          </div>

          <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700">
            {completedCount} /{" "}
            {data.routines.length} completed
          </div>
        </div>
      </div>

      {data.routines.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="font-semibold text-gray-900">
            No specific warm-up found
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            There is currently no warm-up
            routine associated with this
            training focus.
          </p>
        </div>
      )}

      {data.routines.map((routine) => (
        <details
          key={routine.id}
          open={!routine.completed}
          className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
            routine.completed
              ? "border-green-300"
              : "border-gray-200"
          }`}
        >
          <summary className="cursor-pointer list-none p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {routine.name}
                  </h3>

                  {routine.completed && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Completed
                    </span>
                  )}
                </div>

                {routine.description && (
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {routine.description}
                  </p>
                )}
              </div>

              <span className="shrink-0 text-sm font-semibold text-gray-500">
                {routine.completed
                  ? "Expand"
                  : "Collapse"}
              </span>
            </div>
          </summary>

          <div className="border-t border-gray-100 p-6">
            {routine.purpose && (
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Purpose
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-700">
                  {routine.purpose}
                </p>
              </div>
            )}

            {routine.muscles.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {routine.muscles.map(
                  (muscle) => (
                    <span
                      key={muscle}
                      className="rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700"
                    >
                      {muscle}
                    </span>
                  ),
                )}
              </div>
            )}

            <div className="mt-5 space-y-3">
              {routine.activities.map(
                (activity, index) => (
                  <div
                    key={activity.id}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-600">
                        {index + 1}
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {activity.name}
                        </h4>

                        <p className="mt-1 text-sm leading-6 text-gray-600">
                          {activity.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {activity.recommendedSets !=
                            null && (
                            <span className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600">
                              {
                                activity.recommendedSets
                              }{" "}
                              sets
                            </span>
                          )}

                          {activity.recommendedReps !=
                            null && (
                            <span className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600">
                              {
                                activity.recommendedReps
                              }{" "}
                              reps
                            </span>
                          )}

                          {activity.recommendedDurationSeconds !=
                            null && (
                            <span className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600">
                              {
                                activity.recommendedDurationSeconds
                              }
                              s
                            </span>
                          )}
                        </div>

                        {activity.purpose && (
                          <p className="mt-3 text-xs leading-5 text-gray-500">
                            {activity.purpose}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                disabled={
                  routine.completed ||
                  savingId === routine.id
                }
                onClick={() =>
                  completeRoutine(
                    routine.id,
                  )
                }
                className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingId === routine.id
                  ? "Saving..."
                  : routine.completed
                    ? "Completed"
                    : "Mark Complete"}
              </button>
            </div>
          </div>
        </details>
      ))}
    </section>
  );
}