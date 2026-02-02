"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Briefcase, Users, TrendingUp, Star, MessageCircle } from "lucide-react";
import TagBadge from "./TagBadge";
import { useState, useMemo } from "react";

type MentorCardData = {
  id: string;
  name: string;
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
  imageUrl?: string;
  offerings?: {
    id: string;
    title: string;
    price: number;
    discount?: number;
    icon?: string;
  }[];
};

const DEFAULT_AVATAR = "/images/default-avatar.png";

export default function SimpleMentorCard({
  mentor,
}: {
  mentor: MentorCardData;
}) {
  const badges = useMemo(() => {
    if (!mentor.tagLine) return [];

    return mentor.tagLine
      .split("|")
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 3)
      .map((text, index) => ({
        text,
        variant: (index === 0
          ? "primary"
          : index === 1
            ? "secondary"
            : "accent") as "primary" | "secondary" | "accent",
      }));
  }, [mentor.tagLine]);

  const [imageSrc, setImageSrc] = useState(
    mentor.imageUrl || DEFAULT_AVATAR
  );

  return (
    <div className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image */}
      <Link href={`/mentors/${mentor.id}`} className="block">
        <div className="relative aspect-[3/2] w-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={`${mentor.name}'s profile photo`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageSrc(DEFAULT_AVATAR)}
          />

          {mentor.rating !== undefined && (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm shadow-lg px-2 py-1 rounded-lg flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
              <span className="text-xs font-bold text-gray-900">
                {mentor.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <div className="flex items-center gap-2 mb-2">
          <Link href={`/mentors/${mentor.id}`}>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
              {mentor.name}
            </h3>
          </Link>

          {mentor.isVerified && (
            <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500 flex-shrink-0" />
          )}
        </div>

        {/* Credentials */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {badges.map((badge, index) => (
              <TagBadge
                key={index}
                text={badge.text}
                variant={badge.variant}
              />
            ))}
          </div>
        )}

        {/* Bio */}
        <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
          {mentor.bio}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500 flex-wrap">
          {mentor.yearsOfExperience !== undefined && (
            <div className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              <span>{mentor.yearsOfExperience}y</span>
            </div>
          )}

          {mentor.sessions !== undefined && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{mentor.sessions}</span>
            </div>
          )}

          {mentor.attendance !== undefined && (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-600">
                {mentor.attendance}%
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-500">
              Starting at
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-bold text-gray-900">
                ₹{mentor.pricing ?? 1000}
              </span>
              <span className="text-xs text-gray-500">/hr</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              aria-label="Send message"
              className="p-2 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            <Link
              href={`/mentors/${mentor.id}`}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm"
            >
              Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
