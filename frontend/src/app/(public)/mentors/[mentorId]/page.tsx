import { fetchMentorById } from "@/shared/lib/api/mentors";
import { ProfileHeader } from "@/modules/mentor/components/profile/ProfileHeader";
import { AboutSection } from "@/modules/mentor/components/profile/AboutSection";
import { StatsGrid } from "@/modules/mentor/components/profile/StatsGrid";
import { ServicesSection } from "@/modules/mentor/components/profile/ServicesSection";
import { ReviewsSection } from "@/modules/mentor/components/profile/ReviewsSection";
import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default async function MentorProfilePage({
  params,
}: {
  params: Promise<{ mentorId: string }>;
}) {
  const { mentorId } = await params;

  const mentor = await fetchMentorById(mentorId);

  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md mx-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mentor Not Found</h1>
          <p className="text-gray-600 mb-6">
            The mentor profile ("{mentorId}") you are looking for does not exist or has been removed.
          </p>
          <Link href="/mentors">
            <Button>Browse All Mentors</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <ProfileHeader mentor={mentor} />

      <main className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <StatsGrid mentor={mentor} />
            <AboutSection mentor={mentor} />
            <ServicesSection mentor={mentor} />
            <ReviewsSection mentor={mentor} />
          </div>

          {/* Sticky Sidebar Booking Column */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl p-6 border shadow-lg ring-1 ring-black/5">
                <h3 className="text-lg font-bold mb-4">Book a Session</h3>

                <div className="space-y-4 mb-6">
                  {mentor.offerings?.slice(0, 1).map((offering) => (
                    <div key={offering.id} className="flex justify-between items-center pb-4 border-b">
                      <span className="text-gray-600">{offering.title}</span>
                      <span className="font-bold">₹{offering.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Response Time</span>
                    <span className="font-medium text-gray-900">{mentor.responseTime}</span>
                  </div>
                </div>

                <Link href={`/book/${mentorId}`} className="block">
                  <Button className="w-full h-12 text-lg gap-2 shadow-blue-500/20 shadow-lg transition-all hover:shadow-blue-500/40">
                    Book Interview <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>100% Satisfaction Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Secure Payment</span>
                  </div>
                </div>
              </div>

              {/* Availability Preview */}
              <div className="bg-white rounded-2xl p-6 border shadow-sm">
                <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4">Availability</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.availability.map((slot, i) => (
                    <div key={i} className="text-xs font-bold px-3 py-1.5 bg-green-50 text-green-700 rounded-lg border border-green-100">
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t lg:hidden z-50 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div>
          <p className="text-sm text-gray-500">Starting from</p>
          <p className="text-xl font-bold">₹{mentor.pricing}</p>
        </div>
        <Link href={`/book/${mentorId}`}>
          <Button size="lg" className="shadow-lg">
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
