import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

// GET route to fetch analytics data
router.get("/", getAnalytics);

export default router;
