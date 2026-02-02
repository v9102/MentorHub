import { SignUp } from "@clerk/nextjs";

export default function StudentSignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-6">
      <SignUp
        signInUrl="/sign-in"
        redirectUrl="/dashboard/student/dashboard"
      />
    </div>
  );
}
