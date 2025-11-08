import { getUserAnalytics } from "../services/analyticsService.js";

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id; // later from JWT
    const analytics = await getUserAnalytics(userId);

    res.json({
      success: true,
      performanceData: analytics.performanceData, // for charts
      topicsData: analytics.topicsData, // topic-wise scores
      badges: analytics.badges, // achievements
      streak: analytics.streak, // streak count
    });
  } catch (err) {
    console.error("Analytics Fetch Error:", err);
    res.status(500).json({ success: false, message: "Error fetching analytics" });
  }
};
