"use client";

import { useState, useCallback } from "react";

// VAPID public key - should be in environment variable
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function useNotifications() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requestPermission = useCallback(async () => {
        if (!("Notification" in window)) {
            setError("Notifications not supported");
            return false;
        }

        if (!("serviceWorker" in navigator)) {
            setError("Service Worker not supported");
            return false;
        }

        const permission = await Notification.requestPermission();
        return permission === "granted";
    }, []);

    const subscribe = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const hasPermission = await requestPermission();
            if (!hasPermission) {
                setError("Notification permission denied");
                return false;
            }

            // Register service worker
            const registration = await navigator.serviceWorker.register("/sw.js");
            await navigator.serviceWorker.ready;

            // Check for existing subscription
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription && VAPID_PUBLIC_KEY) {
                // Create new subscription
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
                });
            }

            if (subscription) {
                // Send subscription to server
                const response = await fetch("/api/notifications/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(subscription.toJSON()),
                });

                if (response.ok) {
                    setIsSubscribed(true);
                    return true;
                }
            }

            setError("Failed to subscribe");
            return false;
        } catch (err) {
            console.error("Subscription error:", err);
            setError("Subscription failed");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [requestPermission]);

    const unsubscribe = useCallback(async () => {
        try {
            const registration = await navigator.serviceWorker.getRegistration();
            const subscription = await registration?.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
                setIsSubscribed(false);
            }
        } catch (err) {
            console.error("Unsubscribe error:", err);
        }
    }, []);

    return {
        isSubscribed,
        isLoading,
        error,
        subscribe,
        unsubscribe,
        requestPermission,
    };
}
