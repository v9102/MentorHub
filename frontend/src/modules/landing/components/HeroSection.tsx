'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/shared/ui/button';
import { Star, Search, ChevronDown, Check } from 'lucide-react';
import { popularExams } from '../data';
import { useRouter } from 'next/navigation';

type Exam = (typeof popularExams)[number];

function ExamCombobox() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const filtered = query.trim()
        ? popularExams.filter((e) =>
            e.name.toLowerCase().includes(query.toLowerCase())
        )
        : popularExams;

    const select = useCallback(
        (exam: Exam) => {
            setOpen(false);
            setQuery('');
            router.push(`/mentors?exam=${exam.id}`);
        },
        [router]
    );

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (!containerRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    function handleKeyDown(e: React.KeyboardEvent) {
        if (!open) {
            if (e.key === 'Enter' || e.key === 'ArrowDown') {
                setOpen(true);
            }
            return;
        }
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (filtered[activeIndex]) select(filtered[activeIndex]);
                break;
            case 'Escape':
                setOpen(false);
                break;
        }
    }

    return (
        <div ref={containerRef} className="relative w-full max-w-md">
            {/* Input pill */}
            <div
                className={`
                    flex items-center gap-3 h-14 px-5 rounded-full bg-white border
                    transition-colors duration-200 cursor-text
                    shadow-[inset_0_1px_3px_rgb(0_0_0/0.06)]
                    ${open ? 'border-blue-400' : 'border-gray-200 hover:border-gray-300'}
                `}
                onClick={() => {
                    setOpen(true);
                    inputRef.current?.focus();
                }}
            >
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Find mentors by exam — UPSC, SSC, Banking…"
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
                    aria-label="Search exams"
                    aria-expanded={open}
                    aria-haspopup="listbox"
                    role="combobox"
                />
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''
                        }`}
                />
            </div>

            {/* Dropdown */}
            <AnimatePresence>
                {open && filtered.length > 0 && (
                    <motion.ul
                        role="listbox"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="
                            absolute z-50 mt-2 w-full rounded-2xl bg-white border border-gray-100
                            shadow-floating py-1.5 overflow-hidden
                        "
                    >
                        {filtered.map((exam, i) => (
                            <li
                                key={exam.id}
                                role="option"
                                aria-selected={i === activeIndex}
                                onMouseEnter={() => setActiveIndex(i)}
                                onClick={() => select(exam)}
                                className={`
                                    flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer
                                    transition-colors duration-100
                                    ${i === activeIndex
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <span>{exam.name}</span>
                                {i === activeIndex && (
                                    <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                )}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}


export default function HeroSection() {
    const { isSignedIn, isLoaded } = useUser();

    return (
        <section className="relative overflow-hidden pt-36 pb-28 md:pt-48 md:pb-40 bg-white">

            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-gray-50/60" />

            <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-blue-50/20 blur-[80px] opacity-30" />
            <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-slate-50/40 blur-[80px] opacity-30" />

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
                        className="relative mx-auto max-w-5xl rounded-2xl border border-gray-100 bg-white shadow-floating overflow-hidden mt-24"
                    >
                        <HeroMockUI />
                    </motion.div>
                )}
            </div>
        </section>
    );
}

function HeroMockUI() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500); // max 600ms
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="p-4 pt-10 bg-gray-50 flex justify-center items-center min-h-[300px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                    {/* Skeleton card 1 */}
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

                    <div className="hidden md:block bg-white p-5 rounded-xl shadow-soft border border-gray-100">
                        <div className="flex justify-between items-center mb-5">
                            <div className="h-3.5 w-20 bg-gray-100 rounded animate-pulse" />
                            <div className="h-7 w-16 bg-gray-100 rounded-full animate-pulse" />
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                                    <div className="h-2 w-2 rounded-full bg-gray-200 animate-pulse" />
                                    <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 pt-10 bg-gray-50 flex justify-center items-center min-h-[300px]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
            >
                <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100 hover:shadow-floating transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-semibold text-gray-900">Upcoming Session</h3>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                            Confirmed
                        </span>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-semibold text-base">
                            R
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Rahul Sharma</p>
                            <p className="text-xs text-gray-400 mt-0.5">IIT Bombay · JEE Advanced</p>
                        </div>
                    </div>
                    <div className="flex gap-2 mb-5">
                        <div className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-center">
                            <p className="text-xs text-gray-400 mb-0.5">Date</p>
                            <p className="text-sm font-medium text-gray-800">Tomorrow</p>
                        </div>
                        <div className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-center">
                            <p className="text-xs text-gray-400 mb-0.5">Time</p>
                            <p className="text-sm font-medium text-gray-800">5:00 PM</p>
                        </div>
                    </div>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors duration-200">
                        Join Meeting Room
                    </Button>
                </div>

                <div className="hidden md:flex flex-col bg-white p-6 rounded-xl shadow-soft border border-gray-100 hover:shadow-floating transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-semibold text-gray-900">Performance</h3>
                        <span className="text-xs text-gray-400 border border-gray-100 rounded-full px-3 py-1">
                            Last 7 Days
                        </span>
                    </div>
                    <div className="flex-1 flex items-end justify-between gap-1.5 pb-2">
                        {[40, 70, 45, 90, 65, 85, 50].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' }}
                                className="w-full bg-blue-100 hover:bg-blue-200 rounded-t relative group cursor-pointer transition-colors duration-150"
                            >
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {h}%
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-300 mt-2 px-0.5">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                            <span key={i}>{d}</span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
