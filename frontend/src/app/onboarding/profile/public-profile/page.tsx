"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { MentorProfessionalInfo } from "@/lib/types/mentor-onboarding-data";
import { OnboardingActionButton } from "@/components/onboarding/OnboardingActionButton";
import { useMentorOnboarding } from "@/lib/context/MentorOnboardingContext";

export default function ProfessionalInfoPage() {
  const router = useRouter();
  const { updateData } = useMentorOnboarding();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<MentorProfessionalInfo>({
    mode: "onChange",
    defaultValues: {
      highestQualification: "",
      college: "",
      branch: "",
      passingYear: new Date().getFullYear(),
    },
  });

  const onSubmit = (data: MentorProfessionalInfo) => {
    updateData({
      professionalInfo: data,
    });

    router.push("/onboarding/profile/expertise");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Professional & Academic Background
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tell us about your education and academic credentials
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            {/* Highest Qualification */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Highest Qualification <span className="text-red-500">*</span>
              </label>

              <select
                {...register("highestQualification", {
                  required: "Highest qualification is required",
                })}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">Select qualification</option>
                <option value="bachelors">Bachelor’s</option>
                <option value="masters">Master’s</option>
                <option value="phd">PhD</option>
                <option value="other">Other</option>
              </select>

              {errors.highestQualification && (
                <p className="text-sm text-red-500">
                  {errors.highestQualification.message}
                </p>
              )}
            </div>

            {/* College / University */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">
                College / University <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                placeholder="e.g. IIT Bombay, AIIMS Delhi"
                {...register("college", {
                  required: "College or university is required",
                })}
                className="w-full border rounded-md px-3 py-2"
              />

              {errors.college && (
                <p className="text-sm text-red-500">
                  {errors.college.message}
                </p>
              )}
            </div>

            {/* Branch / Major */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Branch / Major <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                placeholder="e.g. Computer Science, Mechanical, Biology"
                {...register("branch", {
                  required: "Branch or major is required",
                })}
                className="w-full border rounded-md px-3 py-2"
              />

              {errors.branch && (
                <p className="text-sm text-red-500">
                  {errors.branch.message}
                </p>
              )}
            </div>

            {/* Passing Year */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Passing Year <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                placeholder="e.g. 2024"
                {...register("passingYear", {
                  required: "Passing year is required",
                  min: {
                    value: 1980,
                    message: "Year seems too old",
                  },
                  max: {
                    value: new Date().getFullYear() + 1,
                    message: "Year cannot be in the far future",
                  },
                })}
                className="w-full border rounded-md px-3 py-2"
              />

              {errors.passingYear && (
                <p className="text-sm text-red-500">
                  {errors.passingYear.message}
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
