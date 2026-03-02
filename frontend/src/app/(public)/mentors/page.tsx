"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { type MentorProfile } from "./mock";
import { fetchMentors } from "@/shared/lib/api/mentors";
import SimpleMentorCard from "@/shared/ui/SimpleMentorCard";
import Pagination from "@/shared/ui/Pagination";
import { Search, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ────────────────────────────────────────────────────────
   Filter option data
   ──────────────────────────────────────────────────────── */

const EXAM_OPTIONS = [
  { label: "All Exams", value: "" },
  { label: "UPSC CSE", value: "UPSC CSE" },
  { label: "Banking", value: "Banking" },
  { label: "NEET", value: "NEET" },
  { label: "JEE", value: "JEE" },
  { label: "CAT", value: "CAT" },
  { label: "SSC CGL", value: "SSC CGL" },
  { label: "CLAT", value: "CLAT" },
  { label: "CA/CMA/CS", value: "CA/CMA/CS" },
];

const LANGUAGE_OPTIONS = [
  { label: "Any Language", value: "" },
  { label: "Hindi", value: "Hindi" },
  { label: "English", value: "English" },
  { label: "Bilingual", value: "Bilingual" },
  { label: "Tamil", value: "Tamil" },
  { label: "Telugu", value: "Telugu" },
  { label: "Marathi", value: "Marathi" },
  { label: "Bengali", value: "Bengali" },
];

const RATING_OPTIONS = [
  { label: "Any Rating", value: "" },
  { label: "4.5★ & above", value: "4.5" },
  { label: "4★ & above", value: "4" },
  { label: "3★ & above", value: "3" },
];

const PRICE_OPTIONS = [
  { label: "Any Price", value: "" },
  { label: "Under ₹500", value: "0-500" },
  { label: "₹500 – ₹1000", value: "500-1000" },
  { label: "₹1000 – ₹2000", value: "1000-2000" },
  { label: "₹2000 – ₹3000", value: "2000-3000" },
  { label: "Above ₹3000", value: "3000-99999" },
];

const EXPERIENCE_OPTIONS = [
  { label: "Any Experience", value: "" },
  { label: "1+ years", value: "1" },
  { label: "3+ years", value: "3" },
  { label: "5+ years", value: "5" },
  { label: "8+ years", value: "8" },
];

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Highest Rated", value: "highest_rated" },
  { label: "Most Experienced", value: "most_experienced" },
  { label: "Price: Low → High", value: "price_low" },
  { label: "Price: High → Low", value: "price_high" },
];

/* ────────────────────────────────────────────────────────
   Reusable Apple-style filter dropdown
   ──────────────────────────────────────────────────────── */

function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);
  const isActive = value !== "";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium
          transition-all duration-200 whitespace-nowrap select-none border
          ${isActive
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
          }
        `}
      >
        <span>{isActive ? selected?.label : label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""
            } ${isActive ? "text-gray-300" : "text-gray-400"}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute left-0 mt-2 w-56 max-h-72 overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${value === opt.value
                  ? "bg-gray-50 text-gray-900 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Main Page
   ──────────────────────────────────────────────────────── */

export default function MentorsPage() {
  /* ── Data ── */
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMentors();
        setMentors(data);
      } catch (err) {
        console.error("Failed to load mentors", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Filter state ── */
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sync initial query parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const examParam = params.get("exam");
    if (examParam) {
      // Decode any URL encoding
      setSelectedExam(decodeURIComponent(examParam));
    }
  }, []);

  /* ── Debounce ── */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  /* ── Active filter count ── */
  const activeFilterCount = [
    selectedExam,
    selectedLanguage,
    selectedRating,
    selectedPrice,
    selectedExperience,
    debouncedSearch,
  ].filter(Boolean).length;

  const clearAll = () => {
    setSelectedExam("");
    setSelectedLanguage("");
    setSelectedRating("");
    setSelectedPrice("");
    setSelectedExperience("");
    setSearchTerm("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  /* ── Filtering + sorting ── */
  const filteredMentors = useMemo(() => {
    const result = mentors.filter((m) => {
      const q = debouncedSearch.trim().toLowerCase();
      if (
        q &&
        !(
          m.name?.toLowerCase().includes(q) ||
          m.bio?.toLowerCase().includes(q) ||
          m.tagLine?.toLowerCase().includes(q)
        )
      )
        return false;

      if (selectedExam && m.exam !== selectedExam) return false;

      if (selectedRating && (m.rating || 0) < Number(selectedRating))
        return false;

      if (selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        const price = m.pricing || 0;
        if (price < min || price > max) return false;
      }

      if (
        selectedExperience &&
        (m.yearsOfExperience || 0) < Number(selectedExperience)
      )
        return false;

      return true;
    });

    if (sortBy === "highest_rated")
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === "most_experienced")
      result.sort(
        (a, b) => (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0)
      );
    else if (sortBy === "price_low")
      result.sort((a, b) => (a.pricing || 0) - (b.pricing || 0));
    else if (sortBy === "price_high")
      result.sort((a, b) => (b.pricing || 0) - (a.pricing || 0));

    return result;
  }, [
    mentors,
    debouncedSearch,
    selectedExam,
    selectedRating,
    selectedPrice,
    selectedExperience,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredMentors.length / itemsPerPage);
  const paginatedMentors = useMemo(() => {
    const s = (currentPage - 1) * itemsPerPage;
    return filteredMentors.slice(s, s + itemsPerPage);
  }, [filteredMentors, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Reset page on filter change ── */
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedExam,
    selectedLanguage,
    selectedRating,
    selectedPrice,
    selectedExperience,
    debouncedSearch,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8"
        >
          <h1 className="text-[2.75rem] sm:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            Mentors
          </h1>
          <p className="mt-2 text-[15px] text-gray-500">
            {loading
              ? "Loading…"
              : `${filteredMentors.length} ${filteredMentors.length === 1 ? "mentor" : "mentors"
              } available`}
          </p>
        </motion.div>

        {/* ── Search row ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.05,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-5"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, subject, or keyword…"
              className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Filter dropdowns row ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.1,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="flex flex-wrap items-center gap-2 mb-10"
        >
          <FilterDropdown
            label="Exam"
            options={EXAM_OPTIONS}
            value={selectedExam}
            onChange={setSelectedExam}
          />
          <FilterDropdown
            label="Language"
            options={LANGUAGE_OPTIONS}
            value={selectedLanguage}
            onChange={setSelectedLanguage}
          />
          <FilterDropdown
            label="Rating"
            options={RATING_OPTIONS}
            value={selectedRating}
            onChange={setSelectedRating}
          />
          <FilterDropdown
            label="Price"
            options={PRICE_OPTIONS}
            value={selectedPrice}
            onChange={setSelectedPrice}
          />
          <FilterDropdown
            label="Experience"
            options={EXPERIENCE_OPTIONS}
            value={selectedExperience}
            onChange={setSelectedExperience}
          />

          {/* Sort */}
          <div className="ml-auto relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              <span>
                {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${sortBy === opt.value
                        ? "bg-gray-50 text-gray-900 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {sortOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setSortOpen(false)}
              />
            )}
          </div>

          {/* Clear all */}
          <AnimatePresence>
            {activeFilterCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={clearAll}
                className="flex items-center gap-1 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear all
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Divider ── */}
        <div className="h-px bg-gray-100 mb-10" />

        {/* ── Content ── */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <SimpleMentorCard key={i} isLoading={true} />
            ))}
          </div>
        ) : filteredMentors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-28"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No mentors found
            </h3>
            <p className="text-gray-500 text-[15px] max-w-sm mx-auto mb-8">
              Try adjusting your filters or search to find what you're looking
              for.
            </p>
            <button
              onClick={clearAll}
              className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              <motion.div layout className="space-y-6">
                {paginatedMentors.map((mentor, index) => (
                  <motion.div
                    key={mentor.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.04,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    <SimpleMentorCard
                      mentor={{
                        id: mentor.id,
                        name: mentor.name,
                        profileImage:
                          mentor.profileImage || mentor.profilePhoto,
                        mentorProfile: mentor.mentorProfile,
                        isVerified: mentor.isVerified,
                        tagLine: mentor.tagLine,
                        bio: mentor.bio,
                        rating: mentor.rating,
                        reviewsCount: mentor.reviewsCount,
                        sessions: mentor.sessions,
                        pricing: mentor.pricing,
                        sessionDuration: (mentor as any).sessionDuration,
                        isFreeTrialEnabled: (mentor as any)
                          .isFreeTrialEnabled,
                        offerings: mentor.offerings,
                        attendance: mentor.attendance,
                        yearsOfExperience: mentor.yearsOfExperience,
                        subjects: mentor.subjects,
                        specializations: mentor.specializations,
                        college: mentor.college,
                        exam: mentor.exam,
                        rank: mentor.rank != null ? String(mentor.rank) : undefined,
                        service: mentor.service,
                        posting: mentor.posting,
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

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
      </div>
    </div>
  );
}
