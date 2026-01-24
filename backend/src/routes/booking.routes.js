import express from "express";
import { protect } from "../middleware/auth.js";
import { bookSlot } from "../controllers/booking.controller.js";

const router = express.Router();
router.post("/", protect, bookSlot);

export default router;
