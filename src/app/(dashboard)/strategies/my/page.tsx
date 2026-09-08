import Link from "next/link";
import StrategyPlanner from "@/components/strategies/strategy-planner";

export default function MyStrategiesPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/strategies"
            className="text-sm font-medium text-green-600"
          >
            ← Browse Strategies
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            My Training Strategy
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your active strategy and view previous
            training structures.
          </p>
        </div>

        <StrategyPlanner />
      </div>
    </main>
  );
}