"use client";

import { useState, useEffect } from "react";
import { mockMentors as mentors, MentorProfile } from "@/app/(public)/mentors/mock";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { fetchMentorById } from "@/shared/lib/api/mentors"; // Import API
import { Skeleton } from "@/shared/ui/skeleton"; // Import Skeleton

type Props = {
  mentor?: MentorProfile; // Make mentor optional
  mentorId: string;
};

export default function BookingClient({ mentor: initialMentor, mentorId }: Props) {
  const [mentor, setMentor] = useState<MentorProfile | undefined>(initialMentor);
  const [isLoading, setIsLoading] = useState(!initialMentor);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const clerk = useClerk();

  // Fetch mentor if not provided
  useEffect(() => {
    if (!mentor) {
      const loadMentor = async () => {
        setIsLoading(true);
        try {
          const data = await fetchMentorById(mentorId);
          setMentor(data);
        } catch (error) {
          console.error("Failed to fetch mentor locally:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadMentor();
    }
  }, [mentor, mentorId]);

  // Calendar state
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const slots = [
    "10:00 AM – 10:30 AM",
    "11:00 AM – 11:30 AM",
    "04:00 PM – 04:30 PM",
    "06:00 PM – 06:30 PM",
  ];

  /* -------- Calendar logic -------- */
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarCells = Array.from({
    length: firstDayOfMonth + daysInMonth,
  });

  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    { month: "long" }
  );

  const isCurrentMonth =
    currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const handlePrevMonth = () => {
    if (isCurrentMonth) return;

    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }

    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }

    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const canContinue = Boolean(selectedDate && selectedSlot);

  const handleContinue = () => {
    if (!selectedDate || !selectedSlot) return;

    if (!isLoaded) return;

    // Mentor must ideally be loaded here, check safety
    if (!mentor) return;

    if (!isSignedIn) {
      clerk.openSignIn({
        redirectUrl: `/book/${mentor.id}/confirm?date=${encodeURIComponent(
          selectedDate
        )}&time=${encodeURIComponent(selectedSlot)}`,
      });
      return;
    }

    router.push(
      `/book/${mentor.id}/confirm?date=${encodeURIComponent(
        selectedDate
      )}&time=${encodeURIComponent(selectedSlot)}`
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900">Mentor not found</h2>
        <p className="text-gray-500 mt-2">The mentor you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div>
        <p className="text-xs text-gray-500">Step 1 / 2</p>
        <h1 className="text-2xl font-semibold">
          Book Interview with {mentor.name}
        </h1>
        <p className="text-sm text-gray-600 mt-0.5">Select date and time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT CARD */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-1">Mentor</h2>
          <p className="text-sm font-medium">{mentor.name}</p>
          <p className="text-xs text-gray-600">{mentor.tagLine}</p>

          <div className="mt-2 text-xs text-gray-600 space-y-0.5">
            <p>Duration: 30 mins</p>
            <p>Price: ₹{mentor.pricing}</p>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-white border rounded-lg p-4 space-y-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              disabled={isCurrentMonth}
              className={`px-1.5 py-0.5 rounded text-sm ${isCurrentMonth
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100"
                }`}
            >
              ←
            </button>

            <div className="text-sm font-medium">
              {monthName} {currentYear}
            </div>

            <button
              onClick={handleNextMonth}
              className="px-1.5 py-0.5 rounded text-sm hover:bg-gray-100"
            >
              →
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 text-[11px] text-gray-500">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="text-center">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarCells.map((_, index) => {
              const day = index - firstDayOfMonth + 1;

              if (day < 1 || day > daysInMonth) {
                return <div key={index} />;
              }

              const dateObj = new Date(currentYear, currentMonth, day);

              const isPast = dateObj < new Date(today.setHours(0, 0, 0, 0));

              const dateValue = dateObj.toISOString().split("T")[0];

              const isSelected = selectedDate === dateValue;

              return (
                <button
                  key={index}
                  disabled={isPast}
                  onClick={() => {
                    setSelectedDate(dateValue);
                    setSelectedSlot(null);
                  }}
                  className={`text-xs py-1.5 rounded-md transition
                    ${isSelected
                      ? "bg-black text-white"
                      : isPast
                        ? "text-gray-300 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Slots */}
          {selectedDate && (
            <div>
              <h3 className="text-xs font-medium text-gray-600 mb-2">
                Select time
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`border rounded-md px-3 py-2 text-xs text-left transition
                      ${selectedSlot === slot
                        ? "border-black bg-gray-50"
                        : "hover:border-gray-400"
                      }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Continue */}
      <div className="flex justify-end">
        <button
          disabled={!canContinue}
          onClick={handleContinue}
          className={`px-5 py-2 rounded-md text-sm text-white transition ${canContinue
            ? "bg-black hover:bg-gray-800"
            : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

