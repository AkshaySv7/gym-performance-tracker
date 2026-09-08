//6. Create the recommendation service

import { prisma } from "@/lib/db/prisma";
import {
  STRATEGY_DEFINITIONS,
  StrategyTypeValue,
} from "@/lib/training/strategy-definitions";

type RecommendationInput = {
  experienceLevel: string | null;
  primaryGoal: string | null;
  preferredTrainingDays: number | null;
  typicalWorkoutDuration: number | null;
  preferredVariety: string | null;
  preferredScheduleType: string | null;
};

type ScoredStrategy = {
  type: StrategyTypeValue;
  score: number;
  reasons: string[];
};

function normalize(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function scoreStrategy(
  strategy: (typeof STRATEGY_DEFINITIONS)[number],
  input: RecommendationInput,
): ScoredStrategy {
  const experience = normalize(input.experienceLevel);
  const goal = normalize(input.primaryGoal);
  const variety = normalize(input.preferredVariety);
  const schedule = normalize(input.preferredScheduleType);

  const trainingDays = input.preferredTrainingDays ?? 3;
  const duration = input.typicalWorkoutDuration ?? 60;

  let score = 0;
  const reasons: string[] = [];

  /*
   * Training frequency is the strongest initial signal.
   */
  if (strategy.type === "FULL_BODY") {
    if (trainingDays <= 3) {
      score += 40;
      reasons.push(
        "Your available training days make a full-body structure practical.",
      );
    }

    if (experience === "beginner") {
      score += 20;
      reasons.push(
        "Full-body training provides a simple structure while you build training consistency.",
      );
    }
  }

  if (strategy.type === "UPPER_LOWER") {
    if (trainingDays === 4) {
      score += 45;
      reasons.push(
        "Four available training days fit an upper/lower structure well.",
      );
    }

    if (trainingDays === 5) {
      score += 25;
    }

    if (
      experience === "intermediate" ||
      experience === "advanced"
    ) {
      score += 10;
    }
  }

  if (strategy.type === "PUSH_PULL_LEGS") {
    if (trainingDays >= 5) {
      score += 40;
      reasons.push(
        "Your higher training frequency makes a push/pull/legs structure practical.",
      );
    }

    if (trainingDays === 6) {
      score += 20;
    }

    if (
      experience === "intermediate" ||
      experience === "advanced"
    ) {
      score += 10;
      reasons.push(
        "Your experience level can support a more structured training split.",
      );
    }
  }

  if (strategy.type === "BODY_PART_SPLIT") {
    if (trainingDays >= 5) {
      score += 30;
      reasons.push(
        "A higher number of training days gives a body-part split enough room for separate sessions.",
      );
    }

    if (variety.includes("high")) {
      score += 10;
      reasons.push(
        "Your preference for variety is compatible with separate body-part sessions.",
      );
    }
  }

  /*
   * Goal adjustments.
   */
  if (
    goal.includes("strength") &&
    strategy.type === "UPPER_LOWER"
  ) {
    score += 15;
    reasons.push(
      "Upper/lower provides repeated opportunities to practice major compound movements.",
    );
  }

  if (
    (goal.includes("muscle") ||
      goal.includes("hypertrophy") ||
      goal.includes("growth")) &&
    (strategy.type === "UPPER_LOWER" ||
      strategy.type === "PUSH_PULL_LEGS" ||
      strategy.type === "BODY_PART_SPLIT")
  ) {
    score += 10;
    reasons.push(
      "This structure provides dedicated sessions for different muscle groups.",
    );
  }

  if (
    goal.includes("fat") ||
    goal.includes("weight loss") ||
    goal.includes("general fitness")
  ) {
    if (strategy.type === "FULL_BODY") {
      score += 10;
      reasons.push(
        "Full-body sessions provide a simple way to train the major muscle groups consistently.",
      );
    }
  }

  /*
   * Short workouts favor simpler structures.
   */
  if (duration <= 45 && strategy.type === "FULL_BODY") {
    score += 10;
    reasons.push(
      "Shorter workouts benefit from a simple training structure.",
    );
  }

  /*
   * Schedule preference.
   */
  if (
    schedule.includes("fixed") &&
    strategy.type === "UPPER_LOWER"
  ) {
    score += 5;
  }

  return {
    type: strategy.type,
    score,
    reasons,
  };
}

export async function generateStrategyRecommendation(
  userId: string,
) {
  const [user, preferences, equipment] =
    await Promise.all([
      prisma.user.findUnique({
        where: {
          id: userId,
        },
      }),

      prisma.userTrainingPreferences.findUnique({
        where: {
          userId,
        },
      }),

      prisma.userEquipment.findMany({
        where: {
          userId,
        },
        select: {
          equipmentId: true,
        },
      }),
    ]);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const input: RecommendationInput = {
    experienceLevel: user.experienceLevel,
    primaryGoal: user.primaryGoal,
    preferredTrainingDays:
      preferences?.preferredTrainingDays ?? null,
    typicalWorkoutDuration:
      user.typicalWorkoutDuration ??
      null,
    preferredVariety:
      preferences?.preferredVariety ?? null,
    preferredScheduleType:
      preferences?.preferredScheduleType ?? null,
  };

  const scored = STRATEGY_DEFINITIONS
    .filter((strategy) => strategy.type !== "CUSTOM")
    .map((strategy) => scoreStrategy(strategy, input))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];

  const strategy = await prisma.trainingStrategy.findFirst({
    where: {
      strategyType: best.type,
      isSystemDefined: true,
    },
  });

  if (!strategy) {
    throw new Error("RECOMMENDED_STRATEGY_NOT_FOUND");
  }

  const alternatives = [];

  for (const candidate of scored.slice(1, 3)) {
    const dbStrategy =
      await prisma.trainingStrategy.findFirst({
        where: {
          strategyType: candidate.type,
          isSystemDefined: true,
        },
      });

    if (dbStrategy) {
      alternatives.push({
        id: dbStrategy.id,
        name: dbStrategy.name,
        strategyType: candidate.type,
        score: candidate.score,
      });
    }
  }

  const reason =
    best.reasons.length > 0
      ? best.reasons.slice(0, 3).join(" ")
      : "This strategy provides a reasonable starting structure based on your current training profile.";

  return {
    strategy: {
      id: strategy.id,
      name: strategy.name,
      strategyType: best.type,
    },
    reason,
    alternatives,
    inputs: {
      experienceLevel: input.experienceLevel,
      primaryGoal: input.primaryGoal,
      preferredTrainingDays: input.preferredTrainingDays,
      typicalWorkoutDuration: input.typicalWorkoutDuration,
      preferredVariety: input.preferredVariety,
      preferredScheduleType: input.preferredScheduleType,
      equipmentCount: equipment.length,
    },
  };
}