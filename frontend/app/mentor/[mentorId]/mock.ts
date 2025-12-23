export type MentorProfile = {
  id: string;
  name: string;
  profilePhoto: string;
  tagLine: string;
  bio: string;
  exam: string;
  college: string;
  branch: string;
  rank: number;
  yearOfPassing: number;
  subjects: string[];
  specializations: string[];
  yearsOfExperience: number;
  studentsHelped: number;
  rating: number;
  responseTime: string;
  pricing: number;
  availability: string[];
  testimonials: {
    studentName: string;
    text: string;
    rating: number;
  }[];
};

export const mockMentors: Record<string, MentorProfile> = {
  "edensaha1": {
    id: "edensaha1",
    name: "Eden Saha",
    profilePhoto: "/mentors/eden.jpg",
    tagLine: "IIT Bombay | AIR 45 | JEE Advanced",
    bio: "Passionate educator with 5 years of experience helping students crack the toughest engineering entrance exams with a focus on conceptual clarity.",
    exam: "JEE Advanced",
    college: "IIT Bombay",
    branch: "Computer Science",
    rank: 45,
    yearOfPassing: 2019,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    specializations: ["Mechanics", "Organic Chemistry", "Calculus"],
    yearsOfExperience: 5,
    studentsHelped: 150,
    rating: 4.8,
    responseTime: "Within 2 hours",
    pricing: 1000,
    availability: ["Mon 5-7 PM", "Wed 6-8 PM", "Sat 10-12 AM"],
    testimonials: [{ studentName: "Priya", text: "Amazing mentor!", rating: 5 }]
  },
  "priya_sharma2": {
    id: "priya_sharma2",
    name: "Dr. Priya Sharma",
    profilePhoto: "/mentors/priya.jpg",
    tagLine: "AIIMS Delhi | NEET AIR 12 | MBBS",
    bio: "Currently a resident doctor at AIIMS. I specialize in making Biology interesting through visualizations and focus heavily on NCERT line-by-line prep.",
    exam: "NEET",
    college: "AIIMS Delhi",
    branch: "Medicine",
    rank: 12,
    yearOfPassing: 2021,
    subjects: ["Biology", "Chemistry"],
    specializations: ["Genetics", "Human Physiology", "Inorganic Chemistry"],
    yearsOfExperience: 3,
    studentsHelped: 450,
    rating: 4.9,
    responseTime: "Within 1 hour",
    pricing: 1200,
    availability: ["Tue 7-9 PM", "Thu 7-9 PM", "Sun 10-12 AM"],
    testimonials: [{ studentName: "Rahul", text: "Her Biology notes are the best!", rating: 5 }]
  },
  "arjun_malhotra3": {
    id: "arjun_malhotra3",
    name: "Arjun Malhotra",
    profilePhoto: "/mentors/arjun.jpg",
    tagLine: "IIM Ahmedabad | CAT 99.98%ile",
    bio: "MBA graduate with a knack for Quant and DILR. I help students master speed-solving techniques and logical mapping for CAT.",
    exam: "CAT",
    college: "IIM Ahmedabad",
    branch: "Management",
    rank: 1,
    yearOfPassing: 2020,
    subjects: ["Quantitative Aptitude", "DILR"],
    specializations: ["Number Systems", "Algebra", "Logical Reasoning"],
    yearsOfExperience: 4,
    studentsHelped: 300,
    rating: 5.0,
    responseTime: "Within 3 hours",
    pricing: 2000,
    availability: ["Sat 2-5 PM", "Sun 2-5 PM"],
    testimonials: [{ studentName: "Sana", text: "The shortcuts he taught saved me 20 mins in the exam!", rating: 5 }]
  },
  "sneha_reddy4": {
    id: "sneha_reddy4",
    name: "Sneha Reddy",
    profilePhoto: "/mentors/sneha.jpg",
    tagLine: "IIT Madras | GATE AIR 15 | Aerospace",
    bio: "Core engineering enthusiast. I focus on GATE preparation for Mechanical and Aerospace branches with emphasis on Mathematics.",
    exam: "GATE",
    college: "IIT Madras",
    branch: "Aerospace Engineering",
    rank: 15,
    yearOfPassing: 2018,
    subjects: ["Mathematics", "Fluid Mechanics", "Thermodynamics"],
    specializations: ["Calculus", "Aerodynamics"],
    yearsOfExperience: 6,
    studentsHelped: 180,
    rating: 4.7,
    responseTime: "Within 5 hours",
    pricing: 1500,
    availability: ["Mon-Fri 8-9 PM"],
    testimonials: [{ studentName: "Vikram", text: "Very deep technical knowledge.", rating: 4 }]
  },
  "ishaan_gupta5": {
    id: "ishaan_gupta5",
    name: "Ishaan Gupta",
    profilePhoto: "/mentors/ishaan.jpg",
    tagLine: "SRCC Delhi | CUET 800/800 | Commerce Wiz",
    bio: "Helping students get into top Delhi University colleges. Expert in Accountancy and Business Studies for CUET.",
    exam: "CUET",
    college: "SRCC Delhi",
    branch: "B.Com (Hons)",
    rank: 1,
    yearOfPassing: 2023,
    subjects: ["Accountancy", "Business Studies", "Economics"],
    specializations: ["Company Accounts", "Macroeconomics"],
    yearsOfExperience: 1,
    studentsHelped: 120,
    rating: 4.6,
    responseTime: "Within 30 mins",
    pricing: 600,
    availability: ["Wed 4-6 PM", "Sat 11-1 AM"],
    testimonials: [{ studentName: "Megha", text: "Super friendly and helpful.", rating: 5 }]
  },
  "ananya_verma6": {
    id: "ananya_verma6",
    name: "Ananya Verma",
    profilePhoto: "/mentors/ananya.jpg",
    tagLine: "UPSC CSE AIR 120 | History Expert",
    bio: "Currently in training. I provide guidance on UPSC answer writing, current affairs analysis, and optional subject strategy.",
    exam: "UPSC",
    college: "St. Stephens, Delhi",
    branch: "History",
    rank: 120,
    yearOfPassing: 2017,
    subjects: ["History", "General Studies", "Ethics"],
    specializations: ["Modern History", "Answer Writing"],
    yearsOfExperience: 4,
    studentsHelped: 500,
    rating: 4.9,
    responseTime: "Within 24 hours",
    pricing: 2500,
    availability: ["Sunday 10 AM - 1 PM"],
    testimonials: [{ studentName: "Aditya", text: "Her feedback on my essays was game-changing.", rating: 5 }]
  },
  "rohit_bisht7": {
    id: "rohit_bisht7",
    name: "Rohit Bisht",
    profilePhoto: "/mentors/rohit.jpg",
    tagLine: "NIT Trichy | JEE Mains Expert",
    bio: "Focused specifically on JEE Mains strategy. I help students improve their score from 150 to 250+ through rigorous mock analysis.",
    exam: "JEE Mains",
    college: "NIT Trichy",
    branch: "Electrical Engineering",
    rank: 1200,
    yearOfPassing: 2021,
    subjects: ["Physics", "Mathematics"],
    specializations: ["Electrostatics", "Coordinate Geometry"],
    yearsOfExperience: 3,
    studentsHelped: 250,
    rating: 4.5,
    responseTime: "Within 4 hours",
    pricing: 800,
    availability: ["Tue 5-7 PM", "Fri 5-7 PM"],
    testimonials: [{ studentName: "Karan", text: "The mock analysis sessions are worth it.", rating: 4 }]
  },
  "kavya_nair8": {
    id: "kavya_nair8",
    name: "Kavya Nair",
    profilePhoto: "/mentors/kavya.jpg",
    tagLine: "NLSIU Bangalore | CLAT AIR 42",
    bio: "Specialist in Legal Reasoning and English for Law entrance exams. I simplify complex legal maxims and case laws.",
    exam: "CLAT",
    college: "NLSIU Bangalore",
    branch: "Law",
    rank: 42,
    yearOfPassing: 2019,
    subjects: ["Legal Reasoning", "English", "Logical Reasoning"],
    specializations: ["Torts", "Constitutional Law"],
    yearsOfExperience: 5,
    studentsHelped: 210,
    rating: 4.8,
    responseTime: "Within 2 hours",
    pricing: 1300,
    availability: ["Mon 6-8 PM", "Wed 6-8 PM"],
    testimonials: [{ studentName: "Ishita", text: "Helped me clear NLSIU!", rating: 5 }]
  },
  "manish_kumar9": {
    id: "manish_kumar9",
    name: "Manish Kumar",
    profilePhoto: "/mentors/manish.jpg",
    tagLine: "IIT Delhi | Physics Gold Medalist",
    bio: "I believe Physics is to be felt, not just solved. I focus on building intuition for JEE Advanced level problems.",
    exam: "JEE Advanced",
    college: "IIT Delhi",
    branch: "Engineering Physics",
    rank: 110,
    yearOfPassing: 2016,
    subjects: ["Physics"],
    specializations: ["Optics", "Modern Physics", "Rotational Dynamics"],
    yearsOfExperience: 8,
    studentsHelped: 400,
    rating: 4.9,
    responseTime: "Within 6 hours",
    pricing: 1800,
    availability: ["Sat 4-6 PM", "Sun 4-6 PM"],
    testimonials: [{ studentName: "Deepak", text: "Physics wizard!", rating: 5 }]
  },
  "tanvi_gupta10": {
    id: "tanvi_gupta10",
    name: "Tanvi Gupta",
    profilePhoto: "/mentors/tanvi.jpg",
    tagLine: "MAMC Delhi | NEET Biology Specialist",
    bio: "Mastering the NCERT is 90% of NEET. I help you with that remaining 10% of high-yield concepts that rank you higher.",
    exam: "NEET",
    college: "MAMC Delhi",
    branch: "Medicine",
    rank: 250,
    yearOfPassing: 2022,
    subjects: ["Biology"],
    specializations: ["Plant Physiology", "Ecology"],
    yearsOfExperience: 2,
    studentsHelped: 150,
    rating: 4.7,
    responseTime: "Within 1 hour",
    pricing: 900,
    availability: ["Daily 9-10 PM"],
    testimonials: [{ studentName: "Ritu", text: "Great mnemonics for Biology.", rating: 5 }]
  }
};