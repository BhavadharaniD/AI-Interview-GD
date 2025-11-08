import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Route imports (adjust paths if your routes live elsewhere)
import feedbackRoutes from "./routes/feedbackRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

// Middleware imports (optional — create these if not present)
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads", "audio");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/analytics", analyticsRoutes);

// Root/info route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Interview Platform API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      sessions: "/api/sessions",
      feedback: "/api/feedback",
      analytics: "/api/analytics",
    },
  });
});

// 404 and error middleware (use if implemented)
if (typeof notFound === "function") app.use(notFound);
if (typeof errorHandler === "function") app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  await connectDB();
  server = app.listen(PORT, () => {
    console.log(
      `⚡ Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
    );
  });
};

startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err?.message || err}`);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

export default app;
