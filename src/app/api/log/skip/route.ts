import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Habit } from "@/models/Habit";
import { Reward } from "@/models/Reward";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User";
import { logSkipSchema } from "@/lib/validators";

// Helper: Check if two dates are consecutive days
function isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
}

function isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
}

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

        const { habitId, rewardId, userId } = validation.data;

        // Fetch the habit
        const habit = await Habit.findById(habitId);
        if (!habit) {
            return NextResponse.json({ error: "Habit not found" }, { status: 404 });
        }

        // Check if already skipped today
        if (habit.lastSkippedAt && isToday(habit.lastSkippedAt)) {
            return NextResponse.json(
                { error: "Already logged skip for today", alreadySkipped: true },
                { status: 400 }
            );
        }

        // Calculate streak
        let newStreak = 1;
        if (habit.lastSkippedAt && isYesterday(habit.lastSkippedAt)) {
            newStreak = habit.streak + 1;
        }

        // Update habit streak
        habit.streak = newStreak;
        habit.lastSkippedAt = new Date();
        await habit.save();

        // Find reward
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
        if (reward.savedAmount >= reward.price) {
            reward.status = "redeemed";
        }
        await reward.save();

        // Update user XP and streak (if userId provided)
        let userUpdate = null;
        if (userId) {
            const xpEarned = Math.floor(amountSaved / 10); // 1 XP per ₹10
            const user = await User.findById(userId);
            if (user) {
                user.xp += xpEarned;
                user.currentStreak = Math.max(user.currentStreak, newStreak);
                user.longestStreak = Math.max(user.longestStreak, newStreak);
                // Level up every 100 XP
                const newLevel = Math.floor(user.xp / 100) + 1;
                const leveledUp = newLevel > user.level;
                user.level = newLevel;
                await user.save();
                userUpdate = {
                    xp: user.xp,
                    level: user.level,
                    currentStreak: user.currentStreak,
                    leveledUp,
                };
            }
        }

        return NextResponse.json({
            success: true,
            transaction,
            newSavedAmount: reward.savedAmount,
            progress: Math.min((reward.savedAmount / reward.price) * 100, 100),
            isUnlocked: reward.status === "redeemed",
            streak: newStreak,
            userUpdate,
        });
    } catch (error) {
        console.error("Error logging skip:", error);
        return NextResponse.json(
            { error: "Failed to log skip" },
            { status: 500 }
        );
    }
}
