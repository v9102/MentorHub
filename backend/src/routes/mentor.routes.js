import express from "express";
import { protect } from "../middleware/auth.js";
import { getMentors, getMentorProfile, updateMentorProfile, searchMentors, upcomingSessions, getSessionHistory} from "../controllers/mentor.controller.js";

const router = express.Router();
router.get("/mentors", getMentors);
router.get("/:mentorId", getMentorProfile);
router.get("/search", searchMentors);
router.put("/mentor/profile", protect, updateMentorProfile);
router.get("/upcoming", protect, upcomingSessions);
export default router;
