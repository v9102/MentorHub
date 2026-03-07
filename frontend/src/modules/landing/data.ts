import {
  Calculator,
  Stethoscope,
  Landmark,
  IndianRupee,
  Scale,
  TrendingUp,
  Briefcase,
  FileSpreadsheet,
  Search,
  Calendar,
  Rocket,
  BadgeCheck,
  Coins,
  Users,
  Target,
} from "lucide-react";

export const popularExams = [
  { id: "upsc", name: "UPSC CSE", icon: Landmark, color: "text-blue-500", bg: "bg-blue-50", link: "/mentors?exam=UPSC+CSE" },
  { id: "banking", name: "Banking", icon: IndianRupee, color: "text-blue-500", bg: "bg-blue-50", link: "/mentors?exam=Banking" },
  { id: "neet", name: "NEET", icon: Stethoscope, color: "text-blue-500", bg: "bg-blue-50", link: "/mentors?exam=NEET" },
  { id: "jee", name: "JEE", icon: Calculator, color: "text-blue-500", bg: "bg-blue-50", link: "/mentors?exam=JEE" },
  { id: "cat", name: "CAT", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50", link: "/mentors?exam=CAT" },
  { id: "ssc", name: "SSC CGL", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-50", link: "/mentors?exam=SSC+CGL" },
  { id: "clat", name: "CLAT", icon: Scale, color: "text-blue-500", bg: "bg-blue-50", link: "/mentors?exam=CLAT" },
  { id: "ca", name: "CA/CMA/CS", icon: FileSpreadsheet, color: "text-blue-500", bg: "bg-blue-50", link: "/mentors?exam=CA%2FCMA%2FCS" },
];

export const featuredMentors = [
    {
        id: "vikram_singh1",
        name: "Vikram Singh",
        college: "IAS Officer",
        exam: "UPSC CSE",
        rank: "AIR 12",
        rating: 4.9,
        reviews: 215,
        hourlyRate: 1500,
        tags: ["Ethics", "Essay", "Polity"],
        profileImage: "/mentors/vikram.jpg",
        bio: "UPSC CSE AIR 12 — guiding aspirants through Ethics, Essay & Polity with proven strategies.",
    },
    {
        id: "amit_kumar4",
        name: "Amit Kumar",
        college: "ASO (MEA)",
        exam: "SSC CGL",
        rank: "AIR 5",
        rating: 4.9,
        reviews: 280,
        hourlyRate: 900,
        tags: ["Maths", "English"],
        profileImage: "/mentors/amit.jpg",
        bio: "SSC topper helping candidates master Quant and English for CGL and allied exams.",
    },
    {
        id: "rahul_mishra3",
        name: "Rahul Mishra",
        college: "SBI PO",
        exam: "SBI PO",
        rank: "Rank 45",
        rating: 4.7,
        reviews: 340,
        hourlyRate: 600,
        tags: ["Quant", "Reasoning"],
        profileImage: "/mentors/rahul.jpg",
        bio: "Banking exam specialist with hands-on tips for Quant, Reasoning & interview prep.",
    },
    {
        id: "karthik_rajan8",
        name: "Karthik Rajan",
        college: "Dy. Collector",
        exam: "TNPSC Group 1",
        rank: "Rank 2",
        rating: 4.9,
        reviews: 300,
        hourlyRate: 800,
        tags: ["TN History", "Admin"],
        profileImage: "/mentors/karthik.jpg",
        bio: "TNPSC Group 1 Rank 2 — mentoring aspirants in Tamil Nadu History & Public Administration.",
    },
];

export const howItWorksSteps = [
    {
        id: 1,
        title: "Find Your Mentor",
        description: "Browse verified mentors who've already achieved what you're aiming for. Filter by goal, exam, or domain.",
        icon: Search,
    },
    {
        id: 2,
        title: "Book a 1-on-1 Session",
        description: "Connect via video call. Get a personalised roadmap, clear your doubts, and learn exactly what it takes to succeed.",
        icon: Calendar,
    },
    {
        id: 3,
        title: "Achieve Your Goal",
        description: "Follow the guidance, stay consistent, and reach the milestone you've been working towards.",
        icon: Rocket,
    },
];

export const benefits = [
    {
        title: "Verified Officers",
        description: "Every mentor is manually verified. Learn from serving officers and rank holders who have cleared the exam.",
        icon: BadgeCheck,
    },
    {
        title: "Prelims to Interview",
        description: "Get guidance for every stage - from clearing Prelims cutoffs to acing the Personality Test.",
        icon: Target,
    },
    {
        title: "Affordable Guidance",
        description: "Premium mentorship at a fraction of the cost of big coaching institutes.",
        icon: Coins,
    },
    {
        title: "Community of Aspirants",
        description: "Join a community of serious aspirants and stay motivated throughout your journey.",
        icon: Users,
    },
];
