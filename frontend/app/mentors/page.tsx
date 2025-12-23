"use client";

import { useState } from "react";
import { mockMentors, type MentorProfile } from "../mentor/[mentorId]/mock";
import MentorCard from "@/components/ui/MentorCard";
import MentorSearch from "@/components/ui/MentorSearch";
import { MentorFilters } from "@/components/ui/MentorFilter";


interface FilterState {
  minHourlyRate: string;
  maxHourlyRate: string;
  subject: string;
  exam: string;
  minRating: string;
}

export default function MentorsPage() {
  const mentors: MentorProfile[] = Object.values(mockMentors);

  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState<FilterState>({
    minHourlyRate: "",
    maxHourlyRate: "",
    subject: "",
    exam: "",
    minRating: "",
  });


  const filteredMentors = mentors.filter((mentor) => {
    const searchLower = searchTerm.trim().toLowerCase();

    // Search
    if (
      searchLower &&
      !(
        mentor.name.toLowerCase().includes(searchLower) ||
        mentor.bio.toLowerCase().includes(searchLower) ||
        mentor.tagLine.toLowerCase().includes(searchLower)
      )
    ) {
      return false;
    }

    // Price
    const minPrice = Number(filters.minHourlyRate);
    const maxPrice = Number(filters.maxHourlyRate);

    if (filters.minHourlyRate && mentor.pricing < minPrice) return false;
    if (filters.maxHourlyRate && mentor.pricing > maxPrice) return false;

    // Subject (array check)
    if (
      filters.subject &&
      !mentor.subjects.includes(filters.subject)
    ) {
      return false;
    }

    //Exam
    if (filters.exam && mentor.exam !== filters.exam) {
      return false;
    }

    // Rating (minimum)
    if (filters.minRating && mentor.rating < Number(filters.minRating)) {
      return false;
    }

    return true;
  });


  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Find Your Perfect <span className="text-orange-600">Mentor</span>
          </h1>
          <p className="text-gray-600">
            Connect with industry experts and accelerate your career
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <MentorSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-1/4 w-full">
            <div className="sticky top-24">
              <MentorFilters
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </aside>

          {/* Content */}
          <main className="lg:w-3/4 w-full">

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {filteredMentors.length}
                </span>{" "}
                {filteredMentors.length === 1 ? "mentor" : "mentors"} found
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No mentors found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Try adjusting your filters
                  </p>
                </div>
              ) : (
                filteredMentors.map((mentor) => (
                  <MentorCard
                    key={mentor.id}
                    mentor={{
                      id: mentor.id,
                      name: mentor.name,
                      pricing: mentor.pricing,
                      tagLine: mentor.tagLine,
                      bio: mentor.bio,
                    }}
                  />
                ))
              )}
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
