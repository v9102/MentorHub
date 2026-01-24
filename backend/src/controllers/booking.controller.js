import Booking from "../models/booking.js";
import { v4 as uuidv4 } from "uuid";

export const bookSlot = async (req, res) => {
  const roomId = uuidv4();

  const booking = await Booking.create({
    mentorId: req.body.mentorId,
    studentId: req.user.id,
    slot: req.body.slot,
    roomId
  });

  res.json(booking);
};
