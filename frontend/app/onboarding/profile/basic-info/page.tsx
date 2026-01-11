"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { MentorBasicInfo } from "@/lib/types/mentor-onboarding-data";
import { OnboardingActionButton } from "@/components/onboarding/OnboardingActionButton";
import { useMentorOnboarding } from "@/lib/context/MentorOnboardingContext";

export default function BasicInfoPage() {
  const { user } = useUser();
  const router = useRouter();
  const { updateData } = useMentorOnboarding();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<MentorBasicInfo>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      profilePhoto: "",
      gender: "prefer-not-to-say",
      currentOrganisation: "",
      industry: "",
      currentRole: "",
      workExperience: 0,
    },
  });

  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName ?? "");
      setValue("lastName", user.lastName ?? "");
      setValue("profilePhoto", user.imageUrl ?? "");
    }
  }, [user, setValue]);

  const onSubmit = (data: MentorBasicInfo) => {
    updateData({
      basicInfo: data,
    });

    router.push("/onboarding/profile/public-profile");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Basic Information
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tell us about yourself
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            {/* First Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className="w-full border rounded-md px-3 py-2"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("lastName", {
                  required: "Last name is required",
                })}
                className="w-full border rounded-md px-3 py-2"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                {...register("gender", {
                  required: "Gender is required",
                })}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">
                  Prefer not to say
                </option>
              </select>
              {errors.gender && (
                <p className="text-sm text-red-500">
                  {errors.gender.message}
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
