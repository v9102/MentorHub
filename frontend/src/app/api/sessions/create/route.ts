import { NextRequest, NextResponse } from "next/server";

interface SessionData {
  sessionId: string;
  mentorId: string;
  studentId: string;
  mentorName: string;
  studentName: string;
  price: number;
  duration: number;
  paymentStatus: string;
  bookingStatus: string;
  scheduledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mock session storage (in-memory for now, replace with Firestore later)
const sessions = new Map<string, SessionData>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mentorId, studentId, mentorName, studentName, price, scheduledAt, duration } = body;

    // Generate session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create session object
    const session = {
      sessionId,
      mentorId,
      studentId,
      mentorName,
      studentName,
      price,
      duration: duration || 30,
      paymentStatus: "paid", // Mock payment - instantly paid
      bookingStatus: "confirmed",
      scheduledAt: new Date(scheduledAt),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store session (in-memory for now)
    sessions.set(sessionId, session);

    // Also store in global for access across routes
    if (typeof global !== 'undefined') {
      const globalObj = global as typeof global & { sessions?: Map<string, SessionData> };
      if (!globalObj.sessions) {
        globalObj.sessions = new Map();
      }
      globalObj.sessions.set(sessionId, session);
    }

    return NextResponse.json({
      success: true,
      sessionId,
      paymentStatus: "paid",
      bookingStatus: "confirmed",
      session,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create session" },
      { status: 500 }
    );
  }
}
