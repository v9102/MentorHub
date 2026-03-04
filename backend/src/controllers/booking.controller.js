import mongoose from "mongoose";
import User from "../models/user.js";
import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const { mentorId, date, startTime } = req.body;

    if (!mentorId || !date || !startTime) {
      return res.status(400).json({
        success: false,
        msg: "mentorId, date, startTime required"
      });
    }

    const mentor = await User.findOne({
      _id: mentorId,
      role: "mentor"
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        msg: "Mentor not found"
      });
    }

    if (!mentor.mentorProfile?.upcomingSessions?.length) {
      return res.status(400).json({
        success: false,
        msg: "No sessions available"
      });
    }

    const convertTo24Hour = (timeStr) => {
      const clean = timeStr.replace(" IST", "").trim();
      const [time, modifier] = clean.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    };

    const cleanTime = convertTo24Hour(startTime);

    const incomingDate = new Date(date);
    incomingDate.setHours(0, 0, 0, 0);

    const sessionIndex = mentor.mentorProfile.upcomingSessions.findIndex(
      (s) => {
        const dbDate = new Date(s.date);
        dbDate.setHours(0, 0, 0, 0);

        return (
          dbDate.getTime() === incomingDate.getTime() &&
          s.startTime === cleanTime &&
          !s.isBooked
        );
      }
    );

    if (sessionIndex === -1) {
      return res.status(400).json({
        success: false,
        msg: "Session not available"
      });
    }

    const selectedSession =
      mentor.mentorProfile.upcomingSessions[sessionIndex];

    // Look up the student making the booking
    const authObj = typeof req.auth === "function" ? req.auth() : req.auth;
    const studentClerkId = authObj?.userId;
    let student = await User.findOne({ clerkId: studentClerkId });

    // Auto-create student if they don't exist in DB yet (e.g. local dev without webhook)
    if (!student) {
      const studentDetails = req.body.studentDetails;
      if (studentDetails && studentClerkId) {
        student = await User.create({
          clerkId: studentClerkId,
          email: studentDetails.email,
          firstName: studentDetails.firstName,
          lastName: studentDetails.lastName,
          name: studentDetails.name,
          imageUrl: studentDetails.imageUrl,
          role: "student"
        });
      } else {
        return res.status(404).json({ success: false, msg: "Student account not found in database" });
      }
    }

    const booking = await Booking.create({
      mentor: mentor._id,
      student: student._id,
      sessionDate: selectedSession.date,
      startTime: selectedSession.startTime,
      endTime: selectedSession.endTime,
      sessionDuration: selectedSession.sessionDuration,
      price: mentor.mentorProfile.pricing?.pricePerSession || 0,
      status: "confirmed"
    });

    mentor.mentorProfile.upcomingSessions[sessionIndex].isBooked = true;
    mentor.mentorProfile.upcomingSessions[sessionIndex].bookedBy = student._id;
    await mentor.save();

    return res.status(200).json({
      success: true,
      booking
    });

  } catch (error) {
    console.error("Booking Error:", error);
    return res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("mentor", "name")
      .populate("student", "name");

    if (!booking) {
      return res.status(404).json({ success: false, msg: "Booking not found" });
    }

    // Build scheduledAt from sessionDate + startTime (HH:mm)
    const [hours, minutes] = booking.startTime.split(":").map(Number);
    const scheduledAt = new Date(booking.sessionDate);
    scheduledAt.setHours(hours, minutes, 0, 0);

    return res.status(200).json({
      success: true,
      session: {
        sessionId: booking._id,
        mentorId: booking.mentor?._id,
        studentId: booking.student?._id,
        mentorName: booking.mentor?.name || "Mentor",
        studentName: booking.student?.name || "Student",
        price: booking.price,
        duration: booking.sessionDuration,
        paymentStatus: "Paid",
        bookingStatus: booking.status,
        scheduledAt: scheduledAt.toISOString(),
        createdAt: booking.createdAt,
      }
    });
  } catch (error) {
    console.error("GetBooking Error:", error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};
