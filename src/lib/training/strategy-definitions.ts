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
  focusMuscleGroups?: string[];
};

export type StrategyDefinition = {
  type: StrategyTypeValue;
  name: string;
  description: string;
  recommendedTrainingDays: number;
  days: StrategyDayDefinition[];
};

/*
 * Strategy-level muscle groups are intentionally broader
 * than the specific muscle groups stored in the database.
 *
 * Example:
 *
 * Legs
 *   -> Quadriceps
 *   -> Hamstrings
 *   -> Glutes
 *   -> Calves
 *
 * This mapping allows strategy recommendations, workout
 * population and UI filtering to work with the specific
 * muscle groups stored against exercises.
 */
export const FOCUS_MUSCLE_MAPPING: Record<
  string,
  string[]
> = {
  Legs: [
    "Quadriceps",
    "Hamstrings",
    "Glutes",
    "Calves",
  ],

  Shoulders: [
    "Front Delts",
    "Side Delts",
    "Rear Delts",
  ],

  Back: [
    "Latissimus Dorsi",
    "Upper Back",
    "Lower Back",
  ],

  "Abs / Core": [
    "Core",
  ],

  Chest: [
    "Chest",
  ],

  Triceps: [
    "Triceps",
  ],

  Biceps: [
    "Biceps",
  ],

  Traps: [
    "Traps",
  ],

  Forearms: [
    "Forearms",
  ],

  "Lower Back / Posterior Chain": [
    "Lower Back",
    "Glutes",
    "Hamstrings",
  ],
};

/**
 * Converts strategy-level focus groups into the
 * specific muscle groups used by exercises.
 *
 * Unknown/custom muscle names are preserved so
 * custom strategies continue to work.
 */
export function expandFocusMuscles(
  focusMuscles: string[],
): string[] {
  const expanded = new Set<string>();

  for (const focus of focusMuscles) {
    const trimmed = focus.trim();

    if (!trimmed) {
      continue;
    }

    const mapped =
      FOCUS_MUSCLE_MAPPING[trimmed];

    if (mapped) {
      for (const muscle of mapped) {
        expanded.add(muscle);
      }
    } else {
      expanded.add(trimmed);
    }
  }

  return Array.from(expanded);
}

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
        description:
          "Train the major muscle groups of the body.",
        focusMuscleGroups: [
          "Chest",
          "Back",
          "Shoulders",
          "Biceps",
          "Triceps",
          "Legs",
          "Abs / Core",
        ],
      },

      {
        dayNumber: 2,
        name: "Rest",
        description: "Recovery day.",
        focusMuscleGroups: [],
      },

      {
        dayNumber: 3,
        name: "Full Body",
        description:
          "Train the major muscle groups of the body.",
        focusMuscleGroups: [
          "Chest",
          "Back",
          "Shoulders",
          "Biceps",
          "Triceps",
          "Legs",
          "Abs / Core",
        ],
      },

      {
        dayNumber: 4,
        name: "Rest",
        description: "Recovery day.",
        focusMuscleGroups: [],
      },

      {
        dayNumber: 5,
        name: "Full Body",
        description:
          "Train the major muscle groups of the body.",
        focusMuscleGroups: [
          "Chest",
          "Back",
          "Shoulders",
          "Biceps",
          "Triceps",
          "Legs",
          "Abs / Core",
        ],
      },

      {
        dayNumber: 6,
        name: "Rest",
        description: "Recovery day.",
        focusMuscleGroups: [],
      },

      {
        dayNumber: 7,
        name: "Rest",
        description: "Recovery day.",
        focusMuscleGroups: [],
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
        description:
          "Chest, back, shoulders, biceps and triceps.",
        focusMuscleGroups: [
          "Chest",
          "Back",
          "Shoulders",
          "Biceps",
          "Triceps",
        ],
      },

      {
        dayNumber: 2,
        name: "Lower Body",
        description:
          "Quadriceps, hamstrings, glutes and calves.",
        focusMuscleGroups: ["Legs"],
      },

      {
        dayNumber: 3,
        name: "Rest",
        description: "Recovery day.",
        focusMuscleGroups: [],
      },

      {
        dayNumber: 4,
        name: "Upper Body",
        description:
          "Chest, back, shoulders, biceps and triceps.",
        focusMuscleGroups: [
          "Chest",
          "Back",
          "Shoulders",
          "Biceps",
          "Triceps",
        ],
      },

      {
        dayNumber: 5,
        name: "Lower Body",
        description:
          "Quadriceps, hamstrings, glutes and calves.",
        focusMuscleGroups: ["Legs"],
      },

      {
        dayNumber: 6,
        name: "Rest",
        description: "Recovery day.",
        focusMuscleGroups: [],
      },

      {
        dayNumber: 7,
        name: "Rest",
        description: "Recovery day.",
        focusMuscleGroups: [],
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
        description:
          "Chest, shoulders and triceps.",
        focusMuscleGroups: [
          "Chest",
          "Shoulders",
          "Triceps",
        ],
      },

      {
        dayNumber: 2,
        name: "Pull",
        description:
          "Back, biceps and related pulling muscles.",
        focusMuscleGroups: [
          "Back",
          "Biceps",
        ],
      },

      {
        dayNumber: 3,
        name: "Legs",
        description:
          "Quadriceps, hamstrings, glutes and calves.",
        focusMuscleGroups: ["Legs"],
      },

      {
        dayNumber: 4,
        name: "Push",
        description:
          "Chest, shoulders and triceps.",
        focusMuscleGroups: [
          "Chest",
          "Shoulders",
          "Triceps",
        ],
      },

      {
        dayNumber: 5,
        name: "Pull",
        description:
          "Back, biceps and related pulling muscles.",
        focusMuscleGroups: [
          "Back",
          "Biceps",
        ],
      },

      {
        dayNumber: 6,
        name: "Legs",
        description:
          "Quadriceps, hamstrings, glutes and calves.",
        focusMuscleGroups: ["Legs"],
      },

      {
        dayNumber: 7,
        name: "Rest",
        description: "Recovery day.",
        focusMuscleGroups: [],
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
        description:
          "Chest and triceps focused session.",
        focusMuscleGroups: [
          "Chest",
          "Triceps",
        ],
      },

      {
        dayNumber: 2,
        name: "Back + Biceps",
        description:
          "Back and biceps focused session.",
        focusMuscleGroups: [
          "Back",
          "Biceps",
        ],
      },

      {
        dayNumber: 3,
        name: "Legs",
        description:
          "Quadriceps, hamstrings, glutes and calves.",
        focusMuscleGroups: ["Legs"],
      },

      {
        dayNumber: 4,
        name: "Shoulders",
        description:
          "Front, side and rear deltoids with supporting muscles.",
        focusMuscleGroups: ["Shoulders"],
      },

      {
        dayNumber: 5,
        name: "Arms + Core",
        description:
          "Biceps, triceps and core training.",
        focusMuscleGroups: [
          "Biceps",
          "Triceps",
          "Abs / Core",
        ],
      },

      {
        dayNumber: 6,
        name: "Rest",
        description: "Recovery day.",
        focusMuscleGroups: [],
      },

      {
        dayNumber: 7,
        name: "Rest",
        description: "Recovery day.",
        focusMuscleGroups: [],
      },
    ],
  },
];

export function getStrategyDefinition(
  type: StrategyTypeValue,
): StrategyDefinition | undefined {
  return STRATEGY_DEFINITIONS.find(
    (strategy) =>
      strategy.type === type,
  );
}