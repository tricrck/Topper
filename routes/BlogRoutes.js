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

// Create a comment
router.post("/:blogId/comments", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = new Comment({
      blog: req.params.blogId,
      content: req.body.content,
      author: req.body.author,
      parentComment: req.body.parentComment || null,
    });

    const savedComment = await comment.save();
    blog.comments.push(savedComment._id);
    await blog.save();

    // If the comment has a parent, add this comment to the parent's replies
    if (req.body.parentComment) {
      await Comment.findByIdAndUpdate(req.body.parentComment, {
        $push: { replies: savedComment._id }
      });
    }

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all comments for a blog with nested replies
router.get("/:blogId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate({
        path: 'replies',
        populate: { path: 'author' }
      });
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

    // If the comment has a parent, remove this comment from the parent's replies
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: comment._id }
      });
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


// Like a comment
router.post("/:blogId/comments/:commentId/like", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const hasLiked = comment.likes.includes(userId);

    if (hasLiked) {
      // Unlike if already liked
      comment.likes = comment.likes.filter((likeId) => likeId !== userId);
    } else {
      // Like if not already liked
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      message: hasLiked ? "Comment like removed" : "Comment liked",
      likesCount: comment.likes.length,
      likes: comment.likes, // Return the list of user IDs
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Unlike a comment
router.post("/:blogId/comments/:commentId/unlike", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Remove user ID from the likes array
    const index = comment.likes.indexOf(req.body.userId);
    if (index !== -1) {
      comment.likes.splice(index, 1);
      await comment.save();
      return res.json({ message: "Comment unliked", likes: comment.likes.length });
    } else {
      return res.status(400).json({ message: "You haven't liked this comment yet" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;