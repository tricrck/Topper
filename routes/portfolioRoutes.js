const express = require("express");
const Portfolio = require("../models/Portfolio");
const router = express.Router();

// Create - Add a portfolio item
router.post("/", async (req, res) => {
  try {
    const newPortfolio = new Portfolio(req.body);
    await newPortfolio.save();
    res.status(201).json(newPortfolio);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read - Get all portfolio items
router.get("/", async (req, res) => {
  try {
    const portfolios = await Portfolio.find();
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Read - Get a single portfolio item by ID
router.get("/:id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update - Update a portfolio item
router.put("/:id", async (req, res) => {
  try {
    // Validate skills array length
    if (req.body.skills && req.body.skills.length > 5) {
      return res.status(400).json({ message: "Maximum 5 skills allowed" });
    }

    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    // Update fields
    const allowedUpdates = [
      'title',
      'role',
      'description',
      'technologies',
      'link',
      'image',
      'skills'
    ];

    allowedUpdates.forEach(update => {
      if (req.body[update] !== undefined) {
        portfolio[update] = req.body[update];
      }
    });

    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
});

// Delete - Delete a portfolio item
router.delete("/:id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }
    
    await portfolio.deleteOne();
    res.json({ message: "Portfolio item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search - Search portfolio items by title or technologies
router.get("/search/:query", async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const portfolios = await Portfolio.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { technologies: { $in: [new RegExp(searchQuery, 'i')] } }
      ]
    });
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;