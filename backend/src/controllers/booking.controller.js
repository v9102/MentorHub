import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import User from "../models/user.js";

export const createBooking = async (req, res) => {

  const session = await mongoose.startSession();

  try {

    session.startTransaction();

    const studentId = req.user.id;

    const {
      mentorId,
      date,
      startTime
    } = req.body;

    if (!mentorId || !date || !startTime) {

      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        msg: "mentorId, date, startTime required"
      });

    }

    const sessionDate = new Date(date);

    const mentor = await User.findOne({
      _id: mentorId,
      role: "mentor"
    }).session(session);

    if (!mentor) {

      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        msg: "Mentor not found"
      });

    }

    const upcomingSession =
      mentor.mentorProfile.upcomingSessions.find(
        s =>
          new Date(s.date).toISOString().split("T")[0] ===
          sessionDate.toISOString().split("T")[0]
          &&
          s.startTime === startTime
      );

    if (!upcomingSession) {

      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        msg: "Session not available"
      });

    }

    if (upcomingSession.isBooked) {

      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        msg: "Session already booked"
      });

    }

    const booking = await Booking.create([{

      mentor: mentorId,
      student: studentId,

      sessionDate: upcomingSession.date,

      startTime: upcomingSession.startTime,

      endTime: upcomingSession.endTime,

      sessionDuration:
        upcomingSession.sessionDuration,

      price:
        mentor.mentorProfile.pricing.pricePerSession || 0

    }], { session });


    await User.updateOne(
      {
        _id: mentorId,
        "mentorProfile.upcomingSessions.date":
          upcomingSession.date,
        "mentorProfile.upcomingSessions.startTime":
          startTime,
        "mentorProfile.upcomingSessions.isBooked":
          false
      },
      {
        $set: {
          "mentorProfile.upcomingSessions.$.isBooked": true,
          "mentorProfile.upcomingSessions.$.bookedBy":
            studentId
        }
      },
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      msg: "Booking successful",
      booking: booking[0]
    });

  }
  catch (error) {

    await session.abortTransaction();

    if (error.code === 11000) {

      return res.status(400).json({
        success: false,
        msg: "Slot already booked"
      });

    }

    console.error(error);

    res.status(500).json({
      success: false,
      msg: "Server error"
    });

  }
  finally {

    session.endSession();

  }

};

