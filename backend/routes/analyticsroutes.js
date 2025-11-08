const express = require('express');
const router = express.Router();
const { analyticsController } = require('../controllers');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard statistics for current user
 * @access  Private
 */
router.get('/dashboard', protect, analyticsController.getDashboardStats);

/**
 * @route   GET /api/analytics/progress
 * @desc    Get progress trends over time
 * @access  Private
 */
router.get('/progress', protect, analyticsController.getProgressTrends);

/**
 * @route   GET /api/analytics/progress/:userId
 * @desc    Get progress for specific user (admin/user themselves)
 * @access  Private
 */
router.get('/progress/:userId', protect, async (req, res, next) => {
  // Verify user can access this data
  if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized access to user progress'
    });
  }
  // Override req.user.id with userId from params
  req.user.id = req.params.userId;
  analyticsController.getProgressTrends(req, res, next);
});

/**
 * @route   GET /api/analytics/performance-by-type
 * @desc    Get performance breakdown by session type
 * @access  Private
 */
router.get('/performance-by-type', protect, analyticsController.getPerformanceByType);

/**
 * @route   GET /api/analytics/improvement-trend
 * @desc    Get improvement trend analysis
 * @access  Private
 */
router.get('/improvement-trend', protect, analyticsController.getImprovementTrend);

/**
 * @route   GET /api/analytics/metric/:metricName
 * @desc    Get detailed analytics for a specific metric
 * @access  Private
 */
router.get('/metric/:metricName', protect, analyticsController.getMetricAnalytics);

/**
 * @route   GET /api/analytics/session-summary
 * @desc    Get session statistics summary
 * @access  Private
 */
router.get('/session-summary', protect, analyticsController.getSessionSummary);

/**
 * @route   GET /api/analytics/strengths-weaknesses
 * @desc    Get strengths and weaknesses analysis
 * @access  Private
 */
router.get('/strengths-weaknesses', protect, analyticsController.getStrengthsWeaknesses);

/**
 * @route   GET /api/analytics/badges/:userId
 * @desc    Get user badges and achievements
 * @access  Private
 */
router.get('/badges/:userId', protect, async (req, res) => {
  try {
    // Verify user can access this data
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to user badges'
      });
    }

    // TODO: Implement badge/achievement system
    // For now, return mock data based on user stats
    const { Session, Feedback } = require('../models');
    const userId = req.params.userId;

    const [sessionCount, avgScore] = await Promise.all([
      Session.countDocuments({ userId, status: 'completed' }),
      Feedback.aggregate([
        { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
        { $group: { _id: null, avgScore: { $avg: '$detailedScores.fluency.score' } } }
      ])
    ]);

    const badges = [];

    // Award badges based on achievements
    if (sessionCount >= 1) badges.push({ id: 1, name: 'First Step', description: 'Completed first session', icon: '🎯', earnedAt: new Date() });
    if (sessionCount >= 10) badges.push({ id: 2, name: 'Dedicated', description: 'Completed 10 sessions', icon: '🔥', earnedAt: new Date() });
    if (sessionCount >= 50) badges.push({ id: 3, name: 'Champion', description: 'Completed 50 sessions', icon: '🏆', earnedAt: new Date() });
    if (sessionCount >= 100) badges.push({ id: 4, name: 'Master', description: 'Completed 100 sessions', icon: '👑', earnedAt: new Date() });

    const averageScore = avgScore[0]?.avgScore || 0;
    if (averageScore >= 80) badges.push({ id: 5, name: 'High Achiever', description: 'Average score above 80', icon: '⭐', earnedAt: new Date() });
    if (averageScore >= 90) badges.push({ id: 6, name: 'Excellence', description: 'Average score above 90', icon: '💎', earnedAt: new Date() });

    res.status(200).json({
      success: true,
      data: {
        badges,
        stats: {
          totalBadges: badges.length,
          totalSessions: sessionCount,
          averageScore: Math.round(averageScore)
        }
      }
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching badges',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/analytics/export
 * @desc    Export analytics data
 * @access  Private
 */
router.get('/export', protect, analyticsController.exportAnalytics);

module.exports = router;