"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

import { MentorPricingInfo } from "@/lib/types/mentor-onboarding-data";
import { OnboardingActionButton } from "@/components/onboarding/OnboardingActionButton";
import { useMentorOnboarding } from "@/lib/context/MentorOnboardingContext";

export default function PricingPage() {
  const router = useRouter();
  const { updateData } = useMentorOnboarding();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<MentorPricingInfo>({
    mode: "onChange",
    defaultValues: {
      pricePerSession: 0,
      sessionDuration: 30,
      isFreeTrialEnabled: false,
    },
  });

  const onSubmit: SubmitHandler<MentorPricingInfo> = (data) => {
    updateData({
      pricing: data,
    });

    router.push("/onboarding/profile/review");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Set your pricing
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            You can change this anytime later
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Price per Session */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Price per session (₹) <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                placeholder="e.g. 499"
                {...register("pricePerSession", {
                  required: "Price is required",
                  min: {
                    value: 0,
                    message: "Price cannot be negative",
                  },
                })}
                className="w-full border rounded-md px-3 py-2"
              />

              {errors.pricePerSession && (
                <p className="text-sm text-red-500">
                  {errors.pricePerSession.message}
                </p>
              )}
            </div>

            {/* Session Duration */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Session duration <span className="text-red-500">*</span>
              </label>

              <select
                {...register("sessionDuration", { required: true })}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            {/* Free Trial */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                {...register("isFreeTrialEnabled")}
                className="mt-1"
              />
              <div>
                <label className="block text-sm font-medium">
                  Offer a free intro call
                </label>
                <p className="text-xs text-gray-500">
                  A short free call helps students decide faster
                </p>
              </div>
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
