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
        <section ref={containerRef} className="relative bg-white py-24 md:py-32 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-50/60 rounded-full blur-[100px] mix-blend-multiply" />
                <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50/60 rounded-full blur-[100px] mix-blend-multiply" />
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <span className="text-blue-700 font-bold tracking-wider uppercase text-xs px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
                        Why Choose MentoMania
                    </span>
                    <h2 className="mt-8 text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-6">
                        From Scattered to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Structured</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Stop wasting time on random videos and outdated material. Get a personalized roadmap from those who have already reached the destination.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-center">

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
                    <div className="relative order-1 lg:order-2 flex justify-center py-8">
                        <motion.div
                            style={{ y: imageY, opacity: imageOpacity, scale: imageScale }}
                            className="relative z-10 w-full max-w-[400px] lg:max-w-full"
                        >
                            <div
                                className="relative rounded-[2.5rem] overflow-hidden bg-white border-[8px] border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-gray-100"
                            >
                                <Image
                                    src="/whychooseus.png"
                                    alt="Student successfully studying with mentorship"
                                    width={450}
                                    height={550}
                                    className="w-auto h-[500px] object-cover block"
                                    priority
                                />

                                {/* Decorative badge */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-blue-50 flex items-center gap-3 whitespace-nowrap">
                                    <div className="flex -space-x-3">
                                        {[
                                            '/mentors/amit.jpg',
                                            '/mentors/karthik.jpg',
                                            '/mentors/rahul.jpg'
                                        ].map((src, i) => (
                                            <div key={i} className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                                                <Image
                                                    src={src}
                                                    alt="Mentor Avatar"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-bold text-gray-900 block">500+ Top Mentors</span>
                                        <span className="text-xs text-gray-500">Ready to guide you</span>
                                    </div>
                                </div>
                            </div>

                            {/* Abstract background graphical element behind image */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] -z-10 rotate-6 scale-[0.9] opacity-20 blur-xl"></div>
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
    const isLeft = align === 'left';

    return (
        <div className={`flex flex-col lg:flex-row gap-5 items-center lg:items-start text-center lg:text-left ${!isLeft ? 'lg:flex-row-reverse lg:text-right' : ''}`}>
            <div className="flex-shrink-0 relative group">
                <div className="absolute inset-0 bg-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7" strokeWidth={1.5} />
                </div>
            </div>
            <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{feature.description}</p>
            </div>
        </div>
    );
}
