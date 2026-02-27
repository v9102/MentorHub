import User from "../models/user.js";
import { generateAvailabilityMatrix } from "../utils/availabilityMatrix.js";

export const getMentors = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    const filter = {
      role: "mentor",
      isProfileComplete: true
    };

    const [mentors, totalMentors] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .select(
          "name username imageUrl mentorProfile.basicInfo mentorProfile.pricing mentorProfile.rating"
        )
        .skip(skip)
        .limit(limit)
        .lean(),

      User.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      page,
      totalMentors,
      totalPages: Math.ceil(totalMentors / limit),
      mentors
    });

  } catch (error) {
    console.error("Get Mentors Error:", error);
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
    const clerkId = req.auth.userId;

    const mentor = await User.findOne({
      clerkId,
      role: "mentor"
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        msg: "Mentor not found"
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

    if (basicInfo) mentor.mentorProfile.basicInfo = basicInfo;
    if (professionalInfo) mentor.mentorProfile.professionalInfo = professionalInfo;
    if (expertise) mentor.mentorProfile.expertise = expertise;
    if (availability) mentor.mentorProfile.availability = availability;
    if (pricing) mentor.mentorProfile.pricing = pricing;
    if (bio !== undefined) mentor.mentorProfile.bio = bio;
    if (languages !== undefined) mentor.mentorProfile.languages = languages;

    mentor.isProfileComplete = true;

    await mentor.save();

    res.status(200).json({
      success: true,
      msg: "Profile updated",
      mentor
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const searchMentors = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const {
      q,
      industry,
      college,
      minPrice,
      maxPrice,
      minExperience,
      maxExperience
    } = req.query;

    let filter = { role: "mentor" };

    if (q?.trim()) {
      filter.$text = { $search: q.trim() };
    }

    if (industry) {
      filter["mentorProfile.basicInfo.industry"] = industry;
    }

    if (college) {
      filter["mentorProfile.professionalInfo.college"] = college;
    }

    if (minPrice || maxPrice) {
      filter["mentorProfile.pricing.pricePerSession"] = {};
      if (minPrice) filter["mentorProfile.pricing.pricePerSession"].$gte = Number(minPrice);
      if (maxPrice) filter["mentorProfile.pricing.pricePerSession"].$lte = Number(maxPrice);
    }

    if (minExperience || maxExperience) {
      filter["mentorProfile.basicInfo.workExperience"] = {};
      if (minExperience) filter["mentorProfile.basicInfo.workExperience"].$gte = Number(minExperience);
      if (maxExperience) filter["mentorProfile.basicInfo.workExperience"].$lte = Number(maxExperience);
    }

    const [mentors, total] = await Promise.all([
      User.find(
        filter,
        q ? { score: { $meta: "textScore" } } : {}
      )
        .sort(q ? { score: { $meta: "textScore" } } : { "mentorProfile.rating": -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: mentors
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
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


const parseTimeTo24Hour = (timeStr) => {
  // If already 24-hour format like "12:00"
  if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
    return timeStr;
  }

  // Extract time like "8 PM" from "Night (8 PM – 12 AM)"
  const match = timeStr.match(/(\d{1,2})\s?(AM|PM)/i);
  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const modifier = match[2].toUpperCase();

  if (modifier === "PM" && hour !== 12) hour += 12;
  if (modifier === "AM" && hour === 12) hour = 0;

  return `${hour.toString().padStart(2, "0")}:00`;
};

const generateUpcomingSessionsFromAvailability = (availability) => {
  const today = new Date();
  const sessions = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    const dayName = date.toLocaleDateString("en-US", {
      weekday: "long"
    });

    const dayAvailability = availability.find(d => d.day === dayName);
    if (!dayAvailability) continue;

    for (const slot of dayAvailability.slots) {

      const startStr = parseTimeTo24Hour(slot.startTime);
      const endStr = parseTimeTo24Hour(slot.endTime);

      if (!startStr || !endStr) continue;

      const [sh, sm] = startStr.split(":").map(Number);
      const [eh, em] = endStr.split(":").map(Number);

      let start = new Date(date);
      let end = new Date(date);

      start.setHours(sh, sm, 0, 0);
      end.setHours(eh, em, 0, 0);

      while (start < end) {
        const sessionEnd = new Date(start);
        sessionEnd.setMinutes(sessionEnd.getMinutes() + slot.sessionDuration);

        sessions.push({
          date: new Date(start),
          startTime: start.toTimeString().slice(0, 5),   // "HH:mm"
          endTime: sessionEnd.toTimeString().slice(0, 5),
          sessionDuration: slot.sessionDuration,
          isBooked: false,
          bookedBy: null
        });

        start.setMinutes(start.getMinutes() + slot.sessionDuration);
      }
    }
  }

  return sessions;
};

export const saveAvailability = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { availability } = req.body;

    if (!availability?.length) {
      return res.status(400).json({
        success: false,
        msg: "Availability required"
      });
    }

    const mentor = await User.findOne({
      clerkId,
      role: "mentor"
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        msg: "Mentor not found"
      });
    }

    mentor.mentorProfile.availability = availability;

    const newSessions =
      generateUpcomingSessionsFromAvailability(availability);

    const bookedSessions =
      mentor.mentorProfile.upcomingSessions.filter(s => s.isBooked);

    mentor.mentorProfile.upcomingSessions = [
      ...bookedSessions,
      ...newSessions
    ];

    await mentor.save();

    res.json({
      success: true,
      msg: "Availability updated"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
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

