import express from "express";
import { getFeedbackAnalysis } from "../controllers/feedbackController.js";

const router = express.Router();

// POST route to analyze feedback
router.post("/analyze", getFeedbackAnalysis);

export default router;
