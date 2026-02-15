export type MentorProfile = {
  id: string;
  name: string;
  profilePhoto: string;
  tagLine: string;
  bio: string;
  exam: string;

  // Govt Exam Specific Fields
  service?: string; // e.g., IAS, IPS, IFS, IRS
  posting?: string; // e.g., District Magistrate, SP
  rank?: number; // AIR
  attempts?: number; // Number of attempts to clear
  optionalSubject?: string; // For UPSC mainly

  // Generic
  college?: string; // Kept for educational background
  yearOfPassing?: number;
  subjects: string[];
  specializations: string[];
  yearsOfExperience: number;
  studentsHelped: number;
  rating: number;
  reviewsCount?: number;
  sessions?: number;
  attendance?: number;
  responseTime: string;
  pricing: number;
  availability: string[];
  testimonials: {
    studentName: string;
    text: string;
    rating: number;
  }[];
  offerings?: {
    id: string;
    title: string;
    price: number;
    discount?: number;
    icon?: string;
  }[];
};


export const mockMentors: Record<string, MentorProfile> = {
  "vikram_singh1": {
    id: "vikram_singh1",
    name: "Vikram Singh",
    profilePhoto: "/mentors/vikram.jpg", // Placeholder
    tagLine: "IAS Officer | UPSC CSE AIR 12 | 1st Attempt",
    bio: "Serving IAS officer with 5+ years in administration. specializing in Essay writing, Ethics (GS-4), and Public Administration optional. I help aspirants Decode the matrix of UPSC.",
    exam: "UPSC CSE",
    service: "IAS",
    posting: "Joint Secretary, Ministry of Home Affairs",
    rank: 12,
    attempts: 1,
    optionalSubject: "Public Administration",
    college: "St. Stephens, Delhi",
    yearOfPassing: 2018,
    subjects: ["Essay", "Ethics", "Polity"],
    specializations: ["Answer Writing", "Interview Prep", "Time Management"],
    yearsOfExperience: 5,
    studentsHelped: 1200,
    rating: 4.9,
    reviewsCount: 215,
    sessions: 350,
    attendance: 98,
    responseTime: "Within 6 hours",
    pricing: 1500,
    availability: ["Sat 6-8 PM", "Sun 10-12 AM"],
    testimonials: [{ studentName: "Anjali", text: "His insights on Ethics case studies are unmatched.", rating: 5 }],
    offerings: [
      { id: "1", title: "1:1 Strategy Call", price: 1500, icon: "video" },
      { id: "2", title: "Mains Answer Review", price: 800, discount: 10, icon: "document" }
    ]
  },
  "priyanka_desai2": {
    id: "priyanka_desai2",
    name: "Priyanka Desai",
    profilePhoto: "/mentors/priyanka.jpg",
    tagLine: "IPS Officer | UPSC CSE AIR 145 | Marathi Lit.",
    bio: "IPS officer passionate about teaching. I focus on Marathi Literature Optional and GS-3 Internal Security. Cleared in my 2nd attempt with a full-time job.",
    exam: "UPSC CSE",
    service: "IPS",
    posting: "DCP, Mumbai Police",
    rank: 145,
    attempts: 2,
    optionalSubject: "Marathi Literature",
    college: "Ferguson College, Pune",
    yearOfPassing: 2020,
    subjects: ["Internal Security", "Marathi Literature", "Geography"],
    specializations: ["Optional Strategy", "Working Professional Prep"],
    yearsOfExperience: 3,
    studentsHelped: 850,
    rating: 4.8,
    reviewsCount: 120,
    sessions: 200,
    attendance: 95,
    responseTime: "Within 4 hours",
    pricing: 1200,
    availability: ["Sun 4-7 PM"],
    testimonials: [{ studentName: "Rohan", text: "Best mentor for Marathi optional!", rating: 5 }]
  },
  "rahul_mishra3": {
    id: "rahul_mishra3",
    name: "Rahul Mishra",
    profilePhoto: "/mentors/rahul.jpg",
    tagLine: "SBI PO | Crack Banking Exams in 3 Months",
    bio: "Cleared SBI PO, IBPS PO, and RRB PO back-to-back. Expert in Quantitative Aptitude and Logical Reasoning shortcuts. I teach speed maths and puzzle solving.",
    exam: "Banking",
    service: "Probationary Officer",
    posting: "SBI, Main Branch Delhi",
    rank: 45,
    attempts: 1,
    college: "Delhi University",
    yearOfPassing: 2022,
    subjects: ["Quantitative Aptitude", "Reasoning", "Banking Awareness"],
    specializations: ["Speed Maths", "Puzzles", "Data Interpretation"],
    yearsOfExperience: 2,
    studentsHelped: 2000,
    rating: 4.7,
    reviewsCount: 340,
    sessions: 500,
    attendance: 99,
    responseTime: "Within 1 hour",
    pricing: 600,
    availability: ["Daily 8-10 PM"],
    testimonials: [{ studentName: "Sneha", text: "His short tricks are a lifesaver.", rating: 5 }]
  },
  "amit_kumar4": {
    id: "amit_kumar4",
    name: "Amit Kumar",
    profilePhoto: "/mentors/amit.jpg",
    tagLine: "SSC CGL AIR 5 | ASO in MEA",
    bio: "Current ASO in Ministry of External Affairs. Top scorer in SSC CGL Maths and English. I help students target 190+ in Mains.",
    exam: "SSC CGL",
    service: "ASO (MEA)",
    posting: "Ministry of External Affairs, Delhi",
    rank: 5,
    attempts: 2,
    college: "BHU",
    yearOfPassing: 2019,
    subjects: ["Maths", "English", "General Awareness"],
    specializations: ["Geometry", "Grammar Rules", "Current Affairs"],
    yearsOfExperience: 4,
    studentsHelped: 1500,
    rating: 4.9,
    reviewsCount: 280,
    sessions: 400,
    attendance: 97,
    responseTime: "Within 3 hours",
    pricing: 900,
    availability: ["Sat 2-6 PM", "Sun 2-6 PM"],
    testimonials: [{ studentName: "Vikas", text: "Cleared CGL thanks to his guidance.", rating: 5 }]
  },
  "dr_aditi_gupta5": {
    id: "dr_aditi_gupta5",
    name: "Dr. Aditi Gupta",
    profilePhoto: "/mentors/aditi.jpg",
    tagLine: "IFS Officer | Foreign Service | Anthropology",
    bio: "Indian Foreign Service officer. I guide students on International Relations and Anthropology optional. Let's discuss global diplomacy and your UPSC strategy.",
    exam: "UPSC CSE",
    service: "IFS",
    posting: "Ministry of External Affairs",
    rank: 18,
    attempts: 2,
    optionalSubject: "Anthropology",
    college: "JNU",
    yearOfPassing: 2021,
    subjects: ["International Relations", "Anthropology", "Essay"],
    specializations: ["Diplomacy", "Optional Strategy"],
    yearsOfExperience: 3,
    studentsHelped: 600,
    rating: 5.0,
    reviewsCount: 95,
    sessions: 150,
    attendance: 90,
    responseTime: "Within 12 hours",
    pricing: 2000,
    availability: ["Sun 9-11 AM"],
    testimonials: [{ studentName: "Karan", text: "Her perspective on IR is brilliant.", rating: 5 }]
  },
  "suresh_yadav6": {
    id: "suresh_yadav6",
    name: "Suresh Yadav",
    profilePhoto: "/mentors/suresh.jpg",
    tagLine: "Railways (IRTS) | RRB NTPC Topper",
    bio: "Serving IRTS officer. Expert in General Science and Railways specific General Awareness. I help you crack RRB NTPC and Group D exams.",
    exam: "Railways",
    service: "IRTS",
    posting: "Northern Railways",
    rank: 1,
    attempts: 1,
    college: "NIT Patna",
    yearOfPassing: 2018,
    subjects: ["General Science", "Reasoning", "Railways GA"],
    specializations: ["Physics", "History", "Railways"],
    yearsOfExperience: 5,
    studentsHelped: 3000,
    rating: 4.6,
    reviewsCount: 410,
    sessions: 600,
    attendance: 94,
    responseTime: "Within 24 hours",
    pricing: 500,
    availability: ["Mon-Fri 9-10 PM"],
    testimonials: [{ studentName: "Deepak", text: "Great for RRB prep.", rating: 4 }]
  },
  "neha_sharma7": {
    id: "neha_sharma7",
    name: "Neha Sharma",
    profilePhoto: "/mentors/neha.jpg",
    tagLine: "RBI Grade B Officer | Economy Expert",
    bio: "Strategy to crack RBI Grade B Phase 1 & 2. Specialize in Economic & Social Issues (ESI) and Finance & Management (FM).",
    exam: "RBI Grade B",
    service: "Manager",
    posting: "RBI Mumbai",
    rank: 8,
    attempts: 2,
    college: "LSR, Delhi",
    yearOfPassing: 2020,
    subjects: ["Economics", "Finance", "Management"],
    specializations: ["ESI", "Finance", "Descriptive English"],
    yearsOfExperience: 3,
    studentsHelped: 900,
    rating: 4.8,
    reviewsCount: 150,
    sessions: 250,
    attendance: 96,
    responseTime: "Within 5 hours",
    pricing: 1100,
    availability: ["Sat 10-2 PM"],
    testimonials: [{ studentName: "Pooja", text: "Best mentor for RBI aspirants.", rating: 5 }]
  },
  "karthik_rajan8": {
    id: "karthik_rajan8",
    name: "Karthik Rajan",
    profilePhoto: "/mentors/karthik.jpg",
    tagLine: "TNPSC Group 1 Topper | Dy. Collector",
    bio: "Deputy Collector in Tamil Nadu Government. I guide students for TNPSC Group 1 and Group 2 exams, focusing on Tamil Nadu History and Administration.",
    exam: "State PSC",
    service: "Deputy Collector",
    posting: "Chennai",
    rank: 2,
    attempts: 3,
    college: "Madras Christian College",
    yearOfPassing: 2019,
    subjects: ["TN History", "Administration", "Current Affairs"],
    specializations: ["State Specifics", "Mains Strategy"],
    yearsOfExperience: 4,
    studentsHelped: 2200,
    rating: 4.9,
    reviewsCount: 300,
    sessions: 450,
    attendance: 98,
    responseTime: "Within 8 hours",
    pricing: 800,
    availability: ["Sun 10-1 PM"],
    testimonials: [{ studentName: "Anand", text: "Very helpful for State PSC.", rating: 5 }]
  },
  "arun_patel9": {
    id: "arun_patel9",
    name: "Arun Patel",
    profilePhoto: "/mentors/arun.jpg",
    tagLine: "IRS (C&IT) | UPSC CSE | Economy",
    bio: "IRS Officer (Customs & Indirect Taxes). helping students with Economy and General Studies. Simplified approach to complex economic concepts.",
    exam: "UPSC CSE",
    service: "IRS (C&IT)",
    posting: "Ahmedabad",
    rank: 210,
    attempts: 3,
    college: "IIM Indore",
    yearOfPassing: 2017,
    subjects: ["Economy", "GS-3", "Ethics"],
    specializations: ["Budget", "Economic Survey", "Taxation"],
    yearsOfExperience: 6,
    studentsHelped: 1100,
    rating: 4.7,
    reviewsCount: 180,
    sessions: 300,
    attendance: 93,
    responseTime: "Within 10 hours",
    pricing: 1300,
    availability: ["Sat 4-8 PM"],
    testimonials: [{ studentName: "Meera", text: "Economy made simple.", rating: 5 }]
  },
  "manoj_verma10": {
    id: "manoj_verma10",
    name: "Manoj Verma",
    profilePhoto: "/mentors/manoj.jpg",
    tagLine: "NDA Topper | Defence Aspirant Mentor",
    bio: "Ex-NDA Cadet. Mentoring students for NDA, CDS, and AFCAT. Focus on SSB Interview psychology and GTO tasks.",
    exam: "Defence",
    service: "Lieutenant (Retd.)",
    posting: "N/A",
    rank: 15,
    attempts: 1,
    college: "NDA Pune",
    yearOfPassing: 2018,
    subjects: ["SSB Interview", "Maths", "General Ability"],
    specializations: ["SSB Psychology", "GTO", "Lecturette"],
    yearsOfExperience: 5,
    studentsHelped: 3500,
    rating: 4.9,
    reviewsCount: 500,
    sessions: 800,
    attendance: 99,
    responseTime: "Within 2 hours",
    pricing: 1000,
    availability: ["Daily 6-9 PM"],
    testimonials: [{ studentName: "Vijay", text: "Cleared SSB in first attempt!", rating: 5 }]
  }
};