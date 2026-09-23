import { notFound } from "next/navigation";
import { ensureUser } from "@/features/profile/ensure-user";
import { getWorkoutById } from "@/features/workouts/workout-service";
import WorkoutSession from "@/components/workouts/workout-session";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WorkoutPage({
  params,
}: PageProps) {
  const user = await ensureUser();

  if (!user) {
    notFound();
  }

  const { id } = await params;

  const workout = await getWorkoutById(
    user.id,
    id,
  );

  if (!workout) {
    notFound();
  }

  return (
    <WorkoutSession workoutId={workout.id} />
  );
}