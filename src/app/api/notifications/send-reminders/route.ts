import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import webpush from "web-push";

// Configure web-push with VAPID keys (should be set in environment)
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        "mailto:hello@habitleap.com",
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY
    );
}

// POST /api/notifications/send-reminders
// This endpoint can be called by a cron job (e.g., Vercel Cron)
export async function POST(request: NextRequest) {
    try {
        // Optional: Add a secret key check for security
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Find all users with notifications enabled
        const usersWithNotifications = await User.find({
            notificationsEnabled: true,
            pushSubscription: { $exists: true, $ne: null },
        }).lean();

        const notificationPayload = JSON.stringify({
            title: "HabitLeap Reminder 🔥",
            body: "Did you skip your habit today? Track it now!",
            url: "/dashboard",
        });

        let successCount = 0;
        let failCount = 0;

        for (const user of usersWithNotifications) {
            if (!user.pushSubscription) continue;

            try {
                const subscription = JSON.parse(user.pushSubscription);
                await webpush.sendNotification(subscription, notificationPayload);
                successCount++;
            } catch (error: unknown) {
                console.error(`Failed to send to user ${user._id}:`, error);
                failCount++;

                // If subscription is invalid, disable notifications for user
                if (error && typeof error === "object" && "statusCode" in error) {
                    const statusCode = (error as { statusCode: number }).statusCode;
                    if (statusCode === 410 || statusCode === 404) {
                        await User.findByIdAndUpdate(user._id, {
                            notificationsEnabled: false,
                            pushSubscription: null,
                        });
                    }
                }
            }
        }

        console.log(`📬 Sent ${successCount} reminders, ${failCount} failed`);

        return NextResponse.json({
            success: true,
            sent: successCount,
            failed: failCount,
            total: usersWithNotifications.length,
        });
    } catch (error) {
        console.error("Error sending reminders:", error);
        return NextResponse.json(
            { error: "Failed to send reminders" },
            { status: 500 }
        );
    }
}
