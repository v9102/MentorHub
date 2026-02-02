"use client"
import { MentorOnboardingProvider } from "@/shared/lib/context/MentorOnboardingContext";
import OnboardingLayoutWrapper from "@/modules/onboarding/OnboardingLayout";

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
