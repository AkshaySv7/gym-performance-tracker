"use client";

type ChartPoint = {
  label: string;
  value: number;
};

type Props = {
  title: string;
  points: ChartPoint[];
  suffix?: string;
};

function formatValue(value: number, suffix: string) {
  const formatted = Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2);

  return `${formatted}${suffix}`;
}

export default function ProgressLineChart({
  title,
  points,
  suffix = "",
}: Props) {
  if (points.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-base font-bold text-gray-900">
          {title}
        </h3>

        <p className="mt-6 text-sm text-gray-500">
          Not enough performance data to display this chart yet.
        </p>
      </div>
    );
  }

  const width = 760;
  const height = 280;
  const paddingX = 52;
  const paddingY = 32;

  const values = points.map((point) => point.value);

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const range = maxValue - minValue;

  const chartRange =
    range === 0
      ? Math.max(maxValue, 1)
      : range;

  const chartMin =
    range === 0
      ? Math.max(0, minValue - chartRange * 0.5)
      : Math.max(0, minValue - chartRange * 0.1);

  const chartMax =
    range === 0
      ? maxValue + chartRange * 0.5
      : maxValue + chartRange * 0.1;

  const xStep =
    points.length === 1
      ? 0
      : (width - paddingX * 2) /
        (points.length - 1);

  const yRange = chartMax - chartMin || 1;

  const coordinates = points.map((point, index) => {
    const x =
      points.length === 1
        ? width / 2
        : paddingX + index * xStep;

    const y =
      height -
      paddingY -
      ((point.value - chartMin) / yRange) *
        (height - paddingY * 2);

    return {
      ...point,
      x,
      y,
    };
  });

  const path = coordinates
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
    )
    .join(" ");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-bold text-gray-900">
          {title}
        </h3>

        <span className="text-xs text-gray-500">
          {points.length} sessions
        </span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[680px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-auto w-full"
            role="img"
            aria-label={title}
          >
            <line
              x1={paddingX}
              y1={height - paddingY}
              x2={width - paddingX}
              y2={height - paddingY}
              stroke="currentColor"
              className="text-gray-200"
            />

            <line
              x1={paddingX}
              y1={paddingY}
              x2={paddingX}
              y2={height - paddingY}
              stroke="currentColor"
              className="text-gray-200"
            />

            <path
              d={path}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-900"
            />

            {coordinates.map((point) => (
              <g
                key={`${point.label}-${point.x}`}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  className="fill-white stroke-gray-900"
                  strokeWidth="3"
                />

                <text
                  x={point.x}
                  y={point.y - 12}
                  textAnchor="middle"
                  className="fill-gray-700 text-[11px]"
                >
                  {formatValue(point.value, suffix)}
                </text>

                <text
                  x={point.x}
                  y={height - 8}
                  textAnchor="middle"
                  className="fill-gray-500 text-[10px]"
                >
                  {point.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}