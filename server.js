const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const portfolioRoutes = require("./routes/portfolioRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const blogsRoutes = require("./routes/BlogRoutes");
const UserRoutes = require("./routes/UserRoutes");

// API Routes - Define these BEFORE the static file serving
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/users", UserRoutes);

// Serve static files and handle client routing in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files
    app.use(express.static(path.join(__dirname, 'frontend/build')));

    // Handle client-side routing
    app.get('*', (req, res) => {
        // Only handle non-API routes with client routing
        if (!req.url.startsWith('/api/')) {
            res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
        }
    });
}

// MongoDB connection
const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
    });
