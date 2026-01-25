import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();
    app.listen(5000, () => console.log("Server running on port 5000"));
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
};

startServer();
