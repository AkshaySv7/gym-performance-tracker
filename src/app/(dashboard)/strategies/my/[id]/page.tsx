//23. We also need a user-strategy detail page

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Strategy = {
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
  days: {
    id: string;
    dayNumber: number;
    name: string;
    description: string | null;
  }[];
};

export default function MyStrategyDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [strategy, setStrategy] =
    useState<Strategy | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          `/api/profile/strategies/${id}`,
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error?.message ||
              "Unable to load strategy.",
          );
        }

        setStrategy(data.strategy);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load strategy.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/strategies/my"
          className="text-sm font-medium text-green-600"
        >
          ← My Strategies
        </Link>

        {loading && (
          <div className="mt-6 rounded-2xl bg-white p-8">
            Loading strategy...
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {strategy && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {strategy.name}
              </h1>

              {strategy.isActive && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Active
                </span>
              )}

              {strategy.isCustom && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Custom
                </span>
              )}
            </div>

            {strategy.strategy && (
              <p className="mt-2 text-gray-500">
                Based on {strategy.strategy.name}
              </p>
            )}

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900">
                Weekly Structure
              </h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {strategy.days.map((day) => (
                  <div
                    key={day.id}
                    className="rounded-xl bg-gray-50 p-4"
                  >
                    <p className="text-xs font-semibold text-gray-400">
                      DAY {day.dayNumber}
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {day.name}
                    </p>

                    {day.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {day.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-5">
              <p className="text-sm text-gray-500">
                Started:{" "}
                {new Date(
                  strategy.startedAt,
                ).toLocaleDateString()}
              </p>

              {strategy.endedAt && (
                <p className="mt-1 text-sm text-gray-500">
                  Ended:{" "}
                  {new Date(
                    strategy.endedAt,
                  ).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}