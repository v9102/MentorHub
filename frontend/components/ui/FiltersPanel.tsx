"use client";

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

  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="font-bold text-lg text-gray-900">Filters</h3>
        <span className="text-sm font-semibold text-blue-600">
          {mentorCount} {mentorCount === 1 ? "mentor" : "mentors"}
        </span>
      </div>

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
        className="w-full mt-4 px-4 py-2.5 text-sm font-semibold text-orange-600 bg-orange-50 border-2 border-orange-200 rounded-lg hover:bg-orange-100 hover:border-orange-300 transition-all duration-200"
      >
        Reset Filters
      </button>
    </div>
  );
}
