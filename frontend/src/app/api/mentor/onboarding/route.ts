import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("Received mentor onboarding data, forwarding to backend...");

    const response = await fetch("http://localhost:5000/api/mentor/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      return NextResponse.json({ success: false, error: errorText }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
