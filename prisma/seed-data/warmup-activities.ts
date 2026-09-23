export type WarmupActivitySeed = {
  name: string;
  warmupType:
    | "MOBILITY"
    | "ACTIVATION"
    | "DYNAMIC"
    | "GENERAL";
  recommendedSets?: number;
  recommendedReps?: number;
  recommendedDurationSeconds?: number;
  restSeconds?: number;
  purpose: string;
  description: string;
  instructions: string;
  beginnerNotes: string;
  muscles: string[];
};

export const warmupActivities: WarmupActivitySeed[] = [
  // =========================================================
  // GENERAL
  // =========================================================

  {
    name: "General Cardio",
    warmupType: "GENERAL",
    recommendedDurationSeconds: 300,
    purpose:
      "Gradually raise body temperature and prepare the body for training.",
    description:
      "Light treadmill walking, cycling, or another comfortable cardio activity.",
    instructions:
      "Perform light cardio at a comfortable pace. The goal is to become warm without creating fatigue.",
    beginnerNotes:
      "Keep the intensity easy. You should feel warmer, not exhausted.",
    muscles: [],
  },

  {
    name: "Jumping Jacks",
    warmupType: "GENERAL",
    recommendedSets: 1,
    recommendedReps: 20,
    restSeconds: 30,
    purpose:
      "Increase body temperature and prepare the whole body for movement.",
    description:
      "A controlled full-body dynamic movement involving the arms and legs.",
    instructions:
      "Stand tall, jump while moving the feet apart and arms overhead, then return to the starting position.",
    beginnerNotes:
      "Use step-out jumping jacks if jumping is uncomfortable.",
    muscles: ["Quadriceps", "Glutes", "Calves", "Shoulders"],
  },

  {
    name: "Marching in Place",
    warmupType: "GENERAL",
    recommendedDurationSeconds: 60,
    restSeconds: 20,
    purpose:
      "Gradually increase body temperature with low-impact movement.",
    description:
      "A low-impact marching movement performed in place.",
    instructions:
      "Stand tall and alternate lifting the knees while moving the arms naturally.",
    beginnerNotes:
      "Keep the movement comfortable and controlled.",
    muscles: ["Quadriceps", "Hip Flexors", "Calves"],
  },

  {
    name: "High Knees",
    warmupType: "DYNAMIC",
    recommendedDurationSeconds: 30,
    restSeconds: 30,
    purpose:
      "Increase body temperature and dynamically prepare the legs.",
    description:
      "A dynamic movement alternating knee drives while staying in place.",
    instructions:
      "Stand tall and alternate lifting the knees while maintaining a controlled rhythm.",
    beginnerNotes:
      "Reduce the knee height or use marching if the movement is too intense.",
    muscles: ["Quadriceps", "Hip Flexors", "Calves"],
  },

  // =========================================================
  // NECK / GENERAL MOBILITY
  // =========================================================

  {
    name: "Neck Mobility",
    warmupType: "MOBILITY",
    recommendedDurationSeconds: 30,
    restSeconds: 15,
    purpose:
      "Gently prepare the neck for upper-body training.",
    description:
      "Slow and controlled neck movements through comfortable ranges.",
    instructions:
      "Slowly look left and right, then gently move the head through comfortable flexion and extension.",
    beginnerNotes:
      "Do not force the neck into extreme positions or make fast circles.",
    muscles: [],
  },

  {
    name: "Shoulder Rolls",
    warmupType: "MOBILITY",
    recommendedDurationSeconds: 30,
    restSeconds: 15,
    purpose:
      "Prepare the shoulders and upper back for movement.",
    description:
      "Controlled shoulder circles performed forward and backward.",
    instructions:
      "Raise the shoulders gently, move them backward and downward, then repeat in a smooth circular pattern.",
    beginnerNotes:
      "Use slow, comfortable movements.",
    muscles: ["Front Delts", "Rear Delts", "Traps"],
  },

  // =========================================================
  // SHOULDERS
  // =========================================================

  {
    name: "Arm Circles",
    warmupType: "MOBILITY",
    recommendedSets: 2,
    recommendedDurationSeconds: 30,
    restSeconds: 20,
    purpose:
      "Prepare the shoulders and upper body for pressing and pulling movements.",
    description:
      "Controlled circular arm movements through a comfortable range.",
    instructions:
      "Stand upright, extend the arms comfortably to the sides, and make controlled forward circles followed by backward circles.",
    beginnerNotes:
      "Keep the circles comfortable and avoid forcing painful ranges.",
    muscles: ["Front Delts", "Side Delts", "Rear Delts"],
  },

  {
    name: "Scapular Push-Ups",
    warmupType: "ACTIVATION",
    recommendedSets: 2,
    recommendedReps: 10,
    restSeconds: 30,
    purpose:
      "Prepare the shoulder blades and upper-body stabilizers.",
    description:
      "Controlled shoulder-blade movement from a stable push-up position.",
    instructions:
      "Maintain a stable torso while allowing the shoulder blades to move apart and together without significantly bending the elbows.",
    beginnerNotes:
      "Perform against an elevated surface if a floor position is difficult.",
    muscles: ["Chest", "Front Delts", "Core"],
  },

  {
    name: "Band Pull-Apart",
    warmupType: "ACTIVATION",
    recommendedSets: 2,
    recommendedReps: 12,
    restSeconds: 30,
    purpose:
      "Prepare the rear shoulders and upper back.",
    description:
      "A light resistance movement emphasizing shoulder and scapular control.",
    instructions:
      "Hold a light resistance band with both hands and pull it apart while keeping the torso stable.",
    beginnerNotes:
      "Use light resistance. The goal is preparation, not fatigue.",
    muscles: ["Rear Delts", "Upper Back", "Traps"],
  },

  {
    name: "Wall Slides",
    warmupType: "MOBILITY",
    recommendedSets: 2,
    recommendedReps: 8,
    restSeconds: 30,
    purpose:
      "Prepare shoulder mobility and upper-back control.",
    description:
      "Controlled arm movement against a wall.",
    instructions:
      "Stand with your back against a wall and slowly slide your arms upward and downward while maintaining comfortable control.",
    beginnerNotes:
      "Do not force your arms into a position that causes discomfort.",
    muscles: ["Front Delts", "Side Delts", "Rear Delts", "Upper Back"],
  },

  {
    name: "Shoulder CARs",
    warmupType: "MOBILITY",
    recommendedSets: 1,
    recommendedReps: 5,
    restSeconds: 20,
    purpose:
      "Explore controlled shoulder movement before upper-body training.",
    description:
      "Slow controlled shoulder circles through a comfortable range.",
    instructions:
      "Move one arm slowly through a large comfortable circular path while keeping the torso controlled.",
    beginnerNotes:
      "Use a smaller range if mobility is limited.",
    muscles: ["Front Delts", "Side Delts", "Rear Delts"],
  },

  {
    name: "Dynamic Chest Opener",
    warmupType: "MOBILITY",
    recommendedSets: 1,
    recommendedReps: 10,
    restSeconds: 20,
    purpose:
      "Prepare the chest and shoulders for pressing movements.",
    description:
      "Controlled arm-opening movement that alternates between a relaxed forward position and an open chest position.",
    instructions:
      "Move the arms forward and then open them comfortably while keeping the torso stable.",
    beginnerNotes:
      "Avoid aggressively stretching the shoulders.",
    muscles: ["Chest", "Front Delts"],
  },

  // =========================================================
  // CHEST
  // =========================================================

  {
    name: "Wall Push-Ups",
    warmupType: "ACTIVATION",
    recommendedSets: 1,
    recommendedReps: 10,
    restSeconds: 30,
    purpose:
      "Lightly activate the chest, shoulders, and triceps before pressing.",
    description:
      "An easy push-up variation performed against a wall.",
    instructions:
      "Place your hands on a wall, keep your body controlled, bend the elbows to approach the wall, then press away.",
    beginnerNotes:
      "Keep the movement easy and do not train to fatigue.",
    muscles: ["Chest", "Front Delts", "Triceps"],
  },

  {
    name: "Incline Scapular Push-Up",
    warmupType: "ACTIVATION",
    recommendedSets: 1,
    recommendedReps: 10,
    restSeconds: 20,
    purpose:
      "Prepare the shoulder blades and chest for pressing movements.",
    description:
      "A simplified scapular push-up performed against an elevated surface.",
    instructions:
      "Place the hands on a stable elevated surface and move the shoulder blades apart and together while keeping the elbows mostly straight.",
    beginnerNotes:
      "Use a higher surface for easier control.",
    muscles: ["Chest", "Front Delts", "Upper Back"],
  },

  // =========================================================
  // BACK
  // =========================================================

  {
    name: "Thoracic Rotation",
    warmupType: "MOBILITY",
    recommendedSets: 1,
    recommendedReps: 8,
    restSeconds: 20,
    purpose:
      "Prepare the upper back and torso for pulling movements.",
    description:
      "Controlled rotation through the upper back.",
    instructions:
      "From a stable position, rotate the upper body slowly while keeping the lower body controlled.",
    beginnerNotes:
      "Move through a comfortable range without forcing rotation.",
    muscles: ["Upper Back", "Core"],
  },

  {
    name: "Cat-Cow",
    warmupType: "MOBILITY",
    recommendedSets: 1,
    recommendedReps: 8,
    restSeconds: 20,
    purpose:
      "Prepare the spine and trunk for compound movements.",
    description:
      "Gentle alternating spinal flexion and extension.",
    instructions:
      "From a hands-and-knees position, slowly round the spine and then move into a comfortable extended position.",
    beginnerNotes:
      "Keep the movement slow rather than trying to maximize range.",
    muscles: ["Upper Back", "Lower Back", "Core"],
  },

  {
    name: "Scapular Retraction",
    warmupType: "ACTIVATION",
    recommendedSets: 2,
    recommendedReps: 10,
    restSeconds: 20,
    purpose:
      "Prepare the shoulder blades and upper back for pulling.",
    description:
      "Controlled shoulder-blade retraction without heavy resistance.",
    instructions:
      "Keep the arms relaxed and gently draw the shoulder blades together before returning to neutral.",
    beginnerNotes:
      "Do not shrug the shoulders upward.",
    muscles: ["Upper Back", "Rear Delts", "Traps"],
  },

  {
    name: "Straight-Arm Band Pulldown",
    warmupType: "ACTIVATION",
    recommendedSets: 1,
    recommendedReps: 12,
    restSeconds: 30,
    purpose:
      "Lightly activate the lats before pulling exercises.",
    description:
      "A light band movement resembling the straight-arm pulldown pattern.",
    instructions:
      "Anchor a light band overhead, keep the arms relatively straight, and pull the band downward toward the thighs.",
    beginnerNotes:
      "Use very light resistance.",
    muscles: ["Lats", "Upper Back"],
  },

  // =========================================================
  // BICEPS / ARMS
  // =========================================================

  {
    name: "Light Biceps Curl",
    warmupType: "ACTIVATION",
    recommendedSets: 1,
    recommendedReps: 12,
    restSeconds: 20,
    purpose:
      "Lightly prepare the elbow flexors before arm training.",
    description:
      "Very light controlled biceps curls.",
    instructions:
      "Use a very light load and perform smooth curls without swinging the body.",
    beginnerNotes:
      "This should feel easy and should not fatigue the biceps.",
    muscles: ["Biceps", "Forearms"],
  },

  {
    name: "Wrist Circles",
    warmupType: "MOBILITY",
    recommendedDurationSeconds: 30,
    restSeconds: 15,
    purpose:
      "Prepare the wrists and forearms for gripping exercises.",
    description:
      "Gentle circular wrist movements.",
    instructions:
      "Move the wrists slowly through comfortable circles in both directions.",
    beginnerNotes:
      "Keep the movement gentle.",
    muscles: ["Forearms"],
  },

  {
    name: "Triceps Dynamic Extension",
    warmupType: "MOBILITY",
    recommendedSets: 1,
    recommendedReps: 12,
    restSeconds: 20,
    purpose:
      "Prepare the elbows and triceps for pressing and extension movements.",
    description:
      "Light controlled elbow extension without heavy resistance.",
    instructions:
      "Move the arms through comfortable elbow flexion and extension while keeping the shoulders relaxed.",
    beginnerNotes:
      "Do not force the elbows into extreme positions.",
    muscles: ["Triceps"],
  },

  // =========================================================
  // HIPS
  // =========================================================

  {
    name: "Hip Openers",
    warmupType: "MOBILITY",
    recommendedSets: 1,
    recommendedReps: 8,
    restSeconds: 20,
    purpose:
      "Prepare the hips for squatting, lunging, and other lower-body movements.",
    description:
      "Controlled hip-opening movement through a comfortable range.",
    instructions:
      "Lift one knee and move it outward in a controlled arc before returning it to the starting position.",
    beginnerNotes:
      "Hold onto a stable surface if balance is difficult.",
    muscles: ["Glutes", "Hip Flexors"],
  },

  {
    name: "90/90 Hip Rotation",
    warmupType: "MOBILITY",
    recommendedSets: 1,
    recommendedReps: 8,
    restSeconds: 20,
    purpose:
      "Prepare hip rotation and mobility.",
    description:
      "Controlled hip rotation performed from a seated 90/90 position.",
    instructions:
      "Sit with both legs bent and slowly rotate the knees from one side to the other while maintaining control.",
    beginnerNotes:
      "Use a comfortable range and support yourself with your hands if necessary.",
    muscles: ["Glutes", "Hip Flexors"],
  },

  {
    name: "World's Greatest Stretch",
    warmupType: "MOBILITY",
    recommendedSets: 1,
    recommendedReps: 5,
    restSeconds: 20,
    purpose:
      "Prepare the hips, hamstrings, thoracic spine, and lower body.",
    description:
      "A dynamic mobility sequence combining a lunge position with upper-body rotation.",
    instructions:
      "Step into a lunge, place the hands for support, rotate the upper body toward the forward leg, then return and switch sides.",
    beginnerNotes:
      "Move slowly and use a shorter range if mobility is limited.",
    muscles: ["Hip Flexors", "Glutes", "Hamstrings", "Upper Back"],
  },

  // =========================================================
  // QUADRICEPS
  // =========================================================

  {
    name: "Bodyweight Squat",
    warmupType: "DYNAMIC",
    recommendedSets: 2,
    recommendedReps: 10,
    restSeconds: 30,
    purpose:
      "Rehearse the squat pattern and prepare the lower body.",
    description:
      "Controlled bodyweight squats.",
    instructions:
      "Stand with a comfortable stance, brace the torso, descend under control, then return to standing.",
    beginnerNotes:
      "Use a comfortable depth and prioritize movement quality.",
    muscles: ["Quadriceps", "Glutes", "Core"],
  },

  {
    name: "Reverse Lunge",
    warmupType: "DYNAMIC",
    recommendedSets: 1,
    recommendedReps: 8,
    restSeconds: 30,
    purpose:
      "Prepare the legs and hips for unilateral movements.",
    description:
      "Controlled bodyweight reverse lunges.",
    instructions:
      "Step backward, lower under control, push through the front foot, and return to standing.",
    beginnerNotes:
      "Use support if balance is difficult.",
    muscles: ["Quadriceps", "Glutes", "Hamstrings"],
  },

  {
    name: "Leg Swings",
    warmupType: "DYNAMIC",
    recommendedSets: 1,
    recommendedReps: 10,
    restSeconds: 20,
    purpose:
      "Prepare the hips and legs through controlled dynamic movement.",
    description:
      "Controlled forward-and-back leg swings.",
    instructions:
      "Hold a stable support and swing one leg forward and backward through a comfortable range.",
    beginnerNotes:
      "Start with a small range and gradually increase it.",
    muscles: ["Quadriceps", "Hamstrings", "Hip Flexors", "Glutes"],
  },

  // =========================================================
  // HAMSTRINGS / POSTERIOR CHAIN
  // =========================================================

  {
    name: "Hip Hinge",
    warmupType: "DYNAMIC",
    recommendedSets: 2,
    recommendedReps: 10,
    restSeconds: 30,
    purpose:
      "Prepare the posterior chain for deadlifts and Romanian deadlifts.",
    description:
      "A bodyweight hip-hinge drill.",
    instructions:
      "Stand tall, soften the knees, push the hips backward while keeping the torso controlled, then drive the hips forward to return.",
    beginnerNotes:
      "Focus on moving through the hips rather than turning the movement into a squat.",
    muscles: ["Hamstrings", "Glutes", "Lower Back"],
  },

  {
    name: "Dynamic Hamstring Sweep",
    warmupType: "DYNAMIC",
    recommendedSets: 1,
    recommendedReps: 8,
    restSeconds: 20,
    purpose:
      "Prepare the hamstrings and posterior chain dynamically.",
    description:
      "A controlled movement combining a small hip hinge with a sweeping motion.",
    instructions:
      "Extend one leg slightly forward, hinge toward it while sweeping the hands toward the foot, then return and switch sides.",
    beginnerNotes:
      "Keep the back controlled and avoid forcing the stretch.",
    muscles: ["Hamstrings", "Glutes"],
  },

  // =========================================================
  // GLUTES
  // =========================================================

  {
    name: "Glute Bridge",
    warmupType: "ACTIVATION",
    recommendedSets: 2,
    recommendedReps: 10,
    restSeconds: 30,
    purpose:
      "Activate the glutes before lower-body compound movements.",
    description:
      "Controlled hip extension performed from the floor.",
    instructions:
      "Lie on your back with the knees bent, brace the core, drive through the feet, and lift the hips under control.",
    beginnerNotes:
      "Avoid excessive lower-back arching.",
    muscles: ["Glutes", "Hamstrings", "Core"],
  },

  {
    name: "Single-Leg Glute Bridge",
    warmupType: "ACTIVATION",
    recommendedSets: 1,
    recommendedReps: 8,
    restSeconds: 30,
    purpose:
      "Activate the glutes individually before unilateral leg training.",
    description:
      "A single-leg variation of the glute bridge.",
    instructions:
      "Keep one foot planted, extend the other leg, and raise the hips using the planted leg.",
    beginnerNotes:
      "Use the regular glute bridge if the single-leg version is difficult.",
    muscles: ["Glutes", "Hamstrings"],
  },

  // =========================================================
  // CALVES / ANKLES
  // =========================================================

  {
    name: "Ankle Circles",
    warmupType: "MOBILITY",
    recommendedSets: 1,
    recommendedReps: 10,
    restSeconds: 15,
    purpose:
      "Prepare the ankles for squats, lunges, and calf training.",
    description:
      "Controlled ankle circles.",
    instructions:
      "Lift one foot slightly and slowly circle the ankle in both directions.",
    beginnerNotes:
      "Keep the circles comfortable.",
    muscles: ["Calves"],
  },

  {
    name: "Ankle Rockers",
    warmupType: "MOBILITY",
    recommendedSets: 1,
    recommendedReps: 10,
    restSeconds: 20,
    purpose:
      "Prepare ankle movement needed for lower-body exercises.",
    description:
      "Controlled forward movement of the knee over the foot.",
    instructions:
      "Keep the heel planted and gently drive the knee forward over the toes before returning.",
    beginnerNotes:
      "Do not force the heel off the floor.",
    muscles: ["Calves"],
  },

  {
    name: "Bodyweight Calf Raise",
    warmupType: "ACTIVATION",
    recommendedSets: 1,
    recommendedReps: 15,
    restSeconds: 20,
    purpose:
      "Prepare the calves and ankles before lower-body training.",
    description:
      "Controlled calf raises using bodyweight.",
    instructions:
      "Stand tall, rise onto the balls of the feet, pause briefly, and lower under control.",
    beginnerNotes:
      "Hold onto a stable surface for balance.",
    muscles: ["Calves"],
  },

  // =========================================================
  // CORE
  // =========================================================

  {
    name: "Dead Bug",
    warmupType: "ACTIVATION",
    recommendedSets: 2,
    recommendedReps: 8,
    restSeconds: 30,
    purpose:
      "Prepare the core for compound movements requiring trunk stability.",
    description:
      "A controlled core activation drill performed on the floor.",
    instructions:
      "Lie on your back, brace your abdomen, and slowly move the opposite arm and leg while maintaining control of the torso.",
    beginnerNotes:
      "Move slowly and prioritize maintaining a stable trunk.",
    muscles: ["Core"],
  },

  {
    name: "Bird Dog",
    warmupType: "ACTIVATION",
    recommendedSets: 1,
    recommendedReps: 8,
    restSeconds: 30,
    purpose:
      "Activate the core and improve trunk control.",
    description:
      "A controlled opposite-arm-and-leg movement from a hands-and-knees position.",
    instructions:
      "Extend the opposite arm and leg while keeping the torso stable, then return and switch sides.",
    beginnerNotes:
      "Use a smaller range if balance is difficult.",
    muscles: ["Core", "Glutes", "Lower Back"],
  },

  {
    name: "Plank",
    warmupType: "ACTIVATION",
    recommendedSets: 1,
    recommendedDurationSeconds: 20,
    restSeconds: 30,
    purpose:
      "Lightly activate the core before compound training.",
    description:
      "A controlled isometric trunk-stability exercise.",
    instructions:
      "Maintain a straight body position while bracing the abdomen and breathing normally.",
    beginnerNotes:
      "Use a shorter duration rather than allowing the hips to sag.",
    muscles: ["Core"],
  },

  // =========================================================
  // FULL LOWER BODY
  // =========================================================

  {
    name: "Walking Lunges",
    warmupType: "DYNAMIC",
    recommendedSets: 1,
    recommendedReps: 10,
    restSeconds: 30,
    purpose:
      "Prepare the legs and hips for unilateral lower-body movements.",
    description:
      "Controlled bodyweight lunges performed while moving forward.",
    instructions:
      "Take a controlled step forward, lower into a comfortable lunge, return to standing, and repeat with the opposite leg.",
    beginnerNotes:
      "Use a shorter range if balance or mobility is limiting.",
    muscles: ["Quadriceps", "Glutes", "Hamstrings"],
  },

  {
    name: "Side Lunges",
    warmupType: "DYNAMIC",
    recommendedSets: 1,
    recommendedReps: 8,
    restSeconds: 30,
    purpose:
      "Prepare the hips and legs for lateral movement.",
    description:
      "Controlled side-to-side lunges.",
    instructions:
      "Step to one side, bend the stepping leg while keeping the other leg relatively straight, then push back to the starting position.",
    beginnerNotes:
      "Use a shallow range at first.",
    muscles: ["Quadriceps", "Glutes", "Hamstrings"],
  },
];