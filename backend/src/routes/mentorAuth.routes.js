import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { becomeMentor } from "../controllers/mentorAuth.controller.js";

const router = express.Router();

router.post(
  "/become-mentor",
  ClerkExpressRequireAuth(),
  becomeMentor
);

export default router;
