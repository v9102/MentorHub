import express from "express";
import { protect } from "../middleware/auth.js";
import { getMentors, showMentorProfile, updateMentorProfile  } from "../controllers/mentor.controller.js";

const router = express.Router();
router.get("/mentors", getMentors);
router.get("/mentor/:id", showMentorProfile);
router.put("/mentor/profile", protect, updateMentorProfile);

export default router;
