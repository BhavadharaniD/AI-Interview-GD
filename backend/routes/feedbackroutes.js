const express = require('express');
const router = express.Router();
const { feedbackController } = require('../controllers');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/feedback/generate/:sessionId
 * @desc    Generate feedback for a completed session
 * @access  Private
 */
router.post('/generate/:sessionId', protect, feedbackController.generateFeedback);

/**
 * @route   POST /api/feedback/analyze
 * @desc    Analyze session and generate feedback (alias for generate)
 * @access  Private
 */
router.post('/analyze', protect, async (req, res, next) => {
  // Extract sessionId from request body and add to params
  req.params.sessionId = req.body.sessionId;
  feedbackController.generateFeedback(req, res, next);
});

/**
 * @route   GET /api/feedback/report/:sessionId
 * @desc    Get feedback report for a specific session
 * @access  Private
 */
router.get('/report/:sessionId', protect, feedbackController.getSessionFeedback);

/**
 * @route   GET /api/feedback/session/:sessionId
 * @desc    Get feedback for a session (alternative endpoint)
 * @access  Private
 */
router.get('/session/:sessionId', protect, feedbackController.getSessionFeedback);

/**
 * @route   GET /api/feedback
 * @desc    Get all feedback for current user
 * @access  Private
 */
router.get('/', protect, feedbackController.getUserFeedback);

/**
 * @route   GET /api/feedback/history
 * @desc    Get feedback history
 * @access  Private
 */
router.get('/history', protect, feedbackController.getFeedbackHistory);

/**
 * @route   GET /api/feedback/average-scores
 * @desc    Get average scores across all sessions
 * @access  Private
 */
router.get('/average-scores', protect, feedbackController.getAverageScores);

/**
 * @route   GET /api/feedback/suggestions
 * @desc    Get personalized improvement suggestions
 * @access  Private
 */
router.get('/suggestions', protect, feedbackController.getImprovementSuggestions);

/**
 * @route   PUT /api/feedback/:feedbackId/mark-read
 * @desc    Mark feedback as read
 * @access  Private
 */
router.put('/:feedbackId/mark-read', protect, feedbackController.markFeedbackAsRead);

/**
 * @route   PUT /api/feedback/:feedbackId/rate
 * @desc    Rate feedback quality
 * @access  Private
 */
router.put('/:feedbackId/rate', protect, feedbackController.rateFeedback);

module.exports = router;