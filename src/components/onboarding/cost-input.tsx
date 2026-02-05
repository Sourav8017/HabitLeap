"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

interface CostInputProps {
    habitName: string;
    onSubmit: (cost: number) => void;
    onBack: () => void;
}

export function CostInput({ habitName, onSubmit, onBack }: CostInputProps) {
    const [value, setValue] = useState("");

    const handleSubmit = () => {
        const cost = parseFloat(value);
        if (!isNaN(cost) && cost > 0) {
            onSubmit(cost);
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
                    Step 2 of 3
                </p>
                <h1 className="mt-4 text-3xl font-bold text-foreground">
                    How much does{" "}
                    <span className="text-rose-500">{habitName}</span> cost you?
                </h1>
                <p className="mt-2 text-muted-foreground">Per day</p>
            </div>

            <div className="w-full max-w-xs">
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl text-muted-foreground">
                        ₹
                    </span>
                    <Input
                        type="number"
                        placeholder="150"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSubmit();
                        }}
                        className="h-16 pl-10 text-center text-4xl font-bold"
                        autoFocus
                    />
                </div>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Press Enter to continue
                </p>
            </div>
        </div>
    );
}
