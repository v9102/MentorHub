"use client";

import Link from "next/link";
import { SignedIn, SignedOut, ClerkLoading, useUser } from "@clerk/nextjs";
import { ProfileButton } from "@/shared/ui/ProfileButton";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const onboardingPath = "/onboarding/profile/basic-info";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state
    
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

  const handleMobileAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const isAnchor = href.startsWith("#") || href.includes("/#");
    if (!isAnchor) return;
    e.preventDefault();
    closeMenu();
    const id = href.split("#")[1];
    // Wait for drawer close animation + overflow unlock, then scroll
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const navLinks = [
    { href: "/mentors", label: "Find Mentors" },
    { href: pathname === "/" ? "#how-it-works" : "/#how-it-works", label: "How it Works" },
    { href: pathname === "/" ? "#about" : "/#about", label: "About" },
  ];

  const renderBecomeMentorLink = () => {
    const href = isSignedIn
      ? onboardingPath
      : `/sign-up/mentor?redirect=${encodeURIComponent(pathname === "/" ? "/" : pathname)}`;
    return (
      <Link href={href} className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-150">
        Become a Mentor
      </Link>
    );
  };

  // Hide Navbar on booking and auth pages
  if (
    pathname?.startsWith("/book/") ||
    pathname?.startsWith("/sign-in") ||
    pathname?.startsWith("/sign-up")
  ) {
    return null;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">

        {/* ── Mobile bar: always white glass ── */}
        <div
          className="md:hidden flex items-center justify-between h-14 px-4"
          style={{
            background: 'rgba(255, 255, 255, 0.97)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          <Link href="/" onClick={closeMenu}>
            <Image
              src="/mentomanialogo.png"
              alt="MentoMania"
              width={200}
              height={40}
              className="w-auto object-contain"
              style={{ height: '40px' }}
            />
          </Link>

          <div className="flex items-center gap-3">
            {/* Fixed-width auth slot — prevents CLS when Clerk resolves */}
            <div style={{ minWidth: '92px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <ClerkLoading>
                <div style={{
                  width: '92px', height: '34px',
                  borderRadius: '100px',
                  background: '#E2E8F0',
                  animation: 'pulse 1.5s ease infinite',
                }} />
              </ClerkLoading>
              <SignedIn>
                <ProfileButton />
              </SignedIn>
              <SignedOut>
                <Link
                  href={`/sign-up/student?redirect=${encodeURIComponent(pathname === "/" ? "/" : pathname)}`}
                  style={{
                    backgroundColor: '#2E5FFF',
                    color: 'white',
                    fontFamily: 'var(--font-dm-sans, sans-serif)',
                    fontWeight: 600,
                    fontSize: '13px',
                    padding: '8px 18px',
                    borderRadius: '100px',
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                  }}
                >
                  Get Started
                </Link>
              </SignedOut>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              style={{ color: '#0D1B3E', padding: '4px', lineHeight: 0, background: 'none', border: 'none' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 7H21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                <path d="M3 12H21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                <path d="M3 17H21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Desktop bar: full-width backdrop + inner max-w content ── */}
        {/* Backdrop fills the entire nav width (edge-to-edge) */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{
            background: isScrolled ? 'rgba(255, 255, 255, 0.92)' : 'transparent',
            backdropFilter: isScrolled ? 'blur(16px)' : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
            borderBottom: isScrolled ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid transparent',
            transition: 'background 0.25s ease, border-color 0.25s ease',
          }}
        />
        {/* Content row — max-width centred, sits above the backdrop */}
        <div className="hidden md:flex relative max-w-7xl mx-auto px-6 items-center justify-between h-16">
          <Link href="/">
            <Image
              src="/mentomanialogo.png"
              alt="MentoMania"
              width={200}
              height={44}
              className="w-auto object-contain"
              style={{ height: '44px' }}
              priority
            />
          </Link>

          <div className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-blue-600 font-medium"
                style={{ transition: 'color 0.15s ease' }}
              >
                {link.label}
              </Link>
            ))}
            {renderBecomeMentorLink()}
          </div>

          <div className="flex items-center justify-end min-w-[240px]">
            <ClerkLoading>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-10 bg-gray-200 rounded-md animate-pulse" />
                <div className="w-28 h-10 bg-gray-200 rounded-md animate-pulse" />
              </div>
            </ClerkLoading>
            <SignedOut>
              <div className="flex items-center space-x-4">
                <Link
                  href={`/sign-in?redirect=${encodeURIComponent(pathname === "/" ? "/" : pathname)}`}
                  className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  href={`/sign-up/student?redirect=${encodeURIComponent(pathname === "/" ? "/" : pathname)}`}
                  className="px-5 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm whitespace-nowrap transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center justify-end">
                <ProfileButton />
              </div>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer (outside nav for clean stacking) ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark overlay — 20% left strip closes drawer on tap */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="fixed inset-0 bg-black/50 z-[60] md:hidden"
              onClick={closeMenu}
            />

            {/* Slide-in drawer — 80vw from right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-y-0 right-0 z-[70] md:hidden bg-white flex flex-col"
              style={{ width: '80vw' }}
            >
              {/* Header: logo + X */}
              <div
                className="flex items-center justify-between px-6 h-14 shrink-0"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
              >
                <Image
                  src="/mentomanialogo.png"
                  alt="MentoMania"
                  width={180}
                  height={40}
                  className="w-auto object-contain"
                  style={{ height: '40px' }}
                />
                <button
                  onClick={closeMenu}
                  aria-label="Close menu"
                  style={{
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '-8px',
                    color: '#6B7280',
                    flexShrink: 0,
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links — text only, no icons */}
              <div className="flex flex-col flex-1 px-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      handleMobileAnchorClick(e, link.href);
                      closeMenu();
                    }}
                    style={{
                      fontFamily: 'var(--font-dm-sans, sans-serif)',
                      fontWeight: 500,
                      fontSize: '17px',
                      color: '#0D1B3E',
                      padding: '26px 0',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                      display: 'block',
                      lineHeight: 1.3,
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                <SignedIn>
                  <Link
                    href={onboardingPath}
                    onClick={closeMenu}
                    style={{
                      fontFamily: 'var(--font-dm-sans, sans-serif)',
                      fontWeight: 500,
                      fontSize: '17px',
                      color: '#0D1B3E',
                      padding: '26px 0',
                      display: 'block',
                      lineHeight: 1.3,
                    }}
                  >
                    Become a Mentor
                  </Link>
                </SignedIn>
              </div>

              {/* Bottom: auth buttons for logged-out */}
              <SignedOut>
                <div className="px-6 pb-10 shrink-0 flex flex-col gap-3">
                  <Link
                    href={`/sign-up/student?redirect=${encodeURIComponent(pathname === "/" ? "/" : pathname)}`}
                    onClick={closeMenu}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '14px',
                      borderRadius: '12px',
                      backgroundColor: '#2E5FFF',
                      color: 'white',
                      fontFamily: 'var(--font-dm-sans, sans-serif)',
                      fontWeight: 600,
                      fontSize: '15px',
                      boxShadow: '0 4px 14px rgba(46, 95, 255, 0.3)',
                    }}
                  >
                    Get Started — It&apos;s Free
                  </Link>
                  <Link
                    href={`/sign-in?redirect=${encodeURIComponent(pathname === "/" ? "/" : pathname)}`}
                    onClick={closeMenu}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '13px',
                      borderRadius: '12px',
                      border: '1.5px solid #2E5FFF',
                      color: '#2E5FFF',
                      fontFamily: 'var(--font-dm-sans, sans-serif)',
                      fontWeight: 500,
                      fontSize: '15px',
                    }}
                  >
                    Log In
                  </Link>
                </div>
              </SignedOut>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}