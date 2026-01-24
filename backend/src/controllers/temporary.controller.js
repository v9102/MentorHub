import bcrypt from "bcryptjs";
import Student from "../models/student.js";
import generateToken from "../utils/generateToken.js";

export const studentSignup = async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const student = await Student.create({ name, email, password: hash });
  res.json({ token: generateToken(student._id, "student") });
};

export const studentLogin = async (req, res) => {
  const { email, password } = req.body;
  const student = await Student.findOne({ email });
  if (!student || !(await bcrypt.compare(password, student.password)))
    return res.status(401).json({ msg: "Invalid credentials" });

  res.json({ token: generateToken(student._id, "student") });
};
