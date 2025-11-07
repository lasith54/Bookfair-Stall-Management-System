const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const STALL_SERVICE_URL = process.env.STALL_SERVICE_URL || 'http://localhost:3002';
const RESERVATION_SERVICE_URL = process.env.RESERVATION_SERVICE_URL || 'http://localhost:3003';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004';

const services = {
  auth: {
    url: AUTH_SERVICE_URL,
    path: '/api/auth',
  },
  stall: {
    url: STALL_SERVICE_URL,
    path: '/api/stalls',
  },
  reservation: {
    url: RESERVATION_SERVICE_URL,
    path: '/api/reservations',
  },
  notification: {
    url: NOTIFICATION_SERVICE_URL,
    path: '/api/notifications',
  },
};

module.exports = services;
