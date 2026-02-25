import { SignUp } from "@clerk/nextjs";
import AuthLayout from "@/components/auth/AuthLayout";
import { clerkThemeValues } from "@/lib/clerk-theme";

export default function StudentSignUpPage() {
  return (
    <AuthLayout>
      <SignUp
        signInUrl="/sign-in"
        redirectUrl="/dashboard/student/dashboard"
        appearance={clerkThemeValues}
      />
    </AuthLayout>
  );
}
