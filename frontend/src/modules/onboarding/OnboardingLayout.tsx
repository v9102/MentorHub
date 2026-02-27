"use client";

import { useRouter } from "next/navigation";
import { ProfileButton } from "@/shared/ui/ProfileButton";
import { ArrowLeft } from "lucide-react";

export default function OnboardingLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* ── Onboarding Top Bar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-3 backdrop-blur-md">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <ProfileButton />
      </header>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-8 pb-12 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
