const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Routes
router.post("/", async (req, res) => {
  const { uid, email, displayName, photoURL } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ uid });
    if (!user) {
      // Create a new user
      user = new User({ uid, email, displayName, photoURL });
      await user.save();
    }
    res.status(201).json({ message: "User signed up successfully", user });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user by UID
router.get("/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
