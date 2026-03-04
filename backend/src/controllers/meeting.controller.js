import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import User from "../models/user.js";
// You'll need an email service for sending emails. For now, logging to console as a placeholder until configured.
// We can use nodemailer or similar if set up, let's create a stub.

export const authorizeMeeting = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const authObj = typeof req.auth === "function" ? req.auth() : req.auth;
        const clerkId = authObj?.userId;

        if (!clerkId) {
            return res.status(401).json({ success: false, msg: "Unauthorized" });
        }

        const user = await User.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        const booking = await Booking.findById(sessionId)
            .populate("mentor", "clerkId name email")
            .populate("student", "clerkId name email");

        if (!booking) {
            return res.status(404).json({ success: false, msg: "Session not found" });
        }

        const isMentor = booking.mentor.clerkId === clerkId;
        const isStudent = booking.student.clerkId === clerkId;

        if (!isMentor && !isStudent) {
            return res.status(403).json({ success: false, msg: "Forbidden" });
        }

        // Determine role based on who is asking
        const role = isMentor ? "mentor" : "student";

        return res.status(200).json({
            success: true,
            role,
            status: booking.status,
            mentorName: booking.mentor.name,
            studentName: booking.student.name,
        });
    } catch (error) {
        console.error("Authorize Meeting Error:", error);
        return res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const startMeeting = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const authObj = typeof req.auth === "function" ? req.auth() : req.auth;
        const clerkId = authObj?.userId;

        if (!clerkId) {
            return res.status(401).json({ success: false, msg: "Unauthorized" });
        }

        const user = await User.findOne({ clerkId });

        const booking = await Booking.findById(sessionId)
            .populate("mentor", "clerkId name email")
            .populate("student", "clerkId name email");

        if (!booking) {
            return res.status(404).json({ success: false, msg: "Session not found" });
        }

        const isMentor = booking.mentor.clerkId === clerkId;

        if (!isMentor) {
            return res.status(403).json({ success: false, msg: "Only mentor can start the meeting" });
        }

        booking.status = "meeting_started";
        await booking.save();

        // Trigger email to student
        sendMeetingStartedEmail(booking.student.email, booking.student.name, booking.mentor.name, sessionId);

        return res.status(200).json({ success: true, status: booking.status });
    } catch (error) {
        console.error("Start Meeting Error:", error);
        return res.status(500).json({ success: false, msg: "Server error" });
    }
};

// Stub for sending email (should be replaced with actual email service integration like Nodemailer/Resend)
const sendMeetingStartedEmail = (studentEmail, studentName, mentorName, sessionId) => {
    console.log(`\n\n[EMAIL MOCK] To: ${studentEmail}`);
    console.log(`Subject: Your Mentor ${mentorName} has started the meeting!`);
    console.log(`Hi ${studentName},\n\nThe meeting room is now open. Join here: http://localhost:3000/meeting/${sessionId}\n\n`);
};
