"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useHabitStore } from "@/lib/store";
import { HabitCard } from "@/components/habit-card";
import { RewardTracker } from "@/components/reward-tracker";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/bottom-nav";
import { AuthStatus } from "@/components/auth-status";
import { useConfetti } from "@/hooks/use-confetti";
import Link from "next/link";

export default function Dashboard() {
    const { data: session } = useSession();
    const {
        draftHabitName,
        draftHabitCost,
        draftRewardName,
        draftRewardPrice,
        savedAmount,
        logSkip,
        habits,
    } = useHabitStore();

    const [isLogging, setIsLogging] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [todaySkipped, setTodaySkipped] = useState(false);

    // Use draft data or fallbacks
    const habitName = draftHabitName || "Coffee";
    const dailyCost = draftHabitCost || 150;
    const rewardName = draftRewardName || "AirPods Pro";
    const rewardPrice = draftRewardPrice || 24900;

    // Calculate stats
    const annualCost = dailyCost * 365;
    const rewardsPerYear = annualCost / rewardPrice;
    const monthsToReward = rewardPrice / (dailyCost * 30);

    const { fireConfetti } = useConfetti();

    // Check if already skipped today (from localStorage for guests)
    useEffect(() => {
        const lastSkipDate = localStorage.getItem("habitleap-last-skip");
        if (lastSkipDate === new Date().toDateString()) {
            setTodaySkipped(true);
        }
    }, []);

    const handleSkip = async () => {
        if (todaySkipped) return;

        setIsLogging(true);

        try {
            // If logged in, call the API
            if (session?.user) {
                const habitId = habits[0]?.id; // Get first habit
                if (habitId) {
                    const response = await fetch("/api/log/skip", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            habitId,
                            userId: (session.user as { id?: string }).id,
                        }),
                    });

                    if (!response.ok) {
                        const error = await response.json();
                        if (error.alreadySkipped) {
                            setTodaySkipped(true);
                            setIsLogging(false);
                            return;
                        }
                        throw new Error(error.error || "Failed to log skip");
                    }
                }
            }

            // Update local store (works for both guests and logged-in users)
            const habitId = habits[0]?.id || "draft";
            if (habits[0]) {
                logSkip(habitId);
            } else {
                // For draft habits, manually update savedAmount
                useHabitStore.setState((state) => ({
                    savedAmount: state.savedAmount + dailyCost,
                }));
            }

            // Mark as skipped today
            localStorage.setItem("habitleap-last-skip", new Date().toDateString());
            setTodaySkipped(true);

            // Check if goal is complete
            const newSaved = savedAmount + dailyCost;
            if (newSaved >= rewardPrice && savedAmount < rewardPrice) {
                fireConfetti();
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 3000);
            }
        } catch (error) {
            console.error("Error logging skip:", error);
        } finally {
            setIsLogging(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    } as const;

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" as const },
        },
    };

    return (
        <main className="dark min-h-screen bg-background">
            <motion.div
                className="mx-auto max-w-2xl p-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.header variants={itemVariants} className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">HabitLeap</h1>
                            <p className="text-sm text-muted-foreground">
                                Skip habits. Save money. Get rewards.
                            </p>
                        </div>
                        <AuthStatus />
                    </div>

                    {/* Save Progress CTA for guests */}
                    {!session && savedAmount > 0 && (
                        <Link href="/auth/signin" className="mt-4 block">
                            <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-3 text-center transition-all hover:bg-emerald-500/20">
                                <p className="text-sm font-medium text-emerald-500">
                                    ☁️ Save your progress to the cloud
                                </p>
                            </div>
                        </Link>
                    )}
                </motion.header>

                {/* Celebration overlay */}
                {showCelebration && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                    >
                        <div className="text-center">
                            <p className="text-6xl">🎉</p>
                            <h2 className="mt-4 text-3xl font-bold text-emerald-500">
                                Goal Unlocked!
                            </h2>
                            <p className="mt-2 text-xl text-foreground">
                                You earned your {rewardName}!
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* The Shock Stats */}
                <motion.section variants={itemVariants} className="mb-8">
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 text-center">
                        <p className="text-sm uppercase tracking-widest text-muted-foreground">
                            Your {habitName} habit costs you
                        </p>
                        <p className="mt-2 text-4xl font-black text-rose-500">
                            ₹{annualCost.toLocaleString()}/year
                        </p>
                        <p className="mt-2 text-muted-foreground">
                            That&apos;s <span className="font-bold text-foreground">{rewardsPerYear.toFixed(1)}x {rewardName}</span> every year!
                        </p>
                    </div>
                </motion.section>

                {/* Active Goal */}
                <motion.section variants={itemVariants} className="mb-8">
                    <RewardTracker
                        name={rewardName}
                        price={rewardPrice}
                        savedAmount={savedAmount}
                    />
                </motion.section>

                {/* Habit to Skip */}
                <motion.section variants={itemVariants} className="mb-8">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">
                        Today&apos;s Habit
                    </h2>
                    <HabitCard
                        name={habitName}
                        dailyCost={dailyCost}
                        onSkip={handleSkip}
                        isLoading={isLogging}
                        isSkipped={todaySkipped}
                    />
                </motion.section>

                {/* Quick Stats */}
                <motion.section variants={itemVariants} className="mb-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl border border-border bg-card/50 p-4 text-center">
                            <p className="text-2xl font-bold text-emerald-500">
                                ₹{savedAmount.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">Total Saved</p>
                        </div>
                        <div className="rounded-xl border border-border bg-card/50 p-4 text-center">
                            <p className="text-2xl font-bold text-foreground">
                                {Math.floor(savedAmount / dailyCost)}
                            </p>
                            <p className="text-xs text-muted-foreground">Skips Logged</p>
                        </div>
                    </div>
                </motion.section>

                {/* Time to Goal */}
                <motion.section variants={itemVariants} className="mb-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Keep skipping and reach your goal in{" "}
                        <span className="font-semibold text-emerald-500">
                            {monthsToReward.toFixed(1)} months
                        </span>
                    </p>
                </motion.section>

                {/* Footer Actions */}
                <motion.footer variants={itemVariants} className="flex flex-col items-center gap-3 pb-24">
                    <Link href="/">
                        <Button variant="outline" size="sm">
                            ← Change Habit or Goal
                        </Button>
                    </Link>
                </motion.footer>
            </motion.div>

            <BottomNav />
        </main>
    );
}
