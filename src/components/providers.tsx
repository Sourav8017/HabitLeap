"use client";

import { SessionProvider } from "next-auth/react";
import { SyncManager } from "@/components/sync-manager";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <SyncManager />
            {children}
        </SessionProvider>
    );
}
