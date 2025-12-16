import Link from "next/link";
import { CircleUser } from "lucide-react";

type MentorCardData = {
  id: string;
  name: string;
  pricing: number;
  tagLine?: string;
  bio: string;
};

export default function MentorCard({
  mentor,
}: {
  mentor: MentorCardData;
}) {
  return (
    <Link
  href={`/mentor/${mentor.id}`}
  className="group block p-6 border rounded-xl bg-white hover:shadow-lg transition"
>
  <div className="flex justify-center mb-4">
    <CircleUser className="w-20 h-20 text-gray-700 group-hover:text-blue-600 transition" />
  </div>

  <h2 className="text-xl font-bold text-center text-gray-900">
    {mentor.name}
  </h2>

  <p className="mt-2 text-sm text-gray-600 text-center line-clamp-3">
    {mentor.bio}
  </p>

  {mentor.tagLine && (
    <p className="mt-1 text-xs text-gray-500 text-center italic">
      {mentor.tagLine}
    </p>
  )}

  <p className="mt-4 text-center font-semibold text-blue-600">
    ₹{mentor.pricing}/hr
  </p>
</Link>

  );
}
