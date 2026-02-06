"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useHabitStore } from "@/lib/store";

/**
 * SyncManager is a renderless component that handles data synchronization
 * between local Zustand store and the server when user authentication changes.
 *
 * Logic:
 * - On login (session becomes valid): If local data exists, sync it to server.
 * - On app load (if already logged in): Fetch server data and hydrate store.
 */
export function SyncManager() {
    const { data: session, status } = useSession();
    const { habits, rewards, savedAmount, hydrateFromServer, hasLocalData } = useHabitStore();
    const hasSynced = useRef(false);
    const hasFetched = useRef(false);

    // Sync local data to server after login
    useEffect(() => {
        const syncToServer = async () => {
            if (status !== "authenticated" || hasSynced.current) return;
            if (!hasLocalData()) return;

            try {
                const response = await fetch("/api/sync", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        habits: habits.map((h) => ({
                            name: h.name,
                            costPerOccurrence: h.costPerOccurrence,
                            frequency: h.frequency,
                            category: h.category,
                        })),
                        rewards: rewards.map((r) => ({
                            name: r.name,
                            price: r.price,
                        })),
                    }),
                });

                if (response.ok) {
                    console.log("✅ Local data synced to server");
                    hasSynced.current = true;
                }
            } catch (error) {
                console.error("❌ Failed to sync data:", error);
            }
        };

        syncToServer();
    }, [status, habits, rewards, hasLocalData]);

    // Fetch server data on load if logged in
    useEffect(() => {
        const fetchFromServer = async () => {
            if (status !== "authenticated" || hasFetched.current) return;

            try {
                const response = await fetch("/api/user/data");
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        hydrateFromServer(result.data);
                        console.log("✅ Store hydrated from server");
                        hasFetched.current = true;
                    }
                }
            } catch (error) {
                console.error("❌ Failed to fetch user data:", error);
            }
        };

        fetchFromServer();
    }, [status, hydrateFromServer]);

    // This is a renderless component
    return null;
}
