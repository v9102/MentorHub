"use client";

import { useState, useMemo, useEffect } from "react";
import { type MentorProfile } from "./mock";
import { fetchMentors } from "@/shared/lib/api/mentors";
import SimpleMentorCard from "@/shared/ui/SimpleMentorCard";
import SearchBar from "@/shared/ui/SearchBar";
import FiltersPanel from "@/shared/ui/FiltersPanel";
import FiltersAccordion from "@/shared/ui/FiltersAccordion";
import Pagination from "@/shared/ui/Pagination";
import PremiumDropdown from "@/shared/ui/PremiumDropdown";
import { FileText, GraduationCap, MessageSquare, Award, Briefcase, SlidersHorizontal, ChevronDown, Sparkles, Trophy, Calendar } from "lucide-react";

interface FilterState {
  minHourlyRate: string;
  maxHourlyRate: string;
  subject: string;
  exam: string;
  minRating: string;
  isTopMentor: boolean;
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
  const [sortBy, setSortBy] = useState("relevance");
  const itemsPerPage = 8;

  const [filters, setFilters] = useState<FilterState>({
    minHourlyRate: "",
    maxHourlyRate: "",
    subject: "",
    exam: "",
    minRating: "",
    isTopMentor: false,
  } as FilterState & { isTopMentor?: boolean });

  const filteredMentors = useMemo(() => {
    let result = mentors.filter((mentor) => {
      const searchLower = searchTerm.trim().toLowerCase();

      if (
        searchLower &&
        !(
          mentor.name?.toLowerCase().includes(searchLower) ||
          mentor.bio?.toLowerCase().includes(searchLower) ||
          mentor.tagLine?.toLowerCase().includes(searchLower)
        )
      ) {
        return false;
      }

      const minPrice = Number(filters.minHourlyRate);
      const maxPrice = Number(filters.maxHourlyRate);

      if (filters.minHourlyRate && (mentor.pricing || 0) < minPrice) return false;
      if (filters.maxHourlyRate && (mentor.pricing || 0) > maxPrice) return false;

      if (filters.subject && !(mentor.subjects || []).includes(filters.subject)) {
        return false;
      }

      if (filters.exam && mentor.exam !== filters.exam) {
        return false;
      }

      if (filters.minRating && (mentor.rating || 0) < Number(filters.minRating)) {
        return false;
      }

      if (filters.isTopMentor && (!mentor.isVerified && (mentor.rating || 0) < 4.8)) {
        return false;
      }

      return true;
    });

    // Apply sorting
    if (sortBy === "highest_rated") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "most_experienced") {
      result.sort((a, b) => (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0));
    } else if (sortBy === "price_low") {
      result.sort((a, b) => (a.pricing || 0) - (b.pricing || 0));
    } else if (sortBy === "price_high") {
      result.sort((a, b) => (b.pricing || 0) - (a.pricing || 0));
    }

    return result;
  }, [mentors, searchTerm, filters, sortBy]);

  const totalPages = Math.ceil(filteredMentors.length / itemsPerPage);
  const paginatedMentors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMentors.slice(startIndex, endIndex);
  }, [filteredMentors, currentPage]);

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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="mb-16 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Explore <span className="text-blue-600">Mentors</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with top-tier professionals and accelerate your career.
          </p>
        </div>

        <div className="bg-surface-background rounded-2xl border border-border-subtle p-4 mb-20 shadow-sm relative z-30">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <SearchBar onSearchChange={handleSearchChange} />
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-lg shrink-0 transition-colors hover:bg-gray-100">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
                {Object.values(filters).filter(v => v !== false && v !== "").length > 0 && (
                  <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full min-w-[18px] text-center">
                    {Object.values(filters).filter(v => v !== false && v !== "").length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleFiltersChange({ ...filters, isTopMentor: !filters.isTopMentor })}
                className={`hidden xl:flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 border ${filters.isTopMentor
                  ? "bg-amber-50 border-amber-200 text-amber-700 shadow-sm"
                  : "bg-gray-50 border-transparent text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Trophy className={`w-4 h-4 ${filters.isTopMentor ? "text-amber-500" : "text-gray-500"}`} />
                <span className="text-sm font-medium whitespace-nowrap">Top Mentor</span>
              </button>

              <PremiumDropdown
                label="Sort By"
                selectedValue={sortBy}
                onSelect={setSortBy}
                align="right"
                options={[
                  { label: "Relevance", value: "relevance" },
                  { label: "Highest Rated", value: "highest_rated" },
                  { label: "Most Experienced", value: "most_experienced" },
                  { label: "Price (Low to High)", value: "price_low" },
                  { label: "Price (High to Low)", value: "price_high" },
                ]}
                className="w-48"
              />
            </div>
          </div>

          <div className="xl:hidden mb-4">
            <FiltersAccordion
              filters={filters}
              onFiltersChange={handleFiltersChange}
              mentorCount={filteredMentors.length}
            />
          </div>

          <div className="flex gap-3 mb-4 mt-2">
            <PremiumDropdown
              label="Exam"
              selectedValue={filters.exam}
              onSelect={(value) => handleFiltersChange({ ...filters, exam: value })}
              options={[
                { label: "UPSC CSE", value: "UPSC CSE", icon: <FileText className="w-4 h-4 text-gray-500" /> },
                { label: "SSC CGL", value: "SSC CGL", icon: <GraduationCap className="w-4 h-4 text-gray-500" /> },
                { label: "State PSC", value: "State PSC", icon: <MessageSquare className="w-4 h-4 text-gray-500" /> },
                { label: "RBI Grade B", value: "RBI Grade B", icon: <Award className="w-4 h-4 text-gray-500" /> },
                { label: "Defence", value: "Defence", icon: <Briefcase className="w-4 h-4 text-gray-500" /> },
              ]}
              icon={<GraduationCap className={`w-4 h-4 ${filters.exam ? "text-blue-500" : "text-gray-500"}`} />}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <aside className="hidden xl:block xl:w-80 flex-shrink-0">
            <div className="sticky top-32">
              <FiltersPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                mentorCount={filteredMentors.length}
              />
            </div>
          </aside>

          <main className="lg:col-span-2">
            <div className="hidden lg:block mb-10">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {filteredMentors.length}
                </span>{" "}
                {filteredMentors.length === 1 ? "mentor" : "mentors"} found
              </p>
            </div>

            {loading ? (
              <div className="space-y-12">
                {[...Array(4)].map((_, index) => (
                  <SimpleMentorCard key={index} isLoading={true} />
                ))}
              </div>
            ) : filteredMentors.length === 0 ? (
              <div className="text-center py-20 px-4 bg-surface-background rounded-2xl border border-border-subtle shadow-sm">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Mentors Found
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Try adjusting your filters, clearing your search query, or selecting a different exam category.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-10">
                  {paginatedMentors.map((mentor) => (
                    <SimpleMentorCard
                      key={mentor.id}
                      mentor={{
                        id: mentor.id,
                        name: mentor.name,
                        profileImage: mentor.profileImage || mentor.profilePhoto,
                        mentorProfile: mentor.mentorProfile,
                        isVerified: mentor.isVerified,
                        tagLine: mentor.tagLine,
                        bio: mentor.bio,
                        rating: mentor.rating,
                        reviewsCount: mentor.reviewsCount,
                        sessions: mentor.sessions,
                        pricing: mentor.pricing,
                        sessionDuration: (mentor as any).sessionDuration,
                        isFreeTrialEnabled: (mentor as any).isFreeTrialEnabled,
                        offerings: mentor.offerings,
                        attendance: mentor.attendance,
                        yearsOfExperience: mentor.yearsOfExperience,
                        subjects: mentor.subjects,
                        specializations: mentor.specializations,
                        college: mentor.college,
                        exam: mentor.exam,
                        rank: mentor.rank,
                        service: mentor.service,
                        posting: mentor.posting,
                      }}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-16">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
