"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthFormsCard from "@/components/auth/AuthFormsCard";

export default function MentorSignUpPage() {
  return (
    <AuthLayout>
      <AuthFormsCard initialView="sign-up-mentor" />
    </AuthLayout>
  );
}
