"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Calendar, Clock, Video, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface Session {
  sessionId: string;
  mentorId: string;
  studentId: string;
  mentorName: string;
  studentName: string;
  price: number;
  duration: number;
  paymentStatus: string;
  bookingStatus: string;
  scheduledAt: string;
  roomId?: string;
  createdAt: string;
}

export default function SessionDetailsPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    params.then((p) => {
      setSessionId(p.sessionId);
      fetchSession(p.sessionId);
    });
  }, [params]);

  const fetchSession = async (id: string) => {
    try {
      const response = await fetch(`/api/sessions/${id}`);
      const data = await response.json();

      if (data.success) {
        setSession(data.session);
      }
    } catch (error) {
      console.error("Error fetching session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async () => {
    if (!sessionId) return;

    setJoining(true);
    try {
      const response = await fetch("/api/sessions/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (data.success && data.roomId) {
        router.push(`/call/${data.roomId}`);
      }
    } catch (error) {
      console.error("Error joining session:", error);
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Not Found</h1>
          <p className="text-gray-600 mb-4">The session you're looking for doesn't exist.</p>
          <Link href="/mentors" className="text-blue-600 hover:underline">
            Browse Mentors
          </Link>
        </div>
      </div>
    );
  }

  const scheduledDate = new Date(session.scheduledAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your session has been successfully booked. Check your email for confirmation details.
          </p>
        </div>

        {/* Session Details Card */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Session Details</h2>

          {/* Mentor Info */}
          <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
              {session.mentorName.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{session.mentorName}</h3>
              <p className="text-sm text-gray-600">Mentor</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                {session.bookingStatus}
              </div>
            </div>
          </div>

          {/* Session Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Date</p>
                <p className="font-semibold text-gray-900">
                  {scheduledDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Time</p>
                <p className="font-semibold text-gray-900">
                  {scheduledDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Video className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Duration</p>
                <p className="font-semibold text-gray-900">{session.duration} minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment</p>
                <p className="font-semibold text-gray-900">₹{session.price} - {session.paymentStatus}</p>
              </div>
            </div>
          </div>

          {/* Session ID */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Session ID</p>
            <p className="font-mono text-sm text-gray-900">{session.sessionId}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleJoinSession}
            disabled={joining}
            className="flex-1 bg-blue-600 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {joining ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                Join Session
              </>
            )}
          </button>

          <Link
            href="/dashboard/student/dashboard"
            className="flex-1 bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• You'll receive a confirmation email with session details</li>
            <li>• Join the session 5 minutes before the scheduled time</li>
            <li>• Make sure you have a stable internet connection</li>
            <li>• Test your camera and microphone before joining</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
