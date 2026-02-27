"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { LogOut, User as UserIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface ProfileButtonProps {
    className?: string;
    showName?: boolean;
}

export function ProfileButton({ className, showName = false }: ProfileButtonProps) {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isLoaded) {
        return (
            <div className={cn("w-10 h-10 rounded-full bg-slate-200 animate-pulse flex items-center justify-center", className)}>
                <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const role = user.publicMetadata?.role as string | undefined;
    const profileUrl = role === "mentor" ? "/mentor/profile" : "/profile";
    const imageUrl = user.imageUrl;

    // Fallback initials
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

    const fullName = `${firstName} ${lastName}`.trim() || "User";
    const email = user.primaryEmailAddress?.emailAddress || "";

    const handleSignOut = () => {
        setIsOpen(false);
        signOut({ redirectUrl: "/" });
    };

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 rounded-full border-2 border-transparent hover:border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all overflow-hidden",
                    !showName ? "w-10 h-10 justify-center bg-slate-100" : "bg-transparent hover:bg-slate-50 p-1 pr-4"
                )}
                aria-label="Toggle profile menu"
                aria-expanded={isOpen}
            >
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-slate-200 shrink-0">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={fullName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            unoptimized
                        />
                    ) : (
                        <span className="text-sm font-semibold text-slate-600">
                            {initials}
                        </span>
                    )}
                </div>
                {showName && (
                    <div className="flex flex-col items-start px-2">
                        <span className="text-sm font-medium text-slate-900 leading-tight">{fullName}</span>
                        <span className="text-xs text-slate-500 leading-tight">{email}</span>
                    </div>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden z-50 transform origin-top-right"
                    >
                        {/* User Info Header */}
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                                {fullName}
                            </p>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                                {email}
                            </p>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2 flex flex-col gap-1">
                            <Link
                                href={profileUrl}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            >
                                <UserIcon className="w-4 h-4 text-slate-500" />
                                My Profile
                            </Link>

                            <div className="w-full h-px bg-slate-100 my-1" />

                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors text-left w-full"
                            >
                                <LogOut className="w-4 h-4 text-red-500" />
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
