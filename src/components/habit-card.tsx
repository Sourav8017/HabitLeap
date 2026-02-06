"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HabitCardProps {
    name: string;
    dailyCost: number;
    frequency?: string;
    onSkip: () => void;
    isLoading?: boolean;
    isSkipped?: boolean;
}

export function HabitCard({
    name,
    dailyCost,
    frequency = "daily",
    onSkip,
    isLoading = false,
    isSkipped = false,
}: HabitCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className={`border-border bg-card/50 backdrop-blur ${isSkipped ? "border-emerald-500/50" : ""}`}>
                <CardContent className="flex items-center justify-between p-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="font-semibold text-foreground">{name}</h3>
                        <p className="text-sm text-muted-foreground">
                            ₹{dailyCost.toLocaleString()} / {frequency}
                        </p>
                    </div>
                    <Button
                        onClick={onSkip}
                        disabled={isLoading || isSkipped}
                        className={
                            isSkipped
                                ? "bg-emerald-500/20 text-emerald-500 cursor-default"
                                : "bg-emerald-500 text-white hover:bg-emerald-600"
                        }
                    >
                        {isLoading ? "..." : isSkipped ? "✓ Done Today" : "Skip Today →"}
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}
