"use client";

import {
  User,
  BookOpen,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  Search,
  Compass,
  PlayCircle,
  Activity
} from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { PremiumAreaChart } from "@/shared/ui/PremiumAreaChart";

// Mock data for student learning trends
const learningData = [
  { date: "Mon", value: 1.5 },
  { date: "Tue", value: 2.0 },
  { date: "Wed", value: 0.5 },
  { date: "Thu", value: 3.0 },
  { date: "Fri", value: 1.0 },
  { date: "Sat", value: 4.5 },
  { date: "Sun", value: 5.0 },
];

export default function StudentDashboard() {
  const firstName = "Student"; // Mock or fetch from context

  // Premium Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-app-background pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Student Overview</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back, {firstName}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-soft"
              >
                <Search className="w-4 h-4" />
                Find Mentors
              </Link>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={<PlayCircle className="w-5 h-5 text-indigo-600" />}
              label="Hours Learned"
              value="12.5h"
              trend="This Month"
              trendUp={true}
              neutralTrend={true}
            />
            <StatCard
              icon={<BookOpen className="w-5 h-5 text-emerald-600" />}
              label="Completed Sessions"
              value="8"
              trend="+2 this week"
              trendUp={true}
            />
            <StatCard
              icon={<Star className="w-5 h-5 text-amber-500" />}
              label="Favorite Mentors"
              value="3"
            />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column (Charts & Activity) */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">

              {/* Learning Activity Chart */}
              <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-soft hover:shadow-floating transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Learning Activity</h3>
                    <p className="text-sm text-slate-500">Hours spent in sessions over the last 7 days</p>
                  </div>
                </div>
                <div className="h-[300px] w-full mt-4">
                  <PremiumAreaChart data={learningData} color="#4f46e5" valuePrefix="" />
                </div>
              </div>

              {/* Recommended Mentors (Empty State) */}
              <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-soft">
                <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-slate-900">Recommended Mentors</h4>
                </div>
                <div className="py-8 text-center">
                  <p className="text-slate-500 text-sm mb-4">You haven't booked any sessions recently. Start exploring to get recommendations!</p>
                  <Link href="/mentors" className="text-indigo-600 font-medium text-sm hover:underline">
                    Explore Top Mentors &rarr;
                  </Link>
                </div>
              </div>

            </motion.div>

            {/* Right Column (Upcoming & Bookmarks) */}
            <motion.div variants={itemVariants} className="space-y-8">

              {/* Upcoming Bookings */}
              <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-soft flex items-start flex-col h-[400px]">
                <div className="flex items-center justify-between w-full mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Upcoming Sessions
                  </h3>
                </div>

                <div className="flex-1 w-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                    <Activity className="w-6 h-6 text-slate-300" />
                  </div>
                  <h4 className="text-slate-900 font-medium mb-1">No upcoming sessions</h4>
                  <p className="text-sm text-slate-500 max-w-[200px] mb-6">
                    Ready to learn something new? Book a session with a mentor.
                  </p>
                  <Link
                    href="/mentors"
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-soft"
                  >
                    Find a Mentor
                  </Link>
                </div>
              </div>

            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ---- Premium Helper Components ----

function StatCard({ icon, label, value, trend, trendUp, neutralTrend }: any) {
  return (
    <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-soft hover:shadow-floating transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        {!neutralTrend && trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-md ${trendUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            }`}>
            {trend}
          </span>
        )}
        {neutralTrend && trend && (
          <span className="text-xs font-medium text-slate-500">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
}
