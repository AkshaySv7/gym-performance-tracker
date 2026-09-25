"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ExerciseProgressSummary = {
  exerciseId: string;
  exerciseName: string;
  bestWeight: number | null;
  bestRepetitions: number | null;
  bestVolume: number | null;
  workoutCount: number;
  totalSets: number;
  totalVolume: number;
  firstWorkoutDate: string | null;
  latestWorkoutDate: string | null;
};

export default function ProgressExercisesPage() {
  const [exercises, setExercises] = useState<
    ExerciseProgressSummary[]
  >([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExercises() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/progress/exercises", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load exercise progress.",
          );
        }

        setExercises(data.exercises ?? []);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load exercise progress.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadExercises();
  }, []);

  const filteredExercises = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return exercises;
    }

    return exercises.filter((exercise) =>
      exercise.exerciseName.toLowerCase().includes(query),
    );
  }, [exercises, search]);

  function formatDate(date: string | null | undefined) {
    if (!date) {
      return "No sessions";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatNumber(value: number | null | undefined) {
    if (value === null || value === undefined) {
      return "—";
    }

    return value.toLocaleString();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/progress"
            className="mb-4 inline-flex items-center text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            ← Back to Progress
          </Link>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Exercise Progress
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Search your exercises and view their performance history.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search exercises..."
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 sm:max-w-md"
          />
        </div>

        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-600">
              Loading exercise progress...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-semibold text-red-900">
              Unable to load progress
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && exercises.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              No exercise progress yet
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Complete some workouts to start building exercise
              performance history.
            </p>

            <Link
              href="/workouts"
              className="mt-6 inline-flex rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              View Workouts
            </Link>
          </div>
        )}

        {!loading &&
          !error &&
          exercises.length > 0 &&
          filteredExercises.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                No matching exercises
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Try a different exercise name.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          filteredExercises.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredExercises.map((exercise) => (
                <Link
                  key={exercise.exerciseId}
                  href={`/progress/exercises/${exercise.exerciseId}`}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 transition group-hover:text-gray-700">
                        {exercise.exerciseName}
                      </h2>

                      <p className="mt-1 text-xs text-gray-500">
                        {exercise.workoutCount}{" "}
                        {exercise.workoutCount === 1
                          ? "workout"
                          : "workouts"}
                      </p>
                    </div>

                    <span className="text-gray-400 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">
                        Best Weight
                      </p>

                      <p className="mt-1 text-base font-bold text-gray-900">
                        {exercise.bestWeight !== null &&
                        exercise.bestWeight !== undefined
                          ? `${exercise.bestWeight} kg`
                          : "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">
                        Best Reps
                      </p>

                      <p className="mt-1 text-base font-bold text-gray-900">
                        {exercise.bestRepetitions !== null &&
                        exercise.bestRepetitions !== undefined
                          ? exercise.bestRepetitions
                          : "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">
                        Best Volume
                      </p>

                      <p className="mt-1 text-base font-bold text-gray-900">
                        {formatNumber(exercise.bestVolume)} kg
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">
                        Last Session
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {formatDate(exercise.latestWorkoutDate)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <span className="text-sm font-semibold text-gray-700">
                      View detailed progress →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
      </div>
    </main>
  );
}