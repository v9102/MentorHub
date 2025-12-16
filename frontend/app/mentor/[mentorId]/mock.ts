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
    bio: "Passionate educator with 5 years of experience...",
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
    testimonials: [
      {
        studentName: "Priya",
        text: "Amazing mentor!",
        rating: 5
      }
    ]
  }
};