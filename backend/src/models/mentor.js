import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  expertise: String,
  bio: String,
  chargePerHour: Number,
  freeSlots: [{
    date: String,
    startTime: String,
    endTime: String
  }]
});

export default mongoose.model("Mentor", mentorSchema);
