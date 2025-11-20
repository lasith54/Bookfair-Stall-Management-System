const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
  getAllNotifications,
  sendBulkNotifications,
  retryFailedNotifications,
  getNotificationStats,
  testEmail,
  deleteNotificationAdmin,
} = require('../controllers/adminNotificationController');
const {
  validateNotificationQuery,
  validateBulkNotification,
  validateNotificationStats,
  validateMongoId,
} = require('../middleware/validation');

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRole('ADMIN'));

// Get all notifications
router.get('/', validateNotificationQuery, getAllNotifications);

// Get notification statistics
router.get('/stats', validateNotificationStats, getNotificationStats);

// Test email configuration
router.get('/test-email', testEmail);

// Send bulk notifications
router.post('/bulk', validateBulkNotification, sendBulkNotifications);

// Retry failed notifications
router.post('/retry-failed', retryFailedNotifications);

// Delete notification
router.delete('/:id', validateMongoId, deleteNotificationAdmin);

module.exports = router;
