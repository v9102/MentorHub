"use client";

import React from "react";
import { Users, Clock, Calendar, Star } from "lucide-react";
import { motion } from "framer-motion";
import { MentorProfile } from "@/app/(public)/mentors/mock";

interface StatsGridProps {
    mentor: MentorProfile;
}

export const StatsGrid = ({ mentor }: StatsGridProps) => {
    const stats = [
        {
            label: "Students Helped",
            value: mentor.studentsHelped ? `${mentor.studentsHelped}+` : "New",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: "Sessions",
            value: mentor.sessions || 0,
            icon: Calendar,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            label: "Rating",
            value: mentor.rating,
            sub: `(${mentor.reviewsCount} || reviews)`,
            icon: Star,
            color: "text-amber-500",
            bg: "bg-amber-50"
        },
        {
            label: "Response Time",
            value: mentor.responseTime || "24h",
            icon: Clock,
            color: "text-green-600",
            bg: "bg-green-50"
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-150 relative overflow-hidden cursor-default"
                >
                    {/* Background Accent */}
                    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${stat.bg.replace('bg-', 'bg-')}`} />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            {stat.label === "Rating" && (
                                <div className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                    Top 5%
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                                    {stat.value}
                                </span>
                                {stat.label === "Rating" && (
                                    <span className="text-sm font-medium text-slate-500">
                                        / 5.0
                                    </span>
                                )}
                            </div>
                            <p className="text-sm font-medium text-slate-500 mt-1">{stat.label}</p>

                            {stat.sub && (
                                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                                    {stat.sub.replace('||', '').replace('  ', ' ')}
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
