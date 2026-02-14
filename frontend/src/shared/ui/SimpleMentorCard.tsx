"use client";

import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Briefcase, Users, TrendingUp, Star, MessageCircle, User } from "lucide-react";
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


  const profileImageUrl = mentor?.mentorProfile?.basicInfo?.profilePhoto || mentor?.imageUrl || mentor?.profileImage;

  const badges = useMemo(() => {
    if (!mentor) return [];


    const items = [];

    if (mentor.service) items.push({ text: mentor.service, variant: "primary" });
    else if (mentor.exam) items.push({ text: mentor.exam, variant: "primary" });

    if (mentor.posting) items.push({ text: mentor.posting, variant: "secondary" });
    else if (mentor.rank) items.push({ text: `AIR ${mentor.rank}`, variant: "secondary" });


    if (mentor.attempts) items.push({ text: `${mentor.attempts}${mentor.attempts === 1 ? 'st' : 'nd'} Attempt`, variant: "accent" });
    else if (mentor.college) items.push({ text: mentor.college, variant: "accent" });

    return items.slice(0, 3) as { text: string; variant: "primary" | "secondary" | "accent" }[];
  }, [mentor]);

  if (isLoading || !mentor) {
    return (
      <div className="bg-neutral-50 rounded-2xl border border-gray-200/50 p-6 space-y-4">
        <div className="flex items-start gap-5">
          <Skeleton className="h-24 w-24 rounded-xl" />
          <div className="space-y-3 flex-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <Link href={`/mentors/${mentor.id}`} className="block w-full">
      <div className="bg-white rounded-xl border border-gray-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-200 overflow-hidden">
        <div className="p-5">
          <div className="flex gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-xl bg-gray-200 flex items-center justify-center overflow-hidden">
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
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
              {mentor.isVerified && (
                <div className="absolute -top-1 -right-1 bg-blue-600 p-1 rounded-full">
                  <BadgeCheck className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {mentor.name}
                </h3>
                {mentor.rating !== undefined && (
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                    <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-900">
                      {mentor.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({mentor.reviewsCount ?? 0})
                    </span>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {(mentor.service || mentor.exam) && `Selected in ${mentor.service || mentor.exam}`}
                {mentor.posting && ` • ${mentor.posting}`}
              </p>

              <div className="flex items-center gap-4 mb-4 text-xs text-gray-600">
                {mentor.yearsOfExperience !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{mentor.yearsOfExperience}+ Years</span>
                  </div>
                )}
                {mentor.sessions !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{mentor.sessions} Sessions</span>
                  </div>
                )}
                {mentor.attendance !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{mentor.attendance}% Attendance</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {mentor.offerings && mentor.offerings.slice(0, 2).map((offering) => (
                  <div key={offering.id} className="flex-1 border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {offering.title}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-gray-900">₹{offering.price}</span>
                      {offering.discount && (
                        <span className="text-xs text-green-600">-{offering.discount}%</span>
                      )}
                    </div>
                  </div>
                ))}
                {(!mentor.offerings || mentor.offerings.length === 0) && (
                  <div className="flex-1 border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="text-xs text-gray-500 mb-1">1:1 Session</div>
                    <div className="text-sm font-bold text-gray-900">
                      {mentor.pricing === 0 || !mentor.pricing ? 'Free' : `₹${mentor.pricing}`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

