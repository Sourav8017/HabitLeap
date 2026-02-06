"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/habits", label: "Habits", icon: "🎯" },
    { href: "/rewards", label: "Rewards", icon: "🏆" },
    { href: "/leaderboard", label: "Ranking", icon: "👑" },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/80 backdrop-blur">
            <div className="mx-auto flex max-w-2xl justify-around py-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 px-4 py-1 transition-colors",
                                isActive
                                    ? "text-emerald-500"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
