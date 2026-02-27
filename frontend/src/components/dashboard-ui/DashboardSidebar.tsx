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
            {/* Mobile overlay — full-screen tap to close */}
            <div
                className={`fixed inset-0 bg-black/30 z-30 md:hidden backdrop-blur-sm transition-opacity duration-300 ${
                    isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden="true"
            />

            {/* Sidebar — Mobile: full drawer, Desktop: collapsible rail */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200/60
                    flex flex-col shadow-xl md:shadow-[4px_0_24px_rgba(0,0,0,0.01)]
                    transition-transform duration-300 ease-out
                    w-[280px] sm:w-[300px]
                    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0 md:transition-[width] md:duration-300
                    ${isCollapsed ? "md:w-[80px]" : "md:w-[260px] xl:w-[300px]"}
                `}
            >
                {/* Desktop collapse toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-9 bg-white border border-slate-200 rounded-full p-1.5 shadow-sm hover:bg-slate-50 text-slate-500 z-50 hidden md:flex items-center justify-center"
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Mobile close — larger touch target (min 44px) */}
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute top-3 right-3 p-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors md:hidden"
                    aria-label="Close menu"
                >
                    <X size={22} />
                </button>

                {/* Logo */}
                <Link
                    href="/"
                    className={`px-5 py-6 flex items-center ${isCollapsed ? "md:justify-center md:px-2" : ""}`}
                >
                    <Image
                        src="/logo.png"
                        alt="MentoMania Logo"
                        width={48}
                        height={48}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain shrink-0"
                    />
                    <span
                        className={`text-2xl sm:text-[26px] xl:text-[30px] font-bold tracking-tight leading-none -ml-1 sm:-ml-1.5 pt-0.5 sm:pt-1 transition-all ${
                            isCollapsed ? "md:hidden" : ""
                        }`}
                    >
                        <span className="text-slate-900">ento</span>
                        <span className="text-blue-600">Mania</span>
                    </span>
                </Link>

                {/* User snippet — enhanced touch target */}
                <div className={`px-4 sm:px-5 pb-5 sm:pb-6 ${isCollapsed ? "md:px-2" : ""}`}>
                    <div
                        onClick={() => {
                            router.push("/dashboard/profile");
                            setIsMobileMenuOpen(false);
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                router.push("/dashboard/profile");
                                setIsMobileMenuOpen(false);
                            }
                        }}
                        className={`flex items-center gap-3 p-3 rounded-xl border border-slate-100 shadow-sm
                            transition-all hover:shadow-md active:scale-[0.98] cursor-pointer
                            ${isCollapsed ? "md:justify-center md:border-transparent md:shadow-none md:hover:bg-slate-100" : ""}`}
                    >
                        <div className="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-blue-50 overflow-hidden shrink-0 relative">
                            <Image
                                src={profileImageUrl ?? "https://api.dicebear.com/9.x/toon-head/svg?seed=Vivian"}
                                alt={name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                                unoptimized
                            />
                        </div>
                        <div className={`overflow-hidden flex-1 ${isCollapsed ? "md:hidden" : ""}`}>
                            <h3 className="text-sm sm:text-base xl:text-base font-semibold text-slate-800 truncate">{name}</h3>
                            <p className="text-xs sm:text-sm xl:text-sm text-slate-500 truncate">{title}</p>
                        </div>
                    </div>
                </div>

                {/* Nav — enhanced touch targets for mobile (min 48px height) */}
                <nav className="flex-1 px-3 sm:px-4 space-y-1 overflow-y-auto pb-6 overscroll-contain" aria-label="Dashboard navigation">
                    {navItems.map((item) => {
                        const active = isActive(item);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.to}
                                href={item.to}
                                onClick={() => setIsMobileMenuOpen(false)}
                                title={isCollapsed ? item.label : undefined}
                                className={`flex items-center gap-3 px-3 sm:px-3 py-3.5 sm:py-2.5 xl:py-3.5 rounded-xl sm:rounded-lg text-base sm:text-sm xl:text-base font-medium transition-all duration-200 active:scale-[0.98]
                                    ${active
                                        ? "bg-blue-50/80 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }
                                    ${isCollapsed ? "md:justify-center" : ""}`}
                            >
                                <Icon
                                    className={`w-5 h-5 sm:w-5 sm:h-5 xl:w-6 xl:h-6 shrink-0 ${active ? "text-blue-600" : "text-slate-400"}`}
                                    strokeWidth={active ? 2.5 : 2}
                                />
                                <span className={isCollapsed ? "md:hidden" : ""}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile top bar — fixed at top, larger touch target for menu button */}
            <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 md:hidden bg-white/95 backdrop-blur-sm border-b border-slate-200 z-20">
                <Link href="/" className="text-xl font-bold">
                    <span className="text-slate-900">Mento</span>
                    <span className="text-blue-600">Mania</span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-3 -mr-1 text-slate-600 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-colors"
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </button>
            </header>

            {/* Desktop sidebar spacer */}
            <div
                className={`hidden md:block shrink-0 transition-all duration-300 ${
                    isCollapsed ? "w-[80px]" : "w-[260px] xl:w-[300px]"
                }`}
            />
        </>
    );
}
