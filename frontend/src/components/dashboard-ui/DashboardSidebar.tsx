// ─── DashboardSidebar — 4 nav items only, in user-specified order ─────────────
// Order: My Profile → Dashboard → Sessions → Availability
// (Students, Company, Preview Profile removed per user requirements)

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    User,
    ChevronLeft,
    ChevronRight,
    Clock,
    Menu,
    X,
} from "lucide-react";

interface DashboardSidebarProps {
    name?: string;
    title?: string;
    profileImageUrl?: string | null;
}

interface NavItem {
    to: string;
    icon: React.ElementType;
    label: string;
    exact?: boolean;
}

const navItems: NavItem[] = [
    { to: "/dashboard/profile", icon: User, label: "My Profile" },
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", exact: true },
    { to: "/dashboard/sessions", icon: Calendar, label: "Sessions" },
    { to: "/dashboard/availability", icon: Clock, label: "Availability" },
];

export default function DashboardSidebar({
    name = "User",
    title = "Mentor",
    profileImageUrl,
}: DashboardSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (item: NavItem) =>
        item.exact
            ? pathname === item.to
            : pathname === item.to || pathname.startsWith(item.to + "/");

    return (
        <>
            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200/60
          flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.04)]
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-[80px]" : "w-[260px] xl:w-[280px]"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
            >
                {/* Collapse toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-9 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-50 text-slate-500 z-50 hidden md:flex"
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Mobile close */}
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 md:hidden"
                    aria-label="Close menu"
                >
                    <X size={20} />
                </button>

                {/* Logo */}
                <div className={`px-6 py-7 flex items-end ${isCollapsed ? "justify-center px-2" : ""}`}>
                    <svg viewBox="0 0 54 60" className="w-[34px] h-[38px] shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="sg" x1="0" y1="0" x2="54" y2="60" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#27272a" />
                                <stop offset="100%" stopColor="#a1a1aa" />
                            </linearGradient>
                        </defs>
                        <circle cx="12" cy="10" r="6.5" fill="url(#sg)" />
                        <circle cx="42" cy="21" r="5" fill="url(#sg)" />
                        <g fill="url(#sg)">
                            <path d="M5 24 C5 18 19 18 19 24 L19 60 L5 60 Z" />
                            <path d="M37 34 C37 28 47 28 47 34 L47 60 L37 60 Z" />
                        </g>
                        <g stroke="url(#sg)" strokeLinecap="round">
                            <path d="M12 24 L27 45" strokeWidth="11" />
                            <path d="M42 34 L27 45" strokeWidth="9" />
                        </g>
                    </svg>
                    {!isCollapsed && (
                        <span className="text-[26px] font-bold tracking-tight leading-none mb-[2px] -ml-1">
                            <span className="text-slate-900">ento</span>
                            <span className="text-blue-600">Mania</span>
                        </span>
                    )}
                </div>

                {/* User snippet */}
                <div className={`px-5 pb-5 ${isCollapsed ? "px-2" : ""}`}>
                    <div
                        onClick={() => router.push("/dashboard/profile")}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && router.push("/dashboard/profile")}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 shadow-sm
              transition-all hover:shadow-md cursor-pointer
              ${isCollapsed ? "justify-center border-transparent shadow-none hover:bg-slate-100" : ""}`}
                    >
                        <div className="w-9 h-9 rounded-full bg-blue-50 overflow-hidden shrink-0 relative">
                            <Image
                                src={profileImageUrl ?? "https://api.dicebear.com/9.x/toon-head/svg?seed=Vivian"}
                                alt={name}
                                width={36}
                                height={36}
                                className="w-full h-full object-cover"
                                unoptimized
                            />
                        </div>
                        {!isCollapsed && (
                            <div className="overflow-hidden flex-1">
                                <h3 className="text-sm font-semibold text-slate-800 truncate">{name}</h3>
                                <p className="text-xs text-slate-500 truncate">{title}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Nav — 4 items only */}
                <nav className="flex-1 px-4 space-y-0.5 overflow-y-auto pb-6" aria-label="Dashboard navigation">
                    {navItems.map((item) => {
                        const active = isActive(item);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.to}
                                href={item.to}
                                onClick={() => setIsMobileMenuOpen(false)}
                                title={isCollapsed ? item.label : undefined}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${active
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }
                  ${isCollapsed ? "justify-center" : ""}`}
                            >
                                <Icon
                                    className={`w-[18px] h-[18px] shrink-0 ${active ? "text-blue-600" : "text-slate-400"}`}
                                    strokeWidth={active ? 2.5 : 2}
                                />
                                {!isCollapsed && item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile top bar */}
            <header className="h-14 flex items-center justify-between px-5 md:hidden bg-white border-b border-slate-200 sticky top-0 z-20">
                <span className="text-xl font-bold">
                    <span className="text-slate-900">Mento</span>
                    <span className="text-blue-600">Mania</span>
                </span>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>
            </header>

            {/* Desktop sidebar spacer */}
            <div
                className={`hidden md:block shrink-0 transition-all duration-300 ${isCollapsed ? "w-[80px]" : "w-[260px] xl:w-[280px]"
                    }`}
            />
        </>
    );
}
