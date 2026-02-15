'use client';

import { motion } from 'framer-motion';
import { howItWorksSteps } from '../data';
import { ArrowRight } from 'lucide-react'

export default function HowItWorksSection() {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-blue-600 font-semibold tracking-wide uppercase text-sm"
                    >
                        Process
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                    >
                        How Mentomania Works
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="mt-4 max-w-2xl mx-auto text-lg text-gray-600"
                    >
                        Get started in minutes. Connect with the best minds to supercharge your preparation.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 -z-10"></div>

                    {howItWorksSteps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="relative flex flex-col items-center text-center"
                        >
                            <div className="w-24 h-24 rounded-full bg-white border border-gray-100 shadow-lg flex items-center justify-center text-blue-600 mb-6 z-10">
                                <step.icon className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-gray-600 leading-relaxed px-4">{step.description}</p>

                            {index < howItWorksSteps.length - 1 && (
                                <div className="md:hidden mt-8 text-gray-300">
                                    <ArrowRight className="w-6 h-6 rotate-90" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
