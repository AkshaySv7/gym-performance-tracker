"use client";

import { useEffect, useState } from "react";

type RecoveryDayProps = {
  strategyDayId: string;
  dayName: string;
};

export default function RecoveryDay({
  strategyDayId,
  dayName,
}: RecoveryDayProps) {
  const [sleepHours, setSleepHours] =
    useState("");

  const [energyLevel, setEnergyLevel] =
    useState("");

  const [
    sorenessLevel,
    setSorenessLevel,
  ] = useState("");

  const [notes, setNotes] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function load() {
      try {
        const response =
          await fetch(
            "/api/recovery",
            {
              cache: "no-store",
            },
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error ??
              "Unable to load recovery.",
          );
        }

        if (result.recovery) {
          setSleepHours(
            result.recovery.sleepHours ??
              "",
          );

          setEnergyLevel(
            result.recovery.energyLevel ??
              "",
          );

          setSorenessLevel(
            result.recovery.sorenessLevel ??
              "",
          );

          setNotes(
            result.recovery.notes ??
              "",
          );

          setSaved(true);
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load recovery.",
        );
      }
    }

    load();
  }, []);

  async function save() {
    try {
      setSaving(true);
      setError("");
      setSaved(false);

      const response =
        await fetch(
          "/api/recovery",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              strategyDayId,
              sleepHours:
                sleepHours === ""
                  ? null
                  : Number(
                      sleepHours,
                    ),
              energyLevel:
                energyLevel === ""
                  ? null
                  : Number(
                      energyLevel,
                    ),
              sorenessLevel:
                sorenessLevel === ""
                  ? null
                  : Number(
                      sorenessLevel,
                    ),
              notes,
            }),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ??
            "Unable to save recovery.",
        );
      }

      setSaved(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save recovery.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Recovery Day
        </p>

        <h2 className="mt-2 text-2xl font-bold text-gray-900">
          {dayName}
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          No workout is scheduled for this
          cycle position. Record your
          recovery information instead.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Sleep hours
          </label>

          <input
            type="number"
            min="0"
            max="24"
            step="0.25"
            value={sleepHours}
            onChange={(event) =>
              setSleepHours(
                event.target.value,
              )
            }
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-600"
            placeholder="7.5"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Energy (1–10)
          </label>

          <input
            type="number"
            min="1"
            max="10"
            value={energyLevel}
            onChange={(event) =>
              setEnergyLevel(
                event.target.value,
              )
            }
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-600"
            placeholder="8"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Soreness (1–10)
          </label>

          <input
            type="number"
            min="1"
            max="10"
            value={sorenessLevel}
            onChange={(event) =>
              setSorenessLevel(
                event.target.value,
              )
            }
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-600"
            placeholder="3"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="text-sm font-semibold text-gray-700">
          Notes
        </label>

        <textarea
          value={notes}
          onChange={(event) =>
            setNotes(
              event.target.value,
            )
          }
          rows={4}
          placeholder="How are you feeling today?"
          className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-600"
        />
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {saved && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Recovery saved for this cycle day.
        </div>
      )}

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-5 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {saving
          ? "Saving..."
          : "Save Recovery"}
      </button>
    </section>
  );
}