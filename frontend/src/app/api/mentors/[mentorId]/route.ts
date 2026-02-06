import { NextResponse } from "next/server";
import { connectDB } from "@/shared/lib/db";
import User from "@/shared/lib/models/user";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ mentorId: string }> }
) {
    try {
        const { mentorId } = await params;
        await connectDB();

        console.log(`[API] Fetching mentor with ID: ${mentorId}`);

        // 1. Try to find by Clerk ID
        let mentor = await User.findOne({ clerkId: mentorId, role: "mentor" });
        console.log(`[API] Find by Clerk ID result:`, mentor ? "Found" : "Not Found");

        // 2. If not found, try by MongoDB _id (if valid ObjectId)
        if (!mentor && mentorId.match(/^[0-9a-fA-F]{24}$/)) {
            console.log(`[API] Trying by MongoDB _id...`);
            mentor = await User.findOne({ _id: mentorId, role: "mentor" });
            console.log(`[API] Find by Mongo ID result:`, mentor ? "Found" : "Not Found");
        }

        if (!mentor) {
            console.warn(`[API] Mentor not found for ID: ${mentorId}. Executing fallback check...`);
            // Debug: Check if user exists at all (ignoring role)
            const userExists = await User.findOne({ clerkId: mentorId });
            console.log(`[API] Does user exist (any role)?`, userExists ? `Yes, role: ${userExists.role}` : "No");

            return NextResponse.json(
                { error: "Mentor not found or user is not a mentor" },
                { status: 404 }
            );
        }

        // Map User document to MentorProfile format (consistent with list API)
        const availability = mentor.mentorProfile?.availability?.days?.map((day: string, index: number) => {
            const slots = mentor.mentorProfile?.availability?.timeSlots || [];
            return `${day} ${slots.join(", ")}`;
        }) || [];

        const formattedMentor = {
            id: mentor.clerkId,
            name: mentor.name || `${mentor.firstName} ${mentor.lastName}`,
            profilePhoto: mentor.imageUrl || "/mentors/default_avatar.jpg",
            tagLine: `${mentor.mentorProfile?.professionalInfo?.college || "Expert"} | ${mentor.mentorProfile?.expertise?.specializations || "Mentor"}`,
            bio: mentor.mentorProfile?.basicInfo?.bio || "No bio available.",
            exam: "General",
            college: mentor.mentorProfile?.professionalInfo?.college || "Unknown",
            yearOfPassing: mentor.mentorProfile?.professionalInfo?.passingYear || 0,
            subjects: mentor.mentorProfile?.expertise?.subjects || [],
            specializations: mentor.mentorProfile?.expertise?.specializations ? [mentor.mentorProfile.expertise.specializations] : [],
            yearsOfExperience: mentor.mentorProfile?.basicInfo?.workExperience || 0,
            studentsHelped: 0,
            rating: 0,
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

        return NextResponse.json(formattedMentor);
    } catch (error) {
        console.error("Error fetching mentor:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
