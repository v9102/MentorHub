import { Calculator, Stethoscope, GraduationCap, BookOpen, Cog, DollarSign, Scale, Globe, Brain, FlaskConical, Search, Calendar, Rocket, BadgeCheck, Target, Coins, Users } from "lucide-react";

export const popularExams = [
    { id: "upsc", name: "UPSC CSE", icon: BookOpen, color: "text-orange-600", bg: "bg-orange-100", link: "/mentors?exam=UPSC+CSE" },
    { id: "ssc", name: "SSC CGL", icon: Calculator, color: "text-blue-600", bg: "bg-blue-100", link: "/mentors?exam=SSC+CGL" },
    { id: "banking", name: "Banking / SBI", icon: DollarSign, color: "text-green-600", bg: "bg-green-100", link: "/mentors?exam=Banking" },
    { id: "statepsc", name: "State PSC", icon: Globe, color: "text-purple-600", bg: "bg-purple-100", link: "/mentors?exam=State+PSC" },
    { id: "defence", name: "Defence", icon: Target, color: "text-teal-600", bg: "bg-teal-100", link: "/mentors?exam=Defence" },
    { id: "railways", name: "Railways", icon: Rocket, color: "text-indigo-600", bg: "bg-indigo-100", link: "/mentors?exam=Railways" },
    { id: "rbi", name: "RBI Grade B", icon: Coins, color: "text-yellow-600", bg: "bg-yellow-100", link: "/mentors?exam=RBI+Grade+B" },
    { id: "gate", name: "GATE", icon: Cog, color: "text-red-600", bg: "bg-red-100", link: "/mentors?exam=GATE" },
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
