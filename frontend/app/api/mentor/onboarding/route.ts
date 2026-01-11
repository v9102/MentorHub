import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();

  console.log("Received mentor onboarding data:", data);

  return NextResponse.json({ success: true });
}
