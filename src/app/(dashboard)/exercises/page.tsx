"use client";

import { useEffect, useState } from "react";
import { ExerciseCard } from "@/components/exercise/exercise-card";

type Exercise = {
  id: string;
  name: string;
  category: string | null;
  difficultyLevel: string | null;
  description: string | null;
  images: {
    imageUrl: string;
    altText: string | null;
  }[];
};

const categories = [
  "All",
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Legs",
  "Abs / Core",
];

export default function ExercisesPage() {
  const [exercises, setExercises] =
    useState<Exercise[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadExercises() {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search);
      }

      if (category !== "All") {
        params.set("muscle", category);
      }

      const response = await fetch(
        `/api/exercises?${params.toString()}`,
      );

      if (response.ok) {
        const data = await response.json();

        setExercises(data.exercises);
      }

      setLoading(false);
    }

    loadExercises();
  }, [search, category]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm uppercase tracking-widest text-slate-500">
            Exercise Library
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Exercises
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Explore exercises, understand the
            muscles involved, and learn how to
            perform each movement correctly.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row">
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search exercises..."
            className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-slate-500"
          />

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
          >
            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="mt-10 text-slate-500">
            Loading exercises...
          </div>
        ) : exercises.length === 0 ? (
          <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            No exercises found.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}