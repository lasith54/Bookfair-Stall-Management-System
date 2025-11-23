const emailConfig = require('../config/email');
const { getEmailTemplate } = require('./templateEngine');
const Notification = require('../models/Notification');
const NotificationPreference = require('../models/NotificationPreference');
const { generateQRCode } = require('./qrcodeService');

/**
 * Send email
 */
const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    console.log(`[sendEmail] Preparing to send email to ${to}`);
    console.log(`[sendEmail] Attachments received: ${attachments.length}`);
    
    const mailOptions = {
      from: emailConfig.defaults.from,
      to,
      subject,
      html,
      attachments,
    };

    console.log(`[sendEmail] Mail options prepared with ${mailOptions.attachments?.length || 0} attachments`);

    const info = await emailConfig.transporter.sendMail(mailOptions);

    console.log(`[sendEmail] Email sent successfully, messageId: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error(`[sendEmail] Error sending email:`, error.message);
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

    // Populate notification data if references exist
    if (notification.recipient && typeof notification.recipient !== 'object') {
      await notification.populate('recipient');
    }
    if (notification.reservation && typeof notification.reservation !== 'object') {
      await notification.populate('reservation');
    }

    // Generate subject if not provided
    const subject = notification.subject || getSubjectForType(notification.type, notification.data);

    // Prepare email data - merge notification.data with populated fields
    const emailData = {
      ...notification.data, // Custom data from inter-service call
      user: notification.recipient ? {
        name: notification.recipient.name || notification.data?.userName,
        email: notification.recipient.email || notification.recipientEmail,
      } : {
        name: notification.data?.userName,
        email: notification.recipientEmail,
      },
      reservation: notification.reservation,
      subject: subject,
      message: notification.message,
      metadata: notification.metadata || {},
    };

    // Prepare attachments - use a new array, not from notification object
    // (to avoid Mongoose serialization issues with Buffers)
    let attachments = [];

    // Generate and attach QR code for reservation confirmation emails
    if (notification.type === 'RESERVATION_CONFIRMED' && notification.data?.reservationId) {
      try {
        // Prepare reservation object for QR code generation
        const reservationForQR = {
          _id: notification.data.reservationId,
          reservationNumber: notification.data.reservationNumber,
          startDate: notification.data.startDate,
          endDate: notification.data.endDate,
          totalAmount: notification.data.totalAmount,
          status: 'confirmed',
          stall: {
            _id: notification.data.stallId || 'unknown',
            name: notification.data.stallNumber || 'Unknown Stall'
          }
        };

        // Prepare user object for QR code generation
        const userForQR = {
          _id: notification.recipient?._id || notification.recipient,
          email: notification.recipientEmail || notification.recipient?.email,
          name: notification.data?.userName
        };

        // Generate QR code
        const qrCodeRecord = await generateQRCode(reservationForQR, userForQR);

        console.log(`QR code record generated, image length: ${qrCodeRecord.qrCodeImage?.length || 0}`);

        // The qrCodeImage from DB contains the full data URL: "data:image/png;base64,..."
        // We need just the base64 part for the attachment
        let qrImageBase64 = qrCodeRecord.qrCodeImage;
        if (qrImageBase64.startsWith('data:')) {
          qrImageBase64 = qrImageBase64.split(',')[1];
        }
        
        console.log(`Base64 data extracted, length: ${qrImageBase64.length}`);
        console.log(`First 50 chars of base64: ${qrImageBase64.substring(0, 50)}`);

        // Convert base64 to Buffer
        const qrImageBuffer = Buffer.from(qrImageBase64, 'base64');
        console.log(`Buffer created, size: ${qrImageBuffer.length} bytes`);
        console.log(`Buffer type: ${typeof qrImageBuffer}, isBuffer: ${Buffer.isBuffer(qrImageBuffer)}`);

        // Attach QR code as inline image with CID (for display in email body)
        const inlineAttachment = {
          filename: 'qrcode.png',
          content: qrImageBuffer,
          cid: 'qrcode', // Content-ID that matches the template
          contentDisposition: 'inline',
          contentType: 'image/png'
        };
        attachments.push(inlineAttachment);
        console.log(`Inline attachment added: ${inlineAttachment.filename}, buffer length: ${inlineAttachment.content.length}`);

        // Also attach as regular downloadable attachment
        const downloadAttachment = {
          filename: `QRCode-${notification.data.reservationNumber}.png`,
          content: qrImageBuffer,
          contentType: 'image/png'
        };
        attachments.push(downloadAttachment);
        console.log(`Download attachment added: ${downloadAttachment.filename}, buffer length: ${downloadAttachment.content.length}`);

        // Add flag to email data so template knows QR code is available
        emailData.qrCodeImage = true;

        console.log(`QR code attached to email (${qrImageBuffer.length} bytes) for reservation ${notification.data.reservationNumber}`);
        console.log(`Attachments array now has ${attachments.length} items`);
      } catch (qrError) {
        console.error('Failed to generate QR code for email:', qrError.message);
        console.error('QR code error stack:', qrError.stack);
        // Continue sending email even if QR code generation fails
      }
    }

    // Get email HTML from template (after QR code generation to include qrCodeImage flag)
    const html = await getEmailTemplate(notification.type, emailData);

    console.log(`After getEmailTemplate, attachments array has ${attachments.length} items`);
    if (attachments.length > 0) {
      console.log(`First attachment content is Buffer: ${Buffer.isBuffer(attachments[0].content)}, length: ${attachments[0].content?.length || 'undefined'}`);
    }

    // Send email
    const recipientEmail = notification.recipientEmail || 
                          notification.recipient?.email || 
                          notification.emailData?.to;
    
    console.log(`Sending email with ${attachments.length} attachments`);
    if (attachments.length > 0) {
      attachments.forEach((att, idx) => {
        const contentLength = Buffer.isBuffer(att.content) ? att.content.length : (att.content?.length || 0);
        console.log(`Attachment ${idx}: ${att.filename}, content size: ${contentLength} bytes, cid: ${att.cid || 'none'}, isBuffer: ${Buffer.isBuffer(att.content)}`);
      });
    }
    
    const result = await sendEmail(
      recipientEmail,
      subject,
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
 * Get subject line based on notification type
 */
const getSubjectForType = (type, data) => {
  const subjects = {
    RESERVATION_CREATED: `Reservation Created - ${data?.reservationNumber || 'New Booking'}`,
    RESERVATION_APPROVED: `Reservation Approved - ${data?.reservationNumber || ''}`,
    RESERVATION_REJECTED: `Reservation Rejected - ${data?.reservationNumber || ''}`,
    RESERVATION_CONFIRMED: `Booking Confirmed - ${data?.stallNumber || data?.reservationNumber || 'Your Stall'}`,
    RESERVATION_CANCELLED: `Reservation Cancelled - ${data?.reservationNumber || ''}`,
    PAYMENT_REMINDER: `Payment Reminder - ${data?.reservationNumber || ''}`,
    RESERVATION_REMINDER: `Upcoming Event Reminder - ${data?.reservationNumber || ''}`,
    QR_CODE_SENT: `Your QR Code - ${data?.reservationNumber || ''}`,
  };
  
  return subjects[type] || 'Bookfair Notification';
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
