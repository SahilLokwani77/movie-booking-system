import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("GET BOOKINGS CALLED");

    const bookings = await Booking.find();

    res.json(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("POST BOOKING CALLED");
    console.log(req.body);

    const booking = new Booking(req.body);

    await booking.save();

    console.log("BOOKING SAVED");

    res.status(201).json(booking);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;