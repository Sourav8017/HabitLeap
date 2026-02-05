"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HabitCard } from "@/components/habit-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHabitStore } from "@/lib/store";
import { BottomNav } from "@/components/bottom-nav";
import Link from "next/link";

interface Habit {
    _id: string;
    name: string;
    costPerOccurrence: number;
    frequency: string;
    category: string;
}

export default function HabitsPage() {
    // Get draft habit from onboarding
    const { draftHabitName, draftHabitCost, draftRewardName, draftRewardPrice } = useHabitStore();

    // Local habits state (includes draft + any added)
    const [habits, setHabits] = useState<Habit[]>([]);
    const [savedAmount, setSavedAmount] = useState(0);
    const [skippingId, setSkippingId] = useState<string | null>(null);

    // Add habit form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [newHabitName, setNewHabitName] = useState("");
    const [newHabitCost, setNewHabitCost] = useState("");

    // Initialize with draft habit from onboarding
    useEffect(() => {
        if (draftHabitName && draftHabitCost) {
            setHabits([
                {
                    _id: "draft-1",
                    name: draftHabitName,
                    costPerOccurrence: draftHabitCost,
                    frequency: "daily",
                    category: "other",
                },
            ]);
        }
    }, [draftHabitName, draftHabitCost]);

    const handleSkip = async (habit: Habit) => {
        setSkippingId(habit._id);

        try {
            // For now, simulate API call (will connect to real API when DB is configured)
            await new Promise((resolve) => setTimeout(resolve, 400));

            // Update local saved amount
            setSavedAmount((prev) => prev + habit.costPerOccurrence);
        } catch (error) {
            console.error("Failed to log skip:", error);
        } finally {
            setSkippingId(null);
        }
    };

    const handleAddHabit = () => {
        if (!newHabitName.trim() || !newHabitCost) return;

        const newHabit: Habit = {
            _id: `local-${Date.now()}`,
            name: newHabitName.trim(),
            costPerOccurrence: parseFloat(newHabitCost),
            frequency: "daily",
            category: "other",
        };

        setHabits((prev) => [...prev, newHabit]);
        setNewHabitName("");
        setNewHabitCost("");
        setShowAddForm(false);
    };

    const rewardPrice = draftRewardPrice || 24900;
    const rewardName = draftRewardName || "AirPods Pro";
    const progress = Math.min((savedAmount / rewardPrice) * 100, 100);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    } as const;

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
    };

    return (
        <main className="dark min-h-screen bg-background pb-24">
            <motion.div
                className="mx-auto max-w-2xl p-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.header variants={itemVariants} className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">My Habits</h1>
                            <p className="text-sm text-muted-foreground">
                                Skip to save towards your {rewardName}
                            </p>
                        </div>
                        <Link href="/dashboard">
                            <Button variant="outline" size="sm">
                                Dashboard
                            </Button>
                        </Link>
                    </div>
                </motion.header>

                {/* Progress Summary */}
                <motion.section variants={itemVariants} className="mb-6">
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Saved Today</p>
                                <p className="text-2xl font-bold text-emerald-500">
                                    ₹{savedAmount.toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">{rewardName}</p>
                                <p className="text-lg font-semibold text-foreground">
                                    {progress.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Habits List */}
                <motion.section variants={itemVariants} className="space-y-4">
                    {habits.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border p-8 text-center">
                            <p className="text-muted-foreground">No habits yet.</p>
                            <Link href="/">
                                <Button className="mt-4" variant="outline">
                                    Start Onboarding
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        habits.map((habit) => (
                            <HabitCard
                                key={habit._id}
                                name={habit.name}
                                dailyCost={habit.costPerOccurrence}
                                frequency={habit.frequency}
                                onSkip={() => handleSkip(habit)}
                                isLoading={skippingId === habit._id}
                            />
                        ))
                    )}
                </motion.section>

                {/* Add Habit Form */}
                <motion.section variants={itemVariants} className="mt-6">
                    {!showAddForm ? (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowAddForm(true)}
                        >
                            + Add Another Habit
                        </Button>
                    ) : (
                        <div className="space-y-3 rounded-xl border border-border bg-card/50 p-4">
                            <Input
                                placeholder="Habit name (e.g., Uber)"
                                value={newHabitName}
                                onChange={(e) => setNewHabitName(e.target.value)}
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        ₹
                                    </span>
                                    <Input
                                        type="number"
                                        placeholder="Daily cost"
                                        value={newHabitCost}
                                        onChange={(e) => setNewHabitCost(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                                <Button onClick={handleAddHabit} className="bg-emerald-500 hover:bg-emerald-600">
                                    Add
                                </Button>
                                <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </motion.section>
            </motion.div>

            <BottomNav />
        </main>
    );
}
