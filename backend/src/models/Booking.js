import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({

  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  sessionDate: {
    type: Date,
    required: true,
    index: true
  },

  startTime: {
    type: String,
    required: true
  },

  endTime: {
    type: String,
    required: true
  },

  sessionDuration: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: [
      "scheduled",
      "confirmed",
      "meeting_ready",
      "meeting_started",
      "meeting_finished",
      "cancelled",
      "completed"
    ],
    default: "confirmed",
    index: true
  },

  price: {
    type: Number,
    default: 0
  },

  meetingLink: {
    type: String,
    default: null
  }

}, { timestamps: true });

BookingSchema.index(
  {
    mentor: 1,
    sessionDate: 1,
    startTime: 1
  },
  { unique: true }
);


const Booking =
  mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);

export default Booking;