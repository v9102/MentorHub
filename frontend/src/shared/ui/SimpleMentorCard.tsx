"use client";

import Link from "next/link";
import { BadgeCheck, Briefcase, Users, TrendingUp, Star, MessageCircle, User } from "lucide-react";
import TagBadge from "./TagBadge";
import { useMemo } from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import { Button } from "@/shared/ui/button";

type MentorCardData = {
  id: string;
  name?: string;
  isVerified?: boolean;
  pricing?: number;
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

  // New Govt Fields
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

  const badges = useMemo(() => {
    if (!mentor) return [];

    // Priority: Service > Exam > Rank > College
    const items = [];

    if (mentor.service) items.push({ text: mentor.service, variant: "primary" });
    else if (mentor.exam) items.push({ text: mentor.exam, variant: "primary" });

    if (mentor.posting) items.push({ text: mentor.posting, variant: "secondary" });
    else if (mentor.rank) items.push({ text: `AIR ${mentor.rank}`, variant: "secondary" });

    // Fallback/Third badge
    if (mentor.attempts) items.push({ text: `${mentor.attempts}${mentor.attempts === 1 ? 'st' : 'nd'} Attempt`, variant: "accent" });
    else if (mentor.college) items.push({ text: mentor.college, variant: "accent" });

    return items.slice(0, 3) as { text: string; variant: "primary" | "secondary" | "accent" }[];
  }, [mentor]);

  if (isLoading || !mentor) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <Link href={`/mentors/${mentor.id}`} className="flex items-center gap-3 group-hover:opacity-100 transition-opacity">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              {mentor.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                  <BadgeCheck className="w-5 h-5 text-blue-600 fill-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {mentor.name}
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {mentor.service ? (
                  <span className="text-blue-700 font-semibold">{mentor.service} Officer</span>
                ) : (
                  mentor.college || "Top Mentor"
                )}
              </p>
            </div>
          </Link>
          {mentor.rating !== undefined && (
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-green-700 border border-green-100">
              <span className="text-xs font-bold">
                {mentor.rating.toFixed(1)}
              </span>
              <Star className="w-3 h-3 fill-green-700 text-green-700" />
            </div>
          )}
        </div>

        {/* Credentials */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {badges.map((badge, index) => (
              <TagBadge key={index} text={badge.text} variant={badge.variant} />
            ))}
          </div>
        )}

        {/* Bio */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-auto leading-relaxed">
          {mentor.bio}
        </p>

        {/* Divider */}
        <div className="my-4 border-t border-gray-100" />

        {/* Meta Grid */}
        <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-500 mb-2">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-gray-400" />
            <span>{mentor.yearsOfExperience ?? 0}+ Years Exp.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            <span>{mentor.sessions ?? 0} Sessions</span>
          </div>
          {mentor.optionalSubject && (
            <div className="flex items-center gap-1.5 col-span-2">
              <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
              <span>Optional: {mentor.optionalSubject}</span>
            </div>
          )}
        </div>

      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Session Price</p>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-blue-600">
              ₹{mentor.pricing ?? 500}
            </span>
            <span className="text-xs text-gray-400">/ session</span>
          </div>
        </div>

        <Link href={`/mentors/${mentor.id}`}>
          <Button size="sm" className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-300 font-semibold shadow-sm">
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}

