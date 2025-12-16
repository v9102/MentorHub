import { mockMentors } from "../mentor/[mentorId]/mock";
import MentorCard from "@/components/ui/MentorCard";

export default function MentorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Your Mentor</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(mockMentors).map((mentor) => (
          <MentorCard
            key={mentor.id}
            mentor={{
              id: mentor.id,
              name: mentor.name,
              pricing: mentor.pricing,
              tagLine: mentor.tagLine ?? "",
              bio : mentor.bio,
            }}
          />
        ))}
      </div>
    </div>
  );
}
