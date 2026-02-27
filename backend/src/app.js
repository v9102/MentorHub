import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import mentorRoutes from "./routes/mentor.routes.js";
import mentorAuth from "./routes/mentorAuth.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import bookingRoutes from "./routes/booking.route.js";
const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Webhook route (must use raw BEFORE json)
app.use(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  webhookRoutes
);

// Parse JSON
app.use(express.json());

// Clerk middleware (MUST be before protected routes)
app.use(clerkMiddleware());

// Routes
app.use("/api/pay-now", bookingRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/mentorAuth", mentorAuth);
app.post("/debug", (req, res) => {
  res.send("POST debug works");
});
// Health check route
app.get("/health", (req, res) => {
  res.send("Backend healthy 🚀");
});
console.log("APP LOADED");

export default app;