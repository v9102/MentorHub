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

    const booking = await Booking.create({
      mentor: mentor._id,
      sessionDate: selectedSession.date,
      startTime: selectedSession.startTime,
      endTime: selectedSession.endTime,
      sessionDuration: selectedSession.sessionDuration,
      price: mentor.mentorProfile.pricing?.pricePerSession || 0,
      status: "confirmed"
    });

    mentor.mentorProfile.upcomingSessions[sessionIndex].isBooked = true;
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