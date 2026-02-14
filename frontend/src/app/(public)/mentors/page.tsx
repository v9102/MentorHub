"use client";

import { useState, useMemo, useEffect } from "react";
import { type MentorProfile } from "./mock";
import { fetchMentors } from "@/shared/lib/api/mentors";
import SimpleMentorCard from "@/shared/ui/SimpleMentorCard";
import SearchBar from "@/shared/ui/SearchBar";
import FiltersPanel from "@/shared/ui/FiltersPanel";
import FiltersAccordion from "@/shared/ui/FiltersAccordion";
import Pagination from "@/shared/ui/Pagination";
import { FileText, GraduationCap, MessageSquare, Award, Briefcase, SlidersHorizontal, ChevronDown, Sparkles, Trophy, Calendar } from "lucide-react";

interface FilterState {
  minHourlyRate: string;
  maxHourlyRate: string;
  subject: string;
  exam: string;
  minRating: string;
}

export default function MentorsPage() {
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMentors = async () => {
      try {
        const data = await fetchMentors();
        setMentors(data);
      } catch (err) {
        console.error("Failed to load mentors", err);
      } finally {
        setLoading(false);
      }
    };
    getMentors();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [filters, setFilters] = useState<FilterState>({
    minHourlyRate: "",
    maxHourlyRate: "",
    subject: "",
    exam: "",
    minRating: "",
  });

  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      const searchLower = searchTerm.trim().toLowerCase();

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

      const minPrice = Number(filters.minHourlyRate);
      const maxPrice = Number(filters.maxHourlyRate);

      if (filters.minHourlyRate && mentor.pricing < minPrice) return false;
      if (filters.maxHourlyRate && mentor.pricing > maxPrice) return false;

      if (filters.subject && !mentor.subjects.includes(filters.subject)) {
        return false;
      }

      if (filters.exam && mentor.exam !== filters.exam) {
        return false;
      }

      if (filters.minRating && mentor.rating < Number(filters.minRating)) {
        return false;
      }

      return true;
    });
  }, [mentors, searchTerm, filters]);

  const totalPages = Math.ceil(filteredMentors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMentors = filteredMentors.slice(startIndex, endIndex);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-3">
            Explore <span className="text-blue-600">Mentors</span>
          </h1>
        </div>

        <div className="mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 pb-2 min-w-max">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
              <FileText className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">CV Review</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
              <GraduationCap className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">MBA Preparation</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
              <MessageSquare className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Interview Prep</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
              <Award className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Career Guidance</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
              <Briefcase className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Placement Support</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <SearchBar onSearchChange={handleSearchChange} />
        </div>

        <div className="mb-6 xl:hidden">
          <FiltersAccordion
            filters={filters}
            onFiltersChange={handleFiltersChange}
            mentorCount={filteredMentors.length}
          />
        </div>

        <div className="flex items-center gap-4 mb-8">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            {Object.values(filters).filter(v => v).length > 0 && (
              <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full min-w-[18px] text-center">
                {Object.values(filters).filter(v => v).length}
              </span>
            )}
          </button>
          <div className="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span className="text-sm font-medium text-yellow-800">Top Mentor</span>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-sm font-medium text-gray-700">Sort By</span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <aside className="hidden xl:block xl:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FiltersPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                mentorCount={filteredMentors.length}
              />
            </div>
          </aside>

          <main className="lg:col-span-2">
            <div className="hidden lg:block mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {filteredMentors.length}
                </span>{" "}
                {filteredMentors.length === 1 ? "mentor" : "mentors"} found
              </p>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[...Array(4)].map((_, index) => (
                  <SimpleMentorCard key={index} isLoading={true} />
                ))}
              </div>
            ) : filteredMentors.length === 0 ? (
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
                <div className="space-y-6">
                  {paginatedMentors.map((mentor) => (
                    <SimpleMentorCard
                      key={mentor.id}
                      mentor={{
                        id: mentor.id,
                        name: mentor.name,
                        profileImage: mentor.profilePhoto,
                        tagLine: mentor.tagLine,
                        bio: mentor.bio,
                        rating: mentor.rating,
                        reviewsCount: mentor.reviewsCount,
                        sessions: mentor.sessions,
                        pricing: mentor.pricing,
                        offerings: mentor.offerings,
                        attendance: mentor.attendance,
                        yearsOfExperience: mentor.yearsOfExperience,
                        college: mentor.college,
                        exam: mentor.exam,
                        rank: mentor.rank,
                        service: mentor.service,
                        posting: mentor.posting,
                      }}
                    />
                  ))}</div>

                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}

