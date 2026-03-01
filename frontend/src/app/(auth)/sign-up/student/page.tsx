"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthFormsCard from "@/components/auth/AuthFormsCard";

export default function StudentSignUpPage() {
  return (
    <AuthLayout>
      <AuthFormsCard initialView="sign-up-student" />
    </AuthLayout>
  );
}
