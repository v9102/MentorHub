import express from "express";
import { requireAuth } from "@clerk/express";
import { authorizeMeeting, startMeeting } from "../controllers/meeting.controller.js";

const router = express.Router();

router.get("/:sessionId/authorize", requireAuth(), authorizeMeeting);
router.post("/:sessionId/start", requireAuth(), startMeeting);

export default router;
