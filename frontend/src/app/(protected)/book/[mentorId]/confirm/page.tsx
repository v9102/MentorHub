import { fetchMentorById } from "@/shared/lib/api/mentors";
import ConfirmClient from "./ConfirmClient";

export default async function ConfirmPage({
  params,
}: {
  params: Promise<{ mentorId: string }>;
}) {
  const { mentorId } = await params;
  const mentor = await fetchMentorById(mentorId);

  if (!mentor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold">
          Booking not available
        </h1>
      </div>
    );
  }

  return (
    <ConfirmClient
      mentor={mentor}
      sessionDate="07 Jan 26"
      sessionTime="09:00 PM IST"
      price={mentor.pricing}
    />
  );
}
