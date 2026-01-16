import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  slot: String,
  roomId: String,
  status: { type: String, default: "booked" }
});

export default mongoose.model("Booking", bookingSchema);
