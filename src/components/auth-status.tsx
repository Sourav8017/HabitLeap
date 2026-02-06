"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AuthStatus() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        );
    }

    if (session?.user) {
        return (
            <div className="flex items-center gap-3">
                {session.user.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="h-8 w-8 rounded-full border border-border"
                    />
                )}
                <span className="text-sm text-foreground hidden sm:block">
                    {session.user.name?.split(" ")[0]}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="text-muted-foreground hover:text-foreground"
                >
                    Sign out
                </Button>
            </div>
        );
    }

    return (
        <Link href="/auth/signin">
            <Button variant="outline" size="sm">
                Sign in
            </Button>
        </Link>
    );
}
