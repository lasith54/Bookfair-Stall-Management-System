const Notification = require('../models/Notification');
const { sendBulkEmails, testEmailConnection } = require('../services/emailService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

/**
 * Get all notifications (admin)
 */
const getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type, recipient } = req.query;

    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (type) {
      filter.type = type;
    }
    
    if (recipient) {
      filter.recipient = recipient;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Notification.countDocuments(filter);

    // Get statistics
    const stats = await Notification.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return successResponse(res, {
      notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
      statistics: stats.reduce((acc, curr) => {
        acc[curr._id.toLowerCase()] = curr.count;
        return acc;
      }, {}),
    }, 'Notifications retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Send bulk notifications (admin)
 */
const sendBulkNotifications = async (req, res) => {
  try {
    const { recipientIds, subject, message, type, templateData } = req.body;

    if (!recipientIds || recipientIds.length === 0) {
      return errorResponse(res, 'At least one recipient is required', 400);
    }

    // Get user data for recipients
    const User = require('../models/User');
    const users = await User.find({ _id: { $in: recipientIds } });

    if (users.length === 0) {
      return errorResponse(res, 'No valid recipients found', 404);
    }

    const result = await sendBulkEmails(
      users.map(u => ({ name: u.name, email: u.email })),
      subject,
      templateData || { message },
      type || 'default'
    );

    return successResponse(res, result, 'Bulk notifications sent');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Retry failed notifications (admin)
 */
const retryFailedNotifications = async (req, res) => {
  try {
    const failedNotifications = await Notification.find({
      status: 'FAILED',
    });

    const retriableNotifications = failedNotifications.filter(n => n.canRetry());

    let successCount = 0;
    let failCount = 0;

    for (const notification of retriableNotifications) {
      try {
        const { sendNotificationEmail } = require('../services/emailService');
        await sendNotificationEmail(notification);
        successCount++;
      } catch (error) {
        failCount++;
      }
    }

    return successResponse(res, {
      total: retriableNotifications.length,
      successful: successCount,
      failed: failCount,
    }, 'Failed notifications retry completed');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get notification statistics (admin)
 */
const getNotificationStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const stats = await Notification.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            status: '$status',
            type: '$type',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.type',
          statuses: {
            $push: {
              status: '$_id.status',
              count: '$count',
            },
          },
          total: { $sum: '$count' },
        },
      },
    ]);

    const totalCount = await Notification.countDocuments(filter);
    const pendingCount = await Notification.countDocuments({ ...filter, status: 'PENDING' });
    const sentCount = await Notification.countDocuments({ ...filter, status: 'SENT' });
    const failedCount = await Notification.countDocuments({ ...filter, status: 'FAILED' });

    return successResponse(res, {
      overview: {
        total: totalCount,
        pending: pendingCount,
        sent: sentCount,
        failed: failedCount,
      },
      byType: stats,
    }, 'Notification statistics retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Test email configuration (admin)
 */
const testEmail = async (req, res) => {
  try {
    const result = await testEmailConnection();
    return successResponse(res, result, result.message);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Delete notification (admin)
 */
const deleteNotificationAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }

    return successResponse(res, null, 'Notification deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getAllNotifications,
  sendBulkNotifications,
  retryFailedNotifications,
  getNotificationStats,
  testEmail,
  deleteNotificationAdmin,
};
