// ─── Strict migration of final_website/pages/EditProfile.jsx ─────────────────
// Adaptations (framework only, no redesign):
//   • Link from 'react-router-dom' → Link from 'next/link'
//   • <img> → next/image (with width/height for static avatar, unoptimized for dynamic)
//   • useMentor() → local useState (MentorState initialized from useUser)
//   • setProfileImageUrl → local useState
//   • All classNames and JSX structure preserved verbatim

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    User, Mail, ChevronDown, Camera, Pen, Check, Share2,
    Calendar, Clock, Trash2, Plus, ArrowUpRight, Bell,
    Shield, Smartphone, Briefcase, QrCode, Wallet,
    MapPin, GraduationCap,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import FadeIn from "@/components/dashboard-ui/FadeIn";
import QRCode from "react-qr-code";

// ── Sub-Components (verbatim from EditProfile.jsx) ────────────────────────────

const NotificationPopup = ({ message }: { message: string }) => (
    <div className="absolute top-full right-0 mt-3 w-max max-w-[240px] bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl shadow-slate-900/20 z-50 animate-in fade-in slide-in-from-top-2 border border-slate-800">
        {message}
        <div className="absolute -top-1.5 right-5 w-3 h-3 bg-slate-900 rotate-45 border-l border-t border-slate-800" />
    </div>
);

const SmoothWrapper = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<string | number>("auto");

    useEffect(() => {
        if (!contentRef.current) return;
        const obs = new ResizeObserver((entries) => {
            for (const entry of entries) setHeight(entry.contentRect.height);
        });
        obs.observe(contentRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div style={{ height }} className={`transition-[height] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] overflow-hidden will-change-[height] ${className}`}>
            <div ref={contentRef}>{children}</div>
        </div>
    );
};

interface InputGroupProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    success?: boolean;
    type?: string;
    icon?: React.ElementType;
    placeholder?: string;
}

const InputGroup = ({ label, value, onChange, error, success, type = "text", icon: Icon, placeholder }: InputGroupProps) => (
    <div className="relative group">
        <label className="block text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 sm:mb-2 ml-1">{label}</label>
        <div className="relative">
            <input
                type={type} value={value} onChange={onChange} placeholder={placeholder}
                className={`block w-full pl-9 sm:pl-11 pr-4 py-3 sm:py-3.5 bg-white border ${error
                    ? "border-red-300 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-red-200"
                    : success
                        ? "border-indigo-500 bg-indigo-50/10 focus:border-indigo-500 focus:ring-indigo-200"
                        : "border-slate-200 group-hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                    } rounded-xl sm:rounded-2xl text-sm sm:text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:outline-none transition-all duration-200 shadow-sm`}
            />
            {Icon && <Icon className={`absolute left-3 sm:left-4 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 transition-colors ${error ? "text-red-400" : "text-slate-400 group-hover:text-slate-500 group-focus-within:text-indigo-500"}`} />}
        </div>
        {error && <p className="absolute -bottom-5 right-0 text-red-500 text-[10px] font-bold animate-in slide-in-from-top-1">{error}</p>}
    </div>
);

const AVATAR_ASSETS: Record<string, string> = {
    Male: "https://api.dicebear.com/9.x/toon-head/svg?seed=Vivian",
    Female: "https://api.dicebear.com/9.x/toon-head/svg?seed=Oliver",
    Transgender: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jack",
    Bisexual: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aiden",
};

// ── Mentor state shape ────────────────────────────────────────────────────────

interface MentorState {
    name: string; title: string; email: string; phone: string;
    location: string; experience: string; gender: string;
    about: string; upiId: string; accountNumber: string;
    bankName: string; ifsc: string;
    availability: Array<{ id: number; day: string; startTime: string; endTime: string }>;
}

// ── Mock upcoming sessions (verbatim from EditProfile.jsx) ────────────────────

const upcomingSessions = [
    { id: 1, student: "Sarah Jenkins", time: "Today, 2:00 PM", topic: "React Performance Tuning", duration: "60 min", status: "Confirmed", avatar: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=e0e7ff&color=4f46e5" },
    { id: 2, student: "Marcus Cole", time: "Tomorrow, 10:00 AM", topic: "System Design Interview", duration: "45 min", status: "Pending", avatar: "https://ui-avatars.com/api/?name=Marcus+Cole&background=fef3c7&color=d97706" },
    { id: 3, student: "Elena Rodriguez", time: "Thu, 4:30 PM", topic: "Resume Review", duration: "30 min", status: "Confirmed", avatar: "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=dcfce7&color=16a34a" },
];

// ── Helper functions (verbatim from EditProfile.jsx) ─────────────────────────

const validateField = (field: string, value: string) => {
    if (value === null || value === undefined) return "";
    let error = "";
    if (field === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email address";
    if (field === "phone") {
        if (value && !/^\d+$/.test(value)) error = "Digits only";
        else if (value && (value.length < 8 || value.length > 15)) error = "8-15 digits";
    }
    if (field === "name" && !value.trim()) error = "Required";
    if (field === "upiId" && value && !/^[\w.-]+@[\w.-]+$/.test(value)) error = "Invalid UPI ID format";
    return error;
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EditProfile() {
    const { user } = useUser();

    const [mentor, setMentor] = useState<MentorState>({
        name: user?.fullName ?? "",
        title: (user?.publicMetadata?.title as string) ?? "",
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        phone: (user?.publicMetadata?.phone as string) ?? "",
        location: (user?.publicMetadata?.location as string) ?? "",
        experience: (user?.publicMetadata?.experience as string) ?? "",
        gender: (user?.publicMetadata?.gender as string) ?? "",
        about: (user?.publicMetadata?.about as string) ?? "",
        upiId: (user?.publicMetadata?.upiId as string) ?? "",
        accountNumber: (user?.publicMetadata?.accountNumber as string) ?? "",
        bankName: (user?.publicMetadata?.bankName as string) ?? "",
        ifsc: (user?.publicMetadata?.ifsc as string) ?? "",
        availability: [
            { id: 1, day: "Monday", startTime: "10:00 AM", endTime: "11:00 AM" },
            { id: 2, day: "Wednesday", startTime: "02:00 PM", endTime: "03:00 PM" },
        ],
    });
    const [profileImageUrl, setProfileImageUrl] = useState<string>(user?.imageUrl ?? AVATAR_ASSETS.Male);

    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [isQRVisible, setIsQRVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [notification, setNotification] = useState<{ id: string; message: string } | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [avatarColor, setAvatarColor] = useState("b6e3f4");
    const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successAnimations, setSuccessAnimations] = useState<Record<string, boolean>>({});
    const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState({ code: "+91", label: "IN" });

    const countries = [
        { code: "+966", label: "SA" }, { code: "+1", label: "US" },
        { code: "+44", label: "UK" }, { code: "+91", label: "IN" }, { code: "+971", label: "AE" },
    ];

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        return () => { if (bannerImageUrl) URL.revokeObjectURL(bannerImageUrl); };
    }, [bannerImageUrl]);

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith("image/")) return;
        setProfileImageUrl(URL.createObjectURL(file));
    };

    const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith("image/")) return;
        if (bannerImageUrl) URL.revokeObjectURL(bannerImageUrl);
        setBannerImageUrl(URL.createObjectURL(file));
    };

    const handleGenderSelect = (gender: string) => {
        updateField("gender", gender);
        setProfileImageUrl(`${AVATAR_ASSETS[gender]}&backgroundColor=${avatarColor}`);
    };

    const handleColorSelect = (color: string) => {
        setAvatarColor(color);
        const gender = mentor.gender && AVATAR_ASSETS[mentor.gender] ? mentor.gender : "Male";
        setProfileImageUrl(`${AVATAR_ASSETS[gender]}&backgroundColor=${color}`);
    };

    const updateField = (field: keyof MentorState, value: string) => {
        if ((field === "phone" || field === "accountNumber") && value) {
            if (!/^\d*$/.test(value)) return;
        }
        setMentor((prev) => ({ ...prev, [field]: value }));
        const error = validateField(field, value);
        if (error) {
            setErrors((prev) => ({ ...prev, [field]: error }));
        } else {
            if (errors[field]) {
                setSuccessAnimations((prev) => ({ ...prev, [field]: true }));
                setTimeout(() => setSuccessAnimations((prev) => ({ ...prev, [field]: false })), 1000);
            }
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const showNotification = (id: string, message: string) => {
        setNotification({ id, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const toggleSection = (section: string) => {
        if (activeSection === section) {
            if (section === "slots") showNotification("slots", "Availability saved!");
            setActiveSection(null);
        } else {
            setActiveSection(section);
        }
    };

    const profileUrl = mounted
        ? `${window.location.origin}/mentor/${user?.id || "preview"}`
        : "";

    const handleCopyLink = async (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        try {
            await navigator.clipboard.writeText(profileUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* ignore */ }
    };

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsQRVisible(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setIsQRVisible(false), 300);
    };

    const getCardStyle = (sectionName: string) => {
        const isAnySectionActive = activeSection !== null;
        const isThisSectionActive = activeSection === sectionName || (sectionName === "personal" && activeSection === "bio");
        const isBlurState = isAnySectionActive && !isThisSectionActive;
        const base = "rounded-2xl sm:rounded-[2rem] border border-slate-200/60 p-4 sm:p-5 md:p-6 lg:p-8 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] relative overflow-hidden";
        if (isThisSectionActive) return `bg-indigo-50/30 ${base} shadow-2xl shadow-indigo-900/10 ring-1 ring-indigo-500/30 scale-[1.005] z-30 translate-y-0`;
        if (isBlurState) return `bg-white ${base} shadow-none opacity-50 blur-[1px] grayscale-[0.1] scale-[0.99] pointer-events-none translate-y-0`;
        return `bg-white ${base} shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 hover:border-indigo-200/50 z-10`;
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-24 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
            <style>{`
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.96) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-pop-in { animation: popIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        @keyframes animated-gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[400px] sm:h-[600px] bg-gradient-to-b from-indigo-50/60 to-transparent" />
                <div className="absolute -top-20 -right-20 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-blue-50/40 rounded-full blur-[120px]" />
                <div className="absolute top-40 -left-20 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-purple-50/40 rounded-full blur-[100px]" />
            </div>

            {/* TOP HEADER — Mobile-first: stacked layout */}
            <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between z-10 animate-pop-in">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Your Profile</h1>
                        <span className="text-sm sm:text-[15px] font-medium text-slate-500 mt-1 sm:mt-1.5">Manage your public presence and settings</span>
                    </div>
                    <Link href="/dashboard/preview" className="flex sm:hidden lg:flex items-center gap-2 text-xs sm:text-[13px] font-bold text-indigo-600 hover:text-indigo-700 bg-white hover:bg-indigo-50 active:bg-indigo-100 px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl transition-all border border-slate-200 shadow-sm hover:shadow-md w-fit mt-2 sm:mt-0 sm:ml-6">
                        Preview Profile <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </Link>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                    <button onClick={() => showNotification("notifs", "No new notifications")} className="relative group p-3 sm:p-3.5 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all active:scale-95">
                        <Bell className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" strokeWidth={2.5} />
                        <span className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        {notification?.id === "notifs" && <NotificationPopup message={notification.message} />}
                    </button>
                </div>
            </div>

            <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6 lg:space-y-10 z-10 animate-pop-in" style={{ animationDelay: "0.1s" }}>

                {/* HERO PROFILE CARD */}
                <FadeIn delay={0.1}>
                    <div className={getCardStyle("personal")}>
                        {/* Banner Area — Mobile: shorter height */}
                        <div className="h-28 sm:h-35 md:h-40 w-[calc(100%+2rem)] sm:w-[calc(100%+2.5rem)] md:w-[calc(100%+4rem)] -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 md:-mx-8 md:-mt-8 relative group overflow-hidden mb-0 shadow-sm bg-slate-100">
                            {bannerImageUrl ? (
                                <Image src={bannerImageUrl} alt="Banner" fill className="object-cover z-0 transition-transform duration-700 group-hover:scale-105" unoptimized />
                            ) : (
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
                            )}
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        {/* Profile Content */}
                        <div className="relative">
                            <div className="flex flex-col items-center gap-4 sm:gap-6 mb-4 sm:mb-5 relative text-center lg:flex-row lg:items-start lg:text-left">

                                {/* Avatar Section — Mobile: centered, smaller */}
                                <div className="relative -mt-14 sm:-mt-16 z-30 shrink-0 group/avatar">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full p-1 sm:p-1.5 bg-white shadow-xl shadow-slate-200/60 hover:scale-105 transition-all duration-300 ease-out">
                                        <label className="block w-full h-full rounded-full overflow-hidden relative cursor-pointer bg-slate-50 ring-1 ring-slate-100">
                                            <Image key={profileImageUrl} src={profileImageUrl} alt="Profile" width={144} height={144} className="w-full h-full object-cover animate-in fade-in zoom-in duration-500" unoptimized />
                                            <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-300">
                                                <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-md" />
                                            </div>
                                            <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                                        </label>
                                    </div>

                                    {/* Share Actions */}
                                    <div className="absolute -bottom-2 sm:-bottom-3 -right-2 sm:-right-3 flex gap-2">
                                        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative">
                                            <button onClick={handleCopyLink} className="p-2.5 sm:p-3.5 bg-white hover:bg-indigo-50 active:bg-indigo-100 text-slate-600 hover:text-indigo-600 rounded-full shadow-lg shadow-slate-200/50 border border-slate-100 transition-all active:scale-95 hover:-translate-y-1">
                                                {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" /> : <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* QR Popup — Hidden on mobile, shown on lg+ */}
                                    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                                        className={`hidden lg:block absolute top-0 left-[125%] z-20 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-left ${isQRVisible ? "opacity-100 scale-100 visible" : "opacity-0 scale-90 invisible -translate-x-8"}`}>
                                        <div className="absolute w-16 h-full -left-12 top-0" />
                                        <div className="bg-white p-5 rounded-[2rem] shadow-2xl shadow-indigo-900/10 border border-slate-100 w-[180px] flex flex-col items-center">
                                            <div className="w-[120px] h-[120px] bg-white rounded-xl flex items-center justify-center p-2">
                                                {mounted && profileUrl && (
                                                    <QRCode
                                                        value={profileUrl}
                                                        size={104}
                                                        level="M"
                                                        bgColor="#ffffff"
                                                        fgColor="#1e293b"
                                                    />
                                                )}
                                            </div>
                                            <span className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Scan to View</span>
                                            <div className="absolute -left-2 bottom-6 w-4 h-4 bg-white rotate-45 border-l border-b border-slate-100" />
                                        </div>
                                    </div>
                                </div>

                                {/* Details Section */}
                                <div className={`flex-1 w-full lg:pt-2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isQRVisible ? "lg:pl-56" : ""}`}>
                                    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start w-full gap-4 lg:gap-0">
                                        <div className="flex-1 transition-all duration-300 w-full">
                                            <SmoothWrapper>
                                                {activeSection === "personal" ? (
                                                    <div key="edit-form" className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                                                        <InputGroup label="Full Name" value={mentor.name} onChange={(e) => updateField("name", e.target.value)} error={errors.name} success={successAnimations.name} icon={User} placeholder="John Doe" />
                                                        <InputGroup label="Role Title" value={mentor.title} onChange={(e) => updateField("title", e.target.value)} icon={Briefcase} placeholder="Senior Developer" />
                                                        <InputGroup label="Email Address" value={mentor.email} onChange={(e) => updateField("email", e.target.value)} error={errors.email} success={successAnimations.email} icon={Mail} placeholder="john@example.com" />

                                                        <div className="relative group">
                                                            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-2 ml-1">Phone</label>
                                                            <div className="flex bg-white border border-slate-200 rounded-xl sm:rounded-2xl focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-500 transition-all shadow-sm">
                                                                <button onClick={() => setIsPhoneDropdownOpen(!isPhoneDropdownOpen)}
                                                                    className="px-3 sm:px-4 border-r border-slate-200 flex items-center gap-1.5 sm:gap-2 hover:bg-slate-50 rounded-l-xl sm:rounded-l-2xl transition-colors text-xs sm:text-sm font-bold text-slate-700">
                                                                    {selectedCountry.code} <ChevronDown className="w-3 h-3 text-slate-400" />
                                                                </button>
                                                                <input type="tel" value={mentor.phone} onChange={(e) => updateField("phone", e.target.value)}
                                                                    className="w-full bg-transparent px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-[15px] font-semibold outline-none placeholder:text-slate-400 rounded-r-xl sm:rounded-r-2xl" placeholder="123 456 789" />
                                                                <Smartphone className="absolute right-3 sm:right-4 top-[calc(50%+0.5rem)] -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
                                                            </div>
                                                            {isPhoneDropdownOpen && (
                                                                <div className="absolute top-full left-0 mt-2 w-32 sm:w-36 bg-white border border-slate-100 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden z-50 py-1 animate-in fade-in zoom-in-95">
                                                                    {countries.map((c) => (
                                                                        <button key={c.code} onClick={() => { setSelectedCountry(c); setIsPhoneDropdownOpen(false); }}
                                                                            className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-2 hover:bg-slate-50 active:bg-slate-100 text-xs sm:text-sm font-semibold text-slate-700">
                                                                            {c.label} ({c.code})
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <InputGroup label="Location" value={mentor.location} onChange={(e) => updateField("location", e.target.value)} icon={MapPin} placeholder="San Francisco, CA" />
                                                        <InputGroup label="Experience" value={mentor.experience} onChange={(e) => updateField("experience", e.target.value)} icon={GraduationCap} placeholder="3rd Year" />

                                                        {/* Gender / Avatar Selection */}
                                                        <div className="col-span-1 sm:col-span-2 pt-2">
                                                            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-3 ml-1">Select Avatar / Gender</label>
                                                            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                                                                {Object.keys(AVATAR_ASSETS).map((gender) => (
                                                                    <button key={gender} onClick={() => handleGenderSelect(gender)}
                                                                        className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 border ${mentor.gender === gender
                                                                            ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-105 ring-2 ring-slate-200 ring-offset-2"
                                                                            : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm active:scale-95"}`}>
                                                                        {gender}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                                                <span className="text-xs font-bold text-slate-400">Background:</span>
                                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                                    {["b6e3f4", "c0aede", "d1d4f9", "ffdfbf", "ffd5dc"].map((color) => (
                                                                        <button key={color} type="button" onClick={() => handleColorSelect(color)}
                                                                            className={`w-6 h-6 sm:w-6 sm:h-6 rounded-full border-2 transition-all active:scale-90 ${avatarColor === color ? "border-slate-900 scale-110" : "border-transparent hover:scale-110"}`}
                                                                            style={{ backgroundColor: `#${color}` }} title={`#${color}`} />
                                                                    ))}
                                                                    <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors shadow-sm">
                                                                        <input type="color" value={`#${avatarColor}`} onChange={(e) => handleColorSelect(e.target.value.replace("#", ""))}
                                                                            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 p-0 border-0 cursor-pointer" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div key="view-info" className="space-y-1 sm:space-y-2 animate-in fade-in duration-500">
                                                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">{mentor.name || "Your Name"}</h2>
                                                        <p className="text-sm sm:text-base lg:text-lg font-medium text-slate-500 flex items-center justify-center lg:justify-start gap-2 pb-1">{mentor.title || "Add your role"}</p>
                                                        <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 sm:gap-x-6 gap-y-2 pt-1 text-xs sm:text-sm font-medium text-slate-500">
                                                            <span className="flex items-center gap-1.5 sm:gap-2 hover:text-indigo-600 transition-colors cursor-default break-all"><Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-slate-400" /><span className="truncate max-w-[150px] sm:max-w-none">{mentor.email || "No email"}</span></span>
                                                            <span className="flex items-center gap-1.5 sm:gap-2 hover:text-indigo-600 transition-colors cursor-default"><Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-slate-400" />{selectedCountry.code} {mentor.phone || "No phone"}</span>
                                                            <span className="flex items-center gap-1.5 sm:gap-2 hover:text-indigo-600 transition-colors cursor-default"><MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-slate-400" />{mentor.location || "Add Location"}</span>
                                                            <span className="flex items-center gap-1.5 sm:gap-2 hover:text-indigo-600 transition-colors cursor-default"><GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-slate-400" />{mentor.experience || "Add Experience"}</span>
                                                            <span className="flex items-center gap-1.5 sm:gap-2 hover:text-indigo-600 transition-colors cursor-default"><User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-slate-400" />{mentor.gender || "Add Gender"}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </SmoothWrapper>
                                        </div>

                                        <button onClick={() => toggleSection("personal")}
                                            className={`p-2.5 sm:p-3 lg:p-3.5 rounded-full transition-all duration-300 shadow-sm border lg:ml-6 ${activeSection === "personal" ? "bg-slate-900 text-white border-slate-900 rotate-0 shadow-lg" : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md active:scale-95"}`}>
                                            {activeSection === "personal" ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Pen className="w-4 h-4 sm:w-5 sm:h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">About Me</h3>
                                    <button onClick={() => toggleSection("bio")} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 active:text-indigo-800 px-3 sm:px-4 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg sm:rounded-xl transition-colors w-fit">
                                        {activeSection === "bio" ? "Done" : "Edit Bio"}
                                    </button>
                                </div>
                                <SmoothWrapper>
                                    {activeSection === "bio" ? (
                                        <textarea value={mentor.about} onChange={(e) => updateField("about", e.target.value)} rows={4}
                                            className="w-full p-4 sm:p-5 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-slate-800 text-sm sm:text-[15px] leading-relaxed focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none transition-all shadow-sm"
                                            placeholder="Tell your students a bit about yourself..." />
                                    ) : (
                                        <p className="text-slate-600 leading-relaxed max-w-4xl text-sm sm:text-[16px]">
                                            {mentor.about || <span className="text-slate-400 italic">No bio added yet. Click edit to introduce yourself.</span>}
                                        </p>
                                    )}
                                </SmoothWrapper>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* 2-COLUMN GRID — Mobile: single column, Desktop: 2 columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-10">

                    {/* Availability Slots */}
                    <FadeIn delay={0.2} className="h-full">
                        <div className={`${getCardStyle("slots")} h-full`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-2.5 sm:p-3 bg-indigo-50 text-indigo-600 rounded-xl sm:rounded-2xl"><Calendar className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} /></div>
                                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Availability</h3>
                                </div>
                                <Link href="/dashboard/availability"
                                    className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 w-fit">
                                    Manage Slots
                                </Link>
                            </div>
                            <SmoothWrapper>
                                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                    {mentor.availability.map((slot) => (
                                        <div key={slot.id} className="group relative flex items-center justify-between p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-900/5 transition-all duration-300">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className="w-1 sm:w-1.5 h-10 sm:h-12 rounded-full bg-indigo-200 group-hover:bg-indigo-500 transition-colors" />
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm sm:text-[15px]">{slot.day}</p>
                                                    <p className="text-[11px] sm:text-xs font-bold text-slate-500 flex items-center gap-1.5 mt-1 bg-white px-2 py-1 rounded-lg border border-slate-100 w-fit">
                                                        <Clock className="w-3 h-3" />{slot.startTime} - {slot.endTime}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {mentor.availability.length === 0 && (
                                        <div className="text-center py-10 sm:py-12 border-2 border-dashed border-slate-100 rounded-2xl sm:rounded-3xl text-slate-400 text-xs sm:text-sm font-medium italic">No availability slots added yet.</div>
                                    )}
                                </div>
                            </SmoothWrapper>
                        </div>
                    </FadeIn>

                    {/* Payment (UPI) Section */}
                    <FadeIn delay={0.3} className="h-full">
                        <div className={`${getCardStyle("payment")} h-full`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-2.5 sm:p-3 bg-emerald-50 text-emerald-600 rounded-xl sm:rounded-2xl"><Wallet className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} /></div>
                                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Payments</h3>
                                </div>
                                <button onClick={() => toggleSection("payment")} className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all w-fit ${activeSection === "payment" ? "bg-slate-900 text-white shadow-lg" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100"}`}>
                                    {activeSection === "payment" ? "Save UPI" : "Edit UPI"}
                                </button>
                            </div>
                            <SmoothWrapper>
                                {activeSection === "payment" ? (
                                    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="p-3 sm:p-4 bg-emerald-50/50 rounded-xl sm:rounded-2xl border border-emerald-100 mb-2">
                                            <p className="text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2"><QrCode className="w-4 h-4 shrink-0" />Enter your UPI ID below. A QR code will be generated automatically.</p>
                                        </div>
                                        <InputGroup label="UPI ID (VPA)" value={mentor.upiId} onChange={(e) => updateField("upiId", e.target.value)} error={errors.upiId} success={successAnimations.upiId} icon={Smartphone} placeholder="username@oksbi" />
                                        <div className="relative py-3 sm:py-4">
                                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                                            <div className="relative flex justify-center text-[10px] sm:text-xs uppercase"><span className="bg-white px-2 text-slate-500 font-bold tracking-wider">Bank Details (Optional)</span></div>
                                        </div>
                                        <InputGroup label="Account Number" value={mentor.accountNumber} onChange={(e) => updateField("accountNumber", e.target.value)} placeholder="0000 0000 0000" />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                            <InputGroup label="Bank Name" value={mentor.bankName} onChange={(e) => updateField("bankName", e.target.value)} placeholder="Bank Name" />
                                            <InputGroup label="IFSC Code" value={mentor.ifsc} onChange={(e) => updateField("ifsc", e.target.value)} placeholder="ABCD000" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative h-52 sm:h-64 w-full rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-900/20 group transition-all hover:scale-[1.02] duration-500 bg-gradient-to-br from-emerald-600 to-teal-900 text-white p-5 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 pointer-events-none" />
                                        <div className="absolute bottom-0 left-0 w-32 sm:w-40 h-32 sm:h-40 bg-teal-400/20 rounded-full blur-3xl -ml-8 sm:-ml-10 -mb-8 sm:-mb-10 pointer-events-none" />
                                        <div className="flex flex-col justify-between h-full z-10 w-full text-center sm:text-left">
                                            <div className="flex flex-col items-center sm:items-start">
                                                <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/10 backdrop-blur-md w-fit rounded-lg border border-white/20 mb-3 sm:mb-4 shadow-sm">
                                                    <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-emerald-100 flex items-center gap-2">Unified Payments Interface</span>
                                                </div>
                                                <p className="text-emerald-100/60 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase mb-1">Payment Address</p>
                                                <p className="text-xl sm:text-2xl md:text-3xl font-mono font-bold tracking-wide text-white drop-shadow-sm truncate w-full max-w-[200px] sm:max-w-none">
                                                    {mentor.upiId || "Add UPI ID"}
                                                </p>
                                            </div>
                                            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-100 bg-emerald-900/30 px-3 py-1.5 rounded-full w-fit backdrop-blur-sm border border-emerald-500/30 mt-4">
                                                <Shield className="w-3.5 h-3.5" />{mentor.bankName ? `Linked: ${mentor.bankName}` : "Secure Payment Gateway"}
                                            </div>
                                        </div>
                                        {/* QR code — hidden on small mobile */}
                                        <div className="relative shrink-0 hidden sm:block">
                                            <div className="bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-xl shadow-emerald-900/40 transform rotate-[-3deg] group-hover:rotate-0 transition-all duration-500 ease-out border-4 border-white/20">
                                                <div className="w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] bg-white rounded-lg flex items-center justify-center p-1.5 sm:p-2">
                                                    {mentor.upiId ? (
                                                        <QRCode
                                                            value={`upi://pay?pa=${encodeURIComponent(mentor.upiId)}&pn=${encodeURIComponent(mentor.name || 'Mentor')}&cu=INR`}
                                                            size={100}
                                                            level="M"
                                                            bgColor="#ffffff"
                                                            fgColor="#065f46"
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center text-slate-300">
                                                            <QrCode className="w-8 h-8 sm:w-10 sm:h-10 mb-1" />
                                                            <span className="text-[8px] sm:text-[9px] font-bold text-slate-400">Add UPI ID</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </SmoothWrapper>
                        </div>
                    </FadeIn>
                </div>

                {/* UPCOMING SESSIONS LIST */}
                <FadeIn delay={0.4}>
                    <div className={getCardStyle("sessions")}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-10">
                            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Upcoming Sessions</h3>
                            <Link href="/dashboard/sessions" className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all w-fit">
                                View Schedule <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        </div>
                        <div className="space-y-4 sm:space-y-5">
                            {upcomingSessions.map((session, index) => (
                                <div key={session.id}
                                    className="flex flex-col gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 group cursor-pointer animate-in fade-in slide-in-from-bottom-4"
                                    style={{ animationDelay: `${index * 100}ms` }}>
                                    <div className="flex items-center gap-3 sm:gap-5">
                                        <Image src={session.avatar} alt={session.student} width={56} height={56} className="w-11 h-11 sm:w-14 sm:h-14 rounded-full ring-2 sm:ring-4 ring-white shadow-sm" unoptimized />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-indigo-600 transition-colors truncate">{session.student}</h4>
                                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 truncate">{session.topic}</p>
                                        </div>
                                        <span className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide border shrink-0 ${session.status === "Confirmed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
                                            {session.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6">
                                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-slate-600 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-100 shadow-sm">
                                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />{session.time}
                                        </div>
                                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-slate-600 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-100 shadow-sm">
                                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />{session.duration}
                                        </div>
                                        <button type="button" className="hidden md:block ml-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95">Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>

            </div>
        </div>
    );
}
