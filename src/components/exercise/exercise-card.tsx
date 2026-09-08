import Link from "next/link";

type ExerciseCardProps = {
  exercise: {
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
};

export function ExerciseCard({
  exercise,
}: ExerciseCardProps) {
  const image = exercise.images[0];

  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:border-slate-600"
    >
      <div className="aspect-video bg-slate-800">
        {image ? (
          <img
            src={image.imageUrl}
            alt={
              image.altText ??
              exercise.name
            }
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Exercise image
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs uppercase tracking-wider text-slate-500">
          {exercise.category}
        </p>

        <h2 className="mt-2 text-lg font-semibold text-white">
          {exercise.name}
        </h2>

        {exercise.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
            {exercise.description}
          </p>
        )}

        <div className="mt-4 text-xs text-slate-500">
          {exercise.difficultyLevel}
        </div>
      </div>
    </Link>
  );
}