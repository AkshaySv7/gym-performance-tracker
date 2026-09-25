"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import ProgressLineChart from "@/components/progress/progress-line-chart";

import type {
  ExerciseProgressResponse,
  ProgressRange,
} from "@/features/progress/progress-types";

function formatNumber(
  value: number | null | undefined,
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  if (Number.isInteger(value)) {
    return value.toString();
  }

  return value.toFixed(2);
}

function formatDate(
  value: string | null | undefined,
) {
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

export default function ExerciseProgressPage() {
  const params =
    useParams<{
      exerciseId: string;
    }>();

  const exerciseId =
    params.exerciseId;

  const [range, setRange] =
    useState<ProgressRange>("all");

  const [progress, setProgress] =
    useState<ExerciseProgressResponse | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadProgress(
    selectedRange: ProgressRange,
  ) {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `/api/progress/exercises/${exerciseId}?range=${selectedRange}`,
          {
            cache: "no-store",
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ??
            "Unable to load exercise progress.",
        );
      }

      /*
       * The API returns the ExerciseProgressResponse
       * directly. It does NOT return { progress: ... }.
       */
      setProgress(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load exercise progress.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!exerciseId) {
      return;
    }

    void loadProgress(range);
  }, [exerciseId, range]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-gray-500">
            Loading exercise progress...
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
              Unable to load exercise progress
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

  if (!progress) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-gray-500">
            No progress data found.
          </p>
        </div>
      </main>
    );
  }

  const weightPoints =
    progress.history
      .filter(
        (session) =>
          session.maxWeight !== null,
      )
      .map(
        (session) => ({
          label: formatDate(
            session.workoutDate,
          ),
          value:
            session.maxWeight ?? 0,
        }),
      );

  const volumePoints =
    progress.history.map(
      (session) => ({
        label: formatDate(
          session.workoutDate,
        ),
        value:
          session.totalVolume,
      }),
    );

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <Link
            href="/progress/exercises"
            className="text-sm font-semibold text-gray-500 hover:text-gray-900"
          >
            ← Exercise Progress
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
                Exercise Performance
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {progress.exercise.name}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Your recorded performance for this exercise.
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

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Best Weight
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {progress.summary.bestWeight ===
              null
                ? "—"
                : `${formatNumber(
                    progress.summary.bestWeight,
                  )} kg`}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Best Reps
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {progress.summary.bestRepetitions ===
              null
                ? "—"
                : progress.summary.bestRepetitions}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Volume
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatNumber(
                progress.summary.totalVolume,
              )}{" "}
              kg
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Workouts
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {progress.summary.workoutCount}
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <ProgressLineChart
            title="Weight Progression"
            points={weightPoints}
            suffix=" kg"
          />

          <ProgressLineChart
            title="Volume Progression"
            points={volumePoints}
            suffix=" kg"
          />
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Sessions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Recorded completed workouts for this exercise.
            </p>
          </div>

          {progress.history.length ===
          0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <p className="font-semibold text-gray-900">
                No sessions in this range.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Try a longer time range.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Date
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Best Weight
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Best Reps
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Volume
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Sets
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {progress.history.map(
                      (session) => (
                        <tr
                          key={
                            session.workoutId
                          }
                          className="border-b border-gray-100 last:border-0"
                        >
                          <td className="px-5 py-4 text-sm font-medium text-gray-900">
                            {formatDate(
                              session.workoutDate,
                            )}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {session.maxWeight ===
                            null
                              ? "—"
                              : `${formatNumber(
                                  session.maxWeight,
                                )} kg`}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {session.maxRepetitions ??
                              "—"}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {formatNumber(
                              session.totalVolume,
                            )}{" "}
                            kg
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {session.sets.length}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}