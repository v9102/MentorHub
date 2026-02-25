"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") ?? "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(redirectUrl);
      } else {
        // Handle flows like MFA if they arise
        console.log(result);
        setError("Sign in requires further verification.");
      }
    } catch (err: any) {
      setError(err.errors[0]?.longMessage || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: redirectUrl,
    });
  };

  return (
    <AuthLayout>
      <div className="w-full flex justify-center">
        <div className="w-full sm:w-[400px]">
          <h1 className="text-[32px] font-extrabold text-[#0f172a] tracking-tight mb-2">Welcome back</h1>
          <p className="text-slate-500 text-[15px] mb-8">Please enter your details to continue</p>

          {/* Tabs */}
          <div className="flex w-full border-b border-slate-200 mb-8">
            <div className="w-1/2 flex justify-center pb-3 border-b-2 border-[#1DA1F2]">
              <span className="text-[#1DA1F2] font-semibold text-[15px]">Login</span>
            </div>
            <Link href="/sign-up/student" className="w-1/2 flex justify-center pb-3 hover:text-slate-900 transition-colors">
              <span className="text-slate-500 font-medium text-[15px]">Sign Up</span>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-slate-800 font-semibold text-sm">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full h-[52px] pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/20 focus:border-[#1DA1F2] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <div className="flex justify-between items-center">
                <label className="text-slate-800 font-semibold text-sm">Password</label>
                <Link href="#" className="text-[#1DA1F2] text-[13px] font-medium hover:underline">Forgot password?</Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-[52px] pl-12 pr-12 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/20 focus:border-[#1DA1F2] transition-all tracking-widest"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] bg-[#1DA1F2] hover:bg-[#1a90d9] text-white font-semibold rounded-2xl transition-colors mt-4"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-4 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Or continue with</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <div className="w-full mb-8">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full h-[52px] flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 transition-colors rounded-2xl"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.71 17.59V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.59C14.72 18.25 13.46 18.66 12 18.66C9.17 18.66 6.78 16.75 5.92 14.2H2.23V17.06C4.03 20.64 7.74 23 12 23Z" fill="#34A853" />
                <path d="M5.92 14.2C5.70 13.54 5.58 12.79 5.58 12C5.58 11.21 5.70 10.46 5.92 9.8V6.94H2.23C1.49 8.41 1.06 10.15 1.06 12C1.06 13.85 1.49 15.59 2.23 17.06L5.92 14.2Z" fill="#FBBC05" />
                <path d="M12 5.34C13.62 5.34 15.06 5.9 16.21 7.01L19.36 3.86C17.45 2.08 14.97 1 12 1C7.74 1 4.03 3.36 2.23 6.94L5.92 9.8C6.78 7.25 9.17 5.34 12 5.34Z" fill="#EA4335" />
              </svg>
              <span className="font-semibold text-slate-700 text-[15px]">Google</span>
            </button>
          </div>

          <div className="text-center w-full px-6">
            <div className="h-px bg-slate-200 w-full mb-6 max-w-[200px] mx-auto hidden" />
            <p className="text-[13px] text-slate-400 leading-relaxed font-medium">
              By continuing, you agree to Mentomania's <Link href="#" className="underline hover:text-slate-600 transition-colors">Terms of Service</Link> and <Link href="#" className="underline hover:text-slate-600 transition-colors">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
