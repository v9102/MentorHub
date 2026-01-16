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
