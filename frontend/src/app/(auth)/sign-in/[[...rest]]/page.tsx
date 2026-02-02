"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const redirectUrl = redirect ?? "/dashboard";

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <SignIn
        routing="path"
        path="/sign-in"
        redirectUrl={redirectUrl}
        afterSignInUrl={redirectUrl}
        afterSignUpUrl={redirectUrl}
      />
    </div>
  );
}
