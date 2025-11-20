const Notification = require('../models/Notification');
const QRCode = require('../models/QRCode');
const { sendNotificationEmail } = require('../services/emailService');

/**
 * Process pending notifications
 */
const processPendingNotifications = async () => {
  try {
    console.log('[Scheduler] Processing pending notifications...');

    const pendingNotifications = await Notification.getPending();

    let processedCount = 0;
    let failedCount = 0;

    for (const notification of pendingNotifications) {
      try {
        await sendNotificationEmail(notification);
        processedCount++;
      } catch (error) {
        console.error(`[Scheduler] Failed to send notification ${notification._id}:`, error.message);
        failedCount++;
      }
    }

    console.log(`[Scheduler] Processed ${processedCount} notifications, ${failedCount} failed`);
  } catch (error) {
    console.error('[Scheduler] Error processing pending notifications:', error);
  }
};

/**
 * Cleanup expired QR codes
 */
const cleanupExpiredQRCodes = async () => {
  try {
    console.log('[Scheduler] Cleaning up expired QR codes...');

    const result = await QRCode.cleanupExpired();

    console.log(`[Scheduler] Cleaned up ${result.modifiedCount} expired QR codes`);
  } catch (error) {
    console.error('[Scheduler] Error cleaning up QR codes:', error);
  }
};

/**
 * Send payment reminders
 */
const sendPaymentReminders = async () => {
  try {
    console.log('[Scheduler] Sending payment reminders...');
    
    const axios = require('axios');
    
    // Get approved reservations with payment deadline approaching
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    
    const response = await axios.get(
      `${process.env.RESERVATION_SERVICE_URL}/api/admin/reservations`,
      {
        params: {
          status: 'APPROVED',
        },
      }
    );

    const reservations = response.data.data.reservations || [];
    
    let remindersSent = 0;

    for (const reservation of reservations) {
      const paymentDeadline = new Date(reservation.paymentDeadline);
      const now = new Date();
      
      // Send reminder if payment deadline is within 2 days
      if (paymentDeadline > now && paymentDeadline <= twoDaysFromNow) {
        // Check if reminder already sent today
        const existingReminder = await Notification.findOne({
          reservation: reservation._id,
          type: 'PAYMENT_REMINDER',
          createdAt: {
            $gte: new Date(now.setHours(0, 0, 0, 0)),
          },
        });

        if (!existingReminder) {
          const daysRemaining = Math.ceil((paymentDeadline - now) / (1000 * 60 * 60 * 24));
          
          await Notification.create({
            type: 'PAYMENT_REMINDER',
            recipient: reservation.user,
            reservation: reservation._id,
            channel: 'EMAIL',
            subject: 'Payment Reminder - Action Required',
            message: `Your payment for reservation ${reservation.reservationNumber} is due in ${daysRemaining} day(s).`,
            emailData: {
              to: reservation.user.email,
            },
            metadata: {
              daysRemaining,
              paymentDeadline: reservation.paymentDeadline,
            },
            priority: 'HIGH',
          });
          
          remindersSent++;
        }
      }
    }

    console.log(`[Scheduler] Sent ${remindersSent} payment reminders`);
  } catch (error) {
    console.error('[Scheduler] Error sending payment reminders:', error.message);
  }
};

/**
 * Send reservation reminders
 */
const sendReservationReminders = async () => {
  try {
    console.log('[Scheduler] Sending reservation reminders...');
    
    const axios = require('axios');
    
    // Get confirmed reservations starting in 3 days
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const fourDaysFromNow = new Date();
    fourDaysFromNow.setDate(fourDaysFromNow.getDate() + 4);
    
    const response = await axios.get(
      `${process.env.RESERVATION_SERVICE_URL}/api/admin/reservations`,
      {
        params: {
          status: 'CONFIRMED',
        },
      }
    );

    const reservations = response.data.data.reservations || [];
    
    let remindersSent = 0;

    for (const reservation of reservations) {
      const startDate = new Date(reservation.startDate);
      
      // Send reminder if start date is in 3 days
      if (startDate >= threeDaysFromNow && startDate < fourDaysFromNow) {
        // Check if reminder already sent
        const existingReminder = await Notification.findOne({
          reservation: reservation._id,
          type: 'RESERVATION_REMINDER',
        });

        if (!existingReminder) {
          const daysUntilStart = Math.ceil((startDate - new Date()) / (1000 * 60 * 60 * 24));
          
          await Notification.create({
            type: 'RESERVATION_REMINDER',
            recipient: reservation.user,
            reservation: reservation._id,
            channel: 'EMAIL',
            subject: 'Upcoming Reservation Reminder',
            message: `Your stall reservation ${reservation.reservationNumber} starts in ${daysUntilStart} day(s).`,
            emailData: {
              to: reservation.user.email,
            },
            metadata: {
              daysUntilStart,
            },
            priority: 'NORMAL',
          });
          
          remindersSent++;
        }
      }
    }

    console.log(`[Scheduler] Sent ${remindersSent} reservation reminders`);
  } catch (error) {
    console.error('[Scheduler] Error sending reservation reminders:', error.message);
  }
};

module.exports = {
  processPendingNotifications,
  cleanupExpiredQRCodes,
  sendPaymentReminders,
  sendReservationReminders,
};
