"use client";

import { useMentorOnboarding } from "@/shared/lib/context/MentorOnboardingContext";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Edit, 
  Eye, 
  Clock,
  BookOpen,
  Star,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

export default function MentorDashboardPage() {
  const { data } = useMentorOnboarding();

  const firstName = data.basicInfo?.firstName ?? "Mentor";
  const lastName = data.basicInfo?.lastName ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your profile, availability, and connect with students
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<BookOpen className="w-6 h-6" />}
            label="Total Sessions"
            value="0"
            color="blue"
          />
          <StatCard
            icon={<Star className="w-6 h-6" />}
            label="Average Rating"
            value="New"
            color="orange"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="This Month"
            value="₹0"
            color="green"
          />
        </div>

        {/* Profile Overview Card */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white text-3xl font-bold">
                {firstName.charAt(0)}{lastName.charAt(0)}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{fullName}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>{data.professionalInfo?.college ?? "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{data.professionalInfo?.branch ?? "Not specified"}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/mentors/profile-setup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Public Profile
                </Link>
                <Link
                  href="/onboarding/profile/basic-info"
                  className="px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-300 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              icon={<Edit className="w-6 h-6" />}
              title="Edit Profile"
              description="Update your information"
              href="/onboarding/profile/basic-info"
              color="blue"
            />
            <QuickActionCard
              icon={<Calendar className="w-6 h-6" />}
              title="Manage Availability"
              description="Set your schedule"
              href="/onboarding/profile/availability"
              color="green"
            />
            <QuickActionCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Manage Pricing"
              description="Update session rates"
              href="/onboarding/profile/pricing"
              color="orange"
            />
            <QuickActionCard
              icon={<BookOpen className="w-6 h-6" />}
              title="View Sessions"
              description="See your bookings"
              href="#"
              color="purple"
            />
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Basic Information */}
          <InfoCard title="Basic Information" icon={<User className="w-5 h-5" />}>
            <InfoRow label="Full Name" value={fullName} />
            <InfoRow 
              label="Gender" 
              value={data.basicInfo?.gender ? capitalize(data.basicInfo.gender) : "Not specified"} 
            />
          </InfoCard>

          {/* Academic Background */}
          <InfoCard title="Academic Background" icon={<GraduationCap className="w-5 h-5" />}>
            <InfoRow label="College" value={data.professionalInfo?.college ?? "Not specified"} />
            <InfoRow label="Branch" value={data.professionalInfo?.branch ?? "Not specified"} />
            <InfoRow 
              label="Passing Year" 
              value={data.professionalInfo?.passingYear?.toString() ?? "Not specified"} 
            />
          </InfoCard>

          {/* Expertise */}
          <InfoCard title="Expertise & Subjects" icon={<Briefcase className="w-5 h-5" />}>
            <InfoRow 
              label="Subjects" 
              value={data.expertise?.subjects?.join(", ") ?? "Not specified"} 
            />
            <InfoRow 
              label="Specializations" 
              value={data.expertise?.specializations ?? "Not specified"} 
            />
          </InfoCard>

          {/* Availability */}
          <InfoCard title="Availability" icon={<Calendar className="w-5 h-5" />}>
            <InfoRow 
              label="Days" 
              value={data.availability?.days?.join(", ") ?? "Not specified"} 
            />
            <InfoRow 
              label="Time Slots" 
              value={data.availability?.timeSlots?.join(", ") ?? "Not specified"} 
            />
          </InfoCard>

          {/* Pricing */}
          <InfoCard title="Pricing" icon={<DollarSign className="w-5 h-5" />}>
            <InfoRow 
              label="Price per Session" 
              value={data.pricing?.pricePerSession ? `₹${data.pricing.pricePerSession}` : "Not specified"} 
            />
          </InfoCard>
        </div>

        {/* Upcoming Sessions Placeholder */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h3>
          </div>
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No upcoming sessions</p>
            <p className="text-sm text-gray-400">
              Your booked sessions will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "orange" | "green";
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function QuickActionCard({ icon, title, description, href, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: "blue" | "green" | "orange" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    green: "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white",
    orange: "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
    purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
  };

  return (
    <Link
      href={href}
      className="group bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4 transition-colors duration-300`}>
        {icon}
      </div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}

function InfoCard({ title, icon, children }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-blue-600">{icon}</div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900 text-right">{value}</span>
    </div>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
