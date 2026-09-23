export type WarmupRoutineSeed = {
  name: string;
  description: string;
  purpose: string;
  muscles: string[];
  activities: string[];
};

export const warmupRoutines: WarmupRoutineSeed[] = [
  {
    name: "Chest Warm-up",
    description:
      "Upper-body preparation focused on the chest, shoulders, and pressing muscles.",
    purpose:
      "Prepare the shoulders, chest, and upper-body stabilizers before chest training.",
    muscles: [
      "Chest",
      "Front Delts",
      "Side Delts",
      "Rear Delts",
      "Triceps",
    ],
    activities: [
      "General Cardio",
      "Neck Mobility",
      "Shoulder Rolls",
      "Arm Circles",
      "Band Pull-Apart",
      "Scapular Push-Ups",
      "Dynamic Chest Opener",
    ],
  },

  {
    name: "Triceps Warm-up",
    description:
      "Simple preparation focused on the triceps, elbows, and supporting shoulder muscles.",
    purpose:
      "Prepare the elbows, triceps, shoulders, and upper-body stabilizers before triceps training.",
    muscles: [
      "Triceps",
      "Front Delts",
      "Chest",
    ],
    activities: [
      "General Cardio",
      "Shoulder Rolls",
      "Arm Circles",
      "Scapular Push-Ups",
      "Triceps Dynamic Extension",
    ],
  },

  {
    name: "Back Warm-up",
    description:
      "Upper-body preparation focused on the back, lats, rear shoulders, and trunk.",
    purpose:
      "Prepare the shoulder blades, upper back, lats, and torso before back training.",
    muscles: [
      "Latissimus Dorsi",
      "Upper Back",
      "Rear Delts",
      "Traps",
      "Biceps",
      "Core",
    ],
    activities: [
      "General Cardio",
      "Neck Mobility",
      "Shoulder Rolls",
      "Arm Circles",
      "Band Pull-Apart",
      "Scapular Retraction",
      "Thoracic Rotation",
      "Straight-Arm Band Pulldown",
    ],
  },

  {
    name: "Biceps Warm-up",
    description:
      "Simple preparation focused on the biceps, forearms, elbows, and supporting shoulder muscles.",
    purpose:
      "Prepare the elbows, biceps, forearms, and shoulders before biceps training.",
    muscles: [
      "Biceps",
      "Forearms",
      "Front Delts",
    ],
    activities: [
      "General Cardio",
      "Shoulder Rolls",
      "Arm Circles",
      "Wrist Circles",
      "Light Biceps Curl",
    ],
  },

  {
    name: "Shoulder Warm-up",
    description:
      "Shoulder-focused preparation for pressing, lateral raises, and other shoulder movements.",
    purpose:
      "Prepare the shoulder joints, scapular muscles, and upper back before shoulder training.",
    muscles: [
      "Front Delts",
      "Side Delts",
      "Rear Delts",
      "Traps",
      "Upper Back",
    ],
    activities: [
      "General Cardio",
      "Neck Mobility",
      "Shoulder Rolls",
      "Arm Circles",
      "Band Pull-Apart",
      "Wall Slides",
      "Shoulder CARs",
    ],
  },

  {
    name: "Abs / Core Warm-up",
    description:
      "Light preparation focused on the abdominal muscles and trunk stability.",
    purpose:
      "Prepare the core and trunk without creating unnecessary fatigue before abs and core training.",
    muscles: [
      "Core",
    ],
    activities: [
      "General Cardio",
      "Cat-Cow",
      "Dead Bug",
      "Bird Dog",
      "Plank",
    ],
  },

  {
    name: "Legs Warm-up",
    description:
      "Practical lower-body preparation for squats, lunges, presses, curls, and calf movements.",
    purpose:
      "Raise body temperature and prepare the hips, knees, ankles, and lower body before leg training.",
    muscles: [
      "Quadriceps",
      "Hamstrings",
      "Glutes",
      "Calves",
    ],
    activities: [
      "General Cardio",
      "Neck Mobility",
      "Shoulder Rolls",
      "Jumping Jacks",
      "Bodyweight Squat",
      "Side Lunges",
      "Hip Openers",
      "Leg Swings",
      "Ankle Rockers",
    ],
  },
];