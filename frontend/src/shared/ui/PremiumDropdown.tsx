"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface DropdownOption {
    label: string;
    value: string;
    icon?: ReactNode;
    badge?: number;
}

interface PremiumDropdownProps {
    label: string;
    options: DropdownOption[];
    selectedValue: string;
    onSelect: (value: string) => void;
    icon?: ReactNode;
    className?: string;
    align?: "left" | "right";
}

export default function PremiumDropdown({
    label,
    options,
    selectedValue,
    onSelect,
    icon,
    className = "",
    align = "left",
}: PremiumDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 border ${isOpen || selectedValue
                        ? "bg-blue-50/50 border-blue-200 text-blue-700"
                        : "bg-gray-50 border-transparent text-gray-700 hover:bg-gray-100"
                    }`}
            >
                {icon}
                <span className="text-sm font-medium whitespace-nowrap">
                    {selectedValue ? selectedOption?.label || label : label}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    <ChevronDown className={`w-4 h-4 ${isOpen || selectedValue ? "text-blue-500" : "text-gray-500"}`} />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={`absolute z-50 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 focus:outline-none ${align === "right" ? "right-0" : "left-0"
                            }`}
                    >
                        <div className="px-2 pb-1 border-b border-gray-50 mb-1">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                                {label}
                            </span>
                        </div>
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onSelect(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${selectedValue === option.value
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    {option.icon}
                                    {option.label}
                                </div>
                                {option.badge !== undefined && (
                                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                        {option.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                        {selectedValue && (
                            <button
                                onClick={() => {
                                    onSelect("");
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors mt-1 border-t border-gray-50"
                            >
                                Clear selection
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
