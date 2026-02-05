"use client";

import { motion, type Variants } from "framer-motion";
import { useHabitStore } from "@/lib/store";
import { GoalCard } from "@/components/goal-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Dashboard() {
    const { draftHabitName, draftHabitCost, draftRewardName, draftRewardPrice } =
        useHabitStore();

    // Calculate opportunity cost
    const dailyCost = draftHabitCost || 150;
    const rewardPrice = draftRewardPrice || 24900;
    const habitName = draftHabitName || "Coffee";
    const rewardName = draftRewardName || "AirPods Pro";

    const monthlyCost = dailyCost * 30;
    const annualCost = dailyCost * 365;
    const rewardsPerYear = annualCost / rewardPrice;
    const monthsToReward = rewardPrice / monthlyCost;
    const daysToReward = Math.ceil(rewardPrice / dailyCost);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    } as const;

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" as const },
        },
    };

    const numberVariants = {
        hidden: { scale: 0.5, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring" as const, stiffness: 100, delay: 0.3 },
        },
    };

    return (
        <main className="dark min-h-screen bg-background">
            <motion.div
                className="flex min-h-screen flex-col items-center justify-center gap-10 p-6 md:p-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center">
                    <p className="text-sm uppercase tracking-widest text-muted-foreground">
                        💡 Reality Check
                    </p>
                    <h1 className="mt-3 text-2xl font-bold text-foreground md:text-3xl">
                        Your{" "}
                        <span className="text-rose-500">{habitName}</span>{" "}
                        habit is costing you
                    </h1>
                </motion.div>

                {/* The Shock Comparison */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center gap-6 md:flex-row md:gap-10"
                >
                    {/* Cost Side (Red) */}
                    <motion.div
                        variants={numberVariants}
                        className="flex flex-col items-center rounded-3xl border-2 border-rose-500/40 bg-gradient-to-b from-rose-500/20 to-rose-500/5 px-10 py-8 shadow-2xl shadow-rose-500/10"
                    >
                        <span className="text-5xl font-black tabular-nums text-rose-500 md:text-6xl">
                            ₹{annualCost.toLocaleString()}
                        </span>
                        <span className="mt-2 text-sm font-medium text-rose-400">
                            per year
                        </span>
                        <span className="mt-1 text-xs text-muted-foreground">
                            (₹{dailyCost}/day × 365)
                        </span>
                    </motion.div>

                    {/* Equals */}
                    <motion.span
                        variants={itemVariants}
                        className="text-4xl font-black text-muted-foreground"
                    >
                        =
                    </motion.span>

                    {/* Reward Side (Green) */}
                    <motion.div
                        variants={numberVariants}
                        className="flex flex-col items-center rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 px-10 py-8 shadow-2xl shadow-emerald-500/10"
                    >
                        <span className="text-5xl font-black tabular-nums text-emerald-500 md:text-6xl">
                            {rewardsPerYear.toFixed(1)}×
                        </span>
                        <span className="mt-2 text-sm font-medium text-emerald-400">
                            {rewardName}
                        </span>
                        <span className="mt-1 text-xs text-muted-foreground">
                            (₹{rewardPrice.toLocaleString()} each)
                        </span>
                    </motion.div>
                </motion.div>

                {/* Call to Action Message */}
                <motion.div
                    variants={itemVariants}
                    className="max-w-lg text-center"
                >
                    <p className="text-lg text-muted-foreground md:text-xl">
                        🎯 Stop now, and you can afford{" "}
                        <span className="font-bold text-emerald-500">{rewardName}</span> in
                        just{" "}
                        <span className="font-bold text-foreground">
                            {monthsToReward < 1
                                ? `${daysToReward} days`
                                : `${monthsToReward.toFixed(1)} months`}
                        </span>
                        .
                    </p>
                </motion.div>

                {/* Goal Card Preview */}
                <motion.div variants={itemVariants}>
                    <GoalCard
                        title={rewardName}
                        price={rewardPrice}
                        saved={0}
                        variant="active"
                    />
                </motion.div>

                {/* Actions */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center gap-3"
                >
                    <Button
                        size="lg"
                        className="bg-emerald-500 px-8 text-lg font-semibold text-white hover:bg-emerald-600"
                    >
                        🚀 Start Saving for {rewardName}
                    </Button>
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Try different habit
                    </Link>
                </motion.div>
            </motion.div>
        </main>
    );
}
