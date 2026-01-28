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
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">
          When are you available?
        </h1>
        <p className="text-gray-600 mt-2">
          Select the days and time slots when students can book sessions.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          {/* Available Days */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Available Days <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DAYS_OF_WEEK.map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-orange-50 cursor-pointer transition-colors has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50"
                >
                  <input
                    type="checkbox"
                    value={day}
                    {...register("days", {
                      validate: (value) =>
                        value.length > 0 || "Select at least one day",
                    })}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{day}</span>
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
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Preferred Time Slots <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TIME_SLOTS.map((slot) => (
                <label
                  key={slot}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-orange-50 cursor-pointer transition-colors has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50"
                >
                  <input
                    type="checkbox"
                    value={slot}
                    {...register("timeSlots", {
                      validate: (value) =>
                        value.length > 0 ||
                        "Select at least one time slot",
                    })}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{slot}</span>
                </label>
              ))}
            </div>

            {errors.timeSlots && (
              <p className="text-sm text-red-500">
                {errors.timeSlots.message as string}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <OnboardingActionButton
              isValid={isValid}
              isSubmitting={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
