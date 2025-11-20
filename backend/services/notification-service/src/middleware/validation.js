const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Preference validation
const validatePreferenceUpdate = [
  body('email').optional().isObject().withMessage('Email preferences must be an object'),
  body('sms').optional().isObject().withMessage('SMS preferences must be an object'),
  body('push').optional().isObject().withMessage('Push preferences must be an object'),
  body('language').optional().isIn(['en', 'si', 'ta']).withMessage('Invalid language'),
  body('timezone').optional().isString().withMessage('Invalid timezone'),
  handleValidationErrors,
];

// QR code validation
const validateQRCodeGeneration = [
  param('reservationId').isMongoId().withMessage('Invalid reservation ID'),
  handleValidationErrors,
];

const validateQRCodeVerification = [
  body('qrData').notEmpty().withMessage('QR code data is required'),
  handleValidationErrors,
];

const validateQRCodeScan = [
  body('qrData').notEmpty().withMessage('QR code data is required'),
  body('location').optional().isString().withMessage('Location must be a string'),
  body('deviceInfo').optional().isString().withMessage('Device info must be a string'),
  handleValidationErrors,
];

// Notification validation
const validateNotificationQuery = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('read').optional().isBoolean().withMessage('Read must be a boolean'),
  query('type').optional().isIn([
    'RESERVATION_CREATED',
    'RESERVATION_APPROVED',
    'RESERVATION_REJECTED',
    'RESERVATION_CONFIRMED',
    'PAYMENT_REMINDER',
    'RESERVATION_REMINDER',
    'RESERVATION_CANCELLED',
    'QR_CODE_SENT',
  ]).withMessage('Invalid notification type'),
  handleValidationErrors,
];

const validateBulkNotification = [
  body('recipientIds').isArray({ min: 1 }).withMessage('At least one recipient ID is required'),
  body('recipientIds.*').isMongoId().withMessage('Invalid recipient ID'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('type').optional().isString().withMessage('Type must be a string'),
  handleValidationErrors,
];

const validateNotificationStats = [
  query('startDate').optional().isISO8601().withMessage('Invalid start date format'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date format'),
  handleValidationErrors,
];

const validateMongoId = [
  param('id').isMongoId().withMessage('Invalid ID'),
  handleValidationErrors,
];

module.exports = {
  validatePreferenceUpdate,
  validateQRCodeGeneration,
  validateQRCodeVerification,
  validateQRCodeScan,
  validateNotificationQuery,
  validateBulkNotification,
  validateNotificationStats,
  validateMongoId,
};
