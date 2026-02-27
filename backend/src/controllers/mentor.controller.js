import User from "../models/user.js";
import { generateAvailabilityMatrix } from "../utils/availabilityMatrix.js";

export const getMentors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const mentors = await User.find({ role: "mentor" })
      .select("-password")
      .skip(skip)
      .limit(limit);
    const totalMentors = await User.countDocuments({ role: "mentor" });
    res.status(200).json({
      success: true,
      page,
      limit,
      totalMentors,
      totalPages: Math.ceil(totalMentors / limit),
      mentors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};

export const getMentorProfile = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const mentor = await User.findOne({
      _id: mentorId,
      role: "mentor"
    })
    .select("-clerkId")
    .lean();
    if (!mentor) {
      return res.status(404).json({
        success: false,
        msg: "Mentor not found"
      });
    }
    const availabilityMatrix =
      generateAvailabilityMatrix(
        mentor.mentorProfile.availability,
        mentor.mentorProfile.upcomingSessions
      );

    mentor.availabilityMatrix =
      availabilityMatrix;
    res.json({
      success: true,
      mentor
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};

export const updateMentorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const existingUser = await User.findOne({
      _id: userId,
      role: "mentor"
    }).select("_id role mentorProfile");
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        msg: "Mentor not found or access denied"
      });
    }
    const {
      basicInfo,
      professionalInfo,
      expertise,
      availability,
      pricing,
      bio,
      languages
    } = req.body;
    let updateFields = {};
    if (basicInfo) {
      updateFields["mentorProfile.basicInfo"] = basicInfo;
    }
    if (professionalInfo) {
      updateFields["mentorProfile.professionalInfo"] = professionalInfo;
    }
    if (expertise) {
      updateFields["mentorProfile.expertise"] = expertise;
    }
    if (availability) {
      updateFields["mentorProfile.availability"] = availability;
    }
    if (pricing) {
      updateFields["mentorProfile.pricing"] = pricing;
    }
    if (bio !== undefined) {
      updateFields["mentorProfile.bio"] = bio;
    }
    if (languages !== undefined) {
      updateFields["mentorProfile.languages"] = languages;
    }
    updateFields["isProfileComplete"] = true;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      {
        new: true,
        runValidators: true
      }
    )
    .select(`
      name
      username
      email
      imageUrl
      role
      mentorProfile
      isProfileComplete
    `)
    .lean();
    res.status(200).json({
      success: true,
      msg: "Mentor profile updated successfully",
      mentor: updatedUser
    });
  }
  catch (error) {
    console.error("Update Mentor Profile Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};

export const searchMentors = async (req, res) => {
  try {
    const {
      q,
      industry,
      college,
      minPrice,
      maxPrice,
      minExperience,
      maxExperience,
      page = 1,
      limit = 20
    } = req.query;
    const skip = (page - 1) * limit;
    let filter = {
      role: "mentor",
    };
    if (q && q.trim() !== "") {
      filter.$text = {
        $search: q.trim()
      };
    }
    if (industry) {
      filter["mentorProfile.basicInfo.industry"] = industry;
    }
    if (college) {
      filter["mentorProfile.professionalInfo.college"] = college;
    }
    if (minPrice || maxPrice) {
      filter["mentorProfile.pricing.pricePerSession"] = {};
      if (minPrice)
        filter["mentorProfile.pricing.pricePerSession"].$gte = Number(minPrice);
      if (maxPrice)
        filter["mentorProfile.pricing.pricePerSession"].$lte = Number(maxPrice);
    }
    if (minExperience || maxExperience) {
      filter["mentorProfile.basicInfo.workExperience"] = {};
      if (minExperience)
        filter["mentorProfile.basicInfo.workExperience"].$gte = Number(minExperience);
      if (maxExperience)
        filter["mentorProfile.basicInfo.workExperience"].$lte = Number(maxExperience);
    }
    const mentors = await User.find(
      filter,
      q ? { score: { $meta: "textScore" } } : {}
    )
      .sort(q
        ? { score: { $meta: "textScore" } }
        : { "mentorProfile.rating": -1 }
      )
      .select(`
        name
        username
        imageUrl
        mentorProfile.basicInfo
        mentorProfile.professionalInfo
        mentorProfile.pricing
        mentorProfile.expertise
        mentorProfile.rating
      `)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await User.countDocuments(filter);
    res.status(200).json({
      success: true,
      count: mentors.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: mentors
    });
  }
  catch (error) {
    console.error("Search Mentors Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const upcomingSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const now = new Date();
    let filter = {
      sessionDate: { $gte: now },
      status: { $ne: "cancelled" }
    };
    if (role === "mentor") {
      filter.mentor = userId;
    }
    else if (role === "student") {
      filter.student = userId;
    }
    else {
      return res.status(403).json({
        success: false,
        msg: "Invalid role"
      });
    }
    const sessions = await Booking.find(filter)
      .populate("mentor", "name imageUrl")
      .populate("student", "name imageUrl")
      .sort({ sessionDate: 1, startTime: 1 })
      .lean();
    const formattedSessions = sessions.map(s => ({
      bookingId: s._id,
      date:
        new Date(s.sessionDate)
        .toISOString()
        .split("T")[0],
      startTime: s.startTime,
      endTime: s.endTime,
      duration: s.sessionDuration,
      status: s.status,
      mentor: {
        id: s.mentor._id,
        name: s.mentor.name,
        imageUrl: s.mentor.imageUrl
      },
      student: {
        id: s.student._id,
        name: s.student.name,
        imageUrl: s.student.imageUrl
      },
      meetingLink: s.meetingLink || null
    }));
    res.status(200).json({
      success: true,
      count: formattedSessions.length,
      sessions: formattedSessions
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};

import User from "../models/user.js";
const generateUpcomingSessionsFromAvailability = (availability) => {
  const today = new Date();
  const sessions = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const dayName =
      date.toLocaleDateString("en-US", {
        weekday: "long"
      });
    const dayAvailability =
      availability.find(d => d.day === dayName);
    if (!dayAvailability) continue;
    for (const slot of dayAvailability.slots) {
      let start = new Date(date);
      let end = new Date(date);
      const [sh, sm] = slot.startTime.split(":");
      const [eh, em] = slot.endTime.split(":");
      start.setHours(sh, sm, 0);
      end.setHours(eh, em, 0);
      while (start < end) {
        const sessionEnd = new Date(start);
        sessionEnd.setMinutes(
          sessionEnd.getMinutes() +
          slot.sessionDuration
        );
        sessions.push({
          date: new Date(start),
          startTime:
            start.toTimeString().slice(0, 5),
          endTime:
            sessionEnd.toTimeString().slice(0, 5),
          sessionDuration:
            slot.sessionDuration,
          isBooked: false,
          bookedBy: null
        });
        start.setMinutes(
          start.getMinutes() +
          slot.sessionDuration
        );
      }
    }
  }
  return sessions;
};

export const saveAvailability = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { availability } = req.body;
    if (!availability || availability.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "Availability required"
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
    mentor.mentorProfile.availability =
      availability;

    const newSessions =
      generateUpcomingSessionsFromAvailability(
        availability
      );
    const bookedSessions =
      mentor.mentorProfile.upcomingSessions
      ?.filter(s => s.isBooked) || [];

    mentor.mentorProfile.upcomingSessions = [
      ...bookedSessions,
      ...newSessions.filter(newSession =>
        !bookedSessions.some(booked =>
          booked.date.toISOString() ===
          newSession.date.toISOString() && booked.startTime === newSession.startTime
        )
      )
    ];
    await mentor.save();
    res.json({
      success: true,
      msg: "Availability saved",
      availability:
        mentor.mentorProfile.availability,
      upcomingSessions:
        mentor.mentorProfile.upcomingSessions
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};


export const getSessionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const now = new Date();

    let filter = {
      $or: [
        { sessionDate: { $lt: now } },
        { status: "completed" },
        { status: "cancelled" }
      ]
    };
    if (role === "mentor") {
      filter.mentor = userId;
    }
    else if (role === "student") {
      filter.student = userId;
    }
    else {
      return res.status(403).json({
        success: false,
        msg: "Invalid role"
      });
    }

    const sessions = await Booking.find(filter)
      .populate("mentor", "name imageUrl")
      .populate("student", "name imageUrl")
      .sort({ sessionDate: -1, startTime: -1 })
      .lean();
   const history = sessions.map(session => ({

      bookingId: session._id,

      date:
        new Date(session.sessionDate)
        .toISOString()
        .split("T")[0],

      startTime: session.startTime,
      endTime: session.endTime,
      duration: session.sessionDuration,
      status: session.status,
      price: session.price,
      mentor: {
        id: session.mentor._id,
        name: session.mentor.name,
        imageUrl: session.mentor.imageUrl
      },

      student: {
        id: session.student._id,
        name: session.student.name,
        imageUrl: session.student.imageUrl
      },

      createdAt: session.createdAt

    }));


    res.status(200).json({
      success: true,
      count: history.length,
      sessions: history
    });

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      msg: "Server error"
    });

  }

};
