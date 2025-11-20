const emailConfig = require('../config/email');
const { getEmailTemplate } = require('./templateEngine');
const Notification = require('../models/Notification');
const NotificationPreference = require('../models/NotificationPreference');

/**
 * Send email
 */
const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    const mailOptions = {
      from: emailConfig.defaults.from,
      to,
      subject,
      html,
      attachments,
    };

    const info = await emailConfig.transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

/**
 * Send notification email
 */
const sendNotificationEmail = async (notification) => {
  try {
    // Check if notification is already sent
    if (notification.status === 'SENT' || notification.status === 'DELIVERED') {
      return {
        success: true,
        message: 'Notification already sent',
      };
    }

    // Check user preferences
    const preferences = await NotificationPreference.getOrCreatePreferences(
      notification.recipient
    );

    if (!preferences.isEnabled('EMAIL', notification.type)) {
      notification.status = 'FAILED';
      notification.failureReason = 'Email notifications disabled by user';
      await notification.save();
      
      return {
        success: false,
        message: 'Email notifications disabled by user',
      };
    }

    // Populate notification data
    await notification.populate('recipient reservation');

    // Prepare email data
    const emailData = {
      user: {
        name: notification.recipient.name,
        email: notification.recipient.email,
      },
      reservation: notification.reservation,
      subject: notification.subject,
      message: notification.message,
      metadata: notification.metadata || {},
    };

    // Get email HTML from template
    const html = await getEmailTemplate(notification.type, emailData);

    // Prepare attachments
    const attachments = notification.emailData?.attachments || [];

    // Send email
    const result = await sendEmail(
      notification.emailData?.to || notification.recipient.email,
      notification.subject,
      html,
      attachments
    );

    // Update notification status
    if (result.success) {
      await notification.markAsSent();
    } else {
      await notification.markAsFailed('Email sending failed');
    }

    return result;
  } catch (error) {
    // Mark as failed and increment retry count
    await notification.markAsFailed(error.message);

    throw new Error(`Notification email failed: ${error.message}`);
  }
};

/**
 * Send bulk emails
 */
const sendBulkEmails = async (recipients, subject, templateData, templateType) => {
  try {
    const results = [];

    for (const recipient of recipients) {
      try {
        const html = await getEmailTemplate(templateType, {
          user: recipient,
          ...templateData,
        });

        const result = await sendEmail(recipient.email, subject, html);
        
        results.push({
          email: recipient.email,
          success: true,
          messageId: result.messageId,
        });
      } catch (error) {
        results.push({
          email: recipient.email,
          success: false,
          error: error.message,
        });
      }
    }

    return {
      total: recipients.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };
  } catch (error) {
    throw new Error(`Bulk email sending failed: ${error.message}`);
  }
};

/**
 * Test email configuration
 */
const testEmailConnection = async () => {
  try {
    await emailConfig.transporter.verify();
    return {
      success: true,
      message: 'Email configuration is valid',
    };
  } catch (error) {
    return {
      success: false,
      message: `Email configuration error: ${error.message}`,
    };
  }
};

module.exports = {
  sendEmail,
  sendNotificationEmail,
  sendBulkEmails,
  testEmailConnection,
};
