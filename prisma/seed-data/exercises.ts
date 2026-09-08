export type ExerciseSeed = {
  name: string;
  category: string;
  movementType: string;
  difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  instructions: string;
  breathingGuidance: string;
  rangeOfMotion: string;
  commonMistakes: string;
  beginnerNotes: string;

  muscles: {
    name: string;
    role: "PRIMARY" | "SECONDARY";
  }[];

  equipment: {
    name: string;
    isRequired: boolean;
  }[];

  imageFile: string;
};

export const exercises: ExerciseSeed[] = [
  // ============================================================
  // CHEST
  // ============================================================

  {
    name: "Bench Press",
    category: "Chest",
    movementType: "Horizontal Push",
    difficultyLevel: "Beginner",
    description:
      "A barbell pressing exercise primarily targeting the chest with assistance from the triceps and front delts.",
    instructions:
      "Lie on the bench with your eyes positioned under the bar. Place your hands evenly on the bar, retract and stabilize your shoulder blades, keep your feet firmly planted, unrack the bar with control, lower it toward the mid-to-lower chest, then press it upward while maintaining a stable torso.",
    breathingGuidance:
      "Inhale before lowering the bar and exhale as you press it upward.",
    rangeOfMotion:
      "Lower the bar under control toward the chest while maintaining shoulder stability, then press upward without aggressively locking the elbows.",
    commonMistakes:
      "Using excessive weight, bouncing the bar from the chest, losing shoulder stability, or allowing the hips to lift excessively.",
    beginnerNotes:
      "Start with a manageable weight and prioritize learning a stable setup and controlled bar path.",
    muscles: [
      { name: "Chest", role: "PRIMARY" },
      { name: "Triceps", role: "SECONDARY" },
      { name: "Front Delts", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Barbell", isRequired: true },
      { name: "Bench Press", isRequired: true },
    ],
    imageFile: "/exercises/bench-press.webp",
  },

  {
    name: "Incline Dumbbell Press",
    category: "Chest",
    movementType: "Incline Horizontal Push",
    difficultyLevel: "Beginner",
    description:
      "A dumbbell pressing movement emphasizing the upper portion of the chest.",
    instructions:
      "Set the bench to a moderate incline. Position the dumbbells beside the upper chest, brace your torso, press the dumbbells upward under control, then lower them while maintaining a stable shoulder position.",
    breathingGuidance:
      "Inhale during the lowering phase and exhale during the press.",
    rangeOfMotion:
      "Lower the dumbbells until a comfortable stretch is achieved without forcing the shoulders into an uncomfortable position.",
    commonMistakes:
      "Using excessive incline, dropping the dumbbells too deeply, or allowing the shoulders to roll forward.",
    beginnerNotes:
      "Choose a weight that allows both dumbbells to remain controlled throughout every repetition.",
    muscles: [
      { name: "Chest", role: "PRIMARY" },
      { name: "Front Delts", role: "SECONDARY" },
      { name: "Triceps", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
      { name: "Incline Bench", isRequired: true },
    ],
    imageFile: "/exercises/incline-dumbbell-press.webp",
  },

  {
    name: "Pec Deck Fly",
    category: "Chest",
    movementType: "Horizontal Adduction",
    difficultyLevel: "Beginner",
    description:
      "A machine-based chest isolation movement.",
    instructions:
      "Adjust the seat so the handles are around chest height. Keep your back against the pad, grip the handles comfortably, bring the arms together under control, briefly squeeze the chest, then return without allowing the weights to slam.",
    breathingGuidance:
      "Exhale while bringing the arms together and inhale while returning.",
    rangeOfMotion:
      "Allow a controlled stretch without forcing the shoulders excessively behind the torso.",
    commonMistakes:
      "Using momentum, excessively bending the elbows, or allowing the weights to slam together.",
    beginnerNotes:
      "Use light-to-moderate resistance and focus on controlling the entire movement.",
    muscles: [
      { name: "Chest", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Pec Deck", isRequired: true },
    ],
    imageFile: "/exercises/pec-deck-fly.webp",
  },

  {
    name: "Chest Decline Press",
    category: "Chest",
    movementType: "Decline Horizontal Push",
    difficultyLevel: "Beginner",
    description:
      "A machine pressing movement performed on a decline pressing path.",
    instructions:
      "Adjust the seat and handles so they align comfortably with the chest. Brace against the pad, press the handles forward under control, then return slowly while maintaining tension.",
    breathingGuidance:
      "Exhale while pressing and inhale during the return.",
    rangeOfMotion:
      "Use the machine's comfortable controlled range without forcing the shoulders backward.",
    commonMistakes:
      "Using excessive weight, locking the elbows aggressively, or losing contact with the back pad.",
    beginnerNotes:
      "Start light and learn the machine's correct seat and handle position.",
    muscles: [
      { name: "Chest", role: "PRIMARY" },
      { name: "Triceps", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Chest Decline Press", isRequired: true },
    ],
    imageFile: "/exercises/chest-decline-press.webp",
  },

  {
    name: "Dumbbell Fly",
    category: "Chest",
    movementType: "Horizontal Adduction",
    difficultyLevel: "Intermediate",
    description:
      "A dumbbell chest isolation exercise emphasizing controlled horizontal arm movement.",
    instructions:
      "Lie on a flat bench with dumbbells above the chest. Keep a slight bend in the elbows, lower the arms outward under control, then bring them back together while maintaining chest tension.",
    breathingGuidance:
      "Inhale while lowering and exhale while bringing the dumbbells together.",
    rangeOfMotion:
      "Stop when a comfortable chest stretch is achieved without excessive shoulder extension.",
    commonMistakes:
      "Using too much weight, straightening the elbows completely, or dropping the dumbbells too quickly.",
    beginnerNotes:
      "Use substantially less weight than you would use for a dumbbell press.",
    muscles: [
      { name: "Chest", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
      { name: "Bench Press", isRequired: true },
    ],
    imageFile: "/exercises/dumbbell-fly.webp",
  },

  {
    name: "Pullover",
    category: "Chest",
    movementType: "Shoulder Extension",
    difficultyLevel: "Intermediate",
    description:
      "A pullover movement that can involve the chest and latissimus dorsi.",
    instructions:
      "Position yourself securely on a bench with the weight above the chest. Maintain a slight elbow bend and move the weight backward under control before returning it over the chest.",
    breathingGuidance:
      "Inhale during the lowering phase and exhale while returning.",
    rangeOfMotion:
      "Use a comfortable range that does not cause excessive shoulder discomfort.",
    commonMistakes:
      "Using excessive weight or forcing the shoulders through an unnecessarily deep range.",
    beginnerNotes:
      "Start light because shoulder positioning is important.",
    muscles: [
      { name: "Chest", role: "PRIMARY" },
      { name: "Latissimus Dorsi", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
      { name: "Bench Press", isRequired: true },
    ],
    imageFile: "/exercises/pullover.webp",
  },

  {
    name: "Smith-Machine Incline Press",
    category: "Chest",
    movementType: "Incline Horizontal Push",
    difficultyLevel: "Beginner",
    description:
      "An incline pressing movement using a guided bar path.",
    instructions:
      "Set the bench underneath the Smith bar at a suitable incline. Position the bar over the upper chest, brace your torso, lower the bar under control, then press it upward.",
    breathingGuidance:
      "Inhale while lowering and exhale while pressing.",
    rangeOfMotion:
      "Lower toward the upper chest while maintaining shoulder comfort and control.",
    commonMistakes:
      "Incorrect bench positioning, excessive weight, or lowering the bar too aggressively.",
    beginnerNotes:
      "The guided bar path can help beginners learn pressing mechanics, but setup still matters.",
    muscles: [
      { name: "Chest", role: "PRIMARY" },
      { name: "Front Delts", role: "SECONDARY" },
      { name: "Triceps", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Barbell", isRequired: true },
      { name: "Incline Bench", isRequired: true },
    ],
    imageFile: "/exercises/smith-machine-incline-press.webp",
  },

  {
    name: "Cable Chest Fly",
    category: "Chest",
    movementType: "Horizontal Adduction",
    difficultyLevel: "Beginner",
    description:
      "A cable-based chest isolation movement.",
    instructions:
      "Set the cable handles appropriately, adopt a stable stance, maintain a slight elbow bend, bring the hands together in front of the chest under control, then return while maintaining tension.",
    breathingGuidance:
      "Exhale as the hands come together and inhale as they return.",
    rangeOfMotion:
      "Allow a controlled stretch without excessive shoulder extension.",
    commonMistakes:
      "Using momentum, excessive weight, or turning the movement into a press.",
    beginnerNotes:
      "Start with light resistance and focus on maintaining tension.",
    muscles: [
      { name: "Chest", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/cable-chest-fly.webp",
  },

  {
    name: "Low-to-High Cable Fly",
    category: "Chest",
    movementType: "Diagonal Adduction",
    difficultyLevel: "Beginner",
    description:
      "A cable fly variation using a low-to-high arm path.",
    instructions:
      "Set the cables low, stand centrally, maintain a slight elbow bend, and bring the handles upward and inward toward the upper chest area under control.",
    breathingGuidance:
      "Exhale during the upward-and-inward movement and inhale during the return.",
    rangeOfMotion:
      "Use a comfortable arc while maintaining control of the shoulders.",
    commonMistakes:
      "Using momentum or turning the movement into a shoulder raise.",
    beginnerNotes:
      "Keep the resistance manageable and focus on the chest rather than chasing heavy weight.",
    muscles: [
      { name: "Chest", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/low-to-high-cable-fly.webp",
  },

  {
    name: "High-to-Low Cable Fly",
    category: "Chest",
    movementType: "Diagonal Adduction",
    difficultyLevel: "Beginner",
    description:
      "A cable fly variation using a high-to-low arm path.",
    instructions:
      "Set the cables high, establish a stable stance, keep a slight elbow bend, and bring the handles downward and inward under control.",
    breathingGuidance:
      "Exhale during the downward-and-inward movement and inhale during the return.",
    rangeOfMotion:
      "Use a controlled arc that maintains chest tension.",
    commonMistakes:
      "Using excessive resistance or allowing the torso to swing.",
    beginnerNotes:
      "Prioritize control over weight.",
    muscles: [
      { name: "Chest", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/high-to-low-cable-fly.webp",
  },

  {
    name: "Push-Ups",
    category: "Chest",
    movementType: "Horizontal Push",
    difficultyLevel: "Beginner",
    description:
      "A bodyweight horizontal pushing exercise.",
    instructions:
      "Place your hands slightly wider than shoulder width, establish a straight torso, brace your core, lower the chest toward the floor under control, then push the floor away.",
    breathingGuidance:
      "Inhale while lowering and exhale while pushing upward.",
    rangeOfMotion:
      "Lower under control while maintaining a stable torso and comfortable shoulder position.",
    commonMistakes:
      "Sagging the hips, flaring the elbows excessively, or shortening the range unnecessarily.",
    beginnerNotes:
      "Use an easier variation such as an elevated push-up if a full push-up is currently too difficult.",
    muscles: [
      { name: "Chest", role: "PRIMARY" },
      { name: "Triceps", role: "SECONDARY" },
      { name: "Front Delts", role: "SECONDARY" },
      { name: "Core", role: "SECONDARY" },
    ],
    equipment: [],
    imageFile: "/exercises/push-ups.webp",
  },

  {
    name: "Weighted Push-Ups",
    category: "Chest",
    movementType: "Horizontal Push",
    difficultyLevel: "Intermediate",
    description:
      "A loaded push-up variation that increases resistance against the upper body.",
    instructions:
      "Establish a stable push-up position with the additional load securely placed. Brace the torso, lower under control, then push back to the starting position.",
    breathingGuidance:
      "Inhale during the descent and exhale during the press.",
    rangeOfMotion:
      "Use the same controlled range as a standard push-up.",
    commonMistakes:
      "Using unstable loading, losing body alignment, or progressing the load too quickly.",
    beginnerNotes:
      "Only add load after you can perform standard push-ups with good control.",
    muscles: [
      { name: "Chest", role: "PRIMARY" },
      { name: "Triceps", role: "SECONDARY" },
      { name: "Front Delts", role: "SECONDARY" },
      { name: "Core", role: "SECONDARY" },
    ],
    equipment: [],
    imageFile: "/exercises/weighted-push-ups.webp",
  },

  // ============================================================
  // TRICEPS
  // ============================================================

  {
    name: "One-Arm Dumbbell Extension",
    category: "Triceps",
    movementType: "Elbow Extension",
    difficultyLevel: "Beginner",
    description:
      "A unilateral dumbbell extension exercise targeting the triceps.",
    instructions:
      "Hold one dumbbell overhead with the upper arm positioned near the head. Bend the elbow to lower the dumbbell behind the head, then extend the elbow to return.",
    breathingGuidance:
      "Inhale while lowering the dumbbell and exhale while extending the elbow.",
    rangeOfMotion:
      "Lower until a comfortable stretch is felt in the triceps, then return under control.",
    commonMistakes:
      "Moving the upper arm excessively, using momentum, or choosing too much weight.",
    beginnerNotes:
      "Use a light weight and focus on keeping the upper arm stable.",
    muscles: [
      { name: "Triceps", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/one-arm-dumbbell-extension.webp",
  },

  {
    name: "Two-Arm Overhead Extension",
    category: "Triceps",
    movementType: "Elbow Extension",
    difficultyLevel: "Beginner",
    description:
      "An overhead dumbbell extension performed with both arms.",
    instructions:
      "Hold a dumbbell overhead with both hands. Keep the upper arms relatively stable, lower the weight behind the head by bending the elbows, then extend the elbows.",
    breathingGuidance:
      "Inhale while lowering and exhale while extending.",
    rangeOfMotion:
      "Use a comfortable range that creates a controlled triceps stretch.",
    commonMistakes:
      "Flaring the elbows excessively or using momentum.",
    beginnerNotes:
      "Start with a manageable dumbbell and keep the torso stable.",
    muscles: [
      { name: "Triceps", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/two-arm-overhead-extension.webp",
  },

  {
    name: "Lying Triceps Extension",
    category: "Triceps",
    movementType: "Elbow Extension",
    difficultyLevel: "Intermediate",
    description:
      "A lying triceps extension performed with a barbell or suitable weight.",
    instructions:
      "Lie on a bench and hold the weight above the chest. Keep the upper arms relatively stable while bending the elbows to lower the weight toward the head, then extend the elbows.",
    breathingGuidance:
      "Inhale while lowering and exhale while extending.",
    rangeOfMotion:
      "Lower the weight under control while maintaining stable upper arms.",
    commonMistakes:
      "Moving the upper arms excessively or using too much weight.",
    beginnerNotes:
      "Use a light weight until the elbow movement feels controlled.",
    muscles: [
      { name: "Triceps", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Barbell", isRequired: true },
      { name: "Bench Press", isRequired: true },
    ],
    imageFile: "/exercises/lying-triceps-extension.webp",
  },

  {
    name: "Rope Cable Pushdown",
    category: "Triceps",
    movementType: "Elbow Extension",
    difficultyLevel: "Beginner",
    description:
      "A cable pushdown using a rope attachment to train the triceps.",
    instructions:
      "Stand facing the cable station with the rope held near chest height. Keep the elbows close to the torso, push the rope downward by extending the elbows, then return under control.",
    breathingGuidance:
      "Exhale during the pushdown and inhale during the return.",
    rangeOfMotion:
      "Extend the elbows comfortably while maintaining control throughout the movement.",
    commonMistakes:
      "Swinging the torso, moving the elbows forward and backward, or using excessive weight.",
    beginnerNotes:
      "Keep the elbows stable and focus on the triceps doing the work.",
    muscles: [
      { name: "Triceps", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/rope-cable-pushdown.webp",
  },

  {
    name: "Triceps Dips Machine",
    category: "Triceps",
    movementType: "Elbow Extension",
    difficultyLevel: "Beginner",
    description:
      "A machine-assisted pressing movement emphasizing the triceps.",
    instructions:
      "Adjust the machine and position yourself securely. Press the handles downward by extending the elbows, then return slowly.",
    breathingGuidance:
      "Exhale while pressing down and inhale while returning.",
    rangeOfMotion:
      "Use a controlled range without forcing the shoulders into discomfort.",
    commonMistakes:
      "Using excessive resistance or allowing the shoulders to move uncontrollably.",
    beginnerNotes:
      "Use a comfortable resistance and learn the machine setup first.",
    muscles: [
      { name: "Triceps", role: "PRIMARY" },
      { name: "Chest", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Triceps Dips Machine", isRequired: true },
    ],
    imageFile: "/exercises/triceps-dips-machine.webp",
  },

  {
    name: "Dumbbell Kickback",
    category: "Triceps",
    movementType: "Elbow Extension",
    difficultyLevel: "Beginner",
    description:
      "A dumbbell isolation movement targeting the triceps.",
    instructions:
      "Hinge forward while keeping the back stable. Position the upper arms beside the torso and extend the elbows to move the dumbbells backward.",
    breathingGuidance:
      "Exhale while extending the elbows and inhale while returning.",
    rangeOfMotion:
      "Fully extend the elbows comfortably while keeping the upper arms stable.",
    commonMistakes:
      "Swinging the arms or using excessive weight.",
    beginnerNotes:
      "Use light dumbbells and prioritize control.",
    muscles: [
      { name: "Triceps", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/dumbbell-kickback.webp",
  },

  {
    name: "Straight-Bar Cable Pushdown",
    category: "Triceps",
    movementType: "Elbow Extension",
    difficultyLevel: "Beginner",
    description:
      "A cable triceps pushdown using a straight bar attachment.",
    instructions:
      "Stand upright and grip the bar. Keep the elbows close to the torso and press the bar downward until the elbows are extended.",
    breathingGuidance:
      "Exhale while pushing down and inhale while returning.",
    rangeOfMotion:
      "Move through a controlled elbow extension without losing elbow position.",
    commonMistakes:
      "Leaning excessively over the bar or moving the elbows.",
    beginnerNotes:
      "Use moderate resistance and maintain a stable torso.",
    muscles: [
      { name: "Triceps", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/straight-bar-cable-pushdown.webp",
  },

  {
    name: "Single-Arm Cable Pushdown",
    category: "Triceps",
    movementType: "Elbow Extension",
    difficultyLevel: "Beginner",
    description:
      "A unilateral cable pushdown for the triceps.",
    instructions:
      "Stand facing the cable station and hold one handle. Keep the elbow near the torso and extend the arm downward under control.",
    breathingGuidance:
      "Exhale during extension and inhale during the return.",
    rangeOfMotion:
      "Extend the elbow through a comfortable controlled range.",
    commonMistakes:
      "Rotating the torso or allowing the elbow to move excessively.",
    beginnerNotes:
      "Use light resistance and work both arms evenly.",
    muscles: [
      { name: "Triceps", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/single-arm-cable-pushdown.webp",
  },

  {
    name: "Overhead Cable Triceps Extension",
    category: "Triceps",
    movementType: "Overhead Elbow Extension",
    difficultyLevel: "Intermediate",
    description:
      "An overhead cable exercise that trains the triceps through elbow extension.",
    instructions:
      "Face away from the cable station and position the handle behind the head. Keep the upper arms stable and extend the elbows forward.",
    breathingGuidance:
      "Exhale while extending and inhale while returning.",
    rangeOfMotion:
      "Use a controlled range that provides a comfortable triceps stretch.",
    commonMistakes:
      "Moving the shoulders excessively or using too much resistance.",
    beginnerNotes:
      "Start light and prioritize elbow control.",
    muscles: [
      { name: "Triceps", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/overhead-cable-triceps-extension.webp",
  },

  {
    name: "Cross-Body Cable Triceps Extension",
    category: "Triceps",
    movementType: "Elbow Extension",
    difficultyLevel: "Intermediate",
    description:
      "A unilateral cable extension performed across the body.",
    instructions:
      "Set the cable at an appropriate height. Hold the handle across the body and extend the elbow while keeping the upper arm controlled.",
    breathingGuidance:
      "Exhale during extension and inhale during the return.",
    rangeOfMotion:
      "Use a comfortable controlled elbow-extension range.",
    commonMistakes:
      "Rotating the torso or using momentum.",
    beginnerNotes:
      "Start with light resistance.",
    muscles: [
      { name: "Triceps", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/cross-body-cable-triceps-extension.webp",
  },

  // ============================================================
  // BACK
  // ============================================================

  {
    name: "Lat Pulldown",
    category: "Back",
    movementType: "Vertical Pull",
    difficultyLevel: "Beginner",
    description:
      "A vertical pulling exercise primarily targeting the latissimus dorsi.",
    instructions:
      "Sit securely at the pulldown station. Grip the bar comfortably, brace the torso, pull the bar toward the upper chest by driving the elbows downward, then return under control.",
    breathingGuidance:
      "Exhale while pulling the bar down and inhale while returning.",
    rangeOfMotion:
      "Pull through a comfortable range while maintaining shoulder control and return until the arms are extended without losing posture.",
    commonMistakes:
      "Using momentum, pulling the bar excessively behind the neck, or leaning too far backward.",
    beginnerNotes:
      "Focus on moving the elbows downward rather than simply pulling with the hands.",
    muscles: [
      { name: "Latissimus Dorsi", role: "PRIMARY" },
      { name: "Biceps", role: "SECONDARY" },
      { name: "Upper Back", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Lat Pulldown", isRequired: true },
    ],
    imageFile: "/exercises/lat-pulldown.webp",
  },

  {
    name: "Close Pulldown",
    category: "Back",
    movementType: "Vertical Pull",
    difficultyLevel: "Beginner",
    description:
      "A close-grip pulldown variation emphasizing the lats and upper back.",
    instructions:
      "Sit securely and grip the close attachment. Pull the handle toward the upper chest while keeping the torso stable, then return slowly.",
    breathingGuidance:
      "Exhale during the pull and inhale during the return.",
    rangeOfMotion:
      "Use a comfortable range while maintaining shoulder control.",
    commonMistakes:
      "Swinging the torso or pulling excessively with the arms.",
    beginnerNotes:
      "Keep the movement controlled and avoid using body momentum.",
    muscles: [
      { name: "Latissimus Dorsi", role: "PRIMARY" },
      { name: "Biceps", role: "SECONDARY" },
      { name: "Upper Back", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Lat Pulldown", isRequired: true },
    ],
    imageFile: "/exercises/close-pulldown.webp",
  },

  {
    name: "Mid Row",
    category: "Back",
    movementType: "Horizontal Pull",
    difficultyLevel: "Beginner",
    description:
      "A machine rowing movement targeting the middle and upper back.",
    instructions:
      "Sit securely with the chest supported or torso stabilized according to the machine. Pull the handles toward the torso while driving the elbows backward, then return under control.",
    breathingGuidance:
      "Exhale while pulling and inhale while returning.",
    rangeOfMotion:
      "Pull until the shoulder blades move comfortably toward each other without excessive torso movement.",
    commonMistakes:
      "Using momentum or shrugging the shoulders excessively.",
    beginnerNotes:
      "Focus on moving the elbows rather than pulling only with the hands.",
    muscles: [
      { name: "Upper Back", role: "PRIMARY" },
      { name: "Latissimus Dorsi", role: "SECONDARY" },
      { name: "Biceps", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Mid Row", isRequired: true },
    ],
    imageFile: "/exercises/mid-row.webp",
  },

  {
    name: "Dumbbell Row",
    category: "Back",
    movementType: "Horizontal Pull",
    difficultyLevel: "Beginner",
    description:
      "A unilateral dumbbell rowing exercise for the back.",
    instructions:
      "Support yourself on a bench or stable surface. Hold the dumbbell with one hand, brace the torso, pull the elbow toward the hip, then lower the dumbbell under control.",
    breathingGuidance:
      "Exhale while rowing and inhale while lowering.",
    rangeOfMotion:
      "Pull through a comfortable range without twisting the torso.",
    commonMistakes:
      "Rotating the body, shrugging the shoulder, or using momentum.",
    beginnerNotes:
      "Keep the torso stable and focus on the back muscles.",
    muscles: [
      { name: "Latissimus Dorsi", role: "PRIMARY" },
      { name: "Upper Back", role: "SECONDARY" },
      { name: "Biceps", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
      { name: "Bench Press", isRequired: true },
    ],
    imageFile: "/exercises/dumbbell-row.webp",
  },

  {
    name: "Barbell Row",
    category: "Back",
    movementType: "Horizontal Pull",
    difficultyLevel: "Intermediate",
    description:
      "A barbell rowing movement targeting the back while requiring significant trunk stability.",
    instructions:
      "Stand with the barbell and hinge at the hips while keeping the spine stable. Pull the bar toward the lower torso by driving the elbows backward, then lower under control.",
    breathingGuidance:
      "Inhale before the pull and exhale as you row the bar toward the torso.",
    rangeOfMotion:
      "Row until the elbows move behind the torso comfortably, then lower without losing the hinge position.",
    commonMistakes:
      "Rounding the back, using excessive momentum, or standing too upright.",
    beginnerNotes:
      "Master the hip hinge and use manageable weight before progressing.",
    muscles: [
      { name: "Upper Back", role: "PRIMARY" },
      { name: "Latissimus Dorsi", role: "SECONDARY" },
      { name: "Biceps", role: "SECONDARY" },
      { name: "Lower Back", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Barbell", isRequired: true },
    ],
    imageFile: "/exercises/barbell-row.webp",
  },

  {
    name: "Deadlift",
    category: "Back",
    movementType: "Hip Hinge",
    difficultyLevel: "Intermediate",
    description:
      "A compound hip-hinge movement training the posterior chain and back musculature.",
    instructions:
      "Stand with the bar over the middle of the feet. Hinge at the hips, bend the knees enough to reach the bar, brace the torso, and drive through the floor while keeping the bar close to the body.",
    breathingGuidance:
      "Take a controlled breath and brace before lifting. Exhale after passing the most demanding portion of the lift.",
    rangeOfMotion:
      "Lift from the floor to an upright standing position while maintaining a stable spine.",
    commonMistakes:
      "Rounding the back, letting the bar drift away from the body, or jerking the bar from the floor.",
    beginnerNotes:
      "Learn the hip hinge and lifting setup before using heavy loads.",
    muscles: [
      { name: "Lower Back", role: "SECONDARY" },
      { name: "Glutes", role: "PRIMARY" },
      { name: "Hamstrings", role: "PRIMARY" },
      { name: "Upper Back", role: "SECONDARY" },
      { name: "Forearms", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Barbell", isRequired: true },
    ],
    imageFile: "/exercises/deadlift.webp",
  },

  {
    name: "Chest-Supported Machine Row",
    category: "Back",
    movementType: "Horizontal Pull",
    difficultyLevel: "Beginner",
    description:
      "A supported rowing movement that reduces the need for trunk stabilization.",
    instructions:
      "Adjust the chest pad and handles. Brace against the pad and pull the handles toward the torso while driving the elbows backward, then return slowly.",
    breathingGuidance:
      "Exhale while pulling and inhale while returning.",
    rangeOfMotion:
      "Pull through a comfortable range while keeping the chest against the pad.",
    commonMistakes:
      "Shrugging the shoulders or using excessive weight.",
    beginnerNotes:
      "Use the chest support to focus on the back rather than momentum.",
    muscles: [
      { name: "Upper Back", role: "PRIMARY" },
      { name: "Latissimus Dorsi", role: "SECONDARY" },
      { name: "Biceps", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Chest-Supported Machine Row", isRequired: true },
    ],
    imageFile: "/exercises/chest-supported-machine-row.webp",
  },

  {
    name: "Seated Cable Row",
    category: "Back",
    movementType: "Horizontal Pull",
    difficultyLevel: "Beginner",
    description:
      "A seated cable rowing exercise for the back.",
    instructions:
      "Sit with the feet supported and torso upright. Pull the handle toward the torso while keeping the shoulders controlled, then extend the arms under control.",
    breathingGuidance:
      "Exhale while pulling and inhale while returning.",
    rangeOfMotion:
      "Allow the arms to extend comfortably before pulling the handle toward the torso.",
    commonMistakes:
      "Rounding the back, excessive torso swinging, or shrugging.",
    beginnerNotes:
      "Maintain a stable torso throughout the movement.",
    muscles: [
      { name: "Upper Back", role: "PRIMARY" },
      { name: "Latissimus Dorsi", role: "SECONDARY" },
      { name: "Biceps", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/seated-cable-row.webp",
  },

  {
    name: "One-Arm Cable Row",
    category: "Back",
    movementType: "Unilateral Horizontal Pull",
    difficultyLevel: "Beginner",
    description:
      "A unilateral cable row that allows focused back training.",
    instructions:
      "Stand or sit in a stable position. Pull one cable handle toward the torso while keeping the body controlled, then return slowly.",
    breathingGuidance:
      "Exhale while pulling and inhale while returning.",
    rangeOfMotion:
      "Use a controlled range while avoiding excessive torso rotation.",
    commonMistakes:
      "Rotating the torso or using momentum.",
    beginnerNotes:
      "Use light resistance until you can maintain a stable torso.",
    muscles: [
      { name: "Latissimus Dorsi", role: "PRIMARY" },
      { name: "Upper Back", role: "SECONDARY" },
      { name: "Biceps", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/one-arm-cable-row.webp",
  },

  {
    name: "Straight-Arm Cable Pulldown",
    category: "Back",
    movementType: "Shoulder Extension",
    difficultyLevel: "Beginner",
    description:
      "A cable movement emphasizing the latissimus dorsi through shoulder extension.",
    instructions:
      "Stand facing the cable station and hold the bar or attachment with nearly straight arms. Pull the attachment down toward the thighs while keeping the torso stable, then return slowly.",
    breathingGuidance:
      "Exhale while pulling down and inhale during the return.",
    rangeOfMotion:
      "Move from an overhead position to the thighs while keeping a slight elbow bend.",
    commonMistakes:
      "Bending the elbows excessively or swinging the torso.",
    beginnerNotes:
      "Use light resistance and focus on moving through the shoulders.",
    muscles: [
      { name: "Latissimus Dorsi", role: "PRIMARY" },
      { name: "Core", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/straight-arm-cable-pulldown.webp",
  },

  {
    name: "Pull-Ups",
    category: "Back",
    movementType: "Vertical Pull",
    difficultyLevel: "Intermediate",
    description:
      "A bodyweight vertical pulling exercise targeting the lats and upper back.",
    instructions:
      "Grip the bar securely and begin from a controlled hanging position. Pull the body upward by driving the elbows down and back, then lower under control.",
    breathingGuidance:
      "Exhale while pulling upward and inhale while lowering.",
    rangeOfMotion:
      "Use a controlled hanging-to-top range while maintaining shoulder control.",
    commonMistakes:
      "Swinging the body, using momentum, or shortening the range excessively.",
    beginnerNotes:
      "Use assistance if needed to learn the movement pattern.",
    muscles: [
      { name: "Latissimus Dorsi", role: "PRIMARY" },
      { name: "Upper Back", role: "SECONDARY" },
      { name: "Biceps", role: "SECONDARY" },
    ],
    equipment: [],
    imageFile: "/exercises/pull-ups.webp",
  },

  {
    name: "Face Pull",
    category: "Back",
    movementType: "Horizontal Pull",
    difficultyLevel: "Beginner",
    description:
      "A cable pulling movement emphasizing the rear shoulders and upper back.",
    instructions:
      "Set the cable around upper-chest or face height. Pull the rope toward the face while separating the hands and keeping the shoulders controlled, then return slowly.",
    breathingGuidance:
      "Exhale while pulling and inhale while returning.",
    rangeOfMotion:
      "Pull until the hands are near the sides of the face without forcing the shoulder position.",
    commonMistakes:
      "Using excessive weight, shrugging, or turning the movement into a row.",
    beginnerNotes:
      "Use light resistance and prioritize shoulder control.",
    muscles: [
      { name: "Rear Delts", role: "PRIMARY" },
      { name: "Upper Back", role: "SECONDARY" },
      { name: "Traps", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/face-pull.webp",
  },

  // ============================================================
  // BICEPS
  // ============================================================

  {
    name: "Dumbbell Curl — Standing/Seated",
    category: "Biceps",
    movementType: "Elbow Flexion",
    difficultyLevel: "Beginner",
    description:
      "A dumbbell curl performed either standing or seated to train the biceps.",
    instructions:
      "Hold the dumbbells with the palms facing forward. Keep the elbows close to the torso and curl the dumbbells upward without swinging, then lower under control.",
    breathingGuidance:
      "Exhale while curling and inhale while lowering.",
    rangeOfMotion:
      "Curl through a comfortable range while keeping the upper arms stable.",
    commonMistakes:
      "Swinging the torso or moving the elbows excessively.",
    beginnerNotes:
      "Use a weight that allows strict repetitions.",
    muscles: [
      { name: "Biceps", role: "PRIMARY" },
      { name: "Forearms", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/dumbbell-curl.webp",
  },

  {
    name: "Barbell Curl",
    category: "Biceps",
    movementType: "Elbow Flexion",
    difficultyLevel: "Beginner",
    description:
      "A barbell curl used to train the biceps with both arms simultaneously.",
    instructions:
      "Hold the bar with a comfortable grip. Keep the elbows close to the torso and curl the bar upward without swinging, then lower under control.",
    breathingGuidance:
      "Exhale while curling and inhale while lowering.",
    rangeOfMotion:
      "Curl until the forearms approach the upper arms without losing elbow position.",
    commonMistakes:
      "Using body momentum or leaning backward.",
    beginnerNotes:
      "Start with a manageable weight and prioritize strict form.",
    muscles: [
      { name: "Biceps", role: "PRIMARY" },
      { name: "Forearms", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Barbell", isRequired: true },
    ],
    imageFile: "/exercises/barbell-curl.webp",
  },

  {
    name: "Preacher Curl",
    category: "Biceps",
    movementType: "Elbow Flexion",
    difficultyLevel: "Beginner",
    description:
      "A supported curl that limits torso momentum and emphasizes the biceps.",
    instructions:
      "Position the upper arms against the preacher pad. Curl the weight upward while keeping the arms supported, then lower under control.",
    breathingGuidance:
      "Exhale while curling and inhale while lowering.",
    rangeOfMotion:
      "Use a controlled range without forcing the elbow into an uncomfortable position at the bottom.",
    commonMistakes:
      "Dropping the weight quickly or using excessive resistance.",
    beginnerNotes:
      "Use moderate resistance and control the lowering phase.",
    muscles: [
      { name: "Biceps", role: "PRIMARY" },
      { name: "Forearms", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Preacher Curl", isRequired: true },
    ],
    imageFile: "/exercises/preacher-curl.webp",
  },

  {
    name: "Cable Curl",
    category: "Biceps",
    movementType: "Elbow Flexion",
    difficultyLevel: "Beginner",
    description:
      "A cable curl providing consistent resistance through the movement.",
    instructions:
      "Stand facing the cable station and hold the handle. Keep the elbows close to the torso and curl the handle upward, then return slowly.",
    breathingGuidance:
      "Exhale while curling and inhale while returning.",
    rangeOfMotion:
      "Use a controlled elbow-flexion range without moving the upper arms excessively.",
    commonMistakes:
      "Swinging or leaning backward.",
    beginnerNotes:
      "Use light-to-moderate resistance and maintain control.",
    muscles: [
      { name: "Biceps", role: "PRIMARY" },
      { name: "Forearms", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/cable-curl.webp",
  },

  {
    name: "Hammer Curl",
    category: "Biceps",
    movementType: "Elbow Flexion",
    difficultyLevel: "Beginner",
    description:
      "A neutral-grip dumbbell curl targeting the biceps and forearm muscles.",
    instructions:
      "Hold the dumbbells with the palms facing each other. Keep the elbows near the torso and curl the dumbbells upward without swinging.",
    breathingGuidance:
      "Exhale while curling and inhale while lowering.",
    rangeOfMotion:
      "Curl through a comfortable range while maintaining the neutral grip.",
    commonMistakes:
      "Swinging the torso or moving the elbows forward excessively.",
    beginnerNotes:
      "Keep the movement controlled.",
    muscles: [
      { name: "Biceps", role: "PRIMARY" },
      { name: "Forearms", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/hammer-curl.webp",
  },

  {
    name: "Concentration Curl",
    category: "Biceps",
    movementType: "Elbow Flexion",
    difficultyLevel: "Beginner",
    description:
      "A seated unilateral curl designed to limit momentum.",
    instructions:
      "Sit and support the upper arm against the inner thigh. Curl the dumbbell upward while keeping the upper arm stable, then lower slowly.",
    breathingGuidance:
      "Exhale while curling and inhale while lowering.",
    rangeOfMotion:
      "Use a comfortable controlled range.",
    commonMistakes:
      "Moving the upper arm or using momentum.",
    beginnerNotes:
      "Use a light dumbbell and focus on control.",
    muscles: [
      { name: "Biceps", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/concentration-curl.webp",
  },

  {
    name: "Incline Dumbbell Curl",
    category: "Biceps",
    movementType: "Elbow Flexion",
    difficultyLevel: "Intermediate",
    description:
      "A curl performed on an incline bench that places the biceps in a lengthened position.",
    instructions:
      "Sit on an incline bench with the dumbbells hanging beside the body. Curl the dumbbells upward while keeping the upper arms relatively still, then lower under control.",
    breathingGuidance:
      "Exhale while curling and inhale while lowering.",
    rangeOfMotion:
      "Use a comfortable range without forcing the shoulders into excessive extension.",
    commonMistakes:
      "Using too much weight or swinging the dumbbells.",
    beginnerNotes:
      "Start lighter than with standard curls.",
    muscles: [
      { name: "Biceps", role: "PRIMARY" },
      { name: "Forearms", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
      { name: "Incline Bench", isRequired: true },
    ],
    imageFile: "/exercises/incline-dumbbell-curl.webp",
  },

  {
    name: "Single-Arm Cable Curl",
    category: "Biceps",
    movementType: "Elbow Flexion",
    difficultyLevel: "Beginner",
    description:
      "A unilateral cable curl allowing focused biceps training.",
    instructions:
      "Hold one cable handle and keep the upper arm stable. Curl the handle upward and lower it slowly.",
    breathingGuidance:
      "Exhale while curling and inhale while lowering.",
    rangeOfMotion:
      "Use a controlled elbow-flexion range.",
    commonMistakes:
      "Rotating the torso or moving the elbow.",
    beginnerNotes:
      "Use light resistance and train both arms evenly.",
    muscles: [
      { name: "Biceps", role: "PRIMARY" },
      { name: "Forearms", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/single-arm-cable-curl.webp",
  },

  {
    name: "Bayesian Cable Curl",
    category: "Biceps",
    movementType: "Elbow Flexion",
    difficultyLevel: "Intermediate",
    description:
      "A cable curl variation performed with the arm positioned behind the torso.",
    instructions:
      "Stand slightly forward of the cable attachment with the working arm behind the torso. Curl the handle while keeping the upper arm controlled, then return slowly.",
    breathingGuidance:
      "Exhale while curling and inhale while returning.",
    rangeOfMotion:
      "Use a comfortable range while maintaining shoulder control.",
    commonMistakes:
      "Rotating the torso or using excessive resistance.",
    beginnerNotes:
      "Start light and prioritize a controlled stretch.",
    muscles: [
      { name: "Biceps", role: "PRIMARY" },
      { name: "Forearms", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/bayesian-cable-curl.webp",
  },

  {
    name: "Reverse Curl",
    category: "Biceps",
    movementType: "Elbow Flexion",
    difficultyLevel: "Beginner",
    description:
      "A pronated-grip curl emphasizing the forearms while also training the biceps.",
    instructions:
      "Hold the bar or dumbbells with the palms facing downward. Curl the weight upward while keeping the elbows controlled, then lower slowly.",
    breathingGuidance:
      "Exhale while curling and inhale while lowering.",
    rangeOfMotion:
      "Use a comfortable controlled curl range.",
    commonMistakes:
      "Using excessive weight or swinging.",
    beginnerNotes:
      "Use less weight than a standard curl.",
    muscles: [
      { name: "Forearms", role: "PRIMARY" },
      { name: "Biceps", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Barbell", isRequired: true },
    ],
    imageFile: "/exercises/reverse-curl.webp",
  },

  // ============================================================
  // SHOULDERS
  // ============================================================

  {
    name: "Arnold Press",
    category: "Shoulders",
    movementType: "Vertical Push",
    difficultyLevel: "Intermediate",
    description:
      "A dumbbell shoulder press variation involving rotation during the movement.",
    instructions:
      "Begin with the dumbbells near shoulder height and palms facing toward you. Press upward while rotating the palms forward, then reverse the motion during the descent.",
    breathingGuidance:
      "Exhale while pressing and inhale while lowering.",
    rangeOfMotion:
      "Use a comfortable pressing range while maintaining shoulder control.",
    commonMistakes:
      "Using excessive weight or forcing the rotation.",
    beginnerNotes:
      "Start lighter than with a standard shoulder press.",
    muscles: [
      { name: "Front Delts", role: "PRIMARY" },
      { name: "Side Delts", role: "SECONDARY" },
      { name: "Triceps", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/arnold-press.webp",
  },

  {
    name: "Dumbbell Shoulder Press",
    category: "Shoulders",
    movementType: "Vertical Push",
    difficultyLevel: "Beginner",
    description:
      "A dumbbell pressing exercise primarily targeting the shoulder muscles.",
    instructions:
      "Sit or stand with dumbbells at shoulder height. Brace the torso and press the dumbbells upward, then lower them under control.",
    breathingGuidance:
      "Exhale while pressing and inhale while lowering.",
    rangeOfMotion:
      "Press through a comfortable range without forcing the shoulders.",
    commonMistakes:
      "Overarching the lower back or using excessive weight.",
    beginnerNotes:
      "Use a manageable weight and keep the torso stable.",
    muscles: [
      { name: "Front Delts", role: "PRIMARY" },
      { name: "Side Delts", role: "SECONDARY" },
      { name: "Triceps", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/dumbbell-shoulder-press.webp",
  },

  {
    name: "Dumbbell Side/Lateral Raise",
    category: "Shoulders",
    movementType: "Shoulder Abduction",
    difficultyLevel: "Beginner",
    description:
      "An isolation exercise emphasizing the side deltoids.",
    instructions:
      "Hold the dumbbells at your sides. With a slight bend in the elbows, raise the arms outward until around shoulder height, then lower slowly.",
    breathingGuidance:
      "Exhale while raising and inhale while lowering.",
    rangeOfMotion:
      "Raise to a comfortable height without forcing the shoulders.",
    commonMistakes:
      "Swinging the dumbbells or using excessive weight.",
    beginnerNotes:
      "Use light dumbbells and prioritize controlled movement.",
    muscles: [
      { name: "Side Delts", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/dumbbell-lateral-raise.webp",
  },

  {
    name: "Dumbbell Seated Row",
    category: "Shoulders",
    movementType: "Horizontal Pull",
    difficultyLevel: "Intermediate",
    description:
      "A seated dumbbell rowing movement that primarily trains the upper back and rear shoulder region.",
    instructions:
      "Sit in a stable position and perform a controlled rowing motion with the dumbbells, driving the elbows backward while keeping the torso stable.",
    breathingGuidance:
      "Exhale while pulling and inhale while lowering.",
    rangeOfMotion:
      "Use a controlled rowing range without excessive shoulder movement.",
    commonMistakes:
      "Using momentum or shrugging the shoulders.",
    beginnerNotes:
      "Use manageable weight and focus on upper-back control.",
    muscles: [
      { name: "Upper Back", role: "PRIMARY" },
      { name: "Rear Delts", role: "SECONDARY" },
      { name: "Biceps", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/dumbbell-seated-row.webp",
  },

  {
    name: "Upright Row",
    category: "Shoulders",
    movementType: "Shoulder Abduction",
    difficultyLevel: "Intermediate",
    description:
      "A pulling movement involving the shoulders and upper traps.",
    instructions:
      "Hold the weight in front of the body. Pull the elbows upward while keeping the movement controlled, then lower slowly.",
    breathingGuidance:
      "Exhale while pulling upward and inhale while lowering.",
    rangeOfMotion:
      "Use a comfortable range and avoid forcing the elbows excessively high.",
    commonMistakes:
      "Using excessive weight or forcing an uncomfortable shoulder position.",
    beginnerNotes:
      "Use light-to-moderate resistance and stop if the movement causes shoulder discomfort.",
    muscles: [
      { name: "Side Delts", role: "PRIMARY" },
      { name: "Traps", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/upright-row.webp",
  },

  {
    name: "Dumbbell Shrugs",
    category: "Shoulders",
    movementType: "Scapular Elevation",
    difficultyLevel: "Beginner",
    description:
      "A dumbbell shrug primarily targeting the upper trapezius muscles.",
    instructions:
      "Hold the dumbbells at your sides. Elevate the shoulders upward in a controlled manner, pause briefly, then lower them.",
    breathingGuidance:
      "Exhale during the shrug and inhale while lowering.",
    rangeOfMotion:
      "Use a comfortable upward and downward shoulder movement.",
    commonMistakes:
      "Rolling the shoulders or using excessive momentum.",
    beginnerNotes:
      "Focus on straight upward shoulder movement.",
    muscles: [
      { name: "Traps", role: "PRIMARY" },
      { name: "Forearms", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/dumbbell-shrugs.webp",
  },

  {
    name: "Reverse Pec Deck",
    category: "Shoulders",
    movementType: "Horizontal Abduction",
    difficultyLevel: "Beginner",
    description:
      "A machine movement targeting the rear deltoids and upper back.",
    instructions:
      "Adjust the seat and handles. Sit facing the machine pad and move the arms outward and backward under control, then return slowly.",
    breathingGuidance:
      "Exhale while moving the arms outward and inhale while returning.",
    rangeOfMotion:
      "Move through a comfortable range without forcing the shoulders.",
    commonMistakes:
      "Using excessive weight or swinging the torso.",
    beginnerNotes:
      "Use light resistance and focus on the rear shoulders.",
    muscles: [
      { name: "Rear Delts", role: "PRIMARY" },
      { name: "Upper Back", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Reverse Pec Deck", isRequired: true },
    ],
    imageFile: "/exercises/reverse-pec-deck.webp",
  },

  {
    name: "Cable Front Raise",
    category: "Shoulders",
    movementType: "Shoulder Flexion",
    difficultyLevel: "Beginner",
    description:
      "A cable isolation exercise targeting the front deltoids.",
    instructions:
      "Stand facing away from or toward the cable depending on the setup. Raise the handle forward to approximately shoulder height while keeping the torso stable.",
    breathingGuidance:
      "Exhale while raising and inhale while lowering.",
    rangeOfMotion:
      "Raise through a comfortable range without swinging.",
    commonMistakes:
      "Using excessive weight or leaning backward.",
    beginnerNotes:
      "Use light resistance and controlled movement.",
    muscles: [
      { name: "Front Delts", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/cable-front-raise.webp",
  },

  {
    name: "Cable Lateral Raise",
    category: "Shoulders",
    movementType: "Shoulder Abduction",
    difficultyLevel: "Beginner",
    description:
      "A cable isolation movement emphasizing the side deltoids.",
    instructions:
      "Stand beside the cable station and hold the handle with the outside hand. Raise the arm outward under control, then lower slowly.",
    breathingGuidance:
      "Exhale while raising and inhale while lowering.",
    rangeOfMotion:
      "Raise through a comfortable range around shoulder height.",
    commonMistakes:
      "Swinging the body or using excessive resistance.",
    beginnerNotes:
      "Use light resistance and focus on the side deltoid.",
    muscles: [
      { name: "Side Delts", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/cable-lateral-raise.webp",
  },

  // ============================================================
  // LEGS
  // ============================================================

  {
    name: "Barbell Squat",
    category: "Legs",
    movementType: "Squat",
    difficultyLevel: "Intermediate",
    description:
      "A compound lower-body exercise targeting the quadriceps and glutes while requiring trunk stability.",
    instructions:
      "Place the bar securely across the upper back or according to your chosen squat position. Brace the torso, bend the hips and knees to lower under control, then drive through the feet to stand.",
    breathingGuidance:
      "Take a controlled breath and brace before descending. Exhale while standing through the hardest portion.",
    rangeOfMotion:
      "Squat to a depth that can be controlled while maintaining stable foot and knee alignment.",
    commonMistakes:
      "Allowing the knees to collapse inward, losing torso control, or using excessive weight.",
    beginnerNotes:
      "Learn the squat pattern with manageable resistance before progressing.",
    muscles: [
      { name: "Quadriceps", role: "PRIMARY" },
      { name: "Glutes", role: "PRIMARY" },
      { name: "Hamstrings", role: "SECONDARY" },
      { name: "Core", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Barbell", isRequired: true },
    ],
    imageFile: "/exercises/barbell-squat.webp",
  },

  {
    name: "Dumbbell Lunges",
    category: "Legs",
    movementType: "Unilateral Squat",
    difficultyLevel: "Beginner",
    description:
      "A unilateral lower-body exercise targeting the quadriceps and glutes.",
    instructions:
      "Hold dumbbells at your sides. Step forward, lower under control until the front leg is bent comfortably, then push through the front foot to return.",
    breathingGuidance:
      "Inhale while lowering and exhale while standing.",
    rangeOfMotion:
      "Lower to a comfortable depth while maintaining balance and knee control.",
    commonMistakes:
      "Taking unstable steps, collapsing the front knee inward, or using excessive weight.",
    beginnerNotes:
      "Start with bodyweight or light dumbbells until balance improves.",
    muscles: [
      { name: "Quadriceps", role: "PRIMARY" },
      { name: "Glutes", role: "PRIMARY" },
      { name: "Hamstrings", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/dumbbell-lunges.webp",
  },

  {
    name: "Leg Extension",
    category: "Legs",
    movementType: "Knee Extension",
    difficultyLevel: "Beginner",
    description:
      "A machine isolation exercise primarily targeting the quadriceps.",
    instructions:
      "Adjust the machine so the knee aligns with the machine pivot. Extend the legs under control, briefly contract the quadriceps, then lower slowly.",
    breathingGuidance:
      "Exhale while extending and inhale while lowering.",
    rangeOfMotion:
      "Use a controlled range that is comfortable for the knees.",
    commonMistakes:
      "Using excessive weight or dropping the resistance quickly.",
    beginnerNotes:
      "Use moderate resistance and prioritize controlled repetitions.",
    muscles: [
      { name: "Quadriceps", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Leg Extension", isRequired: true },
    ],
    imageFile: "/exercises/leg-extension.webp",
  },

  {
    name: "Leg Press",
    category: "Legs",
    movementType: "Compound Leg Press",
    difficultyLevel: "Beginner",
    description:
      "A machine-based compound lower-body exercise targeting the quadriceps and glutes.",
    instructions:
      "Position your feet securely on the platform and adjust the machine. Lower the platform under control while maintaining stable knee and hip alignment, then press it away.",
    breathingGuidance:
      "Inhale during the lowering phase and exhale while pressing.",
    rangeOfMotion:
      "Lower through a comfortable range without allowing the pelvis or lower back to lose stable contact.",
    commonMistakes:
      "Lowering excessively, allowing the knees to collapse inward, or locking the knees aggressively.",
    beginnerNotes:
      "Learn the machine setup and use a controlled range before increasing resistance.",
    muscles: [
      { name: "Quadriceps", role: "PRIMARY" },
      { name: "Glutes", role: "PRIMARY" },
      { name: "Hamstrings", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Leg Press", isRequired: true },
    ],
    imageFile: "/exercises/leg-press.webp",
  },

  {
    name: "Leg Curl",
    category: "Legs",
    movementType: "Knee Flexion",
    difficultyLevel: "Beginner",
    description:
      "A machine isolation exercise primarily targeting the hamstrings.",
    instructions:
      "Adjust the machine so the knee aligns with the pivot. Curl the pad toward the body under control, then slowly return.",
    breathingGuidance:
      "Exhale while curling and inhale while returning.",
    rangeOfMotion:
      "Use a comfortable controlled knee-flexion range.",
    commonMistakes:
      "Using excessive weight or allowing the resistance to drop quickly.",
    beginnerNotes:
      "Focus on the hamstrings rather than moving the hips.",
    muscles: [
      { name: "Hamstrings", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Leg Curl", isRequired: true },
    ],
    imageFile: "/exercises/leg-curl.webp",
  },

  {
    name: "Seated Calf Raise",
    category: "Legs",
    movementType: "Plantar Flexion",
    difficultyLevel: "Beginner",
    description:
      "A seated calf exercise emphasizing the calf muscles.",
    instructions:
      "Position the feet securely on the platform and place the resistance comfortably. Lower the heels under control, then press through the balls of the feet to raise them.",
    breathingGuidance:
      "Exhale while raising the heels and inhale while lowering.",
    rangeOfMotion:
      "Use a controlled stretch and contraction without bouncing.",
    commonMistakes:
      "Bouncing the heels or using excessive resistance.",
    beginnerNotes:
      "Use slow controlled repetitions.",
    muscles: [
      { name: "Calves", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Seated Calf Raise", isRequired: true },
    ],
    imageFile: "/exercises/seated-calf-raise.webp",
  },

  {
    name: "Romanian Deadlift",
    category: "Legs",
    movementType: "Hip Hinge",
    difficultyLevel: "Intermediate",
    description:
      "A hip-hinge exercise emphasizing the hamstrings and glutes.",
    instructions:
      "Hold the bar or dumbbells close to the body. Push the hips backward while maintaining a stable spine and slight knee bend, lower until a comfortable hamstring stretch is felt, then drive the hips forward.",
    breathingGuidance:
      "Inhale while lowering and brace the torso. Exhale while returning to standing.",
    rangeOfMotion:
      "Lower only as far as the hips can move back while maintaining stable spinal position.",
    commonMistakes:
      "Rounding the back, bending the knees excessively, or moving the weight away from the body.",
    beginnerNotes:
      "Master the hip hinge with light weight before progressing.",
    muscles: [
      { name: "Hamstrings", role: "PRIMARY" },
      { name: "Glutes", role: "PRIMARY" },
      { name: "Lower Back", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Barbell", isRequired: true },
    ],
    imageFile: "/exercises/romanian-deadlift.webp",
  },

  {
    name: "Bulgarian Split Squat",
    category: "Legs",
    movementType: "Unilateral Squat",
    difficultyLevel: "Intermediate",
    description:
      "A unilateral squat variation emphasizing the quadriceps and glutes.",
    instructions:
      "Place the rear foot on a stable bench or support. Lower the body by bending the front knee and hip, then drive through the front foot to stand.",
    breathingGuidance:
      "Inhale while lowering and exhale while standing.",
    rangeOfMotion:
      "Use a comfortable depth while maintaining front-knee and torso control.",
    commonMistakes:
      "Losing balance, allowing the knee to collapse inward, or using excessive weight.",
    beginnerNotes:
      "Start with bodyweight until balance and control are comfortable.",
    muscles: [
      { name: "Quadriceps", role: "PRIMARY" },
      { name: "Glutes", role: "PRIMARY" },
      { name: "Hamstrings", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Bench Press", isRequired: true },
      { name: "Dumbbells", isRequired: false },
    ],
    imageFile: "/exercises/bulgarian-split-squat.webp",
  },

  {
    name: "Goblet Squat",
    category: "Legs",
    movementType: "Squat",
    difficultyLevel: "Beginner",
    description:
      "A beginner-friendly squat variation using a dumbbell or kettlebell held in front of the body.",
    instructions:
      "Hold the weight close to the chest. Squat down while keeping the torso controlled and knees tracking with the feet, then stand.",
    breathingGuidance:
      "Inhale while lowering and exhale while standing.",
    rangeOfMotion:
      "Squat through a comfortable depth while maintaining balance.",
    commonMistakes:
      "Rounding the torso or allowing the knees to collapse inward.",
    beginnerNotes:
      "A good option for learning the squat pattern before heavier loading.",
    muscles: [
      { name: "Quadriceps", role: "PRIMARY" },
      { name: "Glutes", role: "PRIMARY" },
      { name: "Core", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/goblet-squat.webp",
  },

  {
    name: "Walking Lunges",
    category: "Legs",
    movementType: "Unilateral Squat",
    difficultyLevel: "Beginner",
    description:
      "A dynamic unilateral leg exercise performed while moving forward.",
    instructions:
      "Step forward into a controlled lunge, lower the body, push through the front foot, and continue with the opposite leg.",
    breathingGuidance:
      "Inhale while lowering and exhale while stepping upward.",
    rangeOfMotion:
      "Use a comfortable lunge depth while maintaining balance and knee control.",
    commonMistakes:
      "Taking unstable steps or allowing the knees to collapse inward.",
    beginnerNotes:
      "Start with bodyweight before adding dumbbells.",
    muscles: [
      { name: "Quadriceps", role: "PRIMARY" },
      { name: "Glutes", role: "PRIMARY" },
      { name: "Hamstrings", role: "SECONDARY" },
    ],
    equipment: [],
    imageFile: "/exercises/walking-lunges.webp",
  },

  {
    name: "Standing Calf Raise",
    category: "Legs",
    movementType: "Plantar Flexion",
    difficultyLevel: "Beginner",
    description:
      "A standing calf exercise targeting the lower-leg muscles.",
    instructions:
      "Stand securely with the feet positioned comfortably. Raise the heels while pressing through the balls of the feet, pause briefly, then lower under control.",
    breathingGuidance:
      "Exhale while raising and inhale while lowering.",
    rangeOfMotion:
      "Use a controlled stretch and contraction without bouncing.",
    commonMistakes:
      "Bouncing or using excessive resistance.",
    beginnerNotes:
      "Use slow repetitions and maintain balance.",
    muscles: [
      { name: "Calves", role: "PRIMARY" },
    ],
    equipment: [],
    imageFile: "/exercises/standing-calf-raise.webp",
  },

  {
    name: "Hip Thrust / Glute Bridge",
    category: "Legs",
    movementType: "Hip Extension",
    difficultyLevel: "Beginner",
    description:
      "A hip-extension movement primarily targeting the glutes.",
    instructions:
      "Position the upper back securely against a bench if performing a hip thrust. Drive through the feet and extend the hips until the torso and thighs form a controlled line, then lower.",
    breathingGuidance:
      "Exhale while extending the hips and inhale while lowering.",
    rangeOfMotion:
      "Extend the hips comfortably without excessive lower-back arching.",
    commonMistakes:
      "Overarching the lower back or using momentum.",
    beginnerNotes:
      "Start with bodyweight or light resistance.",
    muscles: [
      { name: "Glutes", role: "PRIMARY" },
      { name: "Hamstrings", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Bench Press", isRequired: false },
      { name: "Barbell", isRequired: false },
    ],
    imageFile: "/exercises/hip-thrust-glute-bridge.webp",
  },

  // ============================================================
  // CORE
  // ============================================================

  {
    name: "Ab Coaster",
    category: "Core",
    movementType: "Trunk Flexion",
    difficultyLevel: "Beginner",
    description:
      "A machine-based abdominal exercise using controlled trunk and hip movement.",
    instructions:
      "Position yourself securely on the machine. Brace the core and bring the knees or platform upward under control, then return slowly.",
    breathingGuidance:
      "Exhale during the contraction and inhale during the return.",
    rangeOfMotion:
      "Use a comfortable controlled range without swinging.",
    commonMistakes:
      "Using momentum or relying excessively on the hip flexors.",
    beginnerNotes:
      "Move slowly and focus on abdominal control.",
    muscles: [
      { name: "Core", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Ab Coaster", isRequired: true },
    ],
    imageFile: "/exercises/ab-coaster.webp",
  },

  {
    name: "Decline Crunch",
    category: "Core",
    movementType: "Trunk Flexion",
    difficultyLevel: "Beginner",
    description:
      "A decline abdominal crunch emphasizing controlled trunk flexion.",
    instructions:
      "Secure your feet and lie on the decline bench. Brace the abdomen and curl the upper torso upward, then return under control.",
    breathingGuidance:
      "Exhale during the crunch and inhale while lowering.",
    rangeOfMotion:
      "Curl the torso comfortably without pulling on the neck.",
    commonMistakes:
      "Using the neck to pull upward or moving too quickly.",
    beginnerNotes:
      "Keep the movement controlled.",
    muscles: [
      { name: "Core", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Bench Press", isRequired: true },
    ],
    imageFile: "/exercises/decline-crunch.webp",
  },

  {
    name: "Ab King Pro",
    category: "Core",
    movementType: "Trunk Flexion",
    difficultyLevel: "Beginner",
    description:
      "A supported abdominal crunch movement.",
    instructions:
      "Position yourself securely on the equipment. Brace the abdomen and perform controlled trunk flexion, then return slowly.",
    breathingGuidance:
      "Exhale during the contraction and inhale during the return.",
    rangeOfMotion:
      "Use a comfortable controlled range.",
    commonMistakes:
      "Using momentum or pulling with the neck.",
    beginnerNotes:
      "Focus on the abdominal contraction.",
    muscles: [
      { name: "Core", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Ab King Pro", isRequired: true },
    ],
    imageFile: "/exercises/ab-king-pro.webp",
  },

  {
    name: "Ab Core",
    category: "Core",
    movementType: "Trunk Flexion",
    difficultyLevel: "Beginner",
    description:
      "A machine-based abdominal exercise.",
    instructions:
      "Adjust the equipment and brace the abdomen. Perform controlled trunk flexion and return slowly.",
    breathingGuidance:
      "Exhale during the contraction and inhale during the return.",
    rangeOfMotion:
      "Use a comfortable controlled range.",
    commonMistakes:
      "Using momentum or excessive resistance.",
    beginnerNotes:
      "Prioritize controlled movement.",
    muscles: [
      { name: "Core", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Ab Core", isRequired: true },
    ],
    imageFile: "/exercises/ab-core.webp",
  },

  {
    name: "Double Side Twist",
    category: "Core",
    movementType: "Trunk Rotation",
    difficultyLevel: "Beginner",
    description:
      "A rotational abdominal movement targeting the trunk.",
    instructions:
      "Sit or stand securely according to the equipment. Brace the abdomen and rotate the torso under control from side to side.",
    breathingGuidance:
      "Exhale during each controlled rotation and inhale during the return.",
    rangeOfMotion:
      "Rotate through a comfortable range without forcing the spine.",
    commonMistakes:
      "Using momentum or rotating aggressively.",
    beginnerNotes:
      "Keep the movement controlled.",
    muscles: [
      { name: "Core", role: "PRIMARY" },
    ],
    equipment: [],
    imageFile: "/exercises/double-side-twist.webp",
  },

  {
    name: "Dumbbell Bend",
    category: "Core",
    movementType: "Lateral Flexion",
    difficultyLevel: "Beginner",
    description:
      "A dumbbell-loaded lateral flexion exercise for the trunk.",
    instructions:
      "Hold a dumbbell at one side. Bend the torso slightly toward the weight under control, then return to the upright position.",
    breathingGuidance:
      "Exhale while returning upright and inhale during the controlled lowering.",
    rangeOfMotion:
      "Use a small controlled range without forcing the spine.",
    commonMistakes:
      "Using excessive weight or moving too quickly.",
    beginnerNotes:
      "Use light resistance.",
    muscles: [
      { name: "Core", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/dumbbell-bend.webp",
  },

  {
    name: "Heel Touch",
    category: "Core",
    movementType: "Lateral Trunk Flexion",
    difficultyLevel: "Beginner",
    description:
      "A bodyweight abdominal exercise involving controlled side-to-side trunk movement.",
    instructions:
      "Lie on your back with the knees bent. Curl the upper torso slightly and reach toward one heel, then alternate sides.",
    breathingGuidance:
      "Exhale as you reach and inhale between repetitions.",
    rangeOfMotion:
      "Use a controlled range without pulling the neck.",
    commonMistakes:
      "Using excessive momentum or lifting the torso too high.",
    beginnerNotes:
      "Keep the movement slow.",
    muscles: [
      { name: "Core", role: "PRIMARY" },
    ],
    equipment: [],
    imageFile: "/exercises/heel-touch.webp",
  },

  {
    name: "Hip-Flexor Leg Raise",
    category: "Core",
    movementType: "Hip Flexion",
    difficultyLevel: "Intermediate",
    description:
      "A leg-raising movement involving the abdominal and hip-flexor musculature.",
    instructions:
      "Position yourself securely and brace the core. Raise the legs under control without swinging, then lower slowly.",
    breathingGuidance:
      "Exhale while raising the legs and inhale while lowering.",
    rangeOfMotion:
      "Use a controlled range while keeping the torso stable.",
    commonMistakes:
      "Swinging the legs or arching the lower back excessively.",
    beginnerNotes:
      "Reduce the range if maintaining core control is difficult.",
    muscles: [
      { name: "Core", role: "PRIMARY" },
    ],
    equipment: [],
    imageFile: "/exercises/hip-flexor-leg-raise.webp",
  },

  {
    name: "Lying Leg Raise",
    category: "Core",
    movementType: "Hip Flexion",
    difficultyLevel: "Beginner",
    description:
      "A lying leg-raise exercise that challenges the abdominal and hip-flexor muscles.",
    instructions:
      "Lie on your back and brace the abdomen. Raise the legs under control, then lower them without allowing the lower back to lose control.",
    breathingGuidance:
      "Exhale while raising and inhale while lowering.",
    rangeOfMotion:
      "Lower only as far as you can maintain control of the lower back.",
    commonMistakes:
      "Swinging the legs or allowing the lower back to arch excessively.",
    beginnerNotes:
      "Bend the knees slightly if straight-leg raises are too difficult.",
    muscles: [
      { name: "Core", role: "PRIMARY" },
    ],
    equipment: [],
    imageFile: "/exercises/lying-leg-raise.webp",
  },

  {
    name: "Alternate Leg Raise",
    category: "Core",
    movementType: "Hip Flexion",
    difficultyLevel: "Beginner",
    description:
      "An alternating leg-raise variation for controlled abdominal training.",
    instructions:
      "Lie on your back and brace the core. Raise one leg while keeping the other controlled, then alternate.",
    breathingGuidance:
      "Exhale while raising and inhale while lowering.",
    rangeOfMotion:
      "Use a range that allows the lower back to remain controlled.",
    commonMistakes:
      "Arching the lower back or moving too quickly.",
    beginnerNotes:
      "Keep the movement slow.",
    muscles: [
      { name: "Core", role: "PRIMARY" },
    ],
    equipment: [],
    imageFile: "/exercises/alternate-leg-raise.webp",
  },

  {
    name: "Cross-Leg Raise",
    category: "Core",
    movementType: "Hip Flexion",
    difficultyLevel: "Intermediate",
    description:
      "A controlled leg-raise variation involving the trunk and hip musculature.",
    instructions:
      "Lie securely and brace the abdomen. Raise the crossed legs under control and return slowly.",
    breathingGuidance:
      "Exhale during the raise and inhale during the lowering phase.",
    rangeOfMotion:
      "Use a controlled range that does not force the lower back.",
    commonMistakes:
      "Swinging the legs or losing abdominal control.",
    beginnerNotes:
      "Use a smaller range if needed.",
    muscles: [
      { name: "Core", role: "PRIMARY" },
    ],
    equipment: [],
    imageFile: "/exercises/cross-leg-raise.webp",
  },

  {
    name: "Side Plank",
    category: "Core",
    movementType: "Isometric Lateral Stability",
    difficultyLevel: "Beginner",
    description:
      "An isometric core exercise emphasizing lateral trunk stability.",
    instructions:
      "Support the body on one forearm and the side of the foot. Keep the body aligned and brace the abdomen while holding the position.",
    breathingGuidance:
      "Breathe slowly and continuously while maintaining the brace.",
    rangeOfMotion:
      "Hold a stable position without allowing the hips to sag.",
    commonMistakes:
      "Allowing the hips to drop or rotating the torso.",
    beginnerNotes:
      "Use a knee-supported version if needed.",
    muscles: [
      { name: "Core", role: "PRIMARY" },
    ],
    equipment: [],
    imageFile: "/exercises/side-plank.webp",
  },

  {
    name: "Plank",
    category: "Core",
    movementType: "Isometric Stability",
    difficultyLevel: "Beginner",
    description:
      "An isometric core exercise that develops trunk stability.",
    instructions:
      "Support the body on the forearms and toes. Brace the abdomen and maintain a straight body position.",
    breathingGuidance:
      "Breathe slowly and continuously while maintaining the brace.",
    rangeOfMotion:
      "Maintain a stable position without excessive movement.",
    commonMistakes:
      "Sagging the hips or raising them excessively.",
    beginnerNotes:
      "Start with short holds and gradually increase duration.",
    muscles: [
      { name: "Core", role: "PRIMARY" },
    ],
    equipment: [],
    imageFile: "/exercises/plank.webp",
  },

  {
    name: "Cable Crunch",
    category: "Core",
    movementType: "Loaded Trunk Flexion",
    difficultyLevel: "Beginner",
    description:
      "A cable-based abdominal crunch with adjustable resistance.",
    instructions:
      "Kneel facing the cable station while holding the rope. Brace the abdomen and curl the torso downward, then return slowly.",
    breathingGuidance:
      "Exhale during the crunch and inhale during the return.",
    rangeOfMotion:
      "Use controlled trunk flexion without simply pulling the rope with the arms.",
    commonMistakes:
      "Moving primarily through the hips or arms.",
    beginnerNotes:
      "Start with light resistance.",
    muscles: [
      { name: "Core", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/cable-crunch.webp",
  },

  {
    name: "Pallof Press",
    category: "Core",
    movementType: "Anti-Rotation",
    difficultyLevel: "Beginner",
    description:
      "A cable anti-rotation exercise that trains trunk stability.",
    instructions:
      "Stand sideways to the cable station and hold the handle near the chest. Brace the core and press the handle away without allowing the torso to rotate.",
    breathingGuidance:
      "Exhale while pressing and inhale while returning.",
    rangeOfMotion:
      "Press the handle forward while maintaining a stable torso.",
    commonMistakes:
      "Rotating toward the cable or using excessive resistance.",
    beginnerNotes:
      "Use light resistance and focus on resisting rotation.",
    muscles: [
      { name: "Core", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/pallof-press.webp",
  },

  {
    name: "Cable Woodchop",
    category: "Core",
    movementType: "Trunk Rotation",
    difficultyLevel: "Intermediate",
    description:
      "A cable rotational movement training the trunk through controlled rotation.",
    instructions:
      "Stand beside the cable station and hold the handle. Brace the core and rotate the torso in a controlled diagonal movement, then return slowly.",
    breathingGuidance:
      "Exhale during the rotation and inhale during the return.",
    rangeOfMotion:
      "Rotate through a controlled comfortable range.",
    commonMistakes:
      "Using excessive momentum or rotating aggressively.",
    beginnerNotes:
      "Use light resistance until you can control the movement.",
    muscles: [
      { name: "Core", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/cable-woodchop.webp",
  },

  {
    name: "Cable Reverse Crunch",
    category: "Core",
    movementType: "Trunk Flexion",
    difficultyLevel: "Intermediate",
    description:
      "A cable-assisted reverse crunch emphasizing controlled abdominal contraction.",
    instructions:
      "Position yourself securely with the cable attachment. Brace the abdomen and bring the pelvis and knees toward the torso under control, then return slowly.",
    breathingGuidance:
      "Exhale during the contraction and inhale while returning.",
    rangeOfMotion:
      "Use a controlled range without swinging the legs.",
    commonMistakes:
      "Using momentum or pulling excessively with the hips.",
    beginnerNotes:
      "Use light resistance and prioritize abdominal control.",
    muscles: [
      { name: "Core", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/cable-reverse-crunch.webp",
  },

  // ============================================================
  // TRAPS
  // ============================================================

  {
    name: "Dumbbell Shrugs",
    category: "Traps",
    movementType: "Scapular Elevation",
    difficultyLevel: "Beginner",
    description:
      "A dumbbell shrug primarily targeting the upper trapezius.",
    instructions:
      "Hold the dumbbells at your sides and elevate the shoulders upward in a controlled manner. Pause briefly and lower slowly.",
    breathingGuidance:
      "Exhale while shrugging and inhale while lowering.",
    rangeOfMotion:
      "Use a comfortable vertical shoulder movement.",
    commonMistakes:
      "Rolling the shoulders or using momentum.",
    beginnerNotes:
      "Focus on controlled upward and downward movement.",
    muscles: [
      { name: "Traps", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/dumbbell-shrugs.webp",
  },

  {
    name: "Upright Row",
    category: "Traps",
    movementType: "Shoulder Abduction",
    difficultyLevel: "Intermediate",
    description:
      "A pulling movement that trains the upper traps and shoulders.",
    instructions:
      "Hold the weight in front of the body and pull the elbows upward in a controlled motion, then lower slowly.",
    breathingGuidance:
      "Exhale while pulling and inhale while lowering.",
    rangeOfMotion:
      "Use a comfortable range without forcing the shoulders.",
    commonMistakes:
      "Using excessive weight or pulling the elbows excessively high.",
    beginnerNotes:
      "Use manageable resistance.",
    muscles: [
      { name: "Traps", role: "PRIMARY" },
      { name: "Side Delts", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/upright-row.webp",
  },

  {
    name: "Barbell Row",
    category: "Traps",
    movementType: "Horizontal Pull",
    difficultyLevel: "Intermediate",
    description:
      "A compound rowing movement involving the upper back and trapezius muscles.",
    instructions:
      "Hinge at the hips with a stable torso. Pull the bar toward the lower torso while driving the elbows backward, then lower under control.",
    breathingGuidance:
      "Inhale before pulling and exhale during the row.",
    rangeOfMotion:
      "Use a controlled rowing range while maintaining the hip hinge.",
    commonMistakes:
      "Rounding the back or using excessive momentum.",
    beginnerNotes:
      "Master the movement with manageable weight.",
    muscles: [
      { name: "Upper Back", role: "PRIMARY" },
      { name: "Traps", role: "SECONDARY" },
      { name: "Latissimus Dorsi", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Barbell", isRequired: true },
    ],
    imageFile: "/exercises/barbell-row.webp",
  },

  {
    name: "Dumbbell Row",
    category: "Traps",
    movementType: "Horizontal Pull",
    difficultyLevel: "Beginner",
    description:
      "A unilateral rowing movement involving the upper back and trapezius.",
    instructions:
      "Support the torso on a stable bench or stance. Pull the dumbbell toward the torso while keeping the shoulder controlled, then lower slowly.",
    breathingGuidance:
      "Exhale while pulling and inhale while lowering.",
    rangeOfMotion:
      "Use a controlled range without rotating the torso.",
    commonMistakes:
      "Twisting the body or shrugging excessively.",
    beginnerNotes:
      "Use manageable weight and focus on control.",
    muscles: [
      { name: "Upper Back", role: "PRIMARY" },
      { name: "Traps", role: "SECONDARY" },
      { name: "Latissimus Dorsi", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/dumbbell-row.webp",
  },

  {
    name: "Face Pull",
    category: "Traps",
    movementType: "Horizontal Pull",
    difficultyLevel: "Beginner",
    description:
      "A cable movement involving the rear delts, upper back and trapezius.",
    instructions:
      "Pull the rope toward the face while keeping the shoulders controlled, then return slowly.",
    breathingGuidance:
      "Exhale while pulling and inhale while returning.",
    rangeOfMotion:
      "Use a comfortable controlled range.",
    commonMistakes:
      "Using excessive resistance or shrugging.",
    beginnerNotes:
      "Keep the weight light and prioritize control.",
    muscles: [
      { name: "Rear Delts", role: "PRIMARY" },
      { name: "Traps", role: "SECONDARY" },
      { name: "Upper Back", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/face-pull.webp",
  },

  {
    name: "Seated Row",
    category: "Traps",
    movementType: "Horizontal Pull",
    difficultyLevel: "Beginner",
    description:
      "A seated rowing movement involving the upper back and trapezius.",
    instructions:
      "Sit securely and pull the handle toward the torso while keeping the shoulders controlled. Return slowly.",
    breathingGuidance:
      "Exhale while pulling and inhale while returning.",
    rangeOfMotion:
      "Use a controlled range without excessive torso movement.",
    commonMistakes:
      "Rounding the back or shrugging excessively.",
    beginnerNotes:
      "Keep the torso stable.",
    muscles: [
      { name: "Upper Back", role: "PRIMARY" },
      { name: "Traps", role: "SECONDARY" },
      { name: "Biceps", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Cable Station", isRequired: true },
    ],
    imageFile: "/exercises/seated-row.webp",
  },

  // ============================================================
  // FOREARMS
  // ============================================================

  {
    name: "Wrist Curl",
    category: "Forearms",
    movementType: "Wrist Flexion",
    difficultyLevel: "Beginner",
    description:
      "A wrist-flexion exercise targeting the forearm muscles.",
    instructions:
      "Rest the forearms securely and hold the weight. Allow the wrists to extend slightly, then curl the hands upward using controlled wrist movement.",
    breathingGuidance:
      "Breathe normally throughout the controlled repetitions.",
    rangeOfMotion:
      "Use a comfortable wrist range without forcing the joints.",
    commonMistakes:
      "Using excessive weight or moving the entire forearm.",
    beginnerNotes:
      "Use light resistance.",
    muscles: [
      { name: "Forearms", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Barbell", isRequired: true },
    ],
    imageFile: "/exercises/wrist-curl.webp",
  },

  {
    name: "Wrist Curl Variation",
    category: "Forearms",
    movementType: "Wrist Flexion",
    difficultyLevel: "Beginner",
    description:
      "A variation of the wrist curl for additional forearm training.",
    instructions:
      "Position the forearms securely and perform controlled wrist flexion and extension with the chosen resistance.",
    breathingGuidance:
      "Breathe normally throughout the movement.",
    rangeOfMotion:
      "Use a comfortable controlled wrist range.",
    commonMistakes:
      "Using excessive weight or rushing the repetitions.",
    beginnerNotes:
      "Prioritize controlled movement.",
    muscles: [
      { name: "Forearms", role: "PRIMARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/wrist-curl-variation.webp",
  },

  {
    name: "Hammer Curl",
    category: "Forearms",
    movementType: "Elbow Flexion",
    difficultyLevel: "Beginner",
    description:
      "A neutral-grip curl that trains the biceps and forearms.",
    instructions:
      "Hold the dumbbells with neutral palms and curl them upward while keeping the elbows controlled.",
    breathingGuidance:
      "Exhale while curling and inhale while lowering.",
    rangeOfMotion:
      "Use a controlled curl range.",
    commonMistakes:
      "Swinging or using excessive weight.",
    beginnerNotes:
      "Use manageable dumbbells.",
    muscles: [
      { name: "Forearms", role: "PRIMARY" },
      { name: "Biceps", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/hammer-curl.webp",
  },

  {
    name: "Deadlift",
    category: "Forearms",
    movementType: "Grip and Hip Hinge",
    difficultyLevel: "Intermediate",
    description:
      "A compound lift that heavily challenges grip and forearm endurance.",
    instructions:
      "Perform the deadlift using a stable setup, maintaining a secure grip throughout the movement.",
    breathingGuidance:
      "Brace before lifting and exhale through the demanding portion.",
    rangeOfMotion:
      "Lift from the floor to a stable standing position.",
    commonMistakes:
      "Losing grip, rounding the back, or using excessive weight.",
    beginnerNotes:
      "Develop technique before prioritizing heavy loads.",
    muscles: [
      { name: "Forearms", role: "PRIMARY" },
      { name: "Glutes", role: "SECONDARY" },
      { name: "Hamstrings", role: "SECONDARY" },
      { name: "Lower Back", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Barbell", isRequired: true },
    ],
    imageFile: "/exercises/deadlift.webp",
  },

  {
    name: "Rows",
    category: "Forearms",
    movementType: "Horizontal Pull",
    difficultyLevel: "Beginner",
    description:
      "Rowing movements that require sustained grip and forearm involvement.",
    instructions:
      "Perform a controlled rowing movement while maintaining a secure grip and stable torso.",
    breathingGuidance:
      "Exhale during the pulling phase and inhale during the return.",
    rangeOfMotion:
      "Use a controlled range appropriate to the row variation.",
    commonMistakes:
      "Using excessive momentum or losing grip control.",
    beginnerNotes:
      "Use manageable resistance.",
    muscles: [
      { name: "Forearms", role: "PRIMARY" },
      { name: "Upper Back", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/rows.webp",
  },

  // ============================================================
  // LOWER BACK / POSTERIOR CHAIN
  // ============================================================

  {
    name: "Deadlift",
    category: "Lower Back",
    movementType: "Hip Hinge",
    difficultyLevel: "Intermediate",
    description:
      "A compound hip-hinge exercise involving the posterior chain and trunk.",
    instructions:
      "Set up with the bar over the mid-foot. Brace the torso, hinge and bend the knees to reach the bar, then drive through the floor while keeping the bar close.",
    breathingGuidance:
      "Brace before lifting and exhale through the hardest portion.",
    rangeOfMotion:
      "Lift from the floor to an upright standing position while maintaining control.",
    commonMistakes:
      "Rounding the back, jerking the bar, or allowing it to drift away from the body.",
    beginnerNotes:
      "Learn the hip hinge and setup before heavy loading.",
    muscles: [
      { name: "Glutes", role: "PRIMARY" },
      { name: "Hamstrings", role: "PRIMARY" },
      { name: "Lower Back", role: "SECONDARY" },
      { name: "Upper Back", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Barbell", isRequired: true },
    ],
    imageFile: "/exercises/deadlift.webp",
  },

  {
    name: "Barbell Squat",
    category: "Lower Back",
    movementType: "Squat",
    difficultyLevel: "Intermediate",
    description:
      "A compound squat requiring significant trunk and lower-back stabilization.",
    instructions:
      "Position the bar securely, brace the torso, squat under control, and return to standing while maintaining stable alignment.",
    breathingGuidance:
      "Brace before descending and exhale while standing.",
    rangeOfMotion:
      "Use a controlled depth that allows stable posture.",
    commonMistakes:
      "Losing trunk stability or using excessive weight.",
    beginnerNotes:
      "Build the squat pattern before heavy loading.",
    muscles: [
      { name: "Quadriceps", role: "PRIMARY" },
      { name: "Glutes", role: "PRIMARY" },
      { name: "Core", role: "SECONDARY" },
      { name: "Lower Back", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Barbell", isRequired: true },
    ],
    imageFile: "/exercises/barbell-squat.webp",
  },

  {
    name: "Barbell Row",
    category: "Lower Back",
    movementType: "Horizontal Pull",
    difficultyLevel: "Intermediate",
    description:
      "A rowing movement that requires the lower back to stabilize the torso during the hip hinge.",
    instructions:
      "Hinge at the hips with a stable spine, row the bar toward the torso, then lower under control.",
    breathingGuidance:
      "Brace before pulling and exhale during the row.",
    rangeOfMotion:
      "Maintain the hip-hinge position throughout the set.",
    commonMistakes:
      "Rounding the spine or using excessive torso movement.",
    beginnerNotes:
      "Use manageable weight and learn the hinge position.",
    muscles: [
      { name: "Upper Back", role: "PRIMARY" },
      { name: "Lower Back", role: "SECONDARY" },
      { name: "Latissimus Dorsi", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Barbell", isRequired: true },
    ],
    imageFile: "/exercises/barbell-row.webp",
  },

  {
    name: "Dumbbell Row",
    category: "Lower Back",
    movementType: "Horizontal Pull",
    difficultyLevel: "Beginner",
    description:
      "A unilateral row requiring trunk stability.",
    instructions:
      "Support yourself on a bench or stable stance and maintain a controlled torso position while rowing the dumbbell.",
    breathingGuidance:
      "Exhale while pulling and inhale while lowering.",
    rangeOfMotion:
      "Use a controlled range while keeping the torso stable.",
    commonMistakes:
      "Rotating the torso or losing spinal control.",
    beginnerNotes:
      "Use light-to-moderate weight.",
    muscles: [
      { name: "Latissimus Dorsi", role: "PRIMARY" },
      { name: "Upper Back", role: "SECONDARY" },
      { name: "Lower Back", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Dumbbells", isRequired: true },
    ],
    imageFile: "/exercises/dumbbell-row.webp",
  },

  {
    name: "Romanian Deadlift",
    category: "Lower Back",
    movementType: "Hip Hinge",
    difficultyLevel: "Intermediate",
    description:
      "A controlled hip-hinge movement involving the hamstrings, glutes and trunk stabilizers.",
    instructions:
      "Hold the weight close to the body, push the hips backward while maintaining a stable spine, then drive the hips forward to return.",
    breathingGuidance:
      "Inhale while lowering and exhale while returning.",
    rangeOfMotion:
      "Lower only as far as the hips can move back while maintaining spinal control.",
    commonMistakes:
      "Rounding the back or turning the movement into a squat.",
    beginnerNotes:
      "Learn the hinge with light resistance.",
    muscles: [
      { name: "Hamstrings", role: "PRIMARY" },
      { name: "Glutes", role: "PRIMARY" },
      { name: "Lower Back", role: "SECONDARY" },
    ],
    equipment: [
      { name: "Barbell", isRequired: true },
    ],
    imageFile: "/exercises/romanian-deadlift.webp",
  },

  {
    name: "Hip Thrust / Glute Bridge",
    category: "Lower Back",
    movementType: "Hip Extension",
    difficultyLevel: "Beginner",
    description:
      "A hip-extension movement that trains the glutes and posterior chain.",
    instructions:
      "Position yourself securely and drive through the feet to extend the hips. Keep the ribs and pelvis controlled and lower slowly.",
    breathingGuidance:
      "Exhale while extending the hips and inhale while lowering.",
    rangeOfMotion:
      "Extend the hips comfortably without excessive lower-back arching.",
    commonMistakes:
      "Overarching the lower back or using momentum.",
    beginnerNotes:
      "Start with bodyweight and add resistance gradually.",
    muscles: [
      { name: "Glutes", role: "PRIMARY" },
      { name: "Hamstrings", role: "SECONDARY" },
      { name: "Lower Back", role: "SECONDARY" },
    ],
    equipment: [],
    imageFile: "/exercises/hip-thrust-glute-bridge.webp",
  },
];