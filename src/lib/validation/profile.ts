import { z } from "zod";

export const profileSchema = z.object({
  displayName: z
    .string()
    .min(1)
    .max(100),

  experienceLevel: z.enum([
    "BEGINNER",
    "INTERMEDIATE",
    "ADVANCED",
  ]),

  primaryGoal: z
    .string()
    .min(1)
    .max(200),

  typicalWorkoutDuration: z
    .number()
    .int()
    .min(10)
    .max(300),

  preferredTrainingDays: z
    .number()
    .int()
    .min(1)
    .max(7),

  preferredVariety: z
    .string()
    .max(100)
    .optional(),

  preferredScheduleType: z
    .string()
    .max(100)
    .optional(),
});