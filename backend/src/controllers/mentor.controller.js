import User from "../models/user.js";
import Booking from "../models/Booking.js";
import { generateAvailabilityMatrix } from "../utils/availabilityMatrix.js";

export const getMentors = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    // Allow both explicitly complete profiles AND legacy mentors missing the field
    const filter = {
      role: "mentor",
      $or: [
        { isProfileComplete: true },
        { isProfileComplete: { $exists: false } }
      ],
      "mentorProfile.verification.isVerified": { $ne: false }
    };

    const [mentors, totalMentors] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .select("name username imageUrl mentorProfile.basicInfo mentorProfile.pricing mentorProfile.rating")
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

    // Fetch as mutable document so we can auto-extend if needed
    const mentorDoc = await User.findOne({ _id: mentorId, role: "mentor" });
    if (!mentorDoc) {
      return res.status(404).json({ success: false, msg: "Mentor not found" });
    }

    // --- Auto-extend recurring sessions to always cover the next 30 days ---
    const availability = mentorDoc.mentorProfile?.availability;
    if (availability?.length) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const thirtyDaysOut = new Date(today); thirtyDaysOut.setDate(today.getDate() + 30);

      // Check the latest future unbooked session date
      const futureSessions = (mentorDoc.mentorProfile.upcomingSessions || [])
        .filter(s => !s.isBooked && new Date(s.date) >= today);

      const latestDate = futureSessions.length
        ? new Date(Math.max(...futureSessions.map(s => new Date(s.date).getTime())))
        : today;

      // Regenerate if coverage is less than 20 days ahead
      if (latestDate < new Date(today.getTime() + 20 * 86400000)) {
        const newSessions = generateUpcomingSessionsFromAvailability(availability);
        const bookedSessions = mentorDoc.mentorProfile.upcomingSessions.filter(s => s.isBooked);
        const existingUnbooked = mentorDoc.mentorProfile.upcomingSessions.filter(s => !s.isBooked);
        const existingKeys = new Set(existingUnbooked.map(s => {
          const d = new Date(s.date);
          return `${d.toISOString().split("T")[0]}_${s.startTime}`;
        }));
        const dedupedNew = newSessions.filter(s => {
          const key = `${new Date(s.date).toISOString().split("T")[0]}_${s.startTime}`;
          return !existingKeys.has(key);
        });
        if (dedupedNew.length > 0) {
          mentorDoc.mentorProfile.upcomingSessions = [...bookedSessions, ...existingUnbooked, ...dedupedNew];
          // Save asynchronously — don't block the response
          mentorDoc.save().catch(e => console.error("Auto-extend save error:", e));
        }
      }
    }

    // --- Reconcile isBooked flags with the live Booking collection ---
    // When bookings are manually deleted from the DB, the upcomingSessions
    // embedded array still has isBooked=true. This query cross-checks and fixes it.
    const bookedSlots = mentorDoc.mentorProfile.upcomingSessions?.filter(s => s.isBooked) || [];
    if (bookedSlots.length > 0) {
      // Fetch all active bookings for this mentor in one query
      const activeBookings = await Booking.find({
        mentor: mentorDoc._id,
        status: { $ne: "cancelled" }
      }).select("sessionDate startTime").lean();

      // Build a set of "date_startTime" keys for fast lookup
      const activeKeys = new Set(
        activeBookings.map(b => {
          const d = new Date(b.sessionDate).toISOString().split("T")[0];
          return `${d}_${b.startTime}`;
        })
      );

      let needsSave = false;
      mentorDoc.mentorProfile.upcomingSessions = mentorDoc.mentorProfile.upcomingSessions.map(slot => {
        if (!slot.isBooked) return slot;
        const slotKey = `${new Date(slot.date).toISOString().split("T")[0]}_${slot.startTime}`;
        if (!activeKeys.has(slotKey)) {
          // Booking was deleted — make the slot available again
          needsSave = true;
          return { ...slot.toObject?.() || slot, isBooked: false, bookedBy: null };
        }
        return slot;
      });

      if (needsSave) {
        mentorDoc.save().catch(e => console.error("Reconcile save error:", e));
      }
    }

    const mentor = mentorDoc.toObject();
    mentor._id = mentorDoc._id;
    delete mentor.clerkId;

    const availabilityMatrix = generateAvailabilityMatrix(
      mentor.mentorProfile.availability,
      mentor.mentorProfile.upcomingSessions
    );
    mentor.availabilityMatrix = availabilityMatrix;

    res.json({ success: true, mentor });
  }
  catch (error) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};



export const getOwnProfile = async (req, res) => {
  try {
    const clerkId = (typeof req.auth === "function" ? req.auth() : req.auth)?.userId;
    const mentor = await User.findOne({ clerkId, role: "mentor" })
      .select("-clerkId")
      .lean();

    if (!mentor) {
      return res.status(404).json({ success: false, msg: "Mentor not found" });
    }

    res.json({ success: true, mentor });
  } catch (error) {
    console.error("getOwnProfile error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const updateMentorProfile = async (req, res) => {
  try {
    const clerkId = (typeof req.auth === "function" ? req.auth() : req.auth)?.userId;

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

    let filter = {
      role: "mentor",
      $or: [
        { isProfileComplete: true },
        { isProfileComplete: { $exists: false } }
      ],
      "mentorProfile.verification.isVerified": { $ne: false }
    };

    // Text search logic handled dynamically closer to User.find

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

    let searchFilter = filter;
    if (q?.trim()) {
      searchFilter = { ...filter, $text: { $search: q.trim() } };
    }

    const [mentors, total] = await Promise.all([
      User.find(
        searchFilter,
        q ? { score: { $meta: "textScore" } } : {}
      )
        .sort(q ? { score: { $meta: "textScore" } } : { "mentorProfile.rating": -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(searchFilter)
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
    const clerkId = (typeof req.auth === "function" ? req.auth() : req.auth)?.userId;
    if (!clerkId) return res.status(401).json({ success: false, msg: "Unauthorized" });

    const user = await User.findOne({ clerkId }).select("role _id");
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    const userId = user._id;
    const role = user.role;
    const now = new Date();
    let filter = {
      sessionDate: { $gte: now },
      status: { $ne: "cancelled" },
      $or: [
        { mentor: userId },
        { student: userId }
      ]
    };

    console.log("[DEBUG] upcomingSessions request for clerkId:", clerkId);
    console.log("[DEBUG] User role:", role, "userId:", userId);
    console.log("[DEBUG] Executing filter:", JSON.stringify(filter));

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
        id: s.mentor?._id,
        name: s.mentor?.name || "Unknown Mentor",
        imageUrl: s.mentor?.imageUrl
      },
      student: {
        id: s.student?._id,
        name: s.student?.name || "Unknown Student",
        imageUrl: s.student?.imageUrl
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
  today.setHours(0, 0, 0, 0);
  const sessions = [];

  // Generate for the next 30 days → each weekday appears ~4 times (recurring weekly)
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
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
    const clerkId = (typeof req.auth === "function" ? req.auth() : req.auth)?.userId;
    const { availability } = req.body;

    if (!availability?.length) {
      return res.status(400).json({
        success: false,
        msg: "Availability required"
      });
    }

    // Backend validation: No more than 3 slots per day, and durations must be 15, 20, or 30.
    const validDurations = [15, 20, 30];
    for (const dayA of availability) {
      if (dayA.slots && dayA.slots.length > 3) {
        return res.status(400).json({
          success: false,
          msg: `Maximum 3 time slots allowed per day (${dayA.day}).`
        });
      }
      for (const slot of dayA.slots) {
        if (!validDurations.includes(slot.sessionDuration)) {
          return res.status(400).json({
            success: false,
            msg: `Invalid session duration: ${slot.sessionDuration} mins. Allowed: 15, 20, 30.`
          });
        }
      }
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

    const newSessions = generateUpcomingSessionsFromAvailability(availability);

    // Keep already-booked sessions
    const bookedSessions = mentor.mentorProfile.upcomingSessions.filter(s => s.isBooked);

    // Build a set of keys for existing unbooked sessions so we don't duplicate
    const existingUnbooked = mentor.mentorProfile.upcomingSessions.filter(s => !s.isBooked);
    const existingKeys = new Set(
      existingUnbooked.map(s => {
        const d = new Date(s.date);
        return `${d.toISOString().split("T")[0]}_${s.startTime}`;
      })
    );

    // Only add sessions that don't already exist (avoids duplicates on re-save)
    const dedupedNew = newSessions.filter(s => {
      const key = `${new Date(s.date).toISOString().split("T")[0]}_${s.startTime}`;
      return !existingKeys.has(key);
    });

    mentor.mentorProfile.upcomingSessions = [
      ...bookedSessions,
      ...existingUnbooked,
      ...dedupedNew
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
    const clerkId = (typeof req.auth === "function" ? req.auth() : req.auth)?.userId;
    if (!clerkId) return res.status(401).json({ success: false, msg: "Unauthorized" });

    const user = await User.findOne({ clerkId }).select("role _id");
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    const userId = user._id;
    const role = user.role;
    const now = new Date();
    let filter = {
      $and: [
        {
          $or: [
            { mentor: userId },
            { student: userId }
          ]
        },
        {
          $or: [
            { sessionDate: { $lt: now } },
            { status: "completed" },
            { status: "cancelled" }
          ]
        }
      ]
    };

    const sessions = await Booking.find(filter)
      .populate("mentor", "name imageUrl")
      .populate("student", "name imageUrl")
      .sort({ sessionDate: -1, startTime: -1 })
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
        id: session.mentor?._id,
        name: session.mentor?.name || "Unknown Mentor",
        imageUrl: session.mentor?.imageUrl
      },

      student: {
        id: session.student?._id,
        name: session.student?.name || "Unknown Student",
        imageUrl: session.student?.imageUrl
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

