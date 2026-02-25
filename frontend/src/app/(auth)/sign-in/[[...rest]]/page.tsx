"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { clerkThemeValues } from "@/lib/clerk-theme";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const redirectUrl = redirect ?? "/dashboard";

  return (
    <AuthLayout>
      <SignIn
        routing="path"
        path="/sign-in"
        redirectUrl={redirectUrl}
        afterSignInUrl={redirectUrl}
        afterSignUpUrl={redirectUrl}
        appearance={clerkThemeValues}
      />
    </AuthLayout>
  );
}
