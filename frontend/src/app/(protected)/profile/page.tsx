"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    User,
    Mail,
    Calendar,
    Clock,
    ArrowRight,
    BookOpen,
    Loader2,
} from "lucide-react";

export default function ProfilePage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    // Redirect mentors to mentor profile
    useEffect(() => {
        if (isLoaded && user?.publicMetadata?.role === "mentor") {
            router.push("/mentor/profile");
        }
    }, [isLoaded, user, router]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-600">Please sign in to view your profile.</p>
            </div>
        );
    }

    const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
                    <p className="text-slate-600 mt-1">Manage your account information</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Cover */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400" />

                    {/* Profile Info */}
                    <div className="px-6 pb-6">
                        {/* Avatar */}
                        <div className="-mt-16 mb-4">
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                                <Image
                                    src={user.imageUrl ?? "https://api.dicebear.com/9.x/toon-head/svg?seed=User"}
                                    alt={fullName}
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                />
                            </div>
                        </div>

                        {/* Name & Email */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">{fullName}</h2>
                            <p className="text-slate-500 flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4" />
                                {user.primaryEmailAddress?.emailAddress}
                            </p>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Account Type</p>
                                    <p className="font-semibold text-slate-900">Student</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Member Since</p>
                                    <p className="font-semibold text-slate-900">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            year: "numeric",
                                        }) : "Recently"}
                                    </p>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Become a Mentor CTA */}
                <div className="mt-6 p-6 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl text-white">
                    <h3 className="text-xl font-bold mb-2">Become a Mentor</h3>
                    <p className="text-blue-100 mb-4">
                        Share your expertise and help students achieve their goals. Join our mentor community today.
                    </p>
                    <Link
                        href="/onboarding/profile/basic-info"
                        className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                    >
                        Apply Now
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
