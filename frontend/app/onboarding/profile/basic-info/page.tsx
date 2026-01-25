"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { MentorBasicInfo } from "@/lib/types/mentor-onboarding-data";
import { OnboardingActionButton } from "@/components/onboarding/OnboardingActionButton";
import { useMentorOnboarding } from "@/lib/context/MentorOnboardingContext";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

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
    <div className="max-w-2xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">
          Basic Information
        </h1>
        <p className="text-gray-600 mt-2">
          Tell us about yourself so students can get to know you better.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                    placeholder="e.g. John"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                    placeholder="e.g. Doe"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
              </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Gender <span className="text-red-500">*</span>
            </label>
            <Select
              {...register("gender", {
                required: "Gender is required",
              })}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">
                Prefer not to say
              </option>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-500">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Work Experience - OPTIONAL FIELD EXAMPLE OR JUST SPACING */}
          <div className="pt-4">
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
