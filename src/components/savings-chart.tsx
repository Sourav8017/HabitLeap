"use client";

import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface SavingsDataPoint {
    date: string;
    amount: number;
}

interface SavingsChartProps {
    data: SavingsDataPoint[];
    title?: string;
}

export function SavingsChart({ data, title = "Savings Over Time" }: SavingsChartProps) {
    // Generate demo data if none provided
    const chartData = data.length > 0 ? data : generateDemoData();

    return (
        <Card className="border-border bg-card/50 backdrop-blur">
            <CardContent className="p-4">
                <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                    {title}
                </h3>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="hsl(var(--border))"
                                opacity={0.3}
                            />
                            <XAxis
                                dataKey="date"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `₹${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                    color: "hsl(var(--foreground))",
                                }}
                                formatter={(value) => [`₹${value}`, "Saved"]}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#10b981"
                                strokeWidth={2}
                                fill="url(#savingsGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

// Generate demo data for visualization
function generateDemoData(): SavingsDataPoint[] {
    const data: SavingsDataPoint[] = [];
    let cumulative = 0;
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        // Simulate random daily savings between 0 and 300
        const dailySaving = Math.random() > 0.3 ? Math.floor(Math.random() * 300) : 0;
        cumulative += dailySaving;
        data.push({
            date: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
            amount: cumulative,
        });
    }

    return data;
}
