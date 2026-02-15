'use client';

import { motion } from 'framer-motion';
import { howItWorksSteps } from '../data';
import { ArrowRight } from 'lucide-react'

export default function HowItWorksSection() {
    return (
        <section className="py-24 bg-white relative">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block mb-4"
                    >
                        <span className="text-blue-700 font-bold tracking-wider uppercase text-xs px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
                            Process
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.1]"
                    >
                        Your Journey to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Success</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="mt-6 text-lg text-gray-600 leading-relaxed"
                    >
                        Get started in minutes. Connect with the best minds to supercharge your preparation.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-gray-200 via-blue-200 to-gray-200 -z-10"></div>

                    {howItWorksSteps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="relative flex flex-col items-center text-center group"
                        >
                            <div className="w-32 h-32 rounded-full bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center text-blue-600 mb-8 z-10 group-hover:scale-105 transition-transform duration-300 relative">
                                <div className="absolute inset-0 bg-blue-50/50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full" />
                                <step.icon className="w-12 h-12 relative z-10" strokeWidth={1.5} />
                                <div className="absolute -bottom-2 bg-gray-900 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                                    Step 0{index + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{step.title}</h3>
                            <p className="text-gray-600 leading-relaxed px-4 text-base">{step.description}</p>

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
