"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Pencil, User, Briefcase, FileText, CheckCircle, Info, CheckCircle2, Shield } from "lucide-react";
import { useMentorOnboarding } from "@/shared/lib/context/MentorOnboardingContext";

// Label mapping for display
const EXAM_LABELS: Record<string, string> = {
  upsc: "UPSC CSE",
  banking: "Banking Exams",
  neet: "NEET",
  jee: "JEE",
  cat: "CAT",
  ssc: "SSC CGL",
  clat: "CLAT",
  ca: "CA/CMA/CS",
};

const ID_TYPE_LABELS: Record<string, string> = {
  aadhaar: "Aadhaar Card",
  pan: "PAN Card",
  passport: "Passport",
  driving_license: "Driving License",
  voter_id: "Voter ID (EPIC)",
  college_id: "College ID Card",
  itr: "ITR Acknowledgment",
  salary_slip: "Salary Slip",
  tdr: "TDR",
  employment_letter: "Employment Verification Letter",
  professional_cert: "Professional Certification",
};

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
};

function ReviewCard({
  icon,
  title,
  editHref,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  editHref: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-base sm:text-lg font-bold text-slate-900">{title}</h3>
        </div>
        <button
          onClick={() => router.push(editHref)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | number | undefined | null }) {
  // Don't render if no value
  if (!value && value !== 0) return null;
  
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

export default function ReviewPage() {
  const { data, resetData } = useMentorOnboarding();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Wait for client-side hydration to complete
  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/mentor/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "Failed to submit");
      }
      
      setSubmitted(true);
      resetData();
      setTimeout(() => router.push("/onboarding/profile/submitted"), 1500);
    } catch (err: any) {
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const basicInfo = data.basicInfo as any;
  const expertise = data.expertise as any;
  const verification = data.verification;

  // Format languages for display
  const getLanguagesDisplay = () => {
    if (!basicInfo?.preferredLanguages || basicInfo.preferredLanguages.length === 0) return null;
    return basicInfo.preferredLanguages
      .map((lang: string) => LANGUAGE_LABELS[lang] || lang)
      .join(", ");
  };

  // Get exam-specific display data
  const getExamSpecificDetails = () => {
    if (!expertise?.examExpertise) return [];
    const exam = expertise.examExpertise;
    const details: { label: string; value: string | number | undefined }[] = [];

    if (exam === "upsc") {
      if (expertise.timesMainsAppeared) details.push({ label: "Times Mains Appeared", value: expertise.timesMainsAppeared });
      if (expertise.recentInterview) details.push({ label: "Recent Interview", value: expertise.recentInterview === "yes" ? "Yes" : "No" });
    } else if (exam === "banking") {
      if (expertise.bankingExam) details.push({ label: "Banking Exam", value: expertise.bankingExam?.toUpperCase() });
      if (expertise.selectedYear) details.push({ label: "Selection Year", value: expertise.selectedYear });
    } else if (exam === "neet" || exam === "jee" || exam === "clat") {
      if (expertise.college) details.push({ label: "College", value: expertise.college });
      if (expertise.rank) details.push({ label: "Rank (AIR)", value: expertise.rank });
      if (expertise.yearOfSelection) details.push({ label: "Year of Selection", value: expertise.yearOfSelection });
    } else if (exam === "cat") {
      if (expertise.college) details.push({ label: "College", value: expertise.college });
      if (expertise.percentile) details.push({ label: "Percentile", value: expertise.percentile });
      if (expertise.yearOfSelection) details.push({ label: "Year of Selection", value: expertise.yearOfSelection });
    } else if (exam === "ssc") {
      if (expertise.sscExam) details.push({ label: "SSC Exam", value: expertise.sscExam?.toUpperCase() });
      if (expertise.yearOfSelection) details.push({ label: "Year of Selection", value: expertise.yearOfSelection });
    } else if (exam === "ca") {
      if (expertise.caType) details.push({ label: "Certification Type", value: expertise.caType?.toUpperCase() });
      if (expertise.yearOfSelection) details.push({ label: "Year of Qualification", value: expertise.yearOfSelection });
    }

    return details;
  };

  // Show loading state during hydration to prevent mismatch
  if (!mounted) {
    return (
      <div className="px-4 py-6 sm:py-8 space-y-4 sm:space-y-6 max-w-[800px] mx-auto">
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:py-8 space-y-4 sm:space-y-6 max-w-[800px] mx-auto">
      {/* ── Progress Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Step 4 of 4</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Final Review</h1>
          </div>
          <div className="text-right">
            <p className="text-xl sm:text-2xl font-bold leading-none text-primary">100%</p>
            <p className="text-xs text-slate-400">Completed</p>
          </div>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Please review your application details below. Once submitted, your profile will be sent to our moderation team.
        </p>
      </motion.div>

      {/* ── Review Cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4, ease: "easeOut" }}
        className="flex flex-col gap-4 sm:gap-6"
      >
        {/* Basic Details */}
        <ReviewCard
          icon={<User className="h-5 w-5 text-primary" />}
          title="Basic Details"
          editHref="/onboarding/profile/basic-info"
        >
          <div className="space-y-4">
            {/* First row: Name and Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <DetailRow label="First Name" value={basicInfo?.firstName} />
              <DetailRow label="Last Name" value={basicInfo?.lastName} />
              <DetailRow label="Gender" value={basicInfo?.gender ? basicInfo.gender.charAt(0).toUpperCase() + basicInfo.gender.slice(1).replace(/-/g, " ") : undefined} />
            </div>
            
            {/* Other details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-slate-100">
              <DetailRow label="Current Organisation" value={basicInfo?.currentOrganisation} />
              <DetailRow label="Industry" value={basicInfo?.industry} />
              <DetailRow label="Current Role" value={basicInfo?.currentRole} />
              <DetailRow label="Preferred Languages" value={getLanguagesDisplay()} />
            </div>
            
            {/* About You - Full width */}
            {basicInfo?.aboutYou && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">About You</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3">{basicInfo.aboutYou}</p>
              </div>
            )}
          </div>
        </ReviewCard>

        {/* Background & Biography */}
        <ReviewCard
          icon={<Briefcase className="h-5 w-5 text-primary" />}
          title="Expertise & Background"
          editHref="/onboarding/profile/expertise"
        >
          <div className="space-y-4">
            {/* Core Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <DetailRow label="Exam Expertise" value={expertise?.examExpertise ? EXAM_LABELS[expertise.examExpertise] || expertise.examExpertise : undefined} />
              <DetailRow label="Current Role" value={expertise?.currentRole} />
              <DetailRow label="Rank/Score" value={expertise?.rankOrScore} />
            </div>

            {/* Exam Specific Details */}
            {getExamSpecificDetails().length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Exam-Specific Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {getExamSpecificDetails().map(({ label, value }) => (
                    <DetailRow key={label} label={label} value={value} />
                  ))}
                </div>
              </div>
            )}

            {/* Key Highlights */}
            {expertise?.keyHighlights && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Key Highlights</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3">{expertise.keyHighlights}</p>
              </div>
            )}
          </div>
        </ReviewCard>

        {/* Verification Documents */}
        <ReviewCard
          icon={<Shield className="h-5 w-5 text-primary" />}
          title="Verification Documents"
          editHref="/onboarding/profile/verification"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <DetailRow label="Document Type" value={verification?.idType ? ID_TYPE_LABELS[verification.idType] || verification.idType : undefined} />
              <DetailRow label="ID/Reference Number" value={verification?.idNumber} />
            </div>
            
            {verification?.documentFileName && (
              <div className="flex items-center gap-4 rounded-lg border border-green-200 bg-green-50 p-4 mt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{verification.documentFileName}</p>
                  <p className="text-xs text-slate-500">Document uploaded successfully</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
              </div>
            )}

            {!verification?.documentFileName && (
              <div className="flex items-center gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 mt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">No document uploaded</p>
                  <p className="text-xs text-slate-500">Please upload a verification document</p>
                </div>
                <Info className="h-5 w-5 text-amber-500 shrink-0" />
              </div>
            )}
          </div>
        </ReviewCard>
      </motion.div>

      {/* ── Confirmation Section ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="flex flex-col gap-4 sm:gap-6 pt-4"
      >
        {/* Warning note */}
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            By clicking "Confirm & Submit", you agree to our Mentor Terms of Service and Code of Conduct.
            Your application will be reviewed within 2-3 business days.
          </p>
        </div>

        {/* Success message */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
            >
              <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900">Application Submitted!</h4>
                <p className="text-xs text-emerald-700">You are all set. Redirecting you to the dashboard...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex flex-col-reverse items-center justify-between gap-3 sm:gap-4 border-t border-slate-200 pt-6 sm:flex-row">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting || submitted}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {submitting ? "Submitting..." : "Confirm & Submit Application"}
            <Send className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
