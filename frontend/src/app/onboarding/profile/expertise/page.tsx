"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

import { MentorExpertiseInfo } from "@/shared/lib/types/mentor-onboarding-data";
import { OnboardingActionButton } from "@/modules/onboarding/OnboardingActionButton";
import { useMentorOnboarding } from "@/shared/lib/context/MentorOnboardingContext";
import { Input } from "@/shared/ui/input";

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
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">
          What are you best at?
        </h1>
        <p className="text-gray-600 mt-2">
          Select the subjects you're confident in mentoring.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          {/* Subjects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Subjects <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUBJECT_OPTIONS.map((subject) => (
                <label key={subject} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-orange-50 cursor-pointer transition-colors has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50">
                  <input
                    type="checkbox"
                    value={subject}
                    {...register("subjects", {
                      validate: (v) =>
                        v.length > 0 || "Select at least one subject",
                    })}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{subject}</span>
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Specializations (optional)
            </label>
            <Input
              type="text"
              placeholder="e.g. JEE Advanced, GATE CSE"
              {...register("specializations")}
            />
             <p className="text-xs text-gray-500">
                Mention specific exams or topics you specialize in.
              </p>
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
