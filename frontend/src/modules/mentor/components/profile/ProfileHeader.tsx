import React from "react";
import Image from "next/image";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { MapPin, Star, ShieldCheck, Share2, Heart } from "lucide-react";
import { MentorProfile } from "@/app/(public)/mentors/mock";

interface ProfileHeaderProps {
    mentor: MentorProfile;
}

export const ProfileHeader = ({ mentor }: ProfileHeaderProps) => {
    return (
        <div className="relative mb-8">
            {/* Cover Background */}
            <div className="h-48 md:h-64 w-full bg-gradient-to-r from-blue-50 via-white to-purple-50 border-b rounded-t-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center]" style={{ maskImage: 'linear-gradient(to bottom, transparent, black)' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
            </div>

            <div className="px-6 pb-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Profile Image*/}
                    <div className="relative -mt-16 md:-mt-20 shrink-0 flex justify-center md:block w-32 h-32 md:w-48 md:h-48 mx-auto md:mx-0">
                        <div className="relative w-full h-full rounded-full border-4 border-white shadow-xl overflow-hidden bg-white z-20">
                            <Image
                                src={mentor.profilePhoto}
                                alt={mentor.name}
                                width={192}
                                height={192}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="absolute bottom-1 right-3 md:bottom-2 md:right-4 bg-green-500 w-4 h-4 md:w-5 md:h-5 rounded-full border-[3px] border-white shadow-md z-30 ring-1 ring-green-100" title="Available for sessions" />
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 space-y-3 pt-2 md:pt-4 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                            <h1 className="text-3xl font-bold text-gray-900">{mentor.name}</h1>
                            {mentor.rank && mentor.rank > 0 ? (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 gap-1 px-3 py-1">
                                    <Star className="w-3 h-3 fill-amber-800" />
                                    AIR {mentor.rank}
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 gap-1 px-3 py-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    Qualified
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-sm">{mentor.tagLine}</span>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-50 border border-gray-100">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{mentor.posting || "India"}</span>
                            </div>
                            <div className="text-gray-300 hidden md:block">|</div>
                            <span>{mentor.reviewsCount} Reviews</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-center md:justify-end pt-4 md:pt-6 w-full md:w-auto shrink-0">
                        <Button variant="outline" size="sm" className="gap-2 h-10 px-4 rounded-full border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                            <Share2 className="w-4 h-4" />
                            Share
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 h-10 px-4 rounded-full border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                            <Heart className="w-4 h-4" />
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
