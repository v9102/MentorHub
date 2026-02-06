import User from "../models/user.js";


export const getMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: "mentor" })
      .select("-password");

    res.status(200).json({
      success: true,
      mentors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};

export const showMentorProfile = async (req, res) => {
  try {
    const mentorId = req.params.id;

    const mentor = await User.findOne({
      _id: mentorId,
      role: "mentor"
    }).select("-password");

    if (!mentor) {
      return res.status(404).json({
        success: false,
        msg: "Mentor not found"
      });
    }

    res.status(200).json({
      success: true,
      mentor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};

export const updateMentorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role !== "mentor") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const {
      basicInfo,
      professionalInfo,
      expertise,
      availability,
      pricing
    } = req.body;

    if (!user.mentorProfile) user.mentorProfile = {};

    if (basicInfo) {
      user.mentorProfile.basicInfo = {
        ...user.mentorProfile.basicInfo,
        ...basicInfo
      };
    }

    if (professionalInfo) {
      user.mentorProfile.professionalInfo = {
        ...user.mentorProfile.professionalInfo,
        ...professionalInfo
      };
    }

    if (expertise) {
      user.mentorProfile.expertise = {
        ...user.mentorProfile.expertise,
        ...expertise
      };
    }

    if (availability) {
      user.mentorProfile.availability = {
        ...user.mentorProfile.availability,
        ...availability
      };
    }

    if (pricing) {
      user.mentorProfile.pricing = {
        ...user.mentorProfile.pricing,
        ...pricing
      };
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({
      success: true,
      msg: "Mentor profile updated successfully",
      mentor: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Server error"
    });
  }
};
