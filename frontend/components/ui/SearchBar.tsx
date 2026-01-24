"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSearchChange,
  placeholder = "Search Mentors…",
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");

  // Debounce search with 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, onSearchChange]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200 text-gray-900 placeholder-gray-400"
      />
    </div>
  );
}
