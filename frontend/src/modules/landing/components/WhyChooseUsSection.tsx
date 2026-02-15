'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { GraduationCap, Scan, Headphones, Waypoints } from 'lucide-react';
import Image from 'next/image';

// Define feature type
type Feature = {
    title: string;
    description: string;
    icon: typeof GraduationCap; // Use one icon type as reference
    position: string;
};

const features: Feature[] = [
    {
        title: "Talk to Serving Officers",
        description: "Chat, call, or video with IAS, IPS, and IRS officers who've cracked it themselves - get prep hacks, exam strategy, and real guidance.",
        icon: GraduationCap,
        position: "left",
    },
    {
        title: "Clear Doubts with Experts",
        description: "Stuck in Polity, Economy, Ethics, or Essay? Connect 1:1 with subject matter experts who'll explain concepts and review your answers.",
        icon: Scan,
        position: "right",
    },
    {
        title: "Stay Motivated & Disciplined",
        description: "Beat burn-out and procrastination with mentors who have faced the rigorous cycle of Prelims-Mains-Interview.",
        icon: Headphones,
        position: "left",
    },
    {
        title: "Plan Smarter, Not Harder",
        description: "From decoding the syllabus to daily scheduling - get a study plan that covers GS, Optional, and Current Affairs efficiently.",
        icon: Waypoints,
        position: "right",
    }
];

export default function WhyChooseUsSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const imageY = useTransform(smoothProgress, [0.1, 0.6], [100, 0]);
    const imageOpacity = useTransform(smoothProgress, [0.1, 0.4], [0, 1]);
    const imageScale = useTransform(smoothProgress, [0.1, 0.6], [0.95, 1]);

    const leftX = useTransform(smoothProgress, [0.2, 0.5], [-50, 0]);
    const leftOpacity = useTransform(smoothProgress, [0.2, 0.4], [0, 1]);

    const rightX = useTransform(smoothProgress, [0.2, 0.5], [50, 0]);
    const rightOpacity = useTransform(smoothProgress, [0.2, 0.4], [0, 1]);

    // Split features for layout
    const leftFeatures = [features[0], features[2]];
    const rightFeatures = [features[1], features[3]];

    return (
        <section ref={containerRef} className="relative bg-white py-24 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <span className="text-orange-500 font-bold tracking-wide uppercase text-sm">
                        OUR OFFERINGS
                    </span>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        From Scattered to Structured – Towards Your Goal
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center max-w-7xl mx-auto">

                    {/* LEFT COLUMN */}
                    <motion.div
                        style={{ x: leftX, opacity: leftOpacity }}
                        className="space-y-16 order-2 lg:order-1"
                    >
                        {leftFeatures.map((feature, idx) => (
                            <FeatureItem key={idx} feature={feature} align="right" />
                        ))}
                    </motion.div>

                    {/* CENTER COLUMN (IMAGE) */}
                    <div className="relative order-1 lg:order-2 flex justify-center">
                        <motion.div
                            style={{ y: imageY, opacity: imageOpacity, scale: imageScale }}
                            className="relative z-10 rounded-tl-[4rem] rounded-br-[4rem] overflow-hidden shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-blue-600 top-20 -z-10 mx-4" />
                            <Image
                                src="/student-success.png"
                                alt="Student with books"
                                width={400}
                                height={500}
                                className="w-auto h-[500px] object-cover"
                                priority
                            />
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <motion.div
                        style={{ x: rightX, opacity: rightOpacity }}
                        className="space-y-16 order-3 lg:mt-24"
                    >
                        {rightFeatures.map((feature, idx) => (
                            <FeatureItem key={idx} feature={feature} align="left" />
                        ))}
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

// Helper component to safely render icons and avoid JSX parsing errors
function FeatureItem({ feature, align }: { feature: Feature, align: 'left' | 'right' }) {
    const Icon = feature.icon;
    return (
        <div className={`flex flex-col items-center lg:items-${align === 'left' ? 'start' : 'end'} text-center lg:text-${align}`}>
            <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-4 text-gray-700">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-500 leading-relaxed max-w-xs">{feature.description}</p>
        </div>
    );
}
