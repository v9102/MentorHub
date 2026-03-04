"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Rocket } from "lucide-react";

export default function SubmittedPage() {
    return (
        <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-4 py-12 md:py-20">
            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="w-full max-w-2xl rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-xl shadow-primary/5 md:p-12"
            >
                {/* Success Icon */}
                <div className="mb-8 inline-flex">
                    <div className="relative">
                        <div className="absolute inset-0 scale-150 rounded-full bg-primary/20 blur-2xl" />
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
                            <ShieldCheck className="h-12 w-12 text-white" />
                        </div>
                    </div>
                </div>

                {/* Heading */}
                <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                    Application Submitted!
                </h1>
                <p className="mx-auto mb-12 max-w-lg text-lg text-slate-600">
                    Thank you for joining the Mentomania elite circle. Our team will meticulously review your
                    professional profile within{" "}
                    <span className="font-semibold text-primary">24–48 hours</span> to maintain our high
                    standards of mentorship.
                </p>

                {/* What happens next — Timeline */}
                <div className="mx-auto mb-12 max-w-md text-left">
                    <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                        <span className="text-primary">↗</span>
                        What happens next?
                    </h3>
                    <div className="space-y-0">
                        {/* Step 1 */}
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-bold text-primary">
                                    1
                                </div>
                                <div className="-my-1 w-px h-12 bg-slate-200" />
                            </div>
                            <div className="pb-8">
                                <h4 className="font-bold leading-none text-slate-900 mb-1">Profile Moderation</h4>
                                <p className="text-sm text-slate-500">Expert review of your professional experience and accolades.</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-bold text-primary">
                                    2
                                </div>
                                <div className="-my-1 w-px h-12 bg-slate-200" />
                            </div>
                            <div className="pb-8">
                                <h4 className="font-bold leading-none text-slate-900 mb-1">Identity Verification</h4>
                                <p className="text-sm text-slate-500">Cross-referencing your credentials for community trust.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                                    <Rocket className="h-4 w-4" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold leading-none text-slate-900 mb-1">Account Activation</h4>
                                <p className="text-sm text-slate-500">Your profile goes live and you can start accepting mentees.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/mentor/dashboard"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 sm:w-auto"
                    >
                        Go to Dashboard
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        href="/mentors"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-8 py-4 font-bold text-slate-700 transition-all hover:bg-slate-200 sm:w-auto"
                    >
                        Explore Mentors
                    </Link>
                </div>
            </motion.div>

            {/* Footer support note */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="mt-8 text-sm text-slate-500"
            >
                Have questions?{" "}
                <a href="#" className="font-medium text-primary hover:underline">
                    Contact our support team
                </a>
            </motion.p>

            {/* Decorative bottom bar */}
            <div className="fixed bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>
    );
}
