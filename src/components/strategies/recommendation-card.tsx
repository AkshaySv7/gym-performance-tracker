//20. Recommendation card

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Recommendation = {
  strategy: {
    id: string;
    name: string;
    strategyType: string;
  };
  reason: string;
  alternatives: {
    id: string;
    name: string;
    strategyType: string;
  }[];
};

export function RecommendationCard({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function chooseStrategy(strategyId: string) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/profile/strategies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            strategyId,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            "Unable to select strategy.",
        );
      }

      router.push("/strategies/my");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to select strategy.",
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

      <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
        <p className="text-sm font-semibold text-green-700">
          Recommended Strategy
        </p>

        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          {recommendation.strategy.name}
        </h2>

        <p className="mt-4 leading-6 text-gray-700">
          {recommendation.reason}
        </p>

        <button
          type="button"
          disabled={loading}
          onClick={() =>
            chooseStrategy(
              recommendation.strategy.id,
            )
          }
          className="mt-5 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading
            ? "Selecting..."
            : "Use This Strategy"}
        </button>
      </div>

      {recommendation.alternatives.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Alternatives
          </h3>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {recommendation.alternatives.map(
              (alternative) => (
                <div
                  key={alternative.id}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <h4 className="font-semibold text-gray-900">
                    {alternative.name}
                  </h4>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      chooseStrategy(
                        alternative.id,
                      )
                    }
                    className="mt-4 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Choose This
                  </button>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}