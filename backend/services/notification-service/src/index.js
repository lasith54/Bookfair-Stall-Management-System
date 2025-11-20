require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');

// Routes
const notificationRoutes = require('./routes/notificationRoutes');
const preferenceRoutes = require('./routes/preferenceRoutes');
const qrcodeRoutes = require('./routes/qrcodeRoutes');
const adminNotificationRoutes = require('./routes/adminNotificationRoutes');
const adminQRCodeRoutes = require('./routes/adminQRCodeRoutes');

// Scheduler
const {
  processPendingNotifications,
  cleanupExpiredQRCodes,
  sendPaymentReminders,
  sendReservationReminders,
} = require('./jobs/scheduler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Notification Service',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/notifications', notificationRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/qrcodes', qrcodeRoutes);
app.use('/api/admin/notifications', adminNotificationRoutes);
app.use('/api/admin/qrcodes', adminQRCodeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 3004;

const server = app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Start scheduled jobs
  startScheduledJobs();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

/**
 * Start scheduled jobs using setInterval
 */
function startScheduledJobs() {
  console.log('[Scheduler] Starting scheduled jobs...');

  // Process pending notifications every 1 minute
  setInterval(processPendingNotifications, 60 * 1000);

  // Cleanup expired QR codes every hour
  setInterval(cleanupExpiredQRCodes, 60 * 60 * 1000);

  // Send payment reminders every 6 hours
  setInterval(sendPaymentReminders, 6 * 60 * 60 * 1000);

  // Send reservation reminders daily at 9 AM (runs every hour, checks time)
  setInterval(() => {
    const now = new Date();
    if (now.getHours() === 9 && now.getMinutes() < 60) {
      sendReservationReminders();
    }
  }, 60 * 60 * 1000);

  console.log('[Scheduler] All scheduled jobs started');

  // Run immediately on startup
  setTimeout(() => {
    processPendingNotifications();
    cleanupExpiredQRCodes();
  }, 5000);
}

module.exports = app;
