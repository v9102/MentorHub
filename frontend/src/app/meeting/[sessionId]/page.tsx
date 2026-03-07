"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function MeetingPage() {
    const { sessionId } = useParams();
    const { getToken, isLoaded, isSignedIn } = useAuth();

    const [status, setStatus] = useState<"loading" | "authorized" | "unauthorized" | "error">("loading");
    const [role, setRole] = useState<"mentor" | "student" | null>(null);
    const [meetingState, setMeetingState] = useState<string | null>(null);
    const [mentorName, setMentorName] = useState("");
    const [studentName, setStudentName] = useState("");

    // Initial Auth
    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn) {
            setStatus("unauthorized");
            return;
        }

        const authorize = async () => {
            try {
                const token = await getToken();
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
                const res = await fetch(`${backendUrl}/api/meeting/${sessionId}/authorize`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();

                if (data.success) {
                    setRole(data.role);
                    setMeetingState(data.status);
                    setMentorName(data.mentorName || "");
                    setStudentName(data.studentName || "");
                    setStatus("authorized");
                } else {
                    setStatus("unauthorized");
                }
            } catch (err) {
                console.error("Auth error", err);
                setStatus("error");
            }
        };

        authorize();
    }, [isLoaded, isSignedIn, sessionId, getToken]);

    // Student Polling if meeting not started
    useEffect(() => {
        if (role === "student" && meetingState !== "meeting_started" && meetingState !== "In progress") {
            const interval = setInterval(async () => {
                try {
                    const token = await getToken();
                    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
                    const res = await fetch(`${backendUrl}/api/meeting/${sessionId}/authorize`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.success && (data.status === "meeting_started" || data.status === "In progress")) {
                        setMeetingState(data.status);
                        // Notify iframe
                        const iframe = document.getElementById("rtc-iframe") as HTMLIFrameElement;
                        if (iframe && iframe.contentWindow) {
                            iframe.contentWindow.postMessage({ type: "MENTOR_STARTED" }, "*");
                        }
                        clearInterval(interval);
                    }
                } catch (e) { }
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [role, meetingState, sessionId, getToken]);

    useEffect(() => {
        // Listen for message from the iframe when mentor starts the meeting
        const handleMessage = async (event: MessageEvent) => {
            if (event.data?.type === "MEETING_STARTED" && role === "mentor") {
                try {
                    const token = await getToken();
                    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
                    await fetch(`${backendUrl}/api/meeting/${sessionId}/start`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log("Meeting marked as started in backend.");
                } catch (err) {
                    console.error("Failed to start meeting", err);
                }
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [role, sessionId, getToken]);

    if (status === "loading" || !isLoaded) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#1C1C1E] text-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-3 text-lg font-medium">Validating session...</span>
            </div>
        );
    }

    if (status === "unauthorized") {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#1C1C1E] text-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-500 mb-2">Access Denied</h1>
                    <p className="text-slate-400">You do not have permission to join this meeting.</p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#1C1C1E] text-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-500 mb-2">Connection Error</h1>
                    <p className="text-slate-400">Failed to connect to the meeting server.</p>
                </div>
            </div>
        );
    }

    const iframeParams = new URLSearchParams({
        roomId: sessionId as string,
        role: role || "",
        state: meetingState || "",
        mentorName,
        studentName,
    });

    return (
        <div className="h-screen w-screen bg-[#1C1C1E] m-0 p-0 overflow-hidden">
            <iframe
                id="rtc-iframe"
                src={`/rtc/index.html?${iframeParams.toString()}`}
                className="w-full h-full border-none"
                allow="camera; microphone; display-capture; autoplay"
            />
        </div>
    );
}
