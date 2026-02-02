import { mockMentors, MentorProfile } from "@/app/(public)/mentors/mock";

// const BACKEND_URL = "https://mentorhub-backend-5gk6jbun2q-el.a.run.app";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // For local development, fallback to localhost:3000
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
};

export const fetchMentors = async (): Promise<MentorProfile[]> => {
  try {
    const baseUrl = getBaseUrl();
    console.log(`Fetching mentors from: ${baseUrl}/api/mentors`);

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
      return data;
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
  const mentors = await fetchMentors();
  return mentors.find((mentor) => mentor.id === id);
};
