import { z } from "zod";

// Habit validation schemas
export const createHabitSchema = z.object({
    name: z.string().min(1).max(50),
    costPerOccurrence: z.number().positive().finite(),
    frequency: z.enum(["daily", "weekly", "monthly"]).default("daily"),
    category: z
        .enum(["food", "transport", "digital", "smoking", "other"])
        .default("other"),
});

export const updateHabitSchema = createHabitSchema.partial();

// Reward validation schemas
export const createRewardSchema = z.object({
    name: z.string().min(1).max(100),
    price: z.number().positive().finite(),
    imageUrl: z.string().url().optional(),
});

export const updateRewardSchema = createRewardSchema.partial();

// Log skip validation
export const logSkipSchema = z.object({
    habitId: z.string().min(1),
    rewardId: z.string().min(1).optional(),
});

// Sync data (guest to user)
export const syncDataSchema = z.object({
    habits: z.array(createHabitSchema),
    rewards: z.array(createRewardSchema),
});

// Type exports
export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type CreateRewardInput = z.infer<typeof createRewardSchema>;
export type UpdateRewardInput = z.infer<typeof updateRewardSchema>;
export type LogSkipInput = z.infer<typeof logSkipSchema>;
export type SyncDataInput = z.infer<typeof syncDataSchema>;
