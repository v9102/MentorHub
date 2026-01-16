import bcrypt from "bcryptjs";
import Mentor from "../models/mentor.js";
import generateToken from "../utils/generateToken.js";

export const mentorSignup = async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const mentor = await Mentor.create({ name, email, password: hash });
  res.json({ token: generateToken(mentor._id, "mentor") });
};

export const mentorLogin = async (req, res) => {
  const { email, password } = req.body;
  const mentor = await Mentor.findOne({ email });
  if (!mentor || !(await bcrypt.compare(password, mentor.password)))
    return res.status(401).json({ msg: "Invalid credentials" });

  res.json({ token: generateToken(mentor._id, "mentor") });
};
