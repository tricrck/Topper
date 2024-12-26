const express = require("express");
const Testimonial = require("../models/Testimonial");
// const testimonials = require("./testimonials.json");

const router = express.Router();

// Add a testimonial
router.post("/", async (req, res) => {
  try {
    const newTestimonial = new Testimonial(req.body);
    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
