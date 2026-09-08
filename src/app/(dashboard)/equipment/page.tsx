"use client";

import { useEffect, useState } from "react";

type Equipment = {
  id: string;
  name: string;
  description: string | null;
  equipmentType: string | null;
  minWeightKg: number | null;
  maxWeightKg: number | null;
  selected: boolean;
};

export default function EquipmentPage() {
  const [equipment, setEquipment] =
    useState<Equipment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEquipment() {
      try {
        const response =
          await fetch("/api/equipment");

        if (!response.ok) {
          throw new Error(
            "Failed to load equipment",
          );
        }

        const data = await response.json();

        setEquipment(data.equipment);
      } catch (error) {
        console.error(error);
        setError(
          "Unable to load equipment.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadEquipment();
  }, []);

  async function toggleEquipment(
    item: Equipment,
  ) {
    const method = item.selected
      ? "DELETE"
      : "POST";

    const response = await fetch(
      "/api/equipment",
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          equipmentId: item.id,
        }),
      },
    );

    if (!response.ok) {
      setError(
        "Unable to update equipment.",
      );
      return;
    }

    setEquipment((current) =>
      current.map((equipment) =>
        equipment.id === item.id
          ? {
              ...equipment,
              selected:
                !equipment.selected,
            }
          : equipment,
      ),
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        Loading equipment...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-widest text-slate-500">
          Gym Setup
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Your Equipment
        </h1>

        <p className="mt-3 max-w-2xl text-slate-400">
          Select the equipment available in
          your gym. The recommendation system
          will use this information when
          suggesting exercises.
        </p>

        {error && (
          <div className="mt-6 rounded-lg border border-red-900 bg-red-950/30 p-4 text-red-300">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {equipment.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                toggleEquipment(item)
              }
              className={`rounded-2xl border p-5 text-left transition ${
                item.selected
                  ? "border-white bg-slate-800"
                  : "border-slate-800 bg-slate-900 hover:border-slate-600"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">
                    {item.name}
                  </h2>

                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                    {item.equipmentType}
                  </p>
                </div>

                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    item.selected
                      ? "border-white bg-white text-slate-950"
                      : "border-slate-600"
                  }`}
                >
                  {item.selected && "✓"}
                </div>
              </div>

              {item.description && (
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>
              )}

              {item.minWeightKg !== null &&
                item.maxWeightKg !== null && (
                  <p className="mt-3 text-sm text-slate-300">
                    Range:{" "}
                    {item.minWeightKg}–
                    {item.maxWeightKg} kg
                  </p>
                )}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}