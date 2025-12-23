"use client";

interface FilterState {
  minHourlyRate: string;
  maxHourlyRate: string;
  subject: string;
  exam: string;
  minRating: string;
}

interface MentorFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function MentorFilters({
  filters,
  onFiltersChange,
}: MentorFiltersProps) {
  return (
    <div className="bg-white border rounded-xl p-4 space-y-4">

      <h3 className="font-semibold text-gray-900">Filters</h3>

      {/* Price */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Min Hourly Rate (₹)
        </label>
        <input
          type="number"
          value={filters.minHourlyRate}
          onChange={(e) =>
            onFiltersChange({ ...filters, minHourlyRate: e.target.value })
          }
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Max Hourly Rate (₹)
        </label>
        <input
          type="number"
          value={filters.maxHourlyRate}
          onChange={(e) =>
            onFiltersChange({ ...filters, maxHourlyRate: e.target.value })
          }
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Subject
        </label>
        <select
          value={filters.subject}
          onChange={(e) =>
            onFiltersChange({ ...filters, subject: e.target.value })
          }
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option value="">All Subjects</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Biology">Biology</option>
          <option value="History">History</option>
          <option value="Economics">Economics</option>
        </select>
      </div>

      {/* Exam */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Exam
        </label>
        <select
          value={filters.exam}
          onChange={(e) =>
            onFiltersChange({ ...filters, exam: e.target.value })
          }
          className="w-full border rounded-md px-3 py-2 text-sm"
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
        <label className="block text-sm text-gray-600 mb-1">
          Minimum Rating
        </label>
        <select
          value={filters.minRating}
          onChange={(e) =>
            onFiltersChange({ ...filters, minRating: e.target.value })
          }
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option value="">Any</option>
          <option value="4">4★ & above</option>
          <option value="3">3★ & above</option>
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={() =>
          onFiltersChange({
            minHourlyRate: "",
            maxHourlyRate: "",
            subject: "",
            exam: "",
            minRating: "",
          })
        }
        className="text-sm text-orange-600 font-medium hover:underline"
      >
        Reset Filters
      </button>

    </div>
  );
}
