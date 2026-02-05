"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HabitInput } from "@/components/onboarding/habit-input";
import { CostInput } from "@/components/onboarding/cost-input";
import { RewardInput } from "@/components/onboarding/reward-input";
import { useHabitStore } from "@/lib/store";

type Step = "habit" | "cost" | "reward";

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("habit");
  const { draftHabitName, setDraftHabit, setDraftReward } = useHabitStore();

  const handleHabitSubmit = (habitName: string) => {
    setDraftHabit(habitName, 0);
    setStep("cost");
  };

  const handleCostSubmit = (cost: number) => {
    setDraftHabit(draftHabitName, cost);
    setStep("reward");
  };

  const handleRewardSubmit = (rewardName: string, rewardPrice: number) => {
    setDraftReward(rewardName, rewardPrice);
    router.push("/dashboard");
  };

  return (
    <main className="dark bg-background min-h-screen">
      {step === "habit" && <HabitInput onSubmit={handleHabitSubmit} />}
      {step === "cost" && (
        <CostInput
          habitName={draftHabitName}
          onSubmit={handleCostSubmit}
          onBack={() => setStep("habit")}
        />
      )}
      {step === "reward" && (
        <RewardInput
          onSubmit={handleRewardSubmit}
          onBack={() => setStep("cost")}
        />
      )}
    </main>
  );
}
