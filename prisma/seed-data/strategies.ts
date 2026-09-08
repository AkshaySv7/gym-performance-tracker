import { StrategyType } from "../../src/generated/prisma/client";

export const strategies = [
  {
    name: "Full Body",
    strategyType: StrategyType.FULL_BODY,
    description:
      "Train major muscle groups within each workout session.",
  },
  {
    name: "Upper / Lower",
    strategyType: StrategyType.UPPER_LOWER,
    description:
      "Alternate between upper-body and lower-body training sessions.",
  },
  {
    name: "Push / Pull / Legs",
    strategyType: StrategyType.PUSH_PULL_LEGS,
    description:
      "Organize training around pushing, pulling, and leg-focused sessions.",
  },
  {
    name: "Body-Part Split",
    strategyType: StrategyType.BODY_PART_SPLIT,
    description:
      "Organize training around individual or grouped muscle areas.",
  },
];