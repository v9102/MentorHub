'use client';

import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../shared/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-gray-50/50">
            <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-soft p-8 text-center"
            >
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-6">
                    <Compass className="w-6 h-6 text-red-500" />
                </div>

                <div className="inline-flex items-center rounded-full bg-gray-50 border border-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-5">
                    404 Error
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                    Page not found
                </h1>

                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                    The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                </p>

                <Link href="/">
                    <Button variant="outline" className="w-full text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200">
                        Back to Homepage
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
