"use client";

import { useState } from "react";
import { MentorProfile } from "../../mentors/mock";
import { useRouter } from "next/navigation";

type Props = {
  mentor: MentorProfile;
  mentorId: string;
};

export default function BookingClient({ mentor }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const router = useRouter();

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
              className={`px-1.5 py-0.5 rounded text-sm ${
                isCurrentMonth
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
                    ${
                      isSelected
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
                      ${
                        selectedSlot === slot
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
          onClick={() => {
            if (!selectedDate || !selectedSlot) return;

            router.push(
              `/book/${mentor.id}/confirm?date=${encodeURIComponent(
                selectedDate
              )}&time=${encodeURIComponent(selectedSlot)}`
            );
          }}
          className={`px-5 py-2 rounded-md text-sm text-white transition ${
            canContinue
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
