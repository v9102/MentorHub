import express from "express";
import mentorRoutes from "./routes/mentor.routes.js";
import mentorAuth from "./routes/mentorAuth.routes.js"
import webhookRoutes from "./routes/webhook.routes.js";

const app = express();

app.use(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  webhookRoutes
);

app.use(express.json());

app.use("/api/mentor", mentorRoutes);
app.use("/api/mentorAuth",mentorAuth)

app.get("/", (req, res) => {
  res.send("Server running");
});

export default app;
