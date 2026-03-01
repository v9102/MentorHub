"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthFormsCard from "@/components/auth/AuthFormsCard";

export default function SignInPage() {
  return (
    <AuthLayout>
      <AuthFormsCard initialView="sign-in" />
    </AuthLayout>
  );
}
