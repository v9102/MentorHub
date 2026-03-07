'use client';

import { motion } from 'framer-motion';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FinalCTASection() {
    return (
        <section id="final-cta" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    viewport={{ once: true }}
                    className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 px-6 py-20 sm:px-16 sm:py-28 shadow-[0_30px_60px_-15px_rgba(59,130,246,0.3)] ring-1 ring-white/20"
                >
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 -mr-32 -mt-32 h-96 w-96 rounded-full bg-white/10 blur-3xl mix-blend-overlay" />
                    <div className="absolute bottom-0 left-0 -ml-32 -mb-32 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl mix-blend-overlay" />

                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.1 }}></div>

                    <div className="relative z-10 mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center gap-10 lg:gap-12">
                        <div className="text-left order-2 lg:order-1 space-y-8">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white/90 backdrop-blur-md border border-white/20 shadow-sm">
                                <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                                <span className="tracking-wide">Start your journey today</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-sm">
                                Ready to Crack Your <br className="hidden sm:block" /> <span className="text-blue-100">Dream Exam?</span>
                            </h2>

                            <p className="text-xl text-blue-100 max-w-2xl leading-relaxed font-medium">
                                Join thousands of aspirants who are learning from the best.
                                Get the guidance you deserve and start your journey towards success.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 pt-6">
                                <Link href="/mentors">
                                    <Button size="lg" className="h-14 px-8 text-lg bg-white text-blue-700 hover:bg-blue-50 transition-transform active:scale-[0.98] w-full sm:w-auto font-bold shadow-xl shadow-blue-900/10 border border-white">
                                        Find Your Mentor
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/sign-up/mentor">
                                    <Button size="lg" variant="outline" className="bg-transparent h-14 px-8 text-lg border-white/30 text-white hover:bg-white/10 hover:border-white/50 hover:text-white transition-transform active:scale-[0.98] w-full sm:w-auto font-bold backdrop-blur-sm">
                                        Become a Mentor
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="flex justify-center lg:justify-end order-1 lg:order-2">
                            <Image
                                src="/celebratingGirl.png"
                                alt="Student celebrating success"
                                width={520}
                                height={680}
                                className="w-[280px] sm:w-[360px] lg:w-[500px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
