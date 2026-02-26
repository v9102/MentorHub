"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, GraduationCap, Clock, ArrowLeft, Share2, Copy, Check } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import FadeIn from "@/components/dashboard-ui/FadeIn";

export default function ProfilePreviewPage() {
    const { user } = useUser();
    const [copied, setCopied] = useState(false);
    const linkRef = useRef<HTMLInputElement>(null);

    const profileUrl = typeof window !== "undefined"
        ? `${window.location.origin}/mentors/${user?.id ?? "demo"}`
        : "";

    const handleCopy = () => {
        navigator.clipboard.writeText(profileUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const skills: string[] = (user?.publicMetadata?.skills as string[]) ?? ["React", "TypeScript", "System Design"];
    const title = (user?.publicMetadata?.title as string) ?? "Senior Software Engineer";
    const location = (user?.publicMetadata?.location as string) ?? "Mumbai, India";
    const about = (user?.publicMetadata?.about as string) ?? "Passionate engineer helping students crack top tech companies.";

    return (
        <div className="animate-fadeIn pb-10">
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 -mx-4 md:-mx-6 px-4 md:px-6 mb-6">
                <div className="py-4 flex items-center justify-between">
                    <Link href="/dashboard/profile"
                        className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Profile
                    </Link>
                    <button onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-blue-100">
                        {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Share2 className="w-4 h-4" /> Share Profile</>}
                    </button>
                </div>
            </header>

            <div className="max-w-2xl mx-auto">
                {/* Profile card */}
                <FadeIn delay={0.05}>
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-floating overflow-hidden">
                        {/* Banner */}
                        <div className="h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-violet-500" />

                        {/* Avatar */}
                        <div className="px-6 pb-6">
                            <div className="relative -mt-14 mb-4 w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden">
                                <Image
                                    src={user?.imageUrl ?? "https://api.dicebear.com/9.x/toon-head/svg?seed=Vivian"}
                                    alt={user?.fullName ?? "Mentor"}
                                    width={96} height={96}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                />
                            </div>

                            <h1 className="text-2xl font-bold text-slate-900">{user?.fullName ?? "Mentor Name"}</h1>
                            <p className="text-slate-500 font-medium mt-0.5">{title}</p>

                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500 font-medium">
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" />{location}</span>
                                <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-slate-400" />3+ Years Experience</span>
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" />~2h response time</span>
                            </div>

                            <div className="mt-4 p-4 bg-slate-50 rounded-2xl">
                                <p className="text-sm text-slate-600 leading-relaxed">{about}</p>
                            </div>

                            {skills.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((s) => (
                                            <span key={s} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-bold rounded-xl border border-blue-100">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </FadeIn>

                {/* Share link */}
                <FadeIn delay={0.2}>
                    <div className="mt-5 bg-white rounded-2xl border border-slate-200 shadow-soft p-5">
                        <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Copy className="w-4 h-4 text-slate-400" /> Your Public Profile Link
                        </p>
                        <div className="flex items-center gap-2">
                            <input
                                ref={linkRef}
                                readOnly
                                value={profileUrl}
                                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 font-mono select-all outline-none"
                            />
                            <button onClick={handleCopy}
                                className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
