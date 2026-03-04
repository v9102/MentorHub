"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Home, Users } from "lucide-react";
import Link from "next/link";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

export default function BookingSuccessPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCountdown(c => {
                if (c <= 1) {
                    clearInterval(intervalRef.current!);
                    router.replace("/");
                    return 0;
                }
                return c - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="max-w-lg w-full text-center"
            >
                {/* Success icon */}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-xl mb-6">
                    <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
                </div>

                {/* Heading */}
                <div className="inline-block bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
                        Booking Confirmed!
                    </h1>
                </div>
                <p className="text-gray-500 text-lg mb-2">
                    Your mentorship session has been booked successfully.
                </p>
                <p className="text-gray-400 text-sm mb-10">
                    You&apos;ll receive a confirmation email with all the details shortly.
                </p>

                {/* Countdown */}
                <p className="text-sm text-gray-400 mb-6">
                    Redirecting to home in{" "}
                    <span className="font-bold text-violet-600 text-base">{countdown}</span>s…
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-violet-700 hover:to-indigo-700 transition-all duration-200"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </Link>
                    <Link
                        href="/mentors"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border-2 border-violet-200 text-violet-700 font-semibold rounded-xl hover:border-violet-400 hover:bg-violet-50 transition-all duration-200"
                    >
                        <Users className="w-5 h-5" />
                        Explore Mentors
                    </Link>
                </div>

                {/* Decorative pills */}
                <div className="mt-12 flex flex-wrap justify-center gap-3 text-xs text-gray-400">
                    {["Session scheduled", "Email on its way", "Securely booked"].map(t => (
                        <span key={t} className="px-3 py-1.5 bg-white border border-gray-100 rounded-full shadow-sm">
                            {t}
                        </span>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
