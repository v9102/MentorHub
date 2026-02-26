"use client";

import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    FileText,
    Users,
    User,
    BarChart2,
    Settings,
    MapPin,
    Briefcase,
    ShieldCheck,
    Brain,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";

export default function AdminReviewApplication() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-body">
            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:flex ${isMenuOpen ? "translate-x-0 flex" : "-translate-x-full hidden md:flex"}`}>
                <div className="flex items-center justify-between gap-3 p-6">
                    <Link href="/admin" className="flex items-center -ml-2" onClick={() => setIsMenuOpen(false)}>
                        <Image
                            src="/logo.png"
                            alt="MentoMania Logo"
                            width={48}
                            height={48}
                            className="w-12 h-12 object-contain -mt-2"
                        />
                        <span className="font-bold text-2xl text-slate-900 dark:text-white -ml-1.5 pt-1">
                            ento<span className="text-blue-600">Mania</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="md:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <nav className="flex-1 space-y-1.5 px-4 py-4 overflow-y-auto">
                    <Link
                        href="#"
                        className="flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3 font-semibold text-primary"
                    >
                        <FileText className="h-5 w-5" />
                        <span>Applications</span>
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    >
                        <Users className="h-5 w-5" />
                        <span>Mentors</span>
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    >
                        <User className="h-5 w-5" />
                        <span>Mentees</span>
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    >
                        <BarChart2 className="h-5 w-5" />
                        <span>Reports</span>
                    </Link>
                    <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <Link
                            href="#"
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                        >
                            <Settings className="h-5 w-5" />
                            <span>Settings</span>
                        </Link>
                    </div>
                </nav>
                <div className="border-t border-slate-100 p-4 dark:border-slate-800">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2 dark:bg-slate-800/50">
                        <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-300">
                            <img
                                className="h-full w-full object-cover"
                                alt="Admin user profile avatar"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6XgoGQu254Jy-VUG_P0DCybXCoxIUah4trPwNnZ8xm8XngQe6Adk4afIzB6yRs97ursiA5qHgNh2JSTjLzuvvXWi7L_CiZ457XOtb9mgiumDCm5dt3l2uCG2yAcw1ejiBIBL8UAWtcaS9NXPCQ2kkQX8earj4qp-HzBpkqITDWfDCF9mzN1CM6GHpxafAMciMX_f_HcTJonSx3zOvYuqaFMWDXL_3RxqWlDvFMTY97-MGIVA-2xy2mAQqyOtU_l2xEVEXYTo_EJC7"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">Alex Rivera</p>
                            <p className="truncate text-xs text-slate-500">Super Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex min-w-0 flex-1 flex-col bg-slate-50 dark:bg-slate-900/50 w-full md:w-auto">
                {/* Action Bar (Sticky) */}
                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 px-3 sm:px-6 md:px-8 py-2.5 sm:py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
                    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                        <div className="flex items-center gap-1 sm:gap-4 min-w-0">
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0 transition-colors"
                                aria-label="Open menu"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <button className="hidden md:flex rounded-full p-2.5 -ml-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0">
                                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                            </button>
                            <div className="min-w-0">
                                <h2 className="font-display text-base sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white truncate">Reviewing Application</h2>
                                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">Submitted on Oct 12, 2023</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            <button className="rounded-xl border border-red-200 bg-white px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base font-bold text-red-600 shadow-sm transition-all hover:bg-red-50 hover:border-red-300 active:scale-95 focus:ring-4 focus:ring-red-500/20 h-auto sm:h-10">
                                <span className="hidden sm:inline">Deny Application</span>
                                <span className="sm:hidden">Deny</span>
                            </button>
                            <button className="rounded-xl bg-primary px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary/90 active:translate-y-0 active:scale-95 focus:ring-4 focus:ring-primary/20 h-auto sm:h-10">
                                <span className="hidden sm:inline">Approve Application</span>
                                <span className="sm:hidden">Approve</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-8 p-3 sm:p-6 md:p-8 md:p-10">
                    {/* Profile Header Card */}
                    <section className="rounded-2xl border border-black/[0.04] bg-white p-5 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] dark:border-white/[0.04] dark:bg-slate-900">
                        <div className="flex flex-col items-center sm:items-start gap-4 sm:gap-8 md:flex-row text-center sm:text-left">
                            <div className="relative flex-shrink-0">
                                <img
                                    className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl border-4 border-white object-cover shadow-xl dark:border-slate-800"
                                    alt="Professional portrait of mentor applicant Rahul Sharma"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuACmlQIAprUf0pa7fCN3RztjfONBtQt6Yz841vtP8IRZC5EO-whTDx44wixugdPAX0ncUdbvuRQiSI-PgJAch_SQgqeWjzP2DELs0STjEr0j00U645_G3R0f5pSEoclnAjtMEMJplBNg69IMJklglbiTZJaYLD7HjaVdVYsn9FwPa2xHbrx0sYCb9pkh3HrEzjQUL_kF2wrVedNnEnH3XsfYycETGsE46dwP3fUuiNmkabv7XeH6D4KRgpZirq2dtHhkbbuB_Yhi5B8"
                                />
                                <span className="absolute -bottom-2 -right-2 rounded-full border-2 border-white bg-yellow-100 px-2 sm:px-3 py-1 text-xs font-bold text-yellow-700 dark:border-slate-800 whitespace-nowrap">
                                    PENDING
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="mb-1 font-display text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Rahul Sharma
                                </h3>
                                <p className="mb-3 text-sm sm:text-lg font-semibold text-slate-700 dark:text-slate-300">Senior Product Manager at Flipkart</p>
                                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5 text-slate-500 text-xs sm:text-sm justify-center sm:justify-start">
                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                        <MapPin className="h-4 w-4 flex-shrink-0" />
                                        <span>Bengaluru, India</span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                        <Briefcase className="h-4 w-4 flex-shrink-0" />
                                        <span>8+ Years Experience</span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                        <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                                        <span>Identity Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 gap-6 sm:gap-10 lg:grid-cols-3">
                        {/* Left Column: Details */}
                        <div className="space-y-4 sm:space-y-10 lg:col-span-2">
                            {/* Expertise & Bio */}
                            <div className="rounded-2xl border border-black/[0.04] bg-white p-5 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] dark:border-white/[0.04] dark:bg-slate-900">
                                <h4 className="mb-4 sm:mb-6 flex items-center gap-2 font-display text-base sm:text-xl font-bold">
                                    <Brain className="h-5 sm:h-6 w-5 sm:w-6 text-primary flex-shrink-0" />
                                    Expertise &amp; Experience
                                </h4>
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                                            Primary Expertise
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="rounded-full bg-slate-100 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-tight text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                JEE Coaching
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-tight text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                UPSC Guidance
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-tight text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                Product Design
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                                            Key Achievements
                                        </p>
                                        <ul className="list-inside list-disc space-y-2 text-xs sm:text-sm leading-relaxed sm:leading-loose text-slate-600 dark:text-slate-400">
                                            <li>Helped over 50+ students crack top-tier design school entrances.</li>
                                            <li>Former Lead Mentor at Interaction Design Foundation (IDF).</li>
                                            <li>Speaker at Config 2022 on the future of design education.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                                            Biography
                                        </p>
                                        <p className="text-xs sm:text-sm leading-relaxed sm:leading-loose text-slate-600 dark:text-slate-400">
                                            Passionate educator and product manager with nearly a decade of tech industry experience. I believe in a
                                            holistic approach to mentoring that combines analytical skills with emotional intelligence. My
                                            background at Flipkart has given me a unique perspective on scaling product teams and mentoring
                                            junior talent into leadership roles. Looking to help the next generation of Indian aspirants find
                                            their path in the rapidly growing startup ecosystem.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Basic Info & Contact */}
                        <div className="space-y-6 sm:space-y-10">
                            {/* Basic Info */}
                            <div className="rounded-2xl border border-black/[0.04] bg-white p-5 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] dark:border-white/[0.04] dark:bg-slate-900">
                                <h4 className="mb-4 sm:mb-6 font-display text-base sm:text-lg font-bold">Basic Information</h4>
                                <div className="space-y-4 sm:space-y-5">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                            Email Address
                                        </span>
                                        <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 break-all">rahul.sharma@flipkart.com</p>
                                    </div>
                                    <div className="flex flex-col gap-1 border-t border-slate-50 pt-4 dark:border-slate-800">
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Phone Number</span>
                                        <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">+91 98765 43210</p>
                                    </div>
                                    <div className="flex flex-col gap-1 border-t border-slate-50 pt-4 dark:border-slate-800">
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Gender</span>
                                        <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Male</p>
                                    </div>
                                    <div className="flex flex-col gap-1 border-t border-slate-50 pt-4 dark:border-slate-800">
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Languages</span>
                                        <div className="mt-1 flex flex-wrap gap-1.5">
                                            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold dark:bg-slate-800">
                                                ENGLISH
                                            </span>
                                            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold dark:bg-slate-800">
                                                HINDI
                                            </span>
                                            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold dark:bg-slate-800">
                                                MARATHI
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Footer for padding */}
                <div className="h-20"></div>
            </main>
        </div>
    );
}
