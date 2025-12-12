import { SignUp } from "@clerk/nextjs";

export default function MentorSignUpPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignUp 
        routing="path"
        path="/sign-up/mentor"
        signInUrl="/sign-in"
        afterSignUpUrl="/mentor/dashboard"
      />
    </div>
  );
}
