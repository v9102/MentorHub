"use client";

import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
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

const EXAM_OPTIONS = ["UPSC", "Bank", "NEET", "JEE", "CAT", "SSC"];

export default function ExpertisePage() {
  const router = useRouter();
  const { updateData } = useMentorOnboarding();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<MentorExpertiseInfo>({
    mode: "onChange",
    defaultValues: {
      subjects: [],
      specializations: "",
      exams: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exams",
  });

  const watchExams = watch("exams") || [];

  const handleExamToggle = (examName: string, checked: boolean) => {
    if (checked) {
      append({ examName });
    } else {
      const index = fields.findIndex((f) => f.examName === examName);
      if (index !== -1) remove(index);
    }
  };

  const onSubmit: SubmitHandler<MentorExpertiseInfo> = (data) => {
    // Convert string numbers to numbers for exams if needed
    const processedData = {
      ...data,
      exams: data.exams?.map((exam) => ({
        ...exam,
        mainsAppeared: exam.mainsAppeared ? Number(exam.mainsAppeared) : undefined,
        rank: exam.rank ? Number(exam.rank) : undefined,
        percentile: exam.percentile ? Number(exam.percentile) : undefined,
        selectionYear: exam.selectionYear ? Number(exam.selectionYear) : undefined,
      })),
    };

    updateData({
      expertise: processedData,
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

          <hr className="border-gray-100" />

          {/* Exams Qualified */}
          <div className="space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-900 mb-1">
                Exams Qualified (optional)
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Select exams you've cleared to help students find relevant mentorship.
              </p>
              <div className="flex flex-wrap gap-3">
                {EXAM_OPTIONS.map((exam) => {
                  const isChecked = watchExams.some((e) => e.examName === exam);
                  return (
                    <label
                      key={exam}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-colors ${isChecked
                          ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                          : "border-gray-200 hover:bg-gray-50 text-gray-700"
                        }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isChecked}
                        onChange={(e) => handleExamToggle(exam, e.target.checked)}
                      />
                      {exam}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Exam Details */}
            {fields.map((field, index) => {
              const examName = field.examName;

              return (
                <div
                  key={field.id}
                  className="p-5 border border-blue-100 bg-blue-50/30 rounded-xl space-y-4"
                >
                  <h4 className="font-semibold text-blue-900 border-b border-blue-100 pb-2">
                    {examName} Details
                  </h4>

                  {examName === "UPSC" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Number of Mains Appeared</label>
                        <Input
                          type="number"
                          placeholder="e.g. 2"
                          {...register(`exams.${index}.mainsAppeared`)}
                        />
                      </div>
                      <div className="flex items-center mt-6">
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            {...register(`exams.${index}.recentInterview`)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          Appeared for Interview recently?
                        </label>
                      </div>
                    </div>
                  )}

                  {examName === "Bank" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Bank Name</label>
                        <Input type="text" placeholder="e.g. SBI, RBI" {...register(`exams.${index}.bankName`)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Post Selected</label>
                        <Input type="text" placeholder="e.g. PO, Clerk" {...register(`exams.${index}.postSelected`)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Year of Selection</label>
                        <Input type="number" placeholder="e.g. 2022" {...register(`exams.${index}.selectionYear`)} />
                      </div>
                    </div>
                  )}

                  {(examName === "NEET" || examName === "JEE") && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">College</label>
                        <Input type="text" placeholder="e.g. AIIMS Delhi, IIT Bombay" {...register(`exams.${index}.college`)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Rank</label>
                        <Input type="number" placeholder="e.g. 154" {...register(`exams.${index}.rank`)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Year of Selection</label>
                        <Input type="number" placeholder="e.g. 2023" {...register(`exams.${index}.selectionYear`)} />
                      </div>
                    </div>
                  )}

                  {examName === "CAT" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">College/IIM</label>
                        <Input type="text" placeholder="e.g. IIM Ahmedabad" {...register(`exams.${index}.college`)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Percentile</label>
                        <Input type="number" step="0.01" placeholder="e.g. 99.5" {...register(`exams.${index}.percentile`)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                        <Input type="number" placeholder="e.g. 2021" {...register(`exams.${index}.selectionYear`)} />
                      </div>
                    </div>
                  )}

                  {examName === "SSC" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Year of Selection</label>
                        <Input type="number" placeholder="e.g. 2020" {...register(`exams.${index}.selectionYear`)} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
