"use client";

import React from "react";
import { Camera, Edit3, FileText, User as UserIcon, Share2, Heart, ShieldCheck, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

export interface ProfileBannerProps {
    initials: string;
    name: string;
    role: string;
    email?: string;
    phone?: string;
    location?: string;
    reviewsCount?: number;
    rank?: number;
    tagLine?: string;
    profilePhoto?: string | null;
    isEditable?: boolean;
    onEditCover?: () => void;
    onEditProfile?: () => void;
    onShare?: () => void;
    onSave?: () => void;
    avatarChildren?: React.ReactNode;
}

export function ProfileBanner({
    initials,
    name,
    role,
    email,
    phone,
    location,
    reviewsCount,
    rank,
    tagLine,
    profilePhoto,
    isEditable = false,
    onEditCover,
    onEditProfile,
    onShare,
    onSave,
    avatarChildren,
}: ProfileBannerProps) {
    return (
        <div className="bg-white border rounded-2xl overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1" style={{ borderColor: "#E2E8F0" }}>
            {/* Cover Gradient */}
            <div className="h-20 md:h-28 w-full relative bg-gradient-to-r from-[#D8B4E2] via-[#E4EDF7] to-[#D59F7C]">
                {isEditable && onEditCover && (
                    <button
                        onClick={onEditCover}
                        className="absolute top-4 right-4 bg-white/80 hover:bg-white backdrop-blur-md border border-white/50 text-slate-600 rounded-full h-9 w-9 flex items-center justify-center transition-colors shadow-sm"
                    >
                        <Camera size={15} />
                    </button>
                )}
            </div>

            {/* Profile Info Bar */}
            <div className="px-8 md:px-12 pb-6 md:pb-8 relative flex flex-col md:flex-row gap-8 md:gap-10 items-start md:items-end -mt-12 md:-mt-16">

                {/* Offset Avatar */}
                <div className="relative shrink-0 rounded-full p-2 bg-white mb-2 md:mb-6 peer z-20">
                    {avatarChildren ? avatarChildren : (
                        <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-white shadow-[0_4px_14px_rgba(37,99,235,0.2)] bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center relative z-10">
                            {profilePhoto ? (
                                <Image
                                    src={profilePhoto}
                                    alt={name}
                                    width={144}
                                    height={144}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <span className="text-[36px] font-bold text-white tracking-tight">{initials}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Info & Actions Container */}
                <div className="flex-1 w-full pt-16 md:pt-0 pb-1 flex flex-col md:flex-row md:justify-between md:items-center gap-6 rounded-2xl transition-all duration-300 md:peer-hover:[&_.text-details]:translate-x-[190px]">

                    {/* Text Details */}
                    <div className="flex-1 w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] text-details">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight m-0 mb-1 transition-colors flex flex-wrap items-center gap-3">
                            {name}
                            {!isEditable && rank && rank > 0 && (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 gap-1 px-2 py-0.5 shadow-sm text-sm">
                                    <Star className="w-3 h-3 fill-amber-800 flex-shrink-0" /> <span className="translate-y-[1px]">AIR {rank}</span>
                                </Badge>
                            )}
                            {!isEditable && (!rank || rank === 0) && tagLine && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 gap-1 px-2 py-0.5 shadow-sm text-sm">
                                    <ShieldCheck className="w-3 h-3 flex-shrink-0" /> <span className="translate-y-[1px]">Qualified</span>
                                </Badge>
                            )}
                        </h1>

                        <p className="text-sm md:text-base font-medium text-slate-500 mb-3">{role}</p>

                        <div className="flex flex-wrap items-center gap-5 text-xs md:text-sm text-slate-500">
                            {email && (
                                <span className="flex items-center gap-2 text-slate-500 transition-colors">
                                    <FileText size={16} className="text-slate-400" /> {email}
                                </span>
                            )}
                            {phone && (
                                <span className="flex items-center gap-2 text-slate-500 transition-colors">
                                    <UserIcon size={16} className="text-slate-400" /> {phone}
                                </span>
                            )}
                            {location && !isEditable && (
                                <span className="flex items-center gap-2 text-slate-500 transition-colors">
                                    <MapPin size={16} className="text-slate-400" /> {location}
                                </span>
                            )}
                            {reviewsCount !== undefined && !isEditable && (
                                <span className="flex items-center gap-2 text-slate-500 transition-colors">
                                    <Star size={16} className="text-slate-400 fill-slate-400" /> {reviewsCount} Reviews
                                </span>
                            )}
                        </div>

                        {!isEditable && tagLine && (
                            <div className="mt-4 flex items-center gap-2 text-blue-600 font-medium bg-blue-50 px-3 py-1.5 rounded-full w-fit">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-sm">{tagLine}</span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="shrink-0 flex items-center gap-3 self-start md:self-center mt-2 md:mt-0">
                        {isEditable ? (
                            onEditProfile && (
                                <button
                                    onClick={onEditProfile}
                                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-full h-11 w-11 flex items-center justify-center transition-all shadow-sm active:scale-95"
                                >
                                    <Edit3 size={18} />
                                </button>
                            )
                        ) : (
                            <>
                                <Button variant="outline" size="sm" onClick={onShare} className="gap-2 h-10 px-5 rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-sm">
                                    <Share2 size={16} /> Share
                                </Button>
                                <Button variant="outline" size="sm" onClick={onSave} className="gap-2 h-10 px-5 rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-sm">
                                    <Heart size={16} /> Save
                                </Button>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
