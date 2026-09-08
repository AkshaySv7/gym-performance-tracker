//19. Custom strategy page

import Link from "next/link";
import CustomStrategyForm from "@/components/strategies/custom-strategy-form";

export default function CustomStrategyPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/strategies"
          className="text-sm font-medium text-green-600"
        >
          ← Back to strategies
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Custom Strategy
          </h1>

          <p className="mt-2 text-gray-600">
            Build a training structure that matches your
            preferred schedule and muscle-group organization.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <CustomStrategyForm />
        </div>
      </div>
    </main>
  );
}