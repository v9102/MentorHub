'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const faqs = [
    {
        question: "How does mentoring work on Mentomania?",
        answer: "You browse mentor profiles, choose someone who aligns with your goals, and book a session. Sessions happen via 1-on-1 video calls where you can ask doubts, discuss strategy, and get a personalized roadmap."
    },
    {
        question: "Who are the mentors?",
        answer: "Our mentors are top rankers (IITians, AIIMS doctors, IIM graduates) and industry professionals who have cracked the exams you are preparing for. They are verified for their credentials."
    },
    {
        question: "How is the pricing decided?",
        answer: "Mentors set their own hourly rates based on their experience and expertise. You can find mentors ranging from affordable peer guides to premium expert coaches."
    },
    {
        question: "Is it safe and verified?",
        answer: "Yes. Every mentor undergoes a strict verification process where we validate their college ID, rank proof, and identity before they can list on the platform."
    },
    {
        question: "What if I need to cancel my session?",
        answer: "You can reschedule or cancel a session up to 24 hours before the start time for a full refund. Cancellations within 24 hours may be subject to a partial fee to compensate the mentor's time."
    }
];

export default function FAQSection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-3xl" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-50/50 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 max-w-3xl relative z-10">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-sm bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        FAQ
                    </span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-6"
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <p className="text-lg text-gray-500 max-w-xl mx-auto">
                        Everything you need to know about the product and billing. Can't find the answer you're looking for?
                    </p>
                </div>

                <div className="space-y-4 mb-20">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
                    ))}
                </div>

                {/* Still have questions CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gray-50 rounded-2xl p-8 md:p-10 text-center border border-gray-100"
                >
                    <div className="flex justify-center -space-x-2 mb-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                <Plus className="w-full h-full p-2 text-gray-400" />
                            </div>
                        ))}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
                    <p className="text-gray-500 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm hover:shadow-lg">
                        Get in Touch
                    </button>
                </motion.div>
            </div>
        </section>
    );
}

function FAQItem({ question, answer, index }: { question: string, answer: string, index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className={cn(
                "border rounded-xl bg-white overflow-hidden transition-all duration-300",
                isOpen ? "border-blue-200 shadow-md ring-1 ring-blue-50" : "border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300"
            )}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-start justify-between p-6 text-left focus:outline-none"
                aria-expanded={isOpen}
            >
                <span className={cn("font-bold text-lg transition-colors pr-8", isOpen ? "text-blue-600" : "text-gray-900")}>
                    {question}
                </span>
                <span className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                    isOpen ? "bg-blue-600 text-white rotate-45" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                )}>
                    <Plus className="w-4 h-4" />
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
