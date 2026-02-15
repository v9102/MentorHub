'use client';

import { motion } from 'framer-motion';
import { featuredMentors } from '../data';
import FeaturedMentorCard from './FeaturedMentorCard';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FeaturedMentorsSection() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="py-24 md:py-32 bg-gradient-to-b from-gray-50 via-white to-white relative overflow-hidden">
            {/* Ambient Background Blob */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[120px] opacity-60 mix-blend-multiply" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[120px] opacity-60 mix-blend-multiply" />
            </div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div className="max-w-3xl">
                        <div className="relative inline-block mb-4">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-blue-700 font-bold tracking-wider uppercase text-xs px-3 py-1 rounded-full bg-blue-50 border border-blue-100"
                            >
                                Top Rated Mentors
                            </motion.span>
                        </div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.1]"
                        >
                            Learn from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Best</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                            className="mt-6 text-lg text-gray-600 max-w-2xl leading-relaxed"
                        >
                            Don't just study hard. Study smart with mentors who have been in your shoes and succeeded at the highest levels.
                        </motion.p>
                    </div>
                    <Link href="/mentors">
                        <Button variant="outline" className="hidden md:flex">
                            View All Mentors <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Scroll Container with Fade Masks */}
                <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
                    {/* Fade Edges Wrapper */}
                    <div
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
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
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
                                            college: mentor.college,
                                            yearsOfExperience: 3,
                                            sessions: 50 + index * 10,
                                            pricing: mentor.hourlyRate,
                                            bio: `Mentoring aspirants for ${mentor.exam}. Helping students achieve their dreams with personalized guidance.`,
                                            profileImage: mentor.profileImage
                                        }}
                                    />
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link href="/mentors">
                        <Button variant="outline" className="w-full">
                            View All Mentors <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
