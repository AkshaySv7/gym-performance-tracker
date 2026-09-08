"use client";

import { FormEvent, useEffect, useState } from "react";

type Profile = {
  displayName: string;
  experienceLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  primaryGoal: string;
  typicalWorkoutDuration: number;
};

type Preferences = {
  preferredTrainingDays: number;
  preferredVariety: string;
  preferredScheduleType: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    displayName: "",
    experienceLevel: "BEGINNER",
    primaryGoal: "",
    typicalWorkoutDuration: 60,
  });

  const [preferences, setPreferences] =
    useState<Preferences>({
      preferredTrainingDays: 4,
      preferredVariety: "Balanced",
      preferredScheduleType: "Flexible",
    });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile");

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await response.json();

        if (data.profile) {
          setProfile({
            displayName: data.profile.displayName ?? "",
            experienceLevel:
              data.profile.experienceLevel ?? "BEGINNER",
            primaryGoal:
              data.profile.primaryGoal ?? "",
            typicalWorkoutDuration:
              data.profile.typicalWorkoutDuration ?? 60,
          });
        }

        if (data.preferences) {
          setPreferences({
            preferredTrainingDays:
              data.preferences.preferredTrainingDays ?? 4,
            preferredVariety:
              data.preferences.preferredVariety ?? "Balanced",
            preferredScheduleType:
              data.preferences.preferredScheduleType ?? "Flexible",
          });
        }
      } catch (error) {
        console.error(error);
        setMessage("Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profile,
          ...preferences,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Failed to update profile",
        );
      }

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-slate-400">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest text-slate-500">
            Account
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Your Profile
          </h1>

          <p className="mt-3 text-slate-400">
            Tell the tracker about your training experience
            and preferences.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Personal Information
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Display Name
                </label>

                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      displayName: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Experience Level
                </label>

                <select
                  value={profile.experienceLevel}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      experienceLevel:
                        event.target
                          .value as Profile["experienceLevel"],
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
                >
                  <option value="BEGINNER">
                    Beginner
                  </option>

                  <option value="INTERMEDIATE">
                    Intermediate
                  </option>

                  <option value="ADVANCED">
                    Advanced
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Primary Goal
                </label>

                <input
                  type="text"
                  placeholder="Example: Muscle gain"
                  value={profile.primaryGoal}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      primaryGoal: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Typical Workout Duration
                </label>

                <select
                  value={profile.typicalWorkoutDuration}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      typicalWorkoutDuration:
                        Number(event.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={75}>75 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>120 minutes</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Training Preferences
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Training Days Per Week
                </label>

                <select
                  value={
                    preferences.preferredTrainingDays
                  }
                  onChange={(event) =>
                    setPreferences({
                      ...preferences,
                      preferredTrainingDays:
                        Number(event.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
                >
                  <option value={2}>2 days</option>
                  <option value={3}>3 days</option>
                  <option value={4}>4 days</option>
                  <option value={5}>5 days</option>
                  <option value={6}>6 days</option>
                  <option value={7}>7 days</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Exercise Variety
                </label>

                <select
                  value={preferences.preferredVariety}
                  onChange={(event) =>
                    setPreferences({
                      ...preferences,
                      preferredVariety:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
                >
                  <option value="Consistent">
                    More Consistent
                  </option>

                  <option value="Balanced">
                    Balanced
                  </option>

                  <option value="Varied">
                    More Variety
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Schedule Preference
                </label>

                <select
                  value={
                    preferences.preferredScheduleType
                  }
                  onChange={(event) =>
                    setPreferences({
                      ...preferences,
                      preferredScheduleType:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
                >
                  <option value="Flexible">
                    Flexible
                  </option>

                  <option value="Fixed">
                    Fixed Schedule
                  </option>
                </select>
              </div>
            </div>
          </section>

          {message && (
            <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}