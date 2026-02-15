'use client';

import React from 'react';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import BecomeMentorButton from '@/modules/landing/BecomeMentorButton';
import { Button } from '@/shared/ui/button';
import { ArrowRight, Star, Search } from 'lucide-react';
import { popularExams } from '../data';


export default function HeroSection() {
    const { isSignedIn, isLoaded } = useUser();

    return (
        <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 bg-white">
            {/* 4. Depth & Modern Feel: Subtle background gradient */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-gray-50/50" />

            {/* Subtle Glows */}
            <div className="absolute top-0 right-0 -z-10 h-[800px] w-[800px] rounded-full bg-blue-50/30 blur-[120px] opacity-60 mix-blend-multiply" />
            <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] rounded-full bg-indigo-50/30 blur-[120px] opacity-60 mix-blend-multiply" />

            {/* 3. Spacing & Layout: max-w-6xl, px-6 */}
            <div className="max-w-6xl mx-auto px-6 relative z-10">

                {/* 3. Layout: Clean Left Alignment, Grid lg:grid-cols-2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* LEFT CONTENT */}
                    <div className="text-center lg:text-left">

                        {/* 6. Micro-Polish: Trust Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/60 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-gray-600 mb-8 shadow-sm"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-green-500 relative">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
                            </span>
                            <span className="tracking-wide text-gray-700">Trusted by 10,000+ Students</span>
                        </motion.div>

                        {/* 2. Typography: H1 text-5xl lg:text-6xl, leading-tight */}
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                            className="text-5xl font-extrabold tracking-tight text-gray-900 lg:text-6xl mb-6 leading-tight"
                        >
                            Ace Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dream Exam</span>
                            <br className="hidden sm:block" />
                            <span className="block mt-1">With Top Rankers</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                            className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                        >
                            Connect with mentors who serve in IAS, IPS, SBI, and Railways.
                            Get personalized strategy, answer writing reviews, and interview guidance 1-on-1.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                            className="flex flex-col sm:flex-row gap-4 mb-10 justify-center lg:justify-start"
                        >
                            <div className="w-full max-w-md relative group">
                                <select
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            window.location.href = `/mentors?exam=${e.target.value}`;
                                        }
                                    }}
                                    className="w-full h-14 pl-6 pr-14 rounded-full border border-gray-200/60 bg-white text-gray-900 font-medium shadow-lg shadow-gray-200/30 hover:shadow-xl hover:shadow-200/40 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer text-base"
                                    defaultValue=""
                                    aria-label="Select your exam"
                                >
                                    <option value="" disabled>Select your exam (e.g., UPSC, SSC)</option>
                                    {popularExams.map((exam) => (
                                        <option key={exam.id} value={exam.id}>
                                            {exam.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                                        <Search className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT IMAGE */}
                    {/* 1. Image Style: Flat, Rounded-3xl, Shadow-2xl */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="hidden lg:block relative max-w-[600px] mx-auto"
                    >
                        {/* 1. Subtle Radial Glow behind image */}
                        <div className="absolute inset-0 bg-blue-100/50 blur-[80px] rounded-full scale-90 -z-10" />

                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-gray-100/50">
                            <Image
                                src="/mentorLanding.png"
                                alt="Live 1-on-1 mentorship session"
                                width={800}
                                height={600}
                                className="w-full h-auto object-cover"
                                priority
                            />

                            {/* Live Badge */}
                            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-lg flex items-center gap-2 border border-gray-100">
                                <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 relative">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
                                </span>
                                <span className="text-sm font-bold text-gray-900 tracking-wide">Live 1-on-1</span>
                            </div>

                            {/* Stats Badge */}
                            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100">
                                <div className="flex items-center gap-5">
                                    <div className="flex flex-col">
                                        <span className="text-3xl font-bold text-gray-900 leading-none tracking-tight">4.9</span>
                                        <div className="flex gap-0.5 mt-1.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-px h-10 bg-gray-200"></div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-gray-900 leading-none tracking-tight">10k+</div>
                                        <div className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wide">Students</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {isLoaded && isSignedIn && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="relative mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden mt-24"
                    >
                        <HeroMockUI />
                    </motion.div>
                )}
            </div>
        </section>
    );
}

function HeroMockUI() {
    // Simulate loading for 2 seconds
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="p-2 sm:p-4 pt-12 bg-gray-50 flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl opacity-90">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
                            <div>
                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 w-full bg-gray-100 rounded animate-pulse"></div>
                            <div className="h-3 w-5/6 bg-gray-100 rounded animate-pulse"></div>
                        </div>
                    </div>
                    <div className="hidden md:block bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-8 w-20 bg-blue-100 rounded-full animate-pulse"></div>
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                                    <div className="h-2 w-2 rounded-full bg-gray-300 animate-pulse"></div>
                                    <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-2 sm:p-4 pt-12 bg-gray-50 flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
            >
                {/* Card 1: Upcoming Session */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-900">Upcoming Session</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded">Confirmed</span>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                            R
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Rahul Sharma</p>
                            <p className="text-sm text-gray-500">IIT Bombay • JEE Advanced</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-gray-50 p-2 rounded text-center">
                            <p className="text-xs text-gray-500 font-medium">Date</p>
                            <p className="font-semibold text-sm">Tomorrow</p>
                        </div>
                        <div className="flex-1 bg-gray-50 p-2 rounded text-center">
                            <p className="text-xs text-gray-500 font-medium">Time</p>
                            <p className="font-semibold text-sm">5:00 PM</p>
                        </div>
                    </div>
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                        Join Meeting Room
                    </Button>
                </div>

                {/* Card 2: Mentor Stats / Mock Graph */}
                <div className="hidden md:flex flex-col bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-900">Performance</h3>
                        <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-gray-50 text-gray-600">
                            <option>Last 7 Days</option>
                        </select>
                    </div>
                    <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2">
                        {[40, 70, 45, 90, 65, 85, 50].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="w-full bg-blue-50 hover:bg-blue-100 rounded-t-sm relative group cursor-pointer"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {h}% Accuracy
                                </div>
                                <div className="absolute bottom-0 w-full bg-blue-500/20 h-full rounded-t-sm" style={{ height: `${h}%` }}></div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
