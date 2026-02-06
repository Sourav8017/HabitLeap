import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

// GET /api/leaderboard - Fetch top users by XP
export async function GET() {
    try {
        await connectDB();

        // Fetch top 10 public users sorted by XP (descending)
        const topUsers = await User.find({ isPublic: true })
            .sort({ xp: -1 })
            .limit(10)
            .select("displayName name image level xp currentStreak")
            .lean();

        // Format for frontend
        const leaderboard = topUsers.map((user, index) => ({
            rank: index + 1,
            id: user._id.toString(),
            displayName: user.displayName || user.name || "Anonymous Saver",
            image: user.image || null,
            level: user.level,
            xp: user.xp,
            currentStreak: user.currentStreak,
        }));

        return NextResponse.json({
            success: true,
            leaderboard,
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json(
            { error: "Failed to fetch leaderboard" },
            { status: 500 }
        );
    }
}
