const express = require("express");
const Portfolio = require("../models/Portfolio");
const items = require("./porfolio_items");

const router = express.Router();

// Add a portfolio item
router.post("/", async (req, res) => {
  try {
    const newPortfolio = new Portfolio(req.body);
    await newPortfolio.save();
    res.status(201).json(newPortfolio);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all portfolio items (from database and JSON file)
router.get("/", async (req, res) => {
  try {
    // const dbPortfolios = await Portfolio.find();
    // ...dbPortfolios,
    const allPortfolios = [...items]; // Fetch from JSON file
    res.json(allPortfolios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
