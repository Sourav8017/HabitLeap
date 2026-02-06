import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

// Store push subscriptions (in production, store in DB)
// For now we'll store on the user document

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const subscription = await request.json();

        // Validate subscription object
        if (!subscription.endpoint || !subscription.keys) {
            return NextResponse.json(
                { error: "Invalid subscription" },
                { status: 400 }
            );
        }

        // Store the subscription on the user (in production, use a separate collection)
        await User.findOneAndUpdate(
            { email: session.user.email },
            {
                $set: {
                    pushSubscription: JSON.stringify(subscription),
                    notificationsEnabled: true
                }
            }
        );

        console.log("✅ Push subscription saved for:", session.user.email);

        return NextResponse.json({
            success: true,
            message: "Subscription saved",
        });
    } catch (error) {
        console.error("Error saving subscription:", error);
        return NextResponse.json(
            { error: "Failed to save subscription" },
            { status: 500 }
        );
    }
}
