"use client";

import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Briefcase, Users, TrendingUp, Star, MessageCircle, User, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import TagBadge from "./TagBadge";
import { useState } from "react";
import { useMemo } from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import { Button } from "@/shared/ui/button";

type MentorCardData = {
  id: string;
  name?: string;
  profileImage?: string;
  imageUrl?: string;
  mentorProfile?: {
    basicInfo?: {
      profilePhoto?: string;
    };
  };
  isVerified?: boolean;
  pricing?: number;
  sessionDuration?: number;
  isFreeTrialEnabled?: boolean;
  tagLine?: string;
  bio: string;
  rating?: number;
  reviewsCount?: number;
  college?: string;
  exam?: string;
  rank?: number;
  yearsOfExperience?: number;
  sessions?: number;
  attendance?: number;
  responseTime?: string;
  subjects?: string[];
  specializations?: string[];

  service?: string;
  posting?: string;
  attempts?: number;
  optionalSubject?: string;

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

  if (isLoading) {
    return (
      <div className="bg-surface-background rounded-2xl border border-border-subtle p-8 shadow-sm">
        <div className="flex gap-8">
          <Skeleton className="w-32 h-32 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between items-center pt-6 mt-4 border-t border-border-subtle">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!mentor) return null;

  const profileImageUrl = mentor.mentorProfile?.basicInfo?.profilePhoto || mentor.imageUrl || mentor.profileImage;

  const trustSignal = useMemo(() => {
    if (!mentor) return null;
    const signals = [
      "Usually responds within 15 mins",
      "Available today",
      "3 students booked today",
      "4 students viewing right now",
      "High demand recently",
    ];
    const index = mentor.name ? mentor.name.charCodeAt(0) % signals.length : 0;
    return signals[index];
  }, [mentor]);

  const badges = [
    mentor.exam && { text: mentor.exam, variant: "primary" },
    mentor.service && { text: mentor.service, variant: "secondary" },
    mentor.posting && { text: mentor.posting, variant: "accent" },
    mentor.college && { text: mentor.college, variant: "secondary" },
  ].filter(Boolean) as { text: string; variant: "primary" | "secondary" | "accent" }[];

  return (
    <div className="block w-full relative group cursor-pointer">
      <div className="bg-surface-background rounded-2xl border border-border-subtle shadow-sm relative">
        <Link href={`/mentors/${mentor.id}`} className="absolute inset-0 z-0">
          <span className="sr-only">View {mentor.name}'s profile</span>
        </Link>
        <div className="p-8 relative z-10 pointer-events-none">
          <div className="flex gap-8">
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-border-subtle">
                {profileImageUrl && !imageError ? (
                  <Image
                    src={profileImageUrl}
                    alt={mentor.name || 'Mentor'}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-300" />
                )}
              </div>
              {mentor.isVerified && (
                <div className="absolute -top-2 -right-2 bg-blue-600 p-1.5 rounded-full ring-4 ring-white shadow-sm">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                    {mentor.name}
                  </h3>
                  {mentor.rating !== undefined && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 rounded-md border border-gray-100">
                      <Star className="w-3.5 h-3.5 fill-gray-900 text-gray-900" />
                      <span className="text-sm font-semibold text-gray-900">
                        {mentor.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {mentor.tagLine && (
                <p className="text-sm text-blue-600 font-medium mb-3 line-clamp-1">{mentor.tagLine}</p>
              )}

              {/* Exam / College / Subject badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {badges.slice(0, 2).map((badge, index) => (
                  <TagBadge key={index} text={badge.text} variant={badge.variant as "primary" | "secondary" | "accent"} />
                ))}
                {mentor.subjects?.slice(0, 2).map((subject, index) => (
                  <TagBadge key={`sub-${index}`} text={subject} variant="secondary" />
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-6 pr-4">
                {mentor.bio}
              </p>

              <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                {mentor.yearsOfExperience !== undefined && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    {mentor.yearsOfExperience}+ Years Exp.
                  </span>
                )}
                {mentor.yearsOfExperience !== undefined && mentor.sessions !== undefined && (
                  <span className="text-gray-300">•</span>
                )}
                {mentor.sessions !== undefined && (
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-gray-400" />
                    {mentor.sessions.toLocaleString()}+ Sessions
                  </span>
                )}
                {mentor.reviewsCount !== undefined && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                      {mentor.reviewsCount} Reviews
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-subtle relative z-20 pointer-events-auto">
                <div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Session From</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-xl font-bold text-gray-900 tracking-tight">₹{mentor.pricing || 199}</div>
                    {mentor.sessionDuration && (
                      <span className="text-xs text-gray-400">· {mentor.sessionDuration} min</span>
                    )}
                  </div>
                  {mentor.isFreeTrialEnabled && (
                    <span className="text-xs text-green-600 font-semibold">Free Trial Available</span>
                  )}
                </div>
                <Link
                  href={`/book/${mentor.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
                >
                  Book Session
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
