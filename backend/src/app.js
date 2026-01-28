import express from "express";
import cors from "cors";

import mentorAuthRoutes from "./routes/mentorAuth.routes.js";
import studentAuthRoutes from "./routes/studentAuth.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/mentor/auth", mentorAuthRoutes);
app.use("/api/student/auth", studentAuthRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/bookings", bookingRoutes);

export default app;