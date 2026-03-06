"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, User, Phone, CheckCircle2, Briefcase, Calendar, BookOpen, BadgeCheck, Languages, Award } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/shared/ui/skeleton";

type MentorCardData = {
  /** MongoDB ObjectId serialised to string */
  mongoId?: string;
  /** Clerk user ID (used as primary navigation key) */
  id: string;

  name?: string;
  /** Top-level imageUrl from the User document */
  imageUrl?: string;
  /** Alias passed from list pages (same value as imageUrl / profilePhoto) */
  profileImage?: string;

  mentorProfile?: {
    basicInfo?: {
      profilePhoto?: string;
      currentRole?: string;
      currentOrganisation?: string;
      workExperience?: number;
    };
    professionalInfo?: {
      college?: string;
      highestQualification?: string;
    };
    expertise?: {
      /** Array of subject strings */
      subjects?: string[];
      /** Single string in the DB (not an array) */
      specializations?: string;
    };
    pricing?: {
      pricePerSession?: number;
      sessionDuration?: number;
      isFreeTrialEnabled?: boolean;
    };
    bio?: string;
    rating?: number;
    totalReviews?: number;
    examDetails?: Array<{
      examName?: string;
      /** String in DB */
      rank?: string;
      /** String in DB */
      attempts?: string;
      college?: string;
    }>;
    verification?: {
      isVerified?: boolean;
    };
  };

  /* ── Flat fields set by transformMentorData ── */
  isVerified?: boolean;
  /** mentorProfile.pricing.pricePerSession */
  pricing?: number;
  sessionDuration?: number;
  isFreeTrialEnabled?: boolean;
  tagLine?: string;
  bio: string;
  rating?: number;
  reviewsCount?: number;
  college?: string;
  exam?: string;
  /** String from examDetails in DB */
  rank?: string;
  yearsOfExperience?: number;
  sessions?: number;
  attendance?: number;
  responseTime?: string;
  subjects?: string[];
  /** Array produced by the mapper from the DB string */
  specializations?: string[];
  service?: string;
  posting?: string;
  /** String from examDetails in DB */
  attempts?: string;
  optionalSubject?: string;
  percentile?: string | number;
  selectionYear?: string | number;
  /** Languages mentor can communicate in (codes: en, hi, etc.) */
  languages?: string[];
  offerings?: {
    id: string;
    title: string;
    price: number;
    discount?: number;
    icon?: string;
  }[];
};

interface SimpleMentorCardProps {
  mentor?: MentorCardData;
  isLoading?: boolean;
}

export default function SimpleMentorCard({
  mentor,
  isLoading = false,
}: SimpleMentorCardProps) {
  const [imageError, setImageError] = useState(false);

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm w-full">
        <div className="flex items-start gap-3 mb-4">
          <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-1.5 pt-0.5">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-3.5 w-1/3" />
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-full mb-2 rounded-lg" />
        ))}
        <Skeleton className="h-12 w-full mt-4 rounded-xl" />
      </div>
    );
  }

  if (!mentor) return null;

  const profileImageUrl =
    mentor.mentorProfile?.basicInfo?.profilePhoto ||
    mentor.imageUrl ||
    mentor.profileImage;

  /* Language code to display name mapping */
  const LANGUAGE_LABELS: Record<string, string> = {
    en: "English", hi: "Hindi", bn: "Bengali", ta: "Tamil", te: "Telugu",
    mr: "Marathi", gu: "Gujarati", kn: "Kannada", ml: "Malayalam",
  };

  /* ── Stat rows — matching reference image layout ── */
  type StatRow = { icon: React.ReactNode; label: string };
  const statRows: StatRow[] = [];

  /* Row 1 → exam selection (blue check circle = "Selected in SSC") */
  if (mentor.exam) {
    statRows.push({
      icon: (
        <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={2.5} />
        </span>
      ),
      label: `Selected in ${mentor.exam}`,
    });
  }

  /* Row 2 → rank (AIR / Rank) */
  if (mentor.rank != null && mentor.rank !== "") {
    const rankStr = String(mentor.rank);
    statRows.push({
      icon: (
        <span className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
          <Award className="w-3 h-3 text-violet-600" strokeWidth={2} />
        </span>
      ),
      label: rankStr.match(/^\d+$/) ? `AIR ${rankStr}` : `Rank ${rankStr}`,
    });
  }

  /* Row 3 → posting / service (amber hexagon badge = role title) */
  if (mentor.posting || mentor.service) {
    statRows.push({
      icon: (
        <span className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
          <BadgeCheck className="w-3 h-3 text-white" strokeWidth={2.5} />
        </span>
      ),
      label: mentor.posting || mentor.service || "",
    });
  }

  /* Row 4 → college / institution */
  if (mentor.college) {
    statRows.push({
      icon: (
        <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-3 h-3 text-blue-600" strokeWidth={2} />
        </span>
      ),
      label: mentor.college,
    });
  }

  /* Row 5 → percentile (for CAT etc.) */
  if (mentor.percentile != null && mentor.percentile !== "") {
    statRows.push({
      icon: (
        <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <Award className="w-3 h-3 text-indigo-600" strokeWidth={2} />
        </span>
      ),
      label: `${mentor.percentile}%ile`,
    });
  }

  /* Row 6 → years of experience → displayed as year like reference */
  if (mentor.yearsOfExperience !== undefined) {
    statRows.push({
      icon: (
        <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-3 h-3 text-blue-600" strokeWidth={2} />
        </span>
      ),
      label: `${mentor.yearsOfExperience}+ Years Experience`,
    });
  }

  /* Row 7 → session count */
  if (mentor.sessions !== undefined) {
    statRows.push({
      icon: (
        <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-3 h-3 text-blue-600" strokeWidth={2} />
        </span>
      ),
      label: `Session ${mentor.sessions.toLocaleString()}`,
    });
  }

  /* Row 8 → attendance % (green check circle) */
  if (mentor.attendance !== undefined) {
    statRows.push({
      icon: (
        <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={2.5} />
        </span>
      ),
      label: `${mentor.attendance}% Avg. Attendance`,
    });
  }

  /* Row 9 → languages */
  if (mentor.languages?.length) {
    const langLabels = mentor.languages
      .map((code) => LANGUAGE_LABELS[code] || code)
      .filter(Boolean);
    if (langLabels.length) {
      statRows.push({
        icon: (
          <span className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
            <Languages className="w-3 h-3 text-sky-600" strokeWidth={2} />
          </span>
        ),
        label: langLabels.join(", "),
      });
    }
  }

  /* Fallback if no structured stats: show tagLine or bio */
  if (statRows.length === 0) {
    if (mentor.tagLine)
      statRows.push({
        icon: (
          <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Star className="w-3 h-3 text-blue-600 fill-blue-600" />
          </span>
        ),
        label: mentor.tagLine,
      });
  }

  return (
    <div className="block w-full">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-visible">

        <div className="p-4">

          {/* ── Header: photo + blue verified badge + name + star rating ── */}
          <div className="flex items-start gap-3 mb-4">
            {/* Photo container */}
            <div className="relative flex-shrink-0">
              <div className="w-[64px] h-[64px] rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                {profileImageUrl && !imageError ? (
                  <Image
                    src={profileImageUrl}
                    alt={mentor.name || "Mentor"}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-300" />
                )}
              </div>

              {/* Blue verified checkmark badge — top-right of photo */}
              {mentor.isVerified && (
                <div
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-md ring-2 ring-white"
                  title="Verified Mentor"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-4 h-4 text-white"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>

            {/* Name + star rating + stat rows — all in right column */}
            <div className="flex-1 min-w-0 pt-0">
              <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
                {mentor.name}
              </h3>
              {mentor.rating !== undefined && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-800">
                    {mentor.rating.toFixed(1)}
                  </span>
                  {mentor.reviewsCount !== undefined && (
                    <span className="text-xs text-gray-500">
                      ({mentor.reviewsCount} Reviews)
                    </span>
                  )}
                </div>
              )}

              {/* ── Icon-label stat rows — indented under name ── */}
              {statRows.length > 0 && (
                <div className="space-y-1.5 mt-3">
                  {statRows.map((row, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      {row.icon}
                      <span className="text-xs font-medium text-gray-700 leading-snug">
                        {row.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="border-t border-gray-100 mb-4" />

          {/* ── CTA Button ── */}
          <div>
            <Link
              href={`/book/${mentor.id}`}
              className="flex flex-col items-center justify-center w-full rounded-xl py-3 px-4 bg-blue-50 hover:bg-blue-100 transition-colors duration-200 active:scale-[0.98] border border-blue-100"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                <span className="text-sm font-bold text-blue-700">
                  Book 1:1 Session
                </span>
              </div>
              <span className="mt-0.5 text-xs font-semibold rounded-full px-2.5 py-0.5 bg-blue-200 text-blue-800">
                {mentor.isFreeTrialEnabled
                  ? "Free"
                  : mentor.pricing
                    ? `₹${mentor.pricing}`
                    : "Free"}
              </span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}