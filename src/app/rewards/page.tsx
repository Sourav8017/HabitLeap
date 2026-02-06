"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RewardCard } from "@/components/reward-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHabitStore } from "@/lib/store";
import { BottomNav } from "@/components/bottom-nav";

interface Reward {
    _id: string;
    name: string;
    price: number;
    savedAmount: number;
    status: "locked" | "active" | "redeemed";
}

// Preset rewards for the "shop"
const PRESET_REWARDS: Omit<Reward, "_id" | "savedAmount" | "status">[] = [
    { name: "Gaming Mouse", price: 4500 },
    { name: "AirPods Pro", price: 24900 },
    { name: "Nintendo Switch", price: 29990 },
    { name: "iPhone 15", price: 79900 },
    { name: "MacBook Air", price: 99000 },
    { name: "Bali Trip", price: 80000 },
];

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

export default function RewardsPage() {
    const { draftRewardName, draftRewardPrice } = useHabitStore();

    const [rewards, setRewards] = useState<Reward[]>([]);
    const [activeRewardId, setActiveRewardId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRewardName, setNewRewardName] = useState("");
    const [newRewardPrice, setNewRewardPrice] = useState("");

    // Initialize with draft reward from onboarding
    useEffect(() => {
        if (draftRewardName && draftRewardPrice) {
            const draftReward: Reward = {
                _id: "draft-reward-1",
                name: draftRewardName,
                price: draftRewardPrice,
                savedAmount: 0,
                status: "active",
            };
            setRewards([draftReward]);
            setActiveRewardId(draftReward._id);
        }
    }, [draftRewardName, draftRewardPrice]);

    const handleAddPreset = (preset: typeof PRESET_REWARDS[0]) => {
        const newReward: Reward = {
            _id: `preset-${generateId()}-${preset.name}`,
            name: preset.name,
            price: preset.price,
            savedAmount: 0,
            status: rewards.length === 0 ? "active" : "locked",
        };
        setRewards((prev) => [...prev, newReward]);
        if (!activeRewardId) {
            setActiveRewardId(newReward._id);
        }
    };

    const handleAddCustom = () => {
        if (!newRewardName.trim() || !newRewardPrice) return;

        const newReward: Reward = {
            _id: `custom-${generateId()}`,
            name: newRewardName.trim(),
            price: parseFloat(newRewardPrice),
            savedAmount: 0,
            status: rewards.length === 0 ? "active" : "locked",
        };
        setRewards((prev) => [...prev, newReward]);
        if (!activeRewardId) {
            setActiveRewardId(newReward._id);
        }
        setNewRewardName("");
        setNewRewardPrice("");
        setShowAddForm(false);
    };

    const handleSetActive = (rewardId: string) => {
        setRewards((prev) =>
            prev.map((r) => ({
                ...r,
                status: r._id === rewardId ? "active" : r.status === "active" ? "locked" : r.status,
            }))
        );
        setActiveRewardId(rewardId);
    };

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
                    <h1 className="text-2xl font-bold text-foreground">🏆 Reward Shop</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Choose what you&apos;re saving for
                    </p>
                </motion.header>

                {/* My Rewards */}
                {rewards.length > 0 && (
                    <motion.section variants={itemVariants} className="mb-8">
                        <h2 className="mb-4 text-lg font-semibold text-foreground">
                            My Rewards
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {rewards.map((reward) => (
                                <RewardCard
                                    key={reward._id}
                                    name={reward.name}
                                    price={reward.price}
                                    savedAmount={reward.savedAmount}
                                    isActive={reward._id === activeRewardId}
                                    onSelect={() => handleSetActive(reward._id)}
                                />
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Preset Rewards Gallery */}
                <motion.section variants={itemVariants} className="mb-8">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">
                        Add a Goal
                    </h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {PRESET_REWARDS.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => handleAddPreset(preset)}
                                className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card/50 p-4 transition-all hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10"
                            >
                                <span className="text-sm font-medium text-foreground">
                                    {preset.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    ₹{preset.price.toLocaleString()}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.section>

                {/* Custom Reward Form */}
                <motion.section variants={itemVariants}>
                    {!showAddForm ? (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowAddForm(true)}
                        >
                            + Add Custom Reward
                        </Button>
                    ) : (
                        <div className="space-y-3 rounded-xl border border-border bg-card/50 p-4">
                            <Input
                                placeholder="Reward name"
                                value={newRewardName}
                                onChange={(e) => setNewRewardName(e.target.value)}
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        ₹
                                    </span>
                                    <Input
                                        type="number"
                                        placeholder="Price"
                                        value={newRewardPrice}
                                        onChange={(e) => setNewRewardPrice(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                                <Button onClick={handleAddCustom} className="bg-emerald-500 hover:bg-emerald-600">
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
