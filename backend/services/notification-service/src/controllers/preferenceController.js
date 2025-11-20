const NotificationPreference = require('../models/NotificationPreference');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

/**
 * Get user notification preferences
 */
const getMyPreferences = async (req, res) => {
  try {
    const userId = req.user.userId;

    const preferences = await NotificationPreference.getOrCreatePreferences(userId);

    return successResponse(res, preferences, 'Preferences retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Update notification preferences
 */
const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { email, sms, push, language, timezone } = req.body;

    let preferences = await NotificationPreference.findOne({ user: userId });

    if (!preferences) {
      preferences = new NotificationPreference({ user: userId });
    }

    // Update email preferences
    if (email) {
      preferences.email = { ...preferences.email, ...email };
    }

    // Update SMS preferences
    if (sms) {
      preferences.sms = { ...preferences.sms, ...sms };
    }

    // Update push preferences
    if (push) {
      preferences.push = { ...preferences.push, ...push };
    }

    // Update language
    if (language) {
      preferences.language = language;
    }

    // Update timezone
    if (timezone) {
      preferences.timezone = timezone;
    }

    await preferences.save();

    return successResponse(res, preferences, 'Preferences updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Reset preferences to default
 */
const resetPreferences = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Delete existing preferences
    await NotificationPreference.findOneAndDelete({ user: userId });

    // Create new default preferences
    const preferences = await NotificationPreference.getOrCreatePreferences(userId);

    return successResponse(res, preferences, 'Preferences reset to default');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getMyPreferences,
  updatePreferences,
  resetPreferences,
};
