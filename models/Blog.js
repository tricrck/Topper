const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Patrick Cheruiyot' },
  tags: { type: [String], default: [] }, // Optional tags for categorization
  image: { type: String }, // Optional featured image URL
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the blog is created
  updatedAt: { type: Date, default: Date.now }, // Timestamp for the last update
  isPublished: { type: Boolean, default: false }, // Publish status
});

module.exports = mongoose.model("Blog", blogSchema);
