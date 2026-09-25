"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type StrategyDay = {
  id: string;
  userStrategyId: string;
  dayNumber: number;
  name: string;
  description: string | null;
  dayType: "WORKOUT" | "REST";
  focusMuscleGroups: string[];
};

type WorkoutHistoryItem = {
  id: string;
  workoutDate: string;
  startedAt: string | null;
  completedAt: string | null;
  durationSeconds: number | null;
  notes: string | null;
  strategyDay: {
    name: string;
    dayNumber: number;
    dayType: "WORKOUT" | "REST";
    focusMuscleGroups: string[];
  };
  userStrategy: {
    name: string;
  };
  exercises: {
    id: string;
    exercise: {
      name: string;
    };
    sets: {
      id: string;
    }[];
  }[];
};

type CurrentDayResponse = {
  currentDay: StrategyDay | null;
};

type WorkoutHistoryResponse = {
  workouts: WorkoutHistoryItem[];
};

function formatDuration(
  seconds: number | null,
) {
  if (!seconds) {
    return "0 min";
  }

  const minutes = Math.floor(
    seconds / 60,
  );

  const remainingSeconds =
    seconds % 60;

  return `${minutes}m ${remainingSeconds}s`;
}

function formatWorkoutDate(
  dateString: string,
) {
  return new Date(
    dateString,
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isSameCalendarDate(
  first: Date,
  second: Date,
) {
  return (
    first.getFullYear() ===
      second.getFullYear() &&
    first.getMonth() ===
      second.getMonth() &&
    first.getDate() ===
      second.getDate()
  );
}

function getStartOfWeek(
  date: Date,
) {
  const result = new Date(date);

  const day = result.getDay();

  /*
   * Monday = first day of the week.
   *
   * Sunday (0) is treated as the last day.
   */
  const difference =
    day === 0 ? 6 : day - 1;

  result.setDate(
    result.getDate() - difference,
  );

  result.setHours(
    0,
    0,
    0,
    0,
  );

  return result;
}

function getDateKey(
  date: Date,
) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function calculateCurrentStreak(
  workouts: WorkoutHistoryItem[],
) {
  const completedDates =
    new Set<string>();

  for (const workout of workouts) {
    if (!workout.completedAt) {
      continue;
    }

    const date = new Date(
      workout.workoutDate,
    );

    completedDates.add(
      getDateKey(date),
    );
  }

  if (completedDates.size === 0) {
    return 0;
  }

  const today = new Date();

  /*
   * If the user has not trained today,
   * start checking from yesterday.
   *
   * If they have trained today, include today.
   */
  let currentDate = new Date(
    today,
  );

  if (
    !completedDates.has(
      getDateKey(currentDate),
    )
  ) {
    currentDate.setDate(
      currentDate.getDate() - 1,
    );
  }

  let streak = 0;

  while (
    completedDates.has(
      getDateKey(currentDate),
    )
  ) {
    streak++;

    currentDate.setDate(
      currentDate.getDate() - 1,
    );
  }

  return streak;
}

export default function DashboardPage() {
  const [currentDay, setCurrentDay] =
    useState<StrategyDay | null>(
      null,
    );

  const [workouts, setWorkouts] =
    useState<WorkoutHistoryItem[]>(
      [],
    );

  const [loading, setLoading] =
    useState(true);

  const [startingWorkout, setStartingWorkout] =
    useState(false);

  const [error, setError] =
    useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [
        currentDayResponse,
        workoutHistoryResponse,
      ] = await Promise.all([
        fetch(
          "/api/workouts/current-day",
          {
            cache: "no-store",
          },
        ),

        fetch("/api/workouts", {
          cache: "no-store",
        }),
      ]);

      const currentDayResult: CurrentDayResponse =
        await currentDayResponse.json();

      const workoutHistoryResult: WorkoutHistoryResponse =
        await workoutHistoryResponse.json();

      if (
        !currentDayResponse.ok
      ) {
        throw new Error(
          "Unable to load today's training day.",
        );
      }

      if (
        !workoutHistoryResponse.ok
      ) {
        throw new Error(
          "Unable to load workout history.",
        );
      }

      setCurrentDay(
        currentDayResult.currentDay ??
          null,
      );

      setWorkouts(
        workoutHistoryResult.workouts ??
          [],
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  /*
   * Find an unfinished workout for the
   * current strategy day.
   */
  const activeWorkout = useMemo(() => {
    if (!currentDay) {
      return null;
    }

    return (
      workouts.find(
        (workout) =>
          !workout.completedAt &&
          workout.strategyDay.name ===
            currentDay.name &&
          workout.strategyDay.dayNumber ===
            currentDay.dayNumber,
      ) ?? null
    );
  }, [
    currentDay,
    workouts,
  ]);

  const completedWorkouts =
    useMemo(
      () =>
        workouts.filter(
          (workout) =>
            Boolean(
              workout.completedAt,
            ),
        ),
      [workouts],
    );

  const stats = useMemo(() => {
    const now = new Date();

    const startOfWeek =
      getStartOfWeek(now);

    const workoutsThisWeek =
      completedWorkouts.filter(
        (workout) => {
          const workoutDate =
            new Date(
              workout.workoutDate,
            );

          return (
            workoutDate >=
            startOfWeek
          );
        },
      ).length;

    const exerciseCount =
      completedWorkouts.reduce(
        (total, workout) =>
          total +
          workout.exercises.length,
        0,
      );

    const currentStreak =
      calculateCurrentStreak(
        completedWorkouts,
      );

    return {
      totalWorkouts:
        completedWorkouts.length,
      workoutsThisWeek,
      exerciseCount,
      currentStreak,
    };
  }, [completedWorkouts]);

  const recentWorkouts =
    useMemo(
      () =>
        [...workouts]
          .filter(
            (workout) =>
              Boolean(
                workout.completedAt,
              ),
          )
          .sort(
            (a, b) =>
              new Date(
                b.workoutDate,
              ).getTime() -
              new Date(
                a.workoutDate,
              ).getTime(),
          )
          .slice(0, 5),
      [workouts],
    );

  async function startWorkout() {
    if (!currentDay) {
      return;
    }

    if (
      currentDay.dayType ===
      "REST"
    ) {
      return;
    }

    try {
      setStartingWorkout(true);
      setError("");

      /*
       * The API already handles the case where
       * an unfinished workout exists.
       *
       * In that situation createWorkout()
       * returns the existing workout.
       */
      const response = await fetch(
        "/api/workouts",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            strategyDayId:
              currentDay.id,
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

      if (!result?.workout?.id) {
        throw new Error(
          "The server did not return a workout.",
        );
      }

      window.location.href = `/workouts/${result.workout.id}`;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to start workout.",
      );

      setStartingWorkout(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                Gym Performance Tracker
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-slate-400">
                Track your workouts, understand
                your progress, and build a
                training routine around the
                equipment available in your gym.
              </p>
            </div>

            <Link
              href="/profile"
              className="inline-flex w-fit items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium transition hover:border-slate-500 hover:bg-slate-800"
            >
              My Profile
            </Link>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Workouts"
            value={String(
              stats.totalWorkouts,
            )}
            description="Workouts completed"
          />

          <StatCard
            title="This Week"
            value={String(
              stats.workoutsThisWeek,
            )}
            description="Training sessions"
          />

          <StatCard
            title="Exercises"
            value={String(
              stats.exerciseCount,
            )}
            description="Exercises recorded"
          />

          <StatCard
            title="Current Streak"
            value={`${stats.currentStreak} ${
              stats.currentStreak ===
              1
                ? "day"
                : "days"
            }`}
            description="Keep building consistency"
          />
        </section>

        {/* Main Actions */}
        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold">
              Get Started
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Set up your gym, training strategy,
              and workout preferences.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <DashboardCard
              href="/profile"
              icon="👤"
              title="Complete Profile"
              description="Set your experience level, goals, training days, and workout preferences."
            />

            <DashboardCard
              href="/equipment"
              icon="🏋️"
              title="Your Equipment"
              description="Select the equipment available in your gym so recommendations can be customized."
            />

            <DashboardCard
              href="/exercises"
              icon="📚"
              title="Exercise Library"
              description="Explore exercises, target muscles, instructions, equipment, and warm-ups."
            />

            <DashboardCard
              href="/strategies"
              icon="📋"
              title="Training Strategy"
              description="Choose, customize, and manage your training split."
            />

            <DashboardCard
              href="/warmups"
              icon="🔥"
              title="Warm-ups"
              description="Choose structured warm-up routines and explore individual warm-up activities before training."
            />

            <DashboardCard
              href="/progress"
              icon="📈"
              title="Progress"
              description="View your performance history, progression, and personal records."
            />

            <DashboardCard
              href="/workouts"
              icon="💪"
              title="Workouts"
              description="Start today's workout, continue an active workout, and review your workout history."
            />
          </div>
        </section>

        {/* Today's Workout */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm uppercase tracking-wider text-slate-500">
                Today
              </p>

              {currentDay ? (
                <>
                  <h2 className="mt-1 text-2xl font-semibold">
                    {currentDay.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Day{" "}
                    {currentDay.dayNumber}
                  </p>

                  {currentDay.description && (
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                      {
                        currentDay.description
                      }
                    </p>
                  )}

                  {currentDay.focusMuscleGroups
                    .length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {currentDay.focusMuscleGroups.map(
                        (muscle) => (
                          <span
                            key={muscle}
                            className="rounded-full bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300"
                          >
                            {muscle}
                          </span>
                        ),
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h2 className="mt-1 text-2xl font-semibold">
                    Today's Workout
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    No active training strategy
                    is configured yet.
                  </p>
                </>
              )}
            </div>

            {currentDay?.dayType ===
            "REST" ? (
              <div className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-center">
                <p className="text-sm font-semibold text-slate-200">
                  Rest Day
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Recovery is part of your
                  training cycle.
                </p>
              </div>
            ) : currentDay ? (
              <button
                type="button"
                onClick={startWorkout}
                disabled={startingWorkout}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {startingWorkout
                  ? "Opening Workout..."
                  : activeWorkout
                    ? "Continue Workout"
                    : "Start Workout"}
              </button>
            ) : (
              <Link
                href="/strategies"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Configure Strategy
              </Link>
            )}
          </div>

          {!currentDay && (
            <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
              <div className="text-3xl">
                💪
              </div>

              <h3 className="mt-3 font-medium">
                No workout scheduled yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Choose a training strategy and
                configure your routine. Your
                workout plan will appear here.
              </p>
            </div>
          )}

          {currentDay?.dayType ===
            "REST" && (
            <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
              <div className="text-3xl">
                😴
              </div>

              <h3 className="mt-3 font-medium">
                Recovery Day
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                No workout is created for this
                strategy day. Your next workout
                will be the next position in your
                training cycle.
              </p>
            </div>
          )}
        </section>

        {/* Progress Overview */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Recent Workouts */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Recent Workouts
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest training sessions
                </p>
              </div>

              <Link
                href="/workouts"
                className="text-sm font-medium text-slate-400 transition hover:text-white"
              >
                View All →
              </Link>
            </div>

            {recentWorkouts.length ===
            0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
                <p className="text-sm text-slate-500">
                  No workouts recorded yet.
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Start your first workout to
                  build your history.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {recentWorkouts.map(
                  (workout) => (
                    <Link
                      key={workout.id}
                      href={`/workouts/${workout.id}`}
                      className="block rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-slate-600 hover:bg-slate-900"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                          <p className="font-semibold text-white">
                            {
                              workout
                                .strategyDay
                                .name
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {
                              workout
                                .userStrategy
                                .name
                            }{" "}
                            • Day{" "}
                            {
                              workout
                                .strategyDay
                                .dayNumber
                            }
                          </p>

                          <p className="mt-2 text-xs text-slate-500">
                            {formatWorkoutDate(
                              workout.workoutDate,
                            )}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-sm font-semibold text-slate-300">
                            {
                              workout
                                .exercises
                                .length
                            }{" "}
                            {workout
                              .exercises
                              .length === 1
                              ? "exercise"
                              : "exercises"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {formatDuration(
                              workout.durationSeconds,
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Bodyweight */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div>
              <h2 className="text-xl font-semibold">
                Bodyweight
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track your bodyweight over time
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
              <p className="text-sm text-slate-500">
                No bodyweight data yet.
              </p>

              <p className="mt-2 text-xs text-slate-600">
                Weight trends will be displayed
                here once you start recording
                them.
              </p>
            </div>
          </div>
        </section>

        {/* Training Intelligence Preview */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div>
            <p className="text-sm uppercase tracking-wider text-slate-500">
              Future Intelligence
            </p>

            <h2 className="mt-1 text-2xl font-semibold">
              Smart Training Insights
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              As you record workouts, the system
              will use your equipment, training
              strategy, exercise history,
              performance, and muscle coverage to
              provide more intelligent
              recommendations.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InsightCard
              title="Exercise Rotation"
              description="Avoid unnecessary repetition while retaining useful movements."
            />

            <InsightCard
              title="Muscle Coverage"
              description="Understand which muscle groups are receiving training."
            />

            <InsightCard
              title="Performance"
              description="Track weight, repetitions, sets, and progression."
            />

            <InsightCard
              title="Recommendations"
              description="Receive equipment-aware workout suggestions."
            />
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="mt-8 pb-10">
          <h2 className="text-xl font-semibold">
            Quick Navigation
          </h2>

          <div className="mt-4 flex flex-wrap gap-3">
            <QuickLink
              href="/profile"
              label="Profile"
            />

            <QuickLink
              href="/equipment"
              label="Equipment"
            />

            <QuickLink
              href="/exercises"
              label="Exercise Library"
            />

            <QuickLink
              href="/strategies"
              label="Training Strategy"
            />

            <QuickLink
              href="/warmups"
              label="Warm-ups"
            />

            <QuickLink
              href="/workouts"
              label="Workouts"
            />

            <QuickLink
              href="/progress"
              label="Progress"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

/* ---------------------------------------------
   Dashboard Components
--------------------------------------------- */

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-600">
        {description}
      </p>
    </div>
  );
}

function DashboardCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-800"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-2xl transition group-hover:bg-slate-700">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <div className="mt-5 text-sm font-medium text-slate-300">
        Open →
      </div>
    </Link>
  );
}

function InsightCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="font-medium">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function QuickLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:bg-slate-800"
    >
      {label}
    </Link>
  );
}