"use client";

import { useRouter } from "next/navigation";
import { useUser, SignUpButton } from "@clerk/nextjs";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

export default function BecomeMentorButton() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [isPending, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);

  const onboardingPath = "/onboarding/profile/basic-info";

  const buttonClasses = "px-8 py-3 bg-white text-blue-600 rounded-3xl border-2 border-blue-600 hover:bg-blue-50 transition-colors cursor-pointer font-semibold inline-flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed";

  const handleClick = () => {
    setIsNavigating(true);
    startTransition(() => {
      router.push(onboardingPath);
    });
  };

  if (isSignedIn) {
    return (
      <button
        onClick={handleClick}
        disabled={isPending || isNavigating}
        className={buttonClasses}
      >
        {isPending || isNavigating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Become a Mentor"
        )}
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
