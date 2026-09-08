"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RecommendationCard } from "@/components/strategies/recommendation-card";

type StrategyRecommendation = {
  id: string;
  name: string;
  strategyType: string;
  description?: string;
};

type RecommendationData = {
  strategy: StrategyRecommendation;
  reason: string;
  alternatives: StrategyRecommendation[];
};

export default function StrategyRecommendationPage() {
  const [recommendation, setRecommendation] =
    useState<RecommendationData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecommendation() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/profile/strategy-recommendation",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error?.message ||
              "Unable to generate strategy recommendation.",
          );
        }

        setRecommendation(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to generate strategy recommendation.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadRecommendation();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/strategies"
          className="text-sm font-medium text-green-600 hover:text-green-700"
        >
          ← Back to strategies
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold text-green-600">
            Smart Recommendation
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Recommended Training Strategy
          </h1>

          <p className="mt-3 text-gray-600">
            Your recommendation is based on your profile,
            experience level, training schedule, workout
            preferences, and available equipment.
          </p>
        </div>

        {loading && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-gray-600">
              Generating your recommendation...
            </p>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && recommendation && (
          <div className="mt-8">
            <RecommendationCard
              recommendation={recommendation}
            />
          </div>
        )}
      </div>
    </main>
  );
}