//Strategy card component
import Link from "next/link";

type StrategyDay = {
  dayNumber: number;
  name: string;
};

type Strategy = {
  id: string;
  name: string;
  description: string;
  strategyType: string;
  recommendedTrainingDays?: number | null;
  days?: StrategyDay[];
};

type StrategyCardProps = {
  strategy: Strategy;
};

export default function StrategyCard({
  strategy,
}: StrategyCardProps) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
          Training Strategy
        </p>

        <h2 className="mt-1 text-xl font-bold text-gray-900">
          {strategy.name}
        </h2>
      </div>

      <p className="text-sm leading-6 text-gray-600">
        {strategy.description}
      </p>

      {strategy.recommendedTrainingDays && (
        <p className="mt-4 text-sm font-medium text-gray-700">
          Typical training days:{" "}
          {strategy.recommendedTrainingDays}
        </p>
      )}

      {strategy.days && strategy.days.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-gray-900">
            Weekly structure
          </p>

          <div className="space-y-2">
            {strategy.days.map((day) => (
              <div
                key={day.dayNumber}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
              >
                <span className="text-sm text-gray-500">
                  Day {day.dayNumber}
                </span>

                <span className="text-sm font-medium text-gray-800">
                  {day.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Link
        href={`/strategies/${strategy.id}`}
        className="mt-6 inline-flex rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
      >
        View Strategy
      </Link>
    </article>
  );
}