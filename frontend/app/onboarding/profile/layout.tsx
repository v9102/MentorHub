"use client"
import { MentorOnboardingProvider } from "@/lib/context/MentorOnboardingContext";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MentorOnboardingProvider>{children}</MentorOnboardingProvider>;
}
