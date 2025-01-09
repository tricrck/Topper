const express = require("express");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const router = express.Router();

// Create blog
router.post("/", async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().populate('comments');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single blog
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('comments');
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update blog
router.put("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    
    Object.assign(blog, req.body);
    blog.updatedAt = Date.now();
    await blog.save();
    
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete blog
router.delete("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    
    // Delete associated comments first
    await Comment.deleteMany({ blog: req.params.id });
    
    // Then delete the blog
    await blog.deleteOne();
    res.json({ message: "Blog and associated comments deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Comment routes
// Create comment
router.post("/:blogId/comments", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = new Comment({
      blog: req.params.blogId,
      content: req.body.content,
      author: req.body.author
    });

    const savedComment = await comment.save();
    blog.comments.push(savedComment._id);
    await blog.save();

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all comments for a blog
router.get("/:blogId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update comment
router.put("/:blogId/comments/:commentId", async (req, res) => {
  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.commentId, blog: req.params.blogId },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete comment
router.delete("/:blogId/comments/:commentId", async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.commentId,
      blog: req.params.blogId
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Remove comment reference from blog
    await Blog.findByIdAndUpdate(req.params.blogId, {
      $pull: { comments: req.params.commentId }
    });

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;