import { mockMentors } from "../../mentors/mock";
import BookingClient from "./BookingClient";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ mentorId: string }>;
}) {
  const { mentorId } = await params;

  const mentor = mockMentors[mentorId];

  if (!mentor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Booking not available</h1>
        <p className="text-gray-600">
          Mentor not found for booking.
        </p>
      </div>
    );
  }

  return <BookingClient mentor={mentor} mentorId={mentorId} />;
}
