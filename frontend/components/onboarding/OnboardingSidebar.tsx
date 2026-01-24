"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  CheckCircle,
  Check
} from "lucide-react";
import clsx from "clsx";

const STEPS = [
  {
    label: "Basic Info",
    path: "/onboarding/profile/basic-info",
    icon: User,
  },
  {
    label: "Expertise",
    path: "/onboarding/profile/expertise",
    icon: Briefcase,
  },
  {
    label: "Availability",
    path: "/onboarding/profile/availability",
    icon: Calendar,
  },
  {
    label: "Pricing",
    path: "/onboarding/profile/pricing",
    icon: DollarSign,
  },
  {
    label: "Review",
    path: "/onboarding/profile/review",
    icon: CheckCircle,
  },
];

export function OnboardingSidebar() {
  const pathname = usePathname();

  return (
    <div className="lg:w-72 bg-white border-r border-gray-200 h-full flex-col hidden lg:flex">
      {/* Header */}
      <div className="p-8 border-b border-gray-100">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0066ff] to-[#004bbd] bg-clip-text text-transparent">
          MentorHub
        </h2>
        <p className="text-sm text-gray-500 mt-1 font-medium">Mentor Onboarding</p>
      </div>

      {/* Stepper Navigation */}
      <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
        {STEPS.map((step, index) => {
          const currentIndex = STEPS.findIndex(s => pathname.startsWith(s.path));
          
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          // const isPending = index > currentIndex;

          return (
            <Link
              key={step.path}
              href={step.path}
              className={clsx(
                "group flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all relative overflow-hidden",
                isActive && "bg-orange-50 text-[#ff9900]",
                isCompleted && "text-[#0066ff] hover:bg-blue-50",
                !isActive && !isCompleted && "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              )}
            >
              <div 
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors flex-shrink-0",
                  isCompleted && "bg-[#0066ff] border-[#0066ff] text-white",
                  isActive && "border-[#ff9900] text-[#ff9900] bg-white",
                  !isActive && !isCompleted && "border-gray-300 text-gray-300 group-hover:border-gray-400 group-hover:text-gray-400"
                )}
              >
                  {isCompleted ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
              </div>
              
              <span className={clsx(
                "font-semibold tracking-wide",
                isCompleted && "text-[#0066ff]",
                isActive && "text-[#ff9900]",
                !isActive && !isCompleted && "text-gray-400"
              )}>
                {step.label}
              </span>

              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#ff9900] rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
         <p className="text-xs text-gray-400 text-center">
             &copy; {new Date().getFullYear()} MentorHub
         </p>
      </div>
    </div>
  );
}
