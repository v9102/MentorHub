"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BadgeCheck } from "lucide-react";
import { useMentorOnboarding } from "@/shared/lib/context/MentorOnboardingContext";

type ExpertiseFormValues = {
  examExpertise: string;
  currentRole: string;
  rankOrScore: string;
  keyHighlights: string;
  // UPSC specific
  timesMainsAppeared?: string;
  recentInterview?: string;
  // Banking specific
  bankingExam?: string;
  selectedYear?: string;
  // NEET/JEE/CLAT specific
  college?: string;
  rank?: string;
  yearOfSelection?: string;
  // CAT specific
  percentile?: string;
  // SSC specific
  sscExam?: string;
  // CA/CMA/CS specific
  caType?: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, delay: i * 0.07, ease: "easeOut" as const },
  }),
};

export default function ExpertisePage() {
  const router = useRouter();
  const { data: onboardingData, updateData } = useMentorOnboarding();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ExpertiseFormValues>({
    mode: "onChange",
    defaultValues: {
      examExpertise: "",
      currentRole: "",
      rankOrScore: "",
      keyHighlights: "",
    },
  });

  // Load saved data from context
  useEffect(() => {
    if (onboardingData.expertise) {
      const saved = onboardingData.expertise as any;
      if (saved.examExpertise) setValue("examExpertise", saved.examExpertise);
      if (saved.currentRole) setValue("currentRole", saved.currentRole);
      if (saved.rankOrScore) setValue("rankOrScore", saved.rankOrScore);
      if (saved.keyHighlights) setValue("keyHighlights", saved.keyHighlights);
      // Exam-specific fields
      if (saved.timesMainsAppeared) setValue("timesMainsAppeared", saved.timesMainsAppeared);
      if (saved.recentInterview) setValue("recentInterview", saved.recentInterview);
      if (saved.bankingExam) setValue("bankingExam", saved.bankingExam);
      if (saved.selectedYear) setValue("selectedYear", saved.selectedYear);
      if (saved.college) setValue("college", saved.college);
      if (saved.rank) setValue("rank", saved.rank);
      if (saved.yearOfSelection) setValue("yearOfSelection", saved.yearOfSelection);
      if (saved.percentile) setValue("percentile", saved.percentile);
      if (saved.sscExam) setValue("sscExam", saved.sscExam);
      if (saved.caType) setValue("caType", saved.caType);
    }
  }, [onboardingData.expertise, setValue]);

  const selectedExam = watch("examExpertise");

  const onSubmit: SubmitHandler<ExpertiseFormValues> = (data) => {
    updateData({ expertise: data as any });
    router.push("/onboarding/profile/verification");
  };

  return (
    <div className="px-4 py-6 sm:py-8 space-y-4 sm:space-y-6">
      {/* ── Progress Header ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className="max-w-2xl mx-auto rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              2
            </span>
            <p className="text-sm sm:text-base font-semibold text-slate-900">Step 2 of 4</p>
          </div>
          <p className="text-xs sm:text-sm font-bold text-primary">50% Complete</p>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-primary/10">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: "50%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
        <div className="mt-3 flex items-center gap-2 text-slate-500">
          <span className="material-symbols-outlined text-[18px]">work</span>
          <p className="text-sm font-medium">Professional Background &amp; Expertise</p>
        </div>
      </motion.div>

      {/* ── Form Card ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
        className="max-w-2xl mx-auto overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        {/* Card Header */}
        <div className="border-b border-slate-100 p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Tell us about your expertise
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            This information helps us verify your profile and match you with the most relevant
            aspirants looking for guidance.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 sm:space-y-8 p-4 sm:p-8">
            {/* Core Info */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {/* Exam Expertise */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Exam Expertise <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register("examExpertise", { required: "Please select an exam" })}
                  className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="" disabled>Select primary exam</option>
                  <option value="upsc">UPSC CSE</option>
                  <option value="banking">Banking</option>
                  <option value="neet">NEET</option>
                  <option value="jee">JEE</option>
                  <option value="cat">CAT</option>
                  <option value="ssc">SSC CGL</option>
                  <option value="clat">CLAT</option>
                  <option value="ca">CA/CMA/CS</option>
                </select>
                {errors.examExpertise && (
                  <p className="text-xs text-rose-500">{errors.examExpertise.message}</p>
                )}
              </div>

              {/* Current Role */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Current Role <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. IAS Officer, PO at SBI, Doctor at AIIMS"
                  {...register("currentRole", { 
                    required: "Current role is required",
                    minLength: { value: 3, message: "Must be at least 3 characters" }
                  })}
                  className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                {errors.currentRole && (
                  <p className="text-xs text-rose-500">{errors.currentRole.message}</p>
                )}
              </div>
            </div>

            {/* Exam-Specific Fields */}
            {selectedExam && (
              <div className="border-t border-slate-100 pt-4 sm:pt-6">
                <h3 className="mb-4 sm:mb-6 flex items-center gap-2 text-base sm:text-lg font-bold text-slate-900">
                  <BadgeCheck className="h-5 w-5 text-primary" />
                  Specific Exam Achievements
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                  {/* UPSC Specific Fields */}
                  {selectedExam === "upsc" && (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                          Times Mains Appeared <span className="text-rose-500">*</span>
                        </label>
                        <select
                          {...register("timesMainsAppeared", {
                            required: "This field is required"
                          })}
                          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Select number</option>
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                        {errors.timesMainsAppeared && (
                          <p className="text-xs text-rose-500">{errors.timesMainsAppeared.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                          Recent Interview Year <span className="text-rose-500">*</span>
                        </label>
                        <select
                          {...register("recentInterview", { required: "Please select a year" })}
                          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Select year</option>
                          <option value="not-yet">Not Yet</option>
                          {Array.from({ length: 10 }, (_, i) => 2026 - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        {errors.recentInterview && (
                          <p className="text-xs text-rose-500">{errors.recentInterview.message}</p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Banking Specific Fields */}
                  {selectedExam === "banking" && (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                          Banking Exam <span className="text-rose-500">*</span>
                        </label>
                        <select
                          {...register("bankingExam", { required: "Please select an exam" })}
                          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Select exam</option>
                          <option value="sbi-po">SBI PO</option>
                          <option value="sbi-clerk">SBI Clerk</option>
                          <option value="rrb-po">RRB PO</option>
                          <option value="rrb-clerk">RRB Clerk</option>
                          <option value="ibps-po">IBPS PO</option>
                          <option value="ibps-clerk">IBPS Clerk</option>
                        </select>
                        {errors.bankingExam && (
                          <p className="text-xs text-rose-500">{errors.bankingExam.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                          Selected in Year <span className="text-rose-500">*</span>
                        </label>
                        <select
                          {...register("selectedYear", { required: "Please select a year" })}
                          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Select year</option>
                          {Array.from({ length: 15 }, (_, i) => 2026 - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        {errors.selectedYear && (
                          <p className="text-xs text-rose-500">{errors.selectedYear.message}</p>
                        )}
                      </div>
                    </>
                  )}

                  {/* NEET/JEE/CLAT Specific Fields */}
                  {(selectedExam === "neet" || selectedExam === "jee" || selectedExam === "clat") && (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                          College <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder={selectedExam === "neet" ? "e.g. AIIMS Delhi" : selectedExam === "jee" ? "e.g. IIT Bombay" : "e.g. NLU Delhi"}
                          {...register("college", { 
                            required: "College name is required",
                            minLength: { value: 2, message: "Must be at least 2 characters" }
                          })}
                          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        {errors.college && (
                          <p className="text-xs text-rose-500">{errors.college.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                          Rank (AIR) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          placeholder={selectedExam === "neet" ? "e.g. 42" : selectedExam === "jee" ? "e.g. 150" : "e.g. 50"}
                          {...register("rank", {
                            required: "Rank is required",
                            min: { value: 1, message: "Rank must be at least 1" },
                            pattern: { value: /^[0-9]+$/, message: "Only numbers allowed" }
                          })}
                          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        {errors.rank && (
                          <p className="text-xs text-rose-500">{errors.rank.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                          Year of Selection <span className="text-rose-500">*</span>
                        </label>
                        <select
                          {...register("yearOfSelection", { required: "Please select a year" })}
                          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Select year</option>
                          {Array.from({ length: 15 }, (_, i) => 2026 - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        {errors.yearOfSelection && (
                          <p className="text-xs text-rose-500">{errors.yearOfSelection.message}</p>
                        )}
                      </div>
                    </>
                  )}

                  {/* CAT Specific Fields */}
                  {selectedExam === "cat" && (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                          College <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. IIM Ahmedabad"
                          {...register("college", { 
                            required: "College name is required",
                            minLength: { value: 2, message: "Must be at least 2 characters" }
                          })}
                          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        {errors.college && (
                          <p className="text-xs text-rose-500">{errors.college.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                          Percentile <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          placeholder="e.g. 99.9"
                          {...register("percentile", {
                            required: "Percentile is required",
                            min: { value: 0, message: "Percentile must be 0 or more" },
                            max: { value: 100, message: "Percentile cannot exceed 100" },
                            pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Enter a valid percentile (e.g. 99.9)" }
                          })}
                          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        {errors.percentile && (
                          <p className="text-xs text-rose-500">{errors.percentile.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                          Year of Selection <span className="text-rose-500">*</span>
                        </label>
                        <select
                          {...register("yearOfSelection", { required: "Please select a year" })}
                          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Select year</option>
                          {Array.from({ length: 15 }, (_, i) => 2026 - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        {errors.yearOfSelection && (
                          <p className="text-xs text-rose-500">{errors.yearOfSelection.message}</p>
                        )}
                      </div>
                    </>
                  )}

                  {/* SSC Specific Fields */}
                  {selectedExam === "ssc" && (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                          SSC Exam <span className="text-rose-500">*</span>
                        </label>
                        <select
                          {...register("sscExam", { required: "Please select an exam" })}
                          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Select exam</option>
                          <option value="ssc-cgl">SSC CGL</option>
                          <option value="ssc-chsl">SSC CHSL</option>
                        </select>
                        {errors.sscExam && (
                          <p className="text-xs text-rose-500">{errors.sscExam.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                          Selected in Year <span className="text-rose-500">*</span>
                        </label>
                        <select
                          {...register("selectedYear", { required: "Please select a year" })}
                          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Select year</option>
                          {Array.from({ length: 15 }, (_, i) => 2026 - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        {errors.selectedYear && (
                          <p className="text-xs text-rose-500">{errors.selectedYear.message}</p>
                        )}
                      </div>
                    </>
                  )}

                  {/* CA/CMA/CS Specific Fields */}
                  {selectedExam === "ca" && (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                          Qualification <span className="text-rose-500">*</span>
                        </label>
                        <select
                          {...register("caType", { required: "Please select a qualification" })}
                          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Select qualification</option>
                          <option value="ca">CA (Chartered Accountant)</option>
                          <option value="cma">CMA (Cost and Management Accountant)</option>
                          <option value="cs">CS (Company Secretary)</option>
                        </select>
                        {errors.caType && (
                          <p className="text-xs text-rose-500">{errors.caType.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                          Year of Qualification <span className="text-rose-500">*</span>
                        </label>
                        <select
                          {...register("yearOfSelection", { required: "Please select a year" })}
                          className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Select year</option>
                          {Array.from({ length: 15 }, (_, i) => 2026 - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        {errors.yearOfSelection && (
                          <p className="text-xs text-rose-500">{errors.yearOfSelection.message}</p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Key Highlights - Common for all */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Key Highlights <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder={selectedExam === "upsc" ? "e.g. Cleared Prelims 3 times, Optional: History, Strong in Essay writing..." : selectedExam === "banking" ? "e.g. Cleared all stages in first attempt, Strong in Quantitative Aptitude..." : selectedExam === "neet" ? "e.g. Biology 99.5 percentile, Solved 10+ mock test series..." : selectedExam === "jee" ? "e.g. Physics 99 percentile, Qualified JEE Advanced in first attempt..." : selectedExam === "cat" ? "e.g. VARC 99.8 percentile, Case interview expert..." : selectedExam === "clat" ? "e.g. Legal Reasoning expert, Solved 15+ mock test series..." : "Mention any specific subjects you mastered, awards received, or key achievements..."}
                      {...register("keyHighlights", {
                        required: "Please share your key highlights",
                        minLength: { value: 20, message: "Please provide at least 20 characters" }
                      })}
                      className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    {errors.keyHighlights && (
                      <p className="text-xs text-rose-500">{errors.keyHighlights.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="flex flex-col-reverse items-center justify-between gap-3 sm:gap-4 border-t border-slate-100 bg-slate-50 px-4 sm:px-8 py-4 sm:py-6 sm:flex-row">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-900 sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isSubmitting ? "Saving..." : "Continue to Step 3"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </motion.div>

      {/* Help note */}
      <motion.p
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={2}
        className="max-w-2xl mx-auto text-center text-xs sm:text-sm text-slate-500 px-4"
      >
        Need help?{" "}
        <a href="#" className="font-medium text-primary hover:underline">
          Contact our onboarding support team
        </a>
      </motion.p>
    </div>
  );
}
