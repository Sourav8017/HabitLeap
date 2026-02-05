import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { Habit } from "@/models/Habit";
import { Reward } from "@/models/Reward";
import { User } from "@/models/User";
import { syncDataSchema } from "@/lib/validators";

// POST /api/sync - Sync local guest data to authenticated user
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Find the authenticated user
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const body = await request.json();
        const validation = syncDataSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid input", details: validation.error.format() },
                { status: 400 }
            );
        }

        const { habits, rewards } = validation.data;

        // Bulk create habits for this user
        const createdHabits = await Habit.insertMany(
            habits.map((h) => ({ ...h, userId: user._id }))
        );

        // Bulk create rewards for this user
        const createdRewards = await Reward.insertMany(
            rewards.map((r) => ({ ...r, userId: user._id, savedAmount: 0 }))
        );

        return NextResponse.json({
            success: true,
            habitsCreated: createdHabits.length,
            rewardsCreated: createdRewards.length,
        });
    } catch (error) {
        console.error("Error syncing data:", error);
        return NextResponse.json({ error: "Failed to sync data" }, { status: 500 });
    }
}
