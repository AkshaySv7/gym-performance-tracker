// 18. Custom strategy form

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Day = {
  dayNumber: number;
  name: string;
  description: string;
};

const initialDays: Day[] = [
  {
    dayNumber: 1,
    name: "",
    description: "",
  },
  {
    dayNumber: 2,
    name: "",
    description: "",
  },
  {
    dayNumber: 3,
    name: "",
    description: "",
  },
];

export default function CustomStrategyForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [days, setDays] = useState<Day[]>(
    initialDays,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateDay(
    dayNumber: number,
    field: "name" | "description",
    value: string,
  ) {
    setDays((current) =>
      current.map((day) =>
        day.dayNumber === dayNumber
          ? {
              ...day,
              [field]: value,
            }
          : day,
      ),
    );
  }

  function addDay() {
    if (days.length >= 7) return;

    setDays((current) => [
      ...current,
      {
        dayNumber: current.length + 1,
        name: "",
        description: "",
      },
    ]);
  }

  function removeDay(dayNumber: number) {
    if (days.length <= 1) return;

    setDays((current) =>
      current
        .filter((day) => day.dayNumber !== dayNumber)
        .map((day, index) => ({
          ...day,
          dayNumber: index + 1,
        })),
    );
  }

  async function submit() {
    try {
      setLoading(true);
      setError("");

      const cleanedDays = days.map((day) => ({
        dayNumber: day.dayNumber,
        name: day.name.trim(),
        description: day.description.trim(),
      }));

      const response = await fetch(
        "/api/profile/strategies/custom",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            days: cleanedDays,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            "Unable to create strategy.",
        );
      }

      router.push("/strategies/my");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create strategy.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm font-semibold text-gray-900">
          Strategy Name
        </label>

        <input
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="My Training Routine"
          maxLength={100}
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              Training Days
            </h2>

            <p className="text-sm text-gray-500">
              Define what you want to train each day.
            </p>
          </div>

          <button
            type="button"
            onClick={addDay}
            disabled={days.length >= 7}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 disabled:opacity-50"
          >
            + Add Day
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {days.map((day) => (
            <div
              key={day.dayNumber}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  Day {day.dayNumber}
                </p>

                {days.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeDay(day.dayNumber)
                    }
                    className="text-sm font-medium text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                value={day.name}
                onChange={(event) =>
                  updateDay(
                    day.dayNumber,
                    "name",
                    event.target.value,
                  )
                }
                placeholder="Chest + Triceps"
                maxLength={80}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
              />

              <textarea
                value={day.description}
                onChange={(event) =>
                  updateDay(
                    day.dayNumber,
                    "description",
                    event.target.value,
                  )
                }
                placeholder="Describe the focus of this day..."
                maxLength={300}
                rows={2}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={loading}
        className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Creating Strategy..."
          : "Create Strategy"}
      </button>
    </div>
  );
}