"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User, ChevronRight, ArrowRight, Loader2 } from "lucide-react";

export type AuthView = "sign-in" | "sign-up-student" | "sign-up-mentor";

interface AuthFormsCardProps {
    initialView: AuthView;
}

// ============ TYPES ============
interface FieldErrors {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    general?: string;
}

interface AuthErrorResult {
    field: keyof FieldErrors;
    message: string;
    showSignUpLink?: boolean;
    showSignInLink?: boolean;
}

// ============ HELPER FUNCTIONS ============

/** Validate email format */
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

/** Parse Clerk error and return user-friendly message with action links */
const parseAuthError = (err: unknown, context: "sign-in" | "sign-up"): AuthErrorResult => {
    const error = err as { errors?: Array<{ code?: string; longMessage?: string; message?: string }> };
    const errorCode = error.errors?.[0]?.code;
    const errorMessage = error.errors?.[0]?.longMessage || error.errors?.[0]?.message || "";

    if (context === "sign-in") {
        // User not found - suggest signup
        if (errorCode === "form_identifier_not_found" || errorMessage.includes("not found") || errorMessage.includes("Couldn't find")) {
            return {
                field: "email",
                message: "No account found with this email.",
                showSignUpLink: true,
            };
        }
        // Wrong password
        if (errorCode === "form_password_incorrect" || errorMessage.includes("password") || errorMessage.includes("incorrect")) {
            return {
                field: "password",
                message: "Incorrect password. Please try again.",
            };
        }
    }

    if (context === "sign-up") {
        // Email already exists - suggest signin
        if (errorCode === "form_identifier_exists" || errorMessage.includes("already exists") || errorMessage.includes("already taken") || errorMessage.includes("already in use")) {
            return {
                field: "email",
                message: "This account already exists.",
                showSignInLink: true,
            };
        }
        // Weak/compromised password
        if (errorCode === "form_password_pwned" || errorCode === "form_password_length_too_short") {
            return {
                field: "password",
                message: "Password is too weak. Please choose a stronger password.",
            };
        }
    }

    // Generic error
    return {
        field: "general",
        message: errorMessage || "Something went wrong. Please try again.",
    };
};

// ============ ERROR MESSAGE COMPONENT ============
interface InlineErrorProps {
    message: string;
    showSignUpLink?: boolean;
    showSignInLink?: boolean;
    onSwitchToSignUp?: () => void;
    onSwitchToSignIn?: () => void;
}

const InlineError = ({ message, showSignUpLink, showSignInLink, onSwitchToSignUp, onSwitchToSignIn }: InlineErrorProps) => (
    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 flex-wrap">
        <span>{message}</span>
        {showSignUpLink && onSwitchToSignUp && (
            <button
                type="button"
                onClick={onSwitchToSignUp}
                className="text-[#1DA1F2] hover:underline font-medium cursor-pointer"
            >
                Create one?
            </button>
        )}
        {showSignInLink && onSwitchToSignIn && (
            <button
                type="button"
                onClick={onSwitchToSignIn}
                className="text-[#1DA1F2] hover:underline font-medium cursor-pointer"
            >
                Login instead
            </button>
        )}
    </p>
);

// ============ EXTENDED FIELD ERRORS TYPE ============
interface ExtendedFieldErrors extends FieldErrors {
    _showSignUpLink?: boolean;
    _showSignInLink?: boolean;
}

// ============ MAIN COMPONENT ============
function AuthFormsCardInner({ initialView }: AuthFormsCardProps) {
    const [view, setView] = useState<AuthView>(initialView);
    const router = useRouter();
    const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") ?? "/";

    // Redirect on successful auth
    useEffect(() => {
        if (isSignedIn && isUserLoaded && user && !isRedirecting) {
            setIsRedirecting(true);
            router.replace(redirectUrl);
        }
    }, [isSignedIn, isUserLoaded, user, redirectUrl, isRedirecting, router]);

    // ---- Sign In State ----
    const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");
    const [showSignInPassword, setShowSignInPassword] = useState(false);
    const [signInErrors, setSignInErrors] = useState<ExtendedFieldErrors>({});
    const [isSignInLoading, setIsSignInLoading] = useState(false);

    // ---- Sign Up State ----
    const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [showSignUpPassword, setShowSignUpPassword] = useState(false);
    const [signUpErrors, setSignUpErrors] = useState<ExtendedFieldErrors>({});
    const [isSignUpLoading, setIsSignUpLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [code, setCode] = useState("");
    const [verifyError, setVerifyError] = useState("");

    const isSignIn = view === "sign-in";

    // ---- Clear errors on input change ----
    const handleSignInEmailChange = useCallback((value: string) => {
        setSignInEmail(value);
        if (signInErrors.email || signInErrors._showSignUpLink) {
            setSignInErrors(prev => ({ ...prev, email: undefined, _showSignUpLink: undefined }));
        }
    }, [signInErrors.email, signInErrors._showSignUpLink]);

    const handleSignInPasswordChange = useCallback((value: string) => {
        setSignInPassword(value);
        if (signInErrors.password) {
            setSignInErrors(prev => ({ ...prev, password: undefined }));
        }
    }, [signInErrors.password]);

    const handleSignUpEmailChange = useCallback((value: string) => {
        setSignUpEmail(value);
        if (signUpErrors.email || signUpErrors._showSignInLink) {
            setSignUpErrors(prev => ({ ...prev, email: undefined, _showSignInLink: undefined }));
        }
    }, [signUpErrors.email, signUpErrors._showSignInLink]);

    const handleSignUpPasswordChange = useCallback((value: string) => {
        setSignUpPassword(value);
        if (signUpErrors.password) {
            setSignUpErrors(prev => ({ ...prev, password: undefined }));
        }
    }, [signUpErrors.password]);

    const handleFirstNameChange = useCallback((value: string) => {
        setFirstName(value);
        if (signUpErrors.firstName) {
            setSignUpErrors(prev => ({ ...prev, firstName: undefined }));
        }
    }, [signUpErrors.firstName]);

    const handleLastNameChange = useCallback((value: string) => {
        setLastName(value);
        if (signUpErrors.lastName) {
            setSignUpErrors(prev => ({ ...prev, lastName: undefined }));
        }
    }, [signUpErrors.lastName]);

    // ---- View Switching ----
    const switchView = useCallback((newView: AuthView) => {
        if (verifying) return;
        setView(newView);
        setSignInErrors({});
        setSignUpErrors({});
    }, [verifying]);

    const switchToSignIn = useCallback(() => {
        switchView("sign-in");
        // Pre-fill email if available
        if (signUpEmail) {
            setSignInEmail(signUpEmail);
        }
    }, [switchView, signUpEmail]);

    const switchToSignUp = useCallback(() => {
        switchView("sign-up-student");
        // Pre-fill email if available
        if (signInEmail) {
            setSignUpEmail(signInEmail);
        }
    }, [switchView, signInEmail]);

    // ---- Sign In Handler ----
    const handleSignInSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Prevent double submission
        if (isSignInLoading || !isSignInLoaded) return;
        
        setSignInErrors({});

        // Client-side email validation
        const trimmedEmail = signInEmail.trim();
        if (!trimmedEmail) {
            setSignInErrors({ email: "Email is required" });
            return;
        }
        if (!isValidEmail(trimmedEmail)) {
            setSignInErrors({ email: "Please enter a valid email address" });
            return;
        }
        if (!signInPassword) {
            setSignInErrors({ password: "Password is required" });
            return;
        }

        setIsSignInLoading(true);

        try {
            const result = await signIn.create({ 
                identifier: trimmedEmail, 
                password: signInPassword 
            });
            
            if (result.status === "complete") {
                await setSignInActive({ session: result.createdSessionId });
                // Redirect handled by useEffect
            } else {
                setSignInErrors({ general: "Sign in requires further verification." });
                setIsSignInLoading(false);
            }
        } catch (err: unknown) {
            const errorResult = parseAuthError(err, "sign-in");
            setSignInErrors({
                [errorResult.field]: errorResult.message,
                _showSignUpLink: errorResult.showSignUpLink,
            });
            setIsSignInLoading(false);
        }
    };

    const handleSignInGoogle = () => {
        if (!isSignInLoaded || isSignInLoading) return;
        signIn.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: redirectUrl,
        });
    };

    // Sign Up Handler 
    const handleSignUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Prevent double submission
        if (isSignUpLoading || !isSignUpLoaded) return;
        
        setSignUpErrors({});

        // Client-side validation
        const errors: FieldErrors = {};
        
        if (!firstName.trim()) {
            errors.firstName = "First name is required";
        }
        if (!lastName.trim()) {
            errors.lastName = "Last name is required";
        }
        
        const trimmedEmail = signUpEmail.trim();
        if (!trimmedEmail) {
            errors.email = "Email is required";
        } else if (!isValidEmail(trimmedEmail)) {
            errors.email = "Please enter a valid email address";
        }
        
        if (!signUpPassword) {
            errors.password = "Password is required";
        } else if (signUpPassword.length < 8) {
            errors.password = "Password must be at least 8 characters";
        }

        if (Object.keys(errors).length > 0) {
            setSignUpErrors(errors);
            return;
        }

        setIsSignUpLoading(true);

        try {
            await signUp.create({ 
                firstName: firstName.trim(), 
                lastName: lastName.trim(), 
                emailAddress: trimmedEmail, 
                password: signUpPassword 
            });
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setVerifying(true);
        } catch (err: unknown) {
            const errorResult = parseAuthError(err, "sign-up");
            setSignUpErrors({
                [errorResult.field]: errorResult.message,
                _showSignInLink: errorResult.showSignInLink,
            });
        } finally {
            setIsSignUpLoading(false);
        }
    };

    // Verify Handler 
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignUpLoaded || isSignUpLoading) return;
        
        setIsSignUpLoading(true);
        setVerifyError("");
        
        try {
            const result = await signUp.attemptEmailAddressVerification({ code });
            if (result.status === "complete") {
                await setSignUpActive({ session: result.createdSessionId });
                router.replace(view === "sign-up-mentor" ? "/onboarding/profile/basic-info" : "/");
            } else {
                setVerifyError("Verification incomplete. Please try again.");
                setIsSignUpLoading(false);
            }
        } catch (err: unknown) {
            const error = err as { errors?: Array<{ longMessage?: string }> };
            setVerifyError(error.errors?.[0]?.longMessage || "Invalid verification code.");
            setIsSignUpLoading(false);
        }
    };

    const handleSignUpGoogle = () => {
        if (!isSignUpLoaded || isSignUpLoading) return;
        const redirectTarget = view === "sign-up-mentor" ? "/onboarding/profile/basic-info" : "/";
        signUp.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: redirectTarget,
        });
    };

    // Shared UI Components
    const GoogleIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.71 17.59V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
            <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.59C14.72 18.25 13.46 18.66 12 18.66C9.17 18.66 6.78 16.75 5.92 14.2H2.23V17.06C4.03 20.64 7.74 23 12 23Z" fill="#34A853" />
            <path d="M5.92 14.2C5.70 13.54 5.58 12.79 5.58 12C5.58 11.21 5.70 10.46 5.92 9.8V6.94H2.23C1.49 8.41 1.06 10.15 1.06 12C1.06 13.85 1.49 15.59 2.23 17.06L5.92 14.2Z" fill="#FBBC05" />
            <path d="M12 5.34C13.62 5.34 15.06 5.9 16.21 7.01L19.36 3.86C17.45 2.08 14.97 1 12 1C7.74 1 4.03 3.36 2.23 6.94L5.92 9.8C6.78 7.25 9.17 5.34 12 5.34Z" fill="#EA4335" />
        </svg>
    );

    const baseInputClass = "w-full h-[50px] pl-11 pr-4 bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/25 focus:border-[#1DA1F2] transition-all duration-200 text-sm";
    const inputClass = (hasError?: boolean) => `${baseInputClass} ${hasError ? "border-red-300 focus:border-red-400 focus:ring-red-200/50" : "border-slate-200"}`;

    return (
        <div className="w-full space-y-3">

            <div
                className={`rounded-2xl border overflow-hidden transition-all duration-200 ${isSignIn
                    ? "border-[#1DA1F2]/30 shadow-[0_0_0_3px_rgba(29,161,242,0.08)] bg-white"
                    : "border-[#1DA1F2]/10 bg-[#1DA1F2]/[0.02] hover:border-[#1DA1F2]/25 hover:bg-[#1DA1F2]/[0.05] hover:shadow-sm"
                    }`}
            >
                <button
                    type="button"
                    onClick={() => switchView("sign-in")}
                    className="w-full flex items-center justify-between px-6 py-4 cursor-pointer group"
                >
                    <div className="flex items-center gap-3">
                        <div className="text-left">
                            <p className={`font-semibold text-[15px] transition-colors duration-200 ${isSignIn ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"}`}>
                                Sign In
                            </p>
                            {!isSignIn && (
                                <p className="text-xs text-slate-500 mt-0.5">Already have an account?</p>
                            )}
                        </div>
                    </div>
                    <div style={{ opacity: isSignIn ? 0 : 1 }}>
                        <ChevronRight className={`w-4 h-4 transition-colors duration-200 ${isSignIn ? "text-transparent" : "text-slate-400 group-hover:text-[#1DA1F2]"}`} />
                    </div>
                </button>

                {isSignIn && (
                    <div className="overflow-hidden">
                            <div className="px-6 pb-6 space-y-4">
                                {/* Google Button */}
                                <button
                                    type="button"
                                    onClick={handleSignInGoogle}
                                    disabled={isSignInLoading}
                                    className="w-full h-[46px] flex items-center justify-center gap-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all duration-200 text-sm font-medium text-slate-700 hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    {/* General Error */}
                                    {signInErrors.general && (
                                        <div className="bg-red-50 text-red-500 px-3 py-2.5 rounded-lg text-xs font-medium border border-red-100">
                                            {signInErrors.general}
                                        </div>
                                    )}

                                    {/* Email Field */}
                                    <div>
                                        <div className="relative flex items-center">
                                            <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                            <input 
                                                type="email" 
                                                value={signInEmail} 
                                                onChange={e => handleSignInEmailChange(e.target.value)} 
                                                placeholder="Email address" 
                                                className={inputClass(!!signInErrors.email)} 
                                                disabled={isSignInLoading}
                                                autoComplete="email"
                                            />
                                        </div>
                                        {signInErrors.email && (
                                            <InlineError 
                                                message={signInErrors.email}
                                                showSignUpLink={signInErrors._showSignUpLink}
                                                onSwitchToSignUp={switchToSignUp}
                                            />
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <div className="relative flex items-center">
                                            <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                            <input 
                                                type={showSignInPassword ? "text" : "password"} 
                                                value={signInPassword} 
                                                onChange={e => handleSignInPasswordChange(e.target.value)} 
                                                placeholder="Password" 
                                                className={`${inputClass(!!signInErrors.password)} pr-11`}
                                                disabled={isSignInLoading}
                                                autoComplete="current-password"
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowSignInPassword(!showSignInPassword)} 
                                                className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                                tabIndex={-1}
                                            >
                                                {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {signInErrors.password && (
                                            <InlineError message={signInErrors.password} />
                                        )}
                                    </div>

                                    <div className="flex justify-end">
                                        <Link href="#" className="text-[#1DA1F2] text-xs font-medium hover:underline">Forgot password?</Link>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSignInLoading}
                                        className="w-full h-[46px] bg-[#1DA1F2] hover:bg-[#1a90d9] text-white font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <span>{isSignInLoading ? "Signing in..." : "Sign In"}</span>
                                        {!isSignInLoading && <ArrowRight className="w-4 h-4" />}
                                    </button>
                                </form>
                            </div>
                    </div>
                )}
            </div>

            {/* ===== SIGN UP ACCORDION CARD ===== */}
            <div
                className={`rounded-2xl border overflow-hidden transition-all duration-200 ${!isSignIn
                    ? "border-[#1DA1F2]/30 shadow-[0_0_0_3px_rgba(29,161,242,0.08)] bg-white"
                    : "border-[#1DA1F2]/10 bg-[#1DA1F2]/[0.02] hover:border-[#1DA1F2]/25 hover:bg-[#1DA1F2]/[0.05] hover:shadow-sm"
                    }`}
            >
                {/* Card Header */}
                <button
                    type="button"
                    onClick={() => switchView("sign-up-student")}
                    className="w-full flex items-center justify-between px-6 py-4 cursor-pointer group"
                >
                    <div className="flex items-center gap-3">
                        <div className="text-left">
                            <p className={`font-semibold text-[15px] transition-colors duration-200 ${!isSignIn ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"}`}>
                                Create Account
                            </p>
                            {isSignIn && (
                                <p className="text-xs text-slate-500 mt-0.5">New to MentoMania?</p>
                            )}
                        </div>
                    </div>
                    <div style={{ opacity: !isSignIn ? 0 : 1 }}>
                        <ChevronRight className={`w-4 h-4 transition-colors duration-200 ${!isSignIn ? "text-transparent" : "text-slate-400 group-hover:text-[#1DA1F2]"}`} />
                    </div>
                </button>

                {/* Expanded Sign Up Content */}
                {!isSignIn && (
                    <div className="overflow-hidden">
                            <div className="px-6 pb-6 space-y-4">

                                {/* OTP Verification view */}
                                {verifying ? (
                                    <form onSubmit={handleVerify} className="space-y-4">
                                        <div className="text-center py-2">
                                            <p className="text-sm text-slate-600 font-medium">Check your email</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                We sent a 6-digit code to{" "}
                                                <span className="font-semibold text-slate-600">{signUpEmail}</span>
                                            </p>
                                        </div>
                                        
                                        {verifyError && (
                                            <div className="bg-red-50 text-red-500 px-3 py-2.5 rounded-lg text-xs font-medium border border-red-100">
                                                {verifyError}
                                            </div>
                                        )}
                                        
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={e => {
                                                setCode(e.target.value);
                                                if (verifyError) setVerifyError("");
                                            }}
                                            placeholder="Enter 6-digit code"
                                            className="w-full h-[50px] px-4 bg-white border border-slate-200 rounded-xl text-center text-xl tracking-[0.3em] font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/25 focus:border-[#1DA1F2] transition-all"
                                            maxLength={6}
                                            disabled={isSignUpLoading}
                                            autoComplete="one-time-code"
                                        />
                                        
                                        <button
                                            type="submit" 
                                            disabled={isSignUpLoading || code.length < 6}
                                            className="w-full h-[46px] bg-[#1DA1F2] hover:bg-[#1a90d9] text-white font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            <span>{isSignUpLoading ? "Verifying..." : "Verify Email"}</span>
                                        </button>
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
                                                    disabled={isSignUpLoading}
                                                    className={`w-1/2 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${view === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                                >
                                                    {v === "sign-up-student" ? "Student" : "Mentor"}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Google Button */}
                                        <button
                                            type="button"
                                            onClick={handleSignUpGoogle}
                                            disabled={isSignUpLoading}
                                            className="w-full h-[46px] flex items-center justify-center gap-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all duration-200 text-sm font-medium text-slate-700 hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            {/* General Error */}
                                            {signUpErrors.general && (
                                                <div className="bg-red-50 text-red-500 px-3 py-2.5 rounded-lg text-xs font-medium border border-red-100">
                                                    {signUpErrors.general}
                                                </div>
                                            )}

                                            {/* Name Fields */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <div>
                                                    <div className="relative flex items-center">
                                                        <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                                        <input 
                                                            type="text" 
                                                            value={firstName} 
                                                            onChange={e => handleFirstNameChange(e.target.value)} 
                                                            placeholder="First name" 
                                                            className={inputClass(!!signUpErrors.firstName)}
                                                            disabled={isSignUpLoading}
                                                            autoComplete="given-name"
                                                        />
                                                    </div>
                                                    {signUpErrors.firstName && (
                                                        <InlineError message={signUpErrors.firstName} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="relative flex items-center">
                                                        <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                                        <input 
                                                            type="text" 
                                                            value={lastName} 
                                                            onChange={e => handleLastNameChange(e.target.value)} 
                                                            placeholder="Last name" 
                                                            className={inputClass(!!signUpErrors.lastName)}
                                                            disabled={isSignUpLoading}
                                                            autoComplete="family-name"
                                                        />
                                                    </div>
                                                    {signUpErrors.lastName && (
                                                        <InlineError message={signUpErrors.lastName} />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Email Field */}
                                            <div>
                                                <div className="relative flex items-center">
                                                    <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                                    <input 
                                                        type="email" 
                                                        value={signUpEmail} 
                                                        onChange={e => handleSignUpEmailChange(e.target.value)} 
                                                        placeholder="Email address" 
                                                        className={inputClass(!!signUpErrors.email)}
                                                        disabled={isSignUpLoading}
                                                        autoComplete="email"
                                                    />
                                                </div>
                                                {signUpErrors.email && (
                                                    <InlineError 
                                                        message={signUpErrors.email}
                                                        showSignInLink={signUpErrors._showSignInLink}
                                                        onSwitchToSignIn={switchToSignIn}
                                                    />
                                                )}
                                            </div>

                                            {/* Password Field */}
                                            <div>
                                                <div className="relative flex items-center">
                                                    <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                                    <input 
                                                        type={showSignUpPassword ? "text" : "password"} 
                                                        value={signUpPassword} 
                                                        onChange={e => handleSignUpPasswordChange(e.target.value)} 
                                                        placeholder="Create password" 
                                                        className={`${inputClass(!!signUpErrors.password)} pr-11`}
                                                        disabled={isSignUpLoading}
                                                        autoComplete="new-password"
                                                    />
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setShowSignUpPassword(!showSignUpPassword)} 
                                                        className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                                        tabIndex={-1}
                                                    >
                                                        {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                                {signUpErrors.password && (
                                                    <InlineError message={signUpErrors.password} />
                                                )}
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit" 
                                                disabled={isSignUpLoading}
                                                className="w-full h-[46px] bg-[#1DA1F2] hover:bg-[#1a90d9] text-white font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                <span>{isSignUpLoading ? "Creating account..." : "Create Account"}</span>
                                                {!isSignUpLoading && <ArrowRight className="w-4 h-4" />}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <p className="text-center text-[12px] text-slate-400 leading-relaxed font-medium pt-1">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-slate-600 transition-colors">Terms</Link>
                {" "}and{" "}
                <Link href="/privacy" className="underline hover:text-slate-600 transition-colors">Privacy Policy</Link>.
            </p>
        </div>
    );
}

// Loading fallback for Suspense
function AuthFormsCardLoading() {
    return (
        <div className="w-full flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#1DA1F2]" />
            <p className="text-sm text-slate-500 mt-4">Loading...</p>
        </div>
    );
}

// Wrapper component with Suspense boundary
export default function AuthFormsCard({ initialView }: AuthFormsCardProps) {
    return (
        <Suspense fallback={<AuthFormsCardLoading />}>
            <AuthFormsCardInner initialView={initialView} />
        </Suspense>
    );
}
