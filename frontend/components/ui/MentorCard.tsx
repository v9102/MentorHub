"use client";
import Link from "next/link";
import { CircleUser, Star, GraduationCap } from "lucide-react";

type MentorCardData = {
  id: string;
  name: string;
  pricing: number;
  tagLine?: string;
  bio: string;
  rating?: number;
  college?: string;
  responseTime?: string;
  imageUrl?: string;
};

export default function MentorCard({ mentor }: { mentor: MentorCardData }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `/mentor/${mentor.id}`;
  };
  return (
    <Link
      href={`/mentor/${mentor.id}`}
      className="group flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-2xl border-2 border-gray-100 hover:border-orange-300 transition-all duration-300 overflow-hidden"
    >
      {/* Top Section: Avatar and Identity */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <CircleUser className="w-16 h-16 text-gray-300 group-hover:text-blue-500 transition-colors" />
          {mentor.rating && (
            <div className="absolute -bottom-1 -right-1 bg-white border border-gray-100 shadow-sm px-1.5 py-0.5 rounded-lg flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-gray-700">
                {mentor.rating}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {mentor.name}
          </h2>
          {mentor.college && (
            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
              <GraduationCap className="w-3 h-3" />
              <span>{mentor.college}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tagline Badge */}
      {mentor.tagLine && (
        <div className="mb-3">
          <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
            {mentor.tagLine}
          </span>
        </div>
      )}

      {/* Bio Section */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
        {mentor.bio}
      </p>

      {/* Footer Section: Price and Response */}
      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-medium">Starting at</span>
          <span className="text-lg font-bold text-gray-900">
            ₹{mentor.pricing}
            <span className="text-sm font-normal text-gray-500">/hr</span>
          </span>
        </div>

        <div className="text-right">
          <button className="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg group-hover:bg-blue-600 transition-colors">
            View Profile
          </button>
        </div>
      </div>
    </Link>
  );
}
