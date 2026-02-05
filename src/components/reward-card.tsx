"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface RewardCardProps {
    name: string;
    price: number;
    savedAmount: number;
    isActive?: boolean;
    onSelect?: () => void;
}

export function RewardCard({
    name,
    price,
    savedAmount,
    isActive = false,
    onSelect,
}: RewardCardProps) {
    const progress = Math.min((savedAmount / price) * 100, 100);
    const isComplete = savedAmount >= price;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                className={cn(
                    "cursor-pointer transition-all",
                    isActive
                        ? "border-2 border-emerald-500 shadow-lg shadow-emerald-500/20"
                        : "border-border hover:border-emerald-500/50",
                    isComplete && "bg-gradient-to-br from-emerald-500/20 to-emerald-500/5"
                )}
                onClick={onSelect}
            >
                <CardContent className="p-4">
                    {/* Status Badge */}
                    <div className="mb-3 flex items-center justify-between">
                        <span
                            className={cn(
                                "rounded-full px-2 py-0.5 text-xs font-medium",
                                isComplete
                                    ? "bg-emerald-500 text-white"
                                    : isActive
                                        ? "bg-emerald-500/20 text-emerald-500"
                                        : "bg-muted text-muted-foreground"
                            )}
                        >
                            {isComplete ? "🎉 Unlocked" : isActive ? "🎯 Active" : "🔒 Locked"}
                        </span>
                        {isActive && !isComplete && (
                            <span className="text-xs text-muted-foreground">
                                ₹{(price - savedAmount).toLocaleString()} to go
                            </span>
                        )}
                    </div>

                    {/* Reward Info */}
                    <h3 className="text-lg font-semibold text-foreground">{name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        ₹{price.toLocaleString()}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 space-y-2">
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-xs">
                            <span className="text-emerald-500">
                                ₹{savedAmount.toLocaleString()} saved
                            </span>
                            <span className="font-semibold text-foreground">
                                {progress.toFixed(0)}%
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
