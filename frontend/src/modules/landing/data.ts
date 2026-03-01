import { Calculator, Stethoscope, BookOpen, DollarSign, Scale, Target, Briefcase, Search, Calendar, Rocket, BadgeCheck, Coins, Users } from "lucide-react";

export const popularExams = [
    { id: "upsc", name: "UPSC CSE", icon: BookOpen, color: "text-orange-600", bg: "bg-orange-100", link: "/mentors?exam=UPSC+CSE" },
    { id: "banking", name: "Banking", icon: DollarSign, color: "text-green-600", bg: "bg-green-100", link: "/mentors?exam=Banking" },
    { id: "neet", name: "NEET", icon: Stethoscope, color: "text-rose-600", bg: "bg-rose-100", link: "/mentors?exam=NEET" },
    { id: "jee", name: "JEE", icon: Calculator, color: "text-indigo-600", bg: "bg-indigo-100", link: "/mentors?exam=JEE" },
    { id: "cat", name: "CAT", icon: Target, color: "text-amber-600", bg: "bg-amber-100", link: "/mentors?exam=CAT" },
    { id: "ssc", name: "SSC CGL", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100", link: "/mentors?exam=SSC+CGL" },
    { id: "clat", name: "CLAT", icon: Scale, color: "text-purple-600", bg: "bg-purple-100", link: "/mentors?exam=CLAT" },
    { id: "ca", name: "CA/CMA/CS", icon: Calculator, color: "text-emerald-600", bg: "bg-emerald-100", link: "/mentors?exam=CA%2FCMA%2FCS" },
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
    },
    {
        id: "rahul_mishra3",
        name: "Rahul Mishra",
        college: "SBI PO",
        exam: "Banking",
        rank: "Rank 45",
        rating: 4.7,
        reviews: 340,
        hourlyRate: 600,
        tags: ["Quant", "Reasoning"],
        profileImage: "/mentors/rahul.jpg",
    },
    {
        id: "karthik_rajan8",
        name: "Karthik Rajan",
        college: "Dy. Collector",
        exam: "TNPSC",
        rank: "Rank 2",
        rating: 4.9,
        reviews: 300,
        hourlyRate: 800,
        tags: ["TN History", "Admin"],
        profileImage: "/mentors/karthik.jpg",
    },
];

export const howItWorksSteps = [
    {
        id: 1,
        title: "Find Your Officer Mentor",
        description: "Browse through profiles of IAS officers, SBI POs, and top rankers. Filter by exam, service, and optional subject.",
        icon: Search,
    },
    {
        id: 2,
        title: "Book a Strategy Call",
        description: "Connect 1-on-1 via video call. Discuss study plans, answer writing, and interview tips with someone who has done it.",
        icon: Calendar,
    },
    {
        id: 3,
        title: "Serve the Nation",
        description: "Follow the guidance, stay disciplined, and achieve your dream rank to serve in the country's premier institutions.",
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
