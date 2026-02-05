import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Habit } from "@/models/Habit";
import { createHabitSchema } from "@/lib/validators";

// GET /api/habits - List all habits
export async function GET() {
    try {
        await connectDB();
        // For now, return all habits (auth will be added later)
        const habits = await Habit.find({ isActive: true }).sort({ createdAt: -1 });
        return NextResponse.json({ habits });
    } catch (error) {
        console.error("Error fetching habits:", error);
        return NextResponse.json(
            { error: "Failed to fetch habits" },
            { status: 500 }
        );
    }
}

// POST /api/habits - Create a new habit
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const validation = createHabitSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid input", details: validation.error.format() },
                { status: 400 }
            );
        }

        // Create habit (userId will come from auth session later)
        const habit = await Habit.create({
            ...validation.data,
            // Temporary: create without userId for guest mode
        });

        return NextResponse.json({ habit }, { status: 201 });
    } catch (error) {
        console.error("Error creating habit:", error);
        return NextResponse.json(
            { error: "Failed to create habit" },
            { status: 500 }
        );
    }
}
