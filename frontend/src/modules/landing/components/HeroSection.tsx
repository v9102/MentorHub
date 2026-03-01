'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/shared/ui/button';
import { Star, Search, ChevronDown } from 'lucide-react';
import { popularExams } from '../data';
import { useRouter } from 'next/navigation';
import { useUpcomingSessions, type DashboardSession } from '@/shared/lib/hooks/useDashboard';

type Exam = (typeof popularExams)[number];

function ExamCombobox() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (!containerRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSelect = (exam: Exam) => {
        setOpen(false);
        // Navigate with URI encoded param (which correctly turns CA/CMA/CS into encoded string)
        router.push(`/mentors?exam=${encodeURIComponent(exam.name)}`);
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-md z-50">
            {/* Beautiful Trigger Button */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className={`
                    w-full flex items-center justify-between h-14 px-6 rounded-2xl bg-white border-2
                    transition-all duration-300 shadow-sm
                    ${open ? 'border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' : 'border-gray-100 hover:border-gray-200 hover:shadow-md'}
                `}
            >
                <div className="flex items-center gap-3 text-left">
                    <div className={`p-2 rounded-xl transition-colors duration-300 ${open ? 'bg-blue-50 text-blue-500' : 'bg-gray-50 text-gray-500'}`}>
                        <Search className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Find Mentors By</div>
                        <div className="text-[15px] font-medium text-gray-900 leading-none">Select your exam...</div>
                    </div>
                </div>
                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                    ${open ? 'bg-blue-50 text-blue-500 rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}
                `}>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </button>

            {/* Beautiful Dropdown grid/list */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="
                            absolute left-0 right-0 mt-3 p-3 bg-white border border-gray-100
                            rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]
                            overflow-hidden
                        "
                    >
                        <div className="grid grid-cols-2 gap-2">
                            {popularExams.map((exam, i) => {
                                const Icon = exam.icon;
                                return (
                                    <motion.button
                                        key={exam.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        onClick={() => handleSelect(exam)}
                                        className="
                                            group flex items-center gap-3 p-3 rounded-xl cursor-pointer text-left
                                            transition-all duration-200 border border-transparent
                                            hover:bg-gray-50 hover:border-gray-100 hover:shadow-sm
                                        "
                                    >
                                        <div className={`
                                            w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                                            ${exam.bg} ${exam.color} transition-transform duration-300 group-hover:scale-110
                                        `}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 truncate">
                                            <div className="font-semibold text-sm text-gray-900 truncate">
                                                {exam.name}
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


export default function HeroSection() {
    const { isSignedIn, isLoaded } = useUser();

    return (
        <section className="relative pt-36 pb-28 md:pt-48 md:pb-40 bg-white z-10">

            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-gray-50/60" />

            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-blue-50/20 blur-[80px] opacity-30" />
                <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-slate-50/40 blur-[80px] opacity-30" />
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    <div className="text-center lg:text-left">

                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 mb-10 shadow-soft"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                            <span className="tracking-wide">Trusted by 10,000+ Students</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: 0.06, ease: 'easeOut' }}
                            className="text-5xl font-extrabold tracking-tight text-gray-900 lg:text-6xl mb-6 leading-[1.12]"
                        >
                            Ace Your{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">
                                Dream Exam
                            </span>
                            <br className="hidden sm:block" />
                            <span className="block mt-2">With Top Rankers</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: 0.12, ease: 'easeOut' }}
                            className="text-lg text-gray-500 mb-12 leading-relaxed max-w-lg mx-auto lg:mx-0"
                        >
                            Connect with mentors who serve in IAS, IPS, SBI, and Railways.
                            Get personalized strategy, answer writing reviews, and interview guidance — 1-on-1.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: 0.18, ease: 'easeOut' }}
                            className="flex justify-center lg:justify-start mb-12"
                        >
                            <ExamCombobox />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.22, ease: 'easeOut' }}
                        className="hidden lg:block relative max-w-[580px] mx-auto"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-floating border border-gray-100">
                            <Image
                                src="/mentorLanding.png"
                                alt="Live 1-on-1 mentorship session"
                                width={800}
                                height={600}
                                className="w-full h-auto object-cover"
                                priority
                            />

                            <div className="absolute top-5 left-5 bg-white/95 rounded-full px-3.5 py-1.5 shadow-soft flex items-center gap-2 border border-gray-100">
                                <span className="relative flex h-2 w-2 shrink-0">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                </span>
                                <span className="text-sm font-medium text-gray-800 tracking-wide">Live 1-on-1</span>
                            </div>

                            <div className="absolute bottom-5 right-5 bg-white/95 rounded-2xl px-5 py-4 shadow-floating border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-semibold text-gray-900 leading-none tracking-tight">
                                            4.9
                                        </span>
                                        <div className="flex gap-0.5 mt-1.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className="w-3 h-3 fill-yellow-300 text-yellow-400"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-px h-8 bg-gray-100" />
                                    <div className="text-right">
                                        <div className="text-lg font-semibold text-gray-900 leading-none tracking-tight">
                                            10k+
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                                            Students
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {isLoaded && isSignedIn && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }}
                        className="relative mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white shadow-floating overflow-hidden mt-14"
                    >
                        <HeroMockUI />
                    </motion.div>
                )}
            </div>
        </section>
    );
}


function HeroMockUI() {
    const { user } = useUser();
    const { sessions, isLoading } = useUpcomingSessions();

    // Soonest upcoming confirmed/pending session
    const session = sessions.find(
        (s: DashboardSession) => s.status === 'confirmed' || s.status === 'pending'
    );

    const isMentor = user?.publicMetadata?.role === 'mentor';
    const otherPerson = isMentor ? session?.student : session?.mentor;
    const otherName = otherPerson?.name || (isMentor ? 'Student' : 'your mentor');
    const initials = otherName.charAt(0).toUpperCase();

    // Format date
    const getFormattedDate = () => {
        if (!session) return '';
        const [y, m, d] = session.date.split('-').map(Number);
        const sessionDate = new Date(y, m - 1, d);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
        if (sessionDate.getTime() === today.getTime()) return 'Today';
        if (sessionDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
        return sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Format time (HH:mm → h:mm AM/PM)
    const fmtTime = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    // Skeleton while loading
    if (isLoading) {
        return (
            <div className="px-6 py-5">
                <div className="bg-white p-5 rounded-xl shadow-soft border border-gray-100">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-11 w-11 rounded-full bg-gray-100 animate-pulse" />
                        <div>
                            <div className="h-3.5 w-28 bg-gray-100 rounded animate-pulse mb-2" />
                            <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                        <div className="h-3 w-4/5 bg-gray-100 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 py-5">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                {/* === Upcoming Session Card === */}
                <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100 hover:shadow-floating transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-semibold text-gray-900">Upcoming Session</h3>
                        {session ? (
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full capitalize">
                                {session.status}
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 bg-gray-50 text-gray-400 text-xs font-medium rounded-full">
                                None scheduled
                            </span>
                        )}
                    </div>

                    {session ? (
                        <>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-semibold text-base shrink-0">
                                    {initials}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{otherName}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {isMentor ? 'Student' : 'Mentor'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 mb-5">
                                <div className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-center">
                                    <p className="text-xs text-gray-400 mb-0.5">Date</p>
                                    <p className="text-sm font-medium text-gray-800">{getFormattedDate()}</p>
                                </div>
                                <div className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-center">
                                    <p className="text-xs text-gray-400 mb-0.5">Time</p>
                                    <p className="text-sm font-medium text-gray-800">{fmtTime(session.startTime)}</p>
                                </div>
                            </div>
                            <Button
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors duration-200"
                                onClick={() => window.location.href = `/session/${session.bookingId}`}
                            >
                                Join Meeting Room
                            </Button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">No upcoming sessions</p>
                            <p className="text-xs text-gray-400 mt-1">Book a session to get started</p>
                        </div>
                    )}
                </div>

            </motion.div>
        </div>
    );
}

