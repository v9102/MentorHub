"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton, ClerkLoading, useUser, SignUpButton, SignInButton } from "@clerk/nextjs";
import { BookOpen } from "lucide-react";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const onboardingPath = "/onboarding/profile/basic-info";

  return (
    <nav className="bg-white border-b shadow- sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="w-8 h-8 text-blue-800" />
          <span className="font-bold text-xl text-blue-800">
            Mentor<span className="text-orange-600">Hub</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/mentors" className="text-gray-700 hover:text-gray-900 relative group">
            Find Mentors
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-800 group-hover:w-full transition-all duration-500"></span>
          </Link>
          <Link
            href="/how-it-works"
            className="text-gray-700 hover:text-gray-900 relative group"
          >
            How it Works
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-800 group-hover:w-full transition-all duration-500"></span>
          </Link>
          
          {isSignedIn ? (
            <Link
              href={onboardingPath}
              className="text-gray-700 hover:text-gray-900 relative group"
            >
              Become a Mentor
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-800 group-hover:w-full transition-all duration-500"></span>
            </Link>
          ) : (
            <SignUpButton mode="modal" forceRedirectUrl={onboardingPath}>
              <button className="text-gray-700 hover:text-gray-900 relative group cursor-pointer">
                Become a Mentor
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-800 group-hover:w-full transition-all duration-500"></span>
              </button>
            </SignUpButton>
          )}

          <Link href="/about" className="text-gray-700 hover:text-gray-900 relative group">
            About
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-800 group-hover:w-full transition-all duration-500"></span>
          </Link>
        </div>

        {/* Auth */}
        <div className="flex items-center space-x-4">
          <ClerkLoading>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-10 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="w-28 h-10 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </ClerkLoading>
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard/student/dashboard">
              <button className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton mode="modal" forceRedirectUrl="/dashboard/student/dashboard">
              <button className="px-4 py-2 rounded-md bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all cursor-pointer">
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}