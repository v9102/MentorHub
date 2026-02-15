"use client";

import { Slider } from "./slider";
import { motion } from "framer-motion";

interface FilterState {
  minHourlyRate: string;
  maxHourlyRate: string;
  subject: string;
  exam: string;
  minRating: string;
}

interface FiltersPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  mentorCount: number;
}

export default function FiltersPanel({
  filters,
  onFiltersChange,
  mentorCount,
}: FiltersPanelProps) {
  const handleReset = () => {
    onFiltersChange({
      minHourlyRate: "",
      maxHourlyRate: "",
      subject: "",
      exam: "",
      minRating: "",
    });
  };

  const handleSliderChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      minHourlyRate: value[0].toString(),
      maxHourlyRate: value[1].toString(),
    });
  };

  const minPrice = filters.minHourlyRate ? parseInt(filters.minHourlyRate) : 0;
  const maxPrice = filters.maxHourlyRate ? parseInt(filters.maxHourlyRate) : 5000;

  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="font-bold text-lg text-gray-900">Filters</h3>
        <span className="text-sm font-semibold text-blue-600">
          {mentorCount} {mentorCount === 1 ? "mentor" : "mentors"}
        </span>
      </div>

      {/* Hourly Rate Slider */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium text-gray-700">
            Hourly Rate
          </label>
          <motion.div
            key={`${minPrice}-${maxPrice}`}
            initial={{ scale: 1.1, color: "#2563eb" }}
            animate={{ scale: 1, color: "#4b5563" }}
            className="text-sm font-semibold text-gray-600"
          >
            ₹{minPrice} - ₹{maxPrice}
          </motion.div>
        </div>
        <Slider
          defaultValue={[0, 5000]}
          min={0}
          max={5000}
          step={100}
          value={[minPrice, maxPrice]}
          onValueChange={handleSliderChange}
          className="py-4"
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
          <option value="General Studies">General Studies</option>
          <option value="Essay">Essay</option>
          <option value="Ethics">Ethics</option>
          <option value="History">History</option>
          <option value="Geography">Geography</option>
          <option value="Polity">Polity</option>
          <option value="Economy">Economy</option>
          <option value="Quantitative Aptitude">Quantitative Aptitude</option>
          <option value="Reasoning">Reasoning</option>
          <option value="English">English</option>
          <option value="Current Affairs">Current Affairs</option>
          <option value="CSAT">CSAT</option>
          <option value="Optional Subject">Optional Subject</option>
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
          <option value="UPSC CSE">UPSC CSE</option>
          <option value="SSC CGL">SSC CGL</option>
          <option value="Banking">Banking (IBPS/SBI)</option>
          <option value="Railways">Railways (RRB)</option>
          <option value="State PSC">State PSC</option>
          <option value="Defence">Defence (NDA/CDS)</option>
          <option value="RBI Grade B">RBI Grade B</option>
          <option value="Teaching">Teaching (CTET)</option>
          <option value="JEE Mains">JEE Mains</option>
          <option value="NEET">NEET</option>
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
        className="w-full mt-4 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-50 border-2 border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
      >
        Reset Filters
      </button>
    </div>
  );
}
