/** Raw nested structure matching the MongoDB document schema */
export type MentorProfileNested = {
  basicInfo?: {
    gender?: string;
    currentOrganisation?: string;
    industry?: string;
    currentRole?: string;
    workExperience?: number;
    profilePhoto?: string;
    about?: string;
  };
  professionalInfo?: {
    highestQualification?: string;
    college?: string;
    branch?: string;
    passingYear?: number;
  };
  expertise?: {
    subjects?: string[];
    specializations?: string;
  };
  availability?: {
    days?: string[];
    timeSlots?: string[];
  };
  pricing?: {
    pricePerSession?: number;
    sessionDuration?: number;
    isFreeTrialEnabled?: boolean;
  };
};

/** Flat view used by UI components — populated by the API mapper */
export type MentorProfile = {
  id: string;
  /** MongoDB ObjectId - used for backend API calls */
  mongoId?: string;
  name: string;
  profilePhoto?: string;
  profileImage?: string;
  tagLine: string;
  bio: string;
  exam?: string;

  // Govt Exam Specific Fields
  service?: string;
  posting?: string;
  rank?: number | string;
  attempts?: number | string;
  optionalSubject?: string;
  percentile?: number | string;
  selectionYear?: string | number;

  // Languages mentor can communicate in
  languages?: string[];

  // Generic education / experience
  college?: string;
  yearOfPassing?: number;
  subjects?: string[];
  specializations?: string[];
  yearsOfExperience?: number;
  studentsHelped?: number;

  // Metrics
  rating?: number;
  reviewsCount?: number;
  sessions?: number;
  attendance?: number;
  responseTime?: string;

  // Pricing & availability (flattened for UI)
  pricing?: number;
  sessionDuration?: number;
  isFreeTrialEnabled?: boolean;
  availability?: string[];

  // Education extras
  highestQualification?: string;
  branch?: string;

  // Rich structures
  testimonials?: {
    studentName: string;
    text: string;
    rating: number;
  }[];
  isVerified?: boolean;
  offerings?: {
    id: string;
    title: string;
    price: number;
    discount?: number;
    icon?: string;
  }[];

  /** Raw nested mentorProfile from DB — available when data comes from the real API */
  mentorProfile?: MentorProfileNested;

  /** Upcoming sessions from the mentor's availability schedule */
  upcomingSessions?: {
    _id?: string;
    date: string;
    startTime: string;
    endTime: string;
    sessionDuration: number;
    isBooked: boolean;
    bookedBy?: string | null;
  }[];
};

export const mockMentors: Record<string, MentorProfile> = {
  "vikram_singh1": {
    id: "vikram_singh1",
    name: "Vikram Singh, IAS",
    profileImage: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200",
    tagLine: "UPSC CSE AIR 12 | 1st Attempt",
    bio: "Serving IAS officer currently posted as Joint Secretary. I decode the exact matrix required to clear UPSC in the first attempt. Specialized in Ethics (GS-4) and Essay Strategy.",
    exam: "UPSC CSE",
    service: "IAS",
    posting: "Joint Secretary, MHA",
    rank: 12,
    attempts: 1,
    optionalSubject: "Public Administration",
    college: "St. Stephens, Delhi",
    yearsOfExperience: 5,
    rating: 4.9,
    reviewsCount: 342,
    sessions: 1200,
    attendance: 99,
    responseTime: "Within 2 hours",
    pricing: 1500,
    isVerified: true,
    offerings: [
      { id: "1", title: "1:1 Strategy Sprint", price: 1500, discount: 20 },
      { id: "2", title: "Mains Answer Review", price: 2500 }
    ]
  },
  "shyam_singh2": {
    id: "shyam_singh",
    name: "Shyam Singh, IPS",
    profileImage: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200",
    tagLine: "UPSC CSE AIR 12 | 1st Attempt",
    bio: "Serving IAS officer currently posted as Joint Secretary. I decode the exact matrix required to clear UPSC in the first attempt. Specialized in Ethics (GS-4) and Essay Strategy.",
    exam: "UPSC CSE",
    service: "IAS",
    posting: "Joint Secretary, MHA",
    rank: 12,
    attempts: 1,
    optionalSubject: "Public Administration",
    college: "St. Stephens, Delhi",
    yearsOfExperience: 5,
    rating: 4.9,
    reviewsCount: 342,
    sessions: 1200,
    attendance: 99,
    responseTime: "Within 2 hours",
    pricing: 1500,
    isVerified: true,
    offerings: [
      { id: "1", title: "1:1 Strategy Sprint", price: 1500, discount: 20 },
      { id: "2", title: "Mains Answer Review", price: 2500 }
    ]
  },
  "priyanka_desai2": {
    id: "priyanka_desai2",
    name: "Priyanka Desai",
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    tagLine: "IPS Officer | UPSC CSE AIR 145",
    bio: "Cleared UPSC CSE with a full-time corporate job. I specialize in helping working professionals manage time, maximize current affairs, and master Internal Security (GS-3).",
    exam: "UPSC CSE",
    service: "IPS",
    posting: "DCP, Zone III",
    rank: 145,
    attempts: 2,
    optionalSubject: "Sociology",
    college: "IIT Bombay",
    yearsOfExperience: 4,
    rating: 4.8,
    reviewsCount: 185,
    sessions: 850,
    attendance: 96,
    responseTime: "Within 6 hours",
    pricing: 1200,
    isVerified: true,
    offerings: [
      { id: "o1", title: "Working Pro Strategy", price: 1200, discount: 15 },
      { id: "o2", title: "Sociology Review", price: 2000 }
    ]
  },
  "amit_kumar4": {
    id: "amit_kumar4",
    name: "Amit Kumar",
    profileImage: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=200",
    tagLine: "SSC CGL AIR 5 | ASO in MEA",
    bio: "Current ASO in the Ministry of External Affairs. I secured full marks in Tier-2 Maths. I'll teach you the rapid speed-maths techniques needed for a top 100 rank.",
    exam: "SSC CGL",
    service: "ASO (MEA)",
    posting: "New Delhi",
    rank: 5,
    attempts: 1,
    college: "NIT Kurukshetra",
    yearsOfExperience: 3,
    rating: 4.9,
    reviewsCount: 420,
    sessions: 2100,
    attendance: 98,
    responseTime: "Within 1 hour",
    pricing: 800,
    isVerified: true,
    offerings: [
      { id: "s1", title: "Quant Masterclass", price: 800, discount: 25 },
      { id: "s2", title: "Mock Test Analysis", price: 1500 }
    ]
  },
  "dr_aditi_gupta5": {
    id: "dr_aditi_gupta5",
    name: "Dr. Aditi Gupta",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    tagLine: "IFS Officer | Foreign Service",
    bio: "Indian Foreign Service officer currently stationed in Geneva. Expert in International Relations, Medical Science optional, and clearing the Personality Test (Interview) with 200+ marks.",
    exam: "UPSC CSE",
    service: "IFS",
    posting: "Geneva, Switzerland",
    rank: 18,
    attempts: 1,
    optionalSubject: "Medical Science",
    college: "AIIMS Delhi",
    yearsOfExperience: 6,
    rating: 5.0,
    reviewsCount: 112,
    sessions: 400,
    attendance: 100,
    pricing: 3000,
    isVerified: true,
    offerings: [
      { id: "i1", title: "Interview Prep Call", price: 3000 },
      { id: "i2", title: "DAF Analysis", price: 4500 }
    ]
  },
  "karthik_rajan8": {
    id: "karthik_rajan8",
    name: "Karthik Rajan",
    profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    tagLine: "UPPSC Deputy Collector Topper",
    bio: "Deputy Collector in UP Government. I provide a highly localized approach for State PSCs, specifically UPPSC and BPSC. Focus on State History, Admin framework, and Hindi mains.",
    exam: "State PSC",
    posting: "SDM, Lucknow",
    rank: 2,
    attempts: 3,
    college: "BHU",
    yearsOfExperience: 4,
    rating: 4.7,
    reviewsCount: 205,
    sessions: 950,
    attendance: 94,
    pricing: 900,
    isVerified: true,
    offerings: [
      { id: "sp1", title: "State PSC Strategy", price: 900, discount: 10 },
      { id: "sp2", title: "Mains Hindi Review", price: 1200 }
    ]
  },
  "neha_sharma7": {
    id: "neha_sharma7",
    name: "Neha Sharma",
    profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200",
    tagLine: "RBI Grade B Officer | Economy Expert",
    bio: "Cracking RBI Grade B requires a completely different approach than standard banking. I specialize in Economic & Social Issues (ESI) and Finance & Management (FM).",
    exam: "RBI Grade B",
    service: "Manager",
    posting: "RBI Headquarters, Mumbai",
    rank: 8,
    attempts: 2,
    college: "SRCC, Delhi",
    yearsOfExperience: 5,
    rating: 4.9,
    reviewsCount: 310,
    sessions: 1540,
    attendance: 97,
    pricing: 1400,
    isVerified: true,
    offerings: [
      { id: "rbi1", title: "Phase 2 Roadmap", price: 1400, discount: 15 },
      { id: "rbi2", title: "Descriptive English", price: 1800 }
    ]
  },
  "arun_patel9": {
    id: "arun_patel9",
    name: "Arun Patel",
    profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    tagLine: "IRS (C&IT) | Economy Specialist",
    bio: "IRS Officer (Customs & Indirect Taxes). I specialize in simplifying the Indian Economy, analyzing the Economic Survey, and mastering GS-3 for UPSC CSE.",
    exam: "UPSC CSE",
    service: "IRS (C&IT)",
    posting: "Ahmedabad, Gujarat",
    rank: 210,
    attempts: 3,
    college: "IIM Ahmedabad",
    yearsOfExperience: 6,
    rating: 4.8,
    reviewsCount: 180,
    sessions: 500,
    attendance: 93,
    pricing: 1300,
    isVerified: true,
    offerings: [
      { id: "eco1", title: "Budget Deep Dive", price: 1300, discount: 10 },
      { id: "eco2", title: "Economy Answer Writing", price: 2000 }
    ]
  },
  "manoj_verma10": {
    id: "manoj_verma10",
    name: "Manoj Verma",
    profileImage: "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&q=80&w=200",
    tagLine: "CDS Topper | SSB Psychology Expert",
    bio: "Ex-Army Captain. Mentoring defence aspirants for CDS and AFCAT. I provide critical psychological screening for the SSB Interview and GTO task strategies.",
    exam: "Defence",
    service: "Captain (Retd.)",
    posting: "New Delhi",
    rank: 15,
    attempts: 1,
    college: "NDA Khadakwasla",
    yearsOfExperience: 5,
    rating: 4.9,
    reviewsCount: 540,
    sessions: 1200,
    attendance: 99,
    pricing: 1000,
    isVerified: true,
    offerings: [
      { id: "ssb1", title: "Mock SSB Interview", price: 1000, discount: 20 },
      { id: "ssb2", title: "Psychological Assessment", price: 1500 }
    ]
  },
  "suresh_yadav6": {
    id: "suresh_yadav6",
    name: "Suresh Yadav",
    profileImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200",
    tagLine: "RRB NTPC Topper | Station Master",
    bio: "Serving Station Master in Indian Railways. I teach Railway-specific General Awareness and shortcut methods for cracking RRB NTPC Phase 1 and 2.",
    exam: "Railways",
    service: "Station Master",
    posting: "Northern Railways",
    rank: 4,
    attempts: 1,
    college: "NIT Patna",
    yearsOfExperience: 4,
    rating: 4.6,
    reviewsCount: 220,
    sessions: 700,
    attendance: 95,
    pricing: 600,
    isVerified: false,
    offerings: [
      { id: "rrb1", title: "NTPC Phase 2 Strategy", price: 600, discount: 25 },
      { id: "rrb2", title: "General Science Concepts", price: 900 }
    ]
  },
  "anita_rao11": {
    id: "anita_rao11",
    name: "Anita Rao",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    tagLine: "MPSC Deputy Collector Topper",
    bio: "Deputy Collector in Maharashtra. I offer tailored mentorship for the rigorous MPSC State Services exam, specifically targeting the Marathi language descriptive papers.",
    exam: "State PSC",
    service: "Deputy Collector",
    posting: "Pune, Maharashtra",
    rank: 6,
    attempts: 2,
    college: "COEP",
    yearsOfExperience: 3,
    rating: 4.8,
    reviewsCount: 165,
    sessions: 450,
    attendance: 98,
    pricing: 1100,
    isVerified: true,
    offerings: [
      { id: "mpsc1", title: "Marathi Descriptive Prep", price: 1100, discount: 15 },
      { id: "mpsc2", title: "State General Studies", price: 1600 }
    ]
  }
};