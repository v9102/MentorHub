import Mentor from "../models/mentor.js";


export const addSlot = async (req, res) => {
  const mentor = await Mentor.findById(req.user.id);
  mentor.freeSlots.push(req.body);
  await mentor.save();
  res.json(mentor);
};

export const getMentors = async (req, res) => {
  const mentors = await Mentor.find().select("-password");
  res.json(mentors);
};

export const getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id).select("-password");
    if (!mentor) {
      return res.status(404).json({ msg: "Mentor not found" });
    }
    res.json(mentor);
  } catch (error) {
    console.error("Error fetching mentor:", error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Mentor not found" });
    }
    res.status(500).json({ msg: "Server error" });
  }
};
