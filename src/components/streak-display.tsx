"use client";

import { motion } from "framer-motion";

interface StreakDisplayProps {
    streak: number;
    size?: "sm" | "md" | "lg";
}

export function StreakDisplay({ streak, size = "md" }: StreakDisplayProps) {
    const sizeClasses = {
        sm: "text-sm gap-1",
        md: "text-base gap-2",
        lg: "text-lg gap-2",
    };

    const iconSizes = {
        sm: "text-lg",
        md: "text-2xl",
        lg: "text-3xl",
    };

    // Determine streak intensity for visual feedback
    const isHot = streak >= 7;
    const isOnFire = streak >= 14;
    const isLegendary = streak >= 30;

    let fireEmoji = "🔥";
    let streakColor = "text-orange-500";

    if (isLegendary) {
        fireEmoji = "🌟";
        streakColor = "text-amber-400";
    } else if (isOnFire) {
        fireEmoji = "🔥🔥";
        streakColor = "text-orange-400";
    } else if (isHot) {
        fireEmoji = "🔥";
        streakColor = "text-orange-500";
    } else if (streak > 0) {
        fireEmoji = "✨";
        streakColor = "text-yellow-500";
    } else {
        fireEmoji = "💤";
        streakColor = "text-gray-500";
    }

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`flex items-center ${sizeClasses[size]}`}
        >
            <span className={iconSizes[size]}>{fireEmoji}</span>
            <div className="flex flex-col">
                <span className={`font-bold ${streakColor}`}>
                    {streak} Day Streak
                </span>
                {streak >= 7 && (
                    <span className="text-xs text-muted-foreground">
                        {isLegendary
                            ? "🏆 Legendary!"
                            : isOnFire
                                ? "You're unstoppable!"
                                : "Keep it up!"}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
