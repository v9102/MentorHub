import { type MentorProfile } from "@/app/(public)/mentors/mock";

// Backend URL is now handled via Next.js Rewrites (Proxy)

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformMentorData = (mentor: any): MentorProfile => {
  const mp = mentor.mentorProfile || {};
  const basic = mp.basicInfo || {};
  const professional = mp.professionalInfo || {};
  const expertise = mp.expertise || {};
  const availability = mp.availability || {};
  const pricing = mp.pricing || {};
  const verification = mp.verification || {};

  // Log the raw mentor data for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('[transformMentorData] Raw mentor:', {
      id: mentor._id,
      name: mentor.name,
      hasProfile: !!mentor.mentorProfile,
      hasBasicInfo: !!basic,
      currentRole: basic.currentRole,
      exam: mp.examDetails?.[0]?.examName,
    });
  }

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

    // Metrics - read from mentorProfile or top-level
    studentsHelped: mentor.studentsHelped || mentor.mentorProfile?.studentsHelped || 0,
    rating: mp.rating || mentor.rating || 0,
    reviewsCount: mp.totalReviews || mentor.reviewsCount || 0,
    // Calculate sessions from upcomingSessions that are booked
    sessions: mentor.sessions || mp.upcomingSessions?.filter((s: any) => s.isBooked).length || 0,
    attendance: mentor.attendance || 95, // Default to 95% instead of 100%
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
    posting: mentor.posting || basic.currentRole,
    rank: mentor.rank || mp.examDetails?.[0]?.rank,
    attempts: mentor.attempts || mp.examDetails?.[0]?.attempts,
    exam: (() => {
      // First check explicit exam field
      const explicitExam = mentor.exam;
      if (explicitExam) return explicitExam;

      // Check examDetails array
      if (mp.examDetails?.length > 0) {
        const examName = mp.examDetails[0].examName;
        if (examName) return examName;
      }

      const subjects = expertise.subjects || [];
      const role = basic.currentRole || "";
      const org = basic.currentOrganisation || "";
      const specializations = expertise.specializations || "";

      const combinedText = `${role} ${org} ${specializations} ${subjects.join(" ")}`.toLowerCase();

      // Check for known exam keywords in order of priority
      if (combinedText.match(/\b(upsc|ias|ips|ifs|irs|cse)\b/i)) return "UPSC CSE";
      if (combinedText.match(/\b(ssc|cgl|aso)\b/i)) return "SSC CGL";
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

      // If no exam keyword is found, don't show generic "General"
      if (subjects.length > 0) return subjects[0];

      return undefined; // Don't show exam field if we can't determine it
    })()?.replace(" CSE", "").replace(" CGL", ""),
    optionalSubject: mentor.optionalSubject || mp.examDetails?.[0]?.optionalSubject,

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

    /** Pass through upcomingSessions for the booking page to use */
    upcomingSessions: mentor.mentorProfile?.upcomingSessions || [],

  } as MentorProfile;
};

/**
 * Fetch all mentors from the API (cached for 5 min — listing page only)
 */
export const fetchMentors = async (): Promise<MentorProfile[]> => {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/mentors`;
    console.log('[fetchMentors] Fetching from:', url);
    
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes on server
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[fetchMentors] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[fetchMentors] Error response:', errorText);
      return [];
    }

    const data = await response.json();
    console.log('[fetchMentors] Received data:', { 
      isArray: Array.isArray(data),
      hasMentors: !!data.mentors,
      mentorCount: Array.isArray(data) ? data.length : (data.mentors?.length || 0)
    });
    
    const backendMentors = Array.isArray(data) ? data : (data.mentors || []);

    if (backendMentors.length === 0) {
      console.warn('[fetchMentors] No mentors returned from backend');
    }

    return backendMentors.map(transformMentorData);
  } catch (error) {
    console.error('[fetchMentors] Error:', error);
    return [];
  }
};

/**
 * Fetch a single mentor by ID directly from the backend.
 * Always fetches fresh data (no cache) so that booking availability
 * reflects real-time slot status — important when bookings are created
 * or deleted directly in the database.
 */
export const fetchMentorById = async (id: string): Promise<MentorProfile | undefined> => {
  try {
    const baseUrl = getBaseUrl();

    // Fetch single mentor with NO cache so booking page is always up-to-date
    const response = await fetch(`${baseUrl}/api/mentors/${id}`, {
      cache: 'no-store'
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
