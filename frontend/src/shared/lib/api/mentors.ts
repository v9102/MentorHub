import { mockMentors, MentorProfile } from "@/app/(public)/mentors/mock";

// Backend URL is now handled via Next.js Rewrites (Proxy)
const BACKEND_URL = "";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side: use relative path
    return "";
  }
  // Server-side: use absolute URL (fallback to localhost if env not set)
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

export const fetchMentors = async (): Promise<MentorProfile[]> => {
  try {
    const baseUrl = getBaseUrl();
    console.log(`Fetching mentors from: ${baseUrl}/api/mentor/mentors`);

    const response = await fetch(`${baseUrl}/api/mentors`, { cache: 'no-store' });

    if (!response.ok) {

      console.warn(`Failed to fetch mentors from backend (${response.status} ${response.statusText}).`);
      const errorText = await response.text();
      console.error("Error response body:", errorText.slice(0, 500));
      return [];
    }

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      console.log("Local API data:", data);

      const backendMentors = Array.isArray(data) ? data : (data.mentors || []);

      // The backend API already formats the data, so we don't need to re-map deeply
      // unless fields are missing.
      return backendMentors.map((mentor: any) => ({
        id: mentor.id || mentor.clerkId || mentor._id,
        name: mentor.name || "Mentor",
        profilePhoto: mentor.profilePhoto || mentor.imageUrl || "/mentors/default_avatar.jpg",
        tagLine: mentor.tagLine || "",
        bio: mentor.bio || "No bio available.",
        exam: mentor.exam || "General",
        service: mentor.service || "",
        rank: mentor.rank || 0,
        college: mentor.college || "N/A",
        yearOfPassing: mentor.yearOfPassing || 0,
        subjects: mentor.subjects || [],
        specializations: mentor.specializations || [],
        yearsOfExperience: mentor.yearsOfExperience || 0,
        studentsHelped: mentor.studentsHelped || 0,
        rating: mentor.rating || 0,
        reviewsCount: mentor.reviewsCount || 0,
        sessions: mentor.sessions || 0,
        attendance: mentor.attendance || 100,
        responseTime: mentor.responseTime || "Within 24 hours",
        pricing: mentor.pricing || 0,
        availability: mentor.availability || [],
        testimonials: mentor.testimonials || [],
        offerings: mentor.offerings || [
          {
            id: "1",
            title: "1:1 Session",
            price: mentor.pricing || 500,
            icon: "video"
          }
        ],
        // New Govt Fields (Pass through if present)
        posting: mentor.posting,
        attempts: mentor.attempts,
        optionalSubject: mentor.optionalSubject,
      } as MentorProfile));

    } catch (e) {
      console.error("Failed to parse JSON:", e);
      console.error("Received text:", text.slice(0, 500));
      return [];
    }
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return [];
  }
};

export const fetchMentorById = async (id: string): Promise<MentorProfile | undefined> => {
  try {
    const baseUrl = getBaseUrl();
    const fetchUrl = `${baseUrl}/api/mentors/${id}`;
    console.log(`[fetchMentorById] Fetching mentor from: ${fetchUrl}`);
    console.log(`[fetchMentorById] Mentor ID: ${id}`);

    const response = await fetch(fetchUrl, { cache: 'no-store' });

    console.log(`[fetchMentorById] Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      console.warn(`[fetchMentorById] Failed to fetch mentor ${id} (${response.status} ${response.statusText})`);
      return undefined;
    }

    const mentor = await response.json();
    console.log(`[fetchMentorById] Successfully fetched mentor:`, mentor.name);
    return mentor;
  } catch (error) {
    console.error(`[fetchMentorById] Error fetching mentor ${id}:`, error);
    return undefined;
  }
};
