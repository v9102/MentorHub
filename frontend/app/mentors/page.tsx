"use client";

import { useState, useMemo } from "react";
import { mockMentors, type MentorProfile } from "./mock";
import MentorCard from "@/components/ui/MentorCard";
import SearchBar from "@/components/ui/SearchBar";
import FiltersPanel from "@/components/ui/FiltersPanel";
import FiltersAccordion from "@/components/ui/FiltersAccordion";
import Pagination from "@/components/ui/Pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid on desktop

  const [filters, setFilters] = useState<FilterState>({
    minHourlyRate: "",
    maxHourlyRate: "",
    subject: "",
    exam: "",
    minRating: "",
  });

  // Filter mentors based on search and filters
  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
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
      if (filters.subject && !mentor.subjects.includes(filters.subject)) {
        return false;
      }

      // Exam
      if (filters.exam && mentor.exam !== filters.exam) {
        return false;
      }

      // Rating (minimum)
      if (filters.minRating && mentor.rating < Number(filters.minRating)) {
        return false;
      }

      return true;
    });
  }, [mentors, searchTerm, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredMentors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMentors = filteredMentors.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Find Your Perfect <span className="text-orange-600">Mentor</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Connect with industry experts and accelerate your career
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar onSearchChange={handleSearchChange} />
        </div>

        {/* Mobile Filters (Accordion) - Visible only on mobile */}
        <div className="mb-6 xl:hidden">
          <FiltersAccordion
            filters={filters}
            onFiltersChange={handleFiltersChange}
            mentorCount={filteredMentors.length}
          />
        </div>

        {/* Two-Column Layout */}
        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters - Hidden on mobile, visible on desktop */}
          <aside className="hidden xl:block xl:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FiltersPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                mentorCount={filteredMentors.length}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Results Count - Desktop only */}
            <div className="hidden xl:block mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {filteredMentors.length}
                </span>{" "}
                {filteredMentors.length === 1 ? "mentor" : "mentors"} found
              </p>
            </div>

            {/* Mentor Cards - Stacked Layout */}
            {filteredMentors.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg font-medium mb-2">
                    No mentors found
                  </p>
                  <p className="text-gray-400 text-sm">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  {paginatedMentors.map((mentor) => (
                    <MentorCard
                      key={mentor.id}
                      mentor={{
                        id: mentor.id,
                        name: mentor.name,
                        pricing: mentor.pricing,
                        tagLine: mentor.tagLine,
                        bio: mentor.bio,
                        rating: mentor.rating,
                        reviewsCount: mentor.reviewsCount,
                        college: mentor.college,
                        exam: mentor.exam,
                        rank: mentor.rank,
                        yearsOfExperience: mentor.yearsOfExperience,
                        sessions: mentor.sessions,
                        attendance: mentor.attendance,
                        offerings: mentor.offerings,
                      }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

