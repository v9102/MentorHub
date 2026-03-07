'use client';

import { motion } from 'framer-motion';
import { featuredMentors } from '../data';
import FeaturedMentorCard from './FeaturedMentorCard';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function FeaturedMentorsSection() {
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener('scroll', updateScrollState, { passive: true });
        updateScrollState();
        return () => el.removeEventListener('scroll', updateScrollState);
    }, [isLoading, updateScrollState]);

    const scroll = (direction: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        const cardWidth = 280 + 16;
        el.scrollBy({ left: direction === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
    };

    return (
        <section className="py-24 md:py-32 bg-gradient-to-b from-gray-50 via-white to-white relative overflow-hidden">
            {/* Ambient Background Blob */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[120px] opacity-60 mix-blend-multiply" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[120px] opacity-60 mix-blend-multiply" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block mb-4"
                    >
                        <span className="text-blue-700 font-bold tracking-wider uppercase text-xs px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
                            Top Rated Mentors
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.1]"
                    >
                        Learn from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Best</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.16, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        viewport={{ once: true }}
                        className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
                    >
                        Don't just study hard. Study smart with mentors who have been in your shoes and succeeded at the highest levels.
                    </motion.p>

                    <Link href="/mentors" className="hidden md:inline-flex mt-8">
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 px-6 py-2.5 rounded-full">
                            View All Mentors <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Mobile carousel nav — right above the cards */}
                <div className="flex items-center justify-end gap-2 mb-4 sm:hidden">
                    <button
                        aria-label="Previous"
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className="w-9 h-9 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center disabled:opacity-30 transition-opacity"
                    >
                        <ChevronLeft className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                        aria-label="Next"
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className="w-9 h-9 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center disabled:opacity-30 transition-opacity"
                    >
                        <ChevronRight className="w-4 h-4 text-gray-700" />
                    </button>
                </div>

                {/* Scroll Container with Fade Masks */}
                <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto pb-8 sm:pb-0 sm:overflow-visible space-x-4 sm:space-x-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 snap-x snap-mandatory no-scrollbar"
                        style={{
                            maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                        }}
                    >
                        {isLoading ? (
                            Array(4).fill(null).map((_, index) => (
                                <motion.div
                                    key={`skeleton-${index}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full min-w-[280px] sm:min-w-0 snap-center first:pl-2 last:pr-2 sm:first:pl-0 sm:last:pr-0"
                                >
                                    <FeaturedMentorCard isLoading={true} />
                                </motion.div>
                            ))
                        ) : (
                            featuredMentors.map((mentor, index) => (
                                <motion.div
                                    key={mentor.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                    viewport={{ once: true }}
                                    className="h-full min-w-[280px] sm:min-w-0 snap-center first:pl-2 last:pr-2 sm:first:pl-0 sm:last:pr-0"
                                >
                                    <FeaturedMentorCard
                                        mentor={{
                                            id: mentor.id,
                                            name: mentor.name,
                                            rating: mentor.rating,
                                            reviewsCount: mentor.reviews,
                                            tagLine: mentor.tags.join(" | "),
                                            college: `${mentor.exam}${mentor.rank ? ` — ${mentor.rank}` : ''}`,
                                            yearsOfExperience: 3,
                                            sessions: 50 + index * 10,
                                            pricing: mentor.hourlyRate,
                                            bio: mentor.bio,
                                            profileImage: mentor.profileImage
                                        }}
                                    />
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-6 text-center md:hidden">
                    <Link href="/mentors">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 rounded-full py-2.5">
                            View All Mentors <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
