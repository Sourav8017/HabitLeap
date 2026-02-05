"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

interface HabitInputProps {
    onSubmit: (habitName: string) => void;
}

const HABIT_PRESETS = ["Coffee", "Uber", "Smoking", "Netflix", "Snacks"];

export function HabitInput({ onSubmit }: HabitInputProps) {
    const [value, setValue] = useState("");

    const handleSubmit = (habitName: string) => {
        if (habitName.trim()) {
            onSubmit(habitName.trim());
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
            <div className="text-center">
                <p className="text-sm uppercase tracking-widest text-muted-foreground">
                    Step 1 of 3
                </p>
                <h1 className="mt-4 text-3xl font-bold text-foreground">
                    What habit do you want to quit?
                </h1>
            </div>

            <div className="w-full max-w-md space-y-6">
                {/* Preset chips */}
                <div className="flex flex-wrap justify-center gap-2">
                    {HABIT_PRESETS.map((preset) => (
                        <button
                            key={preset}
                            onClick={() => handleSubmit(preset)}
                            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            {preset}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <p className="mb-2 text-center text-sm text-muted-foreground">
                        or type your own
                    </p>
                    <Input
                        type="text"
                        placeholder="e.g., Energy Drinks"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSubmit(value);
                        }}
                        className="h-14 text-center text-xl"
                        autoFocus
                    />
                </div>
            </div>
        </div>
    );
}
