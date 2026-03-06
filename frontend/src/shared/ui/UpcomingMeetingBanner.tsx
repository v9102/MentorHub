"use client";

import { useUpcomingSessions } from "@/shared/lib/hooks/useDashboard";
import { Calendar, Clock, Video, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function UpcomingMeetingBanner() {
    const { isSignedIn, user } = useUser();
    const { getToken } = useAuth();
    const router = useRouter();
    const { sessions, isLoading } = useUpcomingSessions();
    const [isScrolled, setIsScrolled] = useState(false);
    const [meetingStatus, setMeetingStatus] = useState<string | null>(null);
    const [isJoining, setIsJoining] = useState(false);

    useEffect(() => {
        const sentinel = document.createElement('div');
        sentinel.style.position = 'absolute';
        sentinel.style.top = '500px';
        sentinel.style.height = '1px';
        sentinel.style.width = '100%';
        sentinel.style.pointerEvents = 'none';
        document.body.prepend(sentinel);

        const observer = new IntersectionObserver(
            ([entry]) => setIsScrolled(!entry.isIntersecting),
            { threshold: [1] }
        );
        observer.observe(sentinel);

        return () => { observer.disconnect(); sentinel.remove(); };
    }, []);

    const upcomingSession = sessions.find(
        (s) => s.status === "confirmed" || s.status === "pending" ||
            s.status === "meeting_started" || s.status === "meeting_ready" ||
            s.status === "In progress"
    );

    let meetingStartDateTime: Date | null = null;
    const now = new Date();

    let msUntilMeeting = 0;
    let hoursUntilMeeting = 0;
    let minutesUntilMeeting = 0;

    if (upcomingSession) {
        const [year, month, day] = upcomingSession.date.split("-").map(Number);
        const [startHour, startMin] = upcomingSession.startTime.split(":").map(Number);
        meetingStartDateTime = new Date(year, month - 1, day, startHour, startMin);
        msUntilMeeting = meetingStartDateTime.getTime() - now.getTime();
        hoursUntilMeeting = msUntilMeeting / (1000 * 60 * 60);
        minutesUntilMeeting = msUntilMeeting / (1000 * 60);
    }

    const isMentor = user?.publicMetadata?.role === "mentor";
    const isStudent = !isMentor;
    const sessionId = upcomingSession?.bookingId || (upcomingSession as any)?._id;
    const otherPersonName = upcomingSession
        ? (isMentor ? upcomingSession.student?.name : upcomingSession.mentor?.name)
        : undefined;

    const formattedDate = meetingStartDateTime?.toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric", year: "numeric",
    }) ?? "";

    const fmtTime = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        const ampm = h >= 12 ? "PM" : "AM";
        const hour = h % 12 || 12;
        return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
    };

    // Determine student meeting status (either from session or polled)
    const currentStatus = upcomingSession ? (meetingStatus ?? upcomingSession.status) : null;
    const meetingHasStarted =
        currentStatus === "meeting_started" || currentStatus === "In progress";

    // Student can join only if within 10 min of start AND mentor has started
    const withinJoinWindow = upcomingSession ? minutesUntilMeeting <= 10 : false;

    const pollMeetingStatus = useCallback(async () => {
        if (!isStudent || !sessionId) return;
        try {
            const token = await getToken();
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
            const res = await fetch(`${backendUrl}/api/meeting/${sessionId}/authorize`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setMeetingStatus(data.status);
        } catch { /* silent */ }
    }, [isStudent, sessionId, getToken]);

    useEffect(() => {
        if (!isStudent || !withinJoinWindow) return;
        // Poll every 8 seconds while within window and not yet started
        if (meetingHasStarted) return;
        const interval = setInterval(pollMeetingStatus, 8000);
        pollMeetingStatus(); // immediate first check
        return () => clearInterval(interval);
    }, [isStudent, withinJoinWindow, meetingHasStarted, pollMeetingStatus]);

    const shouldHideBanner =
        !isSignedIn ||
        isLoading ||
        !upcomingSession ||
        !meetingStartDateTime ||
        hoursUntilMeeting > 24 ||
        msUntilMeeting < -15 * 60 * 1000;

    if (shouldHideBanner) return null;

    const handleStudentJoin = async () => {
        if (!meetingHasStarted) return;
        setIsJoining(true);
        router.push(`/meeting/${sessionId}`);
    };

    return (
        <div
            className={`
                fixed left-3 right-3 sm:left-0 sm:right-0 w-auto sm:w-full z-40 
                bg-gradient-to-r from-blue-600 to-indigo-700 text-white 
                shadow-xl sm:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] 
                rounded-2xl sm:rounded-none border border-white/10 sm:border-0 
                overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${isScrolled ? 'bottom-[88px] sm:bottom-0' : 'bottom-3 sm:bottom-0'}
            `}
            style={{ transform: 'translateZ(0)' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />

                <div className="py-3 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                    {/* Left: info */}
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm shrink-0">
                            <Video className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm sm:text-base leading-tight">
                                {isMentor ? "Upcoming session with " : "Your session with "}
                                <span className="font-bold">{otherPersonName || (isMentor ? "your student" : "your mentor")}</span>
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-blue-100 mt-0.5">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formattedDate}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {fmtTime(upcomingSession!.startTime)} — {fmtTime(upcomingSession!.endTime)}
                                </span>
                                {/* Status badge for student */}
                                {isStudent && withinJoinWindow && (
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${meetingHasStarted ? 'bg-green-400/30 text-green-100' : 'bg-yellow-400/20 text-yellow-100'}`}>
                                        {meetingHasStarted ? "● Live" : "● Waiting for mentor"}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: CTA — Role-based */}
                    {isMentor ? (
                        <Link
                            href={`/mentor/sessions`}
                            className="shrink-0 w-full sm:w-auto text-center inline-flex justify-center items-center gap-2 px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 text-sm font-semibold rounded-lg transition-colors shadow-sm"
                        >
                            Go to Sessions
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    ) : (
                        /* Student: Join Meeting button */
                        withinJoinWindow ? (
                            <button
                                onClick={handleStudentJoin}
                                disabled={!meetingHasStarted || isJoining}
                                className={`shrink-0 w-full sm:w-auto text-center inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm
                                    ${meetingHasStarted && !isJoining
                                        ? "bg-white text-blue-700 hover:bg-blue-50 cursor-pointer"
                                        : "bg-white/30 text-white/70 cursor-not-allowed"
                                    }`}
                            >
                                {isJoining
                                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Joining...</>
                                    : meetingHasStarted
                                        ? <><Video className="w-4 h-4" /> Join Meeting</>
                                        : <><Loader2 className="w-4 h-4 animate-spin" /> Waiting for mentor...</>
                                }
                            </button>
                        ) : (
                            /* More than 10 min away — show countdown info only */
                            <Link
                                href={`/session/${sessionId}`}
                                className="shrink-0 w-full sm:w-auto text-center inline-flex justify-center items-center gap-2 px-4 py-2 bg-white/20 text-white text-sm font-semibold rounded-lg transition-colors"
                            >
                                View Details
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

