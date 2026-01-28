"use client"
import { MentorOnboardingProvider } from "@/lib/context/MentorOnboardingContext";
import OnboardingLayoutWrapper from "@/components/onboarding/OnboardingLayout";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MentorOnboardingProvider>
        <OnboardingLayoutWrapper>
            {children}
        </OnboardingLayoutWrapper>
    </MentorOnboardingProvider>
  );
}
