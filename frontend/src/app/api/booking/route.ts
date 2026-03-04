import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function POST(request: NextRequest) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, msg: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get Clerk JWT token
    const token = await getToken();

    const body = await request.json();
    const { mentorId, date, startTime, studentDetails } = body;

    if (!mentorId || !date || !startTime) {
      return NextResponse.json(
        { success: false, msg: "mentorId, date, startTime required" },
        { status: 400 }
      );
    }

    // Forward request to backend (endpoint is /api/pay-now)
    const backendUrl = `${BACKEND_URL}/api/pay-now`;
    console.log("[Booking API] Forwarding to:", backendUrl);

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        mentorId,
        date,
        startTime,
        studentDetails
      }),
    });

    const responseText = await backendResponse.text();
    console.log("[Booking API] Backend response status:", backendResponse.status);
    console.log("[Booking API] Backend response:", responseText.substring(0, 200));

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("[Booking API] Failed to parse backend response as JSON");
      return NextResponse.json(
        { success: false, msg: "Invalid response from backend" },
        { status: 502 }
      );
    }

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { success: false, msg: "Failed to create booking" },
      { status: 500 }
    );
  }
}
