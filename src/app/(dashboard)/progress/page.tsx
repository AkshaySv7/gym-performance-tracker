"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProgressLineChart from "@/components/progress/progress-line-chart";
import type {
  ExerciseProgressSummary,
  PersonalRecord,
  ProgressOverview,
  ProgressRange,
} from "@/features/progress/progress-types";

function formatNumber(
  value: number,
): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }

  return value.toFixed(2);
}

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "—";
  }

  return new Date(
    `${value}T00:00:00`,
  ).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
}

function recordLabel(
  type: PersonalRecord["recordType"],
) {
  if (type === "WEIGHT") {
    return "Best Weight";
  }

  if (type === "REPETITIONS") {
    return "Best Reps";
  }

  return "Best Volume";
}

function recordValue(
  record: PersonalRecord,
) {
  if (
    record.recordType ===
    "REPETITIONS"
  ) {
    return `${formatNumber(
      record.value,
    )} reps`;
  }

  return `${formatNumber(
    record.value,
  )} kg`;
}

export default function ProgressPage() {
  const [range, setRange] =
    useState<ProgressRange>("4w");

  const [
    overview,
    setOverview,
  ] =
    useState<ProgressOverview | null>(
      null,
    );

  const [
    exercises,
    setExercises,
  ] =
    useState<ExerciseProgressSummary[]>(
      [],
    );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  async function loadProgress(
    selectedRange: ProgressRange,
  ) {
    try {
      setLoading(true);
      setError("");

      const [
        overviewResponse,
        exercisesResponse,
      ] = await Promise.all([
        fetch(
          `/api/progress/overview?range=${selectedRange}`,
        ),
        fetch(
          "/api/progress/exercises",
        ),
      ]);

      const overviewResult =
        await overviewResponse.json();

      const exercisesResult =
        await exercisesResponse.json();

      if (
        !overviewResponse.ok
      ) {
        throw new Error(
          overviewResult?.error ??
            "Unable to load progress.",
        );
      }

      if (
        !exercisesResponse.ok
      ) {
        throw new Error(
          exercisesResult?.error ??
            "Unable to load exercises.",
        );
      }

      setOverview(
        overviewResult.overview,
      );

      setExercises(
        exercisesResult.exercises ??
          [],
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load progress.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProgress(range);
  }, [range]);

  const filteredExercises =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return exercises;
      }

      return exercises.filter(
        (exercise) =>
          exercise.exerciseName
            .toLowerCase()
            .includes(query),
      );
    }, [exercises, search]);

  const recentRecords =
    useMemo(() => {
      return (
        overview?.personalRecords
          .slice(0, 6) ?? []
      );
    }, [overview]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-gray-500">
            Loading your progress...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="font-bold text-red-800">
              Unable to load progress
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                loadProgress(range)
              }
              className="mt-4 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const totalVolume =
    overview?.totalVolume ?? 0;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-gray-500 hover:text-gray-900"
          >
            ← Dashboard
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
                Performance
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Progress
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Review your recorded training
                performance over time.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["4w", "4 Weeks"],
                  ["3m", "3 Months"],
                  ["6m", "6 Months"],
                  ["all", "All Time"],
                ] as const
              ).map(
                ([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setRange(value)
                    }
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      range === value
                        ? "bg-gray-900 text-white"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {label}
                  </button>
                ),
              )}
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Completed Workouts
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {overview?.completedWorkoutCount ??
                0}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Sets
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {overview?.totalExerciseSets ??
                0}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Volume
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatNumber(
                totalVolume,
              )}{" "}
              kg
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Workout Frequency
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Completed workouts by week.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            {overview?.frequency
              .length ? (
              <div className="flex h-56 items-end gap-3 overflow-x-auto">
                {overview.frequency.map(
                  (week) => {
                    const max =
                      Math.max(
                        ...overview.frequency.map(
                          (item) =>
                            item.workoutCount,
                        ),
                        1,
                      );

                    const height =
                      week.workoutCount ===
                      0
                        ? 4
                        : Math.max(
                            12,
                            (week.workoutCount /
                              max) *
                              100,
                          );

                    return (
                      <div
                        key={
                          week.periodStart
                        }
                        className="flex min-w-16 flex-1 flex-col items-center justify-end gap-2"
                      >
                        <span className="text-xs font-semibold text-gray-600">
                          {
                            week.workoutCount
                          }
                        </span>

                        <div className="flex h-36 w-full max-w-12 items-end rounded-lg bg-gray-100">
                          <div
                            className="w-full rounded-lg bg-gray-900 transition-all"
                            style={{
                              height: `${height}%`,
                            }}
                          />
                        </div>

                        <span className="text-center text-[11px] text-gray-400">
                          {formatDate(
                            week.periodStart,
                          )}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">
                Complete your first workout
                to start tracking frequency.
              </p>
            )}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Recent Personal Records
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your highest recorded performance
                values.
              </p>
            </div>
          </div>

          {recentRecords.length ===
          0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <p className="font-semibold text-gray-900">
                No personal records yet.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Complete workouts with recorded
                sets to build your performance
                history.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentRecords.map(
                (record) => (
                  <Link
                    key={`${record.exerciseId}-${record.recordType}`}
                    href={`/progress/exercises/${record.exerciseId}`}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {recordLabel(
                        record.recordType,
                      )}
                    </p>

                    <h3 className="mt-2 font-bold text-gray-900">
                      {record.exerciseName}
                    </h3>

                    <p className="mt-3 text-2xl font-bold text-gray-900">
                      {recordValue(
                        record,
                      )}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      Recorded{" "}
                      {formatDate(
                        record.workoutDate,
                      )}
                    </p>
                  </Link>
                ),
              )}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Your Exercises
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Exercises you have actually performed.
              </p>
            </div>

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search your exercises..."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900 sm:max-w-xs"
            />
          </div>

          {filteredExercises.length ===
          0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <p className="font-semibold text-gray-900">
                {exercises.length ===
                0
                  ? "No exercise performance yet."
                  : "No exercises match your search."}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {exercises.length ===
                0
                  ? "Complete your first workout to start building exercise history."
                  : "Try a different exercise name."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredExercises.map(
                (exercise) => (
                  <Link
                    key={
                      exercise.exerciseId
                    }
                    href={`/progress/exercises/${exercise.exerciseId}`}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {
                            exercise.exerciseName
                          }
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {
                            exercise.workoutCount
                          }{" "}
                          workout
                          {exercise.workoutCount ===
                          1
                            ? ""
                            : "s"}
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-gray-400">
                        View →
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-[11px] text-gray-400">
                          Best Weight
                        </p>

                        <p className="mt-1 font-bold text-gray-900">
                          {exercise.bestWeight ===
                          null
                            ? "—"
                            : `${formatNumber(
                                exercise.bestWeight,
                              )} kg`}
                        </p>
                      </div>

                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-[11px] text-gray-400">
                          Best Reps
                        </p>

                        <p className="mt-1 font-bold text-gray-900">
                          {exercise.bestRepetitions ===
                          null
                            ? "—"
                            : exercise.bestRepetitions}
                        </p>
                      </div>

                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-[11px] text-gray-400">
                          Last
                        </p>

                        <p className="mt-1 text-sm font-bold text-gray-900">
                          {formatDate(
                            exercise.latestWorkoutDate,
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}