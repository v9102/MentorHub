import User from "../models/user.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const becomeMentor = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const {
      basicInfo,
      professionalInfo,
      expertise,
      availability,
      pricing,
    } = req.body;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "mentor") {
      return res.status(400).json({ error: "Already a mentor" });
    }

    user.role = "mentor";
    user.mentorProfile = {
      basicInfo,
      professionalInfo,
      expertise,
      availability,
      pricing,
    };

    await user.save();

    await clerkClient.users.updateUser(clerkId, {
      publicMetadata: { role: "mentor"},
    });

    res.status(200).json({
      message: "You are now a mentor",
      user,
    });
  } catch (err) {
    console.error("Become mentor error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
