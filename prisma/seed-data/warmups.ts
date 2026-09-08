export type WarmupSeed = {
  name: string;
  description: string;

  warmupType:
    | "MOBILITY"
    | "ACTIVATION"
    | "DYNAMIC"
    | "GENERAL";

  recommendedSets?: number;
  recommendedReps?: number;
  recommendedDurationSeconds?: number;
  restSeconds?: number;

  purpose?: string;
  instructions?: string;
  beginnerNotes?: string;

  muscleGroups: string[];

  // Optional links to exercises for more specific guidance.
  // These are NOT the primary selection mechanism.
  exercises: string[];
};

export const warmups: WarmupSeed[] = [
  // ============================================================
  // GENERAL
  // ============================================================

  {
    name: "Light Cardio Warm-Up",
    description:
      "A short period of low-intensity cardiovascular activity used to gradually raise body temperature before training.",
    warmupType: "GENERAL",
    recommendedDurationSeconds: 300,
    restSeconds: 0,
    purpose:
      "Raise body temperature and prepare the body for physical activity.",
    instructions:
      "Walk on a treadmill, cycle, or use another comfortable low-intensity cardio option for approximately five minutes.",
    beginnerNotes:
      "Keep the intensity easy. The goal is to warm up, not to become tired before the workout.",
    muscleGroups: [],
    exercises: [],
  },

  // ============================================================
  // GENERAL MOBILITY
  // ============================================================

  {
    name: "Neck Mobility",
    description:
      "Simple controlled neck movements used to gently prepare the neck and upper body.",
    warmupType: "MOBILITY",
    recommendedSets: 1,
    recommendedReps: 5,
    restSeconds: 10,
    purpose:
      "Gently prepare the neck and upper body before training.",
    instructions:
      "Slowly look left and right, then gently look up and down. Keep the movements controlled and comfortable.",
    beginnerNotes:
      "Do not force the neck or perform fast circular movements.",
    muscleGroups: [
      "Neck",
    ],
    exercises: [],
  },

  {
    name: "Arm Circles",
    description:
      "Simple controlled arm circles used to prepare the shoulder joints for upper-body training.",
    warmupType: "MOBILITY",
    recommendedSets: 1,
    recommendedReps: 10,
    restSeconds: 10,
    purpose:
      "Prepare the shoulders for pressing and pulling movements.",
    instructions:
      "Extend the arms and make controlled circles. Start small and gradually increase the circle size. Reverse the direction.",
    beginnerNotes:
      "Keep the movement comfortable and controlled.",
    muscleGroups: [
      "Shoulders",
      "Front Delts",
      "Side Delts",
      "Rear Delts",
    ],
    exercises: [],
  },

  {
    name: "Hip Openers",
    description:
      "A simple dynamic mobility movement used to prepare the hips before lower-body training.",
    warmupType: "MOBILITY",
    recommendedSets: 1,
    recommendedReps: 8,
    restSeconds: 10,
    purpose:
      "Prepare the hips for squats, lunges, hinges and other lower-body movements.",
    instructions:
      "Stand tall and slowly move one knee upward and outward in a controlled circular motion. Alternate sides.",
    beginnerNotes:
      "Use a smaller range if your hips feel stiff.",
    muscleGroups: [
      "Glutes",
      "Quadriceps",
      "Hamstrings",
    ],
    exercises: [],
  },

  {
    name: "Ankle Mobility",
    description:
      "A simple ankle mobility movement to prepare the lower legs and ankles for leg training.",
    warmupType: "MOBILITY",
    recommendedSets: 1,
    recommendedReps: 10,
    restSeconds: 10,
    purpose:
      "Prepare the ankles for squats, lunges and other lower-body movements.",
    instructions:
      "Place one foot forward and gently move the knee toward the toes while keeping the heel down. Alternate sides.",
    beginnerNotes:
      "Keep the heel planted and stay within a comfortable range.",
    muscleGroups: [
      "Calves",
      "Quadriceps",
    ],
    exercises: [],
  },

  // ============================================================
  // UPPER BODY ACTIVATION
  // ============================================================

  {
    name: "Band Pull-Apart",
    description:
      "A light activation movement for the rear shoulders and upper back.",
    warmupType: "ACTIVATION",
    recommendedSets: 1,
    recommendedReps: 12,
    restSeconds: 15,
    purpose:
      "Activate the rear shoulders and upper back before upper-body training.",
    instructions:
      "Hold a resistance band at shoulder height. Pull the band apart while keeping the arms controlled, then slowly return.",
    beginnerNotes:
      "Use light resistance and focus on control.",
    muscleGroups: [
      "Rear Delts",
      "Upper Back",
      "Shoulders",
    ],
    exercises: [
      "Bench Press",
      "Incline Dumbbell Press",
      "Lat Pulldown",
      "Seated Cable Row",
      "Barbell Row",
      "Face Pull",
    ],
  },

  {
    name: "Scapular Push-Up",
    description:
      "A simple bodyweight movement used to prepare controlled shoulder-blade movement.",
    warmupType: "ACTIVATION",
    recommendedSets: 1,
    recommendedReps: 8,
    restSeconds: 15,
    purpose:
      "Prepare the shoulders and upper back for upper-body training.",
    instructions:
      "Start in a high plank position. Keep the elbows straight and allow the shoulder blades to move naturally, then actively push the floor away.",
    beginnerNotes:
      "Use an easier elevated position if a floor plank is difficult.",
    muscleGroups: [
      "Chest",
      "Shoulders",
      "Upper Back",
    ],
    exercises: [
      "Bench Press",
      "Incline Dumbbell Press",
      "Push-Ups",
    ],
  },

  // ============================================================
  // LOWER BODY DYNAMIC
  // ============================================================

  {
    name: "Jumping Jacks",
    description:
      "A simple full-body dynamic movement that increases movement and body temperature.",
    warmupType: "DYNAMIC",
    recommendedSets: 1,
    recommendedDurationSeconds: 30,
    restSeconds: 15,
    purpose:
      "Increase movement, coordination and general readiness before training.",
    instructions:
      "Jump or step the feet outward while raising the arms overhead, then return to the starting position.",
    beginnerNotes:
      "Use a step-out version instead of jumping if needed.",
    muscleGroups: [
      "Quadriceps",
      "Calves",
      "Shoulders",
    ],
    exercises: [],
  },

  {
    name: "Air Squats",
    description:
      "A simple bodyweight squat used to prepare the hips, knees and legs for lower-body training.",
    warmupType: "DYNAMIC",
    recommendedSets: 1,
    recommendedReps: 10,
    restSeconds: 15,
    purpose:
      "Prepare the lower body for squatting and leg exercises.",
    instructions:
      "Stand with your feet approximately shoulder-width apart. Squat down under control while keeping the knees aligned with the feet, then stand.",
    beginnerNotes:
      "Use a comfortable depth and focus on controlled movement.",
    muscleGroups: [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
    ],
    exercises: [
      "Barbell Squat",
      "Leg Press",
      "Leg Extension",
      "Bulgarian Split Squat",
      "Goblet Squat",
    ],
  },

  {
    name: "Side Lunges",
    description:
      "A dynamic lateral movement used to prepare the hips and legs.",
    warmupType: "DYNAMIC",
    recommendedSets: 1,
    recommendedReps: 8,
    restSeconds: 15,
    purpose:
      "Prepare the hips, quadriceps and inner-leg musculature for lower-body movement.",
    instructions:
      "Step to one side and bend the stepping leg while keeping the other leg relatively straight. Push back to the starting position and alternate sides.",
    beginnerNotes:
      "Use a small side step at first and increase the range gradually.",
    muscleGroups: [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
    ],
    exercises: [
      "Dumbbell Lunges",
      "Walking Lunges",
      "Bulgarian Split Squat",
    ],
  },

  {
    name: "Walking Lunges",
    description:
      "A simple dynamic unilateral movement that prepares the legs for lunges and other lower-body exercises.",
    warmupType: "DYNAMIC",
    recommendedSets: 1,
    recommendedReps: 8,
    restSeconds: 15,
    purpose:
      "Prepare the hips, knees and legs for unilateral exercises.",
    instructions:
      "Take a controlled step forward, lower into a lunge, push through the front foot and continue with the opposite leg.",
    beginnerNotes:
      "Use bodyweight only and shorten the step if balance is difficult.",
    muscleGroups: [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
    ],
    exercises: [
      "Dumbbell Lunges",
      "Walking Lunges",
      "Bulgarian Split Squat",
    ],
  },

  // ============================================================
  // LOWER BODY ACTIVATION
  // ============================================================

  {
    name: "Glute Bridge",
    description:
      "A simple bodyweight hip-extension movement used to activate the glutes before lower-body training.",
    warmupType: "ACTIVATION",
    recommendedSets: 1,
    recommendedReps: 12,
    restSeconds: 15,
    purpose:
      "Activate the glutes and prepare the hips for lower-body exercises.",
    instructions:
      "Lie on your back with your knees bent. Drive through your feet and raise your hips while squeezing the glutes, then lower slowly.",
    beginnerNotes:
      "Avoid excessive lower-back arching. Focus on the glutes.",
    muscleGroups: [
      "Glutes",
      "Hamstrings",
    ],
    exercises: [
      "Barbell Squat",
      "Romanian Deadlift",
      "Deadlift",
      "Hip Thrust / Glute Bridge",
      "Bulgarian Split Squat",
    ],
  },

  {
    name: "Cat-Cow",
    description:
      "A gentle spinal mobility movement used before exercises requiring trunk and posterior-chain control.",
    warmupType: "MOBILITY",
    recommendedSets: 1,
    recommendedReps: 8,
    restSeconds: 10,
    purpose:
      "Prepare the spine and trunk for controlled movement.",
    instructions:
      "Start on your hands and knees. Slowly alternate between gently extending and flexing the spine.",
    beginnerNotes:
      "Move slowly and stay within a comfortable range.",
    muscleGroups: [
      "Lower Back",
      "Core",
    ],
    exercises: [
      "Deadlift",
      "Romanian Deadlift",
      "Barbell Row",
      "Dumbbell Row",
    ],
  },
];