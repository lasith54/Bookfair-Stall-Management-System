const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getMyNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  resendNotification,
} = require('../controllers/notificationController');
const {
  validateNotificationQuery,
  validateMongoId,
} = require('../middleware/validation');

// All routes require authentication
router.use(authenticateToken);

// Get all notifications for logged-in user
router.get('/', validateNotificationQuery, getMyNotifications);

// Get unread count
router.get('/unread-count', getUnreadCount);

// Mark all as read
router.put('/mark-all-read', markAllAsRead);

// Get notification by ID
router.get('/:id', validateMongoId, getNotificationById);

// Mark notification as read
router.put('/:id/read', validateMongoId, markAsRead);

// Resend notification
router.post('/:id/resend', validateMongoId, resendNotification);

// Delete notification
router.delete('/:id', validateMongoId, deleteNotification);

module.exports = router;
