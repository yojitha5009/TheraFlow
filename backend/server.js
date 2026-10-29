
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
// Middleware
app.use(express.json());
app.use(cors());

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

console.log("Registered routes: /api/auth");

// Homepage test route
app.get("/", (req, res) => {
    res.send("Welcome to TheraFlow!");
});

// Start server after connecting to MongoDB
async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`TheraFlow server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();

