type ExerciseDetailProps = {
  exercise: any;
  warmups: any[];
};

export function ExerciseDetail({
  exercise,
  warmups,
}: ExerciseDetailProps) {
  const primaryMuscles = exercise.muscles.filter(
    (item: any) => item.role === "PRIMARY",
  );

  const secondaryMuscles = exercise.muscles.filter(
    (item: any) => item.role === "SECONDARY",
  );

  return (
    <div className="space-y-8">
      {/* Exercise Header */}
      <section>
        <p className="text-sm uppercase tracking-widest text-slate-500">
          {exercise.category}
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          {exercise.name}
        </h1>

        <p className="mt-3 text-slate-400">
          {exercise.description}
        </p>
      </section>

      {/* Images */}
      <section className="grid gap-4 md:grid-cols-2">
        {exercise.images.map((image: any) => (
          <img
            key={image.id}
            src={image.imageUrl}
            alt={image.altText ?? exercise.name}
            className="w-full rounded-2xl object-cover"
          />
        ))}
      </section>

      {/* Basic Information */}
      <section className="grid gap-4 md:grid-cols-3">
        <InfoCard
          title="Difficulty"
          value={
            exercise.difficultyLevel ?? "Not specified"
          }
        />

        <InfoCard
          title="Movement"
          value={
            exercise.movementType ?? "Not specified"
          }
        />

        <InfoCard
          title="Category"
          value={
            exercise.category ?? "Not specified"
          }
        />
      </section>

      {/* Muscles Worked */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">
          Muscles Worked
        </h2>

        <div className="mt-5">
          <p className="text-sm text-slate-500">
            Primary
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {primaryMuscles.map((item: any) => (
              <span
                key={item.id}
                className="rounded-full bg-slate-800 px-3 py-1 text-sm"
              >
                {item.muscleGroup.name}
              </span>
            ))}
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Secondary
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {secondaryMuscles.map((item: any) => (
              <span
                key={item.id}
                className="rounded-full border border-slate-700 px-3 py-1 text-sm"
              >
                {item.muscleGroup.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Exercise Details */}
      <DetailSection
        title="How to Perform"
        content={exercise.instructions}
      />

      <DetailSection
        title="Breathing"
        content={exercise.breathingGuidance}
      />

      <DetailSection
        title="Range of Motion"
        content={exercise.rangeOfMotion}
      />

      <DetailSection
        title="Common Mistakes"
        content={exercise.commonMistakes}
      />

      <DetailSection
        title="Beginner Notes"
        content={exercise.beginnerNotes}
      />

      {/* Equipment */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">
          Required Equipment
        </h2>

        <div className="mt-4 space-y-3">
          {exercise.equipment.map((item: any) => (
            <div
              key={item.id}
              className="rounded-lg bg-slate-950 p-4"
            >
              <p className="font-medium">
                {item.equipment.name}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {item.isRequired
                  ? "Required"
                  : "Optional"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Warm-ups */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div>
          <h2 className="text-xl font-semibold">
            Related Warm-Ups
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Warm-up routines related to the muscles worked by
            this exercise.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {warmups.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center">
              <p className="text-sm text-slate-500">
                No related warm-up routines available.
              </p>
            </div>
          ) : (
            warmups.map((warmup: any) => (
              <div
                key={warmup.id}
                className="rounded-xl bg-slate-950 p-5"
              >
                <h3 className="font-semibold">
                  {warmup.name}
                </h3>

                {warmup.description && (
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {warmup.description}
                  </p>
                )}

                {warmup.purpose && (
                  <p className="mt-3 text-sm text-slate-300">
                    {warmup.purpose}
                  </p>
                )}

                {warmup.activities.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Activities
                    </p>

                    <ol className="mt-2 space-y-2">
                      {warmup.activities.map(
                        (
                          item: any,
                          index: number,
                        ) => (
                          <li
                            key={item.id}
                            className="flex items-center gap-2 text-sm text-slate-300"
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-400">
                              {index + 1}
                            </span>

                            <span>
                              {item.activity.name}
                            </span>
                          </li>
                        ),
                      )}
                    </ol>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 font-medium">
        {value}
      </p>
    </div>
  );
}

function DetailSection({
  title,
  content,
}: {
  title: string;
  content: string | null;
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-400">
        {content ?? "Information not available."}
      </p>
    </section>
  );
}