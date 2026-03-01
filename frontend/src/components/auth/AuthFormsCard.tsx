"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User, ChevronRight, ArrowRight } from "lucide-react";

export type AuthView = "sign-in" | "sign-up-student" | "sign-up-mentor";

interface AuthFormsCardProps {
    initialView: AuthView;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function AuthFormsCard({ initialView }: AuthFormsCardProps) {
    const [view, setView] = useState<AuthView>(initialView);
    const router = useRouter();
    const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") ?? "/";

    useEffect(() => {
        if (isSignedIn && isUserLoaded && user && !isRedirecting) {
            setIsRedirecting(true);
            const role = user.publicMetadata?.role as string | undefined;
            if (role === "mentor" && redirectUrl === "/") {
                router.push("/mentor/profile");
            } else {
                router.push(redirectUrl);
            }
        }
    }, [isSignedIn, isUserLoaded, user, redirectUrl, isRedirecting, router]);

    // ---- Sign In State ----
    const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");
    const [showSignInPassword, setShowSignInPassword] = useState(false);
    const [signInError, setSignInError] = useState("");
    const [isSignInLoading, setIsSignInLoading] = useState(false);

    // ---- Sign Up State ----
    const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [showSignUpPassword, setShowSignUpPassword] = useState(false);
    const [signUpError, setSignUpError] = useState("");
    const [isSignUpLoading, setIsSignUpLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [code, setCode] = useState("");

    const isSignIn = view === "sign-in";

    const switchView = (newView: AuthView) => {
        if (verifying) return;
        setView(newView);
        setSignInError("");
        setSignUpError("");
    };

    // ---- Handlers ----
    const handleSignInSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignInLoaded) return;
        setIsSignInLoading(true);
        setSignInError("");
        try {
            const result = await signIn.create({ identifier: signInEmail, password: signInPassword });
            if (result.status === "complete") {
                await setSignInActive({ session: result.createdSessionId });
            } else {
                setSignInError("Sign in requires further verification.");
                setIsSignInLoading(false);
            }
        } catch (err: any) {
            const errorCode = err.errors?.[0]?.code;
            if (errorCode === "form_identifier_not_found") {
                setSignUpEmail(signInEmail);
                switchView("sign-up-student");
                setSignUpError("No account found with this email. Please create one.");
            } else {
                setSignInError(err.errors?.[0]?.longMessage || "Failed to sign in.");
            }
            setIsSignInLoading(false);
        }
    };

    const handleSignInGoogle = () => {
        if (!isSignInLoaded) return;
        signIn.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: `/sign-in?redirect=${encodeURIComponent(redirectUrl)}`,
        });
    };

    const handleSignUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignUpLoaded) return;
        setIsSignUpLoading(true);
        setSignUpError("");
        try {
            await signUp.create({ firstName, lastName, emailAddress: signUpEmail, password: signUpPassword });
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setVerifying(true);
        } catch (err: any) {
            const errorCode = err.errors?.[0]?.code;
            if (errorCode === "form_identifier_exists") {
                setSignInEmail(signUpEmail);
                switchView("sign-in");
                setSignInError("Account already exists with this email. Please sign in.");
            } else {
                setSignUpError(err.errors?.[0]?.longMessage || "Failed to create account.");
            }
        } finally {
            setIsSignUpLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignUpLoaded) return;
        setIsSignUpLoading(true);
        setSignUpError("");
        try {
            const result = await signUp.attemptEmailAddressVerification({ code });
            if (result.status === "complete") {
                await setSignUpActive({ session: result.createdSessionId });
                router.push(view === "sign-up-mentor" ? "/onboarding/profile/basic-info" : "/profile");
            } else {
                setSignUpError("Verification incomplete. Please try again.");
            }
        } catch (err: any) {
            setSignUpError(err.errors?.[0]?.longMessage || "Invalid verification code.");
        } finally {
            setIsSignUpLoading(false);
        }
    };

    const handleSignUpGoogle = () => {
        if (!isSignUpLoaded) return;
        signUp.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: view === "sign-up-mentor" ? "/onboarding/profile/basic-info" : "/profile",
        });
    };

    // ---- Shared UI ----
    const GoogleIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.71 17.59V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
            <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.59C14.72 18.25 13.46 18.66 12 18.66C9.17 18.66 6.78 16.75 5.92 14.2H2.23V17.06C4.03 20.64 7.74 23 12 23Z" fill="#34A853" />
            <path d="M5.92 14.2C5.70 13.54 5.58 12.79 5.58 12C5.58 11.21 5.70 10.46 5.92 9.8V6.94H2.23C1.49 8.41 1.06 10.15 1.06 12C1.06 13.85 1.49 15.59 2.23 17.06L5.92 14.2Z" fill="#FBBC05" />
            <path d="M12 5.34C13.62 5.34 15.06 5.9 16.21 7.01L19.36 3.86C17.45 2.08 14.97 1 12 1C7.74 1 4.03 3.36 2.23 6.94L5.92 9.8C6.78 7.25 9.17 5.34 12 5.34Z" fill="#EA4335" />
        </svg>
    );

    const inputClass = "w-full h-[50px] pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/25 focus:border-[#1DA1F2] transition-all duration-200 text-sm";

    return (
        <div className="w-full space-y-3">

            {/* ===== SIGN IN ACCORDION CARD ===== */}
            <motion.div
                transition={{ duration: 0.55, ease: EASE }}
                className={`rounded-2xl border overflow-hidden transition-colors duration-300 ${isSignIn
                    ? "border-[#1DA1F2]/30 shadow-[0_0_0_3px_rgba(29,161,242,0.08)] bg-white"
                    : "border-slate-200 bg-white/70"
                    }`}
            >
                {/* Card Header - always visible */}
                <button
                    type="button"
                    onClick={() => switchView("sign-in")}
                    className="w-full flex items-center justify-between px-6 py-4 cursor-pointer group"
                >
                    <div className="flex items-center gap-3">

                        <div className="text-left">
                            <p className={`font-semibold text-[15px] transition-colors duration-200 ${isSignIn ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"}`}>
                                Sign In
                            </p>
                            {!isSignIn && (
                                <p className="text-xs text-slate-400 mt-0.5">Already have an account?</p>
                            )}
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: isSignIn ? 90 : 0, opacity: isSignIn ? 0 : 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronRight className={`w-4 h-4 transition-colors duration-200 ${isSignIn ? "text-transparent" : "text-slate-400 group-hover:text-slate-600"}`} />
                    </motion.div>
                </button>

                {/* Expanded Sign In Content */}
                <AnimatePresence initial={false}>
                    {isSignIn && (
                        <motion.div
                            key="signin-body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.55, ease: EASE }}
                            className="overflow-hidden"
                        >
                            <div className="px-6 pb-6 space-y-4">
                                {/* Google Button */}
                                <button
                                    type="button"
                                    onClick={handleSignInGoogle}
                                    className="w-full h-[46px] flex items-center justify-center gap-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all duration-200 text-sm font-medium text-slate-700 hover:shadow-sm cursor-pointer"
                                >
                                    <GoogleIcon />
                                    Continue with Google
                                </button>

                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-px bg-slate-200" />
                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">or</span>
                                    <div className="flex-1 h-px bg-slate-200" />
                                </div>

                                <form onSubmit={handleSignInSubmit} className="space-y-3">
                                    {signInError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-red-50 text-red-600 px-3 py-2.5 rounded-lg text-xs font-medium border border-red-100"
                                        >
                                            {signInError}
                                        </motion.div>
                                    )}
                                    <div className="relative flex items-center">
                                        <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                        <input type="email" value={signInEmail} onChange={e => setSignInEmail(e.target.value)} placeholder="Email address" className={inputClass} required />
                                    </div>
                                    <div className="relative flex items-center">
                                        <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                        <input type={showSignInPassword ? "text" : "password"} value={signInPassword} onChange={e => setSignInPassword(e.target.value)} placeholder="Password" className={`${inputClass} pr-11`} required />
                                        <button type="button" onClick={() => setShowSignInPassword(!showSignInPassword)} className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                                            {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <div className="flex justify-end">
                                        <Link href="#" className="text-[#1DA1F2] text-xs font-medium hover:underline">Forgot password?</Link>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isSignInLoading}
                                        className="w-full h-[46px] bg-[#1DA1F2] hover:bg-[#1a90d9] text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md disabled:opacity-60"
                                    >
                                        {isSignInLoading ? "Signing in..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ===== SIGN UP ACCORDION CARD ===== */}
            <motion.div
                transition={{ duration: 0.55, ease: EASE }}
                className={`rounded-2xl border overflow-hidden transition-colors duration-300 ${!isSignIn
                    ? "border-[#1DA1F2]/30 shadow-[0_0_0_3px_rgba(29,161,242,0.08)] bg-white"
                    : "border-slate-200 bg-white/70"
                    }`}
            >
                {/* Card Header - always visible */}
                <button
                    type="button"
                    onClick={() => switchView("sign-up-student")}
                    className="w-full flex items-center justify-between px-6 py-4 cursor-pointer group"
                >
                    <div className="flex items-center gap-3">

                        <div className="text-left">
                            <p className={`font-semibold text-[15px] transition-colors duration-200 ${!isSignIn ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"}`}>
                                Create Account
                            </p>
                            {isSignIn && (
                                <p className="text-xs text-slate-400 mt-0.5">New to MentoMania?</p>
                            )}
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: !isSignIn ? 90 : 0, opacity: !isSignIn ? 0 : 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronRight className={`w-4 h-4 transition-colors duration-200 ${!isSignIn ? "text-transparent" : "text-slate-400 group-hover:text-slate-600"}`} />
                    </motion.div>
                </button>

                {/* Expanded Sign Up Content */}
                <AnimatePresence initial={false}>
                    {!isSignIn && (
                        <motion.div
                            key="signup-body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.55, ease: EASE }}
                            className="overflow-hidden"
                        >
                            <div className="px-6 pb-6 space-y-4">

                                {/* OTP Verification view */}
                                {verifying ? (
                                    <form onSubmit={handleVerify} className="space-y-4">
                                        <div className="text-center py-2">
                                            <p className="text-sm text-slate-600 font-medium">Check your email</p>
                                            <p className="text-xs text-slate-400 mt-1">We sent a 6-digit code to <span className="font-semibold text-slate-600">{signUpEmail}</span></p>
                                        </div>
                                        {signUpError && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 text-red-600 px-3 py-2.5 rounded-lg text-xs font-medium border border-red-100">
                                                {signUpError}
                                            </motion.div>
                                        )}
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={e => setCode(e.target.value)}
                                            placeholder="Enter 6-digit code"
                                            className="w-full h-[50px] px-4 bg-white border border-slate-200 rounded-xl text-center text-xl tracking-[0.3em] font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/25 focus:border-[#1DA1F2] transition-all"
                                            maxLength={6}
                                            required
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                            type="submit" disabled={isSignUpLoading || code.length < 6}
                                            className="w-full h-[46px] bg-[#1DA1F2] hover:bg-[#1a90d9] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                                        >
                                            {isSignUpLoading ? "Verifying..." : "Verify Email"}
                                        </motion.button>
                                    </form>
                                ) : (
                                    <>
                                        {/* Role switcher */}
                                        <div className="flex w-full bg-slate-100 p-1 rounded-xl">
                                            {(["sign-up-student", "sign-up-mentor"] as const).map((v) => (
                                                <button
                                                    key={v}
                                                    type="button"
                                                    onClick={() => switchView(v)}
                                                    className={`w-1/2 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${view === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                                >
                                                    {v === "sign-up-student" ? "Student" : "Mentor"}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Google Button */}
                                        <button
                                            type="button"
                                            onClick={handleSignUpGoogle}
                                            className="w-full h-[46px] flex items-center justify-center gap-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all duration-200 text-sm font-medium text-slate-700 hover:shadow-sm cursor-pointer"
                                        >
                                            <GoogleIcon />
                                            Continue with Google
                                        </button>

                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-px bg-slate-200" />
                                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">or</span>
                                            <div className="flex-1 h-px bg-slate-200" />
                                        </div>

                                        <form onSubmit={handleSignUpSubmit} className="space-y-3">
                                            {signUpError && (
                                                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 px-3 py-2.5 rounded-lg text-xs font-medium border border-red-100">
                                                    {signUpError}
                                                </motion.div>
                                            )}
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="relative flex items-center">
                                                    <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" className={inputClass} required />
                                                </div>
                                                <div className="relative flex items-center">
                                                    <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" className={inputClass} required />
                                                </div>
                                            </div>
                                            <div className="relative flex items-center">
                                                <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                                <input type="email" value={signUpEmail} onChange={e => setSignUpEmail(e.target.value)} placeholder="Email address" className={inputClass} required />
                                            </div>
                                            <div className="relative flex items-center">
                                                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                                <input type={showSignUpPassword ? "text" : "password"} value={signUpPassword} onChange={e => setSignUpPassword(e.target.value)} placeholder="Create password" className={`${inputClass} pr-11`} required />
                                                <button type="button" onClick={() => setShowSignUpPassword(!showSignUpPassword)} className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                                                    {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                                type="submit" disabled={isSignUpLoading}
                                                className="w-full h-[46px] bg-[#1DA1F2] hover:bg-[#1a90d9] text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md disabled:opacity-60"
                                            >
                                                {isSignUpLoading ? "Creating account..." : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                                            </motion.button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Footer */}
            <p className="text-center text-[12px] text-slate-400 leading-relaxed font-medium pt-1">
                By continuing, you agree to our{" "}
                <Link href="#" className="underline hover:text-slate-600 transition-colors">Terms</Link>
                {" "}and{" "}
                <Link href="#" className="underline hover:text-slate-600 transition-colors">Privacy Policy</Link>.
            </p>
        </div>
    );
}
