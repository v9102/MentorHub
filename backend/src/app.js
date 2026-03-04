import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import mentorRoutes from "./routes/mentor.routes.js";
import mentorAuth from "./routes/mentorAuth.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import bookingRoutes from "./routes/booking.route.js";
import adminRoutes from "./routes/admin.routes.js";
import meetingRoutes from "./routes/meeting.route.js";
import { initCronJobs } from "./services/cron.js";
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
app.use("/api/admin", adminRoutes);
app.use("/api/meeting", meetingRoutes);

app.get("/", (req, res) => {
  res.send("Server running");
});
app.post("/debug", (req, res) => {
  res.send("POST debug works");
});
// Health check route
app.get("/health", (req, res) => {
  res.send("Backend healthy 🚀");
});

// Global JSON error handler — catches Express errors (including Clerk auth errors)
// so that all errors return JSON instead of HTML error pages
app.use((err, req, res, next) => {
  console.error("[Express Error]", err.message || err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ success: false, msg: err.message || "Internal server error" });
});

console.log("APP LOADED");

initCronJobs();

export default app;
