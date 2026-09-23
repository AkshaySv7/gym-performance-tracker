import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
        <div className="text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
            Gym Performance Tracker
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Train. Track. Improve.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
            Your personal training companion for tracking workouts,
            understanding exercises, monitoring progress, and making smarter
            training decisions.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Get Started
            </Link>

            <Link
              href="/exercises"
              className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              Explore Exercises
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}