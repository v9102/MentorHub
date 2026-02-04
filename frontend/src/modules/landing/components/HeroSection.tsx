'use client';

import React from 'react';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import BecomeMentorButton from '@/modules/landing/BecomeMentorButton';
import { Button } from '@/shared/ui/button';
import { ArrowRight, Star, Search } from 'lucide-react';
import { popularExams } from '../data';


export default function HeroSection() {
    const { isSignedIn, isLoaded } = useUser();

    return (
        <section className="relative overflow-hidden pt-20 pb-10 md:pt-32 md:pb-16">
            {/* Background Decor */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white" />
            <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-orange-50/50 blur-3xl opacity-60" />
            <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-50/50 blur-3xl opacity-60" />

            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-sm font-medium text-blue-700 mb-8"
                >
                    <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse relative">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                    </span>
                    Trusted by 10,000+ Students
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-7xl mb-6 leading-[1.15]"
                >
                    Ace Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dream Exam</span>
                    <br className="hidden sm:block" />
                    <span className="block sm:inline mt-2 sm:mt-0">With Top Rankers</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto max-w-2xl text-base sm:text-lg text-gray-600 mb-10 px-4"
                >
                    Connect with mentors who serve in IAS, IPS, SBI, and Railways.
                    Get personalized strategy, answer writing reviews, and interview guidance 1-on-1.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 px-4 sm:px-0"
                >
                    <div className="w-full max-w-md relative">
                        <div className="relative group">
                            <select
                                onChange={(e) => {
                                    if (e.target.value) {
                                        window.location.href = `/mentors?exam=${e.target.value}`;
                                    }
                                }}
                                className="w-full h-14 pl-6 pr-12 rounded-full border-2 border-blue-100 bg-white text-gray-900 font-medium shadow-lg hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer text-base sm:text-lg active:scale-[0.98]"
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
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600 transition-transform group-hover:scale-110">
                                <Search className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {isLoaded && isSignedIn && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="relative mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2 z-10">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>

                        <HeroMockUI />

                        {/* Overlay Gradient */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
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
