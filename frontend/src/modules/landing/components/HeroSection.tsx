'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/shared/ui/button';
import { Star, Search, ChevronDown, ArrowRight } from 'lucide-react';
import { popularExams } from '../data';
import { useRouter } from 'next/navigation';
import { useUpcomingSessions, type DashboardSession } from '@/shared/lib/hooks/useDashboard';

type Exam = (typeof popularExams)[number];

function ExamCombobox() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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
                    <div className="p-2 rounded-xl bg-slate-100 text-[#0A1628]">
                        <Search className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                            WHAT ARE YOU WORKING TOWARDS?
                        </div>
                        <div className="text-[15px] font-medium text-gray-900 leading-none">
                            Select your goal...
                        </div>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-[#0A1628]">
                    <ChevronDown className="w-4 h-4" />
                </div>
            </button>

            {/* Dropdown grid/list */}
            {open && (
                <div
                    className="
                        absolute left-0 right-0 mt-3 p-3 bg-white border border-gray-100
                        rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]
                        overflow-hidden
                    "
                >
                    <div className="grid grid-cols-2 gap-2">
                        {popularExams.map((exam) => {
                            const Icon = exam.icon;
                            return (
                                <button
                                    key={exam.id}
                                    onClick={() => handleSelect(exam)}
                                    className="
                                        group flex items-center gap-3 p-3 rounded-xl cursor-pointer text-left
                                        transition-transform duration-150 border border-transparent
                                        hover:bg-gray-50 hover:border-gray-100 hover:shadow-sm
                                    "
                                >
                                    <div className={`
                                        w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                                        ${exam.bg} ${exam.color} transition-transform duration-150 group-hover:scale-105
                                    `}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 truncate">
                                        <div className="font-semibold text-sm text-gray-900 truncate">
                                            {exam.name}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}


export default function HeroSection() {
    const { isLoaded, isSignedIn } = useUser();

    return (
        <section className="relative pt-16 pb-16 md:pt-24 md:pb-24 bg-white z-10">

            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-gray-50/60" />

            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-blue-50/20 blur-[80px] opacity-30" />
                <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-slate-50/40 blur-[80px] opacity-30" />
            </div>

            <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">

                <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-8 lg:gap-20 items-start lg:items-center mt-4 sm:mt-6">

                    <div className="text-left">

                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 mb-6 sm:mb-10 shadow-soft"
                        >
                            {/* Stacked avatars with +120 badge */}
                            <div className="flex items-center">
                                <div className="flex -space-x-2">
                                    <Image
                                        src="/mentors/vikram.jpg"
                                        alt="Mentor"
                                        width={28}
                                        height={28}
                                        className="w-7 h-7 rounded-full border-2 border-white object-cover"
                                    />
                                    <Image
                                        src="/mentors/rahul.jpg"
                                        alt="Mentor"
                                        width={28}
                                        height={28}
                                        className="w-7 h-7 rounded-full border-2 border-white object-cover"
                                    />
                                </div>
                                <span className="ml-1 text-[12px] font-semibold text-slate-500">+120</span>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="font-semibold text-gray-800">4.9/5</span>
                            </div>

                            {/* Divider */}
                            <div className="w-px h-4 bg-gray-200" />

                            {/* Exam services */}
                            <span className="flex items-center gap-1 text-slate-500 font-medium">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                                IAS · IPS · SBI
                            </span>
                        </motion.div>

                        {/* Mobile hero image — full width above content */}
                        <div className="relative w-full h-[240px] sm:h-[260px] rounded-2xl overflow-hidden mb-6 md:hidden">
                            <Image
                                src="/mentorLanding.png"
                                alt="Mentorship session"
                                fill
                                sizes="(max-width: 767px) 100vw, 0vw"
                                className="object-cover object-top"
                            />

                            {/* Top badge */}
                            <div className="absolute top-3 right-3 bg-white/95 rounded-xl px-2.5 py-1.5 shadow-md flex items-center gap-1.5 border border-gray-100">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="text-[12px] font-bold text-primary">
                                    Top Mentor
                                </span>
                            </div>

                            {/* Bottom badge */}
                            <div className="absolute bottom-3 left-3 bg-white/95 rounded-xl px-2.5 py-1.5 shadow-md flex items-center gap-1.5 border border-gray-100">
                                <span className="text-[12px] font-bold text-primary">
                                    4.9
                                </span>
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="text-[12px] text-slate-400">
                                    200+ ratings
                                </span>
                            </div>
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: 0.06, ease: 'easeOut' }}
                            className="text-[30px] md:text-[36px] lg:text-[44px] xl:text-[52px] font-extrabold leading-[1.1] tracking-tight text-[#0A1628] mb-6"
                        >
                            1-on-1 mentorship that turns{' '}
                            <span className="text-blue-500">
                                dreams into reality
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: 0.12, ease: 'easeOut' }}
                            className="text-[15px] md:text-[18px] text-gray-500 mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0"
                        >
                            Guidance from those who've already reached where you want to go
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: 0.18, ease: 'easeOut' }}
                            className="flex justify-start mb-4"
                        >
                            <div className="w-full lg:max-w-md">
                                <ExamCombobox />
                            </div>
                        </motion.div>

                        {/* Primary CTA intentionally removed from hero per latest design */}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.22, ease: 'easeOut' }}
                        className="hidden md:block relative max-w-[580px] w-full mx-auto"
                    >
                        <div className="relative w-full h-[340px] md:h-[380px] lg:h-[460px] xl:h-[520px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-floating border border-gray-100">
                            <Image
                                src="/mentorLanding.png"
                                alt="Live 1-on-1 mentorship session"
                                fill
                                priority
                                sizes="(max-width: 1023px) 50vw, (max-width: 1280px) 40vw, 580px"
                                className="object-cover object-top"
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
                        className="relative mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white shadow-floating overflow-hidden mt-10"
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

    // Soonest upcoming confirmed/pending session that hasn't passed yet
    const now = new Date();
    const session = sessions.find((s: DashboardSession) => {
        const isRelevantStatus =
            s.status === 'confirmed' || s.status === 'pending' ||
            s.status === 'meeting_started' || s.status === 'meeting_ready';
        if (!isRelevantStatus) return false;

        // Build full datetime from date string + startTime
        const [y, mo, d] = s.date.split('-').map(Number);
        const [sh, sm] = (s.startTime || '00:00').split(':').map(Number);
        const sessionStart = new Date(y, mo - 1, d, sh, sm, 0, 0);

        // Allow up to 15 min grace (matches backend + banner logic)
        return sessionStart.getTime() > now.getTime() - 15 * 60 * 1000;
    });

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
                                className="w-full bg-[#FF9500] hover:bg-[#E8860A] text-[#0A1628] text-sm transition-colors duration-200"
                                onClick={() => {
                                    const meetingActive =
                                        session.status === 'meeting_started' ||
                                        session.status === 'meeting_ready' ||
                                        session.status === 'In progress';
                                    window.location.href = meetingActive
                                        ? `/meeting/${session.bookingId}`
                                        : `/session/${session.bookingId}`;
                                }}
                            >
                                {(session.status === 'meeting_started' || session.status === 'meeting_ready')
                                    ? 'Join Meeting Room'
                                    : 'View Session'}
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

