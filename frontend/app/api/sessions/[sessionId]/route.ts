import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    // Get session from global storage
    const sessions = (global as any).sessions || new Map();
    const session = sessions.get(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}
