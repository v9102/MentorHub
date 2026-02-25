import { SignUp } from "@clerk/nextjs";
import AuthLayout from "@/components/auth/AuthLayout";
import { clerkThemeValues } from "@/lib/clerk-theme";

export default function MentorSignUpPage() {
  return (
    <AuthLayout>
      <SignUp
        routing="path"
        path="/sign-up/mentor"
        signInUrl="/sign-in"
        afterSignUpUrl="/onboarding/profile/basic-info"
        appearance={clerkThemeValues}
      />
    </AuthLayout>
  );
}
