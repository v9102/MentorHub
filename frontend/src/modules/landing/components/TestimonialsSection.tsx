'use client';

import { motion } from 'framer-motion';
import { Star, ArrowUpRight, Quote } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import Image from 'next/image';

interface Testimonial {
    id: number;
    mentor: {
        name: string;
        role: string;
        company: string;
        image: string;
    };
    mentee: {
        name: string;
        role: string; // e.g., "Cleared UPSC 2023"
        image: string;
    };
    review: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        mentor: {
            name: "Dr. Karthik S",
            role: "Ex-IAS Officer",
            company: "Indian Administrative Service",
            image: "/mentors/karthik.jpg"
        },
        mentee: {
            name: "Rahul Verma",
            role: "AIR 104, UPSC CSE 2023",
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100"
        },
        review: "Answer writing was my biggest weakness. Regular feedback from Karthik sir gave me the confidence I needed to ace the Mains. His insights on Ethics were game-changing.",
        rating: 5
    },
    {
        id: 2,
        mentor: {
            name: "Vikram Singh",
            role: "SSC CGL Topper",
            company: "Income Tax Inspector",
            image: "/mentors/vikram.jpg"
        },
        mentee: {
            name: "Neha Singh",
            role: "Cleared SSC CGL 2023",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
        },
        review: "Maths shortcuts showed by my mentor saved me valuable time in the exam. I improved my score from 120 to 165. The mock strategy was spot on.",
        rating: 5
    },
    {
        id: 3,
        mentor: {
            name: "Amit Kumar",
            role: "PO, SBI",
            company: "State Bank of India",
            image: "/mentors/amit.jpg"
        },
        mentee: {
            name: "Sandeep Gupta",
            role: "Cleared SBI PO 2023",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100"
        },
        review: "The interview guidance session was a game changer. Amit sir told me exactly what to expect from the panel and how to handle pressure situations.",
        rating: 5
    }
];

export default function TestimonialsSection() {
    return (
        <section className="py-16 md:py-24 bg-gray-50/50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6"
                    >
                        Success Stories
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
                    >
                        Real results from determined aspirants backed by expert guidance.
                    </motion.p>
                </div>

                {/* Mobile: Horizontal Scroll | Desktop: Grid */}
                <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
                    <div
                        className="flex overflow-x-auto pb-8 sm:pb-0 sm:overflow-visible space-x-6 sm:space-x-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-8 snap-x snap-mandatory no-scrollbar"
                    >
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="h-full min-w-[340px] sm:min-w-0 snap-center flex flex-col"
                            >
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 h-full flex flex-col group relative">

                                    {/* Mentor Header */}
                                    <div className="flex items-center gap-4 mb-6 relative">
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                                                <Image
                                                    src={t.mentor.image}
                                                    alt={t.mentor.name}
                                                    width={56}
                                                    height={56}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            {/* Expert Badge/Icon could go here */}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 leading-tight">{t.mentor.name}</h3>
                                            <p className="text-sm text-gray-500">{t.mentor.company}</p>
                                        </div>
                                        <div className="ml-auto self-start text-gray-300 group-hover:text-gray-400 transition-colors">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex gap-1 mb-4 pl-1">
                                        {[...Array(5)].map((_, index) => (
                                            <Star
                                                key={index}
                                                className={cn(
                                                    "w-4 h-4",
                                                    index < t.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                                                )}
                                            />
                                        ))}
                                    </div>

                                    {/* Review Bubble */}
                                    <div className="bg-blue-50/50 rounded-xl p-5 mb-6 relative flex-grow">
                                        <p className="text-gray-700 leading-relaxed text-[15px]">
                                            {t.review.length > 100 ? `${t.review.substring(0, 100)}...` : t.review}
                                            <span className="text-blue-600 font-medium text-sm ml-1 cursor-pointer hover:underline">Read more</span>
                                        </p>
                                    </div>

                                    {/* Mentee Info */}
                                    <div className="flex items-center justify-end gap-3 mt-auto">
                                        <div className="text-right">
                                            <div className="font-medium text-gray-900 text-sm">{t.mentee.name}</div>
                                            <div className="text-xs text-gray-500">{t.mentee.role}</div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm shrink-0">
                                            <Image
                                                src={t.mentee.image}
                                                alt={t.mentee.name}
                                                width={40}
                                                height={40}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
