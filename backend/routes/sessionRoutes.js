const express = require('express');
const router = express.Router();
const { sessionController } = require('../controllers');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

/**
 * @route   POST /api/sessions/start
 * @desc    Start a new practice session
 * @access  Private
 */
router.post('/start', protect, sessionController.startSession);

/**
 * @route   POST /api/sessions/:sessionId/end
 * @desc    End a practice session
 * @access  Private
 */
router.post('/:sessionId/end', protect, sessionController.endSession);

/**
 * @route   POST /api/sessions/:sessionId/process-audio
 * @desc    Process audio input during session
 * @access  Private
 */
router.post(
  '/:sessionId/process-audio',
  protect,
  upload.single('audio'),
  sessionController.processAudio
);

/**
 * @route   POST /api/sessions/:sessionId/message
 * @desc    Add text message to session
 * @access  Private
 */
router.post('/:sessionId/message', protect, sessionController.addMessage);

/**
 * @route   GET /api/sessions/:sessionId
 * @desc    Get specific session details (fetch previous session)
 * @access  Private
 */
router.get('/:sessionId', protect, sessionController.getSession);

/**
 * @route   GET /api/sessions
 * @desc    Get all sessions for current user
 * @access  Private
 */
router.get('/', protect, sessionController.getUserSessions);

/**
 * @route   GET /api/sessions/recent/list
 * @desc    Get recent sessions
 * @access  Private
 */
router.get('/recent/list', protect, sessionController.getRecentSessions);

/**
 * @route   DELETE /api/sessions/:sessionId
 * @desc    Delete a session (soft delete/archive)
 * @access  Private
 */
router.delete('/:sessionId', protect, sessionController.deleteSession);

module.exports = router;