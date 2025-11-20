const mongoose = require('mongoose');

const notificationPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    email: {
      enabled: {
        type: Boolean,
        default: true,
      },
      reservationCreated: {
        type: Boolean,
        default: true,
      },
      reservationApproved: {
        type: Boolean,
        default: true,
      },
      reservationRejected: {
        type: Boolean,
        default: true,
      },
      reservationConfirmed: {
        type: Boolean,
        default: true,
      },
      paymentReminder: {
        type: Boolean,
        default: true,
      },
      reservationReminder: {
        type: Boolean,
        default: true,
      },
      reservationCancelled: {
        type: Boolean,
        default: true,
      },
      qrCodeSent: {
        type: Boolean,
        default: true,
      },
    },
    sms: {
      enabled: {
        type: Boolean,
        default: false,
      },
      reservationApproved: {
        type: Boolean,
        default: false,
      },
      reservationReminder: {
        type: Boolean,
        default: false,
      },
    },
    push: {
      enabled: {
        type: Boolean,
        default: true,
      },
      reservationCreated: {
        type: Boolean,
        default: true,
      },
      reservationApproved: {
        type: Boolean,
        default: true,
      },
      paymentReminder: {
        type: Boolean,
        default: true,
      },
    },
    language: {
      type: String,
      enum: ['en', 'si', 'ta'],
      default: 'en',
    },
    timezone: {
      type: String,
      default: 'Asia/Colombo',
    },
  },
  {
    timestamps: true,
  }
);

// Method to check if notification type is enabled for a channel
notificationPreferenceSchema.methods.isEnabled = function (channel, type) {
  const channelPrefs = this[channel.toLowerCase()];
  if (!channelPrefs || !channelPrefs.enabled) {
    return false;
  }

  // Convert type to camelCase
  const typeKey = type
    .split('_')
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');

  return channelPrefs[typeKey] !== false;
};

// Static method to get or create default preferences for user
notificationPreferenceSchema.statics.getOrCreatePreferences = async function (userId) {
  let preferences = await this.findOne({ user: userId });
  
  if (!preferences) {
    preferences = await this.create({ user: userId });
  }
  
  return preferences;
};

const NotificationPreference = mongoose.model('NotificationPreference', notificationPreferenceSchema);

module.exports = NotificationPreference;
