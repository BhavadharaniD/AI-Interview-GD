const { protect, authorize, optionalAuth } = require('./authMiddleware');
const { validateSignup, validateLogin, validateSession, validateFeedbackRating, validatePasswordChange } = require('./validationMiddleware');
const { upload, memoryUpload, handleMulterError } = require('./uploadMiddleware');
const { errorHandler, notFound, asyncHandler } = require('./errorMiddleware');

module.exports = {
  protect,
  authorize,
  optionalAuth,
  validateSignup,
  validateLogin,
  validateSession,
  validateFeedbackRating,
  validatePasswordChange,
  upload,
  memoryUpload,
  handleMulterError,
  errorHandler,
  notFound,
  asyncHandler
};