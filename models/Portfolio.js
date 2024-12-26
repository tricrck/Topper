const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 70 },
  role: { type: String, maxlength: 100 }, // Optional role field
  description: { type: String, required: true, maxlength: 600 },
  technologies: { type: [String], required: true },
  link: { type: String }, // Optional link to project
  image: { type: String }, // Optional image
  skills: { type: [String], required: true, maxlength: 5 }, // List of skills, max 5
}, { timestamps: true }); // Optional: Add timestamps for creation and update

module.exports = mongoose.model("Portfolio", portfolioSchema);
