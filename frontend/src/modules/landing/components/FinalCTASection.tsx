'use client';

import { motion } from 'framer-motion';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FinalCTASection() {
    return (
        <section className="py-24 md:py-32 px-4">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 px-6 py-20 sm:px-16 sm:py-28 text-center shadow-[0_30px_60px_-15px_rgba(59,130,246,0.3)] ring-1 ring-white/20"
                >
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 -mr-32 -mt-32 h-96 w-96 rounded-full bg-white/10 blur-3xl mix-blend-overlay" />
                    <div className="absolute bottom-0 left-0 -ml-32 -mb-32 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl mix-blend-overlay" />

                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.1 }}></div>

                    <div className="relative z-10 max-w-4xl mx-auto space-y-10">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white/90 backdrop-blur-md border border-white/20 shadow-sm">
                            <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                            <span className="tracking-wide">Start your journey today</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-sm">
                            Ready to Crack Your <br className="hidden sm:block" /> <span className="text-blue-100">Dream Exam?</span>
                        </h2>

                        <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-medium">
                            Join thousands of aspirants who are learning from the best.
                            Get the guidance you deserve and start your journey towards success.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
                            <Link href="/mentors">
                                <Button size="lg" className="h-14 px-8 text-lg bg-white text-blue-700 hover:bg-blue-50 hover:scale-105 transition-all w-full sm:w-auto font-bold shadow-xl shadow-blue-900/10 border border-white">
                                    Find Your Mentor
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/apply-mentor">
                                <Button size="lg" variant="outline" className="bg-transparent h-14 px-8 text-lg border-white/30 text-white hover:bg-white/10 hover:border-white/50 hover:text-white w-full sm:w-auto font-bold backdrop-blur-sm">
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
