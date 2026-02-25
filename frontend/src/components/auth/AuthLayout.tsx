import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full flex flex-col bg-slate-50 relative selection:bg-blue-500/30">

            {/* Floating Header */}
            <div className="absolute top-0 left-0 w-full p-6 md:px-12 flex justify-between items-center z-20 pointer-events-none">
                <Link href="/" className="pointer-events-auto flex items-center -ml-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
                    <Image
                        src="/logo.png"
                        alt="MentoMania Logo"
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain -mt-2 drop-shadow-sm"
                    />
                    <span className="font-bold text-2xl text-slate-900 -ml-1.5 pt-1">
                        ento<span className="text-blue-600">Mania</span>
                    </span>
                </Link>

                <Link
                    href="/"
                    className="pointer-events-auto flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>

            {/* Main Content Area - Centered Card */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 pt-24 pb-8">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-shadow duration-300 ring-1 ring-slate-100/50 flex flex-col lg:flex-row overflow-hidden min-h-[600px]">

                    {/* Left Pane - Value Proposition */}
                    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#ebf6ff] to-[#e1f0fe] p-12 flex-col justify-center border-r border-slate-100 relative overflow-hidden">
                        {/* Soft decorative blur */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/40 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <h1 className="text-[2.5rem] font-bold text-slate-900 leading-[1.15] tracking-tight mb-6">
                                Empowering growth <br />
                                through professional <br />
                                mentorship.
                            </h1>

                            <p className="text-slate-600 text-lg leading-relaxed mb-12 max-w-sm">
                                Join a community of experts and learners dedicated to academic and professional excellence.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-blue-100/80 p-2 rounded-lg text-blue-600">
                                        <CheckCircle2 className="w-5 h-5 drop-shadow-sm" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Verified Mentors</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mt-1">Industry leaders from top global companies and universities.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-blue-100/80 p-2 rounded-lg text-blue-600">
                                        <Clock className="w-5 h-5 drop-shadow-sm" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Flexible Scheduling</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mt-1">Book sessions that fit your busy professional or academic life.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Pane - Authentication Form */}
                    <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center items-center bg-white relative">
                        <div className="w-full max-w-sm">
                            {children}
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer minimal without borders */}
            <footer className="w-full py-4 text-center shrink-0">
                <p className="text-xs text-slate-400 font-medium tracking-wide">
                    © 2024 Mentomania Mentorship Marketplace. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
