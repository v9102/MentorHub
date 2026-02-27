import express from "express";
import { getPendingApplications, verifyMentor, rejectMentor } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.js"; // In production, add a requireAdmin middleware here

const router = express.Router();

router.get("/mentor-applications", protect, getPendingApplications);
router.patch("/mentor/:id/verify", protect, verifyMentor);
router.patch("/mentor/:id/reject", protect, rejectMentor);

export default router;
