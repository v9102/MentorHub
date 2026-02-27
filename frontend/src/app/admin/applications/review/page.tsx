"use client";

import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    FileText,
    Users,
    User,
    BarChart2,
    Settings,
    MapPin,
    Briefcase,
    ShieldCheck,
    Brain,
    Menu,
    X,
    Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";

// Types corresponding to MongoDB User Model
interface MentorProfile {
    basicInfo: {
        gender?: string;
        currentOrganisation?: string;
        currentRole?: string;
        workExperience?: number;
        profilePhoto?: string;
    };
    expertise?: {
        subjects?: string[];
    };
    bio?: string;
    languages?: string[];
    verification?: {
        isVerified: boolean;
        applicationStatus?: string;
        idType?: string;
        idNumber?: string;
    };
}

interface Application {
    _id: string;
    name: string;
    email: string;
    imageUrl?: string;
    mentorProfile?: MentorProfile;
    createdAt?: string;
}

export default function AdminReviewApplication() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [applications, setApplications] = useState<Application[]>([]);
    const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/mentor-applications");
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.data) {
                    setApplications(data.data);
                    if (data.data.length > 0) {
                        setSelectedMentorId(data.data[0]._id);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedMentorId) return;
        setIsActionLoading(true);
        try {
            const res = await fetch(`/api/admin/mentor/${selectedMentorId}/verify`, {
                method: "PATCH",
            });
            if (res.ok) {
                // Remove the approved mentor from the list
                const updatedList = applications.filter((app) => app._id !== selectedMentorId);
                setApplications(updatedList);
                if (updatedList.length > 0) {
                    setSelectedMentorId(updatedList[0]._id);
                } else {
                    setSelectedMentorId(null);
                }
            }
        } catch (error) {
            console.error("Failed to approve mentor", error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedMentorId) return;
        setIsActionLoading(true);
        try {
            const res = await fetch(`/api/admin/mentor/${selectedMentorId}/reject`, {
                method: "PATCH",
            });
            if (res.ok) {
                const updatedList = applications.filter((app) => app._id !== selectedMentorId);
                setApplications(updatedList);
                if (updatedList.length > 0) {
                    setSelectedMentorId(updatedList[0]._id);
                } else {
                    setSelectedMentorId(null);
                }
            }
        } catch (error) {
            console.error("Failed to reject mentor", error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const selectedMentor = applications.find((app) => app._id === selectedMentorId);

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-body">
            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:flex flex-shrink-0 ${isMenuOpen ? "translate-x-0 flex" : "-translate-x-full hidden md:flex"}`}>
                <div className="flex items-center justify-between gap-3 p-6">
                    <Link href="/" className="flex items-center -ml-2" onClick={() => setIsMenuOpen(false)}>
                        <div className="w-12 h-12 relative -mt-2">
                            <Image
                                src="/logo.png"
                                alt="MentoMania Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-bold text-2xl text-slate-900 dark:text-white -ml-1.5 pt-1">
                            ento<span className="text-blue-600">Mania</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="md:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <nav className="flex-1 space-y-1.5 px-4 py-4 overflow-y-auto">
                    <Link
                        href="#"
                        className="flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3 font-semibold text-primary"
                    >
                        <FileText className="h-5 w-5" />
                        <span>Applications</span>
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    >
                        <Users className="h-5 w-5" />
                        <span>Mentors</span>
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    >
                        <User className="h-5 w-5" />
                        <span>Mentees</span>
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    >
                        <BarChart2 className="h-5 w-5" />
                        <span>Reports</span>
                    </Link>
                    <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <Link
                            href="#"
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                        >
                            <Settings className="h-5 w-5" />
                            <span>Settings</span>
                        </Link>
                    </div>
                </nav>
                <div className="border-t border-slate-100 p-4 dark:border-slate-800">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2 dark:bg-slate-800/50">
                        <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-300 relative">
                            <Image
                                fill
                                className="object-cover"
                                alt="Admin user profile avatar"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6XgoGQu254Jy-VUG_P0DCybXCoxIUah4trPwNnZ8xm8XngQe6Adk4afIzB6yRs97ursiA5qHgNh2JSTjLzuvvXWi7L_CiZ457XOtb9mgiumDCm5dt3l2uCG2yAcw1ejiBIBL8UAWtcaS9NXPCQ2kkQX8earj4qp-HzBpkqITDWfDCF9mzN1CM6GHpxafAMciMX_f_HcTJonSx3zOvYuqaFMWDXL_3RxqWlDvFMTY97-MGIVA-2xy2mAQqyOtU_l2xEVEXYTo_EJC7"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">Alex Rivera</p>
                            <p className="truncate text-xs text-slate-500">Super Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex min-w-0 flex-1 flex-col bg-slate-50 dark:bg-slate-900/50 w-full md:w-auto h-screen overflow-hidden">
                {/* Header Navbar */}
                <header className="flex-shrink-0 z-30 border-b border-slate-200 bg-white/80 px-3 sm:px-6 md:px-8 py-2.5 sm:py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0 transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h2 className="font-display text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white truncate">Mentor Applications</h2>
                    </div>
                </header>

                {/* Master-Detail Split View */}
                <div className="flex flex-1 overflow-hidden h-full">

                    {/* LEFT PANEL: Applications List */}
                    <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 flex flex-col h-full z-10">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 hidden md:block">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200">Pending Review ({applications.length})</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {isLoading ? (
                                <div className="flex h-full items-center justify-center p-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : applications.length === 0 ? (
                                <div className="p-8 text-center text-sm text-slate-500">
                                    No pending applications to review.
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {applications.map((app) => (
                                        <button
                                            key={app._id}
                                            onClick={() => setSelectedMentorId(app._id)}
                                            className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${selectedMentorId === app._id ? "bg-primary/5 dark:bg-primary/10 border-l-4 border-primary" : "border-l-4 border-transparent"
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-slate-200">
                                                    {(app.mentorProfile?.basicInfo?.profilePhoto || app.imageUrl) ? (
                                                        <Image
                                                            src={app.mentorProfile?.basicInfo?.profilePhoto || app.imageUrl || ""}
                                                            alt={app.name || "Mentor"}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <User className="h-full w-full p-2 text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className="font-bold text-sm text-slate-900 dark:text-white truncate pr-2">{app.name || "Unknown Mentor"}</p>
                                                        <span className="inline-block flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 uppercase">
                                                            Pending
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 truncate mb-1">
                                                        {app.mentorProfile?.basicInfo?.currentRole || "Mentor"} at {app.mentorProfile?.basicInfo?.currentOrganisation || "Company"}
                                                    </p>
                                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">
                                                        {app.mentorProfile?.expertise?.subjects?.join(", ") || "General Expertise"}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL: Detail View */}
                    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 relative hidden md:block">
                        {isLoading ? (
                            <div className="flex h-full items-center justify-center">
                                <Loader2 className="h-10 w-10 animate-spin text-slate-300" />
                            </div>
                        ) : !selectedMentor ? (
                            <div className="flex h-full flex-col items-center justify-center text-slate-500">
                                <FileText className="h-16 w-16 mb-4 text-slate-300 dark:text-slate-700" />
                                <p className="text-lg font-medium">Select an application to review</p>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col">
                                {/* Detail Header Actions */}
                                <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-4">
                                    <h3 className="font-bold text-lg">Application Details</h3>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={handleReject}
                                            disabled={isActionLoading}
                                            className="rounded-xl border border-red-200 bg-white px-5 py-2 text-sm font-bold text-red-600 shadow-sm transition-all hover:bg-red-50 focus:ring-4 focus:ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Deny
                                        </button>
                                        <button
                                            onClick={handleApprove}
                                            disabled={isActionLoading}
                                            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary/90 active:translate-y-0 disabled:opacity-50 disabled:-translate-y-0 disabled:cursor-not-allowed"
                                        >
                                            {isActionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                            Approve Application
                                        </button>
                                    </div>
                                </div>

                                {/* Detail Content */}
                                <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
                                    {/* Profile Header Card */}
                                    <section className="rounded-2xl border border-black/[0.04] bg-white p-6 md:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] dark:border-white/[0.04] dark:bg-slate-900">
                                        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                                            <div className="relative flex-shrink-0">
                                                <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-2xl border-4 text-slate-200 border-white shadow-xl dark:border-slate-800 bg-slate-100 overflow-hidden">
                                                    {(selectedMentor.mentorProfile?.basicInfo?.profilePhoto || selectedMentor.imageUrl) ? (
                                                        <Image
                                                            className="object-cover"
                                                            fill
                                                            alt={selectedMentor.name || "Mentor portrait"}
                                                            src={selectedMentor.mentorProfile?.basicInfo?.profilePhoto || selectedMentor.imageUrl || ""}
                                                        />
                                                    ) : (
                                                        <User className="h-full w-full p-4 text-slate-300" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="mb-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                                    {selectedMentor.name}
                                                </h3>
                                                <p className="mb-3 text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300">
                                                    {selectedMentor.mentorProfile?.basicInfo?.currentRole} at {selectedMentor.mentorProfile?.basicInfo?.currentOrganisation}
                                                </p>
                                                <div className="flex flex-col sm:flex-row flex-wrap gap-4 text-slate-500 text-sm">
                                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                                        <Briefcase className="h-4 w-4 flex-shrink-0" />
                                                        <span>{selectedMentor.mentorProfile?.basicInfo?.workExperience || 0}+ Years Experience</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Left Column: Details */}
                                        <div className="lg:col-span-2 space-y-6">
                                            {/* Expertise & Bio */}
                                            <div className="rounded-2xl border border-black/[0.04] bg-white p-6 shadow-[0_2px_12px_rgb(0,0,0,0.03)] dark:border-white/[0.04] dark:bg-slate-900">
                                                <h4 className="mb-6 flex items-center gap-2 font-display text-lg font-bold">
                                                    <Brain className="h-5 w-5 text-primary flex-shrink-0" />
                                                    Expertise &amp; Experience
                                                </h4>
                                                <div className="space-y-6">
                                                    <div>
                                                        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                                                            Primary Expertise
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedMentor.mentorProfile?.expertise?.subjects?.map((sub, i) => (
                                                                <span key={i} className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                                    {sub}
                                                                </span>
                                                            )) || (
                                                                    <span className="text-sm text-slate-500">No expertise listed</span>
                                                                )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                                                            Biography
                                                        </p>
                                                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                                                            {selectedMentor.mentorProfile?.bio || "No biography provided."}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Verification Section */}
                                            <div className="rounded-2xl border border-black/[0.04] bg-white p-6 shadow-[0_2px_12px_rgb(0,0,0,0.03)] dark:border-white/[0.04] dark:bg-slate-900">
                                                <h4 className="mb-6 flex items-center gap-2 font-display text-lg font-bold">
                                                    <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                                                    Verification Details
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">ID Type</span>
                                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{selectedMentor.mentorProfile?.verification?.idType?.replace("_", " ") || "Not specified"}</p>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">ID Number</span>
                                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedMentor.mentorProfile?.verification?.idNumber || "Not provided"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Basic Info */}
                                        <div className="space-y-6">
                                            <div className="rounded-2xl border border-black/[0.04] bg-white p-6 shadow-[0_2px_12px_rgb(0,0,0,0.03)] dark:border-white/[0.04] dark:bg-slate-900">
                                                <h4 className="mb-5 font-display text-lg font-bold">Basic Information</h4>
                                                <div className="space-y-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                                            Email Address
                                                        </span>
                                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 break-all">{selectedMentor.email}</p>
                                                    </div>
                                                    <div className="flex flex-col gap-1 border-t border-slate-50 pt-4 dark:border-slate-800">
                                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Gender</span>
                                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{selectedMentor.mentorProfile?.basicInfo?.gender || "Not specified"}</p>
                                                    </div>
                                                    <div className="flex flex-col gap-1 border-t border-slate-50 pt-4 dark:border-slate-800">
                                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Languages</span>
                                                        <div className="mt-1 flex flex-wrap gap-1.5">
                                                            {selectedMentor.mentorProfile?.languages?.map((lang, i) => (
                                                                <span key={i} className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold dark:bg-slate-800 uppercase">
                                                                    {lang}
                                                                </span>
                                                            )) || <span className="text-sm text-slate-500">None specified</span>}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-1 border-t border-slate-50 pt-4 dark:border-slate-800">
                                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Joined</span>
                                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                            {selectedMentor.createdAt ? new Date(selectedMentor.createdAt).toLocaleDateString() : "Unknown"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Scroll padding */}
                                    <div className="h-10"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

