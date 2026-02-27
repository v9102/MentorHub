import express from "express";
import mentorRoutes from "./routes/mentor.routes.js";
import mentorAuth from "./routes/mentorAuth.routes.js"
import webhookRoutes from "./routes/webhook.routes.js";
import bookingRoutes from "./routes/booking.route.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  webhookRoutes
);

app.use(express.json());

app.use("/api/mentor", mentorRoutes);
app.use("/api/mentorAuth", mentorAuth);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Server running");
});

app.use("/api/pay-now", bookingRoutes);
export default app;