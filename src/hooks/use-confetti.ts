"use client";

import confetti from "canvas-confetti";

export function useConfetti() {
    const fireConfetti = () => {
        // Fire from left
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 0.1, y: 0.6 },
            colors: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
        });

        // Fire from right
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 0.9, y: 0.6 },
            colors: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
        });

        // Fire from center after delay
        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { x: 0.5, y: 0.5 },
                colors: ["#10b981", "#fbbf24", "#f472b6", "#60a5fa"],
            });
        }, 200);
    };

    return { fireConfetti };
}
