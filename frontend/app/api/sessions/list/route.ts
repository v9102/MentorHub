import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const role = searchParams.get("role"); // "mentor" or "student"

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: "Missing userId or role" },
        { status: 400 }
      );
    }

    // Get all sessions from global storage
    const sessions = (global as any).sessions || new Map();
    const allSessions = Array.from(sessions.values());

    // Filter sessions based on role
    const userSessions = allSessions.filter((session: any) => {
      if (role === "mentor") {
        return session.mentorId === userId;
      } else if (role === "student") {
        return session.studentId === userId;
      }
      return false;
    });

    // Sort by scheduled time (upcoming first)
    userSessions.sort((a: any, b: any) => {
      return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
    });

    return NextResponse.json({
      success: true,
      sessions: userSessions,
    });
  } catch (error) {
    console.error("Error listing sessions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to list sessions" },
      { status: 500 }
    );
  }
}
