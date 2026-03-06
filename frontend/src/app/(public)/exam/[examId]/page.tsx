"use client";

import { use, useState, useEffect } from "react";
import { type MentorProfile } from "@/app/(public)/mentors/mock";
import { fetchMentors } from "@/shared/lib/api/mentors";
import SimpleMentorCard from "@/shared/ui/SimpleMentorCard";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function ExamPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchMentors()
      .then((data) => {
        setMentors(data);
        setFetchError(null);
      })
      .catch((err) => {
        console.error("Failed to load mentors", err);
        setFetchError(err instanceof Error ? err.message : "Failed to load mentors.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredMentors = mentors.filter((mentor) => {
    const normalizedExamId = examId.toLowerCase();

    if (mentor.exam && mentor.exam.toLowerCase().includes(normalizedExamId)) {
      return true;
    }
    if (mentor.subjects?.some(sub => sub.toLowerCase().includes(normalizedExamId))) {
      return true;
    }
    // Special case: 'iit-jee' -> 'jee'
    if (normalizedExamId === "iit-jee" && (
      mentor.exam?.toLowerCase().includes("jee") ||
      mentor.subjects?.some(s => s.toLowerCase().includes("jee"))
    )) {
      return true;
    }
    return false;
  });

  const formatExamName = (id: string) =>
    id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mentors for <span className="text-blue-600">{formatExamName(examId)}</span>
          </h1>
          <p className="text-gray-600">
            Find the best mentors to guide you for your {formatExamName(examId)} preparation.
          </p>
        </div>

        <div>
          <div className="mb-6">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">
                {loading ? "..." : filteredMentors.length}
              </span>{" "}
              {filteredMentors.length === 1 ? "mentor" : "mentors"} found
            </p>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <SimpleMentorCard key={i} isLoading={true} />
              ))}
            </div>
          ) : fetchError ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-2">Could not load mentors</p>
              <p className="text-gray-500 text-sm mb-4">{fetchError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredMentors.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500 text-lg">No mentors found for this exam yet.</p>
                  <Link href="/mentors" className="text-blue-600 hover:underline mt-2 inline-block">
                    Browse all mentors
                  </Link>
                </div>
              ) : (
                filteredMentors.map((mentor) => (
                  <SimpleMentorCard
                    key={mentor.id}
                    mentor={{
                      id: mentor.id,
                      name: mentor.name,
                      profileImage: mentor.profilePhoto,
                      mentorProfile: mentor.mentorProfile,
                      isVerified: mentor.isVerified,
                      tagLine: mentor.tagLine,
                      bio: mentor.bio,
                      rating: mentor.rating,
                      reviewsCount: mentor.reviewsCount,
                      sessions: mentor.sessions,
                      yearsOfExperience: mentor.yearsOfExperience,
                      subjects: mentor.subjects,
                      specializations: mentor.specializations,
                      pricing: mentor.pricing,
                      sessionDuration: (mentor as any).sessionDuration,
                      isFreeTrialEnabled: (mentor as any).isFreeTrialEnabled,
                      attendance: mentor.attendance,
                      exam: mentor.exam,
                      college: mentor.college,
                      rank: mentor.rank != null ? String(mentor.rank) : undefined,
                      percentile: mentor.percentile != null ? String(mentor.percentile) : undefined,
                      selectionYear: mentor.selectionYear ?? undefined,
                      languages: mentor.languages,
                      service: mentor.service,
                      posting: mentor.posting,
                      offerings: mentor.offerings,
                    }}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
