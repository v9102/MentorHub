"use client";

import Link from "next/link";
import { CircleUser, Briefcase, Users, TrendingUp, MessageCircle } from "lucide-react";
import TagBadge from "./TagBadge";
import RatingStars from "./RatingStars";
import MentorOfferChip from "./MentorOfferChip";

type MentorCardData = {
  id: string;
  name: string;
  pricing: number;
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

export default function MentorCard({ mentor }: { mentor: MentorCardData }) {
  // Parse tagLine to extract credentials
  const getCredentialBadges = () => {
    if (!mentor.tagLine) return [];
    
    const badges: { text: string; variant: "primary" | "secondary" | "accent" }[] = [];
    const parts = mentor.tagLine.split("|").map(p => p.trim());
    
    parts.forEach((part, index) => {
      if (part) {
        const variant = index === 0 ? "primary" : index === 1 ? "secondary" : "accent";
        badges.push({ text: part, variant });
      }
    });
    
    return badges;
  };

  const badges = getCredentialBadges();

  return (
    <div className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Avatar */}
        <Link href={`/mentors/${mentor.id}`} className="flex-shrink-0">
          <div className="relative w-20 h-20 lg:w-24 lg:h-24">
            <CircleUser className="w-full h-full text-gray-300 group-hover:text-blue-500 transition-colors duration-300" />
            {mentor.rating && (
              <div className="absolute -bottom-2 -right-2 bg-white border-2 border-gray-100 shadow-md px-2 py-1 rounded-lg flex items-center gap-1">
                <span className="text-xs font-bold text-gray-900">
                  {mentor.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Center: Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header Section */}
          <div className="mb-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
              <Link href={`/mentors/${mentor.id}`}>
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {mentor.name}
                </h2>
              </Link>
              
              {/* Price - Mobile/Tablet */}
              <div className="sm:hidden">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-gray-500 font-medium">Starting at</span>
                  <span className="text-2xl font-bold text-gray-900">₹{mentor.pricing}</span>
                  <span className="text-sm text-gray-500">/hr</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            {mentor.rating && (
              <div className="mb-2">
                <RatingStars
                  rating={mentor.rating}
                  reviewsCount={mentor.reviewsCount}
                  size="sm"
                />
              </div>
            )}

            {/* Credential Badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {badges.map((badge, index) => (
                  <TagBadge key={index} text={badge.text} variant={badge.variant} />
                ))}
              </div>
            )}

            {/* Bio */}
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {mentor.bio}
            </p>
          </div>

          {/* Meta Details Row */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-gray-600">
            {mentor.yearsOfExperience !== undefined && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{mentor.yearsOfExperience} yrs experience</span>
              </div>
            )}
            {mentor.sessions !== undefined && (
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{mentor.sessions} sessions</span>
              </div>
            )}
            {mentor.attendance !== undefined && (
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="font-medium text-green-600">{mentor.attendance}% success rate</span>
              </div>
            )}
          </div>

          {/* Offering Chips */}
          {mentor.offerings && mentor.offerings.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {mentor.offerings.map((offering) => (
                <MentorOfferChip
                  key={offering.id}
                  offering={offering}
                  onClick={() => {
                    // Future: Handle offering selection
                    console.log("Selected offering:", offering);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Action Section - Desktop */}
        <div className="hidden lg:flex lg:flex-col lg:items-end lg:justify-between lg:min-w-[180px]">
          {/* Price */}
          <div className="text-right mb-4">
            <div className="text-xs text-gray-500 font-medium mb-1">Starting at</div>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-3xl font-bold text-gray-900">₹{mentor.pricing}</span>
              <span className="text-sm text-gray-500">/hr</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-2 w-full">
            <Link
              href={`/mentors/${mentor.id}`}
              className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-all duration-300 text-center shadow-sm"
            >
              View Profile
            </Link>
            <button className="w-full px-4 py-2.5 bg-white border-2 border-blue-600 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
          </div>
        </div>

        {/* Action Buttons - Mobile/Tablet */}
        <div className="lg:hidden flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
          <Link
            href={`/mentors/${mentor.id}`}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-all duration-300 text-center shadow-sm"
          >
            View Profile
          </Link>
          <button className="flex-1 px-4 py-2.5 bg-white border-2 border-blue-600 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Message
          </button>
        </div>
      </div>
    </div>
  );
}
