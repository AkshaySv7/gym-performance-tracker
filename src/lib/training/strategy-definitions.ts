//3. Create predefined strategy definitions

export type StrategyTypeValue =
  | "FULL_BODY"
  | "UPPER_LOWER"
  | "PUSH_PULL_LEGS"
  | "BODY_PART_SPLIT"
  | "CUSTOM";

export type StrategyDayDefinition = {
  dayNumber: number;
  name: string;
  description: string;
};

export type StrategyDefinition = {
  type: StrategyTypeValue;
  name: string;
  description: string;
  recommendedTrainingDays: number;
  days: StrategyDayDefinition[];
};

export const STRATEGY_DEFINITIONS: StrategyDefinition[] = [
  {
    type: "FULL_BODY",
    name: "Full Body",
    description:
      "Train the major muscle groups together during each training session. This structure works particularly well when training frequency is limited.",
    recommendedTrainingDays: 3,
    days: [
      {
        dayNumber: 1,
        name: "Full Body",
        description: "Train the major muscle groups of the body.",
      },
      {
        dayNumber: 2,
        name: "Rest",
        description: "Recovery day.",
      },
      {
        dayNumber: 3,
        name: "Full Body",
        description: "Train the major muscle groups of the body.",
      },
      {
        dayNumber: 4,
        name: "Rest",
        description: "Recovery day.",
      },
      {
        dayNumber: 5,
        name: "Full Body",
        description: "Train the major muscle groups of the body.",
      },
      {
        dayNumber: 6,
        name: "Rest",
        description: "Recovery day.",
      },
      {
        dayNumber: 7,
        name: "Rest",
        description: "Recovery day.",
      },
    ],
  },

  {
    type: "UPPER_LOWER",
    name: "Upper / Lower",
    description:
      "Divide training into upper-body and lower-body sessions. Each major region can be trained multiple times per week.",
    recommendedTrainingDays: 4,
    days: [
      {
        dayNumber: 1,
        name: "Upper Body",
        description: "Chest, back, shoulders, biceps and triceps.",
      },
      {
        dayNumber: 2,
        name: "Lower Body",
        description: "Quadriceps, hamstrings, glutes and calves.",
      },
      {
        dayNumber: 3,
        name: "Rest",
        description: "Recovery day.",
      },
      {
        dayNumber: 4,
        name: "Upper Body",
        description: "Chest, back, shoulders, biceps and triceps.",
      },
      {
        dayNumber: 5,
        name: "Lower Body",
        description: "Quadriceps, hamstrings, glutes and calves.",
      },
      {
        dayNumber: 6,
        name: "Rest",
        description: "Recovery day.",
      },
      {
        dayNumber: 7,
        name: "Rest",
        description: "Recovery day.",
      },
    ],
  },

  {
    type: "PUSH_PULL_LEGS",
    name: "Push / Pull / Legs",
    description:
      "Organize training around pushing movements, pulling movements and leg training.",
    recommendedTrainingDays: 6,
    days: [
      {
        dayNumber: 1,
        name: "Push",
        description: "Chest, shoulders and triceps.",
      },
      {
        dayNumber: 2,
        name: "Pull",
        description: "Back, biceps and related pulling muscles.",
      },
      {
        dayNumber: 3,
        name: "Legs",
        description: "Quadriceps, hamstrings, glutes and calves.",
      },
      {
        dayNumber: 4,
        name: "Push",
        description: "Chest, shoulders and triceps.",
      },
      {
        dayNumber: 5,
        name: "Pull",
        description: "Back, biceps and related pulling muscles.",
      },
      {
        dayNumber: 6,
        name: "Legs",
        description: "Quadriceps, hamstrings, glutes and calves.",
      },
      {
        dayNumber: 7,
        name: "Rest",
        description: "Recovery day.",
      },
    ],
  },

  {
    type: "BODY_PART_SPLIT",
    name: "Body-Part Split",
    description:
      "Assign individual muscle groups or related muscle groups to different training days.",
    recommendedTrainingDays: 5,
    days: [
      {
        dayNumber: 1,
        name: "Chest + Triceps",
        description: "Chest and triceps focused session.",
      },
      {
        dayNumber: 2,
        name: "Back + Biceps",
        description: "Back and biceps focused session.",
      },
      {
        dayNumber: 3,
        name: "Legs",
        description: "Quadriceps, hamstrings, glutes and calves.",
      },
      {
        dayNumber: 4,
        name: "Shoulders",
        description: "Front, side and rear deltoids with supporting muscles.",
      },
      {
        dayNumber: 5,
        name: "Arms + Core",
        description: "Biceps, triceps and core training.",
      },
      {
        dayNumber: 6,
        name: "Rest",
        description: "Recovery day.",
      },
      {
        dayNumber: 7,
        name: "Rest",
        description: "Recovery day.",
      },
    ],
  },
];

export function getStrategyDefinition(
  type: StrategyTypeValue,
): StrategyDefinition | undefined {
  return STRATEGY_DEFINITIONS.find((strategy) => strategy.type === type);
}