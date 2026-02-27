import { type MentorProfile } from "@/app/(public)/mentors/mock";

// Backend URL is now handled via Next.js Rewrites (Proxy)
const BACKEND_URL = "";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side: use relative path (relies on Next.js rewrites)
    return "";
  }

  // Server-side: use absolute URL
  // Priority: NEXT_PUBLIC_APP_URL > VERCEL_URL > localhost
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback to localhost for local development
  return "http://localhost:3000";
};

/**
 * Transform raw mentor data from backend to MentorProfile format
 */
export const transformMentorData = (mentor: any): MentorProfile => {
  const mp = mentor.mentorProfile || {};
  const basic = mp.basicInfo || {};
  const professional = mp.professionalInfo || {};
  const expertise = mp.expertise || {};
  const availability = mp.availability || {};
  const pricing = mp.pricing || {};
  const verification = mp.verification || {};

  return {
    id: mentor.clerkId || mentor.id || mentor._id,
    // Store MongoDB _id separately for backend API calls
    mongoId: mentor._id,
    name: mentor.name || "Mentor",
    profilePhoto: basic.profilePhoto || mentor.imageUrl || "/mentors/default_avatar.jpg",

    // Constructed Tagline
    tagLine: basic.currentRole && basic.currentOrganisation
      ? `${basic.currentRole} at ${basic.currentOrganisation}`
      : (mentor.tagLine || "Mentor"),

    // Construct a meaningful bio from DB fields when no explicit about/bio exists
    bio: basic.about || mentor.bio || (
      basic.currentRole && basic.currentOrganisation
        ? `${basic.currentRole} at ${basic.currentOrganisation}${expertise.subjects?.length ? '. Specialises in ' + expertise.subjects.join(', ') + '.' : '.'}`
        : expertise.subjects?.length
          ? `Mentor specialising in ${expertise.subjects.join(', ')}.`
          : "Helping students achieve their goals through personalised guidance."
    ),

    // Education & Experience
    college: professional.college || "N/A",
    yearOfPassing: professional.passingYear || 0,
    yearsOfExperience: basic.workExperience || 0,
    highestQualification: professional.highestQualification,
    branch: professional.branch,

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
    sessionDuration: pricing.sessionDuration,
    isFreeTrialEnabled: pricing.isFreeTrialEnabled ?? false,
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

    // Govt Specific Fields (Pass through if present)
    service: mentor.service,
    posting: mentor.posting,
    rank: mentor.rank,
    attempts: mentor.attempts,
    exam: (() => {
      const explicitExam = mentor.exam;
      if (explicitExam) return explicitExam;

      const subjects = expertise.subjects || [];
      const role = basic.currentRole || "";
      const org = basic.currentOrganisation || "";
      const specializations = expertise.specializations || "";

      const combinedText = `${role} ${org} ${specializations} ${subjects.join(" ")}`.toLowerCase();

      // Check for known exam keywords in order of priority
      if (combinedText.match(/\b(upsc|ias|ips|ifs|irs|cse)\b/i)) return "UPSC";
      if (combinedText.match(/\b(ssc|cgl|aso)\b/i)) return "SSC";
      if (combinedText.match(/\brbi\b/i)) return "RBI Grade B";
      if (combinedText.match(/\b(psc|uppsc|mppsc|bpsc)\b/i)) return "State PSC";
      if (combinedText.match(/\b(defence|cds|nda|afcat|navy|military|army)\b/i)) return "Defence";
      if (combinedText.match(/\bcet\b/i)) return "CET";
      if (combinedText.match(/\bgate\b/i)) return "GATE";
      if (combinedText.match(/\bcat\b/i)) return "CAT";
      if (combinedText.match(/\bneet\b/i)) return "NEET";
      if (combinedText.match(/\bjee|iit\b/i)) return "JEE";
      if (combinedText.match(/\bclat|law\b/i)) return "CLAT";
      if (combinedText.match(/\bbank|po|ibps|sbi\b/i)) return "Banking";

      // If no exam keyword is found, return the first subject, or a generic string
      if (subjects.length > 0) return subjects[0];

      return "General";
    })()?.replace(" CSE", "").replace(" CGL", ""),
    optionalSubject: mentor.optionalSubject,

    // Verification status from backend (nested in mentorProfile)
    isVerified: verification?.isVerified ?? true,

    /** Pass through the full raw nested object so components can read it */
    mentorProfile: {
      basicInfo: basic,
      professionalInfo: professional,
      expertise,
      availability,
      pricing,
    },

  } as MentorProfile;
};

/**
 * Fetch all mentors from the API
 */
export const fetchMentors = async (): Promise<MentorProfile[]> => {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/mentors`, { 
      next: { revalidate: 300 } // Cache for 5 minutes on server
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const backendMentors = Array.isArray(data) ? data : (data.mentors || []);

    return backendMentors.map(transformMentorData);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error fetching mentors:", error);
    }
    return [];
  }
};

/**
 * Fetch a single mentor by ID directly from the backend
 * Uses the dedicated single-mentor endpoint for efficiency
 */
export const fetchMentorById = async (id: string): Promise<MentorProfile | undefined> => {
  try {
    const baseUrl = getBaseUrl();
    
    // Try to fetch single mentor from dedicated endpoint
    const response = await fetch(`${baseUrl}/api/mentors/${id}`, {
      next: { revalidate: 300 } // Cache for 5 minutes on server
    });

    if (response.ok) {
      const data = await response.json();
      // Backend returns { success: true, mentor: {...} }
      const mentor = data.mentor || data;
      if (mentor) {
        return transformMentorData(mentor);
      }
    }

    // Fallback: If single-mentor endpoint fails, search in all mentors
    // This handles cases where backend endpoint might not exist yet
    const allMentors = await fetchMentors();
    return allMentors.find(m => m.id === id);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error fetching mentor ${id}:`, error);
    }
    
    // Fallback to fetching all mentors
    try {
      const allMentors = await fetchMentors();
      return allMentors.find(m => m.id === id);
    } catch {
      return undefined;
    }
  }
};
