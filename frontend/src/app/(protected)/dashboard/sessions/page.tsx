"use client";

import { useState } from "react";
import {
    Calendar as CalendarIcon, Clock, MapPin, Video,
    ChevronRight, ChevronLeft, RotateCcw, User,
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import FadeIn from "@/components/dashboard-ui/FadeIn";

interface UpcomingSession {
    id: number; student: string; time: string; date: Date;
    topic: string; duration: string; status: "In progress" | "Upcoming"; progress: number;
}

interface MentoringHour { name: string; hours: number; }
interface Notification { id: string; message: string; }

const sessions: UpcomingSession[] = [
    { id: 1, student: "Arjun Sharma", time: "Today, 2:00 PM", date: new Date(), topic: "React Performance Tuning", duration: "60 min", status: "In progress", progress: 84 },
    { id: 2, student: "Priya Nair", time: "Tomorrow, 10:00 AM", date: new Date(Date.now() + 86400000), topic: "System Design Interview", duration: "45 min", status: "Upcoming", progress: 0 },
    { id: 3, student: "Rahul Gupta", time: "Thu, 4:30 PM", date: new Date(Date.now() + 172800000), topic: "Resume Review", duration: "30 min", status: "Upcoming", progress: 0 },
    { id: 4, student: "Sneha Pillai", time: "Sat, 11:00 AM", date: new Date(Date.now() + 345600000), topic: "Career Guidance", duration: "60 min", status: "Upcoming", progress: 0 },
];

const hours: MentoringHour[] = [
    { name: "Mon", hours: 2.5 }, { name: "Tue", hours: 3.0 }, { name: "Wed", hours: 4.5 },
    { name: "Thu", hours: 2.0 }, { name: "Fri", hours: 5.0 }, { name: "Sat", hours: 6.5 }, { name: "Sun", hours: 1.5 },
];

const sessionDates = sessions.map((s) => s.date.toDateString());

function isToday(d: Date) {
    const t = new Date();
    return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
}

function MiniCalendar({ selected, onChange }: { selected: Date; onChange: (d: Date) => void }) {
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

    const todaySessions = sessions.filter((s) => s.date.toDateString() === selected.toDateString());
    const show = (id: string, msg: string) => { setNotif({ id, message: msg }); setTimeout(() => setNotif(null), 3000); };

    return (
        <div className="animate-fadeIn pb-10">
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 -mx-4 md:-mx-6 px-4 md:px-6 mb-6">
                <div className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Sessions</h1>
                        <p className="text-slate-500 mt-0.5 text-sm">Manage your mentoring schedule and upcoming calls</p>
                    </div>
                    <button onClick={() => setSelected(new Date())}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 shadow-soft rounded-xl text-sm font-bold text-slate-700 hover:text-blue-600 hover:border-blue-200 transition-all self-start sm:self-auto">
                        <RotateCcw className="w-4 h-4" /> Jump to Today
                    </button>
                </div>
            </header>

            <div className="grid gap-6 lg:grid-cols-12">
                {/* Left */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Selected date */}
                    <FadeIn delay={0.1} className="bg-white rounded-3xl shadow-card border border-slate-200 p-5 sm:p-8">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                    {selected.toLocaleDateString("en-US", { weekday: "long" })}
                                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${isToday(selected) ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                                        {isToday(selected) ? "Today" : "Selected"}
                                    </span>
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    {selected.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                </p>
                            </div>
                        </div>
                        {todaySessions.length > 0 ? (
                            <div className="space-y-4">
                                {todaySessions.map((s) => (
                                    <div key={s.id} className="relative flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
                                        <div className="absolute left-0 top-6 bottom-6 w-1 bg-blue-500 rounded-r-full" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-slate-900 text-lg">{s.student}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${s.status === "In progress" ? "bg-emerald-100 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
                                                    {s.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium mb-4">{s.topic}</p>
                                            <div className="flex items-center gap-4 text-xs font-bold">
                                                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                    <Clock className="w-3.5 h-3.5 text-blue-500" />{s.time.split(", ")[1] || s.time}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-slate-500">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />Online Video
                                                </span>
                                            </div>
                                        </div>
                                        <button onClick={() => show(`j-${s.id}`, `Joining call with ${s.student}…`)}
                                            className="relative mt-5 sm:mt-0 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2">
                                            <Video className="w-4 h-4" /> Join Call
                                            {notif?.id === `j-${s.id}` && (
                                                <div className="absolute bottom-full right-0 mb-2 w-max bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl z-50 animate-slideUp">
                                                    {notif.message}<div className="absolute -bottom-1 right-5 w-2 h-2 bg-slate-900 rotate-45" />
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-10 text-center rounded-2xl bg-slate-50 border border-slate-200 border-dashed">
                                <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                    <CalendarIcon className="w-7 h-7 text-slate-400" />
                                </div>
                                <p className="font-semibold text-slate-900">No sessions on this date</p>
                            </div>
                        )}
                    </FadeIn>

                    {/* Activity chart */}
                    <FadeIn delay={0.2} className="bg-white rounded-3xl shadow-card border border-slate-200 p-5 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Mentoring Activity</h3>
                                <p className="text-sm text-slate-500 mt-0.5">Hours this week</p>
                            </div>
                            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl p-2.5 outline-none font-bold">
                                <option>This Week</option><option>Last Week</option><option>Last Month</option>
                            </select>
                        </div>
                        <div className="h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={hours} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                                    <defs>
                                        <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#4338ca" />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={(v: any) => `${v}h`} />
                                    <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0/.1)", padding: "12px 16px", fontWeight: "bold", color: "#1e293b" }} formatter={(v: any) => [`${v} hours`, "Mentored"]} />
                                    <Bar dataKey="hours" fill="url(#bg2)" radius={[6, 6, 6, 6]} barSize={36} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </FadeIn>
                </div>

                {/* Right */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <FadeIn delay={0.2}>
                        <div className="bg-white rounded-3xl shadow-card border border-slate-200 p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all">
                            <MiniCalendar selected={selected} onChange={setSelected} />
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.3}>
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-800 p-8 text-white relative overflow-hidden h-40 flex flex-col justify-center">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><CalendarIcon className="w-24 h-24" /></div>
                            <p className="text-slate-300 text-sm font-medium mb-1 relative z-10">Total Mentoring Impact</p>
                            <div className="flex items-end gap-3 relative z-10">
                                <span className="text-4xl font-extrabold">142</span>
                                <span className="text-slate-400 text-sm mb-1">completed sessions</span>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* All sessions table */}
            <FadeIn delay={0.4} className="mt-6 bg-white rounded-3xl shadow-card border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">All Upcoming Sessions</h3>
                    <span className="text-xs font-bold text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-full">{sessions.length} Total</span>
                </div>
                <div className="overflow-x-auto">
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
            </FadeIn>
        </div>
    );
}
