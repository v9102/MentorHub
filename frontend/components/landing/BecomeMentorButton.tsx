"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function BecomeMentorButton() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const onboardingPath = "/onboarding/profile/basic-info";

  const handleClick = () => {
    if (!isSignedIn) {
      router.push(`/sign-in?redirect=${onboardingPath}`);
    } else {
      router.push(onboardingPath);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-8 py-3 bg-white text-blue-800 rounded-3xl border-2 border-blue-800 hover:bg-blue-50 transition-colors"
    >
      Become a Mentor
    </button>
  );
}
