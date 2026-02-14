"use client";

import { use, useState } from "react";
import { mockMentors, type MentorProfile } from "../../mentors/mock";
import SimpleMentorCard from "@/shared/ui/SimpleMentorCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ExamPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);
  const mentors: MentorProfile[] = Object.values(mockMentors);

  // Filter mentors by exam
  // Note: This is a simple filter based on the 'exam' string or 'subjects'.
  // We need to normalize the examId to match the mock data if necessary.
  // For now, let's assume examId maps somewhat to the 'exam' field or subjects.

  const filteredMentors = mentors.filter((mentor) => {
    const normalizedExamId = examId.toLowerCase();

    // Check if exam matches
    if (mentor.exam && mentor.exam.toLowerCase().includes(normalizedExamId)) {
      return true;
    }

    // Check if any subject matches
    if (mentor.subjects.some(sub => sub.toLowerCase().includes(normalizedExamId))) {
      return true;
    }

    // Special case handling for 'iit-jee' -> 'jee'
    if (normalizedExamId === 'iit-jee' && (mentor.exam?.toLowerCase().includes('jee') || mentor.subjects.some(s => s.toLowerCase().includes('jee')))) {
      return true;
    }

    return false;
  });

  const formatExamName = (id: string) => {
    return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

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
                {filteredMentors.length}
              </span>{" "}
              {filteredMentors.length === 1 ? "mentor" : "mentors"} found
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
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
                    pricing: mentor.pricing,
                    tagLine: mentor.tagLine,
                    bio: mentor.bio,
                    rating: mentor.rating,
                    reviewsCount: mentor.reviewsCount,
                    sessions: mentor.sessions,
                    yearsOfExperience: mentor.yearsOfExperience,
                    attendance: mentor.attendance,
                    exam: mentor.exam,
                    service: mentor.service,
                    posting: mentor.posting,
                    rank: mentor.rank,
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
