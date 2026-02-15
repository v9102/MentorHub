'use client';

import { motion } from 'framer-motion';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FinalCTASection() {
    return (
        <section className="py-20 px-4">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-16 sm:px-16 sm:py-24 text-center shadow-2xl"
                >
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm border border-white/20">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span>Start your journey today</span>
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                            Ready to Crack Your Dream Exam?
                        </h2>

                        <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                            Join thousands of aspirants who are learning from the best.
                            Get the guidance you deserve and start your journey towards success.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link href="/mentors">
                                <Button size="lg" className="h-14 px-8 text-base bg-white text-blue-600 hover:bg-gray-50 hover:scale-105 transition-all w-full sm:w-auto font-semibold">
                                    Find Your Mentor
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/apply-mentor">
                                <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white text-white hover:bg-white/10 hover:text-white w-full sm:w-auto font-semibold bg-transparent">
                                    Become a Mentor
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
