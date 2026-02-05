import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Habit } from "@/models/Habit";
import { Reward } from "@/models/Reward";
import { Transaction } from "@/models/Transaction";
import { logSkipSchema } from "@/lib/validators";

// POST /api/log/skip - Log a habit skip (saves money towards reward)
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const validation = logSkipSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid input", details: validation.error.format() },
                { status: 400 }
            );
        }

        const { habitId, rewardId } = validation.data;

        // Fetch the habit to get the cost
        const habit = await Habit.findById(habitId);
        if (!habit) {
            return NextResponse.json({ error: "Habit not found" }, { status: 404 });
        }

        // Find active reward or use provided one
        let reward;
        if (rewardId) {
            reward = await Reward.findById(rewardId);
        } else {
            reward = await Reward.findOne({ status: "active" });
        }

        if (!reward) {
            return NextResponse.json(
                { error: "No active reward found" },
                { status: 404 }
            );
        }

        const amountSaved = habit.costPerOccurrence;

        // Create transaction record
        const transaction = await Transaction.create({
            habitId: habit._id,
            rewardId: reward._id,
            amountSaved,
        });

        // Update reward's saved amount
        reward.savedAmount += amountSaved;

        // Check if goal is unlocked
        if (reward.savedAmount >= reward.price) {
            reward.status = "redeemed";
        }

        await reward.save();

        return NextResponse.json({
            success: true,
            transaction,
            newSavedAmount: reward.savedAmount,
            progress: Math.min((reward.savedAmount / reward.price) * 100, 100),
            isUnlocked: reward.status === "redeemed",
        });
    } catch (error) {
        console.error("Error logging skip:", error);
        return NextResponse.json(
            { error: "Failed to log skip" },
            { status: 500 }
        );
    }
}
