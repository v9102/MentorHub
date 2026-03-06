import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { connectDB } from "@/shared/lib/db";
import User from "@/shared/lib/models/user";

function validateOnboardingData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.basicInfo) {
    errors.push("Basic info is required");
  } else {
    const firstName = data.basicInfo.firstName;
    const lastName = data.basicInfo.lastName;

    if (!firstName || (typeof firstName === 'string' && !firstName.trim())) {
      errors.push("First name is required");
    }
    if (!lastName || (typeof lastName === 'string' && !lastName.trim())) {
      errors.push("Last name is required");
    }
  }

  if (data.expertise) {
    if (data.expertise.subjects && !Array.isArray(data.expertise.subjects)) {
      errors.push("Subjects must be an array");
    }
  }

  if (data.pricing) {
    if (data.pricing.pricePerSession !== undefined) {
      const price = Number(data.pricing.pricePerSession);
      if (isNaN(price)) {
        errors.push("Price per session must be a valid number");
      }
    }
    if (data.pricing.sessionDuration !== undefined) {
      const duration = Number(data.pricing.sessionDuration);
      if (isNaN(duration)) {
        errors.push("Session duration must be a valid number");
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await req.json();

    const validation = validateOnboardingData(data);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: `Validation failed: ${validation.errors.join(", ")}`,
          details: validation.errors
        },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ clerkId: user.id });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found. Please sign in again." },
        { status: 404 }
      );
    }

    if (existingUser.role === "mentor") {
      return NextResponse.json(
        { success: false, error: "You are already registered as a mentor" },
        { status: 400 }
      );
    }

    const EXAM_DISPLAY_NAMES: Record<string, string> = {
      upsc: "UPSC CSE",
      banking: "Banking",
      neet: "NEET",
      jee: "JEE",
      cat: "CAT",
      ssc: "SSC CGL",
      clat: "CLAT",
      ca: "CA/CMA/CS",
    };

    const mentorProfile: any = {};

    if (data.basicInfo) {
      mentorProfile.basicInfo = {
        gender: data.basicInfo.gender,
        currentOrganisation: data.basicInfo.currentOrganisation,
        industry: data.basicInfo.industry,
        currentRole: data.basicInfo.currentRole,
        workExperience: data.basicInfo.workExperience,
        profilePhoto: data.basicInfo.profilePhoto || user.imageUrl,
      };
    }

    if (data.professionalInfo) {
      mentorProfile.professionalInfo = data.professionalInfo;
    }

    if (data.expertise) {
      mentorProfile.expertise = {
        subjects: data.expertise.subjects || [],
        specializations: data.expertise.specializations || "",
      };

      // Build full examDetails from expertise (college, rank, percentile, attempts, selectionYear, etc.)
      const examCode = data.expertise.examExpertise || "";
      const examName = EXAM_DISPLAY_NAMES[examCode] || examCode || "";
      const examDetail: Record<string, string> = {};
      if (examName) examDetail.examName = examName;
      if (data.expertise.college) examDetail.college = String(data.expertise.college);
      if (data.expertise.rank != null) examDetail.rank = String(data.expertise.rank);
      else if (data.expertise.rankOrScore) examDetail.rank = String(data.expertise.rankOrScore);
      if (data.expertise.percentile != null) examDetail.percentile = String(data.expertise.percentile);
      if (data.expertise.timesMainsAppeared != null) examDetail.attempts = String(data.expertise.timesMainsAppeared);
      if (data.expertise.yearOfSelection) examDetail.selectionYear = String(data.expertise.yearOfSelection);
      else if (data.expertise.selectedYear) examDetail.selectionYear = String(data.expertise.selectedYear);
      if (Object.keys(examDetail).length > 0) {
        if (!examDetail.examName) examDetail.examName = "General";
        mentorProfile.examDetails = [examDetail];
      }
    }

    if (data.availability) {
      if (Array.isArray(data.availability)) {
        mentorProfile.availability = data.availability;
      } else if (data.availability.days && data.availability.timeSlots) {
        mentorProfile.availability = data.availability.days.map((day: string) => ({
          day,
          slots: data.availability.timeSlots.map((slot: string) => ({
            startTime: slot,
            endTime: slot,
            sessionDuration: data.pricing?.sessionDuration || 30,
          })),
        }));
      }
    }

    if (data.pricing) {
      mentorProfile.pricing = {
        pricePerSession: Number(data.pricing.pricePerSession) || 0,
        sessionDuration: Number(data.pricing.sessionDuration) || 30,
        isFreeTrialEnabled: data.pricing.isFreeTrialEnabled || false,
      };
    }

    if (data.verification) {
      mentorProfile.verification = {
        idType: data.verification.idType,
        idNumber: data.verification.idNumber,
        isVerified: false,
        applicationStatus: "pending",
      };
    } else {
      mentorProfile.verification = {
        isVerified: false,
        applicationStatus: "pending",
      };
    }

    if (data.expertise?.keyHighlights) {
      mentorProfile.bio = data.expertise.keyHighlights;
    }

    const updatePayload: Record<string, unknown> = {
      role: "mentor",
      name: `${data.basicInfo?.firstName || ""} ${data.basicInfo?.lastName || ""}`.trim() || existingUser.name,
      mentorProfile,
      isProfileComplete: true,
    };

    // Save preferred languages to User.languages (for mentor card display)
    if (data.basicInfo?.preferredLanguages?.length) {
      updatePayload.languages = data.basicInfo.preferredLanguages;
    }

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: user.id },
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "Failed to update user profile" },
        { status: 500 }
      );
    }

    try {
      const client = await clerkClient();
      await client.users.updateUser(user.id, {
        publicMetadata: {
          role: "mentor",
          isProfileComplete: true,
        },
      });
    } catch {
    }

    return NextResponse.json({
      success: true,
      message: "Mentor profile created successfully",
      data: {
        id: updatedUser._id,
        role: updatedUser.role,
        name: updatedUser.name,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        return NextResponse.json(
          { success: false, error: "Validation error", details: error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
