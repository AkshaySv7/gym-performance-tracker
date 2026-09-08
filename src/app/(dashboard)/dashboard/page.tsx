"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                Gym Performance Tracker
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-slate-400">
                Track your workouts, understand your progress,
                and build a training routine around the equipment
                available in your gym.
              </p>
            </div>

            <Link
              href="/profile"
              className="inline-flex w-fit items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium transition hover:border-slate-500 hover:bg-slate-800"
            >
              My Profile
            </Link>
          </div>
        </header>

        {/* Quick Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Workouts"
            value="0"
            description="Workouts completed"
          />

          <StatCard
            title="This Week"
            value="0"
            description="Training sessions"
          />

          <StatCard
            title="Exercises"
            value="0"
            description="Exercises recorded"
          />

          <StatCard
            title="Current Streak"
            value="0 days"
            description="Keep building consistency"
          />
        </section>

        {/* Main Actions */}
        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold">
              Get Started
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Set up your gym and explore the exercise knowledge
              base.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <DashboardCard
              href="/profile"
              icon="👤"
              title="Complete Profile"
              description="Set your experience level, goals, training days, and workout preferences."
            />

            <DashboardCard
              href="/equipment"
              icon="🏋️"
              title="Your Equipment"
              description="Select the equipment available in your gym so recommendations can be customized."
            />

            <DashboardCard
              href="/exercises"
              icon="📚"
              title="Exercise Library"
              description="Explore exercises, target muscles, instructions, equipment, and warm-ups."
            />

            <DashboardCard
              href="/strategies"
              icon="📋"
              title="Training Strategy"
              description="Choose, customize, and manage your training split."
            />

          </div>
        </section>

        {/* Today's Workout */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm uppercase tracking-wider text-slate-500">
                Today
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Today's Workout
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Your personalized workout will appear here once
                your training strategy is configured.
              </p>
            </div>

            <button
              disabled
              className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-medium text-slate-500"
            >
              Start Workout
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
            <div className="text-3xl">💪</div>

            <h3 className="mt-3 font-medium">
              No workout scheduled yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Choose a training strategy and configure your
              routine. Your workout plan will appear here.
            </p>
          </div>
        </section>

        {/* Progress Overview */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Recent Workouts */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Recent Workouts
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest training sessions
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
              <p className="text-sm text-slate-500">
                No workouts recorded yet.
              </p>

              <p className="mt-2 text-xs text-slate-600">
                Your workout history will appear here.
              </p>
            </div>
          </div>

          {/* Bodyweight */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div>
              <h2 className="text-xl font-semibold">
                Bodyweight
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track your bodyweight over time
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
              <p className="text-sm text-slate-500">
                No bodyweight data yet.
              </p>

              <p className="mt-2 text-xs text-slate-600">
                Weight trends will be displayed here once you
                start recording them.
              </p>
            </div>
          </div>
        </section>

        {/* Training Intelligence Preview */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div>
            <p className="text-sm uppercase tracking-wider text-slate-500">
              Future Intelligence
            </p>

            <h2 className="mt-1 text-2xl font-semibold">
              Smart Training Insights
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              As you record workouts, the system will use your
              equipment, training strategy, exercise history,
              performance, and muscle coverage to provide more
              intelligent recommendations.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InsightCard
              title="Exercise Rotation"
              description="Avoid unnecessary repetition while retaining useful movements."
            />

            <InsightCard
              title="Muscle Coverage"
              description="Understand which muscle groups are receiving training."
            />

            <InsightCard
              title="Performance"
              description="Track weight, repetitions, sets, and progression."
            />

            <InsightCard
              title="Recommendations"
              description="Receive equipment-aware workout suggestions."
            />
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="mt-8 pb-10">
          <h2 className="text-xl font-semibold">
            Quick Navigation
          </h2>

          <div className="mt-4 flex flex-wrap gap-3">
            <QuickLink href="/profile" label="Profile" />

            <QuickLink
              href="/equipment"
              label="Equipment"
            />

            <QuickLink
              href="/exercises"
              label="Exercise Library"
            />

            <QuickLink
              href="/strategies"
              label="Training Strategy"
            />
            
          </div>
        </section>
      </div>
    </main>
  );
}

/* ---------------------------------------------
   Components
--------------------------------------------- */

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-600">
        {description}
      </p>
    </div>
  );
}

function DashboardCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-800"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-2xl transition group-hover:bg-slate-700">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <div className="mt-5 text-sm font-medium text-slate-300">
        Open →
      </div>
    </Link>
  );
}

function InsightCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="font-medium">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function QuickLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:bg-slate-800"
    >
      {label}
    </Link>
  );
}