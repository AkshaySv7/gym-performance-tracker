"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { expandFocusMuscles } from "@/lib/training/strategy-definitions";
import WarmupSection from "@/components/warmups/warmup-section";

type WorkoutSet = {
  id: string;
  setNumber: number;
  weight: number | string | null;
  repetitions: number | null;
};

type WorkoutExercise = {
  id: string;
  orderIndex: number;
  recommendationType:
    | "RECOMMENDED"
    | "USER_SELECTED"
    | "KEPT"
    | "REPLACED"
    | "INTRODUCED"
    | null;
  notes: string | null;
  exercise: {
    id: string;
    name: string;
    description: string | null;
    category: string | null;
    movementType: string | null;
    difficultyLevel: string | null;
    instructions: string | null;
    breathingGuidance: string | null;
    rangeOfMotion: string | null;
    commonMistakes: string | null;
    beginnerNotes: string | null;
    equipment: {
      equipment: {
        id: string;
        name: string;
      };
    }[];
    muscles: {
      muscleGroup: {
        id: string;
        name: string;
      };
    }[];
  };
  sets: WorkoutSet[];
};

type Workout = {
  id: string;
  workoutDate: string;
  startedAt: string | null;
  completedAt: string | null;
  durationSeconds: number | null;
  notes: string | null;
  userStrategy: {
    id: string;
    name: string;
    isActive: boolean;
  };
  strategyDay: {
    id: string;
    dayNumber: number;
    name: string;
    description: string | null;
    dayType?: "WORKOUT" | "REST";
    focusMuscleGroups?: string[];
  };
  exercises: WorkoutExercise[];
};

type AvailableExercise = {
  id: string;
  name: string;
  category: string | null;
  muscles: {
    muscleGroup: {
      name: string;
    };
  }[];
};

type AvailableExercisesResponse = {
  focusMuscles?: string[];
  exercises?: AvailableExercise[];
  recommended?: AvailableExercise[];
};

type DraftSet = {
  id: string;
  setNumber: number;
  weight: string;
  repetitions: string;
};

type Props = {
  workoutId: string;
};

function formatDuration(seconds: number | null) {
  if (!seconds) {
    return "0 min";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}m ${remainingSeconds}s`;
}

function normalizeMuscle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function musclesMatch(
  exerciseMuscle: string,
  selectedMuscle: string,
) {
  const exercise = normalizeMuscle(
    exerciseMuscle,
  );

  const expandedSelectedMuscles =
    expandFocusMuscles([
      selectedMuscle,
    ]);

  return expandedSelectedMuscles.some(
    (muscle) => {
      const selected =
        normalizeMuscle(muscle);

      return (
        exercise === selected ||
        exercise.includes(selected) ||
        selected.includes(exercise)
      );
    },
  );
}

export default function WorkoutSession({
  workoutId,
}: Props) {
  const [workout, setWorkout] =
    useState<Workout | null>(null);

  const [
    availableExercises,
    setAvailableExercises,
  ] = useState<AvailableExercise[]>([]);

  const [
    recommendedExercises,
    setRecommendedExercises,
  ] = useState<AvailableExercise[]>([]);

  const [focusMuscles, setFocusMuscles] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    showAddExercise,
    setShowAddExercise,
  ] = useState(false);

  const [workoutNotes, setWorkoutNotes] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [selectedFilter, setSelectedFilter] =
    useState("Recommended");

  const [now, setNow] = useState(
    Date.now(),
  );

  async function loadWorkout(
    showLoading = true,
  ) {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        `/api/workouts/${workoutId}`,
        {
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ??
            "Unable to load workout.",
        );
      }

      setWorkout(result.workout);

      setWorkoutNotes(
        result.workout.notes ?? "",
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load workout.",
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }

  async function loadAvailableExercises() {
    try {
      const response = await fetch(
        `/api/workouts/available-exercises?workoutId=${encodeURIComponent(
          workoutId,
        )}`,
        {
          cache: "no-store",
        },
      );

      const result: AvailableExercisesResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          (result as any)?.error ??
            "Unable to load exercises.",
        );
      }

      setFocusMuscles(
        result.focusMuscles ?? [],
      );

      setAvailableExercises(
        result.exercises ?? [],
      );

      setRecommendedExercises(
        result.recommended ?? [],
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadWorkout();
    loadAvailableExercises();
  }, [workoutId]);

  useEffect(() => {
    if (
      !workout ||
      workout.completedAt ||
      !workout.startedAt
    ) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setNow(Date.now());
      }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    workout?.startedAt,
    workout?.completedAt,
  ]);

  const elapsedSeconds = useMemo(() => {
    if (!workout?.startedAt) {
      return 0;
    }

    if (workout.completedAt) {
      return workout.durationSeconds ?? 0;
    }

    return Math.max(
      0,
      Math.floor(
        (now -
          new Date(
            workout.startedAt,
          ).getTime()) /
          1000,
      ),
    );
  }, [
    workout?.startedAt,
    workout?.completedAt,
    workout?.durationSeconds,
    now,
  ]);

  const filteredExercises =
    useMemo(() => {
      let source: AvailableExercise[];

      /*
       * Recommended is a subset of the
       * currently available exercises.
       */
      if (
        selectedFilter ===
        "Recommended"
      ) {
        source =
          recommendedExercises;
      } else {
        source =
          availableExercises;
      }

      /*
       * Apply a specific muscle filter.
       *
       * Broad targets such as "Legs" are
       * expanded through musclesMatch().
       */
      if (
        selectedFilter !==
          "Recommended" &&
        selectedFilter !== "All"
      ) {
        source = source.filter(
          (exercise) =>
            exercise.muscles.some(
              (item) =>
                musclesMatch(
                  item.muscleGroup.name,
                  selectedFilter,
                ),
            ),
        );
      }

      const query =
        search.trim().toLowerCase();

      if (!query) {
        return source;
      }

      return source.filter(
        (exercise) => {
          const nameMatches =
            exercise.name
              .toLowerCase()
              .includes(query);

          const muscleMatches =
            exercise.muscles.some(
              (item) =>
                item.muscleGroup.name
                  .toLowerCase()
                  .includes(query),
            );

          return (
            nameMatches ||
            muscleMatches
          );
        },
      );
    }, [
      selectedFilter,
      recommendedExercises,
      availableExercises,
      search,
    ]);

  async function addExercise(
    exerciseId: string,
  ) {
    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/workouts/${workoutId}/exercises`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            exerciseId,
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ??
            "Unable to add exercise.",
        );
      }

      if (!result?.workoutExercise) {
        throw new Error(
          "The server did not return the added exercise.",
        );
      }

      /*
       * Add the exercise directly to the
       * current workout state.
       *
       * This prevents the entire page from
       * entering the loading state.
       */
      setWorkout((current) => {
        if (!current) {
          return current;
        }

        const alreadyExists =
          current.exercises.some(
            (item) =>
              item.id ===
              result.workoutExercise.id,
          );

        if (alreadyExists) {
          return current;
        }

        return {
          ...current,
          exercises: [
            ...current.exercises,
            result.workoutExercise,
          ],
        };
      });

      /*
       * Refresh only the available exercise
       * lists.
       *
       * The current workout page stays visible.
       */
      await loadAvailableExercises();

      /*
       * Keep the Add Exercise panel open.
       *
       * The current filter is intentionally
       * preserved so the user can add several
       * exercises from the same list.
       */
      setShowAddExercise(true);
      setSearch("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to add exercise.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeExercise(
    workoutExerciseId: string,
  ) {
    if (
      !window.confirm(
        "Remove this exercise from the workout?",
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/workouts/${workoutId}/exercises?workoutExerciseId=${encodeURIComponent(
          workoutExerciseId,
        )}`,
        {
          method: "DELETE",
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ??
            "Unable to remove exercise.",
        );
      }

      await loadWorkout();
      await loadAvailableExercises();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to remove exercise.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function saveNotes() {
    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/workouts/${workoutId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            notes: workoutNotes,
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ??
            "Unable to save notes.",
        );
      }

      setWorkout(result.workout);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save notes.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function completeWorkout() {
    if (
      !window.confirm(
        "Complete this workout? You will not be able to edit it afterward.",
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/workouts/${workoutId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            notes: workoutNotes,
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ??
            "Unable to complete workout.",
        );
      }

      setWorkout((current) =>
        current
          ? {
              ...current,
              completedAt:
                result.workout.completedAt,
              durationSeconds:
                result.workout
                  .durationSeconds,
              notes:
                result.workout.notes,
            }
          : current,
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to complete workout.",
      );
    } finally {
      setSaving(false);
    }
  }

  function openAddExercise() {
    setShowAddExercise(true);

    window.setTimeout(() => {
      document
        .getElementById(
          "add-exercise-panel",
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 0);
  }

  function closeAddExercise() {
    setShowAddExercise(false);
    setSearch("");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-gray-500">
            Loading workout...
          </p>
        </div>
      </main>
    );
  }

  if (error && !workout) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-5xl rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-bold text-red-800">
            Workout unavailable
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {error}
          </p>
        </div>
      </main>
    );
  }

  if (!workout) {
    return null;
  }

  const completed =
    Boolean(workout.completedAt);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {!completed &&
          !showAddExercise && (
            <button
              type="button"
              onClick={openAddExercise}
              className="fixed bottom-6 right-6 z-40 rounded-full bg-gray-900 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-gray-800"
            >
              + Add Exercise
            </button>
          )}

        <div className="flex items-center justify-between">
          <Link
            href="/workouts"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Workouts
          </Link>

          {completed && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              Completed
            </span>
          )}
        </div>

        <section className="rounded-2xl bg-gray-900 p-6 text-white shadow-sm">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-gray-400">
                {workout.userStrategy.name}
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                {workout.strategyDay.name}
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                Day{" "}
                {workout.strategyDay.dayNumber}
              </p>

              {workout.strategyDay
                .description && (
                <p className="mt-2 max-w-2xl text-sm text-gray-400">
                  {
                    workout.strategyDay
                      .description
                  }
                </p>
              )}

              {workout.strategyDay
                .focusMuscleGroups &&
                workout.strategyDay
                  .focusMuscleGroups
                  .length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {workout.strategyDay.focusMuscleGroups.map(
                      (muscle) => (
                        <span
                          key={muscle}
                          className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-gray-200"
                        >
                          {muscle}
                        </span>
                      ),
                    )}
                  </div>
                )}
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-4">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Duration
              </p>

              <p className="mt-1 text-2xl font-bold">
                {completed
                  ? formatDuration(
                      workout.durationSeconds,
                    )
                  : formatDuration(
                      elapsedSeconds,
                    )}
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Add Exercise */}
        {!completed &&
          showAddExercise && (
            <section
              id="add-exercise-panel"
              className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Add Exercise
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Choose an exercise for
                    today&apos;s target muscles.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeAddExercise}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-900"
                >
                  Close
                </button>
              </div>

              {focusMuscles.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Today&apos;s Focus
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {focusMuscles.map(
                      (muscle) => (
                        <span
                          key={muscle}
                          className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700"
                        >
                          {muscle}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <FilterChip
                  label="Recommended"
                  active={
                    selectedFilter ===
                    "Recommended"
                  }
                  onClick={() =>
                    setSelectedFilter(
                      "Recommended",
                    )
                  }
                />

                <FilterChip
                  label="All"
                  active={
                    selectedFilter ===
                    "All"
                  }
                  onClick={() =>
                    setSelectedFilter(
                      "All",
                    )
                  }
                />

                {focusMuscles.map(
                  (muscle) => (
                    <FilterChip
                      key={muscle}
                      label={muscle}
                      active={
                        selectedFilter ===
                        muscle
                      }
                      onClick={() =>
                        setSelectedFilter(
                          muscle,
                        )
                      }
                    />
                  ),
                )}
              </div>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search exercises..."
                className="mt-4 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              />

              <div className="mt-4 max-h-96 space-y-2 overflow-y-auto">
                {filteredExercises.length ===
                  0 && (
                  <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
                    <p className="font-semibold text-gray-900">
                      No available exercises
                      found
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Try another muscle
                      filter or search.
                    </p>
                  </div>
                )}

                {filteredExercises.map(
                  (exercise) => (
                    <button
                      key={exercise.id}
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        addExercise(
                          exercise.id,
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 p-4 text-left transition hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {exercise.name}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {exercise.muscles
                              .filter(
                                (item) =>
                                  item?.muscleGroup?.name,
                              )
                              .map(
                                (item) => {
                                  const muscleName =
                                    item
                                      .muscleGroup
                                      .name;

                                  return (
                                    <span
                                      key={
                                        muscleName
                                      }
                                      className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                                        focusMuscles.some(
                                          (focus) =>
                                            musclesMatch(
                                              muscleName,
                                              focus,
                                            ),
                                        )
                                          ? "bg-green-50 text-green-700"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      {
                                        muscleName
                                      }
                                    </span>
                                  );
                                },
                              )}
                          </div>
                        </div>

                        <span className="text-xs font-semibold text-gray-400">
                          Add →
                        </span>
                      </div>
                    </button>
                  ),
                )}
              </div>
            </section>
          )}

        {/* Warm-up */}
        {!completed && (
          <WarmupSection
            workoutId={workoutId}
          />
        )}

        {/* Exercises */}
        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Workout
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                Exercises
              </h2>
            </div>

            {!completed && (
              <button
                type="button"
                onClick={() => {
                  if (showAddExercise) {
                    closeAddExercise();
                  } else {
                    openAddExercise();
                  }
                }}
                className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                {showAddExercise
                  ? "Close Add Exercise"
                  : "+ Add Exercise"}
              </button>
            )}
          </div>

          {workout.exercises.length ===
            0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <p className="font-semibold text-gray-900">
                No exercises added yet
              </p>

              {!completed && (
                <p className="mt-2 text-sm text-gray-500">
                  Add the exercises you
                  actually perform today.
                </p>
              )}
            </div>
          )}

          {workout.exercises.map(
            (workoutExercise) => (
              <ExerciseCard
                key={workoutExercise.id}
                workoutExercise={
                  workoutExercise
                }
                completed={completed}
                onRemove={() =>
                  removeExercise(
                    workoutExercise.id,
                  )
                }
              />
            ),
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Workout Notes
          </h2>

          <textarea
            value={workoutNotes}
            onChange={(event) =>
              setWorkoutNotes(
                event.target.value,
              )
            }
            disabled={completed}
            placeholder="How did the workout feel? Any important notes?"
            rows={5}
            className="mt-4 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 disabled:bg-gray-100"
          />

          {!completed && (
            <button
              type="button"
              onClick={saveNotes}
              disabled={saving}
              className="mt-3 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Notes"}
            </button>
          )}
        </section>

        {!completed && (
          <button
            type="button"
            onClick={completeWorkout}
            disabled={saving}
            className="w-full rounded-2xl bg-green-600 px-6 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Complete Workout"}
          </button>
        )}

        {completed && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
            <p className="text-lg font-bold text-green-800">
              Workout completed
            </p>

            <p className="mt-2 text-sm text-green-700">
              Duration:{" "}
              {formatDuration(
                workout.durationSeconds,
              )}
            </p>

            <p className="mt-1 text-xs text-green-600">
              This workout is now
              read-only.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

type FilterChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function FilterChip({
  label,
  active,
  onClick,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
        active
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
      }`}
    >
      {label}
    </button>
  );
}

type ExerciseCardProps = {
  workoutExercise: WorkoutExercise;
  completed: boolean;
  onRemove: () => void;
};

function ExerciseCard({
  workoutExercise,
  completed,
  onRemove,
}: ExerciseCardProps) {
  const exercise =
    workoutExercise.exercise;

  const [draftSets, setDraftSets] =
    useState<DraftSet[]>(() =>
      [...workoutExercise.sets]
        .sort(
          (a, b) =>
            a.setNumber - b.setNumber,
        )
        .map((set) => ({
          id: set.id,
          setNumber: set.setNumber,
          weight:
            set.weight === null
              ? ""
              : String(set.weight),
          repetitions:
            set.repetitions === null
              ? ""
              : String(
                  set.repetitions,
                ),
        })),
    );

  const [savingSetId, setSavingSetId] =
    useState<string | null>(null);

  const [setError, setSetError] =
    useState("");

  function updateDraftSet(
    setId: string,
    field:
      | "weight"
      | "repetitions",
    value: string,
  ) {
    setDraftSets((current) =>
      current.map((set) =>
        set.id === setId
          ? {
              ...set,
              [field]: value,
            }
          : set,
      ),
    );

    setSetError("");
  }

  async function persistSet(
    set: DraftSet,
  ) {
    if (completed) {
      return;
    }

    const weight =
      set.weight.trim();

    const repetitions =
      set.repetitions.trim();

    if (
      weight === "" &&
      repetitions === ""
    ) {
      return;
    }

    if (
      weight !== "" &&
      !Number.isFinite(Number(weight))
    ) {
      setSetError(
        `Set ${set.setNumber}: enter a valid weight.`,
      );
      return;
    }

    if (
      repetitions !== "" &&
      !Number.isInteger(
        Number(repetitions),
      )
    ) {
      setSetError(
        `Set ${set.setNumber}: repetitions must be a whole number.`,
      );
      return;
    }

    try {
      setSavingSetId(set.id);
      setSetError("");

      const savedSet =
        await saveSetRequest(
          workoutExercise.id,
          set.setNumber,
          weight,
          repetitions,
        );

      setDraftSets((current) =>
        current.map((item) =>
          item.id === set.id
            ? {
                ...item,
                id: savedSet.id,
                weight:
                  savedSet.weight ===
                  null
                    ? ""
                    : String(
                        savedSet.weight,
                      ),
                repetitions:
                  savedSet.repetitions ===
                  null
                    ? ""
                    : String(
                        savedSet.repetitions,
                      ),
              }
            : item,
        ),
      );
    } catch (error) {
      setSetError(
        error instanceof Error
          ? error.message
          : `Unable to save Set ${set.setNumber}.`,
      );
    } finally {
      setSavingSetId(null);
    }
  }

  function addLocalSet() {
    if (completed) {
      return;
    }

    setSetError("");

    setDraftSets((current) => {
      const nextSetNumber =
        current.length === 0
          ? 1
          : Math.max(
              ...current.map(
                (set) =>
                  set.setNumber,
              ),
            ) + 1;

      return [
        ...current,
        {
          id: `local-${crypto.randomUUID()}`,
          setNumber: nextSetNumber,
          weight: "",
          repetitions: "",
        },
      ];
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900">
              {exercise.name}
            </h3>

            {workoutExercise.recommendationType ===
              "USER_SELECTED" && (
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                Added by you
              </span>
            )}

            {workoutExercise.recommendationType ===
              "RECOMMENDED" && (
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                Recommended
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {exercise.category && (
              <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                {exercise.category}
              </span>
            )}

            {exercise.movementType && (
              <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                {exercise.movementType}
              </span>
            )}

            {exercise.muscles
              .filter(
                (item) =>
                  item?.muscleGroup?.name,
              )
              .map((item) => {
                const muscleName =
                  item.muscleGroup.name;

                return (
                  <span
                    key={muscleName}
                    className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700"
                  >
                    {muscleName}
                  </span>
                );
              })}
          </div>

          {exercise.equipment.length >
            0 && (
            <p className="mt-3 text-xs text-gray-500">
              Equipment:{" "}
              {exercise.equipment
                .map(
                  (item) =>
                    item.equipment
                      .name,
                )
                .join(", ")}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/exercises/${exercise.id}`}
            target="_blank"
            className="rounded-xl border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Exercise Info
          </Link>

          {!completed && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[500px]">
          <div className="grid grid-cols-[70px_1fr_1fr_80px] gap-3 border-b border-gray-200 pb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <div>Set</div>
            <div>Weight (kg)</div>
            <div>Reps</div>
            <div>Status</div>
          </div>

          <div className="space-y-3 pt-3">
            {draftSets.map(
              (set) => (
                <SetRow
                  key={set.id}
                  set={set}
                  completed={completed}
                  saving={
                    savingSetId ===
                    set.id
                  }
                  onWeightChange={(
                    value,
                  ) => {
                    updateDraftSet(
                      set.id,
                      "weight",
                      value,
                    );
                  }}
                  onRepetitionsChange={(
                    value,
                  ) => {
                    updateDraftSet(
                      set.id,
                      "repetitions",
                      value,
                    );
                  }}
                  onBlur={() =>
                    persistSet(set)
                  }
                />
              ),
            )}
          </div>
        </div>
      </div>

      {setError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {setError}
        </div>
      )}

      {!completed && (
        <button
          type="button"
          onClick={addLocalSet}
          className="mt-5 w-full rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm font-semibold text-gray-600 hover:border-gray-500 hover:bg-gray-50"
        >
          + Add Set
        </button>
      )}

      {exercise.beginnerNotes && (
        <div className="mt-5 rounded-xl bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Beginner Note
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-900">
            {exercise.beginnerNotes}
          </p>
        </div>
      )}
    </div>
  );
}

async function saveSetRequest(
  workoutExerciseId: string,
  setNumber: number,
  weight: string,
  repetitions: string,
) {
  const weightValue =
    weight.trim() === ""
      ? null
      : Number(weight);

  const repetitionsValue =
    repetitions.trim() === ""
      ? null
      : Number(repetitions);

  const response = await fetch(
    `/api/workout-exercises/${workoutExerciseId}/sets`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        setNumber,
        weight: weightValue,
        repetitions: repetitionsValue,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error ??
        "Unable to save set.",
    );
  }

  if (!result?.set) {
    throw new Error(
      "The server did not return the saved set.",
    );
  }

  return result.set as WorkoutSet;
}

type SetRowProps = {
  set: DraftSet;
  completed: boolean;
  saving: boolean;
  onWeightChange: (
    value: string,
  ) => void;
  onRepetitionsChange: (
    value: string,
  ) => void;
  onBlur: () => void;
};

function SetRow({
  set,
  completed,
  saving,
  onWeightChange,
  onRepetitionsChange,
  onBlur,
}: SetRowProps) {
  const hasValues =
    set.weight !== "" &&
    set.repetitions !== "";

  return (
    <div className="grid grid-cols-[70px_1fr_1fr_80px] items-center gap-3">
      <div className="font-bold text-gray-700">
        {set.setNumber}
      </div>

      <input
        type="number"
        min="0"
        step="0.25"
        value={set.weight}
        disabled={completed || saving}
        onChange={(event) =>
          onWeightChange(
            event.target.value,
          )
        }
        onBlur={onBlur}
        placeholder="kg"
        className="rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-900 disabled:bg-gray-100"
      />

      <input
        type="number"
        min="0"
        step="1"
        value={set.repetitions}
        disabled={completed || saving}
        onChange={(event) =>
          onRepetitionsChange(
            event.target.value,
          )
        }
        onBlur={onBlur}
        placeholder="reps"
        className="rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-900 disabled:bg-gray-100"
      />

      <div className="text-center text-sm">
        {saving ? (
          <span className="text-gray-400">
            Saving...
          </span>
        ) : hasValues ? (
          <span className="font-semibold text-green-600">
            ✓ Saved
          </span>
        ) : (
          <span className="text-gray-400">
            —
          </span>
        )}
      </div>
    </div>
  );
}