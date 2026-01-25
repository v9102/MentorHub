import { MentorProfile } from "@/app/mentors/mock";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const fetchMentors = async (): Promise<MentorProfile[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/mentors`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch mentors: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Map backend data to MentorProfile type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((mentor: any) => ({
      id: mentor._id,
      name: mentor.name || "Unknown Mentor",
      profilePhoto: "/mentors/default_avatar.jpg", // Placeholder
      tagLine: mentor.expertise || "Experienced Mentor",
      bio: mentor.bio || "No bio available.",
      exam: "General", // Default
      college: "Unknown", // Default
      branch: "N/A", // Default
      rank: 0,
      yearOfPassing: 0,
      subjects: mentor.expertise ? mentor.expertise.split(',').map((s: string) => s.trim()) : [],
      specializations: [],
      yearsOfExperience: 0,
      studentsHelped: 0,
      rating: 0,
      reviewsCount: 0,
      sessions: 0,
      attendance: 0,
      responseTime: "24 hours",
      pricing: mentor.chargePerHour || 0,
      availability: mentor.freeSlots ? mentor.freeSlots.map((slot: any) => `${slot.date} ${slot.startTime}-${slot.endTime}`) : [],
      testimonials: [],
      offerings: []
    }));
  } catch (error) {
    console.error("Error fetching mentors:", error);
    // Return empty array or rethrow depending on desired behavior
    // For now returning empty array so the page doesn't crash completely
    return []; 
  }
};
