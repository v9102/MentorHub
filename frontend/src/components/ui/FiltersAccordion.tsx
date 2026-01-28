"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FilterState {
  minHourlyRate: string;
  maxHourlyRate: string;
  subject: string;
  exam: string;
  minRating: string;
}

interface FiltersAccordionProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  mentorCount: number;
}

export default function FiltersAccordion({
  filters,
  onFiltersChange,
  mentorCount,
}: FiltersAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    onFiltersChange({
      minHourlyRate: "",
      maxHourlyRate: "",
      subject: "",
      exam: "",
      minRating: "",
    });
  };

  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-base text-gray-900">Filters</h3>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {mentorCount} {mentorCount === 1 ? "mentor" : "mentors"}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Accordion Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-4 pt-0 space-y-4 border-t border-gray-100">
          {/* Min Hourly Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Hourly Rate (₹)
            </label>
            <input
              type="number"
              value={filters.minHourlyRate}
              onChange={(e) =>
                onFiltersChange({ ...filters, minHourlyRate: e.target.value })
              }
              placeholder="e.g. 500"
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors duration-200"
            />
          </div>

          {/* Max Hourly Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Hourly Rate (₹)
            </label>
            <input
              type="number"
              value={filters.maxHourlyRate}
              onChange={(e) =>
                onFiltersChange({ ...filters, maxHourlyRate: e.target.value })
              }
              placeholder="e.g. 2000"
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors duration-200"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <select
              value={filters.subject}
              onChange={(e) =>
                onFiltersChange({ ...filters, subject: e.target.value })
              }
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-white"
            >
              <option value="">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
              <option value="History">History</option>
              <option value="Economics">Economics</option>
              <option value="Accountancy">Accountancy</option>
              <option value="Business Studies">Business Studies</option>
              <option value="Legal Reasoning">Legal Reasoning</option>
              <option value="English">English</option>
              <option value="Quantitative Aptitude">Quantitative Aptitude</option>
              <option value="DILR">DILR</option>
            </select>
          </div>

          {/* Exam */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam
            </label>
            <select
              value={filters.exam}
              onChange={(e) =>
                onFiltersChange({ ...filters, exam: e.target.value })
              }
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-white"
            >
              <option value="">All Exams</option>
              <option value="JEE Advanced">JEE Advanced</option>
              <option value="JEE Mains">JEE Mains</option>
              <option value="NEET">NEET</option>
              <option value="GATE">GATE</option>
              <option value="CAT">CAT</option>
              <option value="UPSC">UPSC</option>
              <option value="CLAT">CLAT</option>
              <option value="CUET">CUET</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <select
              value={filters.minRating}
              onChange={(e) =>
                onFiltersChange({ ...filters, minRating: e.target.value })
              }
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-white"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5★ & above</option>
              <option value="4">4★ & above</option>
              <option value="3">3★ & above</option>
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full mt-2 px-4 py-2.5 text-sm font-semibold text-orange-600 bg-orange-50 border-2 border-orange-200 rounded-lg hover:bg-orange-100 hover:border-orange-300 transition-all duration-200"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
