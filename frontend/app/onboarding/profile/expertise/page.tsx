"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

import { MentorExpertiseInfo } from "@/lib/types/mentor-onboarding-data";
import { OnboardingActionButton } from "@/components/onboarding/OnboardingActionButton";
import { useMentorOnboarding } from "@/lib/context/MentorOnboardingContext";

const SUBJECT_OPTIONS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Data Structures & Algorithms",
  "Operating Systems",
  "DBMS",
  "Machine Learning",
  "Aptitude",
];

export default function ExpertisePage() {
  const router = useRouter();
  const { updateData } = useMentorOnboarding();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<MentorExpertiseInfo>({
    mode: "onChange",
    defaultValues: {
      subjects: [],
      specializations: "",
    },
  });

  const onSubmit: SubmitHandler<MentorExpertiseInfo> = (data) => {
    updateData({
      expertise: data,
    });

    router.push("/onboarding/profile/availability");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            What are you best at?
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Select the subjects you can mentor in
          </p>
        </div>

        <div className="bg-white rounded-xl border shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Subjects */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Subjects <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUBJECT_OPTIONS.map((subject) => (
                  <label key={subject} className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      value={subject}
                      {...register("subjects", {
                        validate: (v) =>
                          v.length > 0 || "Select at least one subject",
                      })}
                    />
                    {subject}
                  </label>
                ))}
              </div>

              {errors.subjects && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.subjects.message}
                </p>
              )}
            </div>

            {/* Specializations */}
            <div>
              <label className="block text-sm font-medium">
                Specializations (optional)
              </label>

              <input
                type="text"
                placeholder="e.g. JEE Advanced, GATE CSE"
                {...register("specializations")}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

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
