// Strategy planner component
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type StrategyDay = {
  id: string;
  dayNumber: number;
  name: string;
  description: string | null;
};

type UserStrategy = {
  id: string;
  name: string;
  isCustom: boolean;
  isActive: boolean;
  startedAt: string;
  endedAt: string | null;
  strategy: {
    id: string;
    name: string;
    strategyType: string;
  } | null;
  days: StrategyDay[];
};

export default function StrategyPlanner() {
  const [strategies, setStrategies] = useState<
    UserStrategy[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState("");

  async function loadStrategies() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/profile/strategies",
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            "Unable to load strategies.",
        );
      }

      setStrategies(data.strategies ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load strategies.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function activateStrategy(id: string) {
    try {
      setActionId(id);
      setError("");

      const response = await fetch(
        `/api/profile/strategies/${id}/activate`,
        {
          method: "POST",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            "Unable to activate strategy.",
        );
      }

      await loadStrategies();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to activate strategy.",
      );
    } finally {
      setActionId(null);
    }
  }

  useEffect(() => {
    loadStrategies();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          Loading your strategies...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            My Strategies
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your active and previous training strategies.
          </p>
        </div>

        <Link
          href="/strategies/custom"
          className="inline-flex justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Create Custom Strategy
        </Link>
      </div>

      {strategies.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <h3 className="font-semibold text-gray-900">
            No strategy selected
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Choose a predefined strategy or create your own.
          </p>

          <Link
            href="/strategies"
            className="mt-4 inline-flex rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Browse Strategies
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className={`rounded-2xl border bg-white p-6 shadow-sm ${
                strategy.isActive
                  ? "border-green-400 ring-1 ring-green-200"
                  : "border-gray-200"
              }`}
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {strategy.name}
                    </h3>

                    {strategy.isActive && (
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                        Active
                      </span>
                    )}

                    {strategy.isCustom && (
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        Custom
                      </span>
                    )}
                  </div>

                  {strategy.strategy && (
                    <p className="mt-1 text-sm text-gray-500">
                      {strategy.strategy.name}
                    </p>
                  )}

                  <p className="mt-3 text-xs text-gray-400">
                    Started:{" "}
                    {new Date(
                      strategy.startedAt,
                    ).toLocaleDateString()}
                  </p>

                  {strategy.endedAt && (
                    <p className="text-xs text-gray-400">
                      Ended:{" "}
                      {new Date(
                        strategy.endedAt,
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/strategies/my/${strategy.id}`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Details
                  </Link>

                  {!strategy.isActive && (
                    <button
                      type="button"
                      disabled={actionId === strategy.id}
                      onClick={() =>
                        activateStrategy(strategy.id)
                      }
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {actionId === strategy.id
                        ? "Activating..."
                        : "Make Active"}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {strategy.days.map((day) => (
                  <div
                    key={day.id}
                    className="rounded-lg bg-gray-50 p-3"
                  >
                    <p className="text-xs font-medium text-gray-400">
                      Day {day.dayNumber}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {day.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}