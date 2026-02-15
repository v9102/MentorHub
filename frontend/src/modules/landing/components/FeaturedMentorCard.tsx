"use client";

import Link from "next/link";
import { Star, User, Briefcase, Users } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";
import { Button } from "@/shared/ui/button";

type FeaturedMentorData = {
    id: string;
    name: string;
    rating?: number;
    reviewsCount?: number;
    tagLine?: string;
    profileImage?: string;
    college?: string;
    yearsOfExperience?: number;
    sessions?: number;
    pricing?: number;
    bio?: string;
};

interface FeaturedMentorCardProps {
    mentor?: FeaturedMentorData;
    isLoading?: boolean;
}

export default function FeaturedMentorCard({
    mentor,
    isLoading = false,
}: FeaturedMentorCardProps) {
    if (isLoading || !mentor) {
        return (
            <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full min-h-[340px]">
                {/* Header skeleton */}
                <div className="h-[50px] bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300" />
                {/* Content */}
                <div className="p-4 pt-5 flex flex-col items-start flex-grow">
                    <div className="flex items-end gap-3 -mt-10 mb-3">
                        <Skeleton className="w-20 h-20 rounded-full border-[3px] border-white" />
                        <div className="flex flex-col gap-2 pt-5">
                            <Skeleton className="h-5 w-28" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4 mb-3" />
                    <Skeleton className="h-10 w-full mb-3" />
                    <div className="flex gap-4 mb-4">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="w-full flex justify-center mt-auto">
                        <Skeleton className="h-9 w-28 rounded-md" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg overflow-hidden flex flex-col h-full min-h-[340px] transition-all duration-300 hover:-translate-y-1">
            {/* Gradient Header */}
            <div className="h-[50px] bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400" />

            {/* Content */}
            <div className="p-5 pt-4 flex flex-col items-start flex-grow">
                {/* Avatar + Name Row */}
                <div className="flex items-end gap-3 -mt-10 mb-3">
                    <div className="w-20 h-20 rounded-full bg-gray-100 border-[3px] border-white shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {mentor.profileImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={mentor.profileImage}
                                alt={mentor.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-10 h-10 text-gray-400" />
                        )}
                    </div>
                    <div className="pt-5">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">
                            {mentor.name}
                        </h3>
                        {mentor.college && (
                            <p className="text-xs text-gray-500 mt-0.5">{mentor.college}</p>
                        )}
                    </div>
                </div>

                {/* Rating */}
                {mentor.rating !== undefined && (
                    <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-semibold text-gray-700">
                            {mentor.rating.toFixed(1)} ({mentor.reviewsCount ?? 0} Reviews)
                        </span>
                    </div>
                )}

                {/* Tagline/Credentials */}
                {mentor.tagLine && (
                    <p className="text-xs text-gray-500 leading-relaxed mb-2 line-clamp-2">
                        {mentor.tagLine}
                    </p>
                )}

                {/* Bio with ellipsis truncation */}
                {mentor.bio && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
                        {mentor.bio}
                    </p>
                )}

                {/* Meta Info */}
                <div className="flex gap-4 mb-4">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                        <span>{mentor.yearsOfExperience ?? 0}+ Years Exp.</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span>{mentor.sessions ?? 0} Sessions</span>
                    </div>
                </div>

                {/* View Profile Button - Centered */}
                <div className="w-full flex justify-center mt-auto">
                    <Link href={`/mentors/${mentor.id}`}>
                        <Button
                            size="sm"
                            className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-300 font-semibold shadow-sm"
                        >
                            Book Session
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
