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
        <section className="py-12 md:py-20 bg-gray-50">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4"
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <p className="text-lg text-gray-600">
                        Everything you need to know about the product and billing.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
                    ))}
                </div>
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
            className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-gray-900 text-lg">{question}</span>
                <span className="ml-6 flex-shrink-0 text-gray-400">
                    <Plus
                        className={cn(
                            "w-5 h-5 transition-transform duration-300 ease-in-out",
                            isOpen && "rotate-45"
                        )}
                    />
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
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
