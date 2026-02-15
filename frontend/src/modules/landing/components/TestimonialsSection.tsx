'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const testimonials = [
    {
        id: 1,
        name: "Rahul Verma",
        role: "UPSC Aspirant",
        rating: 5,
        quote: "Answer writing was my biggest weakness. Regular feedback from a rank holder gave me the confidence I needed to ace the Mains.",
        initial: "R",
        color: "bg-blue-100 text-blue-600"
    },
    {
        id: 2,
        name: "Neha Singh",
        role: "SSC CGL Aspirant",
        rating: 5,
        quote: "Maths shortcuts showed by my mentor saved me valuable time in the exam. I improved my score from 120 to 165.",
        initial: "N",
        color: "bg-purple-100 text-purple-600"
    },
    {
        id: 3,
        name: "Vikram Singh",
        role: "SBI PO Aspirant",
        rating: 5,
        quote: "The interview guidance session was a game changer. My mentor told me exactly what to expect from the panel.",
        initial: "V",
        color: "bg-indigo-100 text-indigo-600"
    }
];


export default function TestimonialsSection() {
    return (
        <section className="py-12 md:py-20 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4"
                    >
                        Success Stories
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                    >
                        See how Mentomania is changing lives, one rank at a time.
                    </motion.p>
                </div>

                {/* Mobile: Horizontal Scroll | Desktop: Grid */}
                <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
                    <div
                        className="flex overflow-x-auto pb-8 sm:pb-0 sm:overflow-visible space-x-4 sm:space-x-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 snap-x snap-mandatory no-scrollbar"
                        style={{
                            maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                        }}
                    >
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="h-full min-w-[300px] sm:min-w-0 snap-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative first:pl-2 last:pr-2 sm:first:pl-6 sm:last:pr-6"
                            >
                                <div className="flex gap-1 mb-4">
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
                                <blockquote className="text-gray-700 font-medium mb-6 leading-relaxed">
                                    "{t.quote}"
                                </blockquote>
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg", t.color)}>
                                        {t.initial}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{t.name}</div>
                                        <div className="text-sm text-gray-500">{t.role}</div>
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
