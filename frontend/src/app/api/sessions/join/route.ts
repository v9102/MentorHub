import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing sessionId" },
        { status: 400 }
      );
    }

    // Get session from global storage
    const sessions = (global as any).sessions || new Map();
    const session = sessions.get(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    // Generate or get roomId
    let roomId = session.roomId;
    if (!roomId) {
      roomId = `room_${sessionId}_${Date.now()}`;
      session.roomId = roomId;
      session.updatedAt = new Date();
      sessions.set(sessionId, session);
    }

    return NextResponse.json({
      success: true,
      roomId,
      session,
    });
  } catch (error) {
    console.error("Error joining session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to join session" },
      { status: 500 }
    );
  }
}
