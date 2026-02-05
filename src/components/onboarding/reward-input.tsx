"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

interface RewardInputProps {
    onSubmit: (rewardName: string, rewardPrice: number) => void;
    onBack: () => void;
}

const REWARD_PRESETS = [
    { name: "AirPods Pro", price: 24900 },
    { name: "Gaming Mouse", price: 4500 },
    { name: "MacBook Air", price: 99000 },
    { name: "iPhone 15", price: 79900 },
    { name: "PS5", price: 49990 },
    { name: "Bali Trip", price: 80000 },
];

export function RewardInput({ onSubmit, onBack }: RewardInputProps) {
    const [customName, setCustomName] = useState("");
    const [customPrice, setCustomPrice] = useState("");
    const [showCustom, setShowCustom] = useState(false);

    const handleCustomSubmit = () => {
        const price = parseFloat(customPrice);
        if (customName.trim() && !isNaN(price) && price > 0) {
            onSubmit(customName.trim(), price);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
            <button
                onClick={onBack}
                className="absolute left-4 top-4 text-sm text-muted-foreground hover:text-foreground"
            >
                ← Back
            </button>

            <div className="text-center">
                <p className="text-sm uppercase tracking-widest text-muted-foreground">
                    Step 3 of 3
                </p>
                <h1 className="mt-4 text-3xl font-bold text-foreground">
                    What&apos;s your <span className="text-emerald-500">dream reward</span>?
                </h1>
                <p className="mt-2 text-muted-foreground">
                    What could you buy if you quit?
                </p>
            </div>

            {!showCustom ? (
                <div className="w-full max-w-lg space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {REWARD_PRESETS.map((reward) => (
                            <button
                                key={reward.name}
                                onClick={() => onSubmit(reward.name, reward.price)}
                                className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-4 transition-all hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10"
                            >
                                <span className="text-sm font-medium text-foreground">
                                    {reward.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    ₹{reward.price.toLocaleString()}
                                </span>
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowCustom(true)}
                        className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
                    >
                        + Add custom reward
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-xs space-y-4">
                    <Input
                        type="text"
                        placeholder="Reward name"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="h-12 text-center"
                        autoFocus
                    />
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground">
                            ₹
                        </span>
                        <Input
                            type="number"
                            placeholder="Price"
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleCustomSubmit();
                            }}
                            className="h-12 pl-10 text-center text-xl"
                        />
                    </div>
                    <button
                        onClick={() => setShowCustom(false)}
                        className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Back to presets
                    </button>
                </div>
            )}
        </div>
    );
}
