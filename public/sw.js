// Service Worker for Push Notifications
// This file should be in the public directory

self.addEventListener("push", function (event) {
    const data = event.data ? event.data.json() : {};

    const title = data.title || "HabitLeap";
    const options = {
        body: data.body || "Time to track your progress!",
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        vibrate: [100, 50, 100],
        data: {
            url: data.url || "/dashboard",
        },
        actions: [
            {
                action: "open",
                title: "Open App",
            },
            {
                action: "dismiss",
                title: "Dismiss",
            },
        ],
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    if (event.action === "dismiss") {
        return;
    }

    const url = event.notification.data?.url || "/dashboard";

    event.waitUntil(
        clients.matchAll({ type: "window" }).then(function (clientList) {
            // Check if there's already a window open
            for (const client of clientList) {
                if (client.url.includes("localhost") && "focus" in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }
            // If no window is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

self.addEventListener("install", function (event) {
    console.log("Service Worker installed");
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    console.log("Service Worker activated");
    event.waitUntil(clients.claim());
});
