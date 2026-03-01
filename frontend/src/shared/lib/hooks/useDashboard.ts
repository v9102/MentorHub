"use client";

import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";

// Types for dashboard data
export interface DashboardSession {
  bookingId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  mentor: {
    id: string;
    name: string;
    imageUrl: string;
  };
  student: {
    id: string;
    name: string;
    imageUrl: string;
  };
  meetingLink?: string;
  price?: number;
  createdAt?: string;
}

export interface DashboardProfile {
  _id: string;
  clerkId: string;
  name: string;
  email: string;
  imageUrl: string;
  role: string;
  mentorProfile: {
    basicInfo: {
      currentRole?: string;
      currentOrganisation?: string;
      workExperience?: number;
      about?: string;
      profilePhoto?: string;
    };
    professionalInfo: {
      college?: string;
      branch?: string;
      passingYear?: number;
      highestQualification?: string;
    };
    expertise: {
      subjects?: string[];
      specializations?: string;
    };
    availability: {
      days?: string[];
      timeSlots?: string[];
    };
    pricing: {
      pricePerSession?: number;
      sessionDuration?: number;
      isFreeTrialEnabled?: boolean;
    };
    upcomingSessions?: Array<{
      date: string;
      startTime: string;
      endTime: string;
      isBooked: boolean;
      bookedBy?: string;
    }>;
  };
  availabilityMatrix?: any;
}

// Custom error class for better error handling
class FetchError extends Error {
  status: number;
  info?: { success: boolean; msg: string };
  
  constructor(message: string, status: number, info?: { success: boolean; msg: string }) {
    super(message);
    this.name = 'FetchError';
    this.status = status;
    this.info = info;
  }
}

// Authenticated fetcher that includes the Clerk token
const createAuthFetcher = (getToken: () => Promise<string | null>) => {
  return async (url: string) => {
    const token = await getToken();
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    
    if (!res.ok) {
      // Try to parse error response for more context
      let errorInfo: { success: boolean; msg: string } | undefined;
      try {
        errorInfo = await res.json();
      } catch {
        // Ignore JSON parse errors
      }
      
      // Handle specific error cases gracefully
      if (res.status === 404 && errorInfo?.msg === "User not found") {
        // User exists in Clerk but not in backend database yet
        // Return empty data instead of throwing
        return { success: true, sessions: [], count: 0 };
      }
      
      const error = new FetchError(
        errorInfo?.msg || "An error occurred while fetching the data.",
        res.status,
        errorInfo
      );
      throw error;
    }
    
    return res.json();
  };
};

/**
 * Hook to fetch upcoming sessions for dashboard
 */
export function useUpcomingSessions() {
  const { getToken, isSignedIn } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    count: number;
    sessions: DashboardSession[];
  }>(
    isSignedIn ? "/api/dashboard/sessions" : null,
    createAuthFetcher(getToken),
    {
      revalidateOnFocus: false,
      refreshInterval: 60000, // Refresh every minute
    }
  );

  return {
    sessions: data?.sessions || [],
    count: data?.count || 0,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

/**
 * Hook to fetch session history for dashboard
 */
export function useSessionHistory() {
  const { getToken, isSignedIn } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    count: number;
    sessions: DashboardSession[];
  }>(
    isSignedIn ? "/api/dashboard/history" : null,
    createAuthFetcher(getToken),
    {
      revalidateOnFocus: false,
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  );

  return {
    sessions: data?.sessions || [],
    count: data?.count || 0,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

/**
 * Hook to fetch and update mentor profile
 */
export function useMentorProfile() {
  const { getToken, isSignedIn } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    mentor: DashboardProfile;
  }>(
    isSignedIn ? "/api/dashboard/profile" : null,
    createAuthFetcher(getToken),
    {
      revalidateOnFocus: false,
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  );

  const updateProfile = async (profileData: Partial<DashboardProfile["mentorProfile"]>) => {
    const token = await getToken();
    
    const res = await fetch("/api/dashboard/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(profileData),
    });

    if (!res.ok) {
      throw new Error("Failed to update profile");
    }

    const result = await res.json();
    mutate(); // Revalidate the profile data
    return result;
  };

  return {
    profile: data?.mentor,
    isLoading,
    isError: !!error,
    error,
    mutate,
    updateProfile,
  };
}

/**
 * Compute dashboard statistics from sessions
 */
export function useDashboardStats() {
  const { sessions: upcomingSessions, isLoading: upcomingLoading } = useUpcomingSessions();
  const { sessions: historySession, isLoading: historyLoading } = useSessionHistory();

  const allSessions = [...upcomingSessions, ...historySession];
  
  // Calculate stats
  const completedSessions = allSessions.filter(s => s.status === "completed").length;
  const totalEarnings = allSessions
    .filter(s => s.status === "completed")
    .reduce((sum, s) => sum + (s.price || 0), 0);
  
  // Get unique students
  const uniqueStudents = new Set(allSessions.map(s => s.student.id)).size;
  
  // Upcoming sessions count
  const upcomingCount = upcomingSessions.filter(
    s => s.status !== "cancelled" && s.status !== "completed"
  ).length;

  return {
    completedSessions,
    totalEarnings,
    activeStudents: uniqueStudents,
    upcomingCount,
    isLoading: upcomingLoading || historyLoading,
  };
}
