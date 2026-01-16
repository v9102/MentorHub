import express from "express";
import { mentorSignup, mentorLogin } from "../controllers/mentorAuth.controller.js";

const router = express.Router();
router.post("/signup", mentorSignup);
router.post("/login", mentorLogin);

export default router;
