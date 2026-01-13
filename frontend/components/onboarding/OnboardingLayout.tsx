"use client";

import { usePathname } from "next/navigation";
import { OnboardingSidebar } from "./OnboardingSidebar";
import { ProgressBar } from "./ProgressBar";
import { StickyFooter } from "./StickyFooter";
import clsx from "clsx"; // Assuming clsx is installed, if not we can stick to standard template literals or install it.

const STEPS = [
  "/onboarding/profile/basic-info",
  "/onboarding/profile/expertise",
  "/onboarding/profile/availability",
  "/onboarding/profile/pricing",
  "/onboarding/profile/review",
];

export default function OnboardingLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStepIndex = STEPS.findIndex((path) => pathname.startsWith(path));
  // Default to 0 if not found (e.g. root path or specific sub-path)
  const safeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <div className="h-screen w-full bg-white overflow-hidden flex flex-col lg:flex-row">
      {/* Left Sidebar - Hidden on mobile, Flex on Desktop */}
      <OnboardingSidebar />

      {/* Mobile Stepper / Header (Visible only on small screens) */}
      <div className="lg:hidden p-4 border-b border-gray-200 bg-white flex flex-col gap-2 z-20">
         <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Mentor Onboarding</h2>
            <span className="text-sm font-medium text-orange-600">Step {safeIndex + 1}/{STEPS.length}</span>
         </div>
         <ProgressBar currentStep={safeIndex} totalSteps={STEPS.length} />
      </div>

      {/* Right Content Area */}
      <main className="flex-1 flex flex-col h-full relative min-w-0">
        
        {/* Progress Bar (Desktop only, or sticky top?) - Request said "above form content" */}
        {/* We generally place it at the top of the main area for desktop. Mobile handles it in the header. */}
        <div className="hidden lg:block px-8 pt-8 pb-4 bg-white z-10">
             <ProgressBar currentStep={safeIndex} totalSteps={STEPS.length} />
        </div>

        {/* Scrollable Form Area */}
        {/* flex-1 and overflow-y-auto makes ONLY this section scroll */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth px-4 md:px-8 pb-8">
          <div className="max-w-3xl mx-auto h-full"> 
             {/* h-full ensures content can grow, but container handles scroll */}
             {children}
          </div>
        </div>

        {/* Sticky Footer */}
        <StickyFooter />
      </main>
    </div>
  );
}
