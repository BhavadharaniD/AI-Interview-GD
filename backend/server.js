import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Route Imports
import feedbackRoutes from "../routes/feedbackRoutes.js";
import analyticsRoutes from "../routes/analyticsRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("🚀 AI Interview & GD Backend API is running...");
});

app.use("/api/feedback", feedbackRoutes);
app.use("/api/analytics", analyticsRoutes);

// Global Error Handling (Optional)
app.use((err, req, res, next) => {
  console.error("💥 Error:", err.stack);
  res.status(500).json({ success: false, message: "Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
