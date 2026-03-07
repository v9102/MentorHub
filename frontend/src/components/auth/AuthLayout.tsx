"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full flex flex-col bg-slate-50 relative selection:bg-blue-500/30 overflow-hidden">

            {/* Ambient background blobs */}
            <div className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] bg-blue-100/60 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 w-[400px] h-[400px] bg-sky-100/50 rounded-full blur-3xl" />

            {/* Floating Header */}
            <div className="absolute top-0 left-0 w-full p-6 md:px-12 flex justify-between items-center z-20 pointer-events-none">
                <Link href="/" className="pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
                    <Image
                        src="/mentomanialogo.png"
                        alt="MentoMania"
                        width={564}
                        height={124}
                        className="h-[124px] w-auto object-contain drop-shadow-sm"
                    />
                </Link>

                <Link
                    href="/"
                    className="pointer-events-auto flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 pt-24 pb-8">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-slate-100/50 flex flex-col lg:flex-row overflow-hidden min-h-[600px]">

                    {/* Left Pane - Value Proposition */}
                    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#ebf6ff] to-[#e1f0fe] p-12 flex-col justify-center border-r border-slate-100 relative overflow-hidden">
                        {/* Soft decorative blur circles */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/40 rounded-full blur-3xl" />
                        <div className="absolute bottom-10 right-0 w-56 h-56 bg-blue-200/20 rounded-full blur-3xl" />

                        {/* Decorative floating icon */}
                        <div className="absolute top-10 right-10 text-blue-300/50">
                            <Sparkles className="w-10 h-10" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-[2.5rem] font-bold text-slate-900 leading-[1.15] tracking-tight mb-6">
                                Empowering growth <br />
                                through professional <br />
                                mentorship.
                            </h2>

                            <p className="text-slate-600 text-lg leading-relaxed mb-12 max-w-sm">
                                Join a community of experts and learners dedicated to academic and professional excellence.
                            </p>

                            <div className="space-y-8">
                                {[
                                    {
                                        icon: CheckCircle2,
                                        title: "Verified Mentors",
                                        desc: "Industry leaders from top global companies and universities.",
                                    },
                                    {
                                        icon: Clock,
                                        title: "Flexible Scheduling",
                                        desc: "Book sessions that fit your busy professional or academic life.",
                                    },
                                ].map(({ icon: Icon, title, desc }) => (
                                    <div
                                        key={title}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="mt-1 bg-blue-100/80 p-2 rounded-lg text-blue-600 shrink-0">
                                            <Icon className="w-5 h-5 drop-shadow-sm" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{title}</h3>
                                            <p className="text-slate-500 text-sm leading-relaxed mt-1">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Pane - Authentication Form */}
                    <div className="w-full lg:w-1/2 p-8 sm:p-10 flex flex-col justify-center items-center bg-white relative">
                        <div className="w-full max-w-md">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Get started</h2>
                                <p className="text-slate-500 text-sm mt-1">Sign in or create a new account below.</p>
                            </div>
                            {children}
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-4 text-center shrink-0">
                <p className="text-xs text-slate-400 font-medium tracking-wide">
                    © 2026 Mentomania Mentorship Marketplace. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
