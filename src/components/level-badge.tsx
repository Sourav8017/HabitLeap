"use client";

import { motion } from "framer-motion";

interface LevelBadgeProps {
    level: number;
    xp: number;
    size?: "sm" | "md" | "lg";
}

const LEVEL_NAMES: Record<number, string> = {
    1: "Novice Saver",
    2: "Apprentice",
    3: "Money Mindful",
    4: "Budget Boss",
    5: "Wealth Builder",
    6: "Savings Sensei",
    7: "Finance Guru",
    8: "Money Master",
    9: "Wealth Wizard",
    10: "Legendary Saver",
};

const LEVEL_COLORS: Record<number, string> = {
    1: "from-gray-500 to-gray-600",
    2: "from-green-500 to-green-600",
    3: "from-blue-500 to-blue-600",
    4: "from-purple-500 to-purple-600",
    5: "from-yellow-500 to-orange-500",
    6: "from-pink-500 to-rose-500",
    7: "from-cyan-500 to-teal-500",
    8: "from-indigo-500 to-violet-500",
    9: "from-amber-500 to-red-500",
    10: "from-emerald-500 via-cyan-500 to-blue-500",
};

export function LevelBadge({ level, xp, size = "md" }: LevelBadgeProps) {
    const clampedLevel = Math.min(Math.max(level, 1), 10);
    const levelName = LEVEL_NAMES[clampedLevel] || "Legendary Saver";
    const gradient = LEVEL_COLORS[clampedLevel] || LEVEL_COLORS[10];

    // XP progress to next level (100 XP per level)
    const xpInCurrentLevel = xp % 100;
    const xpProgress = (xpInCurrentLevel / 100) * 100;

    const sizeClasses = {
        sm: "h-12 w-12 text-lg",
        md: "h-16 w-16 text-2xl",
        lg: "h-20 w-20 text-3xl",
    };

    return (
        <div className="flex items-center gap-3">
            {/* Level Circle */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${gradient} ${sizeClasses[size]} font-bold text-white shadow-lg`}
            >
                {clampedLevel}
                {/* Glow effect */}
                <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient} blur-md opacity-50 -z-10`}
                />
            </motion.div>

            {/* Level Info */}
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                    {levelName}
                </span>
                <span className="text-xs text-muted-foreground">
                    {xp} XP Total
                </span>
                {/* XP Progress Bar */}
                <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${gradient}`}
                    />
                </div>
                <span className="text-xs text-muted-foreground">
                    {xpInCurrentLevel}/100 to next level
                </span>
            </div>
        </div>
    );
}
