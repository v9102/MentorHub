"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    User, Mail, ChevronDown, Camera, Pen, Check, Share2,
    Calendar, Clock, Trash2, Plus, ArrowUpRight, Bell,
    Shield, Smartphone, Briefcase, QrCode, Wallet,
    MapPin, GraduationCap, X
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import QRCode from "react-qr-code";
import UpcomingMeetingBanner from "@/shared/ui/UpcomingMeetingBanner";
import { useUpcomingSessions } from "@/shared/lib/hooks/useDashboard";


const NotificationPopup = ({ message }: { message: string }) => (
    <div className="absolute top-full right-0 mt-3 w-max max-w-[240px] bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-lg z-50 border border-slate-800">
        {message}
        <div className="absolute -top-1.5 right-5 w-3 h-3 bg-slate-900 rotate-45 border-l border-t border-slate-800" />
    </div>
);

const SmoothWrapper = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>
        {children}
    </div>
);

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
                    } rounded-xl sm:rounded-2xl text-sm sm:text-[15px] font-semibold text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:outline-none transition-colors shadow-sm`}
            />
            {Icon && <Icon className={`absolute left-3 sm:left-4 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 ${error ? "text-red-400" : "text-slate-400 group-hover:text-slate-500 group-focus-within:text-indigo-500"}`} />}
        </div>
        {error && <p className="absolute -bottom-5 right-0 text-red-500 text-[10px] font-bold">{error}</p>}
    </div>
);

const AVATAR_ASSETS: Record<string, string> = {
    Male: "https://api.dicebear.com/9.x/toon-head/svg?seed=Vivian",
    Female: "https://api.dicebear.com/9.x/toon-head/svg?seed=Oliver",
    Transgender: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jack",
    Bisexual: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aiden",
};


interface MentorState {
    name: string; title: string; email: string; phone: string;
    location: string; experience: string; gender: string;
    about: string; upiId: string; accountNumber: string;
    bankName: string; ifsc: string;

    currentOrganisation: string;
    industry: string;
    workExperience: string;
    highestQualification: string;
    college: string;
    branch: string;
    passingYear: string;
    subjects: string;
    specializations: string;
    pricePerSession: string;
    isVerified: boolean;
    verificationIdType: string;

    availability: Array<{ id: number; day: string; startTime: string; endTime: string }>;
    examDetails: Array<any>;
}

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

export default function EditProfile() {
    const { user } = useUser();

    const [mentor, setMentor] = useState<MentorState>({
        name: user?.fullName ?? "",
        title: (user?.publicMetadata?.title as string) ?? "",
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        phone: (user?.publicMetadata?.phone as string) ?? "",
        location: (user?.publicMetadata?.location as string) ?? "",
        experience: (user?.publicMetadata?.experience as string) ?? "",
        gender: (user?.publicMetadata?.gender as string) ?? "Male",
        about: (user?.publicMetadata?.about as string) ?? "",
        upiId: (user?.publicMetadata?.upiId as string) ?? "",
        accountNumber: (user?.publicMetadata?.accountNumber as string) ?? "",
        bankName: (user?.publicMetadata?.bankName as string) ?? "",
        ifsc: (user?.publicMetadata?.ifsc as string) ?? "",
        currentOrganisation: "", industry: "", workExperience: "",
        highestQualification: "", college: "", branch: "", passingYear: "",
        subjects: "", specializations: "", pricePerSession: "",
        isVerified: false, verificationIdType: "",
        availability: [],
        examDetails: []
    });
    const [profileImageUrl, setProfileImageUrl] = useState<string>(user?.imageUrl ?? AVATAR_ASSETS.Male);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    const { sessions: rawUpcomingSessions } = useUpcomingSessions();

    const upcomingSessions = useMemo(() => {
        return rawUpcomingSessions.slice(0, 3).map((session, index) => {
            const sessionDate = new Date(session.date);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            let timeLabel = "";
            if (sessionDate.toDateString() === today.toDateString()) {
                timeLabel = `Today, ${session.startTime}`;
            } else if (sessionDate.toDateString() === tomorrow.toDateString()) {
                timeLabel = `Tomorrow, ${session.startTime}`;
            } else {
                timeLabel = `${sessionDate.toLocaleDateString("en-US", { weekday: "short" })}, ${session.startTime}`;
            }

            return {
                id: session.bookingId || index + 1,
                student: session.student.name,
                time: timeLabel,
                topic: `${session.duration} min session`,
                duration: `${session.duration} min`,
                status: session.status === "confirmed" ? "Confirmed" : "Pending",
                avatar: session.student.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.student.name)}&background=e0e7ff&color=4f46e5`,
            };
        });
    }, [rawUpcomingSessions]);

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
    const [showAvailabilityPopup, setShowAvailabilityPopup] = useState(false);

    const countries = [
        { code: "+966", label: "SA" }, { code: "+1", label: "US" },
        { code: "+44", label: "UK" }, { code: "+91", label: "IN" }, { code: "+971", label: "AE" },
    ];

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
        fetchMentorProfile();
    }, []);

    useEffect(() => {
        if (!isLoadingProfile && mentor.availability.length === 0) {
            setShowAvailabilityPopup(true);
        }
    }, [isLoadingProfile, mentor.availability.length]);

    const fetchMentorProfile = async () => {
        try {
            const res = await fetch("/api/dashboard/profile");

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message || "Failed to fetch profile data");
            }

            if (data.mentor) {
                const profile = data.mentor.mentorProfile || {};
                const basic = profile.basicInfo || {};
                const prof = profile.professionalInfo || {};
                const exp = profile.expertise || {};
                const ver = profile.verification || {};
                const prc = profile.pricing || {};
                const exams = profile.examDetails || [];

                // Validate and sanitize availability data
                const availabilityData = profile.availability || [];
                const validatedAvailability = availabilityData.map((day: any) => ({
                    _id: day._id || day.id,
                    day: day.day || "Unknown",
                    slots: Array.isArray(day.slots) ? day.slots.filter((slot: any) =>
                        slot.startTime && slot.endTime && slot.sessionDuration
                    ) : []
                })).filter((day: any) => day.slots.length > 0);

                setMentor(prev => ({
                    ...prev,
                    name: data.mentor.name || prev.name,
                    email: data.mentor.email || prev.email,
                    gender: basic.gender || prev.gender,
                    currentOrganisation: basic.currentOrganisation || "",
                    industry: basic.industry || "",
                    title: basic.currentRole || prev.title,
                    workExperience: basic.workExperience?.toString() || "",
                    highestQualification: prof.highestQualification || "",
                    college: prof.college || "",
                    branch: prof.branch || "",
                    passingYear: prof.passingYear?.toString() || "",
                    subjects: exp.subjects?.join(", ") || "",
                    specializations: exp.specializations || "",
                    pricePerSession: prc.pricePerSession?.toString() || "",
                    isVerified: ver.isVerified || false,
                    verificationIdType: ver.idType || "",
                    about: profile.bio || prev.about,
                    availability: validatedAvailability,
                    examDetails: exams
                }));

                if (basic.profilePhoto || data.mentor.imageUrl) {
                    setProfileImageUrl(basic.profilePhoto || data.mentor.imageUrl);
                }
            }
        } catch (error) {
            console.error("Error fetching mentor profile:", error);
            // Optionally show user-friendly error message
            showNotification("error", "Failed to load profile data. Please refresh the page.");
        } finally {
            setIsLoadingProfile(false);
        }
    };

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
        ? `${window.location.origin}/mentors/${user?.id || "preview"}`
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
        const base = "rounded-xl border border-gray-200 p-6 lg:p-8 transition-colors relative bg-white";
        if (isThisSectionActive) return `${base} border-blue-300 bg-blue-50`;
        if (isBlurState) return `${base} opacity-60`;
        return `${base} shadow-sm hover:shadow-md hover:border-blue-200`;
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-24">
            <UpcomingMeetingBanner />

            {/* Empty Availability Action Popup */}
            {showAvailabilityPopup && (
                <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] w-[calc(100%-3rem)] sm:w-80 bg-white rounded-2xl shadow-2xl border border-indigo-100 p-5 animate-in slide-in-from-bottom-8 fade-in duration-500">
                    <button onClick={() => setShowAvailabilityPopup(false)} className="absolute top-3 right-3 p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-slate-900 font-bold text-sm mb-1">Next steps for you</h4>
                            <p className="text-slate-500 text-xs mb-3 leading-relaxed">You haven't added any time slots yet. Set up your schedule to start receiving student bookings.</p>
                            <Link href="/mentor/availability" className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
                                <Plus className="w-3.5 h-3.5" /> Add time slots
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* TOP HEADER */}
            <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between z-10">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Your Profile</h1>
                        <span className="text-sm sm:text-[15px] font-medium text-slate-500 mt-1 sm:mt-1.5">Manage your public presence and settings</span>
                    </div>
                    <Link href="/mentor/preview" className="flex sm:hidden lg:flex items-center gap-2 text-xs sm:text-[13px] font-bold text-indigo-600 hover:text-indigo-700 bg-white hover:bg-indigo-50 px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl transition-colors border border-slate-200 shadow-sm hover:shadow-md w-fit mt-2 sm:mt-0 sm:ml-6">
                        Preview Profile <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </Link>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                    <button onClick={() => showNotification("notifs", "No new notifications")} className="relative group p-3 sm:p-3.5 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-colors">
                        <Bell className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" strokeWidth={2.5} />
                        <span className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        {notification?.id === "notifs" && <NotificationPopup message={notification.message} />}
                    </button>
                </div>
            </div>

            <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6 lg:space-y-10 z-10">

                {/* HERO PROFILE CARD */}
                <div className={getCardStyle("personal")}>
                    {/* Banner Area */}
                    <div className="h-32 w-[calc(100%+3rem)] -mx-6 -mt-6 relative overflow-hidden mb-0 bg-gray-100 rounded-t-xl">
                        {bannerImageUrl ? (
                            <Image src={bannerImageUrl} alt="Banner" fill className="object-cover z-0" unoptimized />
                        ) : (
                            <div className="absolute inset-0 w-full h-full bg-blue-600" />
                        )}
                    </div>

                    {/* Profile Content */}
                    <div className="relative">
                        <div className="flex flex-col items-center gap-4 sm:gap-6 mb-4 sm:mb-5 relative text-center lg:flex-row lg:items-start lg:text-left">

                            {/* Avatar Section */}
                            <div className="relative -mt-14 sm:-mt-16 z-30 shrink-0 group/avatar">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full p-1 sm:p-1.5 bg-white shadow-lg hover:shadow-xl transition-shadow">
                                    <label className="block w-full h-full rounded-full overflow-hidden relative cursor-pointer bg-slate-50 ring-1 ring-slate-100">
                                        <Image key={profileImageUrl} src={profileImageUrl} alt="Profile" width={144} height={144} className="w-full h-full object-cover" unoptimized />
                                        <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                            <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-md" />
                                        </div>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                                    </label>
                                </div>

                                {/* Share Actions */}
                                <div className="absolute -bottom-2 sm:-bottom-3 -right-2 sm:-right-3 flex gap-2">
                                    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative">
                                        <button onClick={handleCopyLink} className="p-2.5 sm:p-3.5 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-full shadow-lg border border-slate-100 transition-colors">
                                            {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" /> : <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* QR Popup */}
                                <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                                    className={`hidden lg:block absolute top-0 left-[125%] z-20 transition-all duration-300 origin-left ${isQRVisible ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                                    <div className="absolute w-16 h-full -left-12 top-0" />
                                    <div className="bg-white p-5 rounded-3xl shadow-xl border border-slate-100 w-[180px] flex flex-col items-center">
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
                            <div className={`flex-1 w-full lg:pt-2 transition-all duration-300 ${isQRVisible ? "lg:pl-56" : ""}`}>
                                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start w-full gap-4 lg:gap-0">
                                    <div className="flex-1 w-full">
                                        <SmoothWrapper>
                                            {activeSection === "personal" ? (
                                                <div key="edit-form" className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl">
                                                    <InputGroup label="Full Name" value={mentor.name} onChange={(e) => updateField("name", e.target.value)} error={errors.name} success={successAnimations.name} icon={User} placeholder="John Doe" />
                                                    <InputGroup label="Role Title" value={mentor.title} onChange={(e) => updateField("title", e.target.value)} icon={Briefcase} placeholder="Senior Developer" />
                                                    <InputGroup label="Email Address" value={mentor.email} onChange={(e) => updateField("email", e.target.value)} error={errors.email} success={successAnimations.email} icon={Mail} placeholder="john@example.com" />

                                                    <div className="relative group">
                                                        <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-2 ml-1">Phone</label>
                                                        <div className="flex bg-white border border-slate-200 rounded-xl sm:rounded-2xl focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-500 transition-colors shadow-sm">
                                                            <button onClick={() => setIsPhoneDropdownOpen(!isPhoneDropdownOpen)}
                                                                className="px-3 sm:px-4 border-r border-slate-200 flex items-center gap-1.5 sm:gap-2 hover:bg-slate-50 rounded-l-xl sm:rounded-l-2xl transition-colors text-xs sm:text-sm font-bold text-slate-700">
                                                                {selectedCountry.code} <ChevronDown className="w-3 h-3 text-slate-400" />
                                                            </button>
                                                            <input type="tel" value={mentor.phone} onChange={(e) => updateField("phone", e.target.value)}
                                                                className="w-full bg-transparent px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-[15px] font-semibold outline-none placeholder:text-slate-400 rounded-r-xl sm:rounded-r-2xl" placeholder="123 456 789" />
                                                            <Smartphone className="absolute right-3 sm:right-4 top-[calc(50%+0.5rem)] -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
                                                        </div>
                                                        {isPhoneDropdownOpen && (
                                                            <div className="absolute top-full left-0 mt-2 w-32 sm:w-36 bg-white border border-slate-100 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden z-50 py-1">
                                                                {countries.map((c) => (
                                                                    <button key={c.code} onClick={() => { setSelectedCountry(c); setIsPhoneDropdownOpen(false); }}
                                                                        className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-2 hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700">
                                                                        {c.label} ({c.code})
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <InputGroup label="Location" value={mentor.location} onChange={(e) => updateField("location", e.target.value)} icon={MapPin} placeholder="San Francisco, CA" />
                                                    <InputGroup label="Experience" value={mentor.experience} onChange={(e) => updateField("experience", e.target.value)} icon={GraduationCap} placeholder="3rd Year" />

                                                </div>
                                            ) : (
                                                <div key="view-info" className="space-y-1 sm:space-y-2">
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
                                        className={`p-2.5 sm:p-3 lg:p-3.5 rounded-full transition-colors shadow-sm border lg:ml-6 ${activeSection === "personal" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md"}`}>
                                        {activeSection === "personal" ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Pen className="w-4 h-4 sm:w-5 sm:h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">About Me</h3>
                                <button onClick={() => toggleSection("bio")} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 sm:px-4 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg sm:rounded-xl transition-colors w-fit">
                                    {activeSection === "bio" ? "Done" : "Edit Bio"}
                                </button>
                            </div>
                            <SmoothWrapper>
                                {activeSection === "bio" ? (
                                    <textarea value={mentor.about} onChange={(e) => updateField("about", e.target.value)} rows={4}
                                        className="w-full p-4 sm:p-5 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-slate-800 text-sm sm:text-[15px] leading-relaxed focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none transition-colors shadow-sm"
                                        placeholder="Tell your students a bit about yourself..." />
                                ) : (
                                    <p className="text-slate-600 leading-relaxed max-w-4xl text-sm sm:text-[16px]">
                                        {mentor.about || <span className="text-slate-400 italic">Complete your professional profile by adding a brief introduction about your expertise and mentoring approach.</span>}
                                    </p>
                                )}
                            </SmoothWrapper>
                        </div>
                    </div>
                </div>

                {/* 2-COLUMN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-10">

                    {/* Availability Slots */}
                    <div className={`${getCardStyle("slots")} h-full`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Calendar className="w-6 h-6" strokeWidth={2} /></div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Availability</h3>
                            </div>
                            <Link href="/mentor/availability"
                                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-colors bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 w-fit">
                                Manage Slots
                            </Link>
                        </div>
                        <SmoothWrapper>
                            <div className="space-y-4 mb-6">
                                {mentor.availability.map((dayObj: any) => (
                                    <div key={dayObj._id || dayObj.day} className="group relative flex flex-col items-start justify-start p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-colors">
                                        <div className="flex items-center gap-3 mb-3 w-full">
                                            <div className="w-1.5 h-6 rounded-full bg-blue-200 group-hover:bg-blue-500 transition-colors" />
                                            <p className="font-semibold text-gray-900 text-base">{dayObj.day}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pl-5 w-full">
                                            {dayObj.slots && dayObj.slots.map((slot: any, idx: number) => (
                                                <div key={idx} className="text-sm font-medium text-gray-600 flex items-center gap-2 bg-white px-3 py-2 rounded-md border border-gray-200 shadow-sm">
                                                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                                                    {slot.startTime} - {slot.endTime}
                                                    <span className="text-gray-300 mx-1">|</span>
                                                    <span className="text-blue-600 font-semibold">{slot.sessionDuration}m</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {mentor.availability.length === 0 && (
                                    <div className="flex flex-col items-center justify-center text-center py-10 sm:py-12 border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl sm:rounded-3xl">
                                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-slate-900 font-bold text-base sm:text-lg mb-1">Next steps for you</h4>
                                        <p className="text-slate-500 text-sm mb-5 max-w-xs">Set up your schedule so students can start booking sessions with you.</p>
                                        <Link href="/mentor/availability" className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95">
                                            <Plus className="w-4 h-4" /> Add time slots
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </SmoothWrapper>
                    </div>

                    {/* Payment (UPI) Section */}
                    <div className={`${getCardStyle("payment")} h-full`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-green-50 text-green-600 rounded-xl"><Wallet className="w-7 h-7" strokeWidth={2} /></div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Payments</h3>
                            </div>
                            <button onClick={() => toggleSection("payment")} className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-colors w-fit ${activeSection === "payment" ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                                {activeSection === "payment" ? "Save UPI" : "Edit UPI"}
                            </button>
                        </div>
                        <SmoothWrapper>
                            {activeSection === "payment" ? (
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <QrCode className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-green-800 mb-1">Quick Setup</h4>
                                                <p className="text-green-700 text-sm leading-relaxed">Add your UPI ID to receive instant payments. A QR code will be generated automatically for easy transactions.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <h5 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <Smartphone className="w-4 h-4 text-blue-500" />
                                            Payment Details
                                        </h5>
                                        <InputGroup
                                            label="UPI ID (Virtual Payment Address)"
                                            value={mentor.upiId}
                                            onChange={(e) => updateField("upiId", e.target.value)}
                                            error={errors.upiId}
                                            success={successAnimations.upiId}
                                            icon={Smartphone}
                                            placeholder="yourname@paytm"
                                        />
                                    </div>

                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <h5 className="font-semibold text-gray-600 mb-1 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-gray-500" />
                                            Bank Details
                                        </h5>
                                        <p className="text-sm text-gray-500 mb-4">Optional - for additional verification</p>

                                        <div className="space-y-4">
                                            <InputGroup
                                                label="Account Number"
                                                value={mentor.accountNumber}
                                                onChange={(e) => updateField("accountNumber", e.target.value)}
                                                placeholder="1234567890"
                                            />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <InputGroup
                                                    label="Bank Name"
                                                    value={mentor.bankName}
                                                    onChange={(e) => updateField("bankName", e.target.value)}
                                                    placeholder="State Bank of India"
                                                />
                                                <InputGroup
                                                    label="IFSC Code"
                                                    value={mentor.ifsc}
                                                    onChange={(e) => updateField("ifsc", e.target.value)}
                                                    placeholder="SBIN0001234"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-green-600 to-emerald-700 text-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex flex-col justify-between h-full z-10 w-full text-center sm:text-left">
                                        <div className="flex flex-col items-center sm:items-start">
                                            <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm w-fit rounded-lg border border-white/30 mb-4">
                                                <span className="text-xs font-bold tracking-wide uppercase text-green-100">UPI Payment</span>
                                            </div>
                                            <p className="text-green-100/80 text-xs font-medium uppercase tracking-wide mb-2">Payment Address</p>
                                            <p className="text-2xl sm:text-3xl font-mono font-bold tracking-wide text-white truncate w-full max-w-[250px] sm:max-w-none">
                                                {mentor.upiId || "Add UPI ID"}
                                            </p>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-green-100 bg-green-800/40 px-3 py-2 rounded-lg w-fit backdrop-blur-sm border border-green-600/30 mt-4">
                                            <Shield className="w-3.5 h-3.5" />
                                            {mentor.bankName ? `Linked: ${mentor.bankName}` : "Secure Payment Gateway"}
                                        </div>
                                    </div>

                                    {/* QR code */}
                                    <div className="relative shrink-0 hidden sm:block">
                                        <div className="bg-white p-3 rounded-xl shadow-md">
                                            <div className="w-[120px] h-[120px] bg-white rounded-lg flex items-center justify-center p-2">
                                                {mentor.upiId ? (
                                                    <QRCode
                                                        value={`upi://pay?pa=${encodeURIComponent(mentor.upiId)}&pn=${encodeURIComponent(mentor.name || 'Mentor')}&cu=INR`}
                                                        size={100}
                                                        level="M"
                                                        bgColor="#ffffff"
                                                        fgColor="#059669"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                                        <QrCode className="w-10 h-10 mb-1" />
                                                        <span className="text-[9px] font-medium text-center">Add UPI ID</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </SmoothWrapper>
                    </div>
                </div>

                {/* UPCOMING SESSIONS LIST */}
                <div className={getCardStyle("sessions")}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-10">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Upcoming Sessions</h3>
                        <Link href="/mentor/sessions" className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-colors w-fit">
                            View Schedule <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Link>
                    </div>
                    <div className="space-y-4 sm:space-y-5">
                        {upcomingSessions.map((session: any) => (
                            <div key={session.id}
                                className="flex flex-col gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all group cursor-pointer">
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
                                    <button type="button" className="hidden md:block ml-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors shadow-sm">Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
