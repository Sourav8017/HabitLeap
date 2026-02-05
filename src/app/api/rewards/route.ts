import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Reward } from "@/models/Reward";
import { createRewardSchema } from "@/lib/validators";

// GET /api/rewards - List all rewards
export async function GET() {
    try {
        await connectDB();
        const rewards = await Reward.find().sort({ createdAt: -1 });
        return NextResponse.json({ rewards });
    } catch (error) {
        console.error("Error fetching rewards:", error);
        return NextResponse.json(
            { error: "Failed to fetch rewards" },
            { status: 500 }
        );
    }
}

// POST /api/rewards - Create a new reward
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const validation = createRewardSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid input", details: validation.error.format() },
                { status: 400 }
            );
        }

        const reward = await Reward.create({
            ...validation.data,
            savedAmount: 0,
            status: "active",
        });

        return NextResponse.json({ reward }, { status: 201 });
    } catch (error) {
        console.error("Error creating reward:", error);
        return NextResponse.json(
            { error: "Failed to create reward" },
            { status: 500 }
        );
    }
}
