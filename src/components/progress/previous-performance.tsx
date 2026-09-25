"use client";

import { useEffect, useState } from "react";

type Set = {
  id: string;
  setNumber: number;
  weight: number | null;
  repetitions: number | null;
};

type PreviousSession = {
  workoutDate: string;
  sets: Set[];
};

type ResponseData = {
  previousSession: PreviousSession | null;
};

function formatWeight(
  weight: number | null,
) {
  if (weight === null) {
    return "—";
  }

  return Number.isInteger(weight)
    ? `${weight} kg`
    : `${weight.toFixed(2)} kg`;
}

function formatDate(
  value: string,
) {
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

type Props = {
  exerciseId: string;
};

export default function PreviousPerformance({
  exerciseId,
}: Props) {
  const [
    session,
    setSession,
  ] =
    useState<PreviousSession | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response =
          await fetch(
            `/api/progress/exercises/${exerciseId}?range=all`,
          );

        if (!response.ok) {
          return;
        }

        const result =
          (await response.json()) as ResponseData;

        if (!cancelled) {
          setSession(
            result.previousSession,
          );
        }
      } catch {
        // Previous performance is supplemental.
        // Do not break the workout if it fails.
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [exerciseId]);

  if (loading) {
    return (
      <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Previous Session
        </p>

        <p className="mt-2 text-sm text-gray-400">
          Loading previous performance...
        </p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Previous Session
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-900">
            {formatDate(
              session.workoutDate,
            )}
          </p>
        </div>

        <span className="text-xs text-gray-500">
          Your last recorded session
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {session.sets.map(
          (set) => (
            <div
              key={set.id}
              className="rounded-lg bg-white px-3 py-2"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Set {set.setNumber}
              </p>

              <p className="mt-1 text-sm font-bold text-gray-900">
                {formatWeight(
                  set.weight,
                )}
                {" × "}
                {set.repetitions ??
                  "—"}
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}