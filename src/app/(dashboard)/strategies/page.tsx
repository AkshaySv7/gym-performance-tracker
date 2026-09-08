//Strategy catalog page
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StrategyCard from "@/components/strategies/strategy-card";

type Strategy = {
  id: string;
  name: string;
  description: string;
  strategyType: string;
  recommendedTrainingDays: number | null;
  days: {
    dayNumber: number;
    name: string;
  }[];
};

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState<Strategy[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          "/api/strategies",
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

    load();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-green-600">
              Training Strategy
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Choose how you train
            </h1>

            <p className="mt-2 max-w-2xl text-gray-600">
              Explore the available training structures and
              choose one that fits your schedule and goals.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/strategies/recommendation"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Get Recommendation
            </Link>

            <Link
              href="/strategies/custom"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Custom
            </Link>
          </div>
        </div>

        {loading && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8">
            Loading strategies...
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {strategies.map((strategy) => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}