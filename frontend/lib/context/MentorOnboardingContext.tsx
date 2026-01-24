"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { MentorOnboardingData } from "@/lib/types/mentor-onboarding-data";

type OnboardingContextType = {
  data: MentorOnboardingData;
  updateData: (stepData: Partial<MentorOnboardingData>) => void;
  resetData: () => void;
};

const MentorOnboardingContext =
  createContext<OnboardingContextType | null>(null);

export function MentorOnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔹 Load initial data from localStorage
  const [data, setData] = useState<MentorOnboardingData>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem("mentorOnboarding");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // 🔹 Persist on every change
  useEffect(() => {
    localStorage.setItem("mentorOnboarding", JSON.stringify(data));
  }, [data]);

  const updateData = (stepData: Partial<MentorOnboardingData>) => {
    setData((prev) => ({
      ...prev,
      ...stepData,
    }));
  };

  const resetData = () => {
    setData({});
    localStorage.removeItem("mentorOnboarding");
  };

  return (
    <MentorOnboardingContext.Provider
      value={{ data, updateData, resetData }}
    >
      {children}
    </MentorOnboardingContext.Provider>
  );
}

export function useMentorOnboarding() {
  const ctx = useContext(MentorOnboardingContext);
  if (!ctx) {
    throw new Error("useMentorOnboarding must be used inside provider");
  }
  return ctx;
}
