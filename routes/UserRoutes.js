const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Routes
router.post("/api/signup", async (req, res) => {
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

module.exports = router;
