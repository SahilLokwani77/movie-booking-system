import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  movie: Object,
  theatre: Object,
  date: String,
  show: String,
  seats: Array,
  total: Number,
});

export default mongoose.model("Booking", bookingSchema);