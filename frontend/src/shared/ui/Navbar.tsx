"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton, ClerkLoading, useUser, SignUpButton, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import { BookOpen, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const onboardingPath = "/onboarding/profile/basic-info";



  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { href: "/mentors", label: "Find Mentors" },
    { href: "/how-it-works", label: "How it Works" },
    { href: "/about", label: "About" },
  ];

  const BecomeMentorLink = ({ mobile = false }) => {
    const classes = mobile
      ? "text-lg font-medium text-gray-900 py-2 block"
      : "text-gray-600 hover:text-blue-600 relative group font-medium transition-colors";

    const content = (
      <>
        Become a Mentor
        {!mobile && <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>}
      </>
    );

    if (isSignedIn) {
      return (
        <Link href={onboardingPath} className={classes} onClick={mobile ? closeMenu : undefined}>
          {content}
        </Link>
      )
    }

    return (
      <SignUpButton mode="modal" forceRedirectUrl={onboardingPath}>
        <button className={classes} onClick={mobile ? closeMenu : undefined}>
          {content}
        </button>
      </SignUpButton>
    )
  }

  // When mobile menu is open, we want the navbar to be solid white and full width
  // to seamlessly connect with the menu overlay.
  const isScrolledState = isScrolled && !isMobileMenuOpen;

  // Hide Navbar on booking pages
  if (pathname?.startsWith("/book/")) return null;

  return (
    <>
      <nav
        className={cn(
          "fixed z-50 border-b transition-[background-color,box-shadow,backdrop-filter] duration-200",
          isScrolledState
            ? "top-0 left-0 right-0 w-full rounded-none bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-3 md:top-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[95%] md:max-w-5xl md:rounded-2xl md:py-2 supports-[backdrop-filter]:bg-white/10" // Hybrid Docking State
            : "top-0 left-0 right-0 w-full rounded-none bg-transparent border-transparent py-4", // Top State or Menu Open
          isMobileMenuOpen && "bg-white border-gray-100" // Force solid background when menu is open
        )}
      >
        <div
          className={cn(
            "mx-auto px-4 flex items-center justify-between relative z-50",
            isScrolledState ? "w-full md:w-full" : "max-w-7xl"
          )}
        >
          <Link href="/" className="flex items-center -ml-2" onClick={closeMenu}>
            <Image
              src="/logo.png"
              alt="MentoMania Logo"
              width={48}
              height={48}
              className="w-12 h-12 object-contain -mt-2"
            />
            <span className="font-bold text-2xl text-gray-900 -ml-1.5 pt-1">
              ento<span className="text-blue-600">Mania</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-600 hover:text-blue-600 relative group font-medium transition-colors">
                {link.label}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}

            <BecomeMentorLink />
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <ClerkLoading>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-10 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="w-28 h-10 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            </ClerkLoading>
            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard/student">
                <button className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer text-sm font-medium transition-colors">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal" forceRedirectUrl="/dashboard/student">
                <button className="px-5 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all cursor-pointer font-medium shadow-sm hover:shadow text-sm">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[60px] bg-white z-40 md:hidden overflow-y-auto border-t border-gray-100 shadow-xl"
              style={{ height: 'calc(100vh - 60px)' }}
            >
              <div className="flex flex-col p-4 space-y-6 pb-24">
                <div className="space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-lg font-medium text-gray-900 py-2 border-b border-gray-50"
                      onClick={closeMenu}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <BecomeMentorLink mobile />
                </div>

                <SignedOut>
                  <div className="pt-4 flex flex-col gap-3">
                    <SignInButton mode="modal" forceRedirectUrl="/dashboard/student">
                      <button className="w-full py-3 rounded-lg text-gray-700 bg-gray-100 font-semibold active:bg-gray-200">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal" forceRedirectUrl="/dashboard/student">
                      <button className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md active:bg-blue-700">
                        Get Started
                      </button>
                    </SignUpButton>
                  </div>
                </SignedOut>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}