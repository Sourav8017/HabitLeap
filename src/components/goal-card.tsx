import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GoalCardProps {
    title: string;
    price: number;
    saved: number;
    variant?: "locked" | "active" | "unlocked";
}

export function GoalCard({
    title,
    price,
    saved,
    variant = "active",
}: GoalCardProps) {
    const progress = Math.min((saved / price) * 100, 100);
    const isUnlocked = progress >= 100;

    return (
        <Card
            className={`w-full max-w-sm transition-all ${variant === "locked"
                    ? "opacity-50"
                    : isUnlocked
                        ? "ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20"
                        : ""
                }`}
        >
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-foreground">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                        ₹{saved.toLocaleString()} saved
                    </span>
                    <span className="font-medium text-foreground">
                        ₹{price.toLocaleString()}
                    </span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                    {isUnlocked
                        ? "🎉 Goal Unlocked!"
                        : `${progress.toFixed(0)}% funded`}
                </p>
            </CardContent>
        </Card>
    );
}
