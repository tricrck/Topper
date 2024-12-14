const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: [String], required: true },
  link: { type: String },
  image: { type: String },
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
