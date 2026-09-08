// Strategy detail page
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Strategy = {
  id: string;
  name: string;
  description: string;
  recommendedTrainingDays: number | null;
  days: {
    dayNumber: number;
    name: string;
    description: string;
  }[];
};

export default function StrategyDetailPage() {
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
          `/api/strategies/${id}`,
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
          href="/strategies"
          className="text-sm font-medium text-green-600"
        >
          ← Back to strategies
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
            <p className="text-sm font-semibold text-green-600">
              Training Strategy
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              {strategy.name}
            </h1>

            <p className="mt-4 leading-7 text-gray-600">
              {strategy.description}
            </p>

            {strategy.recommendedTrainingDays && (
              <p className="mt-4 text-sm font-medium text-gray-700">
                Typical training days:{" "}
                {strategy.recommendedTrainingDays}
              </p>
            )}

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900">
                Weekly Structure
              </h2>

              <div className="mt-4 space-y-3">
                {strategy.days.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="rounded-xl bg-gray-50 p-4"
                  >
                    <div className="flex gap-4">
                      <span className="text-sm font-semibold text-gray-400">
                        Day {day.dayNumber}
                      </span>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {day.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {day.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/strategies"
              className="mt-8 inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
            >
              Back
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}