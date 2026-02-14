import { mockMentors, MentorProfile } from "@/app/(public)/mentors/mock";

// Backend URL is now handled via Next.js Rewrites (Proxy)
const BACKEND_URL = "";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side: use relative path
    return "";
  }
  // Server-side: use absolute URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback to localhost
  return "http://localhost:3000";
};

export const fetchMentors = async (): Promise<MentorProfile[]> => {
  try {
    const baseUrl = getBaseUrl();
    console.log(`[DEBUG] getBaseUrl result: ${baseUrl}`);
    console.log(`[DEBUG] Env Vars: NEXT_PUBLIC_APP_URL=${process.env.NEXT_PUBLIC_APP_URL}, VERCEL_URL=${process.env.VERCEL_URL}`);
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
      return backendMentors.map((mentor: any) => {
        const mp = mentor.mentorProfile || {};
        const basic = mp.basicInfo || {};
        const professional = mp.professionalInfo || {};
        const expertise = mp.expertise || {};
        const availability = mp.availability || {};
        const pricing = mp.pricing || {};

        return {
          id: mentor.clerkId || mentor.id || mentor._id,
          name: mentor.name || "Mentor",
          profilePhoto: basic.profilePhoto || mentor.imageUrl || "/mentors/default_avatar.jpg",

          // Constructed Tagline
          tagLine: basic.currentRole && basic.currentOrganisation
            ? `${basic.currentRole} at ${basic.currentOrganisation}`
            : (mentor.tagLine || "Mentor"),

          bio: basic.about || mentor.bio || "No bio available.",

          // Education & Experience
          college: professional.college || "N/A",
          yearOfPassing: professional.passingYear || 0,
          yearsOfExperience: basic.workExperience || 0,

          // Expertise
          subjects: expertise.subjects || [],
          specializations: expertise.specializations ? [expertise.specializations] : [],

          // Metrics (Defaults for now as backend doesn't track these yet)
          studentsHelped: mentor.studentsHelped || 0,
          rating: mentor.rating || 0,
          reviewsCount: mentor.reviewsCount || 0,
          sessions: mentor.sessions || 0,
          attendance: mentor.attendance || 100,
          responseTime: mentor.responseTime || "Within 24 hours",

          // Pricing & Availability
          pricing: pricing.pricePerSession || 0,
          availability: [
            ...(availability.days || []),
            ...(availability.timeSlots || [])
          ],

          testimonials: mentor.testimonials || [],
          offerings: mentor.offerings || [
            {
              id: "1",
              title: "1:1 Session",
              price: pricing.pricePerSession || 500,
              icon: "video"
            }
          ],

          // Govt Specific Fields (Pass through if present, otherwise undefined)
          service: mentor.service,
          posting: mentor.posting,
          rank: mentor.rank,
          attempts: mentor.attempts,
          exam: mentor.exam || "General", // Default to General if not specified
          optionalSubject: mentor.optionalSubject,

        } as MentorProfile;
      });

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
    console.log(`[fetchMentorById] Looking for mentor with clerkId: ${id}`);

    // Backend has no single-mentor endpoint, so fetch all and filter client-side
    const allMentors = await fetchMentors();

    const mentor = allMentors.find(m => m.id === id);

    if (mentor) {
      console.log(`[fetchMentorById] Found mentor: ${mentor.name}`);
    } else {
      console.warn(`[fetchMentorById] No mentor found with id: ${id}`);
    }

    return mentor;
  } catch (error) {
    console.error(`[fetchMentorById] Error:`, error);
    return undefined;
  }
};
