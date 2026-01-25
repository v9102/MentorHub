import { fetchMentorById } from "@/lib/api/mentors";
import Link from "next/link";

export default async function MentorProfilePage({
  params,
}: {
  params: Promise<{ mentorId: string }>;
}) {
  const { mentorId } = await params;

  const mentor = await fetchMentorById(mentorId);

  if (!mentor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Mentor not found</h1>
        <p className="text-gray-600">
          The mentor profile you&apos;re looking for doesn&apos;t exist.
        </p>
        <p className="text-sm text-gray-500">
          Looking for: {mentorId}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Mentor Header */}
      <div>
        <h1 className="text-3xl font-bold">{mentor.name}</h1>
        <p className="text-gray-600 mt-1">{mentor.tagLine}</p>
      </div>

      {/* Simple Interview Booking Card */}
      <div className="bg-white border rounded-2xl p-6 max-w-md">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block text-xs bg-gray-100 px-2 py-1 rounded mb-2">
              1:1 Interview
            </span>

            <h2 className="text-lg font-semibold">
              Mock Interview Session
            </h2>

            <p className="text-sm text-gray-600 mt-1">
              Practice interviews with personalized feedback
            </p>

            <p className="text-sm text-gray-600 mt-2">
              ⏱ Duration: 30 minutes
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg font-bold">
            ₹{mentor.pricing}
          </div>

          <Link
            href={`/book/${mentorId}`}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800"
          >
            Book Interview
          </Link>
        </div>
      </div>
    </div>
  );
}
