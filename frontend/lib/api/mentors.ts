import { MentorProfile } from "@/app/mentors/mock";

const BACKEND_URL = "https://mentorhub-backend-5gk6jbun2q-el.a.run.app";

export const fetchMentors = async (): Promise<MentorProfile[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/mentors`);

    if (!response.ok) {
      console.warn(`Failed to fetch mentors from backend (${response.statusText}).`);
      return [];
    }

    const data = await response.json();


    console.log("Raw backend data:", data);


    // Map backend data to MentorProfile type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((mentor: any) => ({
      id: mentor._id,
      name: `${mentor.firstName} ${mentor.lastName}`,
      profilePhoto: mentor.avatar || "/mentors/default_avatar.jpg",
      tagLine: `${mentor.education?.[0]?.institution || "Expert"} | ${mentor.exams?.[0] || "Mentor"}`,
      bio: mentor.bio || "No bio available.",
      exam: mentor.exams?.[0] || "General",
      college: mentor.education?.[0]?.institution || "Unknown",
      branch: mentor.education?.[0]?.degree || "N/A",
      rank: 0, // Not explicitly in top-level fields, could parse achievements
      yearOfPassing: mentor.education?.[0]?.year || 0,
      subjects: mentor.specializations || [],
      specializations: mentor.specializations || [],
      yearsOfExperience: mentor.experience || 0,
      studentsHelped: mentor.completedSessions || 0,
      rating: mentor.rating || 0,
      reviewsCount: mentor.totalReviews || 0,
      sessions: mentor.totalSessions || 0,
      attendance: mentor.totalSessions > 0 ? Math.round((mentor.completedSessions / mentor.totalSessions) * 100) : 100,
      responseTime: "Within 24 hours",
      pricing: mentor.pricing?.oneOnOne || 0,
      availability: mentor.availability?.map((a: any) =>
        `${a.day} ${a.slots?.map((s: any) => `${s.startTime}-${s.endTime}`).join(", ")}`
      ) || [],
      testimonials: [], // Not in current response
      offerings: [
        { id: "1", title: "1:1 Session", price: mentor.pricing?.oneOnOne || 500, icon: "video" },
        { id: "2", title: "Group Session", price: mentor.pricing?.group || 200, icon: "users" },
        { id: "3", title: "Trial Session", price: mentor.pricing?.trial || 100, icon: "zap" }
      ]
    }));
  } catch (error) {
    console.error("Error fetching mentors:", error);

    // Return empty array or rethrow depending on desired behavior
    // For now returning empty array so the page doesn't crash completely

    return [];
  }
};

export const fetchMentorById = async (id: string): Promise<MentorProfile | undefined> => {
  const mentors = await fetchMentors();
  return mentors.find((mentor) => mentor.id === id);
};
