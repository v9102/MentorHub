import { SignUp } from "@clerk/nextjs";

export default function StudentSignUpPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignUp 
        routing="path"
        path="/sign-up/student"
        signInUrl="/sign-in"
        afterSignUpUrl="/student/dashboard"
      />
    </div>
  );
}
