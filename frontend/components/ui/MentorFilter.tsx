"use client";

interface FilterState {
  maxHourlyRate: string;
  minHourlyRate: string;
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
      <h3 className="font-semibold text-gray-900">Filter By Price</h3>

      {/* Min Price */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Min Hourly Rate (₹)
        </label>
        <input
          type="number"
          value={filters.minHourlyRate}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              minHourlyRate: e.target.value,
            })
          }
          className="w-full border rounded-md px-3 py-2 text-sm"
          placeholder="e.g 500"
        />
      </div>

      {/* Max Price */}

      <div>
        <label className="block text-sm text-gray-900 mb-1">
          Max Hourly Rate (₹)
        </label>
        <input
          type="number"
          value={filters.maxHourlyRate}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              maxHourlyRate: e.target.value,
            })
          }
          className="w-full border rounded-md px-3 py-2 text-sm"
          placeholder="eg. 200"
        />
      </div>
    </div>
  );
}
