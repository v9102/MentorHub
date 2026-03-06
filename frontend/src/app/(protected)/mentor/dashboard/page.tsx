// ─── Strict migration of final_website/pages/Dashboard.jsx ───────────────────
// Adaptations (framework only, no redesign):
//   • useNavigate → useRouter (next/navigation)
//   • useMentor context → useUser from @clerk/nextjs  (mentor.name, etc.)
//   • "use client" added because hooks are used
//   • Connected to real backend API via useDashboard hooks

"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    TrendingUp,
    Calendar,
    IndianRupee,
    Users,
    Clock,
    ArrowUpRight,
    MoreVertical,
    Wallet,
    Loader2,
} from "lucide-react";
import {
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useUser } from "@clerk/nextjs";
import FadeIn from "@/components/dashboard-ui/FadeIn";
import { useUpcomingSessions, useDashboardStats, useSessionHistory, useMentorProfile } from "@/shared/lib/hooks/useDashboard";
import UpcomingMeetingBanner from "@/shared/ui/UpcomingMeetingBanner";

// ── Tooltip (verbatim from Dashboard.jsx) ─────────────────────────────────────

interface TooltipPayload { value: number; }
interface CustomTooltipProps { active?: boolean; payload?: TooltipPayload[]; label?: string; }

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xl border border-slate-800">
                <p className="text-sm font-medium text-slate-400 mb-1">{label}</p>
                <p className="text-2xl font-bold">₹{payload[0].value}</p>
            </div>
        );
    }
    return null;
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Dashboard() {
    // useUser replaces useMentor; shape mapped to match original Dashboard.jsx usage
    const { user } = useUser();
    const navigate = useRouter();
    const [notification, setNotification] = useState<{ id: string; message: string } | null>(null);
    const [chartVisible, setChartVisible] = useState(false);
    const chartVisibleRef = useRef<HTMLDivElement>(null);

    // Fetch real data from backend
    const { sessions: upcomingSessionsData, isLoading: sessionsLoading } = useUpcomingSessions();
    const { sessions: historyData, isLoading: historyLoading } = useSessionHistory();
    const { completedSessions, totalEarnings, activeStudents, isLoading: statsLoading } = useDashboardStats();
    const { profile, isLoading: profileLoading } = useMentorProfile();

    // Calculate earnings data for chart from history
    const earningData = useMemo(() => {
        if (historyData.length === 0) {
            // Return mock data if no history
            return [
                { name: "Jan", earnings: 0 },
                { name: "Feb", earnings: 0 },
                { name: "Mar", earnings: 0 },
                { name: "Apr", earnings: 0 },
                { name: "May", earnings: 0 },
                { name: "Jun", earnings: 0 },
            ];
        }

        // Group earnings by month
        const monthlyEarnings: Record<string, number> = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        historyData.forEach((session) => {
            if (session.status === "completed" && session.price) {
                const date = new Date(session.date);
                const monthName = months[date.getMonth()];
                monthlyEarnings[monthName] = (monthlyEarnings[monthName] || 0) + session.price;
            }
        });

        // Get last 6 months
        const currentMonth = new Date().getMonth();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            const monthName = months[monthIndex];
            last6Months.push({
                name: monthName,
                earnings: monthlyEarnings[monthName] || 0,
            });
        }

        return last6Months;
    }, [historyData]);

    const isMentor = user?.publicMetadata?.role === "mentor";

    // Transform upcoming sessions for display
    const upcomingSessions = useMemo(() => {
        return upcomingSessionsData.slice(0, 3).map((session, index) => {
            const sessionDate = new Date(session.date);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            let timeLabel = "";
            if (sessionDate.toDateString() === today.toDateString()) {
                timeLabel = `Today, ${session.startTime}`;
            } else if (sessionDate.toDateString() === tomorrow.toDateString()) {
                timeLabel = `Tomorrow, ${session.startTime}`;
            } else {
                timeLabel = `${sessionDate.toLocaleDateString("en-US", { weekday: "short" })}, ${session.startTime}`;
            }

            const otherPerson = isMentor ? session.student : session.mentor;
            return {
                id: session.bookingId || index + 1,
                otherPersonName: otherPerson?.name || (isMentor ? "Student" : "Mentor"),
                time: timeLabel,
                topic: `${session.duration} min session`,
            };
        });
    }, [upcomingSessionsData, isMentor]);

    // Calculate wallet balance (mock for now - would need payment integration)
    const walletBalance = "0.00";

    // Fallback values merged with real data
    const mentor = {
        name: user?.firstName ?? "Mentor",
        totalEarnings: totalEarnings.toLocaleString("en-IN"),
        walletBalance,
        activeStudents,
        sessionsCompleted: completedSessions,
        rating: (profile as any)?.mentorProfile?.rating || "0.0",
        responseTime: "N/A",
    };

    const showNotification = (id: string, message: string) => {
        setNotification({ id, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleShareProfile = () => {
        const url = `${window.location.origin}/mentor/profile`;
        navigator.clipboard.writeText(url).then(() => {
            showNotification("share", "Link copied to clipboard!");
        });
    };

    const isLoading = sessionsLoading || statsLoading;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 md:pb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            <UpcomingMeetingBanner />
            {/* Header — Mobile-first: stacked layout, scales to row on sm+ */}
            <header className="bg-white/70 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-10 -mx-4 md:-mx-6 lg:-mx-8">
                <div className="px-4 pt-5 pb-5 md:px-6 md:pt-6 md:pb-6 lg:px-8 lg:pt-8 max-w-[1800px] mx-auto flex flex-col gap-3 sm:flex-row sm:gap-0 sm:justify-between sm:items-center">
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                        <p className="text-slate-500 mt-0.5 sm:mt-1 text-sm sm:text-base font-medium truncate">Welcome back, {mentor.name}!</p>
                    </div>
                    <button
                        onClick={handleShareProfile}
                        className="relative bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-3 sm:py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-blue-200 w-full sm:w-auto text-center"
                    >
                        Share Profile
                        {notification?.id === "share" && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-0 mt-2 w-max bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-1">
                                {notification.message}
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-3 w-2 h-2 bg-slate-900 rotate-45" />
                            </div>
                        )}
                    </button>
                </div>
            </header>

            {/* Main content — Mobile: tighter spacing, Desktop: original generous spacing */}
            <div className="pt-5 space-y-5 md:pt-6 md:space-y-6 lg:pt-8 lg:space-y-8 max-w-[1800px] mx-auto">

                {/* Top Stats Row — Mobile: single column, scales to grid on larger screens */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    {/* Wallet Card */}
                    <FadeIn delay={0.05}>
                        <div className="bg-gradient-to-br from-yellow-500 via-amber-500 to-yellow-600 rounded-2xl sm:rounded-3xl shadow-lg border border-yellow-400/50 p-5 sm:p-6 hover:shadow-2xl hover:shadow-yellow-500/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 z-0 pointer-events-none" />
                            <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Wallet className="w-16 h-16 sm:w-24 sm:h-24 text-white mix-blend-overlay" />
                            </div>
                            <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-inner">
                                    <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-amber-100 uppercase tracking-wider relative z-10">Wallet Balance</p>
                            <p className="text-2xl sm:text-3xl font-black text-white mt-1 relative z-10 drop-shadow-sm">₹{mentor.walletBalance}</p>
                        </div>
                    </FadeIn>

                    {/* Earnings Card */}
                    <FadeIn delay={0.1}>
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/50 transition-all duration-300 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-3 sm:mb-4">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-emerald-100 flex items-center justify-center">
                                    <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                                </div>
                                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 sm:px-2.5 py-1 rounded-full">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />+14%
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Earnings</p>
                            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">₹{mentor.totalEarnings}</p>
                        </div>
                    </FadeIn>

                    {/* Sessions Card */}
                    <FadeIn delay={0.2}>
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/50 transition-all duration-300">
                            <div className="flex justify-between items-start mb-3 sm:mb-4">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-blue-100 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">Completed Sessions</p>
                            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{mentor.sessionsCompleted}</p>
                        </div>
                    </FadeIn>

                    {/* Active Students Card */}
                    <FadeIn delay={0.3}>
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/50 transition-all duration-300">
                            <div className="flex justify-between items-start mb-3 sm:mb-4">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-violet-100 flex items-center justify-center">
                                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Students</p>
                            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{mentor.activeStudents}</p>
                        </div>
                    </FadeIn>

                    {/* Rating & Response Card */}
                    <FadeIn delay={0.4}>
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200/50 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                            <div className="flex justify-between items-start mb-3 sm:mb-4">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-amber-100 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">Average Rating</p>
                            <div className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-2 mt-1">
                                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{mentor.rating}</p>
                                <p className="text-xs sm:text-sm text-slate-500 sm:mb-1 sm:border-l sm:border-slate-200 sm:pl-2 sm:ml-1">
                                    {mentor.responseTime} avg response
                                </p>
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Main Content Split — Mobile: stacked, Desktop: 2/3 + 1/3 grid */}
                <div className="grid gap-5 md:gap-6 grid-cols-1 lg:grid-cols-3">

                    {/* Chart Section */}
                    <FadeIn delay={0.5} className="lg:col-span-2" onComplete={() => setChartVisible(true)}>
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-6 md:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-5 sm:mb-8">
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">Revenue Overview</h2>
                                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">Your earnings over the last 6 months</p>
                                </div>
                                <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none font-medium w-full sm:w-auto">
                                    <option>Last 6 months</option>
                                    <option>This Year</option>
                                    <option>All Time</option>
                                </select>
                            </div>
                            <div className="h-[250px] sm:h-[300px] w-full -ml-2 sm:ml-0">
                                {chartVisible && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={earningData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                                            <defs>
                                                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#ec4899" stopOpacity={1} />
                                                </linearGradient>
                                                <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                                <filter id="shadow" height="200%">
                                                    <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#8b5cf6" floodOpacity="0.3" />
                                                </filter>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(value: number) => `₹${value}`} width={50} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#8b5cf6", strokeWidth: 1, strokeDasharray: "4 4" }} />
                                            <Area type="monotone" dataKey="earnings" stroke="none" fill="url(#fillGradient)" />
                                            <Line
                                                type="monotone" dataKey="earnings"
                                                stroke="url(#colorGradient)" strokeWidth={4} filter="url(#shadow)"
                                                dot={{ fill: "#fff", stroke: "#a78bfa", strokeWidth: 2, r: 4 }}
                                                activeDot={{ fill: "#fff", stroke: "#ec4899", strokeWidth: 3, r: 6 }}
                                            />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </FadeIn>

                    {/* Upcoming Sessions Section */}
                    <FadeIn delay={0.6}>
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-6 md:p-8">
                            <div className="flex items-center justify-between mb-5 sm:mb-8">
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Upcoming Sessions</h2>
                                <button
                                    onClick={() => showNotification("session-opts", "Options menu coming soon")}
                                    className="relative text-blue-600 hover:bg-blue-50 active:bg-blue-100 p-2.5 sm:p-2 rounded-xl transition-colors"
                                >
                                    <MoreVertical className="w-5 h-5" />
                                    {notification?.id === "session-opts" && (
                                        <div className="absolute top-full right-0 mt-2 w-max bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-1">
                                            {notification.message}
                                            <div className="absolute -top-1 right-3 w-2 h-2 bg-slate-900 rotate-45" />
                                        </div>
                                    )}
                                </button>
                            </div>

                            <div className="space-y-5 sm:space-y-6">
                                {upcomingSessions.map((session) => (
                                    <div key={session.id} className="flex gap-3 sm:gap-4 group">
                                        <div className="flex flex-col items-center mt-1">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                                            <div className="w-px h-full bg-slate-100 my-1 group-last:hidden" />
                                        </div>
                                        <div className="flex-1 pb-2 min-w-0">
                                            <p className="text-sm sm:text-base font-bold text-slate-900 truncate">{session.otherPersonName}</p>
                                            <p className="text-xs sm:text-sm font-medium text-blue-600 mt-0.5 truncate">{session.topic}</p>
                                            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-slate-500 mt-2 bg-slate-50 w-fit px-2 py-1 rounded-md">
                                                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                {session.time}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => navigate.push("/mentor/sessions")}
                                className="w-full mt-5 sm:mt-6 py-3 px-4 border-2 border-slate-100 hover:border-slate-200 active:bg-slate-50 text-slate-600 font-bold rounded-xl sm:rounded-2xl transition-all"
                            >
                                View Calendar
                            </button>
                        </div>
                    </FadeIn>

                </div>
            </div>
        </div>
    );
}
