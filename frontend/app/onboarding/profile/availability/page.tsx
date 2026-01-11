"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

import { MentorAvailabilityInfo } from "@/lib/types/mentor-onboarding-data";
import { OnboardingActionButton } from "@/components/onboarding/OnboardingActionButton";
import { useMentorOnboarding } from "@/lib/context/MentorOnboardingContext";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIME_SLOTS = [
  "Morning (6 AM – 12 PM)",
  "Afternoon (12 PM – 4 PM)",
  "Evening (4 PM – 8 PM)",
  "Night (8 PM – 12 AM)",
];

export default function AvailabilityPage() {
  const router = useRouter();
  const { updateData } = useMentorOnboarding();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<MentorAvailabilityInfo>({
    mode: "onChange",
    defaultValues: {
      days: [],
      timeSlots: [],
    },
  });

  const onSubmit: SubmitHandler<MentorAvailabilityInfo> = (data) => {
    updateData({
      availability: data,
    });

    router.push("/onboarding/profile/pricing");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            When are you available?
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Select the days and time slots when students can book sessions
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Available Days */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Available Days <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <label
                    key={day}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      value={day}
                      {...register("days", {
                        validate: (value) =>
                          value.length > 0 || "Select at least one day",
                      })}
                    />
                    {day}
                  </label>
                ))}
              </div>

              {errors.days && (
                <p className="text-sm text-red-500">
                  {errors.days.message as string}
                </p>
              )}
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Preferred Time Slots <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <label
                    key={slot}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      value={slot}
                      {...register("timeSlots", {
                        validate: (value) =>
                          value.length > 0 ||
                          "Select at least one time slot",
                      })}
                    />
                    {slot}
                  </label>
                ))}
              </div>

              {errors.timeSlots && (
                <p className="text-sm text-red-500">
                  {errors.timeSlots.message as string}
                </p>
              )}
            </div>

            {/* Action */}
            <OnboardingActionButton
              isValid={isValid}
              isSubmitting={isSubmitting}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
