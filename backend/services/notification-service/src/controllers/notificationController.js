const Notification = require('../models/Notification');
const NotificationPreference = require('../models/NotificationPreference');
const { sendNotificationEmail } = require('../services/emailService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

/**
 * Get all notifications for logged-in user
 */
const getMyNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, read, type } = req.query;
    const userId = req.user.userId;

    const filter = { recipient: userId };
    
    if (read !== undefined) {
      filter.read = read === 'true';
    }
    
    if (type) {
      filter.type = type;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Notification.countDocuments(filter);
    const unreadCount = await Notification.getUnreadCount(userId);

    return successResponse(res, {
      notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
      unreadCount,
    }, 'Notifications retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get notification by ID
 */
const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const notification = await Notification.findOne({
      _id: id,
      recipient: userId,
    });

    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }

    return successResponse(res, notification, 'Notification retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Mark notification as read
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const notification = await Notification.findOne({
      _id: id,
      recipient: userId,
    });

    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }

    if (notification.read) {
      return successResponse(res, notification, 'Notification already marked as read');
    }

    await notification.markAsRead();

    return successResponse(res, notification, 'Notification marked as read');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Mark all notifications as read
 */
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true, readAt: new Date() } }
    );

    return successResponse(res, null, 'All notifications marked as read');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Delete notification
 */
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipient: userId,
    });

    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }

    return successResponse(res, null, 'Notification deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get unread count
 */
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const count = await Notification.getUnreadCount(userId);

    return successResponse(res, { unreadCount: count }, 'Unread count retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Resend notification email
 */
const resendNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const notification = await Notification.findOne({
      _id: id,
      recipient: userId,
    });

    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }

    // Reset status to pending
    notification.status = 'PENDING';
    notification.sentAt = null;
    notification.deliveredAt = null;
    notification.failureReason = null;
    await notification.save();

    // Resend email
    const result = await sendNotificationEmail(notification);

    return successResponse(res, result, 'Notification resent successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Send notification (Inter-service communication endpoint)
 * No authentication required - for internal service calls only
 */
const sendNotification = async (req, res) => {
  try {
    const { type, recipient, recipientEmail, reservation, data } = req.body;

    // Validate required fields
    if (!type || !recipient || !recipientEmail) {
      return errorResponse(res, 'Missing required fields: type, recipient, recipientEmail', 400);
    }

    // Check user notification preferences
    const preferences = await NotificationPreference.findOne({ userId: recipient });
    
    // If preferences exist and email is disabled, skip sending
    if (preferences && !preferences.channels.email) {
      console.log(`Email notifications disabled for user ${recipient}`);
      return successResponse(res, { sent: false }, 'Email notifications disabled for user');
    }

    // Create notification document
    const notification = await Notification.create({
      type,
      recipient,
      recipientEmail,
      reservation,
      data,
      status: 'PENDING'
    });

    // Send email asynchronously (don't wait for response)
    sendNotificationEmail(notification)
      .then(() => {
        console.log(`Notification sent successfully: ${type} to ${recipientEmail}`);
      })
      .catch((error) => {
        console.error(`Failed to send notification: ${error.message}`);
      });

    return successResponse(res, { 
      notificationId: notification._id,
      sent: true 
    }, 'Notification queued successfully', 201);
  } catch (error) {
    console.error('Send notification error:', error);
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getMyNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  resendNotification,
  sendNotification,
};
