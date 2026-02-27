"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { type MentorProfile } from "@/app/(public)/mentors/mock";

import { CheckCircle, Loader2 } from "lucide-react";

type Props = {
  mentor: MentorProfile;
  sessionDate: string;
  sessionTime: string;
  price: number;
};

export default function ConfirmClient({ mentor, sessionDate, sessionTime, price }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const date = searchParams.get("date");
  const time = searchParams.get("time");

  // Parse time string like "11:25 AM IST" to get just "11:25"
  const parseTime = (timeStr: string | null): string => {
    if (!timeStr) return "10:00";
    const match = timeStr.match(/^(\d{1,2}:\d{2})/);
    return match ? match[1] : "10:00";
  };

  console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
  const handlePayment = async () => {
    setProcessing(true);
    setError(null);

    try {
      // Get auth token for backend
      const token = await getToken();

      // Simulate payment processing delay (remove in production with real payment)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Call backend booking API to persist to database
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pay-now`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          // Use mongoId for backend, fallback to id if not available
          mentorId: mentor.mongoId || mentor.id,
          date: date,
          startTime: time || sessionTime,
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.slice(0, 500));
        setError("Server error. Please try again later.");
        setProcessing(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        // Redirect to session/booking details page
        router.push(`/session/${data.booking?._id || 'success'}`);
      } else {
        setError(data.msg || data.error || "Booking failed. Please try again.");
        setProcessing(false);
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("An error occurred. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">Step 2 / 2</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Confirm Booking
          </h1>
          <p className="text-gray-600">Review your booking details and proceed to payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Booking Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mentor Card */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Session Details</h2>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold">
                  {mentor.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{mentor.name}</h3>
                  <p className="text-sm text-gray-600">{mentor.tagLine}</p>
                  <p className="text-sm text-gray-500 mt-1">{mentor.college}</p>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium text-gray-900">
                    {date ? new Date(date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : sessionDate}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium text-gray-900">{time || sessionTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium text-gray-900">30 minutes</span>
                </div>
              </div>
            </div>

            {/* Mock Payment Notice */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Mock Payment Mode</h4>
                  <p className="text-sm text-blue-700">
                    This is a demo payment. Your session will be confirmed instantly without actual payment processing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Session Fee</span>
                  <span className="font-medium text-gray-900">₹{price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium text-gray-900">₹0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium text-gray-900">₹{Math.round(price * 0.18)}</span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-gray-900">
                      ₹{price + Math.round(price * 0.18)}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-blue-600 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${price + Math.round(price * 0.18)}`
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By proceeding, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
