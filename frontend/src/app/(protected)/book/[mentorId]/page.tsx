// fetchMentorById import removed
import BookingClient from "./BookingClient";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ mentorId: string }>;
}) {
  const { mentorId } = await params;

  return <BookingClient mentorId={mentorId} />;
}
