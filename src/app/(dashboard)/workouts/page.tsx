"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RecoveryDay from "@/components/workouts/recovery-day";

type StrategyDay = {
  id: string;
  dayNumber: number;
  name: string;
  description: string | null;
  dayType: "WORKOUT" | "REST";
  focusMuscleGroups: string[];
};

type WorkoutHistory = {
  id: string;
  workoutDate: string;
  completedAt: string | null;
  strategyDay: {
    name: string;
    dayNumber: number;
    dayType: "WORKOUT" | "REST";
    focusMuscleGroups: string[];
  };
  exercises: {
    id: string;
  }[];
};

export default function WorkoutsPage() {
  const [days, setDays] =
    useState<StrategyDay[]>([]);

  const [currentDayId, setCurrentDayId] =
    useState<string | null>(
      null,
    );

  const [history, setHistory] =
    useState<WorkoutHistory[]>([]);

  const [strategyName, setStrategyName] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [startingId, setStartingId] =
    useState<string | null>(
      null,
    );

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const strategyResponse =
          await fetch(
            "/api/profile/strategies",
            {
              cache: "no-store",
            },
          );

        const strategyResult =
          await strategyResponse.json();

        if (!strategyResponse.ok) {
          throw new Error(
            strategyResult?.error ??
              "Unable to load strategy.",
          );
        }

        const active =
          strategyResult.strategies?.find(
            (strategy: any) =>
              strategy.isActive,
          );

        if (active) {
          setStrategyName(
            active.name,
          );

          setDays(
            active.days ?? [],
          );
        }

        const workoutResponse =
          await fetch(
            "/api/workouts",
            {
              cache: "no-store",
            },
          );

        const workoutResult =
          await workoutResponse.json();

        if (!workoutResponse.ok) {
          throw new Error(
            workoutResult?.error ??
              "Unable to load workouts.",
          );
        }

        setHistory(
          workoutResult.workouts ??
            [],
        );

        const currentResponse =
          await fetch(
            "/api/workouts/current-day",
            {
              cache: "no-store",
            },
          );

        if (
          currentResponse.ok
        ) {
          const currentResult =
            await currentResponse.json();

          setCurrentDayId(
            currentResult.currentDay
              ?.id ?? null,
          );
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load workouts.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function startWorkout(
    strategyDayId: string,
  ) {
    try {
      setStartingId(
        strategyDayId,
      );
      setError("");

      const response =
        await fetch(
          "/api/workouts",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              strategyDayId,
            }),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ??
            "Unable to start workout.",
        );
      }

      window.location.href =
        `/workouts/${result.workout.id}`;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to start workout.",
      );
    } finally {
      setStartingId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-gray-500">
            Loading workouts...
          </p>
        </div>
      </main>
    );
  }

  const currentDay =
    days.find(
      (day) =>
        day.id ===
        currentDayId,
    ) ?? null;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Training
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Workouts
          </h1>

          <p className="mt-3 text-gray-600">
            Record what you actually do in
            the gym.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                Active Strategy
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                {strategyName ||
                  "No active strategy"}
              </h2>
            </div>

            <Link
              href="/strategies"
              className="text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              Manage Strategy →
            </Link>
          </div>

          {!strategyName && (
            <div className="mt-6 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">
              Activate a strategy before
              starting training.
            </div>
          )}

          {currentDay && (
            <div className="mt-6 rounded-2xl border border-gray-300 bg-gray-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Current Cycle Position
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                Day{" "}
                {currentDay.dayNumber}{" "}
                — {currentDay.name}
              </p>

              {currentDay.description && (
                <p className="mt-2 text-sm text-gray-600">
                  {
                    currentDay.description
                  }
                </p>
              )}

              {currentDay
                .focusMuscleGroups
                .length >
                0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {currentDay.focusMuscleGroups.map(
                    (muscle) => (
                      <span
                        key={muscle}
                        className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700"
                      >
                        {muscle}
                      </span>
                    ),
                  )}
                </div>
              )}

              {currentDay.dayType ===
              "WORKOUT" ? (
                <button
                  type="button"
                  disabled={
                    startingId ===
                    currentDay.id
                  }
                  onClick={() =>
                    startWorkout(
                      currentDay.id,
                    )
                  }
                  className="mt-5 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {startingId ===
                  currentDay.id
                    ? "Starting..."
                    : "Start Workout →"}
                </button>
              ) : (
                <div className="mt-5">
                  <RecoveryDay
                    strategyDayId={
                      currentDay.id
                    }
                    dayName={
                      currentDay.name
                    }
                  />
                </div>
              )}
            </div>
          )}

          {days.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-gray-700">
                Strategy Cycle
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {days.map((day) => {
                  const isCurrent =
                    day.id ===
                    currentDayId;

                  return (
                    <div
                      key={day.id}
                      className={`rounded-xl border p-5 ${
                        isCurrent
                          ? "border-gray-700 bg-gray-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Day{" "}
                            {
                              day.dayNumber
                            }
                          </p>

                          <p className="mt-1 font-bold text-gray-900">
                            {day.name}
                          </p>
                        </div>

                        {isCurrent && (
                          <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                            Current
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-xs font-semibold text-gray-500">
                        {day.dayType ===
                        "REST"
                          ? "Recovery"
                          : "Workout"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Workout History
          </h2>

          <div className="mt-4 space-y-3">
            {history.length ===
              0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                <p className="font-semibold text-gray-900">
                  No workouts yet
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Start your first workout
                  above.
                </p>
              </div>
            )}

            {history.map(
              (workout) => (
                <Link
                  key={
                    workout.id
                  }
                  href={`/workouts/${workout.id}`}
                  className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-400"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Day{" "}
                        {
                          workout
                            .strategyDay
                            .dayNumber
                        }
                      </p>

                      <h3 className="mt-1 font-bold text-gray-900">
                        {
                          workout
                            .strategyDay
                            .name
                        }
                      </h3>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-600">
                        {new Date(
                          workout.workoutDate,
                        ).toLocaleDateString()}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {
                          workout
                            .exercises
                            .length
                        }{" "}
                        exercises
                      </p>

                      <p
                        className={`mt-1 text-xs font-semibold ${
                          workout.completedAt
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {workout.completedAt
                          ? "Completed"
                          : "In Progress"}
                      </p>
                    </div>
                  </div>
                </Link>
              ),
            )}
          </div>
        </section>
      </div>
    </main>
  );
}