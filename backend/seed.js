import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/user.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const generateSessions = () => {
  const sessions = [];
  const today = new Date();

  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    // Fixed 3 slots per day
    const baseTimes = ["12:00", "12:30", "13:00"];

    baseTimes.forEach((time) => {
      const [h, m] = time.split(":").map(Number);

      const sessionDate = new Date(date);
      sessionDate.setHours(h, m, 0, 0);

      const endDate = new Date(sessionDate);
      endDate.setMinutes(endDate.getMinutes() + 30);

      sessions.push({
        date: sessionDate,
        startTime: time, // stored as "HH:mm"
        endTime: endDate.toTimeString().slice(0, 5),
        sessionDuration: 30,
        isBooked: false,
        bookedBy: null
      });
    });
  }

  return sessions;
};

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Mongo connected");

    // Delete old mock mentor
    await User.deleteOne({ email: "mockmentor@test.com" });

    const sessions = generateSessions();

    const mockMentor = await User.create({
      clerkId: "mock_clerk_123",
      email: "mockmentor@test.com",
      name: "Mock Mentor",
      role: "mentor",
      isProfileComplete: true,
      mentorProfile: {
        basicInfo: {
          gender: "male",
          industry: "Tech",
          workExperience: 5
        },
        professionalInfo: {
          highestQualification: "Bachelors",
          college: "Mock University",
          branch: "CSE",
          passingYear: 2020
        },
        expertise: {
          subjects: ["DSA", "System Design"],
          specializations: "Backend Engineering"
        },
        pricing: {
          pricePerSession: 500,
          sessionDuration: 30,
          isFreeTrialEnabled: false
        },
        availability: [
          {
            day: "Tuesday",
            slots: [
              {
                startTime: "12:00",
                endTime: "16:00",
                sessionDuration: 30
              }
            ]
          }
        ],
        upcomingSessions: sessions,
        bio: "Experienced backend mentor.",
        rating: 4.8,
        totalReviews: 42
      }
    });

    console.log("Mock mentor created successfully!");
    console.log("Mentor ID:", mockMentor._id);
    console.log("Total sessions:", sessions.length);
    console.log(
      "First session date:",
      sessions[0].date.toLocaleDateString("en-CA"),
      "Time:",
      sessions[0].startTime
    );

    process.exit();
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seed();