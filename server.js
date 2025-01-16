const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Routes
const portfolioRoutes = require("./routes/portfolioRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const blogsRoutes = require("./routes/BlogRoutes");
const UserRoutes = require("./routes/UserRoutes");

app.use("/api/portfolio", portfolioRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/users", UserRoutes);

// MongoDB connection
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {

    console.error('Successfully connected to MongoDB');

  })
  .catch(err => {

    console.error('Failed to connect to MongoDB', err);

  });
  
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });