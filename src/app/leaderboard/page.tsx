"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNav } from "@/components/bottom-nav";

interface LeaderboardUser {
    rank: number;
    id: string;
    displayName: string;
    image: string | null;
    level: number;
    xp: number;
    currentStreak: number;
}

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

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function LeaderboardPage() {
    const { data: session } = useSession();
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch("/api/leaderboard");
                if (response.ok) {
                    const data = await response.json();
                    setLeaderboard(data.leaderboard || []);
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankEmoji = (rank: number) => {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return `#${rank}`;
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
                <motion.header variants={itemVariants} className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Top savers in the community
                    </p>
                </motion.header>

                {/* Leaderboard List */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Card key={i} className="animate-pulse border-border bg-card/50">
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div className="h-12 w-12 rounded-full bg-muted" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-32 rounded bg-muted" />
                                        <div className="h-3 w-20 rounded bg-muted" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : leaderboard.length === 0 ? (
                    <Card className="border-border bg-card/50">
                        <CardContent className="p-8 text-center">
                            <p className="text-4xl mb-4">🏆</p>
                            <p className="text-muted-foreground">
                                No savers on the leaderboard yet.
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Be the first to climb the ranks!
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {leaderboard.map((user) => {
                            const isCurrentUser = session?.user?.email && user.displayName === session.user.name;
                            const gradient = LEVEL_COLORS[Math.min(user.level, 10)] || LEVEL_COLORS[1];

                            return (
                                <motion.div key={user.id} variants={itemVariants}>
                                    <Card
                                        className={`border-border bg-card/50 backdrop-blur transition-all ${isCurrentUser ? "ring-2 ring-emerald-500" : ""
                                            }`}
                                    >
                                        <CardContent className="flex items-center gap-4 p-4">
                                            {/* Rank */}
                                            <div className="w-10 text-center text-lg font-bold text-foreground">
                                                {getRankEmoji(user.rank)}
                                            </div>

                                            {/* Avatar */}
                                            {user.image ? (
                                                <img
                                                    src={user.image}
                                                    alt={user.displayName}
                                                    className="h-12 w-12 rounded-full border-2 border-border"
                                                />
                                            ) : (
                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-lg font-bold text-white`}
                                                >
                                                    {user.displayName.charAt(0).toUpperCase()}
                                                </div>
                                            )}

                                            {/* User Info */}
                                            <div className="flex-1">
                                                <p className="font-semibold text-foreground">
                                                    {user.displayName}
                                                    {isCurrentUser && (
                                                        <span className="ml-2 text-xs text-emerald-500">(You)</span>
                                                    )}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Level {user.level} · {user.xp.toLocaleString()} XP
                                                </p>
                                            </div>

                                            {/* Streak */}
                                            {user.currentStreak > 0 && (
                                                <div className="text-right">
                                                    <p className="text-lg">🔥</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {user.currentStreak}d
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </motion.div>

            <BottomNav />
        </main>
    );
}
