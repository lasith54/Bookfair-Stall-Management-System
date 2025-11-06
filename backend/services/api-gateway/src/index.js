require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { generalLimiter, authLimiter } = require('./middleware/rateLimiter');
const services = require('./config/services');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Logging

// Apply general rate limiter to all routes
app.use(generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Gateway is running',
    timestamp: new Date().toISOString(),
    services: {
      auth: services.auth.url,
      stall: services.stall.url,
      reservation: services.reservation.url,
      notification: services.notification.url,
    },
  });
});

// Service status check
app.get('/api/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'All services configuration',
    services: Object.keys(services).map(key => ({
      name: key,
      url: services[key].url,
      path: services[key].path,
    })),
  });
});

// Auth Service Proxy
app.use(
  '/api/auth',
  authLimiter,
  createProxyMiddleware({
    target: services.auth.url,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Auth Service] ${req.method} ${req.path}`);
      
      // Re-stream the body if it was parsed by express.json()
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onError: (err, req, res) => {
      console.error('Auth Service Error:', err.message);
      res.status(503).json({
        success: false,
        message: 'Auth service is currently unavailable',
        error: err.message,
      });
    },
  })
);

// Stall Service Proxy (will be implemented in Phase 2)
app.use(
  '/api/stalls',
  createProxyMiddleware({
    target: services.stall.url,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Stall Service] ${req.method} ${req.path}`);
    },
    onError: (err, req, res) => {
      console.error('Stall Service Error:', err.message);
      res.status(503).json({
        success: false,
        message: 'Stall service is currently unavailable',
        error: err.message,
      });
    },
  })
);

// Reservation Service Proxy (will be implemented in Phase 3)
app.use(
  '/api/reservations',
  createProxyMiddleware({
    target: services.reservation.url,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Reservation Service] ${req.method} ${req.path}`);
    },
    onError: (err, req, res) => {
      console.error('Reservation Service Error:', err.message);
      res.status(503).json({
        success: false,
        message: 'Reservation service is currently unavailable',
        error: err.message,
      });
    },
  })
);

// Notification Service Proxy (will be implemented in Phase 4)
app.use(
  '/api/notifications',
  createProxyMiddleware({
    target: services.notification.url,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Notification Service] ${req.method} ${req.path}`);
    },
    onError: (err, req, res) => {
      console.error('Notification Service Error:', err.message);
      res.status(503).json({
        success: false,
        message: 'Notification service is currently unavailable',
        error: err.message,
      });
    },
  })
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Gateway Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log('\n📡 Service Routes:');
  console.log(`   Auth: ${services.auth.path} -> ${services.auth.url}`);
  console.log(`   Stall: ${services.stall.path} -> ${services.stall.url}`);
  console.log(`   Reservation: ${services.reservation.path} -> ${services.reservation.url}`);
  console.log(`   Notification: ${services.notification.path} -> ${services.notification.url}`);
});

module.exports = app;
