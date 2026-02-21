'use client';

import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import Link from 'next/link';
import { Button } from './button'; // Standard app button

interface ComingSoonProps {
    title: string;
    description: string;
    showHomeButton?: boolean;
}

export default function ComingSoon({
    title,
    description,
    showHomeButton = true
}: ComingSoonProps) {
    return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-gray-50/50">
            <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-soft p-8 text-center"
            >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
                    <Rocket className="w-6 h-6 text-blue-500" />
                </div>

                <div className="inline-flex items-center rounded-full bg-gray-50 border border-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-5">
                    Coming Soon
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                    {title}
                </h1>

                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                    {description}
                </p>

                {showHomeButton && (
                    <Link href="/">
                        <Button variant="outline" className="w-full text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200">
                            Back to Homepage
                        </Button>
                    </Link>
                )}
            </motion.div>
        </div>
    );
}
