import { mockMentors } from "./mock";

export default async function MentorProfilePage({
  params,
}: {
  params: Promise<{ mentorId: string }>;
}) {
  const { mentorId } = await params;

  const mentor = mockMentors[mentorId];

  if (!mentor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Mentor not found</h1>
        <p className="text-gray-600">
          The mentor profile you&apos;re looking for doesn&apos;t exist.
        </p>
        <p className="text-sm text-gray-500">Looking for: {mentorId}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{mentor.name}</h1>
      <p className="text-gray-600">{mentor.tagLine}</p>
    </div>
  );
}
