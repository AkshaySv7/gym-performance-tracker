export type ProgressRange =
  | "4w"
  | "3m"
  | "6m"
  | "all";

export type ProgressSet = {
  id: string;
  setNumber: number;
  weight: number | null;
  repetitions: number | null;
};

export type ExercisePerformance = {
  workoutId: string;
  workoutDate: string;
  completedAt: string;
  exerciseId: string;
  exerciseName: string;
  sets: ProgressSet[];
  totalVolume: number;
  maxWeight: number | null;
  maxRepetitions: number | null;
};

export type ExerciseProgressSummary = {
  exerciseId: string;
  exerciseName: string;
  workoutCount: number;
  totalSets: number;
  totalVolume: number;
  bestVolume: number | null;
  bestWeight: number | null;
  bestRepetitions: number | null;
  firstWorkoutDate: string | null;
  latestWorkoutDate: string | null;
};

export type PersonalRecord = {
  exerciseId: string;
  exerciseName: string;
  recordType:
    | "WEIGHT"
    | "REPETITIONS"
    | "VOLUME";
  value: number;
  workoutDate: string;
};

export type WorkoutFrequency = {
  periodStart: string;
  periodEnd: string;
  workoutCount: number;
};

export type ProgressOverview = {
  completedWorkoutCount: number;
  totalExerciseSets: number;
  totalVolume: number;
  personalRecords: PersonalRecord[];
  frequency: WorkoutFrequency[];
};

export type ExerciseProgressResponse = {
  exercise: {
    id: string;
    name: string;
  };
  summary: {
    workoutCount: number;
    bestWeight: number | null;
    bestRepetitions: number | null;
    totalVolume: number;
  };
  history: ExercisePerformance[];
  previousSession: ExercisePerformance | null;
};