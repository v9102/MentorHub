"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Phone, ArrowRight, Lightbulb, Loader2 } from "lucide-react";

import { MentorBasicInfo } from "@/shared/lib/types/mentor-onboarding-data";
import { useMentorOnboarding } from "@/shared/lib/context/MentorOnboardingContext";
import { Input } from "@/shared/ui/input";
import { firebaseAuth } from "@/shared/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

type BasicInfoFormValues = MentorBasicInfo & {
  email?: string;
  phone?: string;
  preferredLanguage?: string;
  aboutYou?: string;
};

export default function BasicInfoPage() {
  const { user } = useUser();
  const router = useRouter();
  const { updateData } = useMentorOnboarding();

  // Firebase OTP State
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<BasicInfoFormValues>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      profilePhoto: "",
      gender: "prefer-not-to-say",
      currentOrganisation: "",
      industry: "",
      currentRole: "",
      workExperience: 0,
      preferredLanguage: "en",
      aboutYou: "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName ?? "");
      setValue("lastName", user.lastName ?? "");
      setValue("profilePhoto", user.imageUrl ?? "");
      const primaryEmail = user.primaryEmailAddress?.emailAddress;
      if (primaryEmail) {
        setValue("email", primaryEmail);
      }
    }
  }, [user, setValue]);

  // Initialize Recaptcha
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => { },
          'expired-callback': () => {
            setOtpError("Recaptcha expired. Please try again.");
          }
        });
      } catch (err) {
        console.error("Recaptcha initialization failed", err);
      }
    }
  }, []);

  const handleSendOtp = async (phoneVal: string) => {
    if (!phoneVal || phoneVal.length !== 10) {
      setOtpError("Please enter a valid 10-digit phone number.");
      return;
    }

    setOtpError(null);
    setIsSendingOtp(true);

    const formattedPhoneNumber = `+91${phoneVal}`;

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(firebaseAuth, formattedPhoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setIsOtpSent(true);
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      setOtpError(err.message || "Failed to send OTP. Try again.");
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !confirmationResult) return;

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      await confirmationResult.confirm(otp);
      setIsPhoneVerified(true);
      setIsOtpSent(false); // Hide OTP input on success
      setOtpError(null);
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      setOtpError("Invalid OTP. Please check and try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const onSubmit = (data: BasicInfoFormValues) => {
    if (!isPhoneVerified) {
      setOtpError("Please verify your phone number before proceeding.");
      return;
    }
    const {
      firstName,
      lastName,
      profilePhoto,
      gender,
      currentOrganisation,
      industry,
      currentRole,
      workExperience,
    } = data;

    updateData({
      basicInfo: {
        firstName,
        lastName,
        profilePhoto,
        gender,
        currentOrganisation,
        industry,
        currentRole,
        workExperience,
      },
    });

    router.push("/onboarding/profile/expertise");
  };

  const aboutYou = watch("aboutYou") ?? "";

  return (
    <div className="py-8 space-y-8 max-w-2xl w-full">
      {/* ── Progress Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: "easeOut" }}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              1
            </span>
            <p className="text-base font-semibold text-slate-900">Step 1 of 4</p>
          </div>
          <p className="text-sm font-bold text-primary">25% Complete</p>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-primary/10">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: "25%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <div className="mt-3 flex items-center gap-2 text-slate-500">
          <Lightbulb className="h-4 w-4" />
          <p className="text-sm font-medium">Basic Personal Details</p>
        </div>
      </motion.div>

      {/* ── Form Card ── */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.07, duration: 0.38, ease: "easeOut" }}
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md"
      >
        {/* Card Header */}
        <div className="border-b border-slate-100 p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Tell us about yourself
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-500">
            This information will be displayed on your public profile. Let students know who they are learning from.
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Jonathan"
                aria-invalid={!!errors.firstName}
                className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all duration-200 ease-in-out hover:bg-white focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && (
                <p className="text-xs font-medium text-rose-500">{errors.firstName.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Doe"
                aria-invalid={!!errors.lastName}
                className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all duration-200 ease-in-out hover:bg-white focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && (
                <p className="text-xs font-medium text-rose-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                placeholder="name@youremail.com"
                aria-invalid={!!errors.email}
                className="h-12 w-full pl-11 rounded-lg border border-slate-200 bg-slate-50 pr-4 text-slate-900 transition-all duration-200 ease-in-out hover:bg-white focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-rose-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone & Gender / Language Row */}
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>

              {/* Phone Number and OTP Row */}
              <div className="flex flex-col sm:flex-row gap-3 items-start">
                <div className="relative flex-1 w-full sm:max-w-[320px]">
                  <div className="flex gap-2 h-12">
                    {/* Fixed +91 */}
                    <div className="flex items-center px-4 border border-slate-200 bg-slate-100 rounded-lg text-sm text-slate-600 font-bold w-[4.5rem] justify-center shrink-0">
                      +91
                    </div>
                    {/* Phone Input */}
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="98765 43210"
                        disabled={isPhoneVerified || isOtpSent || isSubmitting}
                        className="h-full w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all duration-200 ease-in-out hover:bg-white focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Valid 10-digit number required"
                          }
                        })}
                      />
                    </div>
                  </div>
                  {errors.phone && (
                    <p className="text-xs font-medium text-rose-500 mt-1.5">{errors.phone.message}</p>
                  )}
                </div>

                {/* OTP Logic Section (Same line on desktop) */}
                <div className="flex gap-2 w-full sm:w-auto flex-col sm:flex-row">
                  <div id="recaptcha-container"></div>

                  {!isOtpSent && !isPhoneVerified && (
                    <button
                      type="button"
                      onClick={() => handleSendOtp(watch("phone") || "")}
                      disabled={isSendingOtp || (watch("phone")?.length !== 10) || !!errors.phone || isSubmitting}
                      className="h-12 px-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg text-sm font-bold bg-primary text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      {isSendingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
                    </button>
                  )}

                  {isOtpSent && !isPhoneVerified && (
                    <div className="flex gap-2 w-full sm:w-auto flex-col sm:flex-row">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="6-digit OTP"
                        value={otp}
                        disabled={isVerifyingOtp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="h-12 w-full sm:w-32 rounded-lg border border-slate-200 bg-slate-50 px-4 text-center tracking-widest text-slate-900 transition-all duration-200 ease-in-out hover:bg-white focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otp.length < 6 || isVerifyingOtp}
                        className="h-12 px-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg text-sm font-bold bg-green-600 text-white transition-all hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                      >
                        {isVerifyingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                      </button>
                    </div>
                  )}

                  {isPhoneVerified && (
                    <div className="h-12 px-6 w-full sm:w-auto inline-flex items-center justify-center rounded-lg text-sm font-bold bg-green-50 text-green-700 border border-green-200 shrink-0">
                      Verified ✓
                    </div>
                  )}
                </div>
              </div>

              {otpError && (
                <p className="text-xs font-medium text-rose-500">{otpError}</p>
              )}
            </div>

            {/* Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  aria-invalid={!!errors.gender}
                  className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all duration-200 ease-in-out hover:bg-white focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                  {...register("gender", { required: "Gender is required" })}
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="text-xs font-medium text-rose-500">{errors.gender.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Preferred Language
                </label>
                <select
                  className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all duration-200 ease-in-out hover:bg-white focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                  {...register("preferredLanguage")}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="bn">Bengali</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                </select>
              </div>
            </div>

            {/* About You */}
            <div className="flex flex-col gap-2 pt-6 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                About you
              </label>
              <textarea
                rows={5}
                maxLength={500}
                placeholder="Briefly describe your professional background and why you want to mentor students..."
                className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-900 transition-all duration-200 ease-in-out hover:bg-white focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                {...register("aboutYou")}
              />
              <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><Lightbulb className="w-3.5 h-3.5 text-amber-500" /> A compelling bio increases booking requests.</span>
                <span className="font-medium text-slate-400">
                  {aboutYou.length} / 500
                </span>
              </div>
            </div>
          </div>

          {/* Action Button Footer */}
          <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50 p-6 md:p-8">
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-10 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? "Saving..." : "Continue to Step 2"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </motion.form>

      {/* Help note */}
      <motion.p
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.38, delay: 0.14, ease: "easeOut" } }
        }}
        className="text-center text-sm text-slate-500"
      >
        Need help?{" "}
        <a href="#" className="font-medium text-primary hover:underline">
          Contact our onboarding support drop-in
        </a>
      </motion.p>
    </div>
  );
}

