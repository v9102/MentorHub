import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/shared/lib/db";
import User from "@/shared/lib/models/user";

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    console.log("Received mentor onboarding data for user:", user.id);

    await connectDB();

    // Find the user and update their role and profile
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: user.id },
      {
        $set: {
          role: "mentor",
          mentorProfile: data,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error("User not found in database:", user.id);
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
