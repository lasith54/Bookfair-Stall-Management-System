const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'RESERVATION_CREATED',
        'RESERVATION_APPROVED',
        'RESERVATION_REJECTED',
        'RESERVATION_CONFIRMED',
        'PAYMENT_REMINDER',
        'RESERVATION_REMINDER',
        'RESERVATION_CANCELLED',
        'QR_CODE_SENT',
      ],
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
      required: true,
      index: true,
    },
    channel: {
      type: String,
      enum: ['EMAIL', 'SMS', 'PUSH'],
      default: 'EMAIL',
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    emailData: {
      to: String,
      cc: [String],
      bcc: [String],
      attachments: [
        {
          filename: String,
          path: String,
          contentType: String,
        },
      ],
    },
    status: {
      type: String,
      enum: ['PENDING', 'SENT', 'FAILED', 'DELIVERED', 'BOUNCED'],
      default: 'PENDING',
      index: true,
    },
    sentAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    failureReason: {
      type: String,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    maxRetries: {
      type: Number,
      default: 3,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    priority: {
      type: String,
      enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
      default: 'NORMAL',
    },
    scheduledFor: {
      type: Date,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ status: 1, scheduledFor: 1 });
notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ type: 1, status: 1 });

// Mark notification as read
notificationSchema.methods.markAsRead = function () {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Mark notification as sent
notificationSchema.methods.markAsSent = function () {
  this.status = 'SENT';
  this.sentAt = new Date();
  return this.save();
};

// Mark notification as failed
notificationSchema.methods.markAsFailed = function (reason) {
  this.status = 'FAILED';
  this.failureReason = reason;
  this.retryCount += 1;
  return this.save();
};

// Check if can retry
notificationSchema.methods.canRetry = function () {
  return this.retryCount < this.maxRetries;
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({ recipient: userId, read: false });
};

// Static method to get pending notifications
notificationSchema.statics.getPending = function () {
  return this.find({
    status: 'PENDING',
    $or: [
      { scheduledFor: null },
      { scheduledFor: { $lte: new Date() } },
    ],
  }).sort({ priority: -1, createdAt: 1 });
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
