const express = require("express");
const Testimonial = require("../models/Testimonial");
const router = express.Router();

// Create - Add a testimonial
router.post("/", async (req, res) => {
  try {
    console.log(req.body)
    const newTestimonial = new Testimonial(req.body);
    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read - Get all testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Read - Get a single testimonial by ID
router.get("/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update - Update a testimonial
router.put("/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'testimonial', 'designation', 'link'];
    allowedUpdates.forEach(update => {
      if (req.body[update] !== undefined) {
        testimonial[update] = req.body[update];
      }
    });

    await testimonial.save();
    res.json(testimonial);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
});

// Delete - Delete a testimonial
router.delete("/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    
    await testimonial.deleteOne();
    res.json({ message: "Testimonial deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search - Search testimonials by name or designation
router.get("/search/:query", async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const testimonials = await Testimonial.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { designation: { $regex: searchQuery, $options: 'i' } }
      ]
    });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;