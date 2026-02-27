import express from "express";
import { requireAuth } from "@clerk/express";
import { createBooking } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", requireAuth(), createBooking);

export default router;