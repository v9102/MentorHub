"use client";

import { useRouter } from "next/navigation";
import { useUser, SignUpButton } from "@clerk/nextjs";

export default function BecomeMentorButton() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const onboardingPath = "/onboarding/profile/basic-info";

  const buttonClasses = "px-8 py-3 bg-white text-blue-600 rounded-3xl border-2 border-blue-600 hover:bg-blue-50 transition-colors cursor-pointer font-semibold";

  if (isSignedIn) {
    return (
      <button
        onClick={() => router.push(onboardingPath)}
        className={buttonClasses}
      >
        Become a Mentor
      </button>
    );
  }

  return (
    <SignUpButton mode="modal" forceRedirectUrl={onboardingPath}>
      <button className={buttonClasses}>
        Become a Mentor
      </button>
    </SignUpButton>
  );
}
