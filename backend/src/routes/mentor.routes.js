import express from "express";
import { protect } from "../middleware/auth.js";
import { addSlot, getMentors, getMentorById } from "../controllers/mentor.controller.js";

const router = express.Router();
router.post("/slot", protect, addSlot);
router.get("/", getMentors);
router.get("/:id", getMentorById);

export default router;
