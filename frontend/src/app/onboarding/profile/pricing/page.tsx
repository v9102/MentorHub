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
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">
          Set your pricing
        </h1>
        <p className="text-gray-600 mt-2">
          You can change this anytime later.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price per Session */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Price per session (₹) <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                placeholder="e.g. 499"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("pricePerSession", {
                  required: "Price is required",
                  min: {
                    value: 0,
                    message: "Price cannot be negative",
                  },
                })}
              />

              {errors.pricePerSession && (
                <p className="text-sm text-red-500">
                  {errors.pricePerSession.message}
                </p>
              )}
            </div>

            {/* Session Duration */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Session duration <span className="text-red-500">*</span>
              </label>

              <select {...register("sessionDuration", { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
          </div>

          {/* Free Trial */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              {...register("isFreeTrialEnabled")}
              className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Offer a free intro call
              </label>
              <p className="text-xs text-gray-500 mt-0.5">
                A short free call helps students decide faster.
              </p>
            </div>
          </div>

          <div className="pt-2">
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
