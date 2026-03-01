"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthFormsCard from "@/components/auth/AuthFormsCard";
import { Suspense } from "react";

export default function MentorSignUpPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
        <AuthFormsCard initialView="sign-up-mentor" />
      </Suspense>
    </AuthLayout>
  );
}
