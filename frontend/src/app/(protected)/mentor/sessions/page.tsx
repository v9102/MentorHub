"use client";

import { useState, useMemo } from "react";
import {
    Calendar as CalendarIcon, Clock, MapPin, Video,
    ChevronRight, ChevronLeft, RotateCcw, User, Loader2,
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import FadeIn from "@/components/dashboard-ui/FadeIn";
import { useUpcomingSessions, useSessionHistory, type DashboardSession } from "@/shared/lib/hooks/useDashboard";

interface Notification { id: string; message: string; }

function isToday(d: Date) {
    const t = new Date();
    return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
}

function MiniCalendar({ selected, onChange, sessionDates }: { selected: Date; onChange: (d: Date) => void; sessionDates: string[] }) {
    const [view, setView] = useState(new Date(selected));
    const y = view.getFullYear(), m = view.getMonth();
    const first = new Date(y, m, 1).getDay();
    const total = new Date(y, m + 1, 0).getDate();
    const label = view.toLocaleString("en-US", { month: "long", year: "numeric" });
    const days: (number | null)[] = [];
    for (let i = 0; i < first; i++) days.push(null);
    for (let i = 1; i <= total; i++) days.push(i);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => setView(new Date(y, m - 1, 1))} className="p-2 hover:bg-slate-100 rounded-lg">
                    <ChevronLeft className="w-4 h-4 text-slate-500" />
                </button>
                <span className="text-base font-bold text-slate-900">{label}</span>
                <button onClick={() => setView(new Date(y, m + 1, 1))} className="p-2 hover:bg-slate-100 rounded-lg">
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div key={d} className="text-center text-xs font-bold text-slate-400 py-1">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, i) => {
                    if (!day) return <div key={i} />;
                    const date = new Date(y, m, day);
                    const sel = date.toDateString() === selected.toDateString();
                    const dot = sessionDates.includes(date.toDateString());
                    const tod = isToday(date);
                    return (
                        <button key={i} onClick={() => onChange(date)}
                            className={`h-10 w-full flex items-center justify-center rounded-xl text-sm font-semibold transition-all relative
                ${sel ? "bg-blue-600 text-white" : tod ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}>
                            {day}
                            {dot && !sel && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function SessionsPage() {
    const [selected, setSelected] = useState(new Date());
    const [notif, setNotif] = useState<Notification | null>(null);

    // Fetch real data from backend
    const { sessions: upcomingSessions, isLoading: upcomingLoading, count: upcomingCount } = useUpcomingSessions();
    const { sessions: historyData, isLoading: historyLoading } = useSessionHistory();

    const isLoading = upcomingLoading || historyLoading;

    // Get session dates for calendar dots
    const sessionDates = useMemo(() => {
        return upcomingSessions.map((s) => new Date(s.date).toDateString());
    }, [upcomingSessions]);

    // Transform sessions for display
    const sessions = useMemo(() => {
        return upcomingSessions.map((s, index) => {
            const sessionDate = new Date(s.date);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            let timeLabel = "";
            if (sessionDate.toDateString() === today.toDateString()) {
                timeLabel = `Today, ${s.startTime}`;
            } else if (sessionDate.toDateString() === tomorrow.toDateString()) {
                timeLabel = `Tomorrow, ${s.startTime}`;
            } else {
                timeLabel = `${sessionDate.toLocaleDateString("en-US", { weekday: "short" })}, ${s.startTime}`;
            }

            // Determine status based on date/time
            const now = new Date();
            const sessionDateTime = new Date(s.date);
            const [hours, minutes] = s.startTime.split(":").map(Number);
            sessionDateTime.setHours(hours, minutes, 0, 0);

            const timeDiffMs = sessionDateTime.getTime() - now.getTime();
            const minutesToStart = timeDiffMs / (1000 * 60);

            let status: "In progress" | "Upcoming" | "Ready" = "Upcoming";
            let canStartMeeting = false;

            if (s.status === "meeting_started" || s.status === "In progress") {
                status = "In progress";
                canStartMeeting = true;
            } else if (s.status === "completed") {
                status = "Upcoming"; // Or Completed, but type restricts to "In progress" | "Upcoming"
            } else if (minutesToStart <= 10 && minutesToStart > -s.duration) {
                // Within 10 mins before start, and hasn't ended yet
                status = "Ready";
                canStartMeeting = true;
            }

            return {
                id: s.bookingId || s._id || `session-${index}`,
                student: s.student.name,
                studentImage: s.student.imageUrl,
                time: timeLabel,
                date: sessionDate,
                topic: `Session with ${s.mentor?.name || "Mentor"}`,
                duration: `${s.duration} min`,
                status,
                canStartMeeting,
                progress: status === "In progress" ? 84 : 0,
                meetingLink: s.meetingLink || `/meeting/${s.bookingId || s._id}`,
            };
        });
    }, [upcomingSessions]);

    // Filter sessions for selected date
    const todaySessions = sessions.filter((s) => s.date.toDateString() === selected.toDateString());

    // Calculate mentoring hours per day (from history)
    const hours = useMemo(() => {
        const dayHours: Record<string, number> = {
            Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
        };
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        // Add hours from completed sessions this week
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());

        [...historyData, ...upcomingSessions].forEach((s) => {
            const sessionDate = new Date(s.date);
            if (sessionDate >= weekStart) {
                const dayName = dayNames[sessionDate.getDay()];
                dayHours[dayName] += (s.duration || 60) / 60;
            }
        });

        return [
            { name: "Mon", hours: dayHours.Mon },
            { name: "Tue", hours: dayHours.Tue },
            { name: "Wed", hours: dayHours.Wed },
            { name: "Thu", hours: dayHours.Thu },
            { name: "Fri", hours: dayHours.Fri },
            { name: "Sat", hours: dayHours.Sat },
            { name: "Sun", hours: dayHours.Sun },
        ];
    }, [historyData, upcomingSessions]);

    // Total completed sessions
    const totalCompleted = historyData.filter(s => s.status === "completed").length;

    const show = (id: string, msg: string) => { setNotif({ id, message: msg }); setTimeout(() => setNotif(null), 3000); };

    return (
        <div className="animate-fadeIn pb-20 md:pb-10">
            {/* Header — Mobile-first: stacked, responsive button */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 mb-5 md:mb-6">
                <div className="py-4 md:py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Sessions</h1>
                        <p className="text-slate-500 mt-0.5 text-xs sm:text-sm truncate">Manage your mentoring schedule</p>
                    </div>
                    <button onClick={() => setSelected(new Date())}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2.5 bg-white border border-slate-200 shadow-soft rounded-xl text-sm font-bold text-slate-700 hover:text-blue-600 hover:border-blue-200 active:bg-slate-50 transition-all w-full sm:w-auto">
                        <RotateCcw className="w-4 h-4" /> Jump to Today
                    </button>
                </div>
            </header>

            {/* Main grid — Mobile: single column, Desktop: 8/4 split */}
            <div className="grid gap-5 md:gap-6 grid-cols-1 lg:grid-cols-12">
                {/* Left — takes full width on mobile, 8 cols on desktop */}
                <div className="lg:col-span-8 space-y-5 md:space-y-6">

                    {/* Selected date card */}
                    <FadeIn delay={0.1} className="bg-white rounded-2xl sm:rounded-3xl shadow-card border border-slate-200 p-4 sm:p-5 md:p-8">
                        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex flex-wrap items-center gap-2 sm:gap-3">
                                    {selected.toLocaleDateString("en-US", { weekday: "long" })}
                                    <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 sm:px-2.5 py-1 rounded-full ${isToday(selected) ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                                        {isToday(selected) ? "Today" : "Selected"}
                                    </span>
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                    {selected.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                </p>
                            </div>
                        </div>
                        {todaySessions.length > 0 ? (
                            <div className="space-y-4">
                                {todaySessions.map((s) => (
                                    <div key={s.id} className="relative flex flex-col gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
                                        <div className="absolute left-0 top-4 bottom-4 w-1 bg-blue-500 rounded-r-full" />
                                        <div className="flex-1 pl-2">
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                                <h3 className="font-bold text-slate-900 text-base sm:text-lg">{s.student}</h3>
                                                <span className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase ${s.status === "In progress" ? "bg-emerald-100 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
                                                    {s.status}
                                                </span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-slate-500 font-medium mb-3 sm:mb-4">{s.topic}</p>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-bold">
                                                <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-100">
                                                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />{s.time.split(", ")[1] || s.time}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-slate-500">
                                                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />Online Video
                                                </span>
                                            </div>
                                        </div>
                                        <button onClick={() => {
                                            if (!s.canStartMeeting) return;
                                            show(`j-${s.id}`, `Joining call with ${s.student}…`);
                                            window.location.href = s.meetingLink;
                                        }}
                                            disabled={!s.canStartMeeting}
                                            className={`relative w-full sm:w-auto px-5 sm:px-6 py-3 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${s.canStartMeeting ? 'bg-slate-900 hover:bg-blue-600 active:bg-blue-700 active:scale-[0.98]' : 'bg-slate-400 cursor-not-allowed opacity-70'}`}>
                                            <Video className="w-4 h-4" /> {s.canStartMeeting ? "Start Meeting" : "Not yet time"}
                                            {notif?.id === `j-${s.id}` && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-0 mb-2 w-max bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl z-50 animate-slideUp">
                                                    {notif.message}<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 w-2 h-2 bg-slate-900 rotate-45" />
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-8 sm:py-10 text-center rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 border-dashed">
                                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-slate-100 flex items-center justify-center mb-3 sm:mb-4">
                                    <CalendarIcon className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400" />
                                </div>
                                <p className="font-semibold text-slate-900 text-sm sm:text-base">No sessions on this date</p>
                            </div>
                        )}
                    </FadeIn>

                    {/* Activity chart */}
                    <FadeIn delay={0.2} className="bg-white rounded-2xl sm:rounded-3xl shadow-card border border-slate-200 p-4 sm:p-5 md:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-5 sm:mb-6">
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900">Mentoring Activity</h3>
                                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Hours this week</p>
                            </div>
                            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl p-2.5 outline-none font-bold w-full sm:w-auto">
                                <option>This Week</option><option>Last Week</option><option>Last Month</option>
                            </select>
                        </div>
                        <div className="h-[220px] sm:h-[260px] -ml-3 sm:ml-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={hours} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                                    <defs>
                                        <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#4338ca" />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v: number) => `${v}h`} />
                                    <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0/.1)", padding: "12px 16px", fontWeight: "bold", color: "#1e293b" }} formatter={(v: number | undefined) => [`${v ?? 0} hours`, "Mentored"]} />
                                    <Bar dataKey="hours" fill="url(#bg2)" radius={[6, 6, 6, 6]} barSize={28} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </FadeIn>
                </div>

                {/* Right sidebar — Mobile: horizontal scroll or stacked, Desktop: fixed sidebar */}
                <div className="lg:col-span-4 flex flex-col gap-5 md:gap-6">
                    {/* Calendar — show first on mobile for quick date selection */}
                    <FadeIn delay={0.2} className="order-first lg:order-none">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-card border border-slate-200 p-4 sm:p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all">
                            <MiniCalendar selected={selected} onChange={setSelected} sessionDates={sessionDates} />
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.3}>
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl sm:rounded-3xl border border-slate-800 p-6 sm:p-8 text-white relative overflow-hidden h-32 sm:h-40 flex flex-col justify-center">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><CalendarIcon className="w-20 h-20 sm:w-24 sm:h-24" /></div>
                            <p className="text-slate-300 text-xs sm:text-sm font-medium mb-1 relative z-10">Total Mentoring Impact</p>
                            <div className="flex items-end gap-2 sm:gap-3 relative z-10">
                                <span className="text-3xl sm:text-4xl font-extrabold">{totalCompleted}</span>
                                <span className="text-slate-400 text-xs sm:text-sm mb-0.5 sm:mb-1">completed sessions</span>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* All sessions table — Mobile: card view, Desktop: table view */}
            <FadeIn delay={0.4} className="mt-5 md:mt-6 bg-white rounded-2xl sm:rounded-3xl shadow-card border border-slate-200 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-slate-100 gap-2 sm:gap-0">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">All Upcoming Sessions</h3>
                    <span className="text-xs font-bold text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-full w-fit">{sessions.length} Total</span>
                </div>

                {/* Desktop table view */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                {["TOPIC", "STUDENT", "PROGRESS", "DATE", "DURATION", "STATUS"].map((h) => (
                                    <th key={h} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {sessions.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-blue-600">{s.topic}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center"><User className="w-4 h-4 text-slate-500" /></div>
                                            <span className="text-sm font-semibold text-slate-700">{s.student}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.progress || 84}%` }} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600">{s.progress || 84}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{s.date.toLocaleDateString("en-IN", { month: "2-digit", day: "2-digit", year: "numeric" })}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{s.duration}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.status === "In progress" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>{s.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile card view */}
                <div className="md:hidden divide-y divide-slate-100">
                    {sessions.map((s) => (
                        <div key={s.id} className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-blue-600 truncate">{s.topic}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                            <User className="w-3 h-3 text-slate-500" />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 truncate">{s.student}</span>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${s.status === "In progress" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                                    {s.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <CalendarIcon className="w-3.5 h-3.5" />
                                    {s.date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {s.duration}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.progress || 84}%` }} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">{s.progress || 84}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </FadeIn>
        </div>
    );
}
