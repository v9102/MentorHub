'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { howItWorksSteps } from '../data';
import { ArrowDown, ArrowRight } from 'lucide-react';

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-24 md:py-32 bg-white relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

                {/* Problem Statement Block */}
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-16 mb-20 md:mb-28">
                    <div className="flex justify-center order-2 md:order-1">
                        <div className="relative">
                            <Image
                                src="/confusedStudent.png"
                                alt="Student struggling alone"
                                width={480}
                                height={400}
                                className="w-[260px] sm:w-[340px] md:w-[420px] h-auto object-contain relative z-10"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-3xl blur-2xl scale-90 -z-0" />
                        </div>
                    </div>
                    <div className="text-left order-1 md:order-2">
                        <span className="inline-block text-blue-700 font-bold tracking-wider uppercase text-xs px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
                            Sound familiar?
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold text-[#0A1628] leading-tight mb-4">
                            Struggling alone with your preparation?
                        </h3>
                        <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                            Most aspirants spend months confused with no clear direction.
                            No one to tell them what to study, what to skip, or how to actually crack it.
                        </p>
                        <p className="text-gray-500 text-base md:text-lg leading-relaxed mt-3">
                            That&apos;s exactly why MentoMania exists. Get guidance from someone
                            who has already been where you are — and succeeded.
                        </p>
                    </div>
                </div>

                <div className="text-center mb-12 md:mb-14 max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="inline-block mb-3"
                    >
                        <span className="text-blue-700 font-bold tracking-wider uppercase text-xs px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
                            Process
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-[2.75rem] font-extrabold tracking-tight text-gray-900 leading-[1.15]"
                    >
                        Your Journey to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Success</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.16, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        viewport={{ once: true }}
                        className="mt-4 text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed"
                    >
                        Get started in minutes. Connect with the best minds to supercharge your preparation.
                    </motion.p>
                </div>

                <div className="rounded-3xl bg-gray-50/80 p-6 sm:p-8 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 md:gap-5 items-stretch">
                        {howItWorksSteps.flatMap((step, index) => {
                            const items = [
                                <motion.div
                                    key={`step-${step.id}`}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                    viewport={{ once: true }}
                                    className="relative pt-6 h-full"
                                >
                                    <div className="absolute -top-0 left-6 z-10 w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold flex items-center justify-center shadow-lg ring-4 ring-white">
                                        0{index + 1}
                                    </div>

                                    <div className="relative flex flex-col bg-white rounded-2xl pt-12 pb-8 px-7 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.10)] transition-shadow duration-200 h-full">
                                        <div className="absolute top-5 right-6 h-11 w-11 flex items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                                            <step.icon className="w-5 h-5" strokeWidth={1.75} />
                                        </div>

                                        <h3 className="text-[#0A1628] font-bold text-xl mb-3 pr-14">
                                            {step.title}
                                        </h3>

                                        <p className="text-gray-500 text-[15px] leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>,
                            ];

                            if (index < howItWorksSteps.length - 1) {
                                items.push(
                                    <div key={`mobile-arrow-${step.id}`} className="flex md:hidden justify-center py-1">
                                        <ArrowDown className="w-6 h-6 text-blue-400" />
                                    </div>
                                );

                                items.push(
                                    <div
                                        key={`desktop-arrow-${step.id}`}
                                        className="hidden md:flex items-center justify-center"
                                    >
                                        <ArrowRight className="w-7 h-7 text-blue-400" />
                                    </div>
                                );
                            }

                            return items;
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
