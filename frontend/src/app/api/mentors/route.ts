import { NextResponse } from "next/server";
import { connectDB } from "@/shared/lib/db";
import User from "@/shared/lib/models/user";

export async function GET() {
    try {
        await connectDB();

        const mentors = await User.find({ role: "mentor" });

        // Map User documents to MentorProfile format
        const formattedMentors = mentors.map((mentor) => {
            // Default availability if missing
            const availability = mentor.mentorProfile?.availability?.days?.map((day: string, index: number) => {
                const slots = mentor.mentorProfile?.availability?.timeSlots || [];
                return `${day} ${slots.join(", ")}`;
            }) || [];

            return {
                id: mentor.clerkId,
                name: mentor.name || `${mentor.firstName} ${mentor.lastName}`,
                profilePhoto: mentor.imageUrl || "/mentors/default_avatar.jpg",
                tagLine: `${mentor.mentorProfile?.professionalInfo?.college || "Expert"} | ${mentor.mentorProfile?.expertise?.specializations || "Mentor"}`,
                bio: mentor.mentorProfile?.basicInfo?.bio || "No bio available.",
                exam: "General",
                college: mentor.mentorProfile?.professionalInfo?.college || "Unknown",
                branch: mentor.mentorProfile?.professionalInfo?.branch || "N/A",
                rank: 0,
                yearOfPassing: mentor.mentorProfile?.professionalInfo?.passingYear || 0,
                subjects: mentor.mentorProfile?.expertise?.subjects || [],
                specializations: mentor.mentorProfile?.expertise?.specializations ? [mentor.mentorProfile.expertise.specializations] : [],
                yearsOfExperience: mentor.mentorProfile?.basicInfo?.workExperience || 0,
                studentsHelped: 0, // Placeholder
                rating: 0, // Placeholder
                reviewsCount: 0,
                sessions: 0,
                attendance: 100,
                responseTime: "Within 24 hours",
                pricing: mentor.mentorProfile?.pricing?.pricePerSession || 0,
                availability: availability,
                testimonials: [],
                offerings: [
                    {
                        id: "1",
                        title: "1:1 Session",
                        price: mentor.mentorProfile?.pricing?.pricePerSession || 500,
                        icon: "video"
                    }
                ]
            };
        });

        return NextResponse.json(formattedMentors);
    } catch (error) {
        console.error("Error fetching mentors:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
