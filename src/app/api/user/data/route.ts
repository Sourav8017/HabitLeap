import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { Habit } from "@/models/Habit";
import { Reward } from "@/models/Reward";
import { User } from "@/models/User";

// GET /api/user/data - Fetch user's habits and rewards from DB
export async function GET() {
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

        // Fetch user's habits and rewards
        const habits = await Habit.find({ userId: user._id }).lean();
        const rewards = await Reward.find({ userId: user._id }).lean();

        // Calculate total saved from all rewards
        const totalSaved = rewards.reduce((sum, r) => sum + (r.savedAmount || 0), 0);

        return NextResponse.json({
            success: true,
            data: {
                habits: habits.map((h) => ({
                    id: h._id.toString(),
                    name: h.name,
                    costPerOccurrence: h.costPerOccurrence,
                    frequency: h.frequency,
                    category: h.category,
                })),
                rewards: rewards.map((r) => ({
                    id: r._id.toString(),
                    name: r.name,
                    price: r.price,
                    savedAmount: r.savedAmount || 0,
                    status: r.status,
                })),
                savedAmount: totalSaved,
            },
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
