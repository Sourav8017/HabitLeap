"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RewardTrackerProps {
    name: string;
    price: number;
    savedAmount: number;
}

export function RewardTracker({ name, price, savedAmount }: RewardTrackerProps) {
    const progress = Math.min((savedAmount / price) * 100, 100);
    const remaining = Math.max(price - savedAmount, 0);
    const isComplete = savedAmount >= price;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="overflow-hidden border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
                <CardContent className="p-6">
                    <div className="mb-4 text-center">
                        <p className="text-sm uppercase tracking-widest text-muted-foreground">
                            {isComplete ? "🎉 Goal Unlocked!" : "🎯 Your Goal"}
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-foreground">{name}</h2>
                        <p className="text-sm text-muted-foreground">
                            ₹{price.toLocaleString()}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Progress value={progress} className="h-4" />
                        <div className="flex justify-between text-sm">
                            <span className="text-emerald-500 font-semibold">
                                ₹{savedAmount.toLocaleString()} saved
                            </span>
                            <span className="text-muted-foreground">
                                {isComplete ? "Complete!" : `₹${remaining.toLocaleString()} to go`}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-3xl font-black text-emerald-500">
                            {progress.toFixed(1)}%
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
