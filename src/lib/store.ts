import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Habit {
    id: string;
    name: string;
    costPerOccurrence: number;
    frequency: "daily" | "weekly" | "monthly";
    category: "food" | "transport" | "digital" | "smoking" | "other";
}

export interface Reward {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
}

interface HabitState {
    // Draft state for onboarding flow
    draftHabitName: string;
    draftHabitCost: number;
    draftRewardName: string;
    draftRewardPrice: number;

    // Persisted data
    habits: Habit[];
    rewards: Reward[];
    savedAmount: number;

    // Actions for onboarding
    setDraftHabit: (name: string, cost: number) => void;
    setDraftReward: (name: string, price: number) => void;
    clearDraft: () => void;

    // Actions for habits
    addHabit: (habit: Omit<Habit, "id">) => void;
    removeHabit: (id: string) => void;

    // Actions for rewards
    addReward: (reward: Omit<Reward, "id">) => void;
    removeReward: (id: string) => void;

    // Actions for savings
    logSkip: (habitId: string) => void;

    // Sync actions
    hydrateFromServer: (data: { habits: Habit[]; rewards: Reward[]; savedAmount: number }) => void;
    hasLocalData: () => boolean;
}

export const useHabitStore = create<HabitState>()(
    persist(
        (set, get) => ({
            // Initial draft state
            draftHabitName: "",
            draftHabitCost: 0,
            draftRewardName: "",
            draftRewardPrice: 0,

            // Initial persisted state
            habits: [],
            rewards: [],
            savedAmount: 0,

            // Onboarding actions
            setDraftHabit: (name, cost) =>
                set({ draftHabitName: name, draftHabitCost: cost }),

            setDraftReward: (name, price) =>
                set({ draftRewardName: name, draftRewardPrice: price }),

            clearDraft: () =>
                set({
                    draftHabitName: "",
                    draftHabitCost: 0,
                    draftRewardName: "",
                    draftRewardPrice: 0,
                }),

            // Habit CRUD
            addHabit: (habit) =>
                set((state) => ({
                    habits: [...state.habits, { ...habit, id: crypto.randomUUID() }],
                })),

            removeHabit: (id) =>
                set((state) => ({
                    habits: state.habits.filter((h) => h.id !== id),
                })),

            // Reward CRUD
            addReward: (reward) =>
                set((state) => ({
                    rewards: [...state.rewards, { ...reward, id: crypto.randomUUID() }],
                })),

            removeReward: (id) =>
                set((state) => ({
                    rewards: state.rewards.filter((r) => r.id !== id),
                })),

            // Savings action
            logSkip: (habitId) => {
                const habit = get().habits.find((h) => h.id === habitId);
                if (habit) {
                    set((state) => ({
                        savedAmount: state.savedAmount + habit.costPerOccurrence,
                    }));
                }
            },

            // Sync actions
            hydrateFromServer: (data) => {
                set({
                    habits: data.habits,
                    rewards: data.rewards,
                    savedAmount: data.savedAmount,
                });
            },

            hasLocalData: () => {
                const state = get();
                return state.habits.length > 0 || state.rewards.length > 0 || state.savedAmount > 0;
            },
        }),
        {
            name: "habitleap-storage",
            partialize: (state) => ({
                habits: state.habits,
                rewards: state.rewards,
                savedAmount: state.savedAmount,
            }),
        }
    )
);
