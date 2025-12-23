//MentorSearch.tsx
"use client"

import { Search } from "lucide-react";

type MentorSearchProps = {
  searchTerm : string,
  onSearchChange : (term : string) => void,
};

export default function MentorSearch ({
    searchTerm,
    onSearchChange
} : MentorSearchProps){
  return (
    <div className="relative w-full max-w-2xl">

      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

      <input 
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search Mentors..."
        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
      />
      
    </div>
  )
}

