"use client";

import { useState } from "react";

type DayType = "WORKOUT" | "REST";

type Day = {
  dayNumber: number;
  name: string;
  description: string;
  dayType: DayType;
  focusMuscleGroups: string[];
};

const MUSCLES = [
  "Chest",
  "Triceps",
  "Back",
  "Biceps",
  "Shoulders",
  "Legs",
  "Abs / Core",
  "Traps",
  "Forearms",
  "Lower Back / Posterior Chain",
];

const DEFAULT_DAY: Day = {
  dayNumber: 1,
  name: "",
  description: "",
  dayType: "WORKOUT",
  focusMuscleGroups: [],
};

export default function CustomStrategyForm() {
  const [name, setName] = useState("");

  const [days, setDays] = useState<Day[]>([
    {
      ...DEFAULT_DAY,
      dayNumber: 1,
    },
    {
      ...DEFAULT_DAY,
      dayNumber: 2,
    },
    {
      ...DEFAULT_DAY,
      dayNumber: 3,
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateDay(
    dayNumber: number,
    changes: Partial<Day>,
  ) {
    setDays((current) =>
      current.map((day) =>
        day.dayNumber === dayNumber
          ? {
              ...day,
              ...changes,
            }
          : day,
      ),
    );
  }

  function toggleMuscle(
    dayNumber: number,
    muscle: string,
  ) {
    setDays((current) =>
      current.map((day) => {
        if (day.dayNumber !== dayNumber) {
          return day;
        }

        const exists =
          day.focusMuscleGroups.includes(
            muscle,
          );

        return {
          ...day,
          focusMuscleGroups: exists
            ? day.focusMuscleGroups.filter(
                (item) =>
                  item !== muscle,
              )
            : [
                ...day.focusMuscleGroups,
                muscle,
              ],
        };
      }),
    );
  }

  function addDay() {
    if (days.length >= 7) {
      return;
    }

    setDays((current) => [
      ...current,
      {
        ...DEFAULT_DAY,
        dayNumber:
          current.length + 1,
      },
    ]);
  }

  function removeDay(
    dayNumber: number,
  ) {
    if (days.length <= 1) {
      return;
    }

    setDays((current) =>
      current
        .filter(
          (day) =>
            day.dayNumber !==
            dayNumber,
        )
        .map((day, index) => ({
          ...day,
          dayNumber: index + 1,
        })),
    );
  }

  async function submit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName =
      name.trim();

    if (
      trimmedName.length < 2 ||
      trimmedName.length > 80
    ) {
      setError(
        "Strategy name must be between 2 and 80 characters.",
      );
      return;
    }

    for (const day of days) {
      if (
        day.name.trim().length < 2
      ) {
        setError(
          `Day ${day.dayNumber} needs a name.`,
        );
        return;
      }

      if (
        day.dayType ===
          "WORKOUT" &&
        day.focusMuscleGroups.length ===
          0
      ) {
        setError(
          `Select at least one target muscle for Day ${day.dayNumber}.`,
        );
        return;
      }
    }

    try {
      setSaving(true);

      const response =
        await fetch(
          "/api/profile/strategies/custom",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name: trimmedName,
              days: days.map(
                (day) => ({
                  dayNumber:
                    day.dayNumber,
                  name:
                    day.name.trim(),
                  description:
                    day.description.trim() ||
                    null,
                  dayType:
                    day.dayType,
                  focusMuscleGroups:
                    day.dayType ===
                    "WORKOUT"
                      ? day.focusMuscleGroups
                      : [],
                }),
              ),
            }),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ??
            "Unable to create strategy.",
        );
      }

      setSuccess(
        "Custom strategy created successfully.",
      );

      if (
        result.strategy?.id
      ) {
        window.location.href =
          `/strategies/my/${result.strategy.id}`;
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create strategy.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-8"
    >
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Strategy name
        </label>

        <input
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="My Custom Split"
          className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-600"
        />
      </div>

      <div className="space-y-5">
        {days.map((day) => (
          <div
            key={day.dayNumber}
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Cycle Day{" "}
                  {day.dayNumber}
                </p>

                <h3 className="mt-1 text-xl font-bold text-gray-900">
                  Day {day.dayNumber}
                </h3>
              </div>

              {days.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    removeDay(
                      day.dayNumber,
                    )
                  }
                  className="text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-gray-700">
                Day name
              </label>

              <input
                value={day.name}
                onChange={(event) =>
                  updateDay(
                    day.dayNumber,
                    {
                      name:
                        event.target.value,
                    },
                  )
                }
                placeholder="Push"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-gray-600"
              />
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-gray-700">
                Description
              </label>

              <textarea
                value={day.description}
                onChange={(event) =>
                  updateDay(
                    day.dayNumber,
                    {
                      description:
                        event.target.value,
                    },
                  )
                }
                placeholder="Chest, shoulders and triceps"
                rows={3}
                className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-gray-600"
              />
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-gray-700">
                Day type
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateDay(
                      day.dayNumber,
                      {
                        dayType:
                          "WORKOUT",
                      },
                    )
                  }
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    day.dayType ===
                    "WORKOUT"
                      ? "bg-gray-900 text-white"
                      : "border border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  Workout Day
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateDay(
                      day.dayNumber,
                      {
                        dayType:
                          "REST",
                        focusMuscleGroups:
                          [],
                      },
                    )
                  }
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    day.dayType ===
                    "REST"
                      ? "bg-gray-900 text-white"
                      : "border border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  Rest Day
                </button>
              </div>
            </div>

            {day.dayType ===
              "WORKOUT" && (
              <div className="mt-5">
                <p className="text-sm font-semibold text-gray-700">
                  Target muscles
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {MUSCLES.map(
                    (muscle) => {
                      const selected =
                        day.focusMuscleGroups.includes(
                          muscle,
                        );

                      return (
                        <button
                          key={muscle}
                          type="button"
                          onClick={() =>
                            toggleMuscle(
                              day.dayNumber,
                              muscle,
                            )
                          }
                          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            selected
                              ? "bg-gray-900 text-white"
                              : "border border-gray-300 bg-white text-gray-700 hover:border-gray-500"
                          }`}
                        >
                          {muscle}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            )}

            {day.dayType ===
              "REST" && (
              <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                This cycle position will
                use recovery tracking
                instead of the workout
                logger.
              </div>
            )}
          </div>
        ))}
      </div>

      {days.length < 7 && (
        <button
          type="button"
          onClick={addDay}
          className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:border-gray-500"
        >
          + Add Cycle Day
        </button>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
      >
        {saving
          ? "Creating Strategy..."
          : "Create Custom Strategy"}
      </button>
    </form>
  );
}