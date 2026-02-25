"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants, useReducedMotion } from "framer-motion";
import { useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

export type AuthView = "sign-in" | "sign-up-student" | "sign-up-mentor";

interface AuthFormsCardProps {
    initialView: AuthView;
}

export default function AuthFormsCard({ initialView }: AuthFormsCardProps) {
    const [view, setView] = useState<AuthView>(initialView);
    const router = useRouter();
    const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
    const [isRedirecting, setIsRedirecting] = useState(false);

    // ----- Redirect Logic -----
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") ?? "/";

    useEffect(() => {
        if (isSignedIn && isUserLoaded && user && !isRedirecting) {
            setIsRedirecting(true);
            const role = user.publicMetadata?.role as string | undefined;
            if (role === "mentor" && redirectUrl === "/") {
                router.push("/dashboard/mentor");
            } else {
                router.push(redirectUrl);
            }
        }
    }, [isSignedIn, isUserLoaded, user, redirectUrl, isRedirecting, router]);

    // ----- Sign In State -----
    const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");
    const [showSignInPassword, setShowSignInPassword] = useState(false);
    const [signInError, setSignInError] = useState("");
    const [isSignInLoading, setIsSignInLoading] = useState(false);

    // ----- Sign Up State -----
    const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [showSignUpPassword, setShowSignUpPassword] = useState(false);
    const [signUpError, setSignUpError] = useState("");
    const [isSignUpLoading, setIsSignUpLoading] = useState(false);

    // OTP Verification State
    const [verifying, setVerifying] = useState(false);
    const [code, setCode] = useState("");

    // URL Sync intentionally removed: Next 14 intercepts window.history.replaceState 
    // and forces a hard page remount, destroying the Framer Motion animation tree. 
    // By keeping it isolated to state, the animation runs gracefully without unmounting the page wrapper.

    // +1 = going right (sign-in → sign-up), -1 = going left (sign-up → sign-in)
    const direction = useRef(1);

    // Tab switching handler
    const switchView = (newView: AuthView) => {
        // Prevent switching if currently verifying OTP
        if (verifying) return;
        // Set slide direction before updating view
        direction.current = newView === "sign-in" ? -1 : 1;
        setView(newView);
        // Clear errors when switching
        setSignInError("");
        setSignUpError("");
    };

    // ----- Sign In Handlers -----
    const handleSignInSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignInLoaded) return;
        setIsSignInLoading(true);
        setSignInError("");

        try {
            const result = await signIn.create({
                identifier: signInEmail,
                password: signInPassword,
            });

            if (result.status === "complete") {
                await setSignInActive({ session: result.createdSessionId });
                // Deliberately avoiding setIsSignInLoading(false) here to prevent form flash while useEffect redirects
            } else {
                console.log(result);
                setSignInError("Sign in requires further verification.");
                setIsSignInLoading(false);
            }
        } catch (err: any) {
            setSignInError(err.errors?.[0]?.longMessage || "Failed to sign in. Please check your credentials.");
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

    // ----- Sign Up Handlers -----
    const handleSignUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignUpLoaded) return;
        setIsSignUpLoading(true);
        setSignUpError("");

        try {
            await signUp.create({
                firstName,
                lastName,
                emailAddress: signUpEmail,
                password: signUpPassword,
            });

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setVerifying(true);
            setSignUpError("");
        } catch (err: any) {
            setSignUpError(err.errors?.[0]?.longMessage || "Failed to create account. Please try again.");
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
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status === "complete") {
                await setSignUpActive({ session: completeSignUp.createdSessionId });
                const dest = view === "sign-up-mentor" ? "/onboarding/profile/basic-info" : "/dashboard/student/dashboard";
                router.push(dest);
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2));
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
        const dest = view === "sign-up-mentor" ? "/onboarding/profile/basic-info" : "/dashboard/student/dashboard";
        signUp.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: dest,
        });
    };

    // --- Animation Variants ---
    // Slide direction: +1 = slide in from right (login→signup), -1 = slide in from left (signup→login)
    const SLIDE_DISTANCE = 60;
    const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

    const slideVariants: Variants = {
        enter: (dir: number) => ({
            x: dir * SLIDE_DISTANCE,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.65, ease: EASE, staggerChildren: 0.07 },
        },
        exit: (dir: number) => ({
            x: dir * -SLIDE_DISTANCE,
            opacity: 0,
            transition: { duration: 0.45, ease: "easeIn" },
        }),
    };

    const itemVariants: Variants = {
        enter: { opacity: 0, y: 10 },
        center: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
        exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
    };
    return (
        <motion.div layout transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="w-full sm:w-[400px]">

            {/* Header logic depending on state */}
            <motion.div layout="position" transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <h1 className="text-[32px] font-extrabold text-[#0f172a] tracking-tight mb-2">
                    {view === "sign-in" ? "Welcome back" : "Create your account"}
                </h1>
                <p className="text-slate-500 text-[15px] mb-8">
                    {verifying
                        ? "Enter the verification code sent to your email"
                        : view === "sign-in"
                            ? "Please enter your details to continue"
                            : `Please enter your details to sign up as a ${view === "sign-up-mentor" ? "mentor" : "student"}`
                    }
                </p>
            </motion.div>

            {/* Shared Tabs (Hidden if verifying OTP) */}
            {!verifying && (
                <motion.div layout="position" transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="flex w-full border-b border-slate-200 mb-8 relative">
                    {/* Background underline track */}
                    <div className="absolute bottom-0 w-full h-[2px] bg-transparent" />

                    <button
                        type="button"
                        onClick={() => switchView("sign-in")}
                        className="w-1/2 flex justify-center pb-3 relative hover:text-slate-900 transition-colors"
                    >
                        <span className={view === "sign-in" ? "text-[#1DA1F2] font-semibold text-[15px]" : "text-slate-500 font-medium text-[15px]"}>
                            Login
                        </span>
                        {view === "sign-in" && (
                            <motion.div
                                layoutId="activeTabUnderline"
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute left-0 right-0 bottom-[-1px] h-[2px] bg-[#1DA1F2]"
                            />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => switchView(view === "sign-in" ? "sign-up-student" : view)} // If currently on mentor/student sign up, stay on it, otherwise default to student sign up
                        className="w-1/2 flex justify-center pb-3 relative hover:text-slate-900 transition-colors"
                    >
                        <span className={view !== "sign-in" ? "text-[#1DA1F2] font-semibold text-[15px]" : "text-slate-500 font-medium text-[15px]"}>
                            Sign Up
                        </span>
                        {view !== "sign-in" && (
                            <motion.div
                                layoutId="activeTabUnderline"
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute left-0 right-0 bottom-[-1px] h-[2px] bg-[#1DA1F2]"
                            />
                        )}
                    </button>
                </motion.div>
            )}

            {/* Main Form Content Area - Animate Presence handles crossfading */}
            <motion.div layout className="relative overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false} custom={direction.current}>

                    {verifying && (
                        <motion.form
                            key="verify-form"
                            custom={direction.current}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            onSubmit={handleVerify}
                            className="space-y-5"
                        >
                            {signUpError && (
                                <motion.div variants={itemVariants} initial="enter" animate="center" exit="exit" className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 font-medium">
                                    {signUpError}
                                </motion.div>
                            )}

                            <motion.div variants={itemVariants} initial="enter" animate="center" exit="exit" className="space-y-2">
                                <label className="text-slate-800 font-semibold text-sm">Verification Code</label>
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="Enter 6-digit code"
                                        className="w-full h-[52px] px-4 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/20 focus:border-[#1DA1F2] transition-all tracking-widest text-center text-xl"
                                        required
                                    />
                                </div>
                            </motion.div>

                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSignUpLoading}
                                className="w-full h-[52px] bg-[#1DA1F2] hover:bg-[#1a90d9] text-white font-semibold rounded-2xl transition-all duration-200 mt-4 cursor-pointer shadow-sm hover:shadow-md"
                            >
                                {isSignUpLoading ? "Verifying..." : "Verify Email"}
                            </motion.button>
                        </motion.form>
                    )}

                    {!verifying && view === "sign-in" && (
                        <motion.div
                            key="login-form"
                            custom={direction.current}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                        >
                            <form onSubmit={handleSignInSubmit} className="space-y-5">
                                {signInError && (
                                    <motion.div variants={itemVariants} className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 font-medium">
                                        {signInError}
                                    </motion.div>
                                )}

                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="text-slate-800 font-semibold text-sm">Email Address</label>
                                    <div className="relative flex items-center group">
                                        <Mail className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-[#1DA1F2] transition-colors duration-200" />
                                        <input
                                            type="email"
                                            value={signInEmail}
                                            onChange={(e) => setSignInEmail(e.target.value)}
                                            placeholder="name@university.edu"
                                            className="w-full h-[52px] pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/20 focus:border-[#1DA1F2] transition-all duration-200"
                                            required
                                        />
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="space-y-2 relative">
                                    <div className="flex justify-between items-center">
                                        <label className="text-slate-800 font-semibold text-sm">Password</label>
                                        <Link href="#" className="text-[#1DA1F2] text-[13px] font-medium hover:underline transition-all">Forgot password?</Link>
                                    </div>
                                    <div className="relative flex items-center group">
                                        <Lock className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-[#1DA1F2] transition-colors duration-200" />
                                        <input
                                            type={showSignInPassword ? "text" : "password"}
                                            value={signInPassword}
                                            onChange={(e) => setSignInPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full h-[52px] pl-12 pr-12 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/20 focus:border-[#1DA1F2] transition-all duration-200 tracking-widest"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSignInPassword(!showSignInPassword)}
                                            className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors duration-200 cursor-pointer"
                                        >
                                            {showSignInPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </motion.div>

                                <motion.button
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSignInLoading}
                                    className="w-full h-[52px] bg-[#1DA1F2] hover:bg-[#1a90d9] text-white font-semibold rounded-2xl transition-all duration-200 mt-4 cursor-pointer shadow-sm hover:shadow-md"
                                >
                                    {isSignInLoading ? "Signing in..." : "Sign In"}
                                </motion.button>
                            </form>

                            <div className="flex items-center my-8">
                                <div className="flex-1 border-t border-slate-200"></div>
                                <span className="px-4 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Or continue with</span>
                                <div className="flex-1 border-t border-slate-200"></div>
                            </div>

                            <motion.div variants={itemVariants} className="w-full mb-8">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={handleSignInGoogle}
                                    className="w-full h-[52px] flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 transition-all duration-200 rounded-2xl cursor-pointer hover:shadow-sm"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.71 17.59V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                                        <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.59C14.72 18.25 13.46 18.66 12 18.66C9.17 18.66 6.78 16.75 5.92 14.2H2.23V17.06C4.03 20.64 7.74 23 12 23Z" fill="#34A853" />
                                        <path d="M5.92 14.2C5.70 13.54 5.58 12.79 5.58 12C5.58 11.21 5.70 10.46 5.92 9.8V6.94H2.23C1.49 8.41 1.06 10.15 1.06 12C1.06 13.85 1.49 15.59 2.23 17.06L5.92 14.2Z" fill="#FBBC05" />
                                        <path d="M12 5.34C13.62 5.34 15.06 5.9 16.21 7.01L19.36 3.86C17.45 2.08 14.97 1 12 1C7.74 1 4.03 3.36 2.23 6.94L5.92 9.8C6.78 7.25 9.17 5.34 12 5.34Z" fill="#EA4335" />
                                    </svg>
                                    <span className="font-semibold text-slate-700 text-[15px]">Google</span>
                                </motion.button>
                            </motion.div>

                            <div className="text-center w-full px-6">
                                <p className="text-[13px] text-slate-400 leading-relaxed font-medium">
                                    By continuing, you agree to Mentomania's <Link href="#" className="underline hover:text-slate-600 transition-colors">Terms of Service</Link> and <Link href="#" className="underline hover:text-slate-600 transition-colors">Privacy Policy</Link>.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {!verifying && (view === "sign-up-student" || view === "sign-up-mentor") && (
                        <motion.div
                            key="signup-form"
                            custom={direction.current}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                        >
                            {/* Role Switcher if they want to swap between student and mentor natively */}
                            <motion.div variants={itemVariants} className="flex w-full bg-slate-100 p-1 rounded-xl mb-6">
                                <button
                                    type="button"
                                    onClick={() => switchView("sign-up-student")}
                                    className={`w-1/2 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${view === "sign-up-student" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => switchView("sign-up-mentor")}
                                    className={`w-1/2 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${view === "sign-up-mentor" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                >
                                    Mentor
                                </button>
                            </motion.div>

                            <form onSubmit={handleSignUpSubmit} className="space-y-5">
                                {signUpError && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 font-medium">
                                        {signUpError}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <label className="text-slate-800 font-semibold text-sm">First Name</label>
                                        <div className="relative flex items-center group">
                                            <User className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-[#1DA1F2] transition-colors duration-200" />
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                placeholder="Jane"
                                                className="w-full h-[52px] pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/20 focus:border-[#1DA1F2] transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <label className="text-slate-800 font-semibold text-sm">Last Name</label>
                                        <div className="relative flex items-center group">
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                placeholder="Doe"
                                                className="w-full h-[52px] px-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/20 focus:border-[#1DA1F2] transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    </motion.div>
                                </div>

                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="text-slate-800 font-semibold text-sm">Email Address</label>
                                    <div className="relative flex items-center group">
                                        <Mail className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-[#1DA1F2] transition-colors duration-200" />
                                        <input
                                            type="email"
                                            value={signUpEmail}
                                            onChange={(e) => setSignUpEmail(e.target.value)}
                                            placeholder="name@university.edu"
                                            className="w-full h-[52px] pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/20 focus:border-[#1DA1F2] transition-all duration-200"
                                            required
                                        />
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="space-y-2 relative">
                                    <label className="text-slate-800 font-semibold text-sm">Password</label>
                                    <div className="relative flex items-center group">
                                        <Lock className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-[#1DA1F2] transition-colors duration-200" />
                                        <input
                                            type={showSignUpPassword ? "text" : "password"}
                                            value={signUpPassword}
                                            onChange={(e) => setSignUpPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full h-[52px] pl-12 pr-12 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/20 focus:border-[#1DA1F2] transition-all duration-200 tracking-widest"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                                            className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors duration-200 cursor-pointer"
                                        >
                                            {showSignUpPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </motion.div>

                                <motion.button
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSignUpLoading}
                                    className="w-full h-[52px] bg-[#1DA1F2] hover:bg-[#1a90d9] text-white font-semibold rounded-2xl transition-all duration-200 mt-4 cursor-pointer shadow-sm hover:shadow-md"
                                >
                                    {isSignUpLoading ? "Signing up..." : "Sign Up"}
                                </motion.button>
                            </form>

                            <div className="flex items-center my-8">
                                <div className="flex-1 border-t border-slate-200"></div>
                                <span className="px-4 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Or continue with</span>
                                <div className="flex-1 border-t border-slate-200"></div>
                            </div>

                            <motion.div variants={itemVariants} className="w-full mb-8">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={handleSignUpGoogle}
                                    className="w-full h-[52px] flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 transition-all duration-200 rounded-2xl cursor-pointer hover:shadow-sm"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.71 17.59V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                                        <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.59C14.72 18.25 13.46 18.66 12 18.66C9.17 18.66 6.78 16.75 5.92 14.2H2.23V17.06C4.03 20.64 7.74 23 12 23Z" fill="#34A853" />
                                        <path d="M5.92 14.2C5.70 13.54 5.58 12.79 5.58 12C5.58 11.21 5.70 10.46 5.92 9.8V6.94H2.23C1.49 8.41 1.06 10.15 1.06 12C1.06 13.85 1.49 15.59 2.23 17.06L5.92 14.2Z" fill="#FBBC05" />
                                        <path d="M12 5.34C13.62 5.34 15.06 5.9 16.21 7.01L19.36 3.86C17.45 2.08 14.97 1 12 1C7.74 1 4.03 3.36 2.23 6.94L5.92 9.8C6.78 7.25 9.17 5.34 12 5.34Z" fill="#EA4335" />
                                    </svg>
                                    <span className="font-semibold text-slate-700 text-[15px]">Google</span>
                                </motion.button>
                            </motion.div>

                            <div className="text-center w-full px-6">
                                <p className="text-[13px] text-slate-400 leading-relaxed font-medium">
                                    By continuing, you agree to Mentomania's <Link href="#" className="underline hover:text-slate-600 transition-colors">Terms of Service</Link> and <Link href="#" className="underline hover:text-slate-600 transition-colors">Privacy Policy</Link>.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
